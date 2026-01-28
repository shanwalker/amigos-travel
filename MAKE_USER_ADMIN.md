# 🔐 Make User Admin - Quick Guide

## Option 1: Run SQL Script (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open the file `make_admin.sql`
4. Click **Run**

This will automatically:
- ✅ Find the user by email
- ✅ Create/update their role to 'admin'
- ✅ Update both `user_roles` and `profiles` tables
- ✅ Show verification results

---

## Option 2: Direct SQL Commands

If you prefer to run commands directly, copy and paste these one by one:

### Step 1: Get User ID
```sql
SELECT id, email FROM auth.users WHERE email = 'shanwalkermail@gmail.com';
```

### Step 2: Update/Insert Admin Role
```sql
-- Replace YOUR_USER_ID with the ID from Step 1
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_ID', 'admin')
ON CONFLICT (user_id) 
DO UPDATE SET role = 'admin', updated_at = NOW();
```

### Step 3: Update Profile
```sql
-- Replace YOUR_USER_ID with the ID from Step 1
UPDATE public.profiles
SET role = 'admin', updated_at = NOW()
WHERE id = 'YOUR_USER_ID';
```

### Step 4: Verify
```sql
SELECT 
    u.email,
    ur.role as user_role,
    p.role as profile_role
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'shanwalkermail@gmail.com';
```

---

## Option 3: Using Supabase Dashboard UI

1. Go to **Authentication** → **Users**
2. Find `shanwalkermail@gmail.com`
3. Click on the user
4. Go to **User Metadata** or **Raw User Meta Data**
5. Add/Update: `{ "role": "admin" }`

Then run this SQL to sync:
```sql
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'shanwalkermail@gmail.com');

UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'shanwalkermail@gmail.com');
```

---

## ✅ Verification

After running any of the above options, verify with:

```sql
SELECT 
    u.id,
    u.email,
    u.raw_user_meta_data->>'role' as metadata_role,
    ur.role as user_roles_table,
    p.role as profiles_table
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'shanwalkermail@gmail.com';
```

You should see:
- ✅ `user_roles_table`: admin
- ✅ `profiles_table`: admin

---

## 🎯 What This Enables

Once the user is an admin, they will have access to:

✅ Admin Dashboard (`/admin`)
✅ Quiz Analytics (`/admin/quiz-analytics`)
✅ Booking Management (`/admin/bookings`)
✅ Custom Request Management
✅ Surprise Request Management
✅ Wishlist Analytics
✅ All CSV Exports
✅ User Management
✅ Full Statistics & Reports

---

## 🔒 Security Notes

- Admin role is checked in the frontend via `AuthContext`
- Backend RLS policies enforce admin-only access
- Admin routes are protected
- Only users with `role = 'admin'` can access admin features

---

## 📝 Need to Add More Admins?

Just replace the email in the SQL scripts:

```sql
-- Change this line:
WHERE email = 'shanwalkermail@gmail.com'

-- To:
WHERE email = 'new-admin@example.com'
```

---

**File Created**: `make_admin.sql`  
**User**: shanwalkermail@gmail.com  
**Role**: admin  
**Status**: Ready to execute! 🚀
