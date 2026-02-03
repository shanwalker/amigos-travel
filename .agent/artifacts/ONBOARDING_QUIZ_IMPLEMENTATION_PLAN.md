# Travel Amigo Onboarding & Surprise Trip Engine
## Master Implementation Plan

**Created:** 2026-02-03
**Status:** Draft - Awaiting Approval
**Estimated Effort:** 20-25 hours of development

---

## 📋 Executive Summary

This document outlines the complete technical implementation for replacing the existing Travel Amigo intake form with a high-conversion, 17-step onboarding quiz that:
1. Persists data anonymously in browser storage
2. Migrates data to Supabase upon authentication
3. Powers a manual Admin-driven "Surprise Trip" workflow
4. Includes a premium "reveal" animation for users

---

## 🏗️ Architecture Overview

### Current State Analysis
- **Existing Quiz:** `TravelProfileQuizComplete.tsx` (951 lines) - 10-step flow
- **Database:** Supabase with `quiz_responses`, `surprise_requests`, `profiles` tables
- **Auth:** Supabase Auth with RBAC (`AuthContext.tsx`)
- **Admin Dashboard:** Comprehensive admin panel with surprise request management

### Target Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     QUIZ FLOW (17 Steps)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   [Anonymous User]                                              │
│         │                                                       │
│         ▼                                                       │
│   ┌─────────────────┐      ┌──────────────────┐                │
│   │   Quiz Steps    │──────│  LocalStorage    │                │
│   │   (1-17)        │      │  State Listener  │                │
│   └────────┬────────┘      └──────────────────┘                │
│            │                                                    │
│            ▼                                                    │
│   ┌─────────────────┐                                          │
│   │  Auth Prompt    │  ◄── "Create Account" / "Sign In"        │
│   └────────┬────────┘                                          │
│            │                                                    │
│            ▼                                                    │
│   ┌─────────────────┐      ┌──────────────────┐                │
│   │  Data Migration │──────│  Supabase DB     │                │
│   │  Hook           │      │  - quiz_responses │                │
│   └────────┬────────┘      │  - surprise_reqs │                │
│            │               └──────────────────┘                │
│            ▼                                                    │
│   ┌─────────────────┐      ┌──────────────────┐                │
│   │  User Dashboard │      │  Admin Dashboard │                │
│   │  (Pending View) │◄─────│  (Trip Requests) │                │
│   └────────┬────────┘      └────────┬─────────┘                │
│            │                        │                           │
│            ▼                        ▼                           │
│   ┌─────────────────┐      ┌──────────────────┐                │
│   │  Reveal Screen  │◄─────│  Publish Trip    │                │
│   │  (Animation)    │      │  (Admin Action)  │                │
│   └─────────────────┘      └──────────────────┘                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema Updates

### New Table: `onboarding_quiz_responses`

```sql
CREATE TABLE public.onboarding_quiz_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL, -- For anonymous tracking
    
    -- Phase A: Identity & Logistics
    travel_companion TEXT, -- 'solo', 'couple', 'family', 'friends', 'open_group'
    departure_location TEXT,
    departure_lat DECIMAL,
    departure_lng DECIMAL,
    passport_nationality TEXT, -- 'indian', 'other'
    destination_preference TEXT, -- 'in_mind', 'open'
    desired_destinations TEXT[], -- Up to 5 countries
    places_to_avoid TEXT[],
    
    -- Phase B: Style & Constraints
    trip_styles TEXT[], -- Up to 3: 'relaxed', 'adventure', 'culture', etc.
    experience_pace TEXT, -- 'slow', 'balanced', 'full'
    hard_no_activities TEXT[], -- Activities to avoid
    food_preferences TEXT[], -- dietary requirements
    health_conditions TEXT[], -- 'fear_heights', 'cant_swim', etc.
    
    -- Phase C: Budget & Timing
    trip_duration TEXT, -- '3-5', '6-9', '10-14', 'flexible'
    budget_range TEXT, -- 'budget', 'mid-range', 'luxury', 'flexible'
    planning_dates TEXT, -- 'fixed', 'flexible'
    specific_dates JSONB, -- { start: date, end: date }
    amigo_role TEXT, -- 'match_trips', 'custom_plan', 'match_travelers'
    destination_knowledge TEXT, -- 'tell_me', 'surprise', 'open_both'
    additional_notes TEXT,
    travel_vibe TEXT, -- 'relaxer', 'explorer', 'culture_seeker', etc.
    
    -- Meta
    quiz_version TEXT DEFAULT 'v2.0',
    completion_status TEXT DEFAULT 'incomplete', -- 'incomplete', 'completed', 'submitted'
    current_step INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    submitted_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.onboarding_quiz_responses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own quiz responses"
    ON public.onboarding_quiz_responses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz responses"
    ON public.onboarding_quiz_responses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quiz responses"
    ON public.onboarding_quiz_responses FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all quiz responses"
    ON public.onboarding_quiz_responses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );
```

