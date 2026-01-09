import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Fetch ticket type with event details
    const { data: ticketType, error } = await supabase
      .from('ticket_types')
      .select(
        `
        id,
        name,
        description,
        price_in_kobo,
        event_id,
        events (
          id,
          title,
          event_date,
          location
        )
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Ticket type not found' }, { status: 404 });
    }

    if (!ticketType) {
      return NextResponse.json({ error: 'Ticket type not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: ticketType.id,
      name: ticketType.name,
      description: ticketType.description,
      price_in_kobo: ticketType.price_in_kobo,
      event_id: ticketType.event_id,
      event: ticketType.events,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
