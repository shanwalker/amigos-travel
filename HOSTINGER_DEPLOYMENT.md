# 🚀 DEPLOY TO HOSTINGER - COMPLETE GUIDE

## ✅ BUILD COMPLETED SUCCESSFULLY!

Your production build is ready in the `dist` folder.

---

## 📦 WHAT'S IN THE BUILD?

The `dist` folder contains:
- `index.html` - Main HTML file
- `assets/` - All JS, CSS, images optimized
- All static files ready for production

---

## 🌐 HOSTINGER DEPLOYMENT - STEP BY STEP

### **METHOD 1: File Manager Upload (Easiest)**

#### **Step 1: Access Hostinger**
1. Login to Hostinger: https://hpanel.hostinger.com
2. Go to your hosting plan
3. Click **"File Manager"**

#### **Step 2: Navigate to Public Folder**
1. In File Manager, go to: `public_html/` (or `domains/yourdomain.com/public_html/`)
2. **Delete** all existing files in this folder (if any)

#### **Step 3: Upload Build Files**
1. Click **"Upload Files"** button
2. Navigate to: `s:\AI Websites\Shan Git\amigos-test\dist`
3. Select **ALL files and folders** inside `dist`:
   - `index.html`
   - `assets` folder
   - Any other files
4. Upload everything
5. Wait for upload to complete

#### **Step 4: Create .htaccess File**
1. In File Manager, click **"New File"**
2. Name it: `.htaccess`
3. Click **"Edit"**
4. Paste this code:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>
```

5. Click **"Save"**

#### **Step 5: Set Environment Variables**
1. In Hostinger hPanel, go to **"Advanced"** → **"PHP Configuration"**
2. Add environment variables (if needed):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

**Note:** Your app already has these hardcoded, so this step is optional.

#### **Step 6: Test Your Site**
1. Visit your domain: `https://yourdomain.com`
2. Check if the site loads correctly
3. Test navigation and features

---

### **METHOD 2: FTP Upload (Alternative)**

#### **Step 1: Get FTP Credentials**
1. In Hostinger hPanel
2. Go to **"Files"** → **"FTP Accounts"**
3. Note down:
   - FTP Host
   - Username
   - Password
   - Port (usually 21)

#### **Step 2: Connect via FTP Client**
1. Download **FileZilla** (free): https://filezilla-project.org
2. Open FileZilla
3. Enter your FTP credentials:
   - Host: `ftp.yourdomain.com`
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21
4. Click **"Quickconnect"**

#### **Step 3: Upload Files**
1. On the left (Local): Navigate to `s:\AI Websites\Shan Git\amigos-test\dist`
2. On the right (Remote): Navigate to `public_html/`
3. Select all files from `dist` folder
4. Drag and drop to `public_html/`
5. Wait for upload to complete

#### **Step 4: Create .htaccess**
Same as Method 1, Step 4

---

### **METHOD 3: Git Deployment (Advanced)**

#### **Step 1: Enable Git in Hostinger**
1. In hPanel, go to **"Advanced"** → **"Git"**
2. Click **"Create Repository"**
3. Enter your GitHub repository URL:
   ```
   https://github.com/shanwalker/amigos-test.git
   ```
4. Branch: `main`
5. Deploy path: `public_html/`

#### **Step 2: Add Build Script**
This won't work directly because Hostinger needs the built files, not source code.

**Better approach:**
1. Use GitHub Actions to build
2. Deploy built files to Hostinger via FTP

---

## 🔧 IMPORTANT CONFIGURATIONS

### **1. Update Base URL (if needed)**

If your site is in a subfolder, update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/', // Change to '/subfolder/' if needed
  // ... rest of config
});
```

### **2. Check PHP Version**
1. In Hostinger hPanel
2. Go to **"Advanced"** → **"PHP Configuration"**
3. Select **PHP 8.1** or higher

### **3. SSL Certificate**
1. In hPanel, go to **"Security"** → **"SSL"**
2. Enable **Free SSL Certificate**
3. Force HTTPS redirect

---

## 📝 QUICK CHECKLIST

- [ ] Build project (`npm run build`)
- [ ] Upload `dist` folder contents to `public_html/`
- [ ] Create `.htaccess` file
- [ ] Test website loads
- [ ] Test all routes work
- [ ] Test login/signup
- [ ] Test admin dashboard
- [ ] Enable SSL
- [ ] Force HTTPS

---

## 🐛 TROUBLESHOOTING

### **Problem: 404 on page refresh**
**Solution:** Make sure `.htaccess` file is created correctly

### **Problem: Blank white page**
**Solution:** 
1. Check browser console for errors
2. Verify all files uploaded correctly
3. Check if `index.html` is in root of `public_html/`

### **Problem: CSS/JS not loading**
**Solution:**
1. Check if `assets` folder uploaded
2. Clear browser cache
3. Check file permissions (should be 644)

### **Problem: API errors**
**Solution:**
1. Verify Supabase credentials
2. Check CORS settings in Supabase
3. Add your domain to Supabase allowed origins

---

## 🔄 UPDATING YOUR SITE

When you make changes:

1. **Build again:**
   ```bash
   npm run build
   ```

2. **Upload new files:**
   - Delete old files in `public_html/`
   - Upload new `dist` contents
   - Keep `.htaccess` file

3. **Clear cache:**
   - Clear browser cache
   - Or use Ctrl+Shift+R (hard refresh)

---

## 🎯 AUTOMATED DEPLOYMENT (Optional)

### **Using GitHub Actions + FTP**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Hostinger

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
    
    - name: Deploy via FTP
      uses: SamKirkland/FTP-Deploy-Action@4.3.0
      with:
        server: ftp.yourdomain.com
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./dist/
        server-dir: /public_html/
```

Add secrets in GitHub:
- `FTP_USERNAME`
- `FTP_PASSWORD`

---

## 📊 PERFORMANCE TIPS

1. **Enable Caching** - Already in `.htaccess`
2. **Enable GZIP** - Already in `.htaccess`
3. **Use CDN** - Hostinger has built-in CDN
4. **Optimize Images** - Use WebP format
5. **Minify Assets** - Already done by Vite

---

## 🌐 CUSTOM DOMAIN

If you have a custom domain:

1. In Hostinger hPanel
2. Go to **"Domains"**
3. Click **"Add Domain"**
4. Follow the wizard
5. Update DNS settings

---

## ✅ FINAL STEPS

After deployment:

1. Visit your site
2. Test all features:
   - Homepage loads
   - Navigation works
   - Login/Signup works
   - Admin dashboard accessible
   - AI chat works
   - All pages load
3. Check mobile responsiveness
4. Test on different browsers
5. Monitor for errors

---

## 📞 SUPPORT

**Hostinger Support:**
- Live Chat: Available 24/7
- Knowledge Base: https://support.hostinger.com

**Common Issues:**
- File permissions: 644 for files, 755 for folders
- PHP version: Use 8.1+
- Memory limit: Increase if needed

---

## 🎉 SUCCESS!

Your Travel Amigo website should now be live on Hostinger!

**Next Steps:**
1. Share your live URL
2. Monitor analytics
3. Set up backups
4. Keep dependencies updated

---

**Need help?** Just ask! 🚀
