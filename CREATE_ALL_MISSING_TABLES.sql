-- ============================================================================
-- CREATE ALL REMAINING MISSING TABLES
-- ============================================================================
-- This script creates tables that are referenced in the codebase but missing
-- from your database based on the table list you provided.
-- ============================================================================

-- Tables you HAVE:
-- ✓ blog_posts
-- ✓ bookings
-- ✓ custom_trip_requests
-- ✓ itinerary_items
-- ✓ payment_transactions
-- ✓ profiles
-- ✓ quiz_responses
-- ✓ surprise_requests
-- ✓ testimonials
-- ✓ trip_dates
-- ✓ trip_images
-- ✓ trip_pricing
-- ✓ trip_proposals
-- ✓ trips
-- ✓ user_roles
-- ✓ onboarding_quiz_responses (just created)

-- Tables you MIGHT be MISSING (checking and creating):
-- - local_buddies
-- - newsletter_subscribers
-- - newsletter_campaigns
-- - trip_faqs
-- - trip_reservations
-- - quiz_analytics

-- ============================================================================
-- 1. LOCAL BUDDIES TABLE (for the Local Buddies feature)
-- ============================================================================

CREATE TABLE IF NOT EXISTS local_buddies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic Info
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    location TEXT NOT NULL,
    bio TEXT,
    profile_image_url TEXT,
    
    -- Languages
    languages TEXT[] DEFAULT '{}',
    
    -- Availability
    available_for_transport BOOLEAN DEFAULT false,
    transport_type TEXT, -- 'car', 'bike', 'both'
    
    -- Interests/Specialties
    interests TEXT[] DEFAULT '{}',
    specialties TEXT[] DEFAULT '{}',
    
    -- Verification
    is_verified BOOLEAN DEFAULT false,
    verification_date TIMESTAMPTZ,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    
    -- Stats
    total_tours INTEGER DEFAULT 0,
    average_rating NUMERIC(3,2) DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_local_buddies_user_id ON local_buddies(user_id);
CREATE INDEX IF NOT EXISTS idx_local_buddies_location ON local_buddies(location);
CREATE INDEX IF NOT EXISTS idx_local_buddies_status ON local_buddies(status);

-- RLS for local_buddies
ALTER TABLE local_buddies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view approved buddies" ON local_buddies;
CREATE POLICY "Public can view approved buddies"
ON local_buddies FOR SELECT
USING (status = 'approved');

DROP POLICY IF EXISTS "Users can manage own buddy profile" ON local_buddies;
CREATE POLICY "Users can manage own buddy profile"
ON local_buddies FOR ALL
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all buddies" ON local_buddies;
CREATE POLICY "Admins can manage all buddies"
ON local_buddies FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    )
);

-- ============================================================================
-- 2. NEWSLETTER SUBSCRIBERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    source TEXT, -- 'website', 'quiz', 'booking', etc.
    preferences JSONB DEFAULT '{}',
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);

-- RLS for newsletter_subscribers
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage subscribers" ON newsletter_subscribers;
CREATE POLICY "Admins can manage subscribers"
ON newsletter_subscribers FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    )
);

-- ============================================================================
-- 3. NEWSLETTER CAMPAIGNS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS newsletter_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'cancelled')),
    scheduled_for TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    sent_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_status ON newsletter_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_scheduled ON newsletter_campaigns(scheduled_for);

-- RLS for newsletter_campaigns
ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage campaigns" ON newsletter_campaigns;
CREATE POLICY "Admins can manage campaigns"
ON newsletter_campaigns FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    )
);

-- ============================================================================
-- 4. TRIP FAQs TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS trip_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trip_faqs_trip_id ON trip_faqs(trip_id);

-- RLS for trip_faqs
ALTER TABLE trip_faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view trip FAQs" ON trip_faqs;
CREATE POLICY "Public can view trip FAQs"
ON trip_faqs FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can manage trip FAQs" ON trip_faqs;
CREATE POLICY "Admins can manage trip FAQs"
ON trip_faqs FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    )
);

-- ============================================================================
-- 5. TRIP RESERVATIONS TABLE (if different from bookings)
-- ============================================================================

