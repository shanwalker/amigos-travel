-- ============================================
-- EXPORT DATA FROM OLD SUPABASE DATABASE
-- ============================================
-- Run this in OLD database: whdbtkkgesfgqtkfedne.supabase.co
-- Copy the results and use in import_new_data.sql
-- ============================================

-- Step 1: Export Profiles
-- ============================================
SELECT 
    'INSERT INTO profiles (id, email, full_name, role, created_at, updated_at) VALUES' || 
    string_agg(
        format(
            '(%L, %L, %L, %L, %L, %L)',
            id,
            email,
            full_name,
            role,
            created_at,
            updated_at
        ),
        ', '
    ) || ';' AS export_profiles
FROM profiles;

-- Step 2: Export Trips (if table exists)
-- ============================================
SELECT 
    'INSERT INTO trips (id, user_id, destination, start_date, end_date, budget, status, created_at) VALUES' || 
    string_agg(
        format(
            '(%L, %L, %L, %L, %L, %L, %L, %L)',
            id,
            user_id,
            destination,
            start_date,
            end_date,
            budget,
            status,
            created_at
        ),
        ', '
    ) || ';' AS export_trips
FROM trips
WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'trips');

-- Step 3: Export Bookings (if table exists)
-- ============================================
SELECT 
    'INSERT INTO bookings (id, trip_id, user_id, booking_type, details, status, created_at) VALUES' || 
    string_agg(
        format(
            '(%L, %L, %L, %L, %L, %L, %L)',
            id,
            trip_id,
            user_id,
            booking_type,
            details,
            status,
            created_at
        ),
        ', '
    ) || ';' AS export_bookings
FROM bookings
WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'bookings');

-- Step 4: Export Questionnaire Responses (if table exists)
-- ============================================
SELECT 
    'INSERT INTO questionnaire_responses (id, user_id, trip_id, responses, created_at) VALUES' || 
    string_agg(
        format(
            '(%L, %L, %L, %L, %L)',
            id,
            user_id,
            trip_id,
            responses,
            created_at
        ),
        ', '
    ) || ';' AS export_questionnaire
FROM questionnaire_responses
WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'questionnaire_responses');

-- ============================================
-- DATA SUMMARY
-- ============================================
-- Get counts of all data to verify migration

SELECT 
    'profiles' as table_name,
    COUNT(*) as row_count
FROM profiles
UNION ALL
SELECT 
    'trips' as table_name,
    COUNT(*) as row_count
FROM trips
WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'trips')
UNION ALL
SELECT 
    'bookings' as table_name,
    COUNT(*) as row_count
FROM bookings
WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'bookings')
UNION ALL
SELECT 
    'questionnaire_responses' as table_name,
    COUNT(*) as row_count
FROM questionnaire_responses
WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'questionnaire_responses');

-- ============================================
-- EXPORT AUTH USERS (for reference only)
-- ============================================
-- Note: Passwords cannot be migrated
-- Users will need to reset passwords

SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    raw_user_meta_data
FROM auth.users
ORDER BY created_at;

-- ============================================
-- EXPORT TABLE SCHEMA
-- ============================================
-- Get list of all tables to verify

SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- ============================================
-- INSTRUCTIONS
-- ============================================
-- 1. Run each query above in OLD Supabase SQL Editor
-- 2. Copy the INSERT statements from results
-- 3. Save them for use in import_new_data.sql
-- 4. Note the row counts for verification
-- 5. Export auth.users list for user recreation
-- ============================================
