# WordPress Migration Plan for vaemptiness.es

**Date:** December 22, 2025
**Current Stack:** Eleventy (11ty) Static Site Generator
**Target:** WordPress CMS

---

## Executive Summary

This document outlines a comprehensive plan to migrate the vaemptiness.es website from Eleventy static site generator to WordPress. The migration aims to provide a more user-friendly content management experience while maintaining the current design, SEO performance, and functionality.

---

## Current Site Analysis

### Site Structure

**Pages:** 18 Spanish pages
- Homepage (index)
- About (sobre-nosotros)
- Contact/Contacto (2 versions)
- Programs (4 program pages using same template)
- Learning (aprendizaje-y-metodologia)
- Reset
- FAQ
- Blog (1 post currently)
- Projects (2 projects)
- Legal pages (política de privacidad, términos y condiciones)

**Content Types:**
1. **Static Pages** - About, Contact, Legal
2. **Programs** - 4 programs with structured data (adult, teams, teen, kids)
3. **Blog Posts** - Currently 1 article on Buddhist philosophy
4. **Projects** - 2 film editing projects
5. **Team Members** - Founder and team data
6. **FAQ** - Accordion-style Q&A

**Assets:**
- Total: 19 files
- Size: 1.6MB
- Images organized by type (blog, programs, team, awards, clients)
- CSS: 1 main stylesheet (2,326 lines)
- JavaScript: 6 files (contact form, FAQ accordion, video, etc.)

