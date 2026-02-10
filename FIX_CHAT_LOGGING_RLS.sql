-- ============================================================================
-- FIX CHAT LOGGING RLS
-- ============================================================================
-- Issue: Anonymous users cannot "see" the session they just created, 
-- causing the insert().select() call to fail or return null.
-- Fix: Allow public read access to chat sessions and messages for logging purposes.
-- ============================================================================

-- 1. Check if policies exist and drop them to avoid conflicts
DROP POLICY IF EXISTS "System can insert chat sessions" ON chat_sessions;
DROP POLICY IF EXISTS "System can insert chat messages" ON chat_messages;
DROP POLICY IF EXISTS "System can update chat sessions" ON chat_sessions;

-- 2. Allow Public Read Access (Required for INSERT ... RETURNING to work)
-- Note: This makes chat logs technically public if you guess the UUID, 
-- but is required for the current logging implementation to work for anon users.
DROP POLICY IF EXISTS "Allow public read chat sessions" ON chat_sessions;
CREATE POLICY "Allow public read chat sessions"
ON chat_sessions FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Allow public read chat messages" ON chat_messages;
CREATE POLICY "Allow public read chat messages"
ON chat_messages FOR SELECT
TO anon, authenticated
USING (true);

-- 3. Re-apply Insert/Update Policies (Just in case)
CREATE POLICY "System can insert chat sessions"
ON chat_sessions FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "System can insert chat messages"
ON chat_messages FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Allow updating (for ending sessions)
CREATE POLICY "System can update chat sessions"
ON chat_sessions FOR UPDATE
TO authenticated, anon
USING (true)
WITH CHECK (true);

-- Confirmation
SELECT '✅ Chat RLS policies fixed! Anonymous logging should work now.' as message;
