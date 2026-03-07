# Image Optimization Guide

## Issues Fixed

### 1. **Next.js Image Optimization Enabled**
- **Before**: `unoptimized: true` in `next.config.mjs`
- **After**: Enabled optimization with WebP/AVIF support
- **Impact**: 30-50% smaller file sizes, faster loading

### 2. **Hero Carousel Improvements**
- **Preloading**: Next slide images are preloaded for smooth transitions
- **Blur Placeholder**: Shows blur effect while images load
- **Better Sizing**: Responsive `sizes` attribute for optimal loading
- **Quality Optimization**: Reduced to 85% for hero images (good balance)

### 3. **Product Card Optimization**
- **Next.js Image Component**: Replaced `<img>` with optimized `<Image>`
- **Responsive Sizing**: Proper `sizes` for different screen sizes
- **Quality Optimization**: 80% quality for product images
- **Blur Placeholder**: Smooth loading experience

## Additional Recommendations

### 1. **Compress Your Source Images**
```bash
# Install image optimization tools
npm install -g imagemin-cli imagemin-webp imagemin-mozjpeg imagemin-pngquant

# Compress images (run in public folder)
imagemin *.png --plugin=pngquant --plugin.webp.quality=80 --plugin.webp.lossless=false --out-dir=optimized
```

### 2. **Convert to WebP Format**
- Convert PNG/JPG to WebP for 25-35% smaller file sizes
- Keep original formats as fallbacks

### 3. **Implement Lazy Loading Strategy**
```tsx
// For images below the fold
<Image
  src={imageUrl}
  alt="Description"
  loading="lazy" // Only loads when in viewport
  priority={false}
/>
```

### 4. **Use CDN for Images**
Consider using a CDN like Cloudinary or Vercel's Image Optimization:
```tsx
// Example with Cloudinary
<Image
  src={`https://res.cloudinary.com/your-cloud/image/upload/q_auto,f_auto/${imagePath}`}
  alt="Description"
  width={400}
  height={300}
/>
```

### 5. **Optimize Image Dimensions**
- Hero images: 1920x1080px max
- Product images: 800x600px max
- Thumbnails: 400x300px max

### 6. **Add Loading States**
```tsx
const [imageLoaded, setImageLoaded] = useState(false);

<Image
  src={imageUrl}
  onLoad={() => setImageLoaded(true)}
  className={`transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
/>
```

## Performance Monitoring

### 1. **Check Core Web Vitals**
- Use Google PageSpeed Insights
- Monitor Largest Contentful Paint (LCP)
- Check Cumulative Layout Shift (CLS)

### 2. **Network Tab Analysis**
- Check image file sizes in DevTools
- Monitor loading times
- Verify WebP/AVIF delivery

### 3. **Lighthouse Scores**
- Aim for 90+ Performance score
- Check "Properly size images" audit
- Verify "Serve images in next-gen formats"

## Expected Improvements

- **50-70% faster image loading**
- **30-50% smaller file sizes**
- **Better Core Web Vitals scores**
- **Smoother carousel transitions**
- **Improved mobile performance**

## Backend Image Optimization

Consider implementing server-side image optimization:

```javascript
// Example with Sharp library
const sharp = require('sharp');

app.get('/api/images/:filename', async (req, res) => {
  const { filename } = req.params;
  const { w, h, q } = req.query;
  
  const image = sharp(`uploads/${filename}`);
  
  if (w || h) {
    image.resize(parseInt(w), parseInt(h));
  }
  
  const quality = parseInt(q) || 80;
  const buffer = await image.jpeg({ quality }).toBuffer();
  
  res.set('Content-Type', 'image/jpeg');
  res.send(buffer);
});
```
