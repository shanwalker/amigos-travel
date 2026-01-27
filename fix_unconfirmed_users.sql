-- ============================================
-- FIX: Email Not Confirmed Error
-- ============================================
-- This script confirms all unconfirmed users
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Confirm all unconfirmed users
UPDATE auth.users
SET 
  confirmed_at = NOW(),
  email_confirmed_at = NOW()
WHERE 
  confirmed_at IS NULL 
  OR email_confirmed_at IS NULL;

-- Step 2: Verify the fix worked
SELECT 
  id,
  email,
  confirmed_at,
  email_confirmed_at,
  created_at,
  CASE 
    WHEN confirmed_at IS NOT NULL THEN '✅ Confirmed'
    ELSE '❌ Not Confirmed'
  END as status
FROM auth.users
ORDER BY created_at DESC
LIMIT 20;

-- Step 3: Check how many users were updated
SELECT 
  COUNT(*) as total_users,
  COUNT(confirmed_at) as confirmed_users,
  COUNT(*) - COUNT(confirmed_at) as unconfirmed_users
FROM auth.users;

-- ============================================
-- EXPECTED RESULT:
-- All users should now have confirmed_at and email_confirmed_at timestamps
-- Status column should show "✅ Confirmed" for all users
-- ============================================
