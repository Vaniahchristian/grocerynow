# WhatsApp Link Preview Troubleshooting Guide

## Issue: Image Preview Not Showing in WhatsApp

If WhatsApp is not showing image previews when sharing product links, follow these steps:

## ✅ What We've Fixed

1. **Converted to Next.js App Router Metadata API**
   - Replaced custom `head.tsx` with proper `layout.tsx` using `generateMetadata`
   - This ensures meta tags are properly rendered in the HTML

2. **Absolute Image URLs**
   - All image URLs are now absolute (starting with `https://grocerynowstore.com`)
   - Images are accessible via HTTPS

3. **Complete Open Graph Tags**
   - Added all required OG tags including `og:image:secure_url`
   - Proper image dimensions (1200x630 recommended)
   - Image alt text for accessibility

## 🔍 Testing Your Link Preview

### 1. Test with Facebook Debugger (WhatsApp uses same system)
Visit: https://developers.facebook.com/tools/debug/

Enter your product URL: `https://grocerynowstore.com/products/66`

Click "Scrape Again" to refresh the cache.

**What to check:**
- ✅ `og:image` tag is present
- ✅ Image URL is absolute (starts with https://)
- ✅ Image is accessible (not returning 404)
- ✅ Image dimensions are reasonable (at least 200x200px)

### 2. Test with WhatsApp Directly
1. Open WhatsApp Web or Mobile
2. Share a product link to yourself
3. Check if preview appears

**Note:** WhatsApp caches link previews. If you've shared the link before, you may need to:
- Clear WhatsApp cache (mobile app)
- Wait 24-48 hours for cache to expire
- Use a different WhatsApp account to test

### 3. Verify Image Accessibility
Test if your image URL is accessible:
```
https://grocerynowstore.com/api/uploads/[image-filename]
```

Replace `[image-filename]` with your actual product image filename.

**Requirements:**
- ✅ Image must be accessible without authentication
- ✅ Image must be served over HTTPS
- ✅ Image should be at least 200x200 pixels
- ✅ Image format: JPG, PNG, or WebP
- ✅ File size: Under 8MB (recommended under 1MB)

## 🛠️ Common Issues & Solutions

### Issue 1: Image URL Returns 404
**Problem:** The image path is incorrect or image doesn't exist.

**Solution:**
- Check if image exists at the URL
- Verify the image path in your database
- Ensure images are uploaded to the correct directory

### Issue 2: Image Not Loading (CORS/403)
**Problem:** Server is blocking access to images.

**Solution:**
- Check server CORS settings
- Ensure images are publicly accessible
- Verify file permissions on server

### Issue 3: WhatsApp Shows Old Preview
**Problem:** WhatsApp cached the old preview without image.

**Solution:**
- Use Facebook Debugger to clear cache
- Wait 24-48 hours
- Add a query parameter to force refresh: `?v=2`

### Issue 4: Image Too Small
**Problem:** Image dimensions are below WhatsApp's minimum (200x200px).

**Solution:**
- Resize images to at least 1200x630px (recommended)
- Use image optimization tools
- Ensure aspect ratio is appropriate

## 📋 Checklist

Before sharing links, verify:

- [ ] Product page loads correctly
- [ ] Open Graph tags are present (view page source, search for `og:image`)
- [ ] Image URL is absolute (starts with https://)
- [ ] Image is accessible (can open in browser)
- [ ] Image dimensions are adequate (at least 200x200px)
- [ ] Image file size is reasonable (< 1MB recommended)
- [ ] Tested with Facebook Debugger
- [ ] Cleared WhatsApp cache if needed

## 🔗 Useful Tools

1. **Facebook Sharing Debugger**
   https://developers.facebook.com/tools/debug/

2. **Open Graph Preview**
   https://www.opengraph.xyz/

3. **LinkedIn Post Inspector**
   https://www.linkedin.com/post-inspector/

4. **Twitter Card Validator**
   https://cards-dev.twitter.com/validator

5. **Schema Markup Validator**
   https://validator.schema.org/

## 🚀 Quick Fix Commands

### Clear WhatsApp Cache (Android)
1. Settings → Apps → WhatsApp
2. Storage → Clear Cache

### Clear WhatsApp Cache (iOS)
1. Delete and reinstall WhatsApp (backup first!)

### Force Refresh Preview
Add version parameter to URL:
```
https://grocerynowstore.com/products/66?v=2
```

## 📞 Still Not Working?

If images still don't show after following all steps:

1. **Check Server Logs**
   - Look for 404 errors on image requests
   - Check CORS headers

2. **Verify Image URLs**
   - Test image URL directly in browser
   - Ensure URL doesn't require authentication

3. **Contact Support**
   - Share the product URL
   - Share the image URL
   - Share screenshot of Facebook Debugger results

## 📝 Notes

- WhatsApp uses Facebook's Open Graph system
- Preview caching can take 24-48 hours to clear
- Images must be publicly accessible (no login required)
- HTTPS is required for secure image URLs
- Image dimensions: Minimum 200x200px, Recommended 1200x630px

---

**Last Updated:** January 2025
**Status:** Active Monitoring

