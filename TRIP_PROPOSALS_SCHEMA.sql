-- ============================================================================
-- TRIP PROPOSALS FEATURE - DATABASE SCHEMA
-- ============================================================================
-- Run this script in Supabase SQL Editor to add trip proposal functionality

-- 1. Create trip_proposals table
CREATE TABLE IF NOT EXISTS trip_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quiz_response_id UUID REFERENCES quiz_responses(id) ON DELETE SET NULL,
  
  -- Proposal Metadata
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'accepted', 'rejected', 'expired')),
  title TEXT NOT NULL,
  destination_name TEXT NOT NULL,
  destination_tagline TEXT,
  
  -- Hero Section
  hero_image_url TEXT,
  hero_video_url TEXT,
  
  -- User Preferences Recap (from quiz)
  matched_preferences JSONB DEFAULT '{}'::jsonb,
  
  -- Destination Details
  destination_highlights TEXT[],
  destination_description TEXT,
  weather_info TEXT,
  entry_requirements TEXT,
  medical_requirements TEXT,
  excluded_places TEXT[],
  
  -- Experiences (Array of experience objects)
  booked_experiences JSONB DEFAULT '[]'::jsonb,
  
  -- Dates & Logistics
  departure_date DATE,
  return_date DATE,
  duration_days INTEGER,
  departure_airport TEXT,
  return_airport TEXT,
  accommodation_details TEXT,
  airport_transfer_included BOOLEAN DEFAULT true,
  
  -- Pricing
  total_price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'INR',
  deposit_amount NUMERIC,
  deposit_percentage INTEGER DEFAULT 25,
  payment_deadline DATE,
  flexible_payments BOOLEAN DEFAULT true,
  
  -- CTA & Expiry
  expiry_date DATE,
  reservation_url TEXT,
  
  -- Admin Notes
  admin_notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_trip_proposals_user_id ON trip_proposals(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_proposals_status ON trip_proposals(status);
CREATE INDEX IF NOT EXISTS idx_trip_proposals_created_by ON trip_proposals(created_by);

-- 3. Enable Row Level Security
ALTER TABLE trip_proposals ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
DROP POLICY IF EXISTS "Users can view own proposals" ON trip_proposals;
CREATE POLICY "Users can view own proposals" ON trip_proposals
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all proposals" ON trip_proposals;
CREATE POLICY "Admins can manage all proposals" ON trip_proposals
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- 5. Create storage bucket for proposal images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('proposal-images', 'proposal-images', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage policies for proposal images
DROP POLICY IF EXISTS "Public can view proposal images" ON storage.objects;
CREATE POLICY "Public can view proposal images" ON storage.objects
  FOR SELECT USING (bucket_id = 'proposal-images');

DROP POLICY IF EXISTS "Admins can upload proposal images" ON storage.objects;
CREATE POLICY "Admins can upload proposal images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'proposal-images' AND
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admins can delete proposal images" ON storage.objects;
CREATE POLICY "Admins can delete proposal images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'proposal-images' AND
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- 7. Create updated_at trigger
CREATE OR REPLACE FUNCTION update_trip_proposals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trip_proposals_updated_at ON trip_proposals;
CREATE TRIGGER trip_proposals_updated_at
  BEFORE UPDATE ON trip_proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_trip_proposals_updated_at();

-- ============================================================================
-- VERIFICATION
-- ============================================================================
SELECT 'Trip Proposals schema created successfully! ✅' as message;
