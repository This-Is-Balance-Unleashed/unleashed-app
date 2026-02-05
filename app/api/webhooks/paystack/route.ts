import { NextResponse, after } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';
import { sendTicketConfirmationEmail } from '@/lib/mailerlite';

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-paystack-signature');
    const body = await request.text();

    // 1. Verify Signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === 'charge.success') {
      const { metadata, reference, amount, customer } = event.data;

      // Check if this is a test transaction
      const isTestTransaction = reference.startsWith('test_');

      // Get quantity from metadata (default to 1 if not provided for backwards compatibility)
      const quantity = metadata.quantity || 1;

      // Check if this is a group booking
      const isGroupBooking = metadata.booking_type && metadata.group_booking_id;

      // Variable to store tickets for email sending
      let reservedTickets: any[] | null = null;

      // Handle group bookings differently
      if (isGroupBooking) {
        // 2a. Update group booking status to paid
        const { error: updateGroupError } = await supabaseAdmin
          .from('group_bookings')
          .update({ status: 'paid' })
          .eq('id', metadata.group_booking_id);

        if (updateGroupError) {
          throw updateGroupError;
        }

        // 2b. Create individual tickets for the group
        const ticketsToCreate = [];
        for (let i = 0; i < quantity; i++) {
          const ticketSecret = `${reference}::${metadata.event_id}::ticket-${i + 1}`;

          ticketsToCreate.push({
            event_id: metadata.event_id,
            ticket_type_id: metadata.ticket_type_id,
            email: customer.email,
            name: metadata.primary_contact || customer.email.split('@')[0],
            paystack_reference: `${reference}-${i + 1}`,
            status: 'paid',
            ticket_secret: ticketSecret,
            price_paid: Math.round(amount / quantity),
            group_booking_id: metadata.group_booking_id,
          });
        }

        const { data: createdTickets, error: createError } = await supabaseAdmin
          .from('tickets')
          .insert(ticketsToCreate)
          .select();

        if (createError) {
          throw createError;
        }

        reservedTickets = createdTickets;
      } else {
        // 2. Find reserved tickets for this transaction (regular tickets)
        const { data: foundTickets, error: fetchError } = await supabaseAdmin
          .from('tickets')
          .select('*')
          .eq('status', 'reserved')
          .like('paystack_reference', `${reference}-%`);

        if (fetchError) {
          throw fetchError;
        }

        if (!foundTickets || foundTickets.length === 0) {
          // Don't throw error - just skip ticket operations
          // This handles test webhooks and maintains backwards compatibility
        } else {
          reservedTickets = foundTickets;

          // 3. Update all reserved tickets to paid status in parallel (QR codes generated in verify endpoint)
          const ticketUpdatePromises = reservedTickets.map((ticket, i) => {
          // Generate ticket_secret for verification (QR code will be generated in verify endpoint)
          const ticketSecret = `${reference}::${metadata.event_id}::ticket-${i + 1}`;

          // Update the reserved ticket to paid status WITHOUT QR code
          return supabaseAdmin
            .from('tickets')
            .update({
              status: 'paid',
              ticket_secret: ticketSecret,
              // QR code fields (qr_code_url, ticket_secret for QR) will be set by verify endpoint
            })
            .eq('id', ticket.id);
        });

          const updateResults = await Promise.all(ticketUpdatePromises);
          const updateError = updateResults.find(result => result.error)?.error;
          if (updateError) {
            throw updateError;
          }
        }
      }

      // 7. Increment coupon usage if a coupon was used (skip for test transactions)
      if (metadata.coupon_id && !isTestTransaction) {
        const { error: couponError } = await supabaseAdmin
          .rpc('increment_coupon_usage', { coupon_uuid: metadata.coupon_id });

        if (couponError) {
          // Don't throw - ticket is already created
        }
      }

      // 8. Increment ticket type sold quantity by the quantity purchased (skip for test transactions)
      if (metadata.ticket_type_id && !isTestTransaction) {
        const { error: ticketTypeError } = await supabaseAdmin
          .rpc('increment_ticket_sold', {
            ticket_type_uuid: metadata.ticket_type_id,
            increment_by: quantity
          });

        if (ticketTypeError) {
          // Don't throw - ticket is already created
        }
      }

      // 9. Send confirmation email with ticket links (non-blocking using after())
      if (reservedTickets && reservedTickets.length > 0) {
        // Capture values needed for email sending
        const ticketsForEmail = [...reservedTickets];
        const emailMetadata = { ...metadata };
        const emailCustomer = { ...customer };
        const emailAmount = amount;
        const emailReference = reference;

        after(async () => {
          try {
            // Fetch event and ticket type details for email in parallel
            const [eventResult, ticketTypeResult] = await Promise.all([
              supabaseAdmin
                .from('events')
                .select('title')
                .eq('id', emailMetadata.event_id)
                .single(),
              supabaseAdmin
                .from('ticket_types')
                .select('name')
                .eq('id', emailMetadata.ticket_type_id)
                .single(),
            ]);

            const { data: eventData } = eventResult;
            const { data: ticketTypeData } = ticketTypeResult;

            // Get the base URL from environment or construct it
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hit-refresh.balanceunleashed.org';

            // Build ticket info array with URLs
            const ticketInfo = ticketsForEmail.map((ticket, index) => ({
              id: ticket.id,
              ticketNumber: index + 1,
              ticketUrl: `${baseUrl}/tickets/${ticket.id}`,
            }));

            // Get customer name from the first ticket
            const customerName = ticketsForEmail[0].name || emailCustomer.email.split('@')[0];

            await sendTicketConfirmationEmail({
              to: emailCustomer.email,
              customerName,
              eventTitle: eventData?.title || 'Hit Refresh Summit',
              ticketTypeName: ticketTypeData?.name || 'General Admission',
              tickets: ticketInfo,
              totalAmount: emailAmount,
              reference: emailReference.split('-')[0], // Remove ticket number suffix
            });
          } catch (emailError) {
            // Don't throw - ticket is already created, just log email failure
            // In production, you might want to queue this for retry
            console.error('Failed to send confirmation email:', emailError);
          }
        });
      }
    }

    return NextResponse.json({ received: true });

  } catch {
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}