import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Extract form fields
    const ticketTypeId = formData.get('ticketTypeId') as string;
    const bookingType = formData.get('bookingType') as 'corporate' | 'group';
    const quantity = parseInt(formData.get('quantity') as string, 10); // Number of packages
    const totalMembers = parseInt(formData.get('totalMembers') as string, 10); // Total members across all packages
    const primaryContactName = formData.get('primaryContactName') as string;
    const primaryContactEmail = formData.get('primaryContactEmail') as string;
    const primaryContactPhone = formData.get('primaryContactPhone') as string;
    const couponCode = formData.get('couponCode') as string | null;

    // Validate required fields
    if (!ticketTypeId || !bookingType || !quantity || !primaryContactName || !primaryContactEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Start independent promises in parallel
    const ticketPromise = supabaseAdmin
      .from('ticket_types')
      .select('*, events(id, title)')
      .eq('id', ticketTypeId)
      .single();

    const couponPromise = couponCode
      ? supabaseAdmin
          .from('coupons')
          .select('*')
          .eq('code', couponCode.toUpperCase())
          .single()
      : Promise.resolve({ data: null, error: null });

    let logoUploadPromise: Promise<{ publicUrl: string | null; error?: any }> =
      Promise.resolve({ publicUrl: null });

    // Handle file upload for company logo (corporate only)
    let companyLogoUrl: string | null = null;
    if (bookingType === 'corporate') {
      const companyLogo = formData.get('companyLogo') as File | null;

      if (companyLogo && companyLogo.size > 0) {
        // Validate file size (max 2MB)
        if (companyLogo.size > 2 * 1024 * 1024) {
          return NextResponse.json(
            { error: 'Company logo must be less than 2MB' },
            { status: 400 }
          );
        }

        // Validate file type
        if (!companyLogo.type.startsWith('image/')) {
          return NextResponse.json(
            { error: 'Company logo must be an image file' },
            { status: 400 }
          );
        }

        // Start upload immediately
        logoUploadPromise = (async () => {
          const fileExt = companyLogo.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(7)}.${fileExt}`;
          const filePath = `company-logos/${fileName}`;

          const arrayBuffer = await companyLogo.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const { error: uploadError } = await supabaseAdmin.storage
            .from('event-assets')
            .upload(filePath, buffer, {
              contentType: companyLogo.type,
              upsert: false,
            });

          if (uploadError) {
            console.error('Logo upload error:', uploadError);
            return { publicUrl: null, error: uploadError };
          }

          const {
            data: { publicUrl },
          } = supabaseAdmin.storage.from('event-assets').getPublicUrl(filePath);

          return { publicUrl };
        })();
      }
    }

    // Await all promises
    const [ticketRes, couponRes, logoRes] = await Promise.all([
      ticketPromise,
      couponPromise,
      logoUploadPromise,
    ]);

    const { data: ticketType, error: ticketError } = ticketRes;
    const { data: coupon } = couponRes;
    
    if (logoRes.error) {
        return NextResponse.json(
            { error: 'Failed to upload company logo' },
            { status: 500 }
        );
    }
    companyLogoUrl = logoRes.publicUrl;

    if (ticketError || !ticketType) {
      return NextResponse.json(
        { error: 'Ticket type not found' },
        { status: 404 }
      );
    }

    if (!ticketType.is_available) {
      return NextResponse.json(
        { error: 'This ticket type is not available' },
        { status: 400 }
      );
    }

    // Check availability
    if (ticketType.max_quantity && ticketType.sold_quantity >= ticketType.max_quantity) {
      return NextResponse.json(
        { error: 'This ticket type is sold out' },
        { status: 400 }
      );
    }

    if (ticketType.max_quantity && (ticketType.sold_quantity + quantity) > ticketType.max_quantity) {
      const available = ticketType.max_quantity - ticketType.sold_quantity;
      return NextResponse.json(
        { error: `Only ${available} ticket(s) available. You requested ${quantity}.` },
        { status: 400 }
      );
    }

    // Calculate pricing with discount
    const basePrice = ticketType.price_in_kobo;
    const originalSubtotal = basePrice * quantity;
    let pricePerPackage = basePrice;
    let validCouponId: string | null = null;
    const actualEventId = ticketType.events.id;

    // Calculate service fee on ORIGINAL price (before any discounts)
    const SERVICE_FEE_PERCENT = 2.5;
    const serviceFee = Math.round(originalSubtotal * (SERVICE_FEE_PERCENT / 100));

    // Validate coupon result from promise
    if (couponCode) {
      // Validate coupon
      const now = new Date();
      if (
        !coupon ||
        !coupon.is_active ||
        (coupon.expires_at && new Date(coupon.expires_at) < now) ||
        (coupon.max_uses > 0 && coupon.times_used >= coupon.max_uses) ||
        (coupon.event_id && coupon.event_id !== actualEventId)
      ) {
        return NextResponse.json(
          { error: 'Invalid or expired coupon' },
          { status: 400 }
        );
      }

      // Apply coupon discount to price per package (not service fee)
      validCouponId = coupon.id;
      if (coupon.discount_type === 'percent') {
        const percentValue = Math.min(coupon.discount_value, 100);
        const discountAmount = pricePerPackage * (percentValue / 100);
        pricePerPackage -= discountAmount;
      } else if (coupon.discount_type === 'fixed') {
        const fixedDiscount = Math.min(coupon.discount_value, pricePerPackage);
        pricePerPackage -= fixedDiscount;
      }

      // Safety check
      if (pricePerPackage < 0) pricePerPackage = 0;
    }

    const subtotalAfterCoupon = pricePerPackage * quantity;

    // Apply 10% volume discount for corporate bookings with 2+ packages
    const shouldApplyVolumeDiscount = bookingType === 'corporate' && quantity >= 2;
    const volumeDiscountAmount = shouldApplyVolumeDiscount ? Math.floor(subtotalAfterCoupon * 0.1) : 0;
    const totalAfterDiscount = subtotalAfterCoupon - volumeDiscountAmount;

    // Total = discounted price + service fee (on original price)
    const totalAmount = totalAfterDiscount + serviceFee;

    console.log('Group booking price calculation:', {
      originalSubtotal,
      subtotalAfterCoupon,
      volumeDiscountAmount,
      totalAfterDiscount,
      serviceFee,
      totalAmount,
      couponCode: couponCode || 'none'
    });

    // Generate unique booking reference
    const origin = request.headers.get('origin') ||
                   process.env.NEXT_PUBLIC_BASE_URL ||
                   process.env.NEXT_PUBLIC_SITE_URL ||
                   'http://localhost:3000';
    const isDevelopment =
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      process.env.NODE_ENV === 'development';
    const referencePrefix = isDevelopment ? 'test_' : '';
    const bookingReference = `${referencePrefix}GB${Date.now()}_${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Prepare booking data
    const bookingData: Record<string, any> = {
      booking_reference: bookingReference,
      booking_type: bookingType,
      primary_contact_name: primaryContactName,
      primary_contact_email: primaryContactEmail,
      primary_contact_phone: primaryContactPhone,
      ticket_type_id: ticketTypeId,
      quantity,
      total_price_paid: totalAmount,
      discount_applied: volumeDiscountAmount,
      coupon_id: validCouponId,
      status: 'pending',
    };

    // Add type-specific fields
    if (bookingType === 'corporate') {
      bookingData.company_name = formData.get('companyName') as string;
      bookingData.company_logo_url = companyLogoUrl;

      const selectedPerksStr = formData.get('selectedPerks') as string;
      console.log('Received selectedPerks string:', selectedPerksStr);

      let parsedPerks: string[] = [];
      try {
        parsedPerks = selectedPerksStr ? JSON.parse(selectedPerksStr) : [];
        // Ensure it's an array
        if (!Array.isArray(parsedPerks)) {
          console.error('selectedPerks is not an array:', parsedPerks);
          parsedPerks = [];
        }
        console.log('Parsed selectedPerks array:', parsedPerks);
      } catch (error) {
        console.error('Error parsing selectedPerks:', error);
        parsedPerks = [];
      }

      // Supabase JSONB columns accept JavaScript objects/arrays directly
      bookingData.selected_perks = parsedPerks.length > 0 ? parsedPerks : null;
      bookingData.team_preferences = formData.get('teamPreferences') as string || null;
    } else {
      bookingData.group_name = formData.get('groupName') as string;
    }

    console.log('Final bookingData.selected_perks:', bookingData.selected_perks);

    // Create group booking record
    const { data: groupBooking, error: bookingError } = await supabaseAdmin
      .from('group_bookings')
      .insert(bookingData)
      .select()
      .single();

    if (bookingError || !groupBooking) {
      console.error('Booking creation error:', bookingError);
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      );
    }

    console.log('Created booking with selected_perks:', groupBooking.selected_perks);

    // Handle optional member details
    const membersStr = formData.get('members') as string;
    if (membersStr) {
      const members = JSON.parse(membersStr) as Array<{ name: string; email: string }>;
      const validMembers = members.filter(m => m.name || m.email);

      if (validMembers.length > 0) {
        const memberRecords = validMembers.map((member) => ({
          group_booking_id: groupBooking.id,
          name: member.name || null,
          email: member.email || null,
        }));

        await supabaseAdmin
          .from('group_members')
          .insert(memberRecords);
      }
    }

    // Initialize Paystack payment
    const paystackPayload = {
      email: primaryContactEmail,
      amount: totalAmount,
      reference: bookingReference,
      metadata: {
        booking_type: bookingType,
        group_booking_id: groupBooking.id,
        event_id: ticketType.events.id,
        ticket_type_id: ticketTypeId,
        quantity: totalMembers, // Total tickets to create (one per member)
        packages: quantity, // Number of packages purchased
        primary_contact: primaryContactName,
        custom_fields: [
          {
            display_name: 'Booking Type',
            variable_name: 'booking_type',
            value: bookingType === 'corporate' ? 'Corporate' : 'Group',
          },
          {
            display_name: 'Number of Packages',
            variable_name: 'packages',
            value: quantity.toString(),
          },
          {
            display_name: 'Total Members',
            variable_name: 'total_members',
            value: totalMembers.toString(),
          },
          {
            display_name: 'Primary Contact',
            variable_name: 'primary_contact',
            value: primaryContactName,
          },
        ],
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

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      return NextResponse.json(
        { error: paystackData.message || 'Payment initialization failed' },
        { status: 400 }
      );
    }

    // Update booking with Paystack reference
    await supabaseAdmin
      .from('group_bookings')
      .update({ paystack_reference: bookingReference })
      .eq('id', groupBooking.id);

    return NextResponse.json({
      success: true,
      paymentUrl: paystackData.data.authorization_url,
      bookingReference,
    });

  } catch (error) {
    console.error('Group booking error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your booking' },
      { status: 500 }
    );
  }
}
