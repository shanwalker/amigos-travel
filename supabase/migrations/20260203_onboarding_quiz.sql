-- ============================================
-- ONBOARDING QUIZ & SURPRISE TRIP ENGINE
-- Migration: 2026-02-03
-- ============================================

-- 1. Create the new onboarding_quiz_responses table
CREATE TABLE IF NOT EXISTS public.onboarding_quiz_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    
    -- Phase A: Identity & Logistics
    travel_companion TEXT, -- 'solo', 'couple', 'family', 'friends', 'open_group'
    departure_location TEXT,
    passport_nationality TEXT, -- 'indian', 'other'
    destination_preference TEXT, -- 'in_mind', 'open'
    desired_destinations TEXT[] DEFAULT '{}',
    places_to_avoid TEXT[] DEFAULT '{}',
    
    -- Phase B: Style & Constraints
    trip_styles TEXT[] DEFAULT '{}', -- Max 3
    experience_pace TEXT, -- 'slow', 'balanced', 'full'
    hard_no_activities TEXT[] DEFAULT '{}',
    food_preferences TEXT[] DEFAULT '{}',
    health_conditions TEXT[] DEFAULT '{}',
    
    -- Phase C: Budget & Timing
    trip_duration TEXT, -- '3-5', '6-9', '10-14', 'flexible'
    budget_range TEXT, -- 'budget', 'mid-range', 'luxury', 'flexible'  
    planning_dates_type TEXT, -- 'fixed', 'flexible'
    specific_dates JSONB DEFAULT '{}',
    amigo_role TEXT, -- 'match_trips', 'custom_plan', 'match_travelers'
    destination_knowledge TEXT, -- 'tell_me', 'surprise', 'open_both'
    additional_notes TEXT,
    travel_vibe TEXT, -- 'relaxer', 'explorer', 'culture_seeker', 'night_owl', 'nature_lover', 'bit_of_everything'
    
    -- Meta
    quiz_version TEXT DEFAULT 'v2.0',
    completion_status TEXT DEFAULT 'incomplete', -- 'incomplete', 'completed', 'submitted'
    current_step INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT valid_companion CHECK (travel_companion IN ('solo', 'couple', 'family', 'friends', 'open_group')),
    CONSTRAINT valid_passport CHECK (passport_nationality IN ('indian', 'other')),
    CONSTRAINT valid_destination_pref CHECK (destination_preference IN ('in_mind', 'open')),
    CONSTRAINT valid_pace CHECK (experience_pace IN ('slow', 'balanced', 'full')),
    CONSTRAINT valid_duration CHECK (trip_duration IN ('3-5', '6-9', '10-14', 'flexible')),
    CONSTRAINT valid_budget CHECK (budget_range IN ('budget', 'mid-range', 'luxury', 'flexible')),
    CONSTRAINT valid_dates_type CHECK (planning_dates_type IN ('fixed', 'flexible')),
    CONSTRAINT valid_amigo_role CHECK (amigo_role IN ('match_trips', 'custom_plan', 'match_travelers')),
    CONSTRAINT valid_dest_knowledge CHECK (destination_knowledge IN ('tell_me', 'surprise', 'open_both')),
    CONSTRAINT valid_vibe CHECK (travel_vibe IN ('relaxer', 'explorer', 'culture_seeker', 'night_owl', 'nature_lover', 'bit_of_everything')),
    CONSTRAINT valid_status CHECK (completion_status IN ('incomplete', 'completed', 'submitted')),
    CONSTRAINT max_trip_styles CHECK (array_length(trip_styles, 1) IS NULL OR array_length(trip_styles, 1) <= 3),
    CONSTRAINT max_destinations CHECK (array_length(desired_destinations, 1) IS NULL OR array_length(desired_destinations, 1) <= 5)
);

-- 2. Enable Row Level Security
ALTER TABLE public.onboarding_quiz_responses ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
DROP POLICY IF EXISTS "Users can read own quiz responses" ON public.onboarding_quiz_responses;
CREATE POLICY "Users can read own quiz responses"
    ON public.onboarding_quiz_responses FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own quiz responses" ON public.onboarding_quiz_responses;
CREATE POLICY "Users can insert own quiz responses"
    ON public.onboarding_quiz_responses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own quiz responses" ON public.onboarding_quiz_responses;
CREATE POLICY "Users can update own quiz responses"
    ON public.onboarding_quiz_responses FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can read all quiz responses" ON public.onboarding_quiz_responses;
CREATE POLICY "Admins can read all quiz responses"
    ON public.onboarding_quiz_responses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can update all quiz responses" ON public.onboarding_quiz_responses;
CREATE POLICY "Admins can update all quiz responses"
    ON public.onboarding_quiz_responses FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_onboarding_quiz_user_id ON public.onboarding_quiz_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_quiz_session_id ON public.onboarding_quiz_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_quiz_status ON public.onboarding_quiz_responses(completion_status);
CREATE INDEX IF NOT EXISTS idx_onboarding_quiz_created ON public.onboarding_quiz_responses(created_at DESC);

-- 5. Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_onboarding_quiz_updated_at()
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
    EXECUTE FUNCTION public.update_onboarding_quiz_updated_at();

-- 6. Enhance surprise_requests table with new columns
ALTER TABLE public.surprise_requests 
ADD COLUMN IF NOT EXISTS onboarding_quiz_id UUID REFERENCES public.onboarding_quiz_responses(id),
ADD COLUMN IF NOT EXISTS trip_itinerary_url TEXT,
ADD COLUMN IF NOT EXISTS trip_pricing JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS final_destination_details JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS reveal_animation_type TEXT DEFAULT 'scratch_off',
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- 7. Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.onboarding_quiz_responses TO authenticated;
GRANT ALL ON public.onboarding_quiz_responses TO service_role;

-- ============================================
-- VERIFICATION
-- ============================================
-- Run these to verify the migration:
-- SELECT * FROM public.onboarding_quiz_responses LIMIT 1;
-- \d public.onboarding_quiz_responses
