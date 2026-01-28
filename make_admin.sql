-- Make shanwalkermail@gmail.com an admin with full privileges
-- Run this in your Supabase SQL Editor

-- First, find the user's ID and update their role in user_roles table
-- If the user doesn't exist in user_roles, insert them
DO $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Get the user's UUID from auth.users
    SELECT id INTO user_uuid
    FROM auth.users
    WHERE email = 'shanwalkermail@gmail.com';

    -- If user exists
    IF user_uuid IS NOT NULL THEN
        -- Check if user already has a role entry
        IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = user_uuid) THEN
            -- Update existing role to admin
            UPDATE public.user_roles
            SET role = 'admin',
                updated_at = NOW()
            WHERE user_id = user_uuid;
            
            RAISE NOTICE 'Updated user % to admin role', user_uuid;
        ELSE
            -- Insert new admin role
            INSERT INTO public.user_roles (user_id, role)
            VALUES (user_uuid, 'admin');
            
            RAISE NOTICE 'Created admin role for user %', user_uuid;
        END IF;

        -- Also update the profiles table if it exists
        IF EXISTS (SELECT 1 FROM public.profiles WHERE id = user_uuid) THEN
            UPDATE public.profiles
            SET role = 'admin',
                updated_at = NOW()
            WHERE id = user_uuid;
            
            RAISE NOTICE 'Updated profile for user % to admin', user_uuid;
        ELSE
            -- Create profile if it doesn't exist
            INSERT INTO public.profiles (id, email, role)
            VALUES (user_uuid, 'shanwalkermail@gmail.com', 'admin')
            ON CONFLICT (id) DO UPDATE
            SET role = 'admin',
                updated_at = NOW();
            
            RAISE NOTICE 'Created/Updated profile for admin user %', user_uuid;
        END IF;
    ELSE
        RAISE NOTICE 'User with email shanwalkermail@gmail.com not found in auth.users';
        RAISE NOTICE 'Please make sure the user has signed up first';
    END IF;
END $$;

-- Verify the changes
SELECT 
    u.id,
    u.email,
    ur.role as user_role,
    p.role as profile_role,
    ur.created_at as role_created_at
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'shanwalkermail@gmail.com';
