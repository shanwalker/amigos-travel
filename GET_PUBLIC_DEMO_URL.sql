-- Generate Public Demo URL for a Proposal
-- Run this after creating a proposal to get the shareable public URL

SELECT 
    id as proposal_id,
    destination_name,
    status,
    CONCAT('http://localhost:8081/demo/proposal/', id) as public_demo_url,
    CONCAT('Public shareable link - No login required!') as note
FROM trip_proposals
WHERE id = '74de1f8f-e71f-4e27-aa92-1ce6a6b50284';

-- To get URLs for all published proposals:
-- SELECT 
--     id,
--     destination_name,
--     CONCAT('http://localhost:8081/demo/proposal/', id) as public_demo_url
-- FROM trip_proposals
-- WHERE status = 'published'
-- ORDER BY created_at DESC;
