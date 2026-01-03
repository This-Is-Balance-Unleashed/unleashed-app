import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, event_id, ticket_type_id, user_id, coupon_code } = await request.json();

    if (!ticket_type_id) {
      return NextResponse.json({ error: 'Ticket type is required' }, { status: 400 });
    }

    // 1. Fetch Ticket Type and Event Info
    const { data: ticketType } = await supabaseAdmin
      .from('ticket_types')
      .select('*, events(id, title)')
      .eq('id', ticket_type_id)
      .single();

    if (!ticketType) return NextResponse.json({ error: 'Ticket type not found' }, { status: 404 });

    if (!ticketType.is_available) {
      return NextResponse.json({ error: 'This ticket type is not available' }, { status: 400 });
    }

    // Check if sold out
    if (ticketType.max_quantity && ticketType.sold_quantity >= ticketType.max_quantity) {
      return NextResponse.json({ error: 'This ticket type is sold out' }, { status: 400 });
    }

    let finalPrice = ticketType.price_in_kobo;
    let validCouponId = null;
    const actualEventId = ticketType.events.id;

    // 2. Coupon Logic (If code provided)
    if (coupon_code) {
      const { data: coupon } = await supabaseAdmin
        .from('coupons')
        .select('*')
        .eq('code', coupon_code.toUpperCase())
        .single();

      // Check Validity
      const now = new Date();
      if (
        !coupon ||
        !coupon.is_active ||
        (coupon.expires_at && new Date(coupon.expires_at) < now) ||
        (coupon.max_uses > 0 && coupon.times_used >= coupon.max_uses) ||
        (coupon.event_id && coupon.event_id !== actualEventId) // Wrong event?
      ) {
        return NextResponse.json({ error: 'Invalid or expired coupon' }, { status: 400 });
      }

      // Apply Discount
      validCouponId = coupon.id;
      if (coupon.discount_type === 'percent') {
        // e.g., 5000 - (5000 * 0.10)
        const discountAmount = finalPrice * (coupon.discount_value / 100);
        finalPrice -= discountAmount;
      } else if (coupon.discount_type === 'fixed') {
        // e.g., 5000 - 1000 (value is in Kobo)
        finalPrice -= coupon.discount_value;
      }

      // Safety check: Price cannot be negative
      if (finalPrice < 0) finalPrice = 0;
    }

    // 3. Initialize Paystack with FINAL calculated price
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(finalPrice), // Ensure integer
        metadata: {
          event_id: actualEventId,
          ticket_type_id,
          user_id,
          coupon_id: validCouponId, // Pass this to Webhook!
        },
        callback_url: `${request.headers.get('origin')}/tickets/success`,
      }),
    });

    const data = await paystackResponse.json();
    if (!data.status) return NextResponse.json({ error: data.message }, { status: 400 });

    return NextResponse.json({ url: data.data.authorization_url });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}