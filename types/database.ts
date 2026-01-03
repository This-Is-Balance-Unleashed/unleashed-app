export interface Event {
  id: string;
  organizer_id: string;
  title: string;
  description?: string;
  price_in_kobo: number;
  event_date?: string;
  location?: string;
  max_attendees?: number;
  created_at: string;
  updated_at?: string;
}

export interface TicketType {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  price_in_kobo: number;
  max_quantity?: number;
  sold_quantity: number;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  is_active: boolean;
  expires_at?: string;
  max_uses: number;
  times_used: number;
  event_id?: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  event_id: string;
  ticket_type_id: string;
  user_id?: string;
  email: string;
  name?: string;
  paystack_reference?: string;
  status: 'reserved' | 'paid' | 'failed' | 'used';
  price_paid: number;
  qr_code_url?: string;
  ticket_secret?: string;
  coupon_id?: string;
  created_at: string;
  checked_in_at?: string;
}
