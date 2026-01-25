# Trip Signup Flow - Complete Implementation Guide

## Overview

This document explains the **unified context-aware signup flow** for TravelAmigo, where users select a trip type, complete a questionnaire, create an account, and have their data automatically saved to the database after login.

## Flow Architecture

```
/get-started → Select trip type
    ↓
/signup/:tripType → Multi-step questionnaire → Create account
    ↓
Data stored in sessionStorage
    ↓
/login → User logs in
    ↓
processSignupSession() → Saves data to Supabase:
  - profiles (travel_preferences)
  - surprise_requests / custom_trip_requests / trip_reservations
```

## Key Files

### 1. `src/lib/signupSession.ts`
Manages questionnaire data in `sessionStorage` before account creation.

**Functions:**
- `saveSignupSession(data)` - Saves signup session data
- `getSignupSession()` - Retrieves signup session data
- `clearSignupSession()` - Clears signup session data
- `hasPendingSession()` - Checks if there's a pending session

### 2. `src/pages/GetStarted.tsx`
Landing page where users select their trip type:
- **Surprise Trips** - Budget-based mystery adventures
- **Group Trips** - Fixed dates with reservation system
- **Standard Packages** - Pre-planned itineraries
- **Custom Trips** - Fully personalized travel planning

### 3. `src/pages/TripSignup.tsx`
Multi-step questionnaire page with:
- Dynamic questions based on trip type
- Progress indicator
- Account creation at final step
- Session data persistence

**Trip Type Questions:**

**Surprise Trips:**
1. Budget
2. Duration (days)
3. Interests
4. Preferred climate

**Group Trips:**
1. Group size
2. Preferred travel date
3. Preferred destination (optional)
4. Special requests (optional)

**Standard Packages:**
1. Destination
2. Travel style
3. Trip duration
4. Preferred activities

**Custom Trips:**
1. Destination
2. Budget
3. Trip duration
4. Travel style preference
5. Must-have experiences
6. What to avoid (optional)

### 4. `src/pages/auth/Login.tsx`
Enhanced login page with:
- `processSignupSession()` function that runs after successful login
- Saves questionnaire data to appropriate Supabase tables
- Displays success message from signup flow
- Comprehensive error handling and logging

## Database Tables

### Required Tables

You need to create these tables in Supabase:

#### 1. `profiles` table
```sql
-- Add travel_preferences column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS travel_preferences JSONB;
```

#### 2. `surprise_requests` table
```sql
CREATE TABLE IF NOT EXISTS surprise_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  budget NUMERIC,
  duration_days INTEGER,
  interests TEXT,
  preferred_climate TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE surprise_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own surprise requests"
  ON surprise_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own surprise requests"
  ON surprise_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

#### 3. `custom_trip_requests` table
```sql
CREATE TABLE IF NOT EXISTS custom_trip_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  destination TEXT,
  budget NUMERIC,
  duration_days INTEGER,
  travel_style TEXT,
  must_have_experiences TEXT,
  things_to_avoid TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE custom_trip_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own custom trip requests"
  ON custom_trip_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own custom trip requests"
  ON custom_trip_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

#### 4. `trip_reservations` table
```sql
CREATE TABLE IF NOT EXISTS trip_reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  group_size INTEGER,
  preferred_date TEXT,
  destination TEXT,
  special_requests TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE trip_reservations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own trip reservations"
  ON trip_reservations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trip reservations"
  ON trip_reservations FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## CRITICAL: Disable Email Confirmation

**The main issue preventing the flow from working is Supabase's email confirmation requirement.**

### Option 1: Disable in Supabase Dashboard (RECOMMENDED)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Settings**
3. Find **Email Confirmation** section
4. **Disable** the "Enable email confirmations" toggle
5. Save changes

### Option 2: Use Supabase CLI

```bash
# Update auth config
supabase auth update --enable-signup=true --enable-email-confirmations=false
```

### Option 3: Manual SQL (if needed)

```sql
-- This is handled by Supabase dashboard, but for reference:
UPDATE auth.config 
SET enable_email_confirmations = false;
```

## Testing the Flow

### Step 1: Navigate to Get Started
```
http://localhost:5173/get-started
```

### Step 2: Select a Trip Type
Click on any of the four trip type cards.

### Step 3: Complete Questionnaire
Answer all required questions (marked with asterisk).

### Step 4: Create Account
On the final step, enter:
- Full Name: `Test User`
- Email: `test@example.com`
- Password: `password123`
- Confirm Password: `password123`

### Step 5: Login
After signup, you'll be redirected to `/login?signup=success`.
Login with the credentials you just created.

### Step 6: Verify Data in Supabase
After login, check the following tables in Supabase:
- `profiles` - Should have `travel_preferences` populated
- `surprise_requests` / `custom_trip_requests` / `trip_reservations` - Should have a new row based on trip type

## Debugging

### Check Browser Console
The flow includes comprehensive logging:
- `[SignupSession]` - Session storage operations
- `[Login]` - Login and session processing

### Common Issues

**Issue: "Email not confirmed" error**
- **Solution**: Disable email confirmation in Supabase dashboard (see above)

**Issue: Data not saving to database**
- **Solution**: Check browser console for errors
- Verify tables exist in Supabase
- Verify RLS policies are correct
- Check that user is authenticated before `processSignupSession()` runs

**Issue: TypeScript errors**
- **Solution**: The code uses `as any` type assertions for tables not in generated Supabase types
- This is intentional and safe for this use case

**Issue: Session data lost**
- **Solution**: Session data expires after 1 hour
- Don't close the browser tab between signup and login
- Session data is stored in `sessionStorage`, not `localStorage`

## Routes Added

```tsx
// In App.tsx
<Route path="/get-started" element={<GetStarted />} />
<Route path="/signup/:tripType" element={<TripSignup />} />
```

## Next Steps

1. **Disable email confirmation** in Supabase dashboard
2. **Create the required database tables** using the SQL above
3. **Test the complete flow** with random signup details
4. **Verify data persistence** in Supabase tables
5. **Customize questions** in `TripSignup.tsx` if needed
6. **Add admin views** to view and manage trip requests

## Notes

- Session data is automatically cleared after successful processing
- The flow gracefully handles errors - users can still login even if data saving fails
- All database operations include comprehensive error logging
- The flow supports all four trip types with different questionnaires
