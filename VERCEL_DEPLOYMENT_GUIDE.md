# Vercel Deployment Guide

## Quick Setup Steps

### 1. Environment Variables Setup

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

```
REACT_APP_API_URL=https://your-backend-url.vercel.app/api
REACT_APP_SOCKET_URL=https://your-backend-url.vercel.app
REACT_APP_BASE_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

### 2. Build Configuration

Vercel will automatically detect React apps, but ensure:
- **Root Directory:** `client` (if deploying frontend separately)
- **Build Command:** `npm run build`
- **Output Directory:** `build`
- **Install Command:** `npm install`

### 3. Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] `_redirects` file exists in `client/public/`
- [ ] `.env.production` file created (optional, env vars in Vercel take precedence)
- [ ] Test build locally: `cd client && npm run build`
- [ ] Verify no hardcoded URLs remain
- [ ] Check that `PageRender.js` doesn't use dynamic require

### 4. Post-Deployment Testing

1. Test direct URL access (e.g., `/profile/123`)
2. Test API connections
3. Test Socket.io connections
4. Test on mobile devices
5. Check browser console for errors

### 5. Common Issues & Solutions

**Issue:** 404 on direct URL access
**Solution:** Ensure `client/public/_redirects` exists with `/*    /index.html   200`

**Issue:** API calls fail
**Solution:** Check `REACT_APP_API_URL` is set correctly in Vercel

**Issue:** Socket.io doesn't connect
**Solution:** Verify `REACT_APP_SOCKET_URL` matches backend URL

**Issue:** Build fails
**Solution:** Check Node version (should be 18.x), remove `--openssl-legacy-provider` if present

