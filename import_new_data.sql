-- ============================================
-- IMPORT DATA TO NEW SUPABASE DATABASE
-- ============================================
-- Run this in NEW database: mqkazvelueppcravkdsc.supabase.co
-- IMPORTANT: Run setup scripts FIRST before importing data
-- ============================================

-- ============================================
-- STEP 0: VERIFY SCHEMA EXISTS
-- ============================================
-- Make sure you've run these files first:
-- 1. setup_profiles_table.sql
-- 2. supabase_rbac_setup.sql
-- 3. trip_signup_setup.sql
-- 4. SUPABASE_SETUP_COMPLETE.sql

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- ============================================
-- STEP 1: DISABLE CONSTRAINTS (TEMPORARY)
-- ============================================
-- This allows us to import data without foreign key issues

SET session_replication_role = 'replica';

-- ============================================
-- STEP 2: DISABLE RLS (TEMPORARY)
-- ============================================
-- This allows us to insert data without permission issues

ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS trips DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS questionnaire_responses DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: IMPORT PROFILES
-- ============================================
-- PASTE YOUR EXPORT DATA HERE
-- Replace this with the INSERT statement from export_old_data.sql

-- Example format (replace with your actual data):
-- INSERT INTO profiles (id, email, full_name, role, created_at, updated_at) VALUES
-- ('uuid-1', 'user1@example.com', 'User One', 'user', '2024-01-01', '2024-01-01'),
-- ('uuid-2', 'admin@example.com', 'Admin User', 'admin', '2024-01-01', '2024-01-01');

-- ⬇️ PASTE PROFILES DATA BELOW ⬇️


-- ============================================
-- STEP 4: IMPORT TRIPS
-- ============================================
-- PASTE YOUR EXPORT DATA HERE

-- ⬇️ PASTE TRIPS DATA BELOW ⬇️


-- ============================================
-- STEP 5: IMPORT BOOKINGS
-- ============================================
-- PASTE YOUR EXPORT DATA HERE

-- ⬇️ PASTE BOOKINGS DATA BELOW ⬇️


-- ============================================
-- STEP 6: IMPORT QUESTIONNAIRE RESPONSES
-- ============================================
-- PASTE YOUR EXPORT DATA HERE

-- ⬇️ PASTE QUESTIONNAIRE DATA BELOW ⬇️


-- ============================================
-- STEP 7: RE-ENABLE CONSTRAINTS
-- ============================================

SET session_replication_role = 'origin';

-- ============================================
-- STEP 8: RE-ENABLE RLS
-- ============================================

ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 9: VERIFY IMPORT
-- ============================================

-- Check row counts
SELECT 'profiles' as table_name, COUNT(*) as row_count FROM profiles
UNION ALL
SELECT 'trips' as table_name, COUNT(*) as row_count FROM trips
WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'trips')
UNION ALL
SELECT 'bookings' as table_name, COUNT(*) as row_count FROM bookings
WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'bookings')
UNION ALL
SELECT 'questionnaire_responses' as table_name, COUNT(*) as row_count FROM questionnaire_responses
WHERE EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'questionnaire_responses');

-- Check sample data
SELECT * FROM profiles LIMIT 5;

-- ============================================
-- STEP 10: RECREATE AUTH USERS
-- ============================================
-- Users need to be recreated manually or via API
-- Passwords CANNOT be migrated

-- Option A: Manual creation via Supabase Dashboard
-- 1. Go to Authentication → Users
-- 2. Click "Add User"
-- 3. Enter email and temporary password
-- 4. Send password reset email

-- Option B: Bulk user creation via API (requires service role key)
-- See: create_users_from_export.js

-- ============================================
-- VERIFICATION CHECKLIST
-- ============================================
-- [ ] All tables have data
-- [ ] Row counts match old database
-- [ ] RLS policies are enabled
-- [ ] Foreign keys are working
-- [ ] Sample queries return expected data
-- [ ] Users can be created and log in
-- ============================================

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 
    '✅ DATA IMPORT COMPLETE!' as status,
    'Verify row counts match old database' as next_step,
    'Recreate auth users manually or via API' as important_note;
