import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Hoisted RegExp to module level (avoids recreation on each request)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Static validation set for O(1) lookups
const VALID_PARTNERSHIP_TYPES = new Set(['platinum', 'gold', 'silver', 'bronze', 'custom']);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, contactName, email, phone, website, partnershipType, message } = body;

    // Validate required fields
    if (!companyName || !contactName || !email || !phone || !partnershipType || !message) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate partnership type (O(1) Set lookup instead of O(n) array includes)
    if (!VALID_PARTNERSHIP_TYPES.has(partnershipType)) {
      return NextResponse.json(
        { error: 'Invalid partnership type' },
        { status: 400 }
      );
    }

    // Insert into database
    const { data, error } = await supabaseAdmin
      .from('partnership_inquiries')
      .insert({
        company_name: companyName,
        contact_name: contactName,
        email,
        phone,
        website: website || null,
        partnership_type: partnershipType,
        message,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to submit partnership inquiry' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Partnership inquiry submitted successfully',
      id: data.id,
    });
  } catch (error) {
    console.error('Partnership submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint could be used by admins to list partnership inquiries
    // For now, we'll return a simple message
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('partnership_inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch partnership inquiries' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      inquiries: data,
    });
  } catch (error) {
    console.error('Partnership fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
