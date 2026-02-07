-- Fix RLS: Remove the conflicting "Users can view own proposals" policy
-- Keep only the public access policy

DROP POLICY IF EXISTS "Users can view own proposals" ON trip_proposals;

-- Verify only the public policy remains
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'trip_proposals'
AND cmd = 'SELECT';
