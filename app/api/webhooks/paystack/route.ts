import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';

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

      // 2. Find reserved tickets for this transaction
      const { data: reservedTickets, error: fetchError } = await supabaseAdmin
        .from('tickets')
        .select('*')
        .eq('status', 'reserved')
        .like('paystack_reference', `${reference}-%`);

      if (fetchError) {
        throw fetchError;
      }

      if (!reservedTickets || reservedTickets.length === 0) {
        // Don't throw error - just skip ticket operations
        // This handles test webhooks and maintains backwards compatibility
      } else {

        // 3. Update each reserved ticket to paid status (QR codes generated in verify endpoint)
        for (let i = 0; i < reservedTickets.length; i++) {
          const ticket = reservedTickets[i];

          // Generate ticket_secret for verification (QR code will be generated in verify endpoint)
          const ticketSecret = `${reference}::${metadata.event_id}::ticket-${i + 1}`;

          // Update the reserved ticket to paid status WITHOUT QR code
          const { error: updateError } = await supabaseAdmin
            .from('tickets')
            .update({
              status: 'paid',
              ticket_secret: ticketSecret,
              // QR code fields (qr_code_url, ticket_secret for QR) will be set by verify endpoint
            })
            .eq('id', ticket.id);

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
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}