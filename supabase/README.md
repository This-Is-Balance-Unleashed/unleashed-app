# Supabase Database Setup

This directory contains the database schema and seed data for the event ticketing system.

## Database Structure

### Tables

#### 1. **events**
Stores event information with multi-tenant support via `organizer_id`.

```sql
- id: UUID (primary key)
- organizer_id: UUID (references auth.users) - Event creator
- title: TEXT
- description: TEXT
- price_in_kobo: INTEGER (default 0) - Base price in smallest currency unit
- event_date: TIMESTAMP
- location: TEXT
- max_attendees: INTEGER
- created_at, updated_at: TIMESTAMP
```

#### 2. **ticket_types**
Defines different ticket tiers for each event (General, VIP, Corporate, Virtual, etc.)

```sql
- id: UUID (primary key)
- event_id: UUID (references events)
- name: TEXT - e.g., "General Admission", "VIP"
- description: TEXT - Detailed benefits
- price_in_kobo: INTEGER - Price for this tier
- max_quantity: INTEGER - Stock limit (NULL = unlimited)
- sold_quantity: INTEGER - Tickets sold
- is_available: BOOLEAN - Can be purchased
- sort_order: INTEGER - Display order
- created_at, updated_at: TIMESTAMP
```

#### 3. **tickets**
Individual ticket purchases

```sql
- id: UUID (primary key)
- event_id: UUID (references events)
- ticket_type_id: UUID (references ticket_types)
- user_id: UUID (references auth.users, optional)
- email: TEXT - Ticket holder email
- name: TEXT - Ticket holder name
- paystack_reference: TEXT - Payment reference
- status: ENUM('reserved', 'paid', 'failed', 'used')
  - 'reserved': Initial state after purchase starts
  - 'paid': Payment confirmed via webhook
  - 'failed': Payment failed
  - 'used': Checked in at venue
- price_paid: INTEGER - Actual amount paid (after discounts)
- qr_code_url: TEXT - Supabase Storage URL
- ticket_secret: TEXT - Secret embedded in QR code
- coupon_id: UUID (references coupons, optional)
- checked_in_at: TIMESTAMP - When marked as 'used'
- created_at: TIMESTAMP
```

#### 4. **coupons**
Discount codes for events

```sql
- id: UUID (primary key)
- code: TEXT UNIQUE - e.g., "EARLYBIRD"
- discount_type: ENUM('percent', 'fixed')
- discount_value: INTEGER - Percentage or amount in kobo
- event_id: UUID (references events, NULL = all events)
- max_uses: INTEGER (0 = unlimited)
- times_used: INTEGER
- expires_at: TIMESTAMP
- is_active: BOOLEAN
- created_at: TIMESTAMP
```

## Row Level Security (RLS)

### Events
- **Public**: Anyone can view events
- **Organizers**: Can manage their own events
- **Service Role**: Full access (for API routes)

### Ticket Types
- **Public**: Anyone can view ticket types
- **Organizers**: Can manage ticket types for their events
- **Service Role**: Full access

### Tickets
- **Users**: Can view their own tickets (via `user_id`)
- **Organizers**: Can view and update tickets for their events
- **Service Role**: Full access

### Coupons
- **Organizers**: Can manage coupons for their events
- **Service Role**: Full access

## Setup Instructions

### 1. Create a Supabase Account
- Sign up at https://supabase.com
- Create a new project

### 2. Run the Schema
1. Go to SQL Editor in your Supabase dashboard
2. Copy the contents of `schema.sql`
3. Execute the SQL

### 3. Create Storage Bucket
1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `qr-codes`
3. Make it **public** (Settings → Make public)

### 4. Create Your User Account
1. Go to Authentication → Users
2. Create a new user with your email
3. Copy the user ID

### 5. Run Seed Data
1. Open `seed.sql`
2. Replace `'YOUR_USER_ID_HERE'` with your actual user ID
3. Run the modified SQL in SQL Editor

### 6. Set Environment Variables
Create/update your `.env.local` file:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Paystack
PAYSTACK_SECRET_KEY=your-paystack-secret-key
```

## Database Functions

### `increment_coupon_usage(coupon_uuid UUID)`
Atomically increments the `times_used` counter for a coupon.

```sql
SELECT increment_coupon_usage('coupon-id-here');
```

### `increment_ticket_sold(ticket_type_uuid UUID)`
Atomically increments the `sold_quantity` counter for a ticket type.

```sql
SELECT increment_ticket_sold('ticket-type-id-here');
```

## API Integration

### Purchase Flow
1. User selects ticket type and applies optional coupon
2. Frontend calls `/api/coupons/check` to validate coupon
3. Frontend calls `/api/tickets/purchase` with:
   - `email`
   - `ticket_type_id`
   - `event_id` (from ticket type)
   - `coupon_code` (optional)
   - `user_id` (optional, from auth)
4. API creates Paystack payment initialization
5. User completes payment on Paystack
6. Paystack webhook calls `/api/webhooks/paystack`
7. Webhook:
   - Verifies signature
   - Generates QR code
   - Uploads to Storage
   - Creates ticket with status='paid'
   - Increments coupon usage
   - Increments ticket type sold quantity

### Check-in Flow
1. Scan QR code to extract `ticket_secret`
2. Call `/api/tickets/verify` (POST) with `ticket_secret`
3. API:
   - Validates ticket exists
   - Checks status is 'paid'
   - Updates status to 'used'
   - Sets `checked_in_at` timestamp
   - Returns ticket and event details

### Status Query
Call `/api/tickets/verify` (GET) with query param `?secret=xxx` to check ticket status without checking in.

## Ticket Statuses

- **reserved**: Ticket created but payment not confirmed (initial state)
- **paid**: Payment successful, QR code generated
- **failed**: Payment failed or was cancelled
- **used**: Ticket scanned and checked in at venue

## Schema Diagram

```
auth.users (Supabase Auth)
    ↓
events (organizer_id)
    ↓
ticket_types (event_id)
    ↓
tickets (ticket_type_id, user_id?, coupon_id?)
    ↑
coupons (event_id?)
```

## Security Notes

1. **Service Role Key**: Never expose this in client-side code. Only use in API routes.
2. **Webhook Signature**: Always verify Paystack signatures to prevent fraudulent requests.
3. **QR Secret**: Should be cryptographically secure. Consider using JWT or HMAC signing.
4. **RLS Policies**: Test thoroughly to ensure users can't access other users' tickets.
5. **Rate Limiting**: Add rate limiting to prevent abuse of coupon checking and ticket purchases.

## Next Steps

1. **Email Notifications**: Send ticket emails after successful payment
2. **PDF Tickets**: Generate PDF tickets with QR codes
3. **Analytics**: Track ticket sales, revenue, popular ticket types
4. **Refunds**: Add refund workflow with status updates
5. **Waitlist**: When ticket type is sold out, allow waitlist signups
6. **Bulk Purchases**: For Corporate tickets, create multiple individual tickets
