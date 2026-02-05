import { formOptions } from '@tanstack/react-form-nextjs';

export const purchaseFormOptions = formOptions({
  defaultValues: {
    firstName: '',
    lastName: '',
    email: '',
    careerCategory: '',
    quantity: 1,
    couponCode: '',
  },
});
