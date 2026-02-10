-- ============================================================================
-- DIAGNOSE CHAT LOGGING ISSUES
-- ============================================================================
-- Run this to check if chat logging tables exist and have the right permissions
-- ============================================================================

-- 1. Check if tables exist
SELECT 'Checking if tables exist...' as step;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('chat_sessions', 'chat_messages');

-- 2. Check RLS status
SELECT 'Checking RLS status...' as step;
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('chat_sessions', 'chat_messages');

-- 3. Check existing policies
SELECT 'Checking RLS policies...' as step;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('chat_sessions', 'chat_messages')
ORDER BY tablename, policyname;

-- 4. Check if any sessions exist
SELECT 'Checking existing sessions...' as step;
SELECT COUNT(*) as total_sessions,
       COUNT(CASE WHEN is_authenticated = true THEN 1 END) as authenticated_sessions,
       COUNT(CASE WHEN is_authenticated = false THEN 1 END) as anonymous_sessions
FROM chat_sessions;

-- 5. Check recent sessions (last 24 hours)
SELECT 'Recent sessions (last 24 hours)...' as step;
SELECT id, user_id, is_authenticated, user_ip, total_messages, created_at
FROM chat_sessions
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC
LIMIT 10;

-- 6. Check permissions
SELECT 'Checking table permissions...' as step;
SELECT grantee, privilege_type 
FROM information_schema.table_privileges 
WHERE table_schema = 'public' 
AND table_name IN ('chat_sessions', 'chat_messages')
AND grantee IN ('anon', 'authenticated', 'postgres');
