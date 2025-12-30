# 🚀 Vercel Deployment Guide - Nexus Application

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Setup

#### Backend Environment Variables (Vercel)
Go to your Vercel project → Settings → Environment Variables and add:

```
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
ACCESS_TOKEN_SECRET=your_32_character_minimum_secret_key
REFRESH_TOKEN_SECRET=your_32_character_minimum_secret_key
REFRESH_TOKEN_SECRET=your_32_character_minimum_secret_key
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://www.your-domain.com
```

#### Frontend Environment Variables (Vercel)
```
REACT_APP_API_URL=https://your-backend.vercel.app
REACT_APP_SOCKET_URL=https://your-backend.vercel.app
REACT_APP_FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

---

## 🏗️ Deployment Options

### Option 1: Separate Deployments (Recommended)

#### Deploy Backend First:
1. Create new Vercel project for backend
2. Root Directory: `/` (root of repo)
3. Framework Preset: Other
4. Build Command: `npm install`
5. Output Directory: (leave empty)
6. Install Command: `npm install`
7. Add backend environment variables

#### Deploy Frontend Second:
1. Create new Vercel project for frontend
2. Root Directory: `/client`
3. Framework Preset: Create React App
4. Build Command: `npm run build`
5. Output Directory: `build`
6. Install Command: `npm install`
7. Add frontend environment variables
8. **Important:** Add rewrite rule in `client/vercel.json` (already created)

### Option 2: Monorepo Deployment (Advanced)

If deploying both from same repo:
1. Use Vercel's monorepo support
2. Configure separate build commands
3. Set up proper routing

---

## 🔧 Build Configuration

### Backend Build Settings:
- **Node Version:** 18.x (specified in package.json)
- **Build Command:** `npm install` (no build needed for Node.js)
- **Output Directory:** (empty)

### Frontend Build Settings:
- **Node Version:** 18.x
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

---

## 🛣️ Routing Configuration

### Frontend Routing (React Router)
The `client/vercel.json` file already includes the rewrite rule:
```json
{
  "rewrites": [
    {
      "source": "/((?!api).*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures all routes (except `/api/*`) serve `index.html` for client-side routing.

---

## ✅ Post-Deployment Verification

### 1. Test Backend Health
```bash
curl https://your-backend.vercel.app/api/health
```
Should return: `{"status":"ok","timestamp":"...","environment":"production"}`

### 2. Test Frontend Routes
- Visit: `https://your-frontend.vercel.app/`
- Visit: `https://your-frontend.vercel.app/profile/123` (should not 404)
- Visit: `https://your-frontend.vercel.app/message` (should not 404)

### 3. Test API Connection
- Open browser console on frontend
- Check for API errors
- Verify socket connection

### 4. Test Mobile Responsiveness
- Use Chrome DevTools mobile emulator
- Test on actual mobile devices
- Check viewport height behavior
- Verify touch targets

---

## 🐛 Common Issues & Solutions

### Issue 1: 404 on Direct URL Access
**Solution:** Verify `client/vercel.json` rewrite rules are in place

### Issue 2: CORS Errors
**Solution:** 
1. Check `ALLOWED_ORIGINS` includes your frontend URL
2. Verify no trailing slashes in URLs
3. Check credentials are enabled

### Issue 3: Socket Connection Fails
**Solution:**
1. Verify `REACT_APP_SOCKET_URL` matches backend URL
2. Check WebSocket support on Vercel (may need upgrade)
3. Verify CORS allows WebSocket connections

### Issue 4: Environment Variables Not Working
**Solution:**
1. Ensure `REACT_APP_` prefix for frontend variables
2. Redeploy after adding variables
3. Check variable names match exactly

### Issue 5: Build Fails
**Solution:**
1. Check Node.js version (should be 18.x)
2. Verify all dependencies are in package.json
3. Check build logs for specific errors
4. Try removing `--openssl-legacy-provider` if Node 18+

---

## 📱 Mobile Testing

### Test on Real Devices:
1. **iOS Safari:**
   - Test viewport height
   - Check safe area insets
   - Verify keyboard behavior

2. **Android Chrome:**
   - Test viewport height
   - Check touch targets
   - Verify scrolling

### Chrome DevTools Testing:
1. Open DevTools → Toggle device toolbar
2. Test various device sizes
3. Test orientation changes
4. Simulate slow 3G network

---

## 🔒 Security Checklist

- [ ] All secrets in environment variables (not in code)
- [ ] CORS properly configured
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Secure cookies configured
- [ ] No sensitive data in client-side code
- [ ] API rate limiting (consider adding)

---

## 📊 Monitoring

### Recommended:
1. Set up Vercel Analytics
2. Monitor error logs
3. Track API response times
4. Monitor socket connection stability

---

## 🚨 Rollback Plan

If deployment fails:
1. Use Vercel's deployment history
2. Rollback to previous working version
3. Fix issues locally
4. Redeploy

---

## 📞 Support Resources

- Vercel Docs: https://vercel.com/docs
- React Router Deployment: https://reactrouter.com/en/main/start/overview
- Socket.IO Deployment: https://socket.io/docs/v4/production-checklist/

---

## ✨ Next Steps After Deployment

1. Set up custom domain (optional)
2. Configure CDN caching
3. Set up monitoring/alerts
4. Optimize images
5. Enable compression
6. Set up error tracking (Sentry, etc.)