### Enhanced `surprise_requests` Table

```sql
-- Add new columns to existing table
ALTER TABLE public.surprise_requests 
ADD COLUMN IF NOT EXISTS onboarding_quiz_id UUID REFERENCES public.onboarding_quiz_responses(id),
ADD COLUMN IF NOT EXISTS trip_itinerary_url TEXT,
ADD COLUMN IF NOT EXISTS trip_pricing JSONB,
ADD COLUMN IF NOT EXISTS final_destination_details JSONB,
ADD COLUMN IF NOT EXISTS reveal_animation_type TEXT DEFAULT 'scratch_off',
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
```

---

## 🎨 UI Components Structure

### File Organization

```
src/
├── pages/
│   └── quiz/
│       └── OnboardingQuiz.tsx           # Main quiz page
│
├── components/
│   └── onboarding/
│       ├── QuizContainer.tsx            # Main container with state
│       ├── QuizProgress.tsx             # Progress indicator
│       ├── QuizNavigation.tsx           # Back/Next buttons
│       │
│       ├── steps/                        # Individual step components
│       │   ├── Step01TravelCompanion.tsx
│       │   ├── Step02DepartureCity.tsx
│       │   ├── Step03Passport.tsx
│       │   ├── Step04DestinationChoice.tsx
│       │   ├── Step05DesiredDestinations.tsx  # (Conditional)
│       │   ├── Step06PlacesToAvoid.tsx
│       │   ├── Step07TripStyles.tsx
│       │   ├── Step08ExperiencePace.tsx
│       │   ├── Step09HardNoActivities.tsx
│       │   ├── Step10FoodPreferences.tsx
│       │   ├── Step11HealthConditions.tsx
│       │   ├── Step12TripDuration.tsx
│       │   ├── Step13BudgetRange.tsx
│       │   ├── Step14PlanningDates.tsx
│       │   ├── Step15AmigoRole.tsx
│       │   ├── Step16DestinationKnowledge.tsx
│       │   ├── Step17AdditionalNotes.tsx
│       │   └── Step18VibeCheck.tsx
│       │
│       ├── auth/
│       │   └── QuizAuthPrompt.tsx       # Sign up/in prompt
│       │
│       └── animations/
│           ├── StepTransition.tsx
│           └── ConfettiSuccess.tsx
│
├── hooks/
│   └── useQuizState.ts                  # Local storage + migration hook
│
├── lib/
│   └── supabase/
│       └── onboarding-quiz.ts           # DB operations
│
└── dashboard/
    └── components/
        ├── SurpriseTripPendingCard.tsx  # User dashboard pending state
        └── SurpriseTripReveal.tsx       # Reveal animation component
```

---

## 🔧 Implementation Phases

### Phase 1: Foundation (4-5 hours)
1. **Database Setup**
   - [ ] Create `onboarding_quiz_responses` table
   - [ ] Update `surprise_requests` table
   - [ ] Create RLS policies
   - [ ] Add indexes for performance

2. **State Management Hook**
   - [ ] Create `useQuizState.ts` with:
     - LocalStorage persistence
     - Real-time state sync
     - Session ID generation
     - State validation

### Phase 2: Quiz UI Components (8-10 hours)
3. **Core Components**
   - [ ] `QuizContainer.tsx` - Main controller
   - [ ] `QuizProgress.tsx` - 17-step progress bar
   - [ ] `QuizNavigation.tsx` - Back/Next/Skip controls

4. **Step Components (17 total)**
   - [ ] Phase A: Steps 1-6 (Identity & Logistics)
   - [ ] Phase B: Steps 7-11 (Style & Constraints)
   - [ ] Phase C: Steps 12-18 (Budget & Timing + Vibe)

5. **Conditional Logic**
   - [ ] Step 4-5 branching (In Mind vs Open)
   - [ ] Validation (max 3 styles, max 5 countries)

### Phase 3: Authentication Bridge (3-4 hours)
6. **Auth Prompt Component**
   - [ ] `QuizAuthPrompt.tsx` - Login/Signup modal
   - [ ] Integration with existing `AuthContext`

7. **Data Migration Hook**
   - [ ] Post-auth callback to migrate localStorage → Supabase
   - [ ] Integrity validation
   - [ ] Error handling & retry logic
   - [ ] LocalStorage cleanup on success

### Phase 4: Dashboard Integration (3-4 hours)
8. **User Dashboard Updates**
   - [ ] `SurpriseTripPendingCard.tsx` - Pending state display
   - [ ] `SurpriseTripReveal.tsx` - Reveal animation
   - [ ] Profile section with quiz data

9. **Admin Dashboard Updates**
   - [ ] Enhanced `SurpriseRequestsManagement.tsx`
   - [ ] "New Trip Requests" queue view
   - [ ] Detailed user profile breakdown
   - [ ] "Update Trip" form (destination, PDF, pricing)
   - [ ] "Publish" button with reveal trigger

