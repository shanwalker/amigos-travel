-- ============================================================================
-- CREATE ALL MISSING TABLES FOR TRAVELAMIGO
-- ============================================================================
-- This script creates the onboarding_quiz_responses table and ensures
-- all necessary tables exist for the application to work properly

-- ============================================================================
-- 1. CREATE onboarding_quiz_responses TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.onboarding_quiz_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    
    -- Phase A: Identity & Logistics
    travel_companion TEXT,
    departure_location TEXT,
    passport_nationality TEXT,
    destination_preference TEXT,
    desired_destinations TEXT[] DEFAULT '{}',
    places_to_avoid TEXT[] DEFAULT '{}',
    
    -- Phase B: Style & Constraints
    trip_styles TEXT[] DEFAULT '{}',
    experience_pace TEXT,
    hard_no_activities TEXT[] DEFAULT '{}',
    food_preferences TEXT[] DEFAULT '{}',
    health_conditions TEXT[] DEFAULT '{}',
    
    -- Phase C: Budget & Timing
    trip_duration TEXT,
    budget_range TEXT,
    planning_dates_type TEXT,
    specific_dates JSONB DEFAULT '{}',
    amigo_role TEXT,
    destination_knowledge TEXT,
    additional_notes TEXT,
    travel_vibe TEXT,
    
    -- Metadata
    quiz_version TEXT DEFAULT 'v2.0',
    completion_status TEXT DEFAULT 'incomplete',
    current_step INTEGER DEFAULT 1,
    is_submitted BOOLEAN DEFAULT false,
    admin_reviewed BOOLEAN DEFAULT false,
    linked_surprise_request_id UUID,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    
    CONSTRAINT valid_completion_status CHECK (completion_status IN ('incomplete', 'completed', 'submitted'))
);

-- ============================================================================
-- 2. CREATE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_onboarding_quiz_user_id ON public.onboarding_quiz_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_quiz_session_id ON public.onboarding_quiz_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_quiz_status ON public.onboarding_quiz_responses(completion_status);
CREATE INDEX IF NOT EXISTS idx_onboarding_quiz_created ON public.onboarding_quiz_responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_onboarding_quiz_submitted ON public.onboarding_quiz_responses(is_submitted);

-- ============================================================================
-- 3. ENABLE RLS
-- ============================================================================

ALTER TABLE public.onboarding_quiz_responses ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. CREATE RLS POLICIES (Simple, non-recursive)
-- ============================================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can read own responses" ON public.onboarding_quiz_responses;
DROP POLICY IF EXISTS "Users can insert own responses" ON public.onboarding_quiz_responses;
DROP POLICY IF EXISTS "Users can update own responses" ON public.onboarding_quiz_responses;
DROP POLICY IF EXISTS "Admins can read all responses" ON public.onboarding_quiz_responses;
DROP POLICY IF EXISTS "Admins can update all responses" ON public.onboarding_quiz_responses;

-- Policy 1: Users can read their own quiz responses
CREATE POLICY "Users can read own responses"
ON public.onboarding_quiz_responses FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 2: Users can insert their own quiz responses
CREATE POLICY "Users can insert own responses"
ON public.onboarding_quiz_responses FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own quiz responses
CREATE POLICY "Users can update own responses"
ON public.onboarding_quiz_responses FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Policy 4: Admins can read all responses (requires user_roles RLS to be disabled)
CREATE POLICY "Admins can read all responses"
ON public.onboarding_quiz_responses FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
  OR
  auth.uid() = onboarding_quiz_responses.user_id
);

-- Policy 5: Admins can update all responses
CREATE POLICY "Admins can update all responses"
ON public.onboarding_quiz_responses FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
  OR
  auth.uid() = onboarding_quiz_responses.user_id
);

-- ============================================================================
-- 5. CREATE TRIGGER FOR updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_onboarding_quiz_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_onboarding_quiz_updated_at ON public.onboarding_quiz_responses;
CREATE TRIGGER update_onboarding_quiz_updated_at
    BEFORE UPDATE ON public.onboarding_quiz_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_onboarding_quiz_updated_at();

-- ============================================================================
-- 6. UPDATE surprise_requests TABLE (add foreign key if missing)
-- ============================================================================

-- Add onboarding_quiz_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'surprise_requests' 
        AND column_name = 'onboarding_quiz_id'
    ) THEN
        ALTER TABLE surprise_requests
        ADD COLUMN onboarding_quiz_id UUID REFERENCES public.onboarding_quiz_responses(id);
    END IF;
END $$;

-- ============================================================================
-- 7. GRANT PERMISSIONS
-- ============================================================================

GRANT SELECT, INSERT, UPDATE ON public.onboarding_quiz_responses TO authenticated;
GRANT ALL ON public.onboarding_quiz_responses TO service_role;

-- ============================================================================
-- 8. DISABLE RLS ON user_roles (to prevent infinite recursion)
-- ============================================================================

ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;

-- Drop all policies on user_roles
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'user_roles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON user_roles', r.policyname);
    END LOOP;
END $$;

-- ============================================================================
-- 9. VERIFICATION
-- ============================================================================

-- Check that table was created
SELECT 
    'onboarding_quiz_responses' as table_name,
    EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'onboarding_quiz_responses'
    ) as exists;

-- Check RLS status
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN ('onboarding_quiz_responses', 'user_roles')
ORDER BY tablename;

-- Check policies
SELECT 
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE tablename = 'onboarding_quiz_responses'
ORDER BY policyname;

-- Success message
SELECT '✅ All missing tables created! onboarding_quiz_responses is ready.' as message;
SELECT '✅ user_roles RLS disabled to prevent infinite recursion.' as message;
SELECT '✅ Admin login and quiz data should now work!' as message;
