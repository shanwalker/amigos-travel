-- ============================================================================
-- FIX: Quiz Data Not Showing in Admin Panel
-- ============================================================================
-- Problem: Admin panel can't see quiz data due to RLS policies that cause
--          infinite recursion when checking user_roles
-- Solution: Disable RLS on onboarding_quiz_responses for admins OR
--           create simpler policies that don't cause recursion

-- Step 1: Check current state
SELECT 
    'Current Quiz Responses:' as info,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE is_submitted = true) as submitted_count
FROM onboarding_quiz_responses;

-- Step 2: Drop existing problematic policies on onboarding_quiz_responses
DROP POLICY IF EXISTS "Users can read own quiz responses" ON onboarding_quiz_responses;
DROP POLICY IF EXISTS "Users can insert own quiz responses" ON onboarding_quiz_responses;
DROP POLICY IF EXISTS "Users can update own quiz responses" ON onboarding_quiz_responses;
DROP POLICY IF EXISTS "Admins can read all quiz responses" ON onboarding_quiz_responses;
DROP POLICY IF EXISTS "Admins can update all quiz responses" ON onboarding_quiz_responses;

-- Step 3: Create simple, non-recursive policies

-- Policy 1: Users can read their own quiz responses
CREATE POLICY "Users can read own responses"
ON onboarding_quiz_responses FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 2: Users can insert their own quiz responses
CREATE POLICY "Users can insert own responses"
ON onboarding_quiz_responses FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own quiz responses
CREATE POLICY "Users can update own responses"
ON onboarding_quiz_responses FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Policy 4: Service role can do everything (for admin panel backend)
-- The admin panel should use service role key for queries
CREATE POLICY "Service role full access"
ON onboarding_quiz_responses FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Alternative: If you want to use authenticated role for admin
-- We need to check admin status WITHOUT causing recursion
-- This uses a direct join instead of a function

CREATE POLICY "Admins can read all responses"
ON onboarding_quiz_responses FOR SELECT
TO authenticated
USING (
  -- Allow if user is admin (direct check, no function)
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
  OR
  -- OR if it's their own response
  auth.uid() = onboarding_quiz_responses.user_id
);

CREATE POLICY "Admins can update all responses"
ON onboarding_quiz_responses FOR UPDATE
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

-- Step 4: Verify policies are created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE tablename = 'onboarding_quiz_responses'
ORDER BY policyname;

-- Step 5: Test query (what admin panel runs)
SELECT 
    id,
    user_id,
    travel_companion,
    budget_range,
    travel_vibe,
    is_submitted,
    created_at
FROM onboarding_quiz_responses
WHERE is_submitted = true
ORDER BY created_at DESC
LIMIT 5;

SELECT '✅ Quiz RLS policies fixed! Admin should now see quiz data.' as message;

-- IMPORTANT NOTE:
-- If you still get infinite recursion, it means user_roles STILL has RLS enabled
-- with policies that check user_roles. Run FIX_USER_ROLES_RECURSION.sql first!
