-- ============================================================================
-- CHECK AND FIX: Verify admin status and fix RLS issues
-- ============================================================================

-- 1. First, check if the user exists and has admin role
SELECT 
    u.id as user_id,
    u.email,
    ur.role,
    ur.created_at as role_assigned_at
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'sravan@thetravelamigo.com';

-- 2. If user doesn't have admin role, add it
-- Replace YOUR_USER_ID with the actual UUID from step 1
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Get user ID
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = 'sravan@thetravelamigo.com';
    
    -- Delete existing role if any
    DELETE FROM user_roles WHERE user_id = v_user_id;
    
    -- Insert admin role
    INSERT INTO user_roles (user_id, role)
    VALUES (v_user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Admin role assigned to user: %', v_user_id;
END $$;

-- 3. Verify RLS is disabled on user_roles
SELECT 
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'user_roles';

-- 4. If RLS is still enabled, disable it
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;

-- 5. Drop ALL policies (in case some still exist)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'user_roles'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON user_roles', r.policyname);
    END LOOP;
END $$;

-- 6. Final verification
SELECT 
    'User: ' || u.email as info,
    'Role: ' || COALESCE(ur.role, 'NO ROLE') as role_status,
    'RLS Enabled: ' || CASE WHEN t.rowsecurity THEN 'YES (BAD)' ELSE 'NO (GOOD)' END as rls_status
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
CROSS JOIN (SELECT rowsecurity FROM pg_tables WHERE tablename = 'user_roles') t
WHERE u.email = 'sravan@thetravelamigo.com';

SELECT '✅ Admin setup complete! Try logging in now.' as message;
