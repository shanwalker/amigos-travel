# Trip Proposal System - Testing Guide

## 🧪 End-to-End Testing Workflow

### Prerequisites
- Development server running (`npm run dev`)
- Admin account with proper role
- Test user account
- Supabase database with `trip_proposals` table

---

## Test Scenario 1: Complete Proposal Creation Flow

### Step 1: User Completes Quiz
1. Navigate to `/quiz`
2. Complete all 17 steps of the onboarding quiz
3. Submit quiz
4. Note the user ID and quiz response ID

### Step 2: Admin Views Quiz Response
1. Login as admin
2. Navigate to `/admin/quizzes`
3. Verify quiz response appears in the list
4. Check that user preferences are displayed correctly

### Step 3: Admin Creates Proposal
1. Click "Create Proposal" button on quiz card
2. Verify navigation to `/admin/proposals/create?userId=X&quizId=Y`
3. Verify title is auto-populated with user's name
4. Fill in proposal details:
   - **Destination**: Bali, Indonesia
   - **Tagline**: Paradise awaits
   - **Upload hero image**
   - **Add 3 highlights**: Beautiful beaches, Rich culture, Affordable luxury
   - **Description**: Bali offers stunning beaches, vibrant culture, and unforgettable experiences
   - **Add 2 experiences**:
     - Surfing Lesson (🏄, Adventure)
     - Temple Tour (🛕, Cultural)
   - **Dates**: Set departure and return dates
   - **Duration**: 7 days
   - **Price**: ₹50,000

5. Verify live preview updates in real-time
6. Click "Publish & Notify"

### Step 4: Verify Email Notification
1. Check email inbox for test user
2. Verify email received with:
   - Personalized greeting
   - Destination name
   - "View Your Trip Proposal" button
   - Expiry date (if set)

### Step 5: User Views Proposal
1. Login as test user
2. Navigate to `/dashboard/proposals`
3. Verify proposal card appears with:
   - Hero image
   - Destination name
   - Status badge ("New")
   - Price
4. Click "View Proposal"
5. Verify all sections render correctly:
   - Hero with animation
   - Preferences recap
   - Destination details with highlights
   - Experiences gallery (2 cards)
   - Dates & logistics
   - Pricing breakdown
   - CTA button

### Step 6: Verify Animations
1. Scroll through proposal page
2. Verify scroll-triggered animations:
   - Hero fades in on load
   - Sections slide up when scrolling into view
   - Experience cards stagger (0.15s delay)
   - Pricing scales on view

---

## Test Scenario 2: Draft Proposal

### Steps
1. Admin creates proposal
2. Click "Save as Draft" instead of "Publish & Notify"
3. Verify:
   - Proposal saved to database
   - Status = "draft"
   - No email sent
   - Proposal does NOT appear in user's dashboard
   - Proposal appears in admin's proposal list (if implemented)

---

## Test Scenario 3: Mobile Responsiveness

### Steps
1. Open proposal viewer on mobile device or resize browser to 375px width
2. Verify:
   - Hero image scales properly
   - Text is readable
   - Experience grid collapses to single column
   - Dates section stacks vertically
   - CTA button is touch-friendly
   - Navigation sidebar works

---

## Test Scenario 4: Image Upload

### Steps
1. In proposal builder, upload hero image
2. Verify:
   - Upload progress indicator shows
   - Image preview appears
   - Image URL saved to form state
   - Live preview updates
3. Upload experience images
4. Verify same behavior for each experience

---

## Test Scenario 5: Error Handling

### Test 5a: Missing Required Fields
1. Try to publish proposal without:
   - Title
   - Destination name
   - Price
2. Verify error toast appears

### Test 5b: Image Upload Failure
1. Attempt to upload invalid file type
2. Verify error handling

### Test 5c: Email Failure
1. Publish proposal with invalid email
2. Verify:
   - Proposal still publishes
   - Toast shows "Proposal published (email notification failed)"

---

## Test Scenario 6: Navigation Flow

### Steps
1. From admin quiz management → Create Proposal
2. Verify userId and quizId in URL
3. After publishing, verify redirect to `/admin/quizzes`
4. From user dashboard → My Proposals
5. Click proposal card
6. Verify navigation to `/dashboard/proposals/:id`
7. Click "Reserve Now"
8. Verify CTA behavior (if reservation_url set)

---

## 🐛 Known Issues to Test

1. **Browser Compatibility**: Test in Chrome, Firefox, Safari, Edge
2. **Image Formats**: Test JPG, PNG, WebP uploads
3. **Large Images**: Test upload of images >5MB
4. **Long Text**: Test with very long destination descriptions
5. **Special Characters**: Test with emojis in titles and descriptions
6. **Date Validation**: Test with past dates
7. **Price Validation**: Test with negative prices or zero

---

## ✅ Success Criteria

- [ ] Quiz submission creates record in database
- [ ] Admin can view all quiz responses
- [ ] "Create Proposal" button navigates correctly
- [ ] Proposal builder form validates required fields
- [ ] Image uploads work for hero and experiences
- [ ] Live preview updates in real-time
- [ ] Draft proposals save without sending email
- [ ] Published proposals trigger email notification
- [ ] Email contains correct personalization
- [ ] User can view proposals list
- [ ] Proposal viewer displays all sections
- [ ] Animations trigger on scroll
- [ ] Mobile layout is responsive
- [ ] Navigation flows work end-to-end

---

## 📊 Performance Benchmarks

- **Page Load**: Proposal viewer should load in <2s
- **Image Upload**: Should complete in <5s for 2MB image
- **Animation FPS**: Should maintain 60fps during scroll
- **Email Delivery**: Should arrive within 30 seconds

---

## 🔧 Debugging Tips

1. **Check Browser Console**: Look for React errors or network failures
2. **Supabase Logs**: Check for RLS policy violations
3. **Network Tab**: Verify API calls to Supabase
4. **Email Logs**: Check Supabase Edge Function logs (if using)
5. **React Query DevTools**: Monitor query states

---

**Ready to Test!** Follow each scenario systematically and document any issues found.
