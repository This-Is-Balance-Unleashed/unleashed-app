import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, first_name, last_name, ticket_type_id, user_id, coupon_code, quantity = 1 } = await request.json();

    if (!ticket_type_id) {
      return NextResponse.json({ error: 'Ticket type is required' }, { status: 400 });
    }

    if (quantity < 1 || quantity > 10) {
      return NextResponse.json({ error: 'Quantity must be between 1 and 10' }, { status: 400 });
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

    // Check if enough tickets are available
    if (ticketType.max_quantity && (ticketType.sold_quantity + quantity) > ticketType.max_quantity) {
      const available = ticketType.max_quantity - ticketType.sold_quantity;
      return NextResponse.json({
        error: `Only ${available} ticket(s) available. You requested ${quantity}.`
      }, { status: 400 });
    }

    // Calculate price for the quantity of tickets
    const pricePerTicket = ticketType.price_in_kobo;
    let finalPrice = pricePerTicket * quantity;
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

      // Apply Discount (with safeguards for invalid values)
      validCouponId = coupon.id;
      if (coupon.discount_type === 'percent') {
        // Cap percent discount at 100% to prevent invalid values
        const percentValue = Math.min(coupon.discount_value, 100);
        const discountAmount = finalPrice * (percentValue / 100);
        finalPrice -= discountAmount;
      } else if (coupon.discount_type === 'fixed') {
        // Cap fixed discount at total price
        const fixedDiscount = Math.min(coupon.discount_value, finalPrice);
        finalPrice -= fixedDiscount;
      }

      // Safety check: Price cannot be negative
      if (finalPrice < 0) finalPrice = 0;
    }

    // Add service fee (2.5%) to the final price
    const SERVICE_FEE_PERCENT = 2.5;
    const serviceFee = Math.round(finalPrice * (SERVICE_FEE_PERCENT / 100));
    const totalAmount = finalPrice + serviceFee;

    // 3. Initialize Paystack transaction with custom_fields for customer name
    const customerFullName = `${first_name} ${last_name}`;

    // Generate a unique reference with test_ prefix for localhost/development
    const origin = request.headers.get('origin') ||
                   process.env.NEXT_PUBLIC_BASE_URL ||
                   process.env.NEXT_PUBLIC_SITE_URL ||
                   'http://localhost:3000';
    const isDevelopment =
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      process.env.NODE_ENV === 'development';
    const referencePrefix = isDevelopment ? 'test_' : '';
    const uniqueReference = `${referencePrefix}${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const paystackPayload = {
      email,
      first_name, // Add customer first name
      last_name,  // Add customer last name
      amount: totalAmount, // Total amount including service fee
      reference: uniqueReference, // Custom reference with test_ prefix for localhost
      metadata: {
        event_id: actualEventId,
        ticket_type_id,
        user_id,
        coupon_id: validCouponId,
        quantity: quantity, // Track number of tickets purchased
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: customerFullName
          },
          {
            display_name: "Number of Tickets",
            variable_name: "ticket_quantity",
            value: quantity.toString()
          }
        ]
      },
      callback_url: `${origin}/tickets/success`,
    };

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paystackPayload),
    });

    const data = await paystackResponse.json();

    if (!data.status) return NextResponse.json({ error: data.message }, { status: 400 });

    // 4. Create reserved tickets in database with customer name
    const ticketsToReserve = [];
    for (let i = 0; i < quantity; i++) {
      ticketsToReserve.push({
        event_id: actualEventId,
        ticket_type_id,
        user_id,
        email,
        name: customerFullName, // Save customer name at reservation time
        paystack_reference: `${uniqueReference}-${i + 1}`,
        status: 'reserved', // Reserved until webhook confirms payment
        price_paid: Math.round(totalAmount / quantity),
        coupon_id: validCouponId,
      });
    }

    const { error: reserveError } = await supabaseAdmin
      .from('tickets')
      .insert(ticketsToReserve);

    if (reserveError) {
      return NextResponse.json({ error: 'Failed to reserve tickets' }, { status: 500 });
    }

    return NextResponse.json({ url: data.data.authorization_url });

  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}