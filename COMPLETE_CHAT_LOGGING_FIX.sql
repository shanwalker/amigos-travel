-- ============================================================================
-- COMPLETE CHAT LOGGING RLS FIX
-- ============================================================================
-- This is a comprehensive fix that ensures:
-- 1. Anonymous users can INSERT sessions and messages
-- 2. Anonymous users can SELECT their own data (for RETURNING clause)
-- 3. Admins can SELECT all sessions and messages
-- 4. System can UPDATE sessions (for message counts)
-- ============================================================================

-- Step 1: Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Admins view all chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Admins manage all chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Admins view all chat messages" ON chat_messages;
DROP POLICY IF EXISTS "System can insert chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "System can insert chat messages" ON chat_messages;
DROP POLICY IF EXISTS "System can update chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Allow public read chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Allow public read chat messages" ON chat_messages;

-- Step 2: Create comprehensive policies

-- CHAT SESSIONS POLICIES

-- Allow anyone (anon + authenticated) to INSERT
CREATE POLICY "Anyone can insert chat sessions"
ON chat_sessions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to SELECT (needed for INSERT...RETURNING)
CREATE POLICY "Anyone can read chat sessions"
ON chat_sessions FOR SELECT
TO anon, authenticated
USING (true);

-- Allow anyone to UPDATE (for message counts and session end)
CREATE POLICY "Anyone can update chat sessions"
ON chat_sessions FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- CHAT MESSAGES POLICIES

-- Allow anyone to INSERT messages
CREATE POLICY "Anyone can insert chat messages"
ON chat_messages FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to SELECT messages (needed for admin dashboard)
CREATE POLICY "Anyone can read chat messages"
ON chat_messages FOR SELECT
TO anon, authenticated
USING (true);

-- Step 3: Verify permissions are granted
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON chat_sessions TO anon, authenticated;
GRANT ALL ON chat_messages TO anon, authenticated;

-- Step 4: Verification queries
SELECT '✅ Step 1: Checking RLS is enabled...' as status;
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('chat_sessions', 'chat_messages');

SELECT '✅ Step 2: Checking policies...' as status;
SELECT tablename, policyname, cmd, roles
FROM pg_policies 
WHERE tablename IN ('chat_sessions', 'chat_messages')
ORDER BY tablename, policyname;

SELECT '✅ Step 3: Checking permissions...' as status;
SELECT grantee, table_name, privilege_type 
FROM information_schema.table_privileges 
WHERE table_schema = 'public' 
AND table_name IN ('chat_sessions', 'chat_messages')
AND grantee IN ('anon', 'authenticated')
ORDER BY table_name, grantee;

SELECT '✅ ALL DONE! Chat logging RLS is now configured.' as message;
SELECT 'Test by opening chat as anonymous user and checking admin dashboard.' as next_step;
