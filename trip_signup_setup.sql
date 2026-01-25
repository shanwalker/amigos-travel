-- ============================================
-- Trip Signup Flow - Database Setup
-- ============================================
-- Run this SQL in your Supabase SQL Editor to create
-- all required tables for the trip signup flow
-- ============================================

-- 1. Add travel_preferences to profiles table
-- ============================================
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS travel_preferences JSONB;

-- 2. Create surprise_requests table
-- ============================================
CREATE TABLE IF NOT EXISTS surprise_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  budget NUMERIC,
  duration_days INTEGER,
  interests TEXT,
  preferred_climate TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS surprise_requests_user_id_idx ON surprise_requests(user_id);
CREATE INDEX IF NOT EXISTS surprise_requests_status_idx ON surprise_requests(status);

-- Enable RLS
ALTER TABLE surprise_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own surprise requests" ON surprise_requests;
DROP POLICY IF EXISTS "Users can insert own surprise requests" ON surprise_requests;
DROP POLICY IF EXISTS "Admins can view all surprise requests" ON surprise_requests;
DROP POLICY IF EXISTS "Admins can update surprise requests" ON surprise_requests;

-- Create policies
CREATE POLICY "Users can view own surprise requests"
  ON surprise_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own surprise requests"
  ON surprise_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all surprise requests"
  ON surprise_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update surprise requests"
  ON surprise_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 3. Create custom_trip_requests table
-- ============================================
CREATE TABLE IF NOT EXISTS custom_trip_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  destination TEXT,
  budget NUMERIC,
  duration_days INTEGER,
  travel_style TEXT,
  must_have_experiences TEXT,
  things_to_avoid TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS custom_trip_requests_user_id_idx ON custom_trip_requests(user_id);
CREATE INDEX IF NOT EXISTS custom_trip_requests_status_idx ON custom_trip_requests(status);

-- Enable RLS
ALTER TABLE custom_trip_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own custom trip requests" ON custom_trip_requests;
DROP POLICY IF EXISTS "Users can insert own custom trip requests" ON custom_trip_requests;
DROP POLICY IF EXISTS "Admins can view all custom trip requests" ON custom_trip_requests;
DROP POLICY IF EXISTS "Admins can update custom trip requests" ON custom_trip_requests;

-- Create policies
CREATE POLICY "Users can view own custom trip requests"
  ON custom_trip_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own custom trip requests"
  ON custom_trip_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all custom trip requests"
  ON custom_trip_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update custom trip requests"
  ON custom_trip_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 4. Create trip_reservations table (for group trips)
-- ============================================
CREATE TABLE IF NOT EXISTS trip_reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  group_size INTEGER,
  preferred_date TEXT,
  destination TEXT,
  special_requests TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS trip_reservations_user_id_idx ON trip_reservations(user_id);
CREATE INDEX IF NOT EXISTS trip_reservations_status_idx ON trip_reservations(status);

-- Enable RLS
ALTER TABLE trip_reservations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own trip reservations" ON trip_reservations;
DROP POLICY IF EXISTS "Users can insert own trip reservations" ON trip_reservations;
DROP POLICY IF EXISTS "Admins can view all trip reservations" ON trip_reservations;
DROP POLICY IF EXISTS "Admins can update trip reservations" ON trip_reservations;

-- Create policies
CREATE POLICY "Users can view own trip reservations"
  ON trip_reservations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trip reservations"
  ON trip_reservations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all trip reservations"
  ON trip_reservations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update trip reservations"
  ON trip_reservations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- Verification Queries
-- ============================================
-- Run these to verify everything was created successfully

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('surprise_requests', 'custom_trip_requests', 'trip_reservations');

-- Check if policies are enabled
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('surprise_requests', 'custom_trip_requests', 'trip_reservations');

-- Check if travel_preferences column exists in profiles
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'travel_preferences';
