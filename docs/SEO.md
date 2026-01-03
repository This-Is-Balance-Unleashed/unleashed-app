# SEO Implementation Guide

This document outlines the comprehensive SEO setup for the Hit Refresh: Career + Wellness Summit 2026 website.

## Overview

The site is fully optimized for search engines with:
- ✅ Dynamic sitemap generation
- ✅ Robots.txt configuration
- ✅ Open Graph meta tags
- ✅ Twitter Card meta tags
- ✅ Event Schema (JSON-LD) markup
- ✅ PWA manifest
- ✅ Dynamic page metadata
- ✅ Semantic HTML structure

## Files Created

### 1. `/app/robots.ts`
Generates `robots.txt` dynamically for search engine crawlers.

```typescript
// Allows all bots, disallows /api/ and /admin/ routes
// References sitemap.xml
```

### 2. `/app/sitemap.ts`
Generates `sitemap.xml` dynamically with all important pages.

**Included Pages:**
- Homepage (priority: 1.0)
- Sponsor page (priority: 0.7)
- Partner page (priority: 0.7)
- All ticket purchase pages (priority: 0.8)

### 3. `/app/manifest.ts`
PWA manifest for installable app experience.

**Configuration:**
- Theme color: #39B54A (brand green)
- Display mode: standalone
- Orientation: portrait-primary
- Icons: 192x192 and 512x512 (create these!)

### 4. `/app/layout.tsx` (Enhanced)
Root layout with comprehensive metadata:

**Meta Tags:**
- Title template for consistent branding
- Rich description with keywords
- Open Graph tags for social sharing
- Twitter Card configuration
- Robot directives for search engines

### 5. `/components/seo/EventSchema.tsx`
Event structured data (JSON-LD) for Google rich results.

**Schema.org Event includes:**
- Event name, dates, location
- Mixed attendance mode (physical + virtual)
- All ticket offers with prices
- Organizer information
- Event status

### 6. `/app/purchase/[ticketTypeId]/layout.tsx`
Dynamic metadata for each ticket type page.

**Features:**
- Unique title and description per ticket
- Dynamic Open Graph tags
- Twitter Card optimization

## Required Actions

### 1. Create PWA Icons

You need to create the following icon files in `/public`:

```bash
/public/icon-192.png  # 192x192px
/public/icon-512.png  # 512x512px
```

**Recommended Tool:** Use your existing `/public/icon-logo.svg` and convert it to PNG at these sizes.

### 2. Set Environment Variables

Add to your `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=https://unleashed.conference
```

**For Production:** Update this to your actual domain.

### 3. Verify Open Graph Image

The site uses `/app/opengraph-image.tsx` which generates a dynamic OG image. Test it:

```bash
# Visit in browser:
https://your-domain.com/opengraph-image
```

### 4. Google Search Console Setup

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (domain or URL prefix)
3. Verify ownership using one of these methods:
   - DNS verification (recommended)
   - HTML tag (add to `app/layout.tsx` metadata.verification.google)
   - Upload HTML file

4. Submit sitemap:
   ```
   https://your-domain.com/sitemap.xml
   ```

### 5. Social Media Validation

Test your meta tags:

**Facebook/LinkedIn:**
- [Open Graph Debugger](https://developers.facebook.com/tools/debug/)

**Twitter:**
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

**Google Rich Results:**
- [Rich Results Test](https://search.google.com/test/rich-results)

## SEO Best Practices Implemented

### ✅ Technical SEO

1. **Crawlability**
   - Clean URL structure
   - Dynamic sitemap.xml
   - Proper robots.txt

2. **Indexability**
   - All pages indexable
   - No duplicate content issues
   - Canonical URLs via metadataBase

3. **Mobile Optimization**
   - Responsive design
   - PWA manifest
   - Viewport meta tag

### ✅ On-Page SEO

1. **Content Structure**
   - Semantic HTML (h1, h2, h3 hierarchy)
   - Descriptive page titles
   - Meta descriptions under 160 characters

2. **Rich Snippets**
   - Event Schema markup
   - Offer markup for tickets
   - Organization markup

3. **Social Sharing**
   - Open Graph tags
   - Twitter Cards
   - Custom OG image

### ✅ Performance

1. **Core Web Vitals**
   - Next.js optimizations
   - Image optimization
   - Font optimization (variable fonts)

## Monitoring & Analytics

### Google Analytics (Optional)

To add Google Analytics:

1. Create a GA4 property
2. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_GOOGLE_ANALYTICS=G-XXXXXXXXXX
   ```

3. Create `/app/analytics.tsx`:
   ```typescript
   // Google Analytics implementation
   ```

### Recommended Tools

1. **Google Search Console** - Monitor search performance
2. **Google Analytics 4** - Track user behavior
3. **Bing Webmaster Tools** - Bing search visibility
4. **Ahrefs/SEMrush** - Keyword research & tracking
5. **Schema Markup Validator** - Test structured data

## SEO Checklist

### Pre-Launch
- [ ] Create PWA icons (192x192, 512x512)
- [ ] Set NEXT_PUBLIC_SITE_URL environment variable
- [ ] Test Open Graph image
- [ ] Validate Event Schema markup
- [ ] Check all internal links work
- [ ] Verify mobile responsiveness

### Post-Launch
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Verify Open Graph tags (Facebook debugger)
- [ ] Verify Twitter Cards
- [ ] Test rich results (Google Rich Results Test)
- [ ] Set up Google Analytics (optional)
- [ ] Monitor Core Web Vitals
- [ ] Create backlinks (press releases, social media)

## Keywords Strategy

### Primary Keywords
- Hit Refresh Summit
- Career + Wellness Summit Nigeria
- Lagos Conference 2026
- Professional Development Nigeria

### Secondary Keywords
- Work-life balance Nigeria
- Career growth Lagos
- Wellness conference Africa
- Leadership development

### Long-tail Keywords
- "career and wellness summit Lagos 2026"
- "professional development conference Nigeria"
- "work-life balance event Lagos"

## Content Recommendations

### Blog Posts (Future)
1. "5 Ways to Achieve Work-Life Balance in 2026"
2. "Career Development Tips from Industry Leaders"
3. "Why Attend the Hit Refresh Summit?"
4. "Mental Wellness in the Workplace"
5. "Meet the Speakers: Hit Refresh Summit 2026"

### Landing Pages (Future)
1. `/speakers` - Speaker profiles
2. `/agenda` - Event schedule
3. `/venue` - Location & travel info
4. `/testimonials` - Past attendee reviews

## Local SEO

Since the event is in Lagos, Nigeria:

1. **Google Business Profile**
   - Create a profile for the event
   - Add accurate address and hours
   - Upload photos

2. **Local Citations**
   - List on event directories
   - Nigerian business directories
   - Lagos event calendars

3. **Local Keywords**
   - Include "Lagos" and "Nigeria" in content
   - Reference local landmarks
   - Target Nigerian audience

## Social Media Integration

Update your social profiles with:

```
Twitter/X: @unleashed_conf
Facebook: /unleashed.conference
Instagram: @unleashed.conference
LinkedIn: /company/unleashed-conference
```

## Troubleshooting

### Sitemap not updating?
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Open Graph image not showing?
- Check file exists at `/opengraph-image`
- Verify it's 1200x630px
- Use Facebook debugger to refresh cache

### Schema errors in Google Search Console?
- Validate at schema.org validator
- Check all required properties are present
- Ensure dates are in ISO format

## Additional Resources

- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org Event Documentation](https://schema.org/Event)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
