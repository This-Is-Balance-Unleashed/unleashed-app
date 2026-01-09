import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Fetch ticket with event and ticket type details
    const { data: ticket, error } = await supabaseAdmin
      .from('tickets')
      .select(
        `
        id,
        email,
        name,
        status,
        price_paid,
        paystack_reference,
        ticket_secret,
        qr_code_url,
        checked_in_at,
        created_at,
        events (
          id,
          title,
          event_date,
          location
        ),
        ticket_types (
          name,
          description
        )
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: ticket.id,
      email: ticket.email,
      name: ticket.name,
      status: ticket.status,
      price_paid: ticket.price_paid,
      paystack_reference: ticket.paystack_reference,
      ticket_secret: ticket.ticket_secret,
      qr_code_url: ticket.qr_code_url,
      checked_in_at: ticket.checked_in_at,
      created_at: ticket.created_at,
      event: ticket.events,
      ticket_type: ticket.ticket_types,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
