# 🚀 Quick Migration Steps

Follow these steps to migrate from old to new Supabase database:

## ⚡ Quick Start (5 Steps)

### **Step 1: Set Up New Database Schema** (5 minutes)

1. Open **NEW Supabase Dashboard**: https://supabase.com/dashboard/project/mqkazvelueppcravkdsc
2. Go to **SQL Editor**
3. Run these files **in order**:
   - `setup_profiles_table.sql`
   - `supabase_rbac_setup.sql`
   - `trip_signup_setup.sql`
   - `SUPABASE_SETUP_COMPLETE.sql`

✅ **Verify**: Check that tables exist in Database → Tables

---

### **Step 2: Export Data from Old Database** (2 minutes)

1. Open **OLD Supabase Dashboard**: https://supabase.com/dashboard/project/whdbtkkgesfgqtkfedne
2. Go to **SQL Editor**
3. Open `export_old_data.sql`
4. Run each query and **copy the results**
5. Save the INSERT statements

✅ **Verify**: You should have INSERT statements for profiles, trips, etc.

---

### **Step 3: Import Data to New Database** (3 minutes)

1. Open **NEW Supabase Dashboard**
2. Go to **SQL Editor**
3. Open `import_new_data.sql`
4. **Paste your INSERT statements** in the marked sections
5. Run the entire script

✅ **Verify**: Check row counts match old database

---

### **Step 4: Migrate Users** (10 minutes)

**Option A: Automated (Recommended)**
```bash
npm install @supabase/supabase-js
node migrate_users.js
```

**Option B: Manual**
1. Go to NEW Supabase → Authentication → Users
2. For each user from old database:
   - Click "Add User"
   - Enter email
   - Auto-confirm email ✅
   - Send password reset

✅ **Verify**: User count matches old database

---

### **Step 5: Update Environment Variables** (2 minutes)

Your local `.env` is already updated! ✅

Now update deployment platforms:

**Netlify:**
```
VITE_SUPABASE_URL = https://mqkazvelueppcravkdsc.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xa2F6dmVsdWVwcGNyYXZrZHNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MTQ0MTMsImV4cCI6MjA4NTA5MDQxM30.-Evrlhcsw_lkKMVkoKPpjIT2uuMc1ukrdrruYPdpsnM
```

**Vercel:** Same as above

✅ **Verify**: Redeploy and test

---

## 📊 Verification Checklist

After migration, verify:

- [ ] All tables exist in new database
- [ ] Row counts match old database
- [ ] Users can sign up
- [ ] Users can log in (after password reset)
- [ ] Application works locally
- [ ] Application works in production
- [ ] No console errors

---

## ⏱️ Total Time: ~25 minutes

---

## 🆘 Need Help?

See `DATABASE_MIGRATION_GUIDE.md` for detailed instructions and troubleshooting.

---

## ⚠️ Important Notes

1. **Passwords cannot be migrated** - Users must reset passwords
2. **Keep old database** as backup for 7-30 days
3. **Test thoroughly** before deleting old database
4. **Monitor logs** for any issues after migration

---

**Ready? Start with Step 1!** 🚀
