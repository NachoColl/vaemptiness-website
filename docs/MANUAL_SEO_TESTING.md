# Manual SEO Testing Guide

Quick reference for testing vaemptiness.es with online validation tools.

---

## Test URLs

**Priority Pages to Test:**
1. Homepage: https://vaemptiness.es/
2. Adult Program: https://vaemptiness.es/vaemptiness-program/
3. FAQ: https://vaemptiness.es/faq/
4. Blog Post: https://vaemptiness.es/blog/filosofia-budista-vaemptiness/
5. About: https://vaemptiness.es/sobre-nosotros/

---

## 1. Google Rich Results Test

**URL:** https://search.google.com/test/rich-results

### Steps:
1. Open the Rich Results Test tool
2. Paste one of the test URLs above
3. Select "Smartphone" or "Desktop"
4. Click **"Test URL"**
5. Wait 15-30 seconds for analysis

### What to Look For:
- ✅ "Valid items detected" message
- ✅ LocalBusiness schema detected
- ✅ Page-specific schemas (PsychologicalTreatment, FAQPage, BlogPosting)
- ✅ No errors or warnings
- ✅ Preview shows correct information

### Expected Schema by Page:
- **Homepage:** LocalBusiness, MedicalBusiness, WebSite
- **Programs:** LocalBusiness, PsychologicalTreatment
- **FAQ:** LocalBusiness, FAQPage (with question/answer structure)
- **Blog:** LocalBusiness, BlogPosting

---

## 2. Schema.org Validator

**URL:** https://validator.schema.org/

### Steps:
1. Open the Schema Markup Validator
2. Paste a test URL in the "Fetch URL" tab
3. Click **"Run Test"**
4. Review detected schema types

### What to Look For:
- ✅ All schema types detected
- ✅ Green checkmarks for all properties
- ✅ No red errors
- ✅ Yellow warnings are OK (usually optional properties)

### Common Warnings (Safe to Ignore):
- "Recommended property X is missing" - these are optional fields
- Missing social media URLs (`sameAs`) - can add later

---

## 3. Facebook Sharing Debugger

**URL:** https://developers.facebook.com/tools/debug/

### Steps:
1. Open Facebook Sharing Debugger (may require Facebook login)
2. Paste a test URL
3. Click **"Debug"**
4. Review Open Graph tags
5. Click **"Scrape Again"** to refresh cache

### What to Look For:
- ✅ Image loads correctly (should be 1200x630px)
- ✅ Title displays correctly
- ✅ Description displays correctly
- ✅ URL matches
- ✅ Type is correct (website or article)
- ✅ No missing tag warnings

### Image Paths to Verify:
- Homepage: `/assets/images/og-home.jpg`
- Adult Program: `/assets/images/programs/adult-program.jpg`
- About: `/assets/images/og-about.jpg`
- FAQ: `/assets/images/og-faq.jpg`
- Blog: `/assets/images/og-blog.jpg`

---

## 4. Twitter Card Validator

**Note:** Twitter's official validator is deprecated. Use alternatives:

### Option A: BrandBird
**URL:** https://www.brandbird.app/tools/twitter-card-validator

### Option B: Typefully
**URL:** https://typefully.com/tools/twitter-card-validator

### Option C: Sitechecker
**URL:** https://sitechecker.pro/twitter-card-checker/

### Steps:
1. Open one of the validator tools
2. Paste a test URL
3. Click "Preview" or "Validate"
4. Review how the card appears

### What to Look For:
- ✅ Card type: `summary_large_image`
- ✅ Image displays correctly
- ✅ Title matches page
- ✅ Description is present
- ✅ No broken image errors

---

## 5. Quick Visual Test

### Test Social Sharing in Real Apps:

**Twitter/X:**
1. Compose a new tweet
2. Paste a URL from the site
3. Wait for link preview to load
4. Verify image, title, description appear

**Facebook:**
1. Create a new post
2. Paste a URL from the site
3. Wait for link preview
4. Click "Edit" to see detected OG tags
5. Verify image and text are correct

**LinkedIn:**
1. Create a new post
2. Paste a URL
3. Wait for preview
4. Verify professional appearance

**WhatsApp:**
1. Send URL to yourself or a test contact
2. Link preview should appear with image
3. Verify looks good on mobile

---

## 6. Google Search Console (Post-Deployment)

**URL:** https://search.google.com/search-console

### Initial Setup:
1. Sign in with Google account
2. Add property: `https://vaemptiness.es`
3. Verify ownership (DNS, HTML file, or meta tag)
4. Submit sitemap (if available)