**Data Structure:**
- 12 JSON files containing structured content
- Nunjucks templates with data binding
- Form integration with Getform (https://getform.io/f/bgdvpgpa)

**Current Hosting:**
- GitHub Pages
- Custom domain with CNAME
- Automated deployment via GitHub Actions
- HTTPS enabled

---

## Migration Approaches

### Option 1: Content-Only Migration (Recommended for Speed)

**Description:** Use an existing WordPress theme and migrate only the content.

**Pros:**
- Fastest implementation (1-2 weeks)
- Lower cost
- Built-in WordPress features (SEO, responsive, accessibility)
- Regular theme updates and support
- Page builders like Elementor for easy customization

**Cons:**
- Design won't be pixel-perfect match
- May need design adjustments
- Theme dependency

**Estimated Cost:** €50-200 (theme purchase + domain/hosting)
**Timeline:** 1-2 weeks

### Option 2: Custom Theme Development

**Description:** Convert current Eleventy templates into a custom WordPress theme.

**Pros:**
- Exact design preservation
- No theme licensing dependencies
- Full control over features
- Optimized code for specific needs

**Cons:**
- Longer development time (4-8 weeks)
- Higher cost
- Requires ongoing maintenance
- Need WordPress development expertise

**Estimated Cost:** €2,000-5,000 (professional development)
**Timeline:** 4-8 weeks

### Option 3: Hybrid Approach (Recommended for Quality)

**Description:** Start with a quality theme matching the design aesthetic, then customize specific sections.

**Pros:**
- Balance of speed and customization
- Professional foundation with custom touches
- Moderate timeline and cost
- Easier maintenance

**Cons:**
- Still requires some customization work
- May need to compromise on some design details

**Estimated Cost:** €500-1,500 (theme + customization)
**Timeline:** 2-4 weeks

---

## Recommended WordPress Stack

### Hosting Options

1. **WordPress.com Business Plan** (€25/month)
   - Managed WordPress hosting
   - Automatic updates and backups
   - Built-in CDN
   - Good support

2. **Cloudways** (€10-40/month)
   - Managed cloud hosting (DigitalOcean, AWS, etc.)
   - Excellent performance
   - Easy scaling
   - Redis caching

3. **Kinsta** (€30+/month)
   - Premium managed WordPress
   - Best performance
   - Top-tier support
   - Google Cloud infrastructure

### Recommended Theme

Based on research, these themes fit the mental health/wellness aesthetic:

1. **Zenista** - Mental health focused theme
   - Clean, calming design
   - Built-in service sections
   - Elementor compatible
   - ~€59

2. **Mental Care** - Therapy & counseling theme
   - Professional appearance
   - Multiple layouts
   - WPBakery integration
   - ~€79

3. **Astra Pro** - General purpose with wellness templates
   - Lightweight and fast
   - Highly customizable
   - Excellent support
   - €59/year

### Essential Plugins

**Page Builder:**
- Elementor Pro (€59/year) - Visual drag-and-drop editor

**Forms:**
- WPForms or Contact Form 7 (free)
- Can integrate with Getform or use native WordPress form handling

**SEO:**
- Yoast SEO (free) or Rank Math (free)
- Handles meta tags, sitemaps, schema

**Performance:**
- WP Rocket (€59/year) - Caching and optimization
- Smush (free) - Image compression
- Cloudflare (free CDN)

**Security:**
- Wordfence (free) or Sucuri (€199/year)
- Regular backups (UpdraftPlus - free)

**FAQ:**
- Accordion Blocks (free) or Ultimate FAQ (free)

**Content Management:**
- Advanced Custom Fields (ACF) Pro (€59/year)
  - Create custom post types for Programs
  - Structured data for team members
  - Repeatable fields for pillars, outcomes, etc.

---

## Migration Process

### Phase 1: Planning & Setup (Week 1)

1. **Choose hosting provider and set up WordPress**
   - Install WordPress
   - Configure SSL certificate
   - Set up staging environment

2. **Select and purchase theme**
   - Install theme
   - Install required plugins
   - Configure basic settings

3. **Create content structure**
   - Define custom post types (Programs, Projects, Team)
   - Set up custom fields with ACF
   - Create page templates

### Phase 2: Content Migration (Week 2-3)

1. **Static Pages**
   - Create pages in WordPress
   - Copy content from JSON files
   - Use Elementor/page builder to recreate layouts
   - Pages: About, Contact, Legal, FAQ

2. **Programs Content**
   - Create "Programs" custom post type
   - Define custom fields (pillars, outcomes, session structure)
   - Import 4 programs from programs.json
   - Create program archive page

3. **Blog Setup**
   - Import blog post from blog.json
   - Set up blog categories and tags
   - Configure blog layout
   - Create author profiles

4. **Team & About Data**
   - Import team members from team.json
   - Add team photos
   - Create team member profiles

5. **Media Migration**
   - Upload all images from src/assets/images/
   - Organize in WordPress Media Library
   - Update image references

### Phase 3: Design & Functionality (Week 3-4)

1. **Design Matching**
   - Replicate color scheme (#b85c4f rust, #a4b8a0 sage, etc.)
   - Match typography (Cardo headings, Inter body)
   - Recreate hero section with circle animation
   - Style program cards grid
   - FAQ accordion design

2. **Forms Configuration**
   - Set up contact form
   - Connect to Getform or use WordPress form handler
   - Test form submissions
   - Configure email notifications

3. **Navigation**
   - Create main menu
   - Add footer menu
   - Configure mobile menu
   - Add program dropdown

4. **SEO Setup**
   - Install Yoast/Rank Math
   - Configure meta descriptions
   - Generate XML sitemap
   - Set up 301 redirects (see Phase 5)

### Phase 4: Testing (Week 4)

1. **Functionality Testing**
   - Test all forms
   - Verify all links work
   - Check responsive design (desktop, tablet, mobile)
   - Test FAQ accordion
   - Verify program pages display correctly

2. **Performance Testing**
   - Run Google PageSpeed Insights
   - Optimize images if needed
   - Enable caching
   - Test loading times

3. **Cross-Browser Testing**
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers (iOS Safari, Chrome Android)

4. **Content Review**
   - Proofread all migrated content
   - Verify JSON data integrity
   - Check image quality and sizing

### Phase 5: Launch Preparation (Week 4-5)

1. **Domain & DNS Setup**
   - Point vaemptiness.es to new hosting
   - Configure DNS records
   - Test domain propagation

2. **Redirects Setup**
   - Install Redirection plugin
   - Set up 301 redirects for all pages:
     ```
     / → / (homepage)
     /sobre-nosotros/ → /sobre-nosotros/
     /contacto/ → /contacto/
     /vaemptiness-program/ → /vaemptiness-program/
     /vaemptiness-equipos/ → /vaemptiness-equipos/
     /vaemptiness-teen/ → /vaemptiness-teen/
     /vaemptiness-kids/ → /vaemptiness-kids/
     /aprendizaje-y-metodologia/ → /aprendizaje-y-metodologia/
     /reset/ → /reset/
     /faq/ → /faq/
     /blog/ → /blog/
     /blog/filosofia-budista-vaemptiness/ → /blog/filosofia-budista-vaemptiness/
     /politica-privacidad/ → /politica-privacidad/
     /terminos-condiciones/ → /terminos-condiciones/
     ```

3. **SEO Migration**
   - Submit new sitemap to Google Search Console
   - Verify structured data
   - Check meta tags
   - Monitor 404 errors

4. **Backup Strategy**
   - Set up automated daily backups
   - Store backups off-site
   - Document restore procedure

### Phase 6: Go Live (Week 5)

1. **Pre-Launch Checklist**
   - [ ] All content migrated and verified
   - [ ] Forms tested and working
   - [ ] SSL certificate active
   - [ ] Redirects configured
   - [ ] Analytics tracking installed (Google Analytics)
   - [ ] Backup system active
   - [ ] Security plugins configured
   - [ ] Performance optimization complete

2. **Launch**
   - Switch DNS to point to WordPress hosting
   - Monitor site for 24-48 hours
   - Check error logs
   - Test all critical paths

3. **Post-Launch**
   - Monitor Google Search Console for errors
   - Track 404s and fix with redirects
   - Check form submissions
   - Verify analytics tracking
   - Address any immediate issues

---

## Technical Considerations

### Custom WordPress Features Needed

1. **Custom Post Types**
   - Programs (with custom fields)
   - Projects (film editing work)
   - Team Members

2. **Custom Fields (ACF)**
   - Programs:
     - Hero (title, subtitle, description)
     - Pillars (repeater: title, description, icon)
     - Session Structure (duration, activities)
     - Outcomes (repeater: items)
     - Philosophy quote
   - Team:
     - Photo
     - Name
     - Role
     - Bio

3. **Page Templates**
   - Homepage template (hero with circle animation, principles grid)
   - Program single template
   - Program archive template
   - Team archive template
   - Blog single template

### JavaScript Functionality to Replicate

1. **Circle Animation** (main.js)
   - SVG stroke animation on hero section
   - CSS keyframes animation
   - Can be kept as custom code in theme

2. **FAQ Accordion** (faq-accordion.js)
   - Use WordPress accordion plugin or recreate

3. **Contact Form** (contact-form.js)
   - Replace with WPForms or Contact Form 7
   - Integrate with Getform or use WordPress mail

4. **Mobile Menu** (main.js)
   - Most themes handle this automatically
   - May need minor customization

### CSS Preservation

**Key Design Tokens to Maintain:**
```css
--color-accent-rust: #b85c4f
--color-accent-sage: #a4b8a0
--color-accent-beige: #d4c5b9
--color-accent-cream: #f5f0e8

--font-heading: 'Cardo', serif
--font-body: 'Inter', sans-serif

--text-hero: clamp(2.5rem, 6vw, 4.5rem)
--space-section: clamp(4rem, 10vw, 8rem)
```

**Critical Styles:**
- Hero circle animation (lines 803-820)
- Principle cards with progress circles (lines 936-957)
- Quote emphasis styles (lines 106-134)
- Program card layouts (lines 1021-1083)

---

## Data Migration Strategy

### Manual Migration (Recommended)

**Why Manual:**
- Only 18 pages to migrate
- Structured data in JSON needs careful mapping
- Ensures quality control
- Opportunity to improve content

**Process:**
1. Create spreadsheet mapping old URLs to new URLs
2. Copy-paste content page by page
3. Recreate layouts with page builder
4. Import images and link properly
5. Set custom field values from JSON files

### Alternative: Import Tools

**WordPress Importer Plugin:**
- Can import from WordPress export XML
- Not applicable here (coming from static site)

**WP All Import:**
- Can import from CSV/XML
- Could convert JSON to CSV first
- Premium plugin ($99)
- Useful if data volume grows

---

## SEO Preservation Strategy

### Pre-Migration SEO Audit

1. **Document Current Rankings**
   - Export Google Search Console data
   - Note top-performing pages
   - Save current meta descriptions

2. **Crawl Current Site**
   - Use Screaming Frog (free for 500 URLs)
   - Document all URLs
   - Note title tags, H1s, meta descriptions
   - Export internal link structure

### During Migration

1. **Maintain URL Structure**
   - Keep same URL paths (e.g., `/sobre-nosotros/`)
   - WordPress permalinks: Settings → Permalinks → Post name
   - Custom post type slugs match current paths

2. **Preserve Meta Data**
   - Copy all title tags
   - Copy meta descriptions
   - Maintain H1 hierarchy
   - Keep image alt tags

3. **Internal Linking**
   - Recreate all internal links
   - Update any changed URLs
   - Check for broken links

### Post-Migration

1. **Monitor Rankings**
   - Check Google Search Console weekly
   - Track keyword rankings
   - Watch for traffic drops

2. **Fix Issues Quickly**
   - Monitor 404 errors
   - Create redirects for any broken URLs
   - Address crawl errors

3. **Resubmit Sitemap**
   - Generate new XML sitemap (Yoast/Rank Math)
   - Submit to Google Search Console
   - Submit to Bing Webmaster Tools

---

## Cost Breakdown

### Option 1: Content Migration with Premium Theme (Recommended)

| Item | Cost | Frequency |
|------|------|-----------|
| **Domain** | €0 | Already owned |
| **Hosting** (Cloudways) | €20-30 | Per month |
| **Theme** (Astra Pro or Mental Care) | €59-79 | One-time or annual |
| **Elementor Pro** | €59 | Per year |
| **ACF Pro** | €59 | Per year |
| **WP Rocket** | €59 | Per year |
| **Security** (Wordfence free) | €0 | - |
| **DIY Migration Labor** | €0 | Your time (20-40 hours) |
| **OR Professional Migration** | €500-1,000 | One-time |

**First Year Total (DIY):** €236-306 + hosting (€240-360) = **€476-666**
**First Year Total (Professional):** €736-1,306 + hosting = **€976-1,666**
**Ongoing Annual:** €177 + hosting (€240-360) = **€417-537/year**

### Option 2: Custom Theme Development

| Item | Cost |
|------|------|
| Professional custom theme development | €2,000-5,000 |
| Hosting | €240-360/year |
| Essential plugins | €177/year |
| **Total First Year** | **€2,417-5,537** |
| **Ongoing Annual** | **€417-537** |

---

## Risk Assessment

### High Risks

1. **SEO Traffic Loss**
   - **Mitigation:** Proper 301 redirects, maintain URLs, monitor Search Console
   - **Impact:** Could lose 20-30% traffic temporarily
   - **Recovery Time:** 2-4 weeks with proper redirects

2. **Design Inconsistencies**
   - **Mitigation:** Detailed design documentation, staging environment testing
   - **Impact:** User experience may differ from current site
   - **Recovery:** Iterative refinement post-launch

3. **Form Submissions Breaking**
   - **Mitigation:** Thorough form testing, keep Getform integration
   - **Impact:** Lost leads, frustrated users
   - **Recovery:** Immediate - can revert to old site if critical

### Medium Risks

4. **Performance Regression**
   - **Mitigation:** Performance testing, caching, CDN, optimized theme
   - **Impact:** Slower page loads compared to static site
   - **Expected:** WordPress will be slightly slower than static, but manageable with optimization

5. **Plugin Conflicts**
   - **Mitigation:** Use well-maintained plugins, test in staging
   - **Impact:** Broken functionality, white screens
   - **Recovery:** Disable conflicting plugins, find alternatives

### Low Risks

6. **Hosting Downtime**
   - **Mitigation:** Choose reliable host (Cloudways, Kinsta), have backup plan
   - **Impact:** Site unavailable temporarily
   - **Probability:** Very low with managed hosting

---

## Alternative: Keep Static Site

### Consider NOT Migrating If:

- **Traffic is low** and manual updates are manageable
- **Budget is extremely tight**
- **Technical team is comfortable with Eleventy**
- **No immediate need for non-technical content editing**

### Advantages of Staying Static:

1. **Performance** - Static sites are inherently faster
2. **Security** - No database, no plugin vulnerabilities
3. **Cost** - Free hosting on GitHub Pages
4. **Simplicity** - No WordPress maintenance (updates, backups, security)

### Disadvantages of Staying Static:

1. **Content Updates** - Requires technical knowledge (JSON editing, git commands)
2. **No Admin Interface** - No user-friendly CMS
3. **Limited Dynamic Features** - Forms require third-party services
4. **Collaboration** - Difficult for non-technical team members
5. **Scaling** - Adding new content types requires development

---

## Recommendations

### For Immediate Implementation:

**Approach:** Option 3 - Hybrid (Premium Theme + Customization)

**Timeline:** 3-4 weeks

**Budget:** €600-1,000 first year, ~€450/year ongoing

**Rationale:**
- Balances speed, cost, and quality
- Gets you a professional foundation quickly
- Allows customization of critical elements
- Easier for non-technical users to manage content

### Recommended Vendors:

1. **Hosting:** Cloudways (€20-30/month)
   - Best performance for price
   - Easy management
   - Scalable

2. **Theme:** Astra Pro with wellness template
   - Lightweight and fast
   - Highly customizable
   - Strong support community
   - Regular updates

3. **Page Builder:** Elementor Pro
   - Industry standard
   - User-friendly
   - Extensive widget library

### Migration Team:

**If DIY:**
- 1 person with WordPress experience
- 20-40 hours estimated time
- Weekends/evenings over 3-4 weeks

**If Professional:**
- Hire WordPress developer/agency
- Provide this migration plan as specification
- Budget €500-1,000 for execution
- Request staging site access for review before launch

---

## Next Steps

### To Proceed:

1. **Decision Point:** Choose migration approach (Option 1, 2, or 3)
2. **Budget Approval:** Confirm budget for hosting, theme, plugins
3. **Timeline:** Set realistic deadlines
4. **Team Assignment:** DIY or hire professional
5. **Hosting Setup:** Sign up for hosting provider
6. **Theme Purchase:** Buy and install selected theme
7. **Begin Phase 1:** Follow migration process outlined above

### Questions to Answer:

- [ ] Who will manage content updates post-migration?
- [ ] What's the acceptable budget range?
- [ ] Is DIY migration feasible with current team?
- [ ] Are there any must-have features not currently on the site?
- [ ] What's the urgency for migration?

---

## Resources

### WordPress Migration Guides:
- [Migrate HTML to WordPress - Bluehost](https://www.bluehost.com/blog/how-to-migrate-html-to-wordpress-theme-effectively/)
- [Convert HTML to WordPress - Hostinger](https://www.hostinger.com/tutorials/how-to-convert-html-to-wordpress)
- [Move Static HTML to WordPress - WP Explorer](https://www.wpexplorer.com/migrate-website-wordpress/)
- [HTML to WordPress Conversion - Cloudways](https://www.cloudways.com/blog/html-to-wordpress/)
- [HTML to WordPress Guide - Kinsta](https://kinsta.com/blog/html-to-wordpress/)
- [Complete Guide to Converting Static Sites - OneWebCare](https://onewebcare.com/blog/converting-static-sites-to-wordpress-for-small-businesses/)

### WordPress Themes:
- [Mental Health WordPress Themes - Ultida](https://ultida.com/mental-health-wordpress-themes/)
- [Psychology & Counseling Themes - Colorlib](https://colorlib.com/wp/psychology-counseling-wordpress-themes/)
- [WordPress Themes for Psychologists - aThemes](https://athemes.com/collections/wordpress-themes-for-psychologists-therapists/)
- [Mental Health Themes - SKT Themes](https://www.sktthemes.org/wordpress-themes/mental-health-wordpress-themes/)
- [Therapy Themes - ThemeForest](https://themeforest.net/category/wordpress?term=therapy)

### Useful Plugins:
- [Simply Static - WordPress.org](https://wordpress.org/plugins/simply-static/)
- [Staatic - WordPress.org](https://wordpress.org/plugins/staatic/)
- [Export WP Pages to HTML - WordPress.org](https://wordpress.org/plugins/export-wp-page-to-static-html/)

---

## Conclusion

Migrating from Eleventy to WordPress is a strategic decision that trades some performance and simplicity for significantly improved content management capabilities. For the vaemptiness.es site, the **Hybrid Approach (Option 3)** offers the best balance of:

- **Speed to market** (3-4 weeks)
- **Reasonable cost** (€600-1,000 first year)
- **Professional quality** (premium theme foundation)
- **Customization flexibility** (critical elements can be styled to match)
- **User-friendly management** (WordPress admin for future updates)

The migration is feasible, with manageable risks that can be mitigated through proper planning, staging environment testing, and careful SEO preservation strategies. The investment in WordPress will pay dividends in content management efficiency, especially as the site grows with more programs, blog posts, and team members.

**Recommendation:** Proceed with Option 3 (Hybrid Approach) using Astra Pro theme, Elementor Pro, and Cloudways hosting.