### Phase 5: Polish & Error Handling (2-3 hours)
10. **Edge Cases**
    - [ ] Mid-quiz dropout recovery
    - [ ] Multi-tab sync
    - [ ] Network failure handling

11. **Animations**
    - [ ] Step transitions (Framer Motion)
    - [ ] Progress animations
    - [ ] Reveal animations (scratch-off / map unfold)

---

## 📝 Quiz Content Blueprint

### Phase A: Identity & Logistics

| Step | Question | Input Type | Options | Validation |
|------|----------|------------|---------|------------|
| 1 | Who are you travelling with? | Single-select | Solo, Couple, Family, Friends, Open to Group | Required |
| 2 | Which city/airport will you start from? | Input + Geo | City autocomplete | Required |
| 3 | Which nationality passport? | Single-select | Indian, Other | Required |
| 4 | Where would you like to go? | Single-select | In Mind, Open to Anywhere | Required |
| 5 | Select destinations (if "In Mind") | Multi-select | Country list | Max 5 |
| 6 | Places to avoid? | Multi-select/Text | Common countries + custom | Optional |

### Phase B: Style & Constraints

| Step | Question | Input Type | Options | Validation |
|------|----------|------------|---------|------------|
| 7 | What kind of trip? | Multi-select | Relaxed, Adventure, Culture, Nature, Food, Wellness, Party, Photography | Max 3 |
| 8 | Travel experience preference? | Single-select | Slow & Relaxed, Balanced, Full & Busy | Required |
| 9 | Activities to avoid? | Multi-select | Paragliding, Scuba, Long walks, etc. | Optional |
| 10 | Food preferences? | Multi-select | Vegetarian, Vegan, Non-veg, Indian only, Local, Allergies | Optional |
| 11 | Conditions to avoid? | Multi-select | Fear of heights, Can't swim, Mobility limits, Fear of animals | Optional |

### Phase C: Budget & Timing

| Step | Question | Input Type | Options | Validation |
|------|----------|------------|---------|------------|
| 12 | Trip duration? | Single-select | 3-5 days, 6-9 days, 10-14 days, Flexible | Required |
| 13 | Budget per person? | Single-select | Budget, Mid-range, Luxury, Flexible | Required |
| 14 | Planning dates? | Single-select + Date | Fixed dates, Flexible | Required |
| 15 | Travel Amigo's role? | Single-select | Match trips, Custom plan, Match travelers | Required |
| 16 | Destination knowledge? | Single-select | Tell me, Surprise me, Open to both | Required |
| 17 | Anything else? | Text area | Free text | Optional |
| 18 | Visual vibe check? | Image cards | 6 vibe personas | Required |

---

## 🎭 Reveal Animation Options

### Option 1: Digital Scratch-Off
- Canvas-based scratch effect
- Reveal destination image underneath
- Confetti on complete reveal

### Option 2: Unfolding Map
- Animated map that "unfolds" from center
- Destination pin drops with bounce
- Route animation from departure city

### Option 3: Envelope Opening
- 3D envelope animation
- Boarding pass slides out
- Destination details appear

---

## 🔒 Security Considerations

1. **Anonymous Data**
   - LocalStorage uses generated session ID
   - No PII stored until authentication
   - Session ID linked to user post-auth

2. **Data Migration**
   - Server-side validation of quiz data
   - Rate limiting on migration endpoint
   - Audit logging

3. **Admin Access**
   - RLS enforced for admin-only operations
   - Publish action requires admin role
   - Audit trail for all admin actions

---

## 📈 Analytics & Tracking

1. **Quiz Funnel**
   - Step completion rates
   - Drop-off points
   - Average completion time

2. **User Segments**
   - Popular destinations
   - Budget distribution
   - Vibe type distribution

3. **Conversion**
   - Quiz → Auth conversion
   - Auth → Booking conversion
   - Surprise trip satisfaction

---

## ✅ Acceptance Criteria

### Must Have
- [ ] 17-step quiz flow with all specified questions
- [ ] LocalStorage persistence across sessions
- [ ] Data migration to Supabase on auth
- [ ] User dashboard pending state
- [ ] Admin dashboard trip request queue
- [ ] Publish → Reveal trigger

### Should Have
- [ ] Premium animations (step transitions, reveal)
- [ ] Progress restoration on tab close/reopen
- [ ] Validation enforcement (max selections)
- [ ] Mobile-responsive design

### Nice to Have
- [ ] Multiple reveal animation options
- [ ] Email notifications for clues
- [ ] PDF itinerary upload/viewing
- [ ] Real-time admin → user updates

---

## 🚀 Deployment Checklist

1. [ ] Run database migrations in Supabase
2. [ ] Deploy frontend changes
3. [ ] Test complete flow (anonymous → auth → admin → reveal)
4. [ ] Update CMS/admin documentation
5. [ ] Monitor error rates post-deploy

---

**Ready to proceed with Phase 1?**
