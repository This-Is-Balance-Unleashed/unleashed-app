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

    // Validate required fields
    if (!ticketTypeId || !bookingType || !quantity || !primaryContactName || !primaryContactEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Fetch ticket type information
    const { data: ticketType, error: ticketError } = await supabaseAdmin
      .from('ticket_types')
      .select('*, events(id, title)')
      .eq('id', ticketTypeId)
      .single();

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
    const subtotal = basePrice * quantity;

    // Apply 10% discount for corporate bookings with 2+ tickets
    const shouldApplyDiscount = bookingType === 'corporate' && quantity >= 2;
    const discountAmount = shouldApplyDiscount ? Math.floor(subtotal * 0.1) : 0;
    const totalAfterDiscount = subtotal - discountAmount;

    // Add service fee (2.5%)
    const SERVICE_FEE_PERCENT = 2.5;
    const serviceFee = Math.round(totalAfterDiscount * (SERVICE_FEE_PERCENT / 100));
    const totalAmount = totalAfterDiscount + serviceFee;

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

        // Upload to Supabase Storage
        const fileExt = companyLogo.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `company-logos/${fileName}`;

        const arrayBuffer = await companyLogo.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('event-assets')
          .upload(filePath, buffer, {
            contentType: companyLogo.type,
            upsert: false,
          });

        if (uploadError) {
          console.error('Logo upload error:', uploadError);
          return NextResponse.json(
            { error: 'Failed to upload company logo' },
            { status: 500 }
          );
        }

        // Get public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('event-assets')
          .getPublicUrl(filePath);

        companyLogoUrl = publicUrl;
      }
    }

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
      discount_applied: discountAmount,
      status: 'pending',
    };

    // Add type-specific fields
    if (bookingType === 'corporate') {
      bookingData.company_name = formData.get('companyName') as string;
      bookingData.company_logo_url = companyLogoUrl;

      const selectedPerksStr = formData.get('selectedPerks') as string;
      bookingData.selected_perks = selectedPerksStr ? JSON.parse(selectedPerksStr) : [];

      bookingData.team_preferences = formData.get('teamPreferences') as string || null;
    } else {
      bookingData.group_name = formData.get('groupName') as string;
    }

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
