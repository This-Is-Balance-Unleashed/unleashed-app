-- Seed data for Refresh Summit Event

-- IMPORTANT: Replace 'YOUR_USER_ID_HERE' with your actual user ID from auth.users
-- You can get your user ID by running: SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Insert the main event
INSERT INTO events (id, organizer_id, title, description, price_in_kobo, event_date, location, max_attendees)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '0ed5d5d6-607e-4397-8bc8-c2e850a3de38'::uuid, -- Replace with your actual user ID
  'Hit Refresh: Career + Wellness Summit',
  'A transformative wellness and productivity summit designed to help professionals reset, recharge, and refocus.',
  1000000, -- Base price (General Admission)
  '2026-02-28 08:00:00+01', -- Feb 28, 2026, 8:00 AM GMT+1 (Lagos time)
  'Lagos, Nigeria',
  500
);

-- Insert ticket types
INSERT INTO ticket_types (id, event_id, name, description, price_in_kobo, max_quantity, sold_quantity, is_available, sort_order)
VALUES
  (
    '00000000-0000-0000-0001-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'General Admission',
    'This is a general access ticket that gives you a full in-person experience.
Includes:
- Access to all keynotes, speakers, and panel sessions.
- Digital workbook/reflection journal (PDF)',
    1000000, -- ₦10,000.00
    300,
    2,
    true,
    1
  ),
  (
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Refresh+ Experience (VIP)',
    'This ticket is for attendees seeking a more personalised, high-touch experience.
Includes everything in General Admission, plus:
- Access to an exclusive Masterclass
- Reserved front-row seating
- Wellness Goody Bag',
    1800000, -- ₦18,000.00
    50,
    0,
    true,
    2
  ),
  (
    '00000000-0000-0000-0001-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Refresh Corporate',
    'This is for HR departments, startups, or companies investing in staff wellness and productivity. You buy one ticket which includes:
- 5–8 General Admission tickets
- Company logo featured in "Corporate Partners" section of event banner
- Reserved team seating area
- Access to a short post-summit "Career Wellness Audit" report.',
    7000000, -- ₦70,000.00
    20,
    0,
    true,
    3
  ),
  (
    '00000000-0000-0000-0001-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'Refresh Online (Virtual Pass)',
    'This ticket is for remote attendees or those outside the event city.
Includes:
- Livestream access to keynote + panel sessions
- Replay access for 7–14 days',
    650000, -- ₦6,500.00
    NULL, -- Unlimited
    0,
    true,
    4
  );

-- Insert sample coupons
INSERT INTO coupons (code, discount_type, discount_value, is_active, expires_at, max_uses, event_id)
VALUES
  ('EARLYBIRD', 'percent', 20, true, '2026-02-15 23:59:59+00', 100, '00000000-0000-0000-0000-000000000001'),
  ('CORPORATE50', 'fixed', 500000, true, '2026-03-01 23:59:59+00', 10, '00000000-0000-0000-0000-000000000001'),
  ('WELCOME10', 'percent', 10, true, NULL, 0, NULL); -- Global coupon with no expiry and unlimited uses
