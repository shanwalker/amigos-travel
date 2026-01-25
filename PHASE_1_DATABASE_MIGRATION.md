# Phase 1: Database Migration - Trip Types System

Run this SQL in your Supabase Dashboard → SQL Editor:

```sql
-- =====================================================
-- Travel Amigo - Trip Types System Migration
-- Phase 1: Database Schema Setup
-- =====================================================

-- Create enums for trip types and statuses
DO $$ BEGIN
    CREATE TYPE trip_type AS ENUM ('surprise', 'group_fixed', 'group_reservable', 'standard', 'custom');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE trip_status AS ENUM ('draft', 'active', 'confirmed', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE request_status AS ENUM ('pending', 'matched', 'planning', 'confirmed', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'refunded', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- UPDATE trips table with new columns
-- =====================================================
ALTER TABLE trips 
ADD COLUMN IF NOT EXISTS trip_type trip_type DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS min_budget numeric,
ADD COLUMN IF NOT EXISTS max_budget numeric,
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS min_reservations integer DEFAULT 5,
ADD COLUMN IF NOT EXISTS reservation_fee numeric DEFAULT 999,
ADD COLUMN IF NOT EXISTS reservation_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS status trip_status DEFAULT 'active';

-- =====================================================
-- UPDATE profiles table to support travel preferences
-- =====================================================
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS travel_preferences jsonb;

-- =====================================================
-- CREATE surprise_requests table
-- For users who want us to plan their trip
-- =====================================================
CREATE TABLE IF NOT EXISTS surprise_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    interests_data jsonb NOT NULL DEFAULT '{}',
    budget_min numeric NOT NULL,
    budget_max numeric NOT NULL,
    preferred_dates text,
    flexible_dates boolean DEFAULT true,
    matched_buddy_id uuid,
    assigned_trip_id uuid REFERENCES trips(id) ON DELETE SET NULL,
    status request_status DEFAULT 'pending',
    admin_notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- CREATE local_buddies table
-- For local people who can guide travelers
-- =====================================================
CREATE TABLE IF NOT EXISTS local_buddies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    location text NOT NULL,
    city text NOT NULL,
    country text NOT NULL,
    bio text,
    interests text[] DEFAULT '{}',
    has_vehicle boolean DEFAULT false,
    vehicle_type text,
    languages text[] DEFAULT '{"English"}',
    is_active boolean DEFAULT true,
    is_verified boolean DEFAULT false,
    rating numeric DEFAULT 0,
    total_trips integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id)
);

-- Add foreign key for matched_buddy_id after local_buddies table exists
DO $$ BEGIN
    ALTER TABLE surprise_requests
    ADD CONSTRAINT fk_matched_buddy
    FOREIGN KEY (matched_buddy_id) REFERENCES local_buddies(id) ON DELETE SET NULL;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- CREATE trip_reservations table
-- For reservable group trips
-- =====================================================
CREATE TABLE IF NOT EXISTS trip_reservations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reservation_fee_paid boolean DEFAULT false,
    preferred_dates jsonb,
    status reservation_status DEFAULT 'pending',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(trip_id, user_id)
);

-- =====================================================
-- CREATE custom_trip_requests table
-- For fully customized trips
-- =====================================================
CREATE TABLE IF NOT EXISTS custom_trip_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    requirements jsonb NOT NULL DEFAULT '{}',
    budget_min numeric NOT NULL,
    budget_max numeric NOT NULL,
    num_travelers integer DEFAULT 1,
    preferred_dates text,
    flexible_dates boolean DEFAULT true,
    status request_status DEFAULT 'pending',
    assigned_trip_id uuid REFERENCES trips(id) ON DELETE SET NULL,
    admin_notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- =====================================================
-- ENABLE RLS on all new tables
-- =====================================================
ALTER TABLE surprise_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_buddies ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_trip_requests ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES for surprise_requests
-- =====================================================
CREATE POLICY "Users can view own surprise requests"
ON surprise_requests FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create surprise requests"
ON surprise_requests FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own pending requests"
ON surprise_requests FOR UPDATE
TO authenticated
USING (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can view all surprise requests"
ON surprise_requests FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update surprise requests"
ON surprise_requests FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- RLS POLICIES for local_buddies
-- =====================================================
CREATE POLICY "Anyone can view verified buddies"
ON local_buddies FOR SELECT
TO authenticated
USING (is_verified = true AND is_active = true);

CREATE POLICY "Users can view own buddy profile"
ON local_buddies FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create buddy profile"
ON local_buddies FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own buddy profile"
ON local_buddies FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all buddies"
ON local_buddies FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update buddies"
ON local_buddies FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- RLS POLICIES for trip_reservations
-- =====================================================
CREATE POLICY "Users can view own reservations"
ON trip_reservations FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create reservations"
ON trip_reservations FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can cancel own pending reservations"
ON trip_reservations FOR DELETE
TO authenticated
USING (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can view all reservations"
ON trip_reservations FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reservations"
ON trip_reservations FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- RLS POLICIES for custom_trip_requests
-- =====================================================
CREATE POLICY "Users can view own custom requests"
ON custom_trip_requests FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create custom requests"
ON custom_trip_requests FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own pending custom requests"
ON custom_trip_requests FOR UPDATE
TO authenticated
USING (user_id = auth.uid() AND status = 'pending');

CREATE POLICY "Admins can view all custom requests"
ON custom_trip_requests FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update custom requests"
ON custom_trip_requests FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- TRIGGERS for updated_at timestamps
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_surprise_requests_updated_at ON surprise_requests;
CREATE TRIGGER update_surprise_requests_updated_at
    BEFORE UPDATE ON surprise_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_trip_reservations_updated_at ON trip_reservations;
CREATE TRIGGER update_trip_reservations_updated_at
    BEFORE UPDATE ON trip_reservations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_custom_trip_requests_updated_at ON custom_trip_requests;
CREATE TRIGGER update_custom_trip_requests_updated_at
    BEFORE UPDATE ON custom_trip_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TRIGGER to update reservation_count on trips
-- =====================================================
CREATE OR REPLACE FUNCTION update_trip_reservation_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE trips SET reservation_count = reservation_count + 1 WHERE id = NEW.trip_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE trips SET reservation_count = reservation_count - 1 WHERE id = OLD.trip_id;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_reservation_count ON trip_reservations;
CREATE TRIGGER update_reservation_count
    AFTER INSERT OR DELETE ON trip_reservations
    FOR EACH ROW EXECUTE FUNCTION update_trip_reservation_count();

-- =====================================================
-- INDEXES for better query performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_trips_trip_type ON trips(trip_type);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_category ON trips(category);
CREATE INDEX IF NOT EXISTS idx_trips_featured ON trips(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_surprise_requests_user ON surprise_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_surprise_requests_status ON surprise_requests(status);
CREATE INDEX IF NOT EXISTS idx_local_buddies_location ON local_buddies(city, country);
CREATE INDEX IF NOT EXISTS idx_local_buddies_verified ON local_buddies(is_verified, is_active);
CREATE INDEX IF NOT EXISTS idx_trip_reservations_trip ON trip_reservations(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_reservations_user ON trip_reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_trip_requests_user ON custom_trip_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_trip_requests_status ON custom_trip_requests(status);
```

## What This Migration Creates

### New Enums
- `trip_type` - surprise, group_fixed, group_reservable, standard, custom
- `trip_status` - draft, active, confirmed, completed, cancelled
- `request_status` - pending, matched, planning, confirmed, completed, cancelled
- `reservation_status` - pending, confirmed, refunded, cancelled

### Updated Tables
- `trips` - Added trip_type, category, budget fields, featured flag, reservation tracking
- `profiles` - Added travel_preferences JSONB column

### New Tables
- `surprise_requests` - For "Surprise Me" trip requests with local buddy matching
- `local_buddies` - Network of local guides with vehicle/language info
- `trip_reservations` - Reservations for group trips with ₹999 fee tracking
- `custom_trip_requests` - Fully customized trip requests

### Security
- RLS enabled on all new tables
- Users can only see/modify their own data
- Admins can view and manage all data
- Proper indexes for performance
