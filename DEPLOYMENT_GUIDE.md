# 🚀 Travel Amigo - Deployment Guide

This guide will help you deploy Travel Amigo to a live website accessible via GitHub.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:
- ✅ All code changes are committed to Git
- ✅ Supabase database is set up and accessible
- ✅ You have access to the GitHub repository
- ✅ You have a Vercel or Netlify account (free tier works)

---

## 🎯 Recommended: Deploy to Vercel

Vercel is the **easiest and fastest** way to deploy this Vite + React app.

### Step 1: Prepare Environment Variables

First, we need to move Supabase credentials to environment variables for security.

**Create `.env` file:**
```bash
# Create .env file in project root
VITE_SUPABASE_URL=https://whdbtkkgesfgqtkfedne.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZGJ0a2tnZXNmZ3F0a2ZlZG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTYwODgsImV4cCI6MjA4NDEzMjA4OH0.GeQsaI7LW29-FL1AIm-lMPqduKaWUyRkH_JNEWTBKms
```

**Update `.gitignore` to include `.env`:**
```
.env
.env.local
.env.production
```

**Update `src/integrations/supabase/client.ts`:**
```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### Step 2: Test Local Build

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

Visit `http://localhost:4173` and test:
- ✅ Homepage loads correctly
- ✅ V1/V2 toggle works
- ✅ Login/Signup works
- ✅ Dashboard is accessible
- ✅ Admin panel works

### Step 3: Commit Changes

```bash
git add .
git commit -m "Prepare for deployment: Move Supabase config to env variables"
git push origin main
```

### Step 4: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Easiest)

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in with GitHub**
3. **Click "Add New Project"**
4. **Import your GitHub repository:** `shanwalker/amigos-test`
5. **Configure Project:**
   - Framework Preset: **Vite**
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Add Environment Variables:**
   - `VITE_SUPABASE_URL` = `https://whdbtkkgesfgqtkfedne.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
7. **Click "Deploy"**

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? amigos-test
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add VITE_SUPABASE_URL
# Paste: https://whdbtkkgesfgqtkfedne.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# Paste: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Deploy to production
vercel --prod
```

### Step 5: Configure Custom Domain (Optional)

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain (e.g., `travelamigo.com`)
4. Follow DNS configuration instructions
5. Vercel will automatically provision SSL certificate

---

## 🌐 Alternative: Deploy to Netlify

### Step 1: Create `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 2: Deploy via Netlify Dashboard

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign in with GitHub**
3. **Click "Add new site" → "Import an existing project"**
4. **Connect to GitHub:** Select `shanwalker/amigos-test`
5. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
6. **Environment Variables:**
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`
7. **Click "Deploy site"**

### Step 3: Configure Custom Domain

1. Go to **"Domain settings"**
2. Click **"Add custom domain"**
3. Follow DNS configuration
4. SSL is automatic

---

## 📦 Alternative: Deploy to GitHub Pages

**Note:** GitHub Pages requires additional configuration for SPA routing.

### Step 1: Install `gh-pages`

```bash
npm install --save-dev gh-pages
```

### Step 2: Update `package.json`

Add these scripts:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://shanwalker.github.io/amigos-test"
}
```

### Step 3: Update `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  base: '/amigos-test/', // Add this line
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Step 4: Create `404.html` for SPA routing

Copy `dist/index.html` to `dist/404.html` after build.

### Step 5: Deploy

```bash
npm run deploy
```

Your site will be live at: `https://shanwalker.github.io/amigos-test`

**Limitations:**
- ⚠️ Requires `/amigos-test` base path
- ⚠️ No custom domain without DNS configuration
- ⚠️ Manual environment variable handling

---

## 🔒 Security Best Practices

### 1. Environment Variables
- ✅ Never commit `.env` files to Git
- ✅ Use different Supabase keys for dev/prod
- ✅ Rotate keys if accidentally exposed

### 2. Supabase Security
- ✅ Enable Row Level Security (RLS) on all tables
- ✅ Configure proper authentication policies
- ✅ Use service role key only on backend (never frontend)

### 3. CORS Configuration
- ✅ Configure allowed origins in Supabase dashboard
- ✅ Add your production domain to allowed list

---

## 🧪 Post-Deployment Testing

After deployment, test these critical paths:

### Public Pages
- [ ] Homepage loads (V1 and V2)
- [ ] All sections render correctly
- [ ] Images and videos load
- [ ] Animations work smoothly
- [ ] Mobile responsive

### Authentication
- [ ] Signup creates new user
- [ ] Login works with correct credentials
- [ ] Logout clears session
- [ ] Password reset email sends
- [ ] Protected routes redirect to login

### User Dashboard
- [ ] Dashboard home shows user data
- [ ] Browse trips displays all trips
- [ ] Trip details page works
- [ ] Booking creation works
- [ ] Profile updates save
- [ ] Wishlist add/remove works

### Admin Dashboard
- [ ] Admin login works
- [ ] Only admin users can access
- [ ] Trip CRUD operations work
- [ ] User management works
- [ ] Testimonials management works
- [ ] Newsletter management works

---

## 🐛 Common Deployment Issues

### Issue 1: "404 Not Found" on refresh
**Cause:** SPA routing not configured  
**Solution:** Add redirect rules (see Netlify/Vercel config above)

### Issue 2: "Supabase connection failed"
**Cause:** Environment variables not set  
**Solution:** Add env vars in deployment platform dashboard

### Issue 3: "Build failed"
**Cause:** TypeScript errors or missing dependencies  
**Solution:** Run `npm run build` locally first, fix errors

### Issue 4: Blank page after deployment
**Cause:** Base path mismatch or build output directory wrong  
**Solution:** Check `vite.config.ts` base path and output directory

### Issue 5: Images not loading
**Cause:** Incorrect asset paths  
**Solution:** Use relative paths or import images in components

---

## 📊 Monitoring & Analytics

### Recommended Tools

1. **Vercel Analytics** (built-in)
   - Page views
   - Performance metrics
   - Real user monitoring

2. **Google Analytics**
   - Add GA4 tracking code to `index.html`
   - Track user journeys

3. **Sentry** (Error Tracking)
   - Install Sentry SDK
   - Monitor production errors

4. **Supabase Dashboard**
   - Monitor database queries
   - Check authentication logs
   - Review API usage

---

## 🔄 Continuous Deployment

Once set up, any push to `main` branch will automatically deploy:

```bash
# Make changes locally
git add .
git commit -m "Update hero section"
git push origin main

# Vercel/Netlify automatically:
# 1. Detects push
# 2. Runs build
# 3. Deploys to production
# 4. Sends notification
```

---

## 🎉 You're Live!

After deployment, your Travel Amigo website will be accessible at:

- **Vercel:** `https://amigos-test.vercel.app` (or custom domain)
- **Netlify:** `https://amigos-test.netlify.app` (or custom domain)
- **GitHub Pages:** `https://shanwalker.github.io/amigos-test`

Share your live URL and start accepting bookings! 🚀✈️

---

## 📞 Need Help?

If you encounter issues:
1. Check deployment logs in platform dashboard
2. Review this guide's troubleshooting section
3. Check Vercel/Netlify documentation
4. Verify Supabase connection in dashboard

**Happy Deploying! 🎊**