### Ongoing Monitoring:
- **Performance:** Track impressions, clicks, CTR
- **Coverage:** Monitor indexed pages
- **Enhancements:** Check rich result status
- **Core Web Vitals:** Monitor page experience
- **Rich Results:** See which schemas are active

### Submit URLs for Indexing:
1. Go to "URL Inspection" tool
2. Enter a page URL
3. Click "Request Indexing"
4. Repeat for key pages (homepage, programs, about)

---

## 7. Testing Checklist

Use this checklist to test each new page:

### Before Publishing:
- [ ] Build site locally: `npm run build`
- [ ] Check `_site/` output for page
- [ ] Verify JSON-LD is present in HTML
- [ ] Verify OG tags are present
- [ ] Check image paths are correct

### After Publishing:
- [ ] Test with Google Rich Results
- [ ] Test with Schema.org Validator
- [ ] Test with Facebook Debugger
- [ ] Test with Twitter Card Validator
- [ ] Test actual social sharing (post on Twitter/Facebook)
- [ ] Request indexing in Search Console

### Monthly Maintenance:
- [ ] Check Search Console for errors
- [ ] Review rich result performance
- [ ] Update content if needed
- [ ] Re-scrape on Facebook if images change
- [ ] Monitor for broken images or links

---

## 8. Common Issues & Fixes

### Issue: Image Not Loading on Facebook
**Solution:**
1. Verify image exists: https://vaemptiness.es/assets/images/og-home.jpg
2. Check file size (should be < 5MB)
3. Use Facebook Debugger "Scrape Again" button
4. Wait 24 hours for Facebook cache to update
5. Try different image format if needed

### Issue: Schema Not Detected by Google
**Solution:**
1. Check JSON-LD syntax with JSON validator
2. Ensure `<script type="application/ld+json">` tag is correct
3. Verify schema is in `<head>` or `<body>` (both work)
4. Use Google Rich Results Test for specific errors
5. Check no JavaScript errors on page

### Issue: Wrong Title/Description on Social
**Solution:**
1. Check `<meta property="og:title">` tag
2. Check `<meta property="og:description">` tag
3. Clear cache on social platform (Facebook Debugger "Scrape Again")
4. For Twitter, clear cache by using new URL parameter: `?v=2`

### Issue: Rich Results Not Showing in Search
**Solution:**
1. Rich results take time (weeks to months) to appear
2. Schema must be error-free
3. Content must be high quality and relevant
4. Not all schema types guarantee rich results
5. Monitor in Search Console > Enhancements

---

## 9. Expected Results Summary

### All Pages Should Have:
✅ Valid JSON-LD schema (no syntax errors)
✅ LocalBusiness schema (for local SEO)
✅ Unique title and description
✅ Open Graph tags (title, description, image, url, type)
✅ Twitter Card tags (card, title, description, image)
✅ Canonical URL
✅ Robots meta tag
✅ Language meta tag

### Page-Specific Schema:
- **Homepage:** MedicalBusiness + WebSite
- **Programs:** PsychologicalTreatment (with age ranges)
- **FAQ:** FAQPage (with 18 Q&A items)
- **Blog Posts:** BlogPosting (with author, date, keywords)
- **About:** Person (founder info)

### Social Images:
- Format: JPEG
- Dimensions: 1200x630px
- Size: ~80-150KB
- Quality: Optimized for fast loading

---

## 10. Quick Test Script

Copy and paste these URLs into validators:

```
# Google Rich Results Test
https://search.google.com/test/rich-results?url=https://vaemptiness.es/
https://search.google.com/test/rich-results?url=https://vaemptiness.es/vaemptiness-program/
https://search.google.com/test/rich-results?url=https://vaemptiness.es/faq/

# Facebook Debugger
https://developers.facebook.com/tools/debug/?q=https://vaemptiness.es/
https://developers.facebook.com/tools/debug/?q=https://vaemptiness.es/vaemptiness-program/

# Schema.org Validator
https://validator.schema.org/#url=https://vaemptiness.es/
https://validator.schema.org/#url=https://vaemptiness.es/vaemptiness-program/
```

---

## Support Resources

- **Google Search Central:** https://developers.google.com/search/docs
- **Schema.org Documentation:** https://schema.org/
- **Open Graph Protocol:** https://ogp.me/
- **Twitter Cards Guide:** https://developer.twitter.com/en/docs/twitter-for-websites/cards

---

**Last Updated:** 2025-12-22
**Site:** https://vaemptiness.es
**Contact:** program@vaemptiness.es
