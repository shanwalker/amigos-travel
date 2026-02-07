-- ============================================================================
-- PROMOTE USER TO ADMIN
-- ============================================================================
-- Run this in the Supabase SQL Editor to give admin privileges to a specific user.

DO $$
DECLARE
  target_email TEXT := 'sravan@thetravelamigo.com';
  target_user_id UUID;
BEGIN
  -- 1. Get the user ID from auth.users
  SELECT id INTO target_user_id FROM auth.users WHERE email = target_email;

  -- 2. Verify user exists
  IF target_user_id IS NULL THEN
    RAISE NOTICE '❌ User % not found! Please ask them to sign up first.', target_email;
    RETURN;
  END IF;

  -- 3. Assign ADMIN role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- 4. Verify/Create Profile (Just in case)
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (target_user_id, target_email, 'Admin User')
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

  RAISE NOTICE '✅ SUCCESS: User % is now an ADMIN.', target_email;
END $$;
