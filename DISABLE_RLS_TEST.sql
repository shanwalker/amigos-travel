-- Temporarily disable RLS to test if that's the issue
-- WARNING: This makes ALL proposals publicly readable

ALTER TABLE trip_proposals DISABLE ROW LEVEL SECURITY;

-- Test query - this should now work without any authentication
SELECT id, destination_name, status 
FROM trip_proposals 
WHERE id = '74de1f8f-e71f-4e27-aa92-1ce6a6b50284';
