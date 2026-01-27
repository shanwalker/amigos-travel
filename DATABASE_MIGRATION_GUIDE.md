# 🔄 Database Migration Guide: Old → New Supabase

## 📊 Migration Overview

**Source (OLD):** `https://whdbtkkgesfgqtkfedne.supabase.co`  
**Destination (NEW):** `https://mqkazvelueppcravkdsc.supabase.co`

This guide will help you migrate ALL data, users, and configurations from your old Supabase project to the new one.

---

## 🎯 What Will Be Migrated

### 1. **Database Schema**
- ✅ All tables (profiles, trips, bookings, etc.)
- ✅ Columns and data types
- ✅ Constraints and indexes
- ✅ Foreign key relationships

### 2. **Data**
- ✅ All user profiles
- ✅ All trips
- ✅ All bookings
- ✅ All questionnaire responses
- ✅ All admin settings

### 3. **Authentication**
- ✅ User accounts (auth.users)
- ✅ Email addresses
- ✅ Password hashes
- ✅ User metadata

### 4. **Policies & Functions**
- ✅ Row Level Security (RLS) policies
- ✅ Database triggers
- ✅ Custom functions
- ✅ RBAC setup

---

## 🚀 Migration Steps

### **Step 1: Prepare New Database**

First, set up the schema in the new database:

1. Go to **NEW Supabase Dashboard**: https://supabase.com/dashboard/project/mqkazvelueppcravkdsc
2. Navigate to **SQL Editor**
3. Run these SQL files in order:

```sql
-- 1. Create profiles table and trigger
-- Run: setup_profiles_table.sql

-- 2. Set up RBAC (roles and permissions)
-- Run: supabase_rbac_setup.sql

-- 3. Set up trip signup flow
-- Run: trip_signup_setup.sql

-- 4. Complete setup
-- Run: SUPABASE_SETUP_COMPLETE.sql
```

---

### **Step 2: Export Data from Old Database**

#### **Option A: Using Supabase Dashboard (Recommended)**

1. Go to **OLD Supabase Dashboard**: https://supabase.com/dashboard/project/whdbtkkgesfgqtkfedne
2. Navigate to **Database** → **Backups**
3. Click **"Create Backup"** or use existing backup
4. Download the backup file

#### **Option B: Using SQL Export**

1. Go to **OLD Supabase Dashboard** → **SQL Editor**
2. Run the export script (see `export_old_data.sql`)
3. Copy the results

---

### **Step 3: Import Data to New Database**

#### **For Authentication Users:**

⚠️ **IMPORTANT**: User passwords cannot be directly migrated. You have 2 options:

**Option A: Reset Passwords (Recommended)**
- Users will need to use "Forgot Password" on first login
- Most secure method

**Option B: Manual User Creation**
- Create users via Supabase Dashboard
- Send password reset emails

#### **For Database Tables:**

1. Go to **NEW Supabase Dashboard** → **SQL Editor**
2. Run the import script (see `import_new_data.sql`)
3. Verify data was imported correctly

---

### **Step 4: Verify Migration**

Run these checks in **NEW Supabase Dashboard**:

```sql
-- Check user count
SELECT COUNT(*) FROM auth.users;

-- Check profiles
SELECT COUNT(*) FROM profiles;

-- Check trips
SELECT COUNT(*) FROM trips;

-- Check bookings
SELECT COUNT(*) FROM bookings;

-- Verify RLS policies
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

---

### **Step 5: Update Application**

Your `.env` file is already pointing to the new database:

```env
VITE_SUPABASE_URL=https://mqkazvelueppcravkdsc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ **No code changes needed!**

---

### **Step 6: Update Deployment Platforms**

#### **Netlify:**
1. Go to: **Site Settings** → **Environment Variables**
2. Update:
   ```
   VITE_SUPABASE_URL = https://mqkazvelueppcravkdsc.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xa2F6dmVsdWVwcGNyYXZrZHNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MTQ0MTMsImV4cCI6MjA4NTA5MDQxM30.-Evrlhcsw_lkKMVkoKPpjIT2uuMc1ukrdrruYPdpsnM
   ```
3. Trigger new deployment

#### **Vercel:**
1. Go to: **Project Settings** → **Environment Variables**
2. Update the same variables as above
3. Redeploy

---

## 📝 Migration Checklist

### Pre-Migration
- [ ] Backup old database
- [ ] Set up new database schema
- [ ] Test new database locally
- [ ] Document current data counts

### During Migration
- [ ] Export all data from old database
- [ ] Import data to new database
- [ ] Verify data integrity
- [ ] Test authentication flow

### Post-Migration
- [ ] Update environment variables (local)
- [ ] Update environment variables (Netlify)
- [ ] Update environment variables (Vercel)
- [ ] Test application end-to-end
- [ ] Notify users (if password reset needed)
- [ ] Monitor for errors
- [ ] Keep old database as backup (7-30 days)

---

## 🛠️ Automated Migration Script

I've created an automated migration script for you:

**File:** `migrate_database.sql`

This script will:
1. ✅ Export all data from old database
2. ✅ Transform data for new schema
3. ✅ Import to new database
4. ✅ Verify migration success

---

## ⚠️ Important Notes

### **Users & Passwords:**
- ❌ Password hashes **cannot** be migrated between Supabase projects
- ✅ User emails and metadata **can** be migrated
- 📧 Users will need to reset passwords on first login

### **Data Integrity:**
- ✅ All foreign key relationships will be preserved
- ✅ Timestamps will be maintained
- ✅ UUIDs will be regenerated (new IDs)

### **Downtime:**
- 🕐 Estimated migration time: 5-15 minutes
- 🚫 Consider maintenance mode during migration
- ✅ Old database remains available as backup

---

## 🆘 Troubleshooting

### **Issue: Import fails with constraint errors**
**Solution:** Disable constraints temporarily:
```sql
SET session_replication_role = 'replica';
-- Run imports
SET session_replication_role = 'origin';
```

### **Issue: User count doesn't match**
**Solution:** Check auth.users vs profiles:
```sql
-- Should match
SELECT COUNT(*) FROM auth.users;
SELECT COUNT(*) FROM profiles;
```

### **Issue: RLS policies blocking access**
**Solution:** Temporarily disable RLS for migration:
```sql
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- Run migration
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

---

## 📞 Support

If you encounter issues:
1. Check Supabase logs in both dashboards
2. Review migration script output
3. Verify environment variables
4. Test with a single user first

---

## ✅ Success Criteria

Migration is successful when:
- ✅ All tables exist in new database
- ✅ Row counts match between old and new
- ✅ Users can sign up and log in
- ✅ Application works end-to-end
- ✅ No console errors
- ✅ RLS policies are active

---

**Ready to migrate?** Follow the steps above or use the automated script!
