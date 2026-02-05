'use server';

import {
  ServerValidateError,
  createServerValidate,
} from '@tanstack/react-form-nextjs';
import { purchaseFormOptions } from './purchase-form-options';

const serverValidate = createServerValidate({
  ...purchaseFormOptions,
  onServerValidate: ({ value }) => {
    // Server-side validation
    if (!value.firstName || value.firstName.trim() === '') {
      return 'First name is required';
    }
    if (!value.lastName || value.lastName.trim() === '') {
      return 'Last name is required';
    }
    if (!value.email || value.email.trim() === '') {
      return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) {
      return 'Invalid email address';
    }
    if (value.quantity < 1) {
      return 'Quantity must be at least 1';
    }
  },
});

export async function purchaseTicketAction(prev: unknown, formData: FormData) {
  try {
    const validatedData = await serverValidate(formData);

    // Get additional data from form
    const eventId = formData.get('eventId') as string;
    const ticketTypeId = formData.get('ticketTypeId') as string;

    // Call the purchase API
    const isDevelopment = process.env.NODE_ENV === 'development';
    const baseUrl = isDevelopment
      ? 'http://localhost:3000'
      : (process.env.NEXT_PUBLIC_BASE_URL || 'https://unleashedevents.netlify.app');
    const response = await fetch(`${baseUrl}/api/tickets/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: validatedData.email,
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        career_category: validatedData.careerCategory,
        event_id: eventId,
        ticket_type_id: ticketTypeId,
        quantity: validatedData.quantity,
        coupon_code: validatedData.couponCode || undefined,
      }),
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      return {
        success: false,
        error: `API error: ${response.status} ${response.statusText}`,
      } as any;
    }

    const data = await response.json();

    if (response.ok && data.url) {
      // Return payment URL to redirect client
      return {
        success: true,
        paymentUrl: data.url,
      } as any;
    } else {
      return {
        success: false,
        error: data.error || 'Failed to initialize payment',
      } as any;
    }
  } catch (e) {
    if (e instanceof ServerValidateError) {
      return e.formState;
    }

    // Some other error occurred
    throw e;
  }
}
