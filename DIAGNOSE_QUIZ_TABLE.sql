-- ============================================================================
-- DIAGNOSTIC: Check which quiz table exists
-- ============================================================================

-- Check what tables exist in the database
SELECT 
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE '%quiz%'
ORDER BY table_name;

-- Check for quiz_responses (old table)
SELECT 
    'quiz_responses table' as table_name,
    COUNT(*) as row_count
FROM quiz_responses
WHERE true;

-- Check for onboarding_quiz_responses (new table)
SELECT 
    'onboarding_quiz_responses table' as table_name,
    COUNT(*) as row_count
FROM onboarding_quiz_responses
WHERE true;

-- Show all public tables
SELECT 
    schemaname,
    tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
