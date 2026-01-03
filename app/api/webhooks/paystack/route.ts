import { NextResponse } from 'next/server';
import crypto from 'crypto';
import QRCode from 'qrcode';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-paystack-signature');
    const body = await request.text();

    // 1. Verify Signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === 'charge.success') {
      const { metadata, reference, amount, customer } = event.data;

      // 2. Generate a Secure Unique String for the Ticket
      // We combine the reference + event_id to ensure uniqueness
      // In production, you might sign this with a secret key (JWT)
      const ticketSecret = `${reference}::${metadata.event_id}`;

      // 3. Generate QR Code as a Buffer
      // We create a Buffer directly to upload to Supabase
      const qrBuffer = await QRCode.toBuffer(ticketSecret, {
        errorCorrectionLevel: 'H', // High error correction
        type: 'png',
        width: 400,
        margin: 2
      });

      // 4. Upload to Supabase Storage
      const filePath = `${metadata.user_id || customer.email}/${reference}.png`;
      const { error: uploadError } = await supabaseAdmin
        .storage
        .from('qr-codes')
        .upload(filePath, qrBuffer, {
          contentType: 'image/png',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // 5. Get the Public URL
      const { data: { publicUrl } } = supabaseAdmin
        .storage
        .from('qr-codes')
        .getPublicUrl(filePath);

      // 6. Save Everything to Database
      const { error: dbError } = await supabaseAdmin
        .from('tickets')
        .insert({
          event_id: metadata.event_id,
          ticket_type_id: metadata.ticket_type_id,
          user_id: metadata.user_id,
          email: customer.email,
          name: customer.first_name && customer.last_name
            ? `${customer.first_name} ${customer.last_name}`
            : customer.first_name || null,
          paystack_reference: reference,
          status: 'paid',
          price_paid: amount,
          qr_code_url: publicUrl, // <--- Saving the image link
          ticket_secret: ticketSecret, // <--- Saving the data inside the QR
          coupon_id: metadata.coupon_id || null
        });

      if (dbError) throw dbError;

      // 7. Increment coupon usage if a coupon was used
      if (metadata.coupon_id) {
        const { error: couponError } = await supabaseAdmin
          .rpc('increment_coupon_usage', { coupon_uuid: metadata.coupon_id });

        if (couponError) {
          console.error('Failed to increment coupon usage:', couponError);
          // Don't throw - ticket is already created, just log the error
        }
      }

      // 8. Increment ticket type sold quantity
      if (metadata.ticket_type_id) {
        const { error: ticketTypeError } = await supabaseAdmin
          .rpc('increment_ticket_sold', { ticket_type_uuid: metadata.ticket_type_id });

        if (ticketTypeError) {
          console.error('Failed to increment ticket type sold quantity:', ticketTypeError);
          // Don't throw - ticket is already created, just log the error
        }
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}