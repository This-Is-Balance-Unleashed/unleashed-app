import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import QRCode from 'qrcode';

// Helper function for payment verification
async function handlePaymentVerification(reference: string) {
  try {
    // Verify payment with Paystack
    const paystackResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const paystackData = await paystackResponse.json();

    if (!paystackData.status || paystackData.data.status !== 'success') {
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    const paymentData = paystackData.data;
    const metadata = paymentData.metadata;

    // Check if ticket already exists
    const { data: existingTicket } = await supabaseAdmin
      .from('tickets')
      .select('*')
      .eq('paystack_reference', reference)
      .single();

    if (existingTicket) {
      // Return existing ticket
      const { data: ticketDetails } = await supabaseAdmin
        .from('tickets')
        .select(
          `
          id,
          email,
          price_paid,
          paystack_reference,
          created_at,
          events (title),
          ticket_types (name)
        `
        )
        .eq('id', existingTicket.id)
        .single();

      return NextResponse.json({
        success: true,
        ticket: {
          id: ticketDetails!.id,
          email: ticketDetails!.email,
          event_title: ticketDetails!.events.title,
          ticket_type_name: ticketDetails!.ticket_types.name,
          amount_paid: ticketDetails!.price_paid,
          payment_reference: ticketDetails!.paystack_reference,
          created_at: ticketDetails!.created_at,
        },
      });
    }

    // Create new ticket
    const { data: newTicket, error: ticketError } = await supabaseAdmin
      .from('tickets')
      .insert({
        email: paymentData.customer.email,
        event_id: metadata.event_id,
        ticket_type_id: metadata.ticket_type_id,
        user_id: metadata.user_id || null,
        price_paid: paymentData.amount,
        paystack_reference: reference,
        status: 'paid',
        coupon_id: metadata.coupon_id || null,
      })
      .select()
      .single();

    if (ticketError) {
      console.error('Ticket creation error:', ticketError);
      return NextResponse.json(
        { success: false, error: 'Failed to create ticket' },
        { status: 500 }
      );
    }

    // Generate QR code for ticket
    const qrCodeBuffer = await QRCode.toBuffer(newTicket.id, {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 512,
      margin: 2,
    });

    // Upload QR code to Supabase Storage
    const qrFileName = `${newTicket.id}.png`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('qr-codes')
      .upload(qrFileName, qrCodeBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadError) {
      console.error('QR code upload error:', uploadError);
    }

    // Get public URL for QR code
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('qr-codes')
      .getPublicUrl(qrFileName);

    // Update ticket with ticket_secret and qr_code_url
    await supabaseAdmin
      .from('tickets')
      .update({ 
        ticket_secret: newTicket.id,
        qr_code_url: publicUrl,
      })
      .eq('id', newTicket.id);

    // Update coupon usage if applicable
    if (metadata.coupon_id) {
      const { error: couponError } = await supabaseAdmin.rpc('increment_coupon_usage', {
        coupon_uuid: metadata.coupon_id
      });
      if (couponError) console.error('Coupon update error:', couponError);
    }

    // Update ticket sold quantity
    const { error: soldError } = await supabaseAdmin.rpc('increment_ticket_sold', {
      ticket_type_uuid: metadata.ticket_type_id
    });
    if (soldError) console.error('Sold quantity update error:', soldError);

    // Fetch complete ticket details
    const { data: ticketDetails } = await supabaseAdmin
      .from('tickets')
      .select(
        `
        id,
        email,
        price_paid,
        paystack_reference,
        created_at,
        events (title),
        ticket_types (name)
      `
      )
      .eq('id', newTicket.id)
      .single();

    return NextResponse.json({
      success: true,
      ticket: {
        id: ticketDetails!.id,
        email: ticketDetails!.email,
        event_title: ticketDetails!.events.title,
        ticket_type_name: ticketDetails!.ticket_types.name,
        amount_paid: ticketDetails!.price_paid,
        payment_reference: ticketDetails!.paystack_reference,
        created_at: ticketDetails!.created_at,
      },
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticket_secret } = body;

    if (!ticket_secret) {
      return NextResponse.json(
        { error: 'Ticket secret is required' },
        { status: 400 }
      );
    }

    // Find ticket by secret
    const { data: ticket, error: ticketError } = await supabaseAdmin
      .from('tickets')
      .select(`
        *,
        events (
          id,
          title,
          event_date,
          location
        )
      `)
      .eq('ticket_secret', ticket_secret)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json(
        { valid: false, error: 'Invalid ticket' },
        { status: 404 }
      );
    }

    // Check if ticket is paid
    if (ticket.status !== 'paid') {
      return NextResponse.json(
        {
          valid: false,
          error: 'Ticket payment not confirmed',
          ticket: {
            status: ticket.status,
            reference: ticket.paystack_reference
          }
        },
        { status: 400 }
      );
    }

    // Check if already checked in (status is 'used')
    if (ticket.status === 'used' || ticket.checked_in_at) {
      return NextResponse.json(
        {
          valid: true,
          already_checked_in: true,
          checked_in_at: ticket.checked_in_at,
          ticket: {
            id: ticket.id,
            email: ticket.email,
            name: ticket.name,
            status: ticket.status,
            event: ticket.events
          }
        }
      );
    }

    // Mark as checked in and set status to 'used'
    const { error: updateError } = await supabaseAdmin
      .from('tickets')
      .update({
        status: 'used',
        checked_in_at: new Date().toISOString()
      })
      .eq('id', ticket.id);

    if (updateError) {
      console.error('Check-in update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to check in ticket' },
        { status: 500 }
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
        status: 'used',
        event: ticket.events
      }
    });

  } catch (error) {
    console.error('Ticket verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}

// GET endpoint to just check ticket status without checking in OR verify payment
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ticket_secret = searchParams.get('secret');
    const payment_reference = searchParams.get('reference');

    // Handle payment verification flow
    if (payment_reference) {
      return handlePaymentVerification(payment_reference);
    }

    // Handle ticket check flow
    if (!ticket_secret) {
      return NextResponse.json(
        { error: 'Ticket secret or payment reference is required' },
        { status: 400 }
      );
    }

    // Find ticket by secret
    const { data: ticket, error: ticketError } = await supabaseAdmin
      .from('tickets')
      .select(`
        *,
        events (
          id,
          title,
          event_date,
          location
        )
      `)
      .eq('ticket_secret', ticket_secret)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json(
        { valid: false, error: 'Invalid ticket' },
        { status: 404 }
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
        event: ticket.events
      }
    });

  } catch (error) {
    console.error('Ticket check error:', error);
    return NextResponse.json(
      { error: 'Failed to check ticket' },
      { status: 500 }
    );
  }
}
