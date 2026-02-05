import { formOptions } from '@tanstack/react-form-nextjs';

export const groupFormOptions = formOptions({
  defaultValues: {
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    companyName: '',
    companyLogo: undefined as File | undefined,
    selectedPerks: [] as string[],
    teamPreferences: '',
    groupName: '',
    provideMemberDetails: false,
    members: [] as Array<{ name: string; email: string }>,
    quantity: 1,
  },
});
