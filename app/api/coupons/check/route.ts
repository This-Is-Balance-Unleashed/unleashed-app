import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, ticket_type_id } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    if (!ticket_type_id) {
      return NextResponse.json(
        { error: 'Ticket type ID is required' },
        { status: 400 }
      );
    }

    // Fetch coupon and ticket type in parallel (independent queries)
    const [couponResult, ticketTypeResult] = await Promise.all([
      supabaseAdmin
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .single(),
      supabaseAdmin
        .from('ticket_types')
        .select('price_in_kobo, event_id')
        .eq('id', ticket_type_id)
        .single(),
    ]);

    const { data: coupon, error: couponError } = couponResult;
    const { data: ticketType, error: ticketTypeError } = ticketTypeResult;

    if (couponError || !coupon) {
      return NextResponse.json(
        { valid: false, error: 'Invalid coupon code' },
        { status: 400 }
      );
    }

    if (ticketTypeError || !ticketType) {
      return NextResponse.json(
        { error: 'Ticket type not found' },
        { status: 404 }
      );
    }

    // Validate coupon
    const now = new Date();
    const isExpired = coupon.expires_at && new Date(coupon.expires_at) < now;
    const isMaxedOut = coupon.max_uses > 0 && coupon.times_used >= coupon.max_uses;
    const isWrongEvent = coupon.event_id && coupon.event_id !== ticketType.event_id;

    if (!coupon.is_active || isExpired || isMaxedOut || isWrongEvent) {
      let errorMessage = 'Invalid or expired coupon';
      if (isExpired) errorMessage = 'Coupon has expired';
      if (isMaxedOut) errorMessage = 'Coupon usage limit reached';
      if (isWrongEvent) errorMessage = 'Coupon not valid for this event';

      return NextResponse.json(
        { valid: false, error: errorMessage },
        { status: 400 }
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discount_type === 'percent') {
      // Cap percent discount at 100% to prevent invalid values
      const percentValue = Math.min(coupon.discount_value, 100);
      discountAmount = ticketType.price_in_kobo * (percentValue / 100);
    } else if (coupon.discount_type === 'fixed') {
      // Cap fixed discount at ticket price
      discountAmount = Math.min(coupon.discount_value, ticketType.price_in_kobo);
    }

    const newPrice = Math.max(0, ticketType.price_in_kobo - discountAmount);

    return NextResponse.json({
      valid: true,
      original_price: ticketType.price_in_kobo,
      new_price: newPrice,
      discount_amount: discountAmount,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      coupon_id: coupon.id,
    });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
