# 🚀 Vercel Deployment Guide - Trip Proposal Demo

## Quick Deploy (5 minutes)

### Option 1: Deploy via Vercel CLI (Recommended)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy
```bash
cd "c:/Users/shan/Documents/Anti-Gravity Projects/amigos-test"
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → amigos-trip-proposals (or your choice)
- **Directory?** → ./
- **Override settings?** → No

#### Step 4: Add Environment Variables
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

Paste your Supabase URL and anon key when prompted.

#### Step 5: Deploy to Production
```bash
vercel --prod
```

**Your demo URL will be:** `https://amigos-trip-proposals.vercel.app`

---

### Option 2: Deploy via Vercel Dashboard (No CLI)

#### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Trip Proposal System"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/amigos-trip-proposals.git
git push -u origin main
```

#### Step 2: Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

#### Step 3: Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables, add:
- `VITE_SUPABASE_URL` = Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key

#### Step 4: Deploy
Click **"Deploy"** and wait 2-3 minutes.

**Your demo URL:** `https://your-project-name.vercel.app`

---

## 🎯 Creating a Demo Proposal URL

After deployment, you need a specific proposal to share:

### Step 1: Get Proposal ID
Run this in Supabase SQL Editor:
```sql
SELECT id, destination_name, status 
FROM trip_proposals 
WHERE status = 'published'
ORDER BY created_at DESC 
LIMIT 1;
```

### Step 2: Create Demo URL
Your shareable demo URL will be:
```
https://your-project-name.vercel.app/dashboard/proposals/[PROPOSAL_ID]
```

Example:
```
https://amigos-trip-proposals.vercel.app/dashboard/proposals/123e4567-e89b-12d3-a456-426614174000
```

---

## 🔒 Making Proposal Public (Optional)

By default, proposals require login. To make a demo publicly accessible:

### Option A: Create a Demo Route (Recommended)
Create a public demo route that doesn't require authentication:

1. Add this route to `App.tsx`:
```tsx
<Route path="/demo/proposal/:id" element={<TripProposalViewer />} />
```

2. Update RLS policy in Supabase:
```sql
-- Allow public read for demo proposals
CREATE POLICY "Public can view demo proposals"
ON trip_proposals FOR SELECT
USING (status = 'published');
```

3. Share URL:
```
https://your-app.vercel.app/demo/proposal/[PROPOSAL_ID]
```

### Option B: Create a Demo User
1. Create a demo account: `demo@travelamigo.com` / `demo123`
2. Share credentials with the URL
3. Users login and view proposals

---

## 📱 Custom Domain (Optional)

### Add Custom Domain in Vercel
1. Go to Project Settings → Domains
2. Add your domain (e.g., `demo.travelamigo.com`)
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

**Demo URL becomes:** `https://demo.travelamigo.com/dashboard/proposals/[ID]`

---

## 🎬 Demo Features to Showcase

Your deployed demo will include:
- ✅ Animated hero section with Bali beach
- ✅ Scroll-triggered animations
- ✅ Mobile-responsive design
- ✅ 6 beautiful experience cards
- ✅ Pricing breakdown with animations
- ✅ Professional gradient design

---

## 🔧 Troubleshooting

### Build Fails
- Check `package.json` has all dependencies
- Ensure `.env.production` variables are set in Vercel
- Review build logs in Vercel dashboard

### Blank Page After Deploy
- Check browser console for errors
- Verify Supabase URL and anon key are correct
- Ensure RLS policies allow access

### Images Not Loading
- Check Supabase storage bucket is public
- Verify image URLs are accessible
- Check CORS settings in Supabase

---

## 🚀 Quick Commands Reference

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]
```

---

## 📊 Deployment Checklist

- [ ] Vercel account created
- [ ] Project deployed
- [ ] Environment variables added
- [ ] Test proposal created in database
- [ ] Demo URL tested and working
- [ ] Mobile responsiveness verified
- [ ] Animations working smoothly
- [ ] Images loading correctly

---

## 🎉 Success!

Once deployed, share your demo URL:
```
https://your-project-name.vercel.app/dashboard/proposals/[PROPOSAL_ID]
```

**Deployment time:** ~3-5 minutes  
**Free tier:** Unlimited bandwidth, 100GB/month  
**SSL:** Automatic HTTPS  
**CDN:** Global edge network
