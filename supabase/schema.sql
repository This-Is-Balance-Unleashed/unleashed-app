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
