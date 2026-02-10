-- ============================================================================
-- ADD DESTINATION REVEAL PREFERENCE TO TRIP PROPOSALS
-- ============================================================================
-- This migration adds the reveal_destination column to support conditional
-- destination reveal based on user's quiz preference

-- 1. Add reveal_destination column
ALTER TABLE trip_proposals
ADD COLUMN IF NOT EXISTS reveal_destination BOOLEAN DEFAULT true;

-- 2. Add comment for documentation
COMMENT ON COLUMN trip_proposals.reveal_destination IS 
'Controls whether destination is revealed to user. Auto-set based on quiz destinationKnowledge: tell_me=true, surprise=false, open_both=admin choice';

-- 3. Set default true for all existing proposals
UPDATE trip_proposals
SET reveal_destination = true
WHERE reveal_destination IS NULL;

-- 4. Verification
SELECT 
    id,
    destination_name,
    reveal_destination,
    quiz_response_id,
    created_at
FROM trip_proposals
ORDER BY created_at DESC
LIMIT 5;

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
SELECT 
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'trip_proposals'
AND column_name = 'reveal_destination';

-- Expected result:
-- column_name: reveal_destination
-- data_type: boolean
-- column_default: true
-- is_nullable: YES

SELECT 'Migration completed successfully! ✅' as message;