CREATE TABLE IF NOT EXISTS trip_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
    
    -- Reservation Details
    reservation_code TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'expired')),
    
    -- Traveler Info
    number_of_travelers INTEGER NOT NULL,
    traveler_names JSONB DEFAULT '[]',
    
    -- Dates
    travel_date DATE,
    reservation_expires_at TIMESTAMPTZ,
    
    -- Pricing
    total_amount NUMERIC NOT NULL,
    deposit_paid NUMERIC DEFAULT 0,
    
    -- Notes
    special_requests TEXT,
    admin_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON trip_reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_trip_id ON trip_reservations(trip_id);
CREATE INDEX IF NOT EXISTS idx_reservations_code ON trip_reservations(reservation_code);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON trip_reservations(status);

-- RLS for trip_reservations
ALTER TABLE trip_reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own reservations" ON trip_reservations;
CREATE POLICY "Users can view own reservations"
ON trip_reservations FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own reservations" ON trip_reservations;
CREATE POLICY "Users can create own reservations"
ON trip_reservations FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all reservations" ON trip_reservations;
CREATE POLICY "Admins can manage all reservations"
ON trip_reservations FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    )
);

-- ============================================================================
-- 6. QUIZ ANALYTICS TABLE (for tracking quiz metrics)
-- ============================================================================

CREATE TABLE IF NOT EXISTS quiz_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quiz_responses(id) ON DELETE CASCADE,
    
    -- Metrics
    completion_time_seconds INTEGER,
    steps_completed INTEGER,
    steps_skipped INTEGER,
    
    -- User Journey
    entry_source TEXT, -- 'homepage', 'signup', 'direct', etc.
    device_type TEXT, -- 'mobile', 'tablet', 'desktop'
    
    -- Conversion
    converted_to_booking BOOLEAN DEFAULT false,
    conversion_date TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_analytics_quiz_id ON quiz_analytics(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_analytics_converted ON quiz_analytics(converted_to_booking);

-- RLS for quiz_analytics
ALTER TABLE quiz_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view analytics" ON quiz_analytics;
CREATE POLICY "Admins can view analytics"
ON quiz_analytics FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    )
);

-- ============================================================================
-- 7. ADD MISSING COLUMN TO onboarding_quiz_responses
-- ============================================================================

-- Add is_submitted column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'onboarding_quiz_responses' 
        AND column_name = 'is_submitted'
    ) THEN
        ALTER TABLE onboarding_quiz_responses
        ADD COLUMN is_submitted BOOLEAN DEFAULT false;
        
        -- Update existing records
        UPDATE onboarding_quiz_responses
        SET is_submitted = (completion_status = 'submitted');
    END IF;
END $$;

-- ============================================================================
-- 8. CREATE UPDATED_AT TRIGGERS FOR NEW TABLES
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
DROP TRIGGER IF EXISTS update_local_buddies_updated_at ON local_buddies;
CREATE TRIGGER update_local_buddies_updated_at
    BEFORE UPDATE ON local_buddies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_newsletter_campaigns_updated_at ON newsletter_campaigns;
CREATE TRIGGER update_newsletter_campaigns_updated_at
    BEFORE UPDATE ON newsletter_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_trip_faqs_updated_at ON trip_faqs;
CREATE TRIGGER update_trip_faqs_updated_at
    BEFORE UPDATE ON trip_faqs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_trip_reservations_updated_at ON trip_reservations;
CREATE TRIGGER update_trip_reservations_updated_at
    BEFORE UPDATE ON trip_reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 9. VERIFICATION
-- ============================================================================

-- List all tables
SELECT 
    schemaname,
    tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Count rows in new tables
SELECT 'local_buddies' as table_name, COUNT(*) as row_count FROM local_buddies
UNION ALL
SELECT 'newsletter_subscribers', COUNT(*) FROM newsletter_subscribers
UNION ALL
SELECT 'newsletter_campaigns', COUNT(*) FROM newsletter_campaigns
UNION ALL
SELECT 'trip_faqs', COUNT(*) FROM trip_faqs
UNION ALL
SELECT 'trip_reservations', COUNT(*) FROM trip_reservations
UNION ALL
SELECT 'quiz_analytics', COUNT(*) FROM quiz_analytics;

SELECT '✅ All missing tables created successfully!' as message;
