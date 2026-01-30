-- ============================================
-- Admin Dashboard - Database Setup
-- ============================================
-- Run this SQL in your Supabase SQL Editor to create
-- tables required for the advanced admin dashboard features.
-- ============================================

-- 1. Trip Itinerary Items
-- ============================================
CREATE TABLE IF NOT EXISTS itinerary_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  image_url TEXT,
  gradient TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS itinerary_items_trip_id_idx ON itinerary_items(trip_id);

-- Enable RLS
ALTER TABLE itinerary_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view itinerary items"
  ON itinerary_items FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage itinerary items"
  ON itinerary_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 2. Trip Images (Gallery)
-- ============================================
CREATE TABLE IF NOT EXISTS trip_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS trip_images_trip_id_idx ON trip_images(trip_id);

-- Enable RLS
ALTER TABLE trip_images ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view trip images"
  ON trip_images FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage trip images"
  ON trip_images FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 3. Trip Availability Dates
-- ============================================
CREATE TABLE IF NOT EXISTS trip_dates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  spots_total INTEGER DEFAULT 20,
  spots_booked INTEGER DEFAULT 0,
  price_modifier NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS trip_dates_trip_id_idx ON trip_dates(trip_id);
CREATE INDEX IF NOT EXISTS trip_dates_start_date_idx ON trip_dates(start_date);

-- Enable RLS
ALTER TABLE trip_dates ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view trip dates"
  ON trip_dates FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage trip dates"
  ON trip_dates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 4. Trip FAQs
-- ============================================
CREATE TABLE IF NOT EXISTS trip_faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS trip_faqs_trip_id_idx ON trip_faqs(trip_id);

-- Enable RLS
ALTER TABLE trip_faqs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view trip faqs"
  ON trip_faqs FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage trip faqs"
  ON trip_faqs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 5. Trip Pricing Variations
-- ============================================
CREATE TABLE IF NOT EXISTS trip_pricing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- early_bird, group, seasonal, addon
  name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  is_percentage BOOLEAN DEFAULT true,
  conditions TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS trip_pricing_trip_id_idx ON trip_pricing(trip_id);

-- Enable RLS
ALTER TABLE trip_pricing ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view trip pricing"
  ON trip_pricing FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage trip pricing"
  ON trip_pricing FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
