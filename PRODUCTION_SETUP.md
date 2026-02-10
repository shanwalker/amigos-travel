# 🚀 Production Setup Guide: AI Chatbot

If the Amigo AI Chatbot works locally (`localhost`) but fails in production (Live URL), it is because of **missing Environment Variables**.

## 🔑 The Missing Key

The AI feature requires the **Gemini API Key** to function. This key is in your local `.env` file but needs to be added to your hosting provider.

### Variable Name:
`VITE_GEMINI_API_KEY`

---

## 🛠️ How to Fix (by Support Platform)

### If using Vercel:
1. Go to your **Vercel Dashboard**.
2. Select your project **amigos-test**.
3. Go to **Settings > Environment Variables**.
4. Add New Variable:
   - **Key:** `VITE_GEMINI_API_KEY`
   - **Value:** *(Paste your AIza... API Key here)*
5. **Redeploy** your application for changes to take effect.

### If using Netlify:
1. Go to **Site Configuration > Environment Variables**.
2. Add Variable: `VITE_GEMINI_API_KEY`.
3. Paste the value.
4. **Trigger a new deploy**.

### If using Lovable / Other:
1. Look for **Project Settings** or **Secrets**.
2. Find **Environment Variables**.
3. Add `VITE_GEMINI_API_KEY` and your key.
4. **Rebuild/Redeploy**.

---

## 🔍 How to Verify
1. Open your live website.
2. Right-click > **Inspect** > **Console**.
3. Open the Chatbot.
4. If you see: `🚨 PRODUCTION ISSUE: It seems the Gemini API Key is missing...`
   - The key is still missing or incorrect.
5. If it works, you're all set! ✅
