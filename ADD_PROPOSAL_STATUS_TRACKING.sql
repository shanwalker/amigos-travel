-- ============================================================================
-- ADD PROPOSAL STATUS TRACKING
-- ============================================================================
-- This migration adds status tracking to trip_proposals table to enable
-- admin-to-user proposal workflow with accept/decline functionality

-- 1. Add status tracking columns
ALTER TABLE trip_proposals
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' 
  CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'declined')),
ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS viewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS responded_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS response_notes TEXT,
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- 2. Add index for performance (user_id + status queries)
CREATE INDEX IF NOT EXISTS idx_proposals_user_status 
  ON trip_proposals(user_id, status);

-- 3. Add index for admin queries (status + created_at)
CREATE INDEX IF NOT EXISTS idx_proposals_status_created 
  ON trip_proposals(status, created_at DESC);

-- 4. Update existing proposals to 'sent' status
UPDATE trip_proposals 
SET status = 'sent', sent_at = created_at 
WHERE status IS NULL;

-- 5. Update RLS policies for user access

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Users view own proposals" ON trip_proposals;
DROP POLICY IF EXISTS "Users update own proposal status" ON trip_proposals;
DROP POLICY IF EXISTS "Admins manage all proposals" ON trip_proposals;

-- Users can view their own proposals
CREATE POLICY "Users view own proposals"
ON trip_proposals FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can update their own proposal status (accept/decline)
CREATE POLICY "Users update own proposal status"
ON trip_proposals FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  -- Only allow updating specific fields
  auth.uid() = user_id
);

-- Admins can manage all proposals
CREATE POLICY "Admins manage all proposals"
ON trip_proposals FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'
  )
);

-- 6. Verification queries

-- Check columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'trip_proposals'
AND column_name IN ('status', 'sent_at', 'viewed_at', 'responded_at', 'response_notes', 'admin_notes')
ORDER BY column_name;

-- Check indexes were created
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'trip_proposals'
AND indexname LIKE 'idx_proposals%';

-- Check policies
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'trip_proposals'
ORDER BY policyname;

-- Check existing proposals
SELECT 
    id,
    user_id,
    destination_name,
    status,
    sent_at,
    created_at
FROM trip_proposals
LIMIT 5;

SELECT '✅ Proposal status tracking added successfully!' as message;
