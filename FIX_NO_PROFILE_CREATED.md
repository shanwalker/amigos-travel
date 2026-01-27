# 🚨 FIX: No Account Created in Supabase Database

## Problem
Users are signing up but NO account is being created in the Supabase database (profiles table).

---

## 🎯 Root Cause

**The profiles table and auto-creation trigger are MISSING!**

When a user signs up:
1. ✅ User is created in `auth.users` table (Supabase Auth)
2. ❌ Profile is NOT created in `public.profiles` table
3. ❌ No trigger exists to auto-create the profile

**Result:** User exists in auth but has no profile data!

---

## ✅ THE FIX (Takes 3 Minutes)

### **Step 1: Run the Setup SQL**

1. Go to **Supabase Dashboard**
2. Click **SQL Editor** (left sidebar)
3. Click **"New Query"**
4. Open the file: `setup_profiles_table.sql`
5. **Copy ALL the SQL** from that file
6. **Paste** into Supabase SQL Editor
7. Click **"Run"** (or press Ctrl+Enter)

**What this does:**
- ✅ Creates `profiles` table
- ✅ Sets up RLS (Row Level Security) policies
- ✅ Creates trigger to auto-create profiles on signup
- ✅ Fixes existing users without profiles
- ✅ Adds proper indexes and permissions

---

### **Step 2: Verify It Worked**

Run this query in SQL Editor:

```sql
-- Check all users have profiles
SELECT 
  u.id,
  u.email as auth_email,
  p.email as profile_email,
  p.full_name,
  CASE 
    WHEN p.id IS NOT NULL THEN '✅ Has Profile'
    ELSE '❌ No Profile'
  END as status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
```

**Expected Result:**
- All users should show "✅ Has Profile"
- No users should show "❌ No Profile"

---

### **Step 3: Test New Signup**

1. Go to: `http://localhost:8081/signup`
2. Create a new account with:
   - Name: Test User 2
   - Email: testuser2@example.com
   - Password: password123
3. Check Supabase:
   - **Authentication → Users** - User should exist ✅
   - **Table Editor → profiles** - Profile should exist ✅

---

## 🔍 WHAT THE SQL DOES

### Creates profiles Table:
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,           -- Links to auth.users
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  travel_preferences JSONB,      -- For questionnaire data
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Creates Auto-Creation Trigger:
```sql
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_profile();
```

**This trigger automatically creates a profile whenever a user signs up!**

### Fixes Existing Users:
```sql
INSERT INTO public.profiles (id, email, full_name)
SELECT u.id, u.email, u.raw_user_meta_data->>'full_name'
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;
```

**This creates profiles for users who signed up before the trigger existed!**

---

## 📊 VERIFICATION CHECKLIST

After running the SQL, verify:

### In Supabase Dashboard:

1. **Table Editor → profiles**
   - [ ] Table exists
   - [ ] Has columns: id, email, full_name, etc.
   - [ ] Has rows for all users

2. **Authentication → Users**
   - [ ] Users exist in auth.users
   - [ ] Each user has a corresponding profile

3. **SQL Editor → Run this:**
   ```sql
   SELECT COUNT(*) FROM public.profiles;
   SELECT COUNT(*) FROM auth.users;
   ```
   - [ ] Both counts should be the SAME

---

## 🐛 DEBUGGING

### Issue: SQL fails with "table already exists"

**Solution:**
The table might already exist but be missing the trigger. Run just the trigger part:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_profile();
```

---

### Issue: Existing users still don't have profiles

**Solution:**
Run the fix query manually:

```sql
INSERT INTO public.profiles (id, email, full_name)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', '')
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
```

---

### Issue: New signups still don't create profiles

**Check:**
1. Trigger exists:
   ```sql
   SELECT * FROM information_schema.triggers
   WHERE trigger_name = 'on_auth_user_created_profile';
   ```

2. Function exists:
   ```sql
   SELECT * FROM information_schema.routines
   WHERE routine_name = 'handle_new_user_profile';
   ```

If missing, re-run the trigger creation SQL.

---

## ✅ EXPECTED BEHAVIOR AFTER FIX

### When User Signs Up:

```
1. User fills signup form
2. Clicks "Create Account"
3. Supabase creates user in auth.users ✅
4. Trigger fires automatically ✅
5. Profile created in public.profiles ✅
6. User roles assigned ✅
7. User logged in and redirected ✅
```

### In Database:

**auth.users table:**
```
id                                   | email
-------------------------------------|-------------------
123e4567-e89b-12d3-a456-426614174000 | test@example.com
```

**public.profiles table:**
```
id                                   | email            | full_name
-------------------------------------|------------------|------------
123e4567-e89b-12d3-a456-426614174000 | test@example.com | Test User
```

**public.user_roles table:**
```
user_id                              | role
-------------------------------------|------
123e4567-e89b-12d3-a456-426614174000 | user
```

---

## 🎉 SUMMARY

**The Problem:**
- No profiles table or auto-creation trigger
- Users created in auth but not in profiles

**The Fix:**
1. ✅ Run `setup_profiles_table.sql` in Supabase
2. ✅ Creates table, trigger, and policies
3. ✅ Fixes existing users
4. ✅ Future signups work automatically

**After Fix:**
- ✅ All users have profiles
- ✅ New signups auto-create profiles
- ✅ Database is properly structured
- ✅ App works correctly

---

**Run the SQL now and test!** 🚀

File: `setup_profiles_table.sql`
