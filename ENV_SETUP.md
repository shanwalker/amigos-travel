# 🔐 Environment Variables Setup

## For Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual Supabase credentials in `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
   ```

⚠️ **Never commit `.env` to Git!** It's already in `.gitignore`.

---

## For Netlify Deployment

Add these environment variables in **Netlify Dashboard**:

1. Go to: **Site Settings** → **Build & Deploy** → **Environment**
2. Click **"Add environment variable"** or **"Import from .env"**
3. Add:
   ```
   VITE_SUPABASE_URL = https://whdbtkkgesfgqtkfedne.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZGJ0a2tnZXNmZ3F0a2ZlZG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NTYwODgsImV4cCI6MjA4NDEzMjA4OH0.GeQsaI7LW29-FL1AIm-lMPqduKaWUyRkH_JNEWTBKms
   ```
4. Mark both as **"Secret"** ✅
5. **Trigger a new deploy**

---

## For Vercel Deployment

Add these in **Vercel Dashboard**:

1. Go to: **Project Settings** → **Environment Variables**
2. Add the same two variables as above
3. Vercel will auto-deploy on next push

---

## Why This Matters

- ✅ `.env.example` has **placeholder values** (safe to commit)
- ❌ `.env` has **real credentials** (never commit!)
- 🔒 Deployment platforms use their own secure environment variable storage
- 🛡️ This prevents secrets from being exposed in Git history

---

**Current Supabase Project:**
- URL: `https://whdbtkkgesfgqtkfedne.supabase.co`
- These are public anon keys (safe for frontend use)
- Never commit service role keys!
