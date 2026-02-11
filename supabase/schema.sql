-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price_in_kobo INTEGER NOT NULL DEFAULT 0,
  event_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  max_attendees INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ticket Types table
CREATE TABLE IF NOT EXISTS ticket_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_in_kobo INTEGER NOT NULL,
  max_quantity INTEGER,
  sold_quantity INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT CHECK (discount_type IN ('percent', 'fixed')) NOT NULL,
  discount_value NUMERIC NOT NULL CHECK (discount_value >= 0),
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  max_uses INTEGER DEFAULT 0,
  times_used INTEGER DEFAULT 0,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  ticket_type_id UUID REFERENCES ticket_types(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users,
  email TEXT NOT NULL,
  name TEXT,
  paystack_reference TEXT UNIQUE,
  status TEXT CHECK (status IN ('reserved', 'paid', 'failed', 'used')) DEFAULT 'reserved',
  price_paid INTEGER NOT NULL DEFAULT 0,
  qr_code_url TEXT,
  ticket_secret TEXT,
  coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  checked_in_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_ticket_types_event_id ON ticket_types(event_id);
CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_tickets_ticket_type_id ON tickets(ticket_type_id);
CREATE INDEX IF NOT EXISTS idx_tickets_email ON tickets(email);
CREATE INDEX IF NOT EXISTS idx_tickets_paystack_reference ON tickets(paystack_reference);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_event_id ON coupons(event_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to increment coupon usage atomically
CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE coupons
  SET times_used = times_used + 1
  WHERE id = coupon_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment ticket type sold quantity atomically
CREATE OR REPLACE FUNCTION increment_ticket_sold(ticket_type_uuid UUID, increment_by INTEGER DEFAULT 1)
RETURNS void AS $$
BEGIN
  UPDATE ticket_types
  SET sold_quantity = sold_quantity + increment_by
  WHERE id = ticket_type_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update updated_at on events table
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update updated_at on ticket_types table
CREATE TRIGGER update_ticket_types_updated_at
  BEFORE UPDATE ON ticket_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Events Policies
-- Public read access for events
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);

-- Organizers can manage their own events
CREATE POLICY "Organizers can manage own events"
  ON events FOR ALL
  USING (auth.uid() = organizer_id);

-- Ticket Types Policies
-- Public read access for ticket types
CREATE POLICY "Ticket types are viewable by everyone"
  ON ticket_types FOR SELECT
  USING (true);

-- Organizers can manage ticket types for their events
CREATE POLICY "Organizers can manage ticket types for own events"
  ON ticket_types FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = ticket_types.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- Tickets Policies
-- Users can view their own tickets
CREATE POLICY "Users can view own tickets"
  ON tickets FOR SELECT
  USING (auth.uid() = user_id);

-- Organizers can view all tickets for their events
CREATE POLICY "Organizers can view event tickets"
  ON tickets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = tickets.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- Organizers can update tickets for their events (for check-in)
CREATE POLICY "Organizers can update event tickets"
  ON tickets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = tickets.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- Coupons Policies
-- Organizers can manage coupons for their events
CREATE POLICY "Organizers can manage coupons for own events"
  ON coupons FOR ALL
  USING (
    event_id IS NULL OR
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = coupons.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- Partnership Inquiries table
CREATE TABLE IF NOT EXISTS partnership_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  website TEXT,
  partnership_type TEXT CHECK (partnership_type IN ('platinum', 'gold', 'silver', 'bronze', 'custom')) NOT NULL,
  message TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'contacted', 'in_progress', 'confirmed', 'declined')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for partnership inquiries
CREATE INDEX IF NOT EXISTS idx_partnership_inquiries_email ON partnership_inquiries(email);
CREATE INDEX IF NOT EXISTS idx_partnership_inquiries_status ON partnership_inquiries(status);

-- Trigger to auto-update updated_at on partnership_inquiries table
CREATE TRIGGER update_partnership_inquiries_updated_at
  BEFORE UPDATE ON partnership_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on partnership_inquiries
ALTER TABLE partnership_inquiries ENABLE ROW LEVEL SECURITY;

-- Service role has full access (for API routes and webhooks)
CREATE POLICY "Service role has full access to events"
  ON events FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to ticket_types"
  ON ticket_types FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to coupons"
  ON coupons FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to tickets"
  ON tickets FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to partnership_inquiries"
  ON partnership_inquiries FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- MIGRATION: 2026-02-04 - Group Booking System (Corporate & Group Tickets)
-- ============================================================================
-- Adds support for:
-- - Corporate Refresh (8 general tickets, ₦70k)
-- - Corporate VIP (4 VIP tickets, ₦70k)
-- - Group Refresh (6 general tickets, ₦50k)
-- Features: bulk purchases, volume discounts, optional member collection
-- ============================================================================

-- Group Bookings table (for corporate and group tickets)
CREATE TABLE IF NOT EXISTS group_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference TEXT UNIQUE NOT NULL,
  booking_type TEXT CHECK (booking_type IN ('corporate', 'group')) NOT NULL,

  -- Corporate-specific fields
  company_name TEXT,
  company_logo_url TEXT,

  -- Group-specific fields
  group_name TEXT,

  -- Common contact fields
  primary_contact_name TEXT NOT NULL,
  primary_contact_email TEXT NOT NULL,
  primary_contact_phone TEXT,

  -- Selected perks (for corporate tickets)
  selected_perks JSONB,
  team_preferences TEXT,

  -- Purchase details
  ticket_type_id UUID REFERENCES ticket_types(id) NOT NULL,
  quantity INTEGER NOT NULL,
  total_price_paid INTEGER NOT NULL,
  discount_applied INTEGER DEFAULT 0,

  -- Payment tracking
  paystack_reference TEXT UNIQUE,
  status TEXT CHECK (status IN ('pending', 'paid', 'failed')) DEFAULT 'pending',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add group_booking_id to tickets table
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS group_booking_id UUID REFERENCES group_bookings(id) ON DELETE CASCADE;

-- Group Members table (for optional member details collected at checkout)
CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_booking_id UUID REFERENCES group_bookings(id) ON DELETE CASCADE NOT NULL,

  name TEXT,
  email TEXT,

  is_primary_contact BOOLEAN DEFAULT FALSE,
  member_position INTEGER NOT NULL,

  -- Link to assigned ticket (nullable - assigned later)
  assigned_ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for group bookings
CREATE INDEX IF NOT EXISTS idx_group_bookings_reference ON group_bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_group_bookings_email ON group_bookings(primary_contact_email);
CREATE INDEX IF NOT EXISTS idx_group_bookings_status ON group_bookings(status);
CREATE INDEX IF NOT EXISTS idx_group_bookings_paystack_reference ON group_bookings(paystack_reference);

-- Indexes for group members
CREATE INDEX IF NOT EXISTS idx_group_members_booking_id ON group_members(group_booking_id);
CREATE INDEX IF NOT EXISTS idx_group_members_email ON group_members(email);
CREATE INDEX IF NOT EXISTS idx_group_members_ticket_id ON group_members(assigned_ticket_id);

-- Index for tickets group_booking_id
CREATE INDEX IF NOT EXISTS idx_tickets_group_booking_id ON tickets(group_booking_id);

-- Trigger to auto-update updated_at on group_bookings table
CREATE TRIGGER update_group_bookings_updated_at
  BEFORE UPDATE ON group_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on group tables
ALTER TABLE group_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Group Bookings Policies
-- Service role has full access (for API routes and webhooks)
CREATE POLICY "Service role has full access to group_bookings"
  ON group_bookings FOR ALL
  USING (auth.role() = 'service_role');

-- Users can view their own group bookings
CREATE POLICY "Users can view own group bookings"
  ON group_bookings FOR SELECT
  USING (primary_contact_email = auth.jwt()->>'email');

-- Organizers can view group bookings for their events
CREATE POLICY "Organizers can view event group bookings"
  ON group_bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events e
      JOIN ticket_types tt ON tt.event_id = e.id
      WHERE tt.id = group_bookings.ticket_type_id
      AND e.organizer_id = auth.uid()
    )
  );

-- Group Members Policies
-- Service role has full access
CREATE POLICY "Service role has full access to group_members"
  ON group_members FOR ALL
  USING (auth.role() = 'service_role');

-- Users can view members in their group bookings
CREATE POLICY "Users can view own group members"
  ON group_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_bookings gb
      WHERE gb.id = group_members.group_booking_id
      AND gb.primary_contact_email = auth.jwt()->>'email'
    )
  );

-- Organizers can view group members for their events
CREATE POLICY "Organizers can view event group members"
  ON group_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM group_bookings gb
      JOIN ticket_types tt ON tt.id = gb.ticket_type_id
      JOIN events e ON e.id = tt.event_id
      WHERE gb.id = group_members.group_booking_id
      AND e.organizer_id = auth.uid()
    )
  );

-- ============================================================================
-- MIGRATION: 2026-02-05 - Add Coupon Support to Group Bookings
-- ============================================================================
-- Adds coupon_id column to group_bookings table to track coupon usage
-- for corporate and group ticket purchases
-- ============================================================================

-- Add coupon_id column to group_bookings table
ALTER TABLE group_bookings ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_group_bookings_coupon_id ON group_bookings(coupon_id);
