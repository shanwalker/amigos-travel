-- ============================================================================
-- SIMPLE DIAGNOSTIC: List all tables
-- ============================================================================

-- Show ALL public tables (this won't fail)
SELECT 
    schemaname,
    tablename
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
