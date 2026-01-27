# Quick Signup Testing Guide

## Step 1: Disable Email Verification in Supabase

1. Go to [Supabase Dashboard](https://supabase.com)
2. Select your project
3. Navigate to: **Authentication** → **Settings** → **Auth Providers**
4. Click on **Email**
5. Find **"Confirm email"** toggle and turn it **OFF**
6. Click **Save**

## Step 2: Ensure Database Trigger is Set Up

Run this SQL in Supabase SQL Editor (if not already done):

```sql
-- This creates the profile auto-creation trigger
-- Copy and paste the entire content from: setup_profiles_table.sql
```

Or simply run the file: `setup_profiles_table.sql` in the SQL Editor.

## Step 3: Test Signup Flow

### A. Start Dev Server (if not running)
```bash
npm run dev
```

### B. Open Signup Page
Navigate to: `http://localhost:8081/signup`

### C. Fill Out Form
- **Full Name**: Test User
- **Email**: test123@gmail.com (use any valid email format)
- **Password**: TestPassword123!
- **Confirm Password**: TestPassword123!

### D. Submit Form
Click "Create Account"

### E. Expected Result (Email Verification DISABLED)
✅ User is automatically logged in
✅ Redirected to `/dashboard`
✅ No email confirmation message shown
✅ User can immediately use the app

## Step 4: Verify in Supabase

### Check Authentication → Users
- New user should appear
- Email should be confirmed (has timestamp in `email_confirmed_at`)
- Status: "Confirmed"

### Check Table Editor → profiles
- New profile created automatically
- Contains user's email and full name

### Check Table Editor → user_roles (if exists)
- User should have default 'user' role

## Step 5: Check Console Logs

Open browser DevTools → Console and look for:

```
[AuthContext] 🚀 Starting signup process...
[AuthContext] 📊 Signup response: { hasSession: true, ... }
[AuthContext] ✅ Email verification DISABLED - User auto-logged in
[AuthContext] 🎉 User session created, fetching roles...
[AuthContext] 👤 User roles: [...]
[AuthContext] ✨ Signup complete - user ready to use app
```

## Troubleshooting

### Issue: Still showing "Check your email" message
**Cause**: Email verification is still enabled in Supabase
**Fix**: Double-check Supabase settings and make sure "Confirm email" is OFF

### Issue: User created but not logged in
**Cause**: Session not being set properly
**Fix**: Check console logs for errors, ensure AuthContext is properly set up

### Issue: User created but no profile
**Cause**: Database trigger not set up
**Fix**: Run `setup_profiles_table.sql` in Supabase SQL Editor

### Issue: Redirected to dashboard but shows "Access Denied"
**Cause**: User roles not assigned
**Fix**: Check if user_roles table exists and has proper policies

## Alternative: Test with Email Verification ENABLED

If you want to test the email verification flow:

1. Keep "Confirm email" **ON** in Supabase
2. Sign up with a real email address you can access
3. You'll see: "Check your email!" message
4. Check your email inbox for confirmation link
5. Click the link to verify
6. Then you can log in

## Current Code Features

The signup code now:
- ✅ Automatically detects if email verification is enabled/disabled
- ✅ Handles both scenarios gracefully
- ✅ Provides detailed console logging for debugging
- ✅ Sets user session immediately when verification is disabled
- ✅ Shows appropriate UI for each scenario
- ✅ Redirects to dashboard when auto-logged in
- ✅ Shows success message when email verification needed

## Summary

**For Development/Testing**: Disable email verification
**For Production**: Enable email verification for security

The code works perfectly in both scenarios! 🎉
