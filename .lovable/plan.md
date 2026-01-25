

# Unified User Flow: Trip-Type-Specific Signup with Seamless Admin Integration

## Executive Summary

This plan creates a complete, interconnected flow where:
1. Users choose a trip type from the homepage
2. Complete trip-specific questionnaires BEFORE registration
3. Create their profile with all personal details
4. All questionnaire answers are preserved and linked to their profile
5. Users can make reservations visible in both their dashboard and admin panel
6. Admins see complete user journey data including interests, questionnaire answers, and bookings

---

## Current State Analysis

**What exists:**
- Basic signup flow (email, password, full name)
- Post-signup onboarding quiz (6 steps - interests, budget, travel style, accommodation, activity level)
- Separate wizards for Surprise Trip and Custom Trip (but they require login first)
- User dashboard with bookings display
- Admin panel with user management (shows travel_preferences)
- Profiles table with `travel_preferences` JSON column

**Gaps identified:**
1. No trip-type selection BEFORE signup
2. Questionnaire answers from trip wizards not linked to user profile
3. No phone number captured during signup
4. No unified flow connecting trip selection to signup to profile creation
5. Admin cannot see which trip type the user was interested in when signing up

---

## Implementation Architecture

```text
                    HOMEPAGE
                        |
         +--------------+---------------+
         |              |               |
    [Surprise]    [Group Trip]    [Custom Trip]
         |              |               |
         +--------> TRIP WIZARD <-------+
              (Type-specific questions)
                        |
              Answers stored in sessionStorage
                        |
                   SIGNUP PAGE
            (First name, Last name, 
             Email, Phone, Password)
                        |
                 Email Verification
                        |
                   LOGIN PAGE
                        |
            System detects pending data
                        |
                 AUTO-SAVE TO DB
         (Profile + TravelPreferences + 
          TripRequest linked together)
                        |
         +-------> USER DASHBOARD <------+
         |              |                |
    [My Trips]    [My Requests]    [Browse Trips]
         |              |                |
         +-------> ADMIN DASHBOARD <-----+
                        |
         +--------------+---------------+
         |              |               |
    [User Profile]  [Requests]   [Reservations]
    (Shows journey) (All types)  (All bookings)
```

---

## Technical Implementation Plan

### Phase 1: Enhanced Signup Flow with Trip Context

**1.1 Create Trip Selection Landing Component**

New file: `src/components/auth/TripTypeSelector.tsx`

This component will be displayed before the signup page when a user clicks "Get Started" on any trip type from the homepage.

Features:
- Visual cards for each trip type (Surprise, Group/Reservable, Custom, Standard)
- Each card shows brief description of what the user will get
- Clicking a card stores the selection and navigates to the appropriate questionnaire

**1.2 Create Pre-Signup Questionnaire Wrapper**

New file: `src/pages/TripSignup.tsx`

A unified page that handles the complete pre-signup journey:
- Step 1: Trip-specific questions (budget, interests, dates, preferences)
- Step 2: Profile creation form (first name, last name, email, phone, password)
- All data stored in sessionStorage until account creation

The questionnaire adapts based on trip type:
- **Surprise Trip**: Budget slider, interests, travel style, activities, dates, special requests
- **Group Trip**: Interests, budget, travel companions, activity level
- **Custom Trip**: Destinations, activities, stay type, travelers, budget, dates
- **Standard Trip**: Uses general onboarding questions

**1.3 Enhanced Signup Form**

Modify: `src/pages/auth/Signup.tsx`

Add new fields:
- First Name (separate field)
- Last Name (separate field)
- Phone Number (with country code picker)
- Password with strength indicator

The form will:
1. Check sessionStorage for pending questionnaire answers
2. Display a summary of their trip interests
3. After successful signup, show email verification message

**1.4 Session Storage Manager**

New file: `src/lib/signupSession.ts`

Utility to manage pre-signup data:
```text
{
  tripType: 'surprise' | 'group' | 'custom' | 'standard'
  questionnaireAnswers: {
    // Type-specific answers
  }
  profileData: {
    firstName: string
    lastName: string
    phone: string
  }
  createdAt: timestamp
  expiresAt: timestamp (24 hours)
}
```

