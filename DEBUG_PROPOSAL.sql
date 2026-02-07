-- Verify the proposal exists and check its status
SELECT 
    id,
    user_id,
    status,
    destination_name,
    title,
    created_at
FROM trip_proposals
WHERE id = '74de1f8f-e71f-4e27-aa92-1ce6a6b50284';

-- Check current RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'trip_proposals';
