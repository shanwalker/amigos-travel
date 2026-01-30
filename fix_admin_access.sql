-- ⚡ CORRECTED ADMIN SETUP
-- Only targets the 'user_roles' table
-- ==========================================

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'shanwalkermail@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Verification
SELECT 
    u.email,
    ur.role
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'shanwalkermail@gmail.com';
