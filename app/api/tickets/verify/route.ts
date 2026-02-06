import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import QRCode from "qrcode";

// Helper function for payment verification
async function handlePaymentVerification(reference: string) {
  try {
    // Verify payment with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    const paystackData = await paystackResponse.json();

    if (!paystackData.status || paystackData.data.status !== "success") {
      return NextResponse.json(
        { success: false, error: "Payment verification failed" },
        { status: 400 },
      );
    }

    const paymentData = paystackData.data;
    const metadata = paymentData.metadata;
    // For group bookings, 'quantity' in metadata might refer to number of packages,
    // while 'total_members' refers to actual tickets to generate.
    // Fallback to 1 if neither exists.
    const quantity = metadata.total_members ? parseInt(metadata.total_members) : (metadata.quantity || 1);

    // Check if this is a group booking
    const isGroupBooking = metadata.booking_type && metadata.group_booking_id;
    console.log('Verify payment for reference:', reference);
    console.log('Metadata:', { booking_type: metadata.booking_type, group_booking_id: metadata.group_booking_id, isGroupBooking });

    // Find tickets for this transaction (both reserved AND paid - webhook may have already updated status)
    let { data: allTickets, error: fetchError } = await supabaseAdmin
      .from("tickets")
      .select("*")
      .in("status", ["reserved", "paid"])
      .like("paystack_reference", `${reference}-%`);

    if (fetchError) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch tickets" },
        { status: 500 },
      );
    }

    // For group bookings, if tickets don't exist yet, wait and retry
    if (isGroupBooking && (!allTickets || allTickets.length === 0)) {
      console.log('Group booking detected, no tickets found yet. Checking group_bookings table...');

      // Check if group booking exists
      // NOTE: We don't check for status='paid' here because the webhook might be slightly delayed in updating status,
      // but the record should exist.
      const { data: groupBooking, error: gbError } = await supabaseAdmin
        .from("group_bookings")
        .select("*")
        .eq("booking_reference", reference)
        .single();

      console.log('Group booking query result:', { groupBooking, gbError });

      // If group booking exists, we can assume payment was successful (since Paystack verified it)
      // and we just need to wait for webhook to create tickets
      if (groupBooking) {
        console.log('Group booking found. Payment verified by Paystack. Waiting for webhook to create tickets...');

        // Wait a bit longer - webhook needs time to create multiple tickets
        let retries = 3;
        while (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s
          
          const { data: retryTickets } = await supabaseAdmin
            .from("tickets")
            .select("*")
            .in("status", ["reserved", "paid"])
            .like("paystack_reference", `${reference}-%`);
            
          console.log(`Retry ${4 - retries} tickets result:`, { count: retryTickets?.length });
          
          if (retryTickets && retryTickets.length > 0) {
             allTickets = retryTickets;
             console.log('Tickets found on retry!');
             break;
          }
          retries--;
        }

        if (!allTickets || allTickets.length === 0) {
          // Still no tickets, force ticket creation here if webhook failed/delayed
          console.log('Still no tickets after retries. Forcing ticket creation...');
          
          // Update group booking status
          await supabaseAdmin
            .from('group_bookings')
            .update({ status: 'paid' })
            .eq('id', groupBooking.id);
            
          // Create tickets manually
          const ticketsToCreate = [];
          const ticketQuantity = metadata.total_members ? parseInt(metadata.total_members) : (metadata.quantity || 1);
          const amount = paymentData.amount;
          const customer = paymentData.customer;
          
          for (let i = 0; i < ticketQuantity; i++) {
            const ticketSecret = `${reference}::${metadata.event_id}::ticket-${i + 1}`;

            ticketsToCreate.push({
              event_id: metadata.event_id,
              ticket_type_id: metadata.ticket_type_id,
              email: customer.email,
              name: metadata.primary_contact || customer.email?.split('@')[0] || 'Guest',
              paystack_reference: `${reference}-${i + 1}`,
              status: 'paid',
              ticket_secret: ticketSecret,
              price_paid: Math.round(amount / ticketQuantity),
              group_booking_id: groupBooking.id,
            });
          }

          const { data: createdTickets, error: createError } = await supabaseAdmin
            .from('tickets')
            .insert(ticketsToCreate)
            .select();
            
          if (!createError && createdTickets) {
             allTickets = createdTickets;
             console.log('Successfully force-created tickets:', createdTickets.length);
          } else {
             console.error('Failed to force create tickets:', createError);
          }
        }
      } else {
        console.log('Group booking record not found');
      }
    }

    if (!allTickets || allTickets.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No tickets found. Tickets should be created during purchase.",
        },
        { status: 404 },
      );
    }

    // Check if ALL tickets already have QR codes (already fully processed)
    const allHaveQR = allTickets.every((ticket) => ticket.qr_code_url);
    if (allHaveQR) {
      // Return all ticket details
      const { data: allTicketDetails } = await supabaseAdmin
        .from("tickets")
        .select(
          `
          id,
          email,
          name,
          price_paid,
          qr_code_url,
          paystack_reference,
          created_at,
          events (title),
          ticket_types (name)
        `,
        )
        .in(
          "id",
          allTickets.map((t) => t.id),
        );

      // Calculate total amount paid across all tickets
      const totalAmountPaid =
        allTicketDetails?.reduce((sum, ticket) => sum + ticket.price_paid, 0) ||
        0;

      return NextResponse.json({
        success: true,
        tickets_count: allTickets.length,
        total_amount_paid: totalAmountPaid,
        tickets: allTicketDetails?.map((ticket) => ({
          id: ticket.id,
          email: ticket.email,
          name: ticket.name,
          // @ts-expect-error need to debug the return data shape for proper typing
          event_title: ticket.events.title,
          // @ts-expect-error need to debug the return data shape for proper typing
          ticket_type_name: ticket.ticket_types.name,
          amount_paid: ticket.price_paid,
          qr_code_url: ticket.qr_code_url,
          payment_reference: ticket.paystack_reference,
          created_at: ticket.created_at,
        })),
        // Keep single ticket for backwards compatibility
        ticket:
          allTicketDetails && allTicketDetails.length > 0
            ? {
                id: allTicketDetails[0].id,
                email: allTicketDetails[0].email,
                name: allTicketDetails[0].name,
                // @ts-expect-error need to debug the return data shape for proper typing
                event_title: allTicketDetails[0].events.title,
                // @ts-expect-error need to debug the return data shape for proper typing
                ticket_type_name: allTicketDetails[0].ticket_types.name,
                amount_paid: allTicketDetails[0].price_paid,
                payment_reference: allTicketDetails[0].paystack_reference,
                created_at: allTicketDetails[0].created_at,
              }
            : null,
      });
    }

    // Build index map upfront for O(1) lookups (avoids O(n²) findIndex in loop)
    const ticketIndexMap = new Map(allTickets.map((t, idx) => [t.id, idx]));

    // Single-pass partition of tickets (avoids iterating twice with separate filters)
    const ticketsNeedingQR: typeof allTickets = [];
    const ticketsWithQR: typeof allTickets = [];
    for (const ticket of allTickets) {
      if (ticket.qr_code_url) {
        ticketsWithQR.push(ticket);
      } else {
        ticketsNeedingQR.push(ticket);
      }
    }

    // Generate QR codes for all tickets that need them in parallel
    const qrGenerationPromises = ticketsNeedingQR.map(async (ticket) => {
      const originalIndex = ticketIndexMap.get(ticket.id) ?? 0;

      // Generate a Secure Unique String for each Ticket
      const ticketSecret =
        ticket.ticket_secret ||
        `${reference}::${metadata.event_id}::ticket-${originalIndex + 1}`;

      // Generate QR Code
      const qrCodeBuffer = await QRCode.toBuffer(ticketSecret, {
        errorCorrectionLevel: "H",
        type: "png",
        width: 400,
        margin: 2,
      });

      // Upload to Supabase Storage
      const filePath = `${metadata.user_id || paymentData.customer.email}/${reference}-ticket-${originalIndex + 1}.png`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from("qr-codes")
        .upload(filePath, qrCodeBuffer, {
          contentType: "image/png",
          upsert: true,
        });

      if (uploadError) {
        throw new Error("Failed to generate QR code");
      }

      // Get the Public URL
      const {
        data: { publicUrl },
      } = supabaseAdmin.storage.from("qr-codes").getPublicUrl(filePath);

      // Update the ticket with QR code (status already 'paid' from webhook)
      const { error: updateError } = await supabaseAdmin
        .from("tickets")
        .update({
          status: "paid",
          qr_code_url: publicUrl,
          ticket_secret: ticketSecret,
        })
        .eq("id", ticket.id);

      if (updateError) {
        throw new Error("Failed to update ticket");
      }

      return ticket;
    });

    let updatedTickets = allTickets;
    try {
      const processedTickets = await Promise.all(qrGenerationPromises);
      updatedTickets = [...ticketsWithQR, ...processedTickets];
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to process tickets",
        },
        { status: 500 },
      );
    }

    const qrCodesGenerated = ticketsNeedingQR.length;

    // Check if this is a test transaction (skip inventory updates)
    const isTestTransaction = reference.startsWith("test_");

    // Update coupon usage and ticket sold quantity in parallel (skip for test transactions)
    if (!isTestTransaction) {
      const inventoryUpdates = [];

      // Update coupon usage if applicable
      if (metadata.coupon_id) {
        inventoryUpdates.push(
          supabaseAdmin
            .rpc("increment_coupon_usage", {
              coupon_uuid: metadata.coupon_id,
            })
            .then(),
        );
      }

      // Update ticket sold quantity
      inventoryUpdates.push(
        supabaseAdmin
          .rpc("increment_ticket_sold", {
            ticket_type_uuid: metadata.ticket_type_id,
            increment_by: quantity,
          })
          .then(),
      );

      await Promise.all(inventoryUpdates);
    }

    // Fetch complete details for ALL tickets
    const { data: allTicketDetails } = await supabaseAdmin
      .from("tickets")
      .select(
        `
        id,
        email,
        name,
        price_paid,
        qr_code_url,
        paystack_reference,
        created_at,
        events (title),
        ticket_types (name)
      `,
      )
      .in(
        "id",
        updatedTickets.map((t) => t.id),
      );

    // Calculate total amount paid across all tickets
    const totalAmountPaid =
      allTicketDetails?.reduce((sum, ticket) => sum + ticket.price_paid, 0) ||
      0;

    return NextResponse.json({
      success: true,
      tickets_count: updatedTickets.length,
      total_amount_paid: totalAmountPaid,
      tickets: allTicketDetails?.map((ticket) => ({
        id: ticket.id,
        email: ticket.email,
        name: ticket.name,
        // @ts-expect-error Supabase types need refinement for nested relations
        event_title: ticket.events?.title,
        // @ts-expect-error Supabase types need refinement for nested relations
        ticket_type_name: ticket.ticket_types?.name,
        amount_paid: ticket.price_paid,
        qr_code_url: ticket.qr_code_url,
        payment_reference: ticket.paystack_reference,
        created_at: ticket.created_at,
      })),
      // Keep single ticket for backwards compatibility
      ticket:
        allTicketDetails && allTicketDetails.length > 0
          ? {
              id: allTicketDetails[0].id,
              email: allTicketDetails[0].email,
              name: allTicketDetails[0].name,
              // @ts-expect-error Supabase types need refinement for nested relations
              event_title: allTicketDetails[0].events?.title,
              // @ts-expect-error Supabase types need refinement for nested relations
              ticket_type_name: allTicketDetails[0].ticket_types?.name,
              amount_paid: allTicketDetails[0].price_paid,
              payment_reference: allTicketDetails[0].paystack_reference,
              created_at: allTicketDetails[0].created_at,
            }
          : null,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticket_secret } = body;

    if (!ticket_secret) {
      return NextResponse.json(
        { error: "Ticket secret is required" },
        { status: 400 },
      );
    }

    // Find ticket by secret
    const { data: ticket, error: ticketError } = await supabaseAdmin
      .from("tickets")
      .select(
        `
        *,
        events (
          id,
          title,
          event_date,
          location
        )
      `,
      )
      .eq("ticket_secret", ticket_secret)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json(
        { valid: false, error: "Invalid ticket" },
        { status: 404 },
      );
    }

    // Check if ticket is paid
    if (ticket.status !== "paid") {
      return NextResponse.json(
        {
          valid: false,
          error: "Ticket payment not confirmed",
          ticket: {
            status: ticket.status,
            reference: ticket.paystack_reference,
          },
        },
        { status: 400 },
      );
    }

    // Check if already checked in (status is 'used')
    if (ticket.status === "used" || ticket.checked_in_at) {
      return NextResponse.json({
        valid: true,
        already_checked_in: true,
        checked_in_at: ticket.checked_in_at,
        ticket: {
          id: ticket.id,
          email: ticket.email,
          name: ticket.name,
          status: ticket.status,
          event: ticket.events,
        },
      });
    }

    // Mark as checked in and set status to 'used'
    const { error: updateError } = await supabaseAdmin
      .from("tickets")
      .update({
        status: "used",
        checked_in_at: new Date().toISOString(),
      })
      .eq("id", ticket.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to check in ticket" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      valid: true,
      already_checked_in: false,
      checked_in_at: new Date().toISOString(),
      ticket: {
        id: ticket.id,
        email: ticket.email,
        name: ticket.name,
        status: "used",
        event: ticket.events,
      },
    });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}

// GET endpoint to just check ticket status without checking in OR verify payment
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ticket_secret = searchParams.get("secret");
    const payment_reference = searchParams.get("reference");

    // Handle payment verification flow
    if (payment_reference) {
      return handlePaymentVerification(payment_reference);
    }

    // Handle ticket check flow
    if (!ticket_secret) {
      return NextResponse.json(
        { error: "Ticket secret or payment reference is required" },
        { status: 400 },
      );
    }

    // Find ticket by secret
    const { data: ticket, error: ticketError } = await supabaseAdmin
      .from("tickets")
      .select(
        `
        *,
        events (
          id,
          title,
          event_date,
          location
        )
      `,
      )
      .eq("ticket_secret", ticket_secret)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json(
        { valid: false, error: "Invalid ticket" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      valid: true,
      ticket: {
        id: ticket.id,
        email: ticket.email,
        name: ticket.name,
        status: ticket.status,
        checked_in: !!ticket.checked_in_at,
        checked_in_at: ticket.checked_in_at,
        qr_code_url: ticket.qr_code_url,
        event: ticket.events,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to check ticket" },
      { status: 500 },
    );
  }
}
