# 🚨 FIX ADMIN ACCESS DENIED

If you are seeing "Access Denied" for `shanwalkermail@gmail.com`, it means the permissions didn't sync correctly.

## ⚡ INSTANT FIX

1. **Go to Supabase Dashboard**
2. **Open SQL Editor**
3. **Copy & Paste** the code below and click **Run**:

```sql
-- 1. Force Admin Role in Database
DELETE FROM public.user_roles 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'shanwalkermail@gmail.com');

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'shanwalkermail@gmail.com';

-- 2. Force Admin Role in Profile
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (SELECT id FROM auth.users WHERE email = 'shanwalkermail@gmail.com');

-- 3. CRITICAL: Update Auth Metadata (The fix for "Access Denied")
UPDATE auth.users
SET raw_user_meta_data = 
  COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'shanwalkermail@gmail.com';

-- 4. Verify
SELECT email, raw_user_meta_data->>'role' as meta_role FROM auth.users WHERE email = 'shanwalkermail@gmail.com';
```

## 🔄 After Running the Script

1. **Sign Out** of the application completely.
2. **Clear Browser Cache** (or use Incognito mode).
3. **Sign In** again as `shanwalkermail@gmail.com`.

You should now have full access to the Admin Dashboard! 🚀
