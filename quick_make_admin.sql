-- ⚡ QUICK ADMIN SETUP - Copy & Paste This Entire Block
-- Run this in Supabase SQL Editor to make shanwalkermail@gmail.com an admin

-- Single command to make user admin (works even if user doesn't exist in tables yet)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'shanwalkermail@gmail.com'
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin', updated_at = NOW();

-- Update profile table
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'shanwalkermail@gmail.com'
ON CONFLICT (id) 
DO UPDATE SET role = 'admin', updated_at = NOW();

-- Verify (should show 'admin' for both roles)
SELECT 
    u.email,
    ur.role as user_roles_table,
    p.role as profiles_table,
    CASE 
        WHEN ur.role = 'admin' AND p.role = 'admin' THEN '✅ SUCCESS - User is now admin!'
        ELSE '❌ FAILED - Check if user exists'
    END as status
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'shanwalkermail@gmail.com';
