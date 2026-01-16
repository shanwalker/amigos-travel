# 🔧 Fix Vercel Auto-Deploy

## Problem
Vercel is not automatically deploying when you push to GitHub.

---

## ✅ Solution: Enable Auto-Deploy in Vercel

### Step 1: Check Git Integration

1. Go to your **Vercel Dashboard**
2. Click on your project **"amigos-test"**
3. Click **"Settings"** (top navigation)
4. Click **"Git"** in the left sidebar

### Step 2: Verify Connection

You should see:
- ✅ **Connected to:** `shanwalker/amigos-test`
- ✅ **Production Branch:** `main`

If you see "Not connected" or different repo:
1. Click **"Disconnect"**
2. Click **"Connect Git Repository"**
3. Select **GitHub**
4. Choose `shanwalker/amigos-test`
5. Click **"Connect"**

### Step 3: Enable Auto-Deploy

In the **Git** settings, make sure these are enabled:

- ✅ **Auto-deploy on push to production branch** (should be ON)
- ✅ Production branch: **`main`**

### Step 4: Check GitHub App Permissions

1. Go to **GitHub.com**
2. Click your profile → **Settings**
3. Click **Applications** → **Installed GitHub Apps**
4. Find **"Vercel"**
5. Click **"Configure"**
6. Make sure `shanwalker/amigos-test` is in the **Repository access** list
7. If not, add it and save

---

## 🚀 Manual Deploy (For Now)

While you fix auto-deploy, manually deploy the latest version:

### Method 1: Redeploy Latest
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **"..."** (three dots)
4. Click **"Redeploy"**
5. Select **"Use existing Build Cache"** or **"Rebuild"**
6. Click **"Redeploy"**

### Method 2: Deploy via CLI (Alternative)
```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 🧪 Test Auto-Deploy

After fixing the settings, test it:

1. Make a small change (e.g., add a comment in a file)
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test auto-deploy"
   git push origin main
   ```
3. Go to Vercel dashboard
4. Within 10-20 seconds, you should see a new deployment start

---

## 🔍 Troubleshooting

### If auto-deploy still doesn't work:

**Check Webhook:**
1. Go to **GitHub.com** → Your repo
2. **Settings** → **Webhooks**
3. Look for a Vercel webhook
4. If missing, reconnect Vercel to GitHub

**Check Build Logs:**
1. Go to Vercel **Deployments**
2. Click on a deployment
3. Check the **Build Logs** for errors

**Common Issues:**
- ❌ Vercel GitHub App not authorized
- ❌ Wrong production branch selected
- ❌ Auto-deploy toggle is OFF
- ❌ Webhook deleted or not working

---

## 📊 Expected Behavior

Once fixed, every time you:
```bash
git push origin main
```

Vercel will:
1. ✅ Detect the push (within 10 seconds)
2. ✅ Start building (shows "Building" status)
3. ✅ Deploy to production (2-4 minutes)
4. ✅ Send you a notification
5. ✅ Update your live URL

---

## 🎯 Quick Fix Checklist

- [ ] Vercel connected to `shanwalker/amigos-test`
- [ ] Production branch is `main`
- [ ] Auto-deploy is enabled
- [ ] GitHub App has repository access
- [ ] Webhook exists in GitHub repo settings
- [ ] Test push triggers deployment

---

**After following these steps, auto-deploy should work!** 🚀

If it still doesn't work, you can always manually redeploy from the Vercel dashboard.