---

### Phase 2: Post-Verification Data Linking

**2.1 Enhanced Login Flow**

Modify: `src/pages/auth/Login.tsx`

After successful login:
1. Check sessionStorage for pending signup data
2. If found, auto-save to database:
   - Update profile with full_name, phone
   - Save travel_preferences with questionnaire answers
   - Create trip request record (surprise_requests, custom_trip_requests, or trip_reservations)
3. Clear sessionStorage
4. Redirect to appropriate page (dashboard or trip confirmation)

**2.2 Profile Data Structure Enhancement**

Modify: `src/integrations/supabase/database.types.ts`

Extend TravelPreferences type:
```text
TravelPreferences {
  // Existing fields...
  signup_trip_type: 'surprise' | 'group' | 'custom' | 'standard' | null
  signup_context: {
    trip_type: string
    selected_trip_id?: string
    questionnaire_completed_at: string
    source_page: string
  }
}
```

**2.3 Automatic Request Creation**

New hook: `src/hooks/useAutoCreateRequest.ts`

This hook runs after login when pending data exists:
- For Surprise Trip: Creates entry in `surprise_requests` table
- For Custom Trip: Creates entry in `custom_trip_requests` table
- For Group Trip: Creates entry in `trip_reservations` table
- Links all records to user_id

---

### Phase 3: User Dashboard Enhancements

**3.1 My Trip Requests Section**

New file: `src/pages/dashboard/MyRequests.tsx`

Unified view showing:
- Surprise trip requests (with status: pending/matched/planning)
- Custom trip requests (with status: pending/quoted/approved)
- Group trip reservations (with confirmation status)

Features:
- Status timeline visualization
- Assigned buddy/planner display
- Trip assignment when available
- Communication thread (future)

**3.2 Enhanced Dashboard Home**

Modify: `src/pages/dashboard/DashboardHome.tsx`

Add new sections:
- "Your Journey Started" card (shows their original trip interest)
- "Request Status" widget for pending requests
- Quick links to their specific trip type

**3.3 Dashboard Sidebar Update**

Modify: `src/components/dashboard/DashboardSidebar.tsx`

Add new menu item:
- "My Requests" - links to `/dashboard/requests`

---

### Phase 4: Admin Dashboard Enhancements

**4.1 Enhanced User Profile View**

Modify: `src/pages/admin/UserManagement.tsx`

Add to user dialog:
- **Signup Journey** section showing:
  - Original trip type they were interested in
  - Complete questionnaire answers
  - Timestamp of signup flow
- **Activity Timeline** showing:
  - Account creation
  - Profile completion
  - Requests submitted
  - Bookings made

**4.2 Unified Request Dashboard**

New file: `src/pages/admin/AllRequestsManagement.tsx`

Combined view of all user requests with:
- Tabs: All / Surprise / Custom / Reservations
- Filter by status, date range, user
- Bulk actions for status updates
- Quick user profile preview
- One-click trip assignment

**4.3 User Journey Analytics**

New component: `src/components/admin/UserJourneyCard.tsx`

Visual display for each user showing:
- Entry point (which trip type they clicked)
- Questionnaire completion rate
- Time from signup to first booking
- Engagement score

---

### Phase 5: Data Flow Integration

**5.1 Real-time Sync**

Implement Supabase realtime subscriptions:
- User dashboard updates when admin changes request status
- Admin sees new requests immediately
- Notification badges update in real-time

**5.2 Request-to-Booking Conversion**

New hook: `src/hooks/useConvertRequestToBooking.ts`

Admin action to:
1. Assign a trip to a request
2. Auto-create booking entry
3. Update request status to "confirmed"
4. Notify user (future: email/push)

**5.3 Profile-Request Linkage**

Ensure all request tables have proper foreign keys:
- `surprise_requests.user_id` -> `profiles.id`
- `custom_trip_requests.user_id` -> `profiles.id`
- `trip_reservations.user_id` -> `profiles.id`

---

## Database Changes Required

