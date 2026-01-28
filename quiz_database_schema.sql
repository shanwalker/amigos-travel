-- Travel Amigo Redesign - Database Schema
-- This SQL file sets up the necessary tables for the quiz and result pages

-- ============================================================================
-- QUIZ RESPONSES TABLE
-- Stores all quiz submissions with user preferences
-- ============================================================================

CREATE TABLE IF NOT EXISTS quiz_responses (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- User Information
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  phone TEXT,
  name TEXT,
  
  -- Quiz Answers
  personality TEXT NOT NULL CHECK (personality IN ('relaxer', 'explorer', 'culture_seeker', 'night_owl')),
  interests JSONB NOT NULL DEFAULT '[]'::jsonb,
  travel_dates JSONB, -- Flexible: can be {month: "June"} or {startDate: "2026-06-01", endDate: "2026-06-10"}
  duration TEXT NOT NULL CHECK (duration IN ('3-5', '5-7', '7-10', '10+')),
  budget_min INTEGER NOT NULL,
  budget_max INTEGER NOT NULL,
  travel_style TEXT NOT NULL CHECK (travel_style IN ('solo', 'couple', 'family', 'friends', 'group')),
  
  -- Result Type (Branching Logic)
  result_type TEXT NOT NULL CHECK (result_type IN ('matched', 'surprise', 'custom')),
  
  -- Matched Trip (if result_type = 'matched')
  matched_trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
  
  -- Status Tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'booked', 'cancelled')),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes for common queries
  CONSTRAINT valid_budget CHECK (budget_min <= budget_max)
);

-- Create indexes for performance
CREATE INDEX idx_quiz_responses_user_id ON quiz_responses(user_id);
CREATE INDEX idx_quiz_responses_email ON quiz_responses(email);
CREATE INDEX idx_quiz_responses_result_type ON quiz_responses(result_type);
CREATE INDEX idx_quiz_responses_status ON quiz_responses(status);
CREATE INDEX idx_quiz_responses_created_at ON quiz_responses(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_quiz_responses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quiz_responses_updated_at
  BEFORE UPDATE ON quiz_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_quiz_responses_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own quiz responses
CREATE POLICY "Users can view own quiz responses"
  ON quiz_responses
  FOR SELECT
  USING (auth.uid() = user_id OR email = auth.email());

-- Policy: Anyone can insert quiz responses (for anonymous users)
CREATE POLICY "Anyone can insert quiz responses"
  ON quiz_responses
  FOR INSERT
  WITH CHECK (true);

-- Policy: Users can update their own quiz responses
CREATE POLICY "Users can update own quiz responses"
  ON quiz_responses
  FOR UPDATE
  USING (auth.uid() = user_id OR email = auth.email());

-- Policy: Admins can view all quiz responses
CREATE POLICY "Admins can view all quiz responses"
  ON quiz_responses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Policy: Admins can update all quiz responses
CREATE POLICY "Admins can update all quiz responses"
  ON quiz_responses
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- ============================================================================
-- QUIZ ANALYTICS TABLE (Optional - for tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS quiz_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_response_id UUID REFERENCES quiz_responses(id) ON DELETE CASCADE,
  
  -- Tracking Data
  step_number INTEGER NOT NULL CHECK (step_number BETWEEN 1 AND 6),
  time_spent_seconds INTEGER,
  dropped_off BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quiz_analytics_quiz_response_id ON quiz_analytics(quiz_response_id);
CREATE INDEX idx_quiz_analytics_step_number ON quiz_analytics(step_number);

-- ============================================================================
-- SAMPLE QUERIES FOR ADMIN DASHBOARD
-- ============================================================================

-- Get all quiz responses with user details
-- SELECT 
--   qr.*,
--   p.full_name,
--   p.avatar_url
-- FROM quiz_responses qr
-- LEFT JOIN profiles p ON qr.user_id = p.id
-- ORDER BY qr.created_at DESC;

-- Get quiz completion rate by step
-- SELECT 
--   step_number,
--   COUNT(*) as total_attempts,
--   COUNT(*) FILTER (WHERE dropped_off = false) as completions,
--   ROUND(100.0 * COUNT(*) FILTER (WHERE dropped_off = false) / COUNT(*), 2) as completion_rate
-- FROM quiz_analytics
-- GROUP BY step_number
-- ORDER BY step_number;

-- Get most popular personality types
-- SELECT 
--   personality,
--   COUNT(*) as count,
--   ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage
-- FROM quiz_responses
-- GROUP BY personality
-- ORDER BY count DESC;

-- Get most popular interests
-- SELECT 
--   interest,
--   COUNT(*) as count
-- FROM quiz_responses,
-- LATERAL jsonb_array_elements_text(interests) as interest
-- GROUP BY interest
-- ORDER BY count DESC;

-- Get average budget by travel style
-- SELECT 
--   travel_style,
--   ROUND(AVG((budget_min + budget_max) / 2)) as avg_budget,
--   COUNT(*) as count
-- FROM quiz_responses
-- GROUP BY travel_style
-- ORDER BY avg_budget DESC;

-- Get result type distribution
-- SELECT 
--   result_type,
--   COUNT(*) as count,
--   ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage
-- FROM quiz_responses
-- GROUP BY result_type
-- ORDER BY count DESC;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE ON quiz_responses TO authenticated;
GRANT SELECT, INSERT ON quiz_analytics TO authenticated;

-- Grant full access to service role (for admin operations)
GRANT ALL ON quiz_responses TO service_role;
GRANT ALL ON quiz_analytics TO service_role;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE quiz_responses IS 'Stores all travel profile quiz submissions';
COMMENT ON COLUMN quiz_responses.personality IS 'User travel personality: relaxer, explorer, culture_seeker, or night_owl';
COMMENT ON COLUMN quiz_responses.interests IS 'Array of selected interests (culture, adventure, food, etc.)';
COMMENT ON COLUMN quiz_responses.travel_dates IS 'Flexible date storage: can be month or specific dates';
COMMENT ON COLUMN quiz_responses.duration IS 'Trip duration preference: 3-5, 5-7, 7-10, or 10+ days';
COMMENT ON COLUMN quiz_responses.result_type IS 'Type of result shown: matched, surprise, or custom';
COMMENT ON COLUMN quiz_responses.matched_trip_id IS 'Reference to matched trip (if result_type = matched)';
COMMENT ON COLUMN quiz_responses.status IS 'Current status: pending, contacted, booked, or cancelled';

COMMENT ON TABLE quiz_analytics IS 'Tracks quiz completion and drop-off rates';
COMMENT ON COLUMN quiz_analytics.step_number IS 'Quiz step number (1-6)';
COMMENT ON COLUMN quiz_analytics.time_spent_seconds IS 'Time spent on this step';
COMMENT ON COLUMN quiz_analytics.dropped_off IS 'Whether user dropped off at this step';
