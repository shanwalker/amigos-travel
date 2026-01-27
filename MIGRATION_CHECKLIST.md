# ✅ DATABASE MIGRATION CHECKLIST

Track your progress as you migrate from old to new Supabase database.

---

## 📋 Pre-Migration Preparation

- [ ] Read `MIGRATION_PACKAGE.md` overview
- [ ] Read `QUICK_MIGRATION.md` steps
- [ ] Have access to both Supabase dashboards
- [ ] Backup old database (optional but recommended)
- [ ] Notify team about upcoming migration

**Time:** 10 minutes  
**Status:** ⏳ Not Started

---

## 🗄️ Step 1: Set Up New Database Schema

- [ ] Open NEW Supabase Dashboard (mqkazvelueppcravkdsc)
- [ ] Navigate to SQL Editor
- [ ] Run `setup_profiles_table.sql`
- [ ] Run `supabase_rbac_setup.sql`
- [ ] Run `trip_signup_setup.sql`
- [ ] Run `SUPABASE_SETUP_COMPLETE.sql`
- [ ] Verify tables exist in Database → Tables
- [ ] Verify RLS policies are enabled

**Time:** 5 minutes  
**Status:** ⏳ Not Started

---

## 📤 Step 2: Export Data from Old Database

- [ ] Open OLD Supabase Dashboard (whdbtkkgesfgqtkfedne)
- [ ] Navigate to SQL Editor
- [ ] Open `export_old_data.sql`
- [ ] Run "Export Profiles" query
- [ ] Copy INSERT statement for profiles
- [ ] Run "Export Trips" query (if exists)
- [ ] Copy INSERT statement for trips
- [ ] Run "Export Bookings" query (if exists)
- [ ] Copy INSERT statement for bookings
- [ ] Run "Data Summary" query
- [ ] Note row counts for verification
- [ ] Save all INSERT statements to a text file

**Time:** 5 minutes  
**Status:** ⏳ Not Started

**Row Counts from Old Database:**
- Profiles: _______
- Trips: _______
- Bookings: _______
- Questionnaires: _______

---

## 📥 Step 3: Import Data to New Database

- [ ] Open NEW Supabase Dashboard
- [ ] Navigate to SQL Editor
- [ ] Open `import_new_data.sql`
- [ ] Paste profiles INSERT statement
- [ ] Paste trips INSERT statement (if any)
- [ ] Paste bookings INSERT statement (if any)
- [ ] Paste questionnaire INSERT statement (if any)
- [ ] Run the complete script
- [ ] Verify no errors in output
- [ ] Run verification queries
- [ ] Compare row counts with old database

**Time:** 5 minutes  
**Status:** ⏳ Not Started

**Row Counts from New Database:**
- Profiles: _______
- Trips: _______
- Bookings: _______
- Questionnaires: _______

**Match:** [ ] Yes [ ] No

---

## 👥 Step 4: Migrate Users

### Option A: Automated Migration

- [ ] Install @supabase/supabase-js: `npm install @supabase/supabase-js`
- [ ] Get OLD service role key from Supabase Dashboard
- [ ] Get NEW service role key from Supabase Dashboard
- [ ] Update `migrate_users.js` with service keys
- [ ] Run: `node migrate_users.js`
- [ ] Review migration summary
- [ ] Verify user count matches

**Time:** 10 minutes  
**Status:** ⏳ Not Started

### Option B: Manual Migration

- [ ] Open NEW Supabase Dashboard
- [ ] Go to Authentication → Users
- [ ] For each user from old database:
  - [ ] Click "Add User"
  - [ ] Enter email
  - [ ] Check "Auto-confirm email"
  - [ ] Click "Create User"
  - [ ] Send password reset email
- [ ] Verify all users created

**Time:** 5-20 minutes (depending on user count)  
**Status:** ⏳ Not Started

**User Counts:**
- Old Database: _______
- New Database: _______
- Match: [ ] Yes [ ] No

---

## 🔧 Step 5: Update Environment Variables

### Local Environment

- [x] `.env` already updated ✅
- [ ] Verify local app works with new database
- [ ] Test signup flow
- [ ] Test login flow

**Time:** 2 minutes  
**Status:** ✅ Already Done

### Netlify