### Migration 1: Add signup context to profiles

```text
ALTER TABLE profiles 
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT,
ADD COLUMN signup_trip_type TEXT CHECK (signup_trip_type IN ('surprise', 'group', 'custom', 'standard')),
ADD COLUMN signup_context JSONB DEFAULT '{}';
```

### Migration 2: Add questionnaire answers to request tables

```text
ALTER TABLE surprise_requests 
ADD COLUMN signup_questionnaire JSONB DEFAULT '{}';

ALTER TABLE custom_trip_requests 
ADD COLUMN signup_questionnaire JSONB DEFAULT '{}';

ALTER TABLE trip_reservations
ADD COLUMN signup_questionnaire JSONB DEFAULT '{}';
```

---

## UI/UX Flow Details

### Step-by-Step User Journey

1. **Homepage**: User sees trip options (Surprise Me, Join Group Trip, Plan Custom Trip)

2. **Click any option**: Navigates to `/signup/surprise`, `/signup/group`, or `/signup/custom`

3. **Trip Questionnaire**: 
   - 5-7 questions specific to trip type
   - Beautiful animated progress bar
   - Skip option available
   - Answers saved to sessionStorage

4. **Profile Creation**:
   - Form with: First Name, Last Name, Email, Phone, Password
   - Summary card showing "Your Trip Preferences"
   - Clear CTA: "Create Account & Submit Request"

5. **Email Verification**:
   - Friendly confirmation screen
   - Instructions to check email
   - Link to login page

6. **First Login**:
   - System detects pending data
   - Auto-saves everything to database
   - Creates trip request record
   - Shows success toast: "Your [Surprise/Custom/Group] trip request has been submitted!"
   - Redirects to dashboard

7. **User Dashboard**:
   - Welcome message with trip type context
   - Request status card
   - "We're matching you with..." or "Your request is being reviewed"

8. **Admin Dashboard**:
   - New request appears with full context
   - User profile shows complete journey
   - Easy assignment workflow

---

## File Changes Summary

### New Files to Create:
1. `src/components/auth/TripTypeSelector.tsx`
2. `src/pages/TripSignup.tsx`
3. `src/lib/signupSession.ts`
4. `src/hooks/useAutoCreateRequest.ts`
5. `src/pages/dashboard/MyRequests.tsx`
6. `src/pages/admin/AllRequestsManagement.tsx`
7. `src/components/admin/UserJourneyCard.tsx`
8. `src/hooks/useConvertRequestToBooking.ts`

### Files to Modify:
1. `src/pages/auth/Signup.tsx` - Enhanced form with phone, separate name fields
2. `src/pages/auth/Login.tsx` - Auto-save pending data logic
3. `src/pages/dashboard/DashboardHome.tsx` - Add request status widgets
4. `src/components/dashboard/DashboardSidebar.tsx` - Add My Requests link
5. `src/pages/admin/UserManagement.tsx` - Enhanced user journey view
6. `src/App.tsx` - Add new routes
7. `src/integrations/supabase/database.types.ts` - Extended types

### Database Migrations:
1. Add signup context columns to profiles
2. Add questionnaire storage to request tables

---

## Implementation Order

1. **Phase 1A**: Create session storage manager and types
2. **Phase 1B**: Build TripSignup page with questionnaires
3. **Phase 1C**: Enhance Signup form with new fields
4. **Phase 2A**: Update Login to detect and save pending data
5. **Phase 2B**: Create auto-request creation hook
6. **Phase 3A**: Build MyRequests dashboard page
7. **Phase 3B**: Update DashboardHome with request widgets
8. **Phase 4A**: Enhance UserManagement with journey view
9. **Phase 4B**: Create unified AllRequestsManagement page
10. **Phase 5**: Add real-time sync and notifications

---

## Success Criteria

- User can select trip type and answer questions BEFORE creating account
- All questionnaire data persists through email verification
- First login automatically creates appropriate trip request
- User dashboard shows request status with clear progress
- Admin can see complete user journey from first click to booking
- Data flows seamlessly between user and admin dashboards
- No data loss during the signup flow

