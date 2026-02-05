'use server';

import {
  ServerValidateError,
  createServerValidate,
} from '@tanstack/react-form-nextjs';
import { groupFormOptions } from './group-form-options';

const serverValidate = createServerValidate({
  ...groupFormOptions,
  onServerValidate: ({ value }) => {
    debugger
    console.log('server validate', value)
    // Add any server-side validation here
    if (!value.primaryContactName || value.primaryContactName.trim() === '') {
      return 'Primary contact name is required';
    }
    if (!value.primaryContactEmail || value.primaryContactEmail.trim() === '') {
      return 'Primary contact email is required';
    }
    if (!value.primaryContactPhone || value.primaryContactPhone.trim() === '') {
      return 'Primary contact phone is required';
    }
  },
});

export async function createGroupBookingAction(prev: unknown, formData: FormData) {
  try {
    const validatedData = await serverValidate(formData);
    console.log('here server action', formData)
    // console.log(validatedData)
    // Get additional data from form
    const ticketTypeId = formData.get('ticketTypeId') as string;
    const bookingType = formData.get('bookingType') as 'corporate' | 'group';
    const quantity = parseInt(formData.get('quantity') as string, 10);

    // Prepare form data for API
    const apiFormData = new FormData();
    apiFormData.append('ticketTypeId', ticketTypeId);
    apiFormData.append('bookingType', bookingType);
    apiFormData.append('quantity', quantity.toString());
    apiFormData.append('primaryContactName', validatedData.primaryContactName);
    apiFormData.append('primaryContactEmail', validatedData.primaryContactEmail);
    apiFormData.append('primaryContactPhone', validatedData.primaryContactPhone);

    if (bookingType === 'corporate') {
      apiFormData.append('companyName', validatedData.companyName || '');
      if (validatedData.companyLogo) {
        apiFormData.append('companyLogo', validatedData.companyLogo);
      }
      apiFormData.append('selectedPerks', JSON.stringify(validatedData.selectedPerks || []));
      apiFormData.append('teamPreferences', validatedData.teamPreferences || '');
    } else {
      apiFormData.append('groupName', validatedData.groupName || '');
    }

    if (validatedData.provideMemberDetails && validatedData.members) {
      apiFormData.append('members', JSON.stringify(validatedData.members));
    }

    // Call API to create booking
    const isDevelopment = process.env.NODE_ENV === 'development';
    const baseUrl = isDevelopment
      ? 'http://localhost:3000'
      : (process.env.NEXT_PUBLIC_BASE_URL || 'https://unleashedevents.netlify.app');
    const response = await fetch(`${baseUrl}/api/group-bookings/create`, {
      method: 'POST',
      body: apiFormData,
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

    if (data.success && data.paymentUrl) {
      // Return redirect URL to client
      return {
        success: true,
        paymentUrl: data.paymentUrl,
      } as any;
    } else {
      return {
        success: false,
        error: data.error || 'Failed to create booking',
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
