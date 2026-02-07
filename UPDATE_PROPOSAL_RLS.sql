-- Update RLS Policies to Allow Public Read Access to Published Proposals
-- This allows anyone to view proposals without authentication

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Users can view their own proposals" ON trip_proposals;

-- Create new policy that allows public read for published proposals
CREATE POLICY "Public can view published proposals"
ON trip_proposals FOR SELECT
USING (status = 'published');

-- Keep the insert/update policies for authenticated users only
DROP POLICY IF EXISTS "Admins can insert proposals" ON trip_proposals;
CREATE POLICY "Authenticated users can insert proposals"
ON trip_proposals FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can update proposals" ON trip_proposals;
CREATE POLICY "Authenticated users can update proposals"
ON trip_proposals FOR UPDATE
TO authenticated
USING (true);

-- Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'trip_proposals';
