# Quick Fix Guide: Disable Email Confirmation

## The Problem
After signup, users cannot login because Supabase requires email confirmation. This prevents the `processSignupSession()` function from running, so questionnaire data never gets saved to the database.

## The Solution (2 minutes)

### Step 1: Go to Supabase Dashboard

1. Open: https://supabase.com/dashboard
2. Select your project: **whdbtkkgesfgqtkfedne**

### Step 2: Navigate to Authentication Settings

Click: **Authentication** (left sidebar) → **Settings**

### Step 3: Disable Email Confirmation

Scroll down to find **"Email Confirmation"** section and:

1. **UNCHECK** the box that says "Enable email confirmations"
2. Click **Save** at the bottom of the page

```
┌──────────────────────────────────────────────┐
│ Email Confirmation                           │
├──────────────────────────────────────────────┤
│                                              │
│ ☐ Enable email confirmations                │  ← UNCHECK THIS BOX
│                                              │
│ When enabled, users must confirm their      │
│ email address before they can sign in       │
│                                              │
└──────────────────────────────────────────────┘
                    [Save]
```

### Step 4: Create Database Tables

1. Go to **SQL Editor** in Supabase
2. Click **New Query**
3. Copy the entire contents of `trip_signup_setup.sql`
4. Paste and click **Run**

### Step 5: Test It!

1. Go to: `http://localhost:8081/get-started`
2. Complete the signup flow with a NEW email
3. Login immediately
4. Check browser console for: `[Login] Signup session processed successfully`
5. Check Supabase tables for your data

## That's It!

The data should now save to Supabase after login. 

**See `FIX_DATA_NOT_SAVING.md` for detailed troubleshooting.**