- [ ] Go to Netlify Dashboard
- [ ] Navigate to Site Settings → Environment Variables
- [ ] Update `VITE_SUPABASE_URL`
- [ ] Update `VITE_SUPABASE_ANON_KEY`
- [ ] Save changes
- [ ] Trigger new deployment
- [ ] Wait for deployment to complete
- [ ] Test live site

**Time:** 3 minutes  
**Status:** ⏳ Not Started

### Vercel

- [ ] Go to Vercel Dashboard
- [ ] Navigate to Project Settings → Environment Variables
- [ ] Update `VITE_SUPABASE_URL`
- [ ] Update `VITE_SUPABASE_ANON_KEY`
- [ ] Save changes
- [ ] Trigger new deployment (or auto-deploy)
- [ ] Wait for deployment to complete
- [ ] Test live site

**Time:** 3 minutes  
**Status:** ⏳ Not Started

---

## 🧪 Step 6: Testing & Verification

### Local Testing

- [ ] Start dev server: `npm run dev`
- [ ] Test signup (new user)
- [ ] Test login (new user)
- [ ] Test password reset (migrated user)
- [ ] Test dashboard access
- [ ] Test admin features (if admin user)
- [ ] Check browser console for errors
- [ ] Verify all features work

**Time:** 10 minutes  
**Status:** ⏳ Not Started

### Production Testing (Netlify)

- [ ] Visit live Netlify site
- [ ] Test signup
- [ ] Test login
- [ ] Test password reset
- [ ] Check all pages load
- [ ] Verify no console errors
- [ ] Test on mobile device

**Time:** 5 minutes  
**Status:** ⏳ Not Started

### Production Testing (Vercel)

- [ ] Visit live Vercel site
- [ ] Test signup
- [ ] Test login
- [ ] Test password reset
- [ ] Check all pages load
- [ ] Verify no console errors
- [ ] Test on mobile device

**Time:** 5 minutes  
**Status:** ⏳ Not Started

---

## 📧 Step 7: User Communication

- [ ] Prepare email/notification for users
- [ ] Explain password reset requirement
- [ ] Provide password reset link
- [ ] Send to all migrated users
- [ ] Monitor for user questions/issues

**Time:** 15 minutes  
**Status:** ⏳ Not Started

**Email Template:**
```
Subject: Password Reset Required - Travel Amigo

Hi [User],

We've upgraded our database to improve performance and security. 
As part of this upgrade, you'll need to reset your password.

Click here to reset your password: [Reset Link]

If you have any questions, please contact support.

Thanks,
Travel Amigo Team
```

---

## 📊 Step 8: Post-Migration Monitoring

### Day 1
- [ ] Monitor Supabase logs for errors
- [ ] Check user signup/login success rate
- [ ] Respond to user issues
- [ ] Verify data integrity

### Day 3
- [ ] Review error logs
- [ ] Check for any missing data
- [ ] Verify all features working
- [ ] Collect user feedback

### Day 7
- [ ] Final verification
- [ ] Confirm migration success
- [ ] Consider archiving old database
- [ ] Document lessons learned

**Status:** ⏳ Not Started

---

## 🗑️ Step 9: Old Database Cleanup

**⚠️ DO NOT DELETE OLD DATABASE IMMEDIATELY!**

- [ ] Keep old database for 7-30 days
- [ ] Verify new database is stable
- [ ] Confirm no data loss
- [ ] Export final backup of old database
- [ ] Document what was migrated
- [ ] After 30 days: Consider deleting old database

**Recommended Wait Time:** 30 days  
**Status:** ⏳ Not Started

---

## 🎉 Migration Complete!

- [ ] All data migrated successfully
- [ ] All users can access the system
- [ ] Production sites working
- [ ] No critical errors
- [ ] Team notified
- [ ] Documentation updated

**Status:** ⏳ Not Started

---

## 📈 Migration Summary

**Start Date:** _________________  
**End Date:** _________________  
**Total Time:** _________________  

**Statistics:**
- Users Migrated: _______
- Profiles Migrated: _______
- Trips Migrated: _______
- Bookings Migrated: _______
- Issues Encountered: _______
- Issues Resolved: _______

**Overall Status:** [ ] Success [ ] Partial [ ] Failed

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

---

## 🆘 Issues & Resolutions

| Issue | Resolution | Status |
|-------|------------|--------|
|       |            |        |
|       |            |        |
|       |            |        |

---

**Good luck with your migration! 🚀**
