# Netlify + Decap CMS Migration Guide

**Project:** vaemptiness Website
**Date:** January 7, 2026
**Migration Path:** GitHub Pages → Netlify + Decap CMS
**Duration:** 1-2 days
**Cost:** €0 (all free tiers)

---

## Table of Contents

1. [Pre-Migration Checklist](#1-pre-migration-checklist)
2. [Phase 1: Netlify Setup (15 minutes)](#2-phase-1-netlify-setup-15-minutes)
3. [Phase 2: Domain Configuration (10 minutes)](#3-phase-2-domain-configuration-10-minutes)
4. [Phase 3: Decap CMS Installation (30 minutes)](#4-phase-3-decap-cms-installation-30-minutes)
5. [Phase 4: Content Schema Configuration (2-4 hours)](#5-phase-4-content-schema-configuration-2-4-hours)
6. [Phase 5: Testing & Training (1-2 hours)](#6-phase-5-testing--training-1-2-hours)
7. [Rollback Plan](#7-rollback-plan)
8. [Troubleshooting](#8-troubleshooting)
9. [Next Steps](#9-next-steps)

---

## 1. Pre-Migration Checklist

### ✅ Before You Start

**Verify Current Setup:**
```bash
cd /mnt/x/Git/nacho.coll/vaemptiness-website

# Check current build works
npm run build

# Verify output
ls -la _site/

# Check Git status
git status
```

**Backup:**
```bash
# Create backup branch
git checkout -b backup-before-netlify
git push origin backup-before-netlify

# Return to master
git checkout master
```

**Required Accounts:**
- [ ] GitHub account (existing)
- [ ] Netlify account (free) - Create at https://app.netlify.com/signup
- [ ] Domain DNS access (for vaemptiness.com)

**Expected Downtime:** 0 minutes (can test on Netlify before switching DNS)

---

## 2. Phase 1: Netlify Setup (15 minutes)

### Step 1.1: Create Netlify Account

1. Go to https://app.netlify.com/signup
2. Click **"Sign up with GitHub"**
3. Authorize Netlify to access your GitHub repos

### Step 1.2: Import Website from GitHub

**In Netlify Dashboard:**

1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Select repository: `NachoColl/vaemptiness-website`
4. Configure build settings:

```yaml
Branch to deploy: master
Build command: npm run build
Publish directory: _site
```

5. Click **"Deploy site"**

**Wait for first build** (takes ~60 seconds)

### Step 1.3: Verify Deployment

Netlify will assign a random subdomain like: `random-name-123456.netlify.app`

**Test the site:**
- Click the URL in Netlify dashboard
- Verify homepage loads correctly
- Check a blog post: `/blog/entrenamiento-mental/`
- Check a program: `/vaemptiness-program/`

**If images are broken:**
This is normal if you had `ELEVENTY_PATH_PREFIX` set for GitHub Pages subdirectory.

**Fix:**
```bash
# Edit .eleventy.js
# Change:
pathPrefix: process.env.ELEVENTY_PATH_PREFIX || "",

# To:
pathPrefix: "",

# Commit and push
git add .eleventy.js
git commit -m "fix: remove path prefix for Netlify deployment"
git push origin master
```

Netlify will auto-rebuild in ~30 seconds.

### Step 1.4: Configure Build Settings (Optional)

**Add Environment Variables (if needed):**

In Netlify dashboard:
1. Go to **Site settings** → **Build & deploy** → **Environment variables**
2. Add any required variables (currently none needed)

**Build hooks:**
Netlify automatically builds on every push to master - no GitHub Actions needed!

---

## 3. Phase 2: Domain Configuration (10 minutes)

### Step 2.1: Add Custom Domain

**In Netlify Dashboard:**

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter: `vaemptiness.com`
4. Netlify will check if you own it

### Step 2.2: Update DNS Settings

**Option A: Netlify DNS (Recommended)**

Netlify will show you nameservers to add at your domain registrar:

```
dns1.p08.nsone.net
dns2.p08.nsone.net
dns3.p08.nsone.net
dns4.p08.nsone.net
```

**At your domain registrar:**
1. Find DNS settings
2. Change nameservers to Netlify's
3. Save (propagation takes 5-60 minutes)

**Option B: External DNS (Keep current registrar DNS)**

Add these records at your DNS provider:

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: random-name-123456.netlify.app
```

### Step 2.3: Enable HTTPS

**Automatic!** Netlify will:
1. Detect domain is pointed correctly
2. Provision Let's Encrypt SSL certificate (5-10 minutes)
3. Enable HTTPS automatically
4. Redirect HTTP → HTTPS

**Verify:**
- Wait 10 minutes after DNS change
- Visit https://vaemptiness.com
- Check SSL certificate (green padlock in browser)

### Step 2.4: Disable GitHub Pages

Once Netlify is working with your domain:

**In GitHub repo settings:**
1. Go to **Settings** → **Pages**
2. Set **Source** to "None"
3. This frees up GitHub Actions quota

**Optional:** Remove GitHub Actions workflow
```bash
# If you want to fully remove old deployment
rm .github/workflows/deploy.yml
git add .github/workflows/deploy.yml
git commit -m "chore: remove GitHub Pages workflow (now using Netlify)"
git push origin master
```

---

## 4. Phase 3: Decap CMS Installation (30 minutes)

### Step 3.1: Create Admin Directory

```bash
cd /mnt/x/Git/nacho.coll/vaemptiness-website

# Create admin folder in src (will be copied to _site)
mkdir -p src/admin
```

### Step 3.2: Create Admin HTML File

Create `src/admin/index.html`:

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex" />
  <title>Content Manager</title>
</head>
<body>
  <!-- Include the script that builds the page and powers Decap CMS -->
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
</html>
```

### Step 3.3: Create Basic Configuration

Create `src/admin/config.yml`:

```yaml
# Backend configuration
backend:
  name: git-gateway
  branch: master

# Media files (images, etc)
media_folder: "src/assets/images"
public_folder: "/assets/images"

# Publish mode
publish_mode: editorial_workflow  # Enables drafts/pending/published states

# i18n (optional - for future Spanish/English versions)
# locale: 'es'

# Collections (we'll expand this in Phase 4)
collections:
  # Placeholder - will add blog, programs, pages next
  - name: "blog"
    label: "Blog Posts"
    folder: "src/data/pages/blog"
    create: true
    slug: "{{slug}}"
    preview_path: "blog/{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Author", name: "author", widget: "string", default: "Rosa Cano"}
      - {label: "Date", name: "date", widget: "datetime", format: "YYYY-MM-DD"}
      - {label: "Excerpt", name: "excerpt", widget: "text"}
      - {label: "Featured", name: "featured", widget: "boolean", default: false}
      - {label: "Featured Image", name: "image", widget: "image"}
      - label: "SEO"
        name: "seo"
        widget: "object"
        fields:
          - {label: "Page Title", name: "title", widget: "string"}
          - {label: "Description", name: "description", widget: "text"}
          - {label: "Keywords", name: "keywords", widget: "string"}
          - {label: "OG Image", name: "ogImage", widget: "image"}
          - {label: "OG Type", name: "ogType", widget: "hidden", default: "article"}
```

### Step 3.4: Update Eleventy Config

Edit `.eleventy.js` to copy admin files:

```javascript
// Around line 20-30, in the config function:

// Add this with other passthroughs
eleventyConfig.addPassthroughCopy("src/admin");

// This copies src/admin/ to _site/admin/
```

### Step 3.5: Build and Verify

```bash
# Build site with admin folder
npm run build

# Check admin files were copied
ls -la _site/admin/
# Should show: index.html and config.yml

# Commit changes
git add src/admin/ .eleventy.js
git commit -m "feat: add Decap CMS admin interface"
git push origin master
```

Netlify will auto-rebuild.

### Step 3.6: Enable Netlify Identity

**In Netlify Dashboard:**

1. Go to **Site settings** → **Identity**
2. Click **"Enable Identity"**
3. Set **Registration preferences**: "Invite only"
4. Scroll to **Services** → **Git Gateway**
5. Click **"Enable Git Gateway"**

**This enables:**
- User authentication for /admin/
- OAuth with GitHub (automatic)
- Git commits from CMS

---

## 5. Phase 4: Content Schema Configuration (2-4 hours)

Now we define how editors interact with each content type.

### Step 4.1: Blog Posts Schema (Already Added)

The basic blog schema from Step 3.3 covers:
- ✅ Title, author, date
- ✅ Featured image
- ✅ SEO metadata

**Expand to match full JSON structure:**

Edit `src/admin/config.yml`, replace the blog collection:

```yaml
collections:
  - name: "blog"
    label: "Blog Posts"
    folder: "src/data/pages/blog"
    create: true
    slug: "{{slug}}"
    preview_path: "blog/{{slug}}"
    extension: "json"
    format: "json"
    fields:
      - {label: "ID", name: "id", widget: "number"}
      - {label: "Slug", name: "slug", widget: "string"}
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Author", name: "author", widget: "string", default: "Rosa Cano"}
      - {label: "Date", name: "date", widget: "datetime", format: "YYYY-MM-DD", picker_utc: false}
      - {label: "Excerpt", name: "excerpt", widget: "text", required: true}
      - {label: "Featured", name: "featured", widget: "boolean", default: false}
      - {label: "Featured Image", name: "image", widget: "image", required: true}

      - label: "SEO"
        name: "seo"
        widget: "object"
        collapsed: false
        fields:
          - {label: "Page Title", name: "title", widget: "string"}
          - {label: "Meta Description", name: "description", widget: "text"}
          - {label: "Keywords", name: "keywords", widget: "string"}
          - {label: "OG Image", name: "ogImage", widget: "image"}
          - {label: "OG Type", name: "ogType", widget: "hidden", default: "article"}

      - label: "Content"
        name: "content"
        widget: "object"
        fields:
          - label: "Sections"
            name: "sections"
            widget: "list"
            fields:
              - {label: "Section Title", name: "title", widget: "string", required: false}
              - {label: "Introduction", name: "intro", widget: "markdown", required: false}
              - label: "Items"
                name: "items"
                widget: "list"
                required: false
                field: {label: "Item", name: "item", widget: "string"}
              - {label: "Closing Text", name: "closing", widget: "markdown", required: false}

          - {label: "Conclusion", name: "conclusion", widget: "markdown", required: false}
          - {label: "Call to Action", name: "cta", widget: "string", required: false}

      - label: "Tags"
        name: "tags"
        widget: "list"
        required: false
        field: {label: "Tag", name: "tag", widget: "string"}
```

### Step 4.2: Programs Schema

Add programs collection to `config.yml`:

```yaml
  - name: "programs"
    label: "Programs"
    folder: "src/data/pages/programs"
    create: true
    extension: "json"
    format: "json"
    slug: "{{slug}}"
    fields:
      - {label: "ID", name: "id", widget: "number"}
      - {label: "Slug", name: "slug", widget: "string"}
      - {label: "Name", name: "name", widget: "string"}
      - {label: "Short Description", name: "shortDescription", widget: "text"}
      - {label: "Order", name: "order", widget: "number", default: 1}
      - {label: "Card Image", name: "image", widget: "image"}
      - {label: "Hero Image", name: "heroImage", widget: "image"}
      - {label: "CTA Button Text", name: "ctaButtonText", widget: "string", default: "Más información"}

      - label: "SEO"
        name: "seo"
        widget: "object"
        fields:
          - {label: "Title", name: "title", widget: "string"}
          - {label: "Description", name: "description", widget: "text"}
          - {label: "Keywords", name: "keywords", widget: "string"}
          - {label: "OG Image", name: "ogImage", widget: "image"}

      - label: "Hero Section"
        name: "hero"
        widget: "object"
        fields:
          - {label: "Title", name: "title", widget: "string"}
          - {label: "Subtitle", name: "subtitle", widget: "text"}

      - label: "What Is It Section"
        name: "whatIsIt"
        widget: "object"
        required: false
        fields:
          - {label: "Title", name: "title", widget: "string"}
          - {label: "Content", name: "content", widget: "markdown"}

      - label: "Testimonials"
        name: "testimonials"
        widget: "list"
        required: false
        fields:
          - {label: "Quote", name: "quote", widget: "text"}
          - {label: "Author", name: "author", widget: "string"}
          - {label: "Title/Context", name: "title", widget: "string", required: false}

      - label: "Pillars"
        name: "pillars"
        widget: "object"
        required: false
        fields:
          - {label: "Title", name: "title", widget: "string"}
          - {label: "Subtitle", name: "subtitle", widget: "string", required: false}
          - label: "Items"
            name: "items"
            widget: "list"
            fields:
              - {label: "Icon", name: "icon", widget: "string"}
              - {label: "Title", name: "title", widget: "string"}
              - {label: "Description", name: "description", widget: "text"}

      - label: "Session Structure"
        name: "session"
        widget: "object"
        required: false
        fields:
          - {label: "Title", name: "title", widget: "string"}
          - {label: "Duration", name: "duration", widget: "string"}
          - {label: "Frequency", name: "frequency", widget: "string"}
          - label: "Components"
            name: "components"
            widget: "list"
            field: {label: "Component", name: "component", widget: "string"}

      - label: "Outcomes"
        name: "outcomes"
        widget: "object"
        required: false
        fields:
          - {label: "Title", name: "title", widget: "string"}
          - {label: "Subtitle", name: "subtitle", widget: "string", required: false}
          - label: "Items"
            name: "items"
            widget: "list"
            field: {label: "Outcome", name: "outcome", widget: "string"}

      - {label: "Philosophy Quote", name: "philosophy", widget: "text", required: false}
```

### Step 4.3: Pages Schema (Home, About, etc.)

Add pages collection:

```yaml
  - name: "pages"
    label: "Pages"
    files:
      - label: "Homepage"
        name: "home"
        file: "src/data/pages/home.json"
        fields:
          - label: "Hero"
            name: "hero"
            widget: "object"
            fields:
              - {label: "Title", name: "title", widget: "string"}
              - {label: "Subtitle", name: "subtitle", widget: "text"}
              - {label: "CTA Text", name: "ctaText", widget: "string"}
              - {label: "CTA Link", name: "ctaLink", widget: "string"}

          - label: "Principles Section"
            name: "principles"
            widget: "object"
            fields:
              - {label: "Title", name: "title", widget: "string"}
              - label: "Items"
                name: "items"
                widget: "list"
                fields:
                  - {label: "Icon", name: "icon", widget: "string"}
                  - {label: "Title", name: "title", widget: "string"}
                  - {label: "Description", name: "description", widget: "text"}

          - label: "Learning Intro"
            name: "learningIntro"
            widget: "object"
            fields:
              - {label: "Quote", name: "quote", widget: "text"}
              - {label: "Author", name: "author", widget: "string"}
              - {label: "Description", name: "description", widget: "markdown"}

          - label: "Philosophy Section"
            name: "philosophy"
            widget: "object"
            fields:
              - {label: "Title", name: "title", widget: "string"}
              - {label: "Content", name: "content", widget: "markdown"}
              - {label: "Highlight", name: "highlight", widget: "text"}

      - label: "About Us"
        name: "sobre-nosotros"
        file: "src/data/pages/sobre-nosotros.json"
        fields:
          - label: "Hero"
            name: "hero"
            widget: "object"
            fields:
              - {label: "Title", name: "title", widget: "string"}
              - {label: "Subtitle", name: "subtitle", widget: "string"}

          - label: "Intro"
            name: "intro"
            widget: "object"
            fields:
              - {label: "Title", name: "title", widget: "string"}
              - label: "Paragraphs"
                name: "paragraphs"
                widget: "list"
                field: {label: "Paragraph", name: "paragraph", widget: "text"}

          - label: "Team"
            name: "team"
            widget: "object"
            fields:
              - {label: "Title", name: "title", widget: "string"}
              - {label: "Description", name: "description", widget: "text"}
              - {label: "Purpose", name: "purpose", widget: "text"}
              - label: "Founder"
                name: "founder"
                widget: "object"
                fields:
                  - {label: "Name", name: "name", widget: "string"}
                  - {label: "Role", name: "role", widget: "string"}
                  - {label: "Image", name: "image", widget: "image"}
              - label: "Members"
                name: "members"
                widget: "list"
                fields:
                  - {label: "Name", name: "name", widget: "string"}
                  - {label: "Role", name: "role", widget: "string"}
                  - {label: "Image", name: "image", widget: "image"}
```

### Step 4.4: Add Navigation Management (Bonus)

```yaml
  - name: "site-config"
    label: "Site Configuration"
    files:
      - label: "Navigation"
        name: "navigation"
        file: "src/data/navigation.json"
        fields:
          - label: "Main Navigation"
            name: "main"
            widget: "list"
            fields:
              - {label: "Label", name: "label", widget: "string"}
              - {label: "URL", name: "url", widget: "string"}
              - label: "Submenu"
                name: "submenu"
                widget: "list"
                required: false
                fields:
                  - {label: "Label", name: "label", widget: "string"}
                  - {label: "URL", name: "url", widget: "string"}
```

### Step 4.5: Commit Schema Configuration

```bash
git add src/admin/config.yml
git commit -m "feat: complete Decap CMS content schemas"
git push origin master
```

Wait 30 seconds for Netlify to rebuild.

---

## 6. Phase 5: Testing & Training (1-2 hours)

### Step 5.1: Access Admin Interface

**Navigate to:** `https://vaemptiness.com/admin/`

You'll see Netlify Identity login screen.

### Step 5.2: Invite Users

**In Netlify Dashboard:**

1. Go to **Identity** tab
2. Click **"Invite users"**
3. Enter email addresses of editors (Rosa, team members)
4. They'll receive invitation emails

**User setup:**
1. Editor clicks invite link
2. Sets password
3. Can now access /admin/

### Step 5.3: Test Content Editing

**Create a test blog post:**

1. Go to https://vaemptiness.com/admin/
2. Login with Netlify Identity
3. Click **"Blog Posts"** in left sidebar
4. Click **"New Blog Post"**
5. Fill in fields:
   - Title: "Test Post"
   - Author: "Rosa Cano"
   - Date: Select today
   - Excerpt: "This is a test"
   - Featured: No
   - Upload test image
   - Add SEO data
   - Add content sections

6. Click **"Save"** → **"Publish"**

**What happens:**
- Decap CMS creates Git commit
- Pushes to GitHub master branch
- Netlify detects change
- Rebuilds site (~30 seconds)
- New post appears at /blog/test-post/

### Step 5.4: Test Image Upload

1. In admin, click **"Media"** in sidebar
2. Click **"Upload"**
3. Drag-and-drop image
4. Image saved to `src/assets/images/`
5. Commit created automatically

### Step 5.5: Test Editorial Workflow (Drafts)

**Drafts are enabled** (from `publish_mode: editorial_workflow` in config)

**States:**
- **Draft**: Not published, visible only in CMS
- **In Review**: Ready for approval
- **Ready**: Approved, will publish

**Test workflow:**
1. Create new blog post
2. Save as draft (don't publish)
3. Post appears under "Drafts" column
4. Click "Set status" → "In review"
5. Moves to "In Review" column
6. Another user can approve → "Publish"

**This creates a Pull Request on GitHub:**
- Branch: `cms/blog/post-name`
- When published, merges to master
- Triggers Netlify build

### Step 5.6: Test Content Types

**Test each collection:**
- ✅ Create blog post
- ✅ Edit existing blog post
- ✅ Create new program (if needed)
- ✅ Edit home page
- ✅ Edit about page
- ✅ Upload images

**Verify:**
- Changes appear on site after build
- Images load correctly
- SEO metadata preserved
- URLs work

---

## 7. Rollback Plan

### If Something Goes Wrong

**Option 1: Keep Netlify, revert CMS changes**

```bash
# Remove admin interface
git revert <commit-hash>
git push origin master

# Disable Netlify Identity in dashboard
# Site still works, just no CMS
```

**Option 2: Switch back to GitHub Pages**

```bash
# 1. Re-enable GitHub Pages in repo settings
# 2. Restore .github/workflows/deploy.yml from backup
# 3. Update DNS back to GitHub Pages
# 4. Wait for propagation (~10 minutes)
```

**Option 3: Full rollback**

```bash
# Restore from backup branch
git checkout master
git reset --hard backup-before-netlify
git push origin master --force

# Disable Netlify site
# Re-enable GitHub Pages
```

**Data is safe:**
- All content still in JSON files in GitHub
- Git history preserved
- Images unchanged

---

## 8. Troubleshooting

### Issue: Can't login to /admin/

**Symptoms:** Login button doesn't work, "Failed to load" error

**Solutions:**
1. Check Netlify Identity is enabled (Site settings → Identity)
2. Check Git Gateway is enabled (Identity → Services)
3. Clear browser cache, try incognito mode
4. Check browser console for errors

---

### Issue: Changes not appearing on site

**Symptoms:** Save post, but not visible on website

**Solutions:**
1. Check Netlify build status (Deploys tab)
2. Verify Git commit was created (GitHub repo)
3. Wait 30-60 seconds for build to complete
4. Check build logs for errors
5. Verify JSON file is valid (no syntax errors)

---

### Issue: Images not uploading

**Symptoms:** Upload fails, or image path wrong

**Solutions:**
1. Verify `media_folder` in config.yml is correct
2. Check image file size (Netlify free tier: max 100MB per file)
3. Verify file extension is allowed (.jpg, .png, .gif, .svg, .webp)
4. Check browser console for errors

---

### Issue: Collections not appearing in sidebar

**Symptoms:** Can't see blog posts or programs

**Solutions:**
1. Check config.yml syntax (use YAML validator)
2. Verify collection `folder` path is correct
3. Check `extension: "json"` is set
4. Clear browser cache
5. Check browser console for parsing errors

---

### Issue: JSON file structure broken after edit

**Symptoms:** Site build fails, JSON parse error

**Solutions:**
1. Go to GitHub repo
2. Find the problematic file in recent commits
3. Click "Edit file" on GitHub
4. Fix JSON syntax (use JSON validator)
5. Commit directly to master
6. OR: Revert the commit

**Prevention:**
- Schema validation in config.yml prevents most issues
- Editorial workflow (drafts) lets you test before publishing

---

### Issue: Editorial workflow not working

**Symptoms:** Can't create drafts, no PR created

**Solutions:**
1. Check `publish_mode: editorial_workflow` in config.yml
2. Ensure Git Gateway is enabled (not just GitHub backend)
3. Verify user has write permissions to repo
4. Check Netlify Identity role is correct

---

## 9. Next Steps

### Week 1: Monitor and Iterate

**Daily checks:**
- Monitor Netlify build status
- Check for editor feedback
- Review Git commits from CMS
- Verify site performance

**Adjust schemas as needed:**
- Add missing fields editors request
- Simplify complex fields
- Add helper text to form fields

### Week 2: Train Team

**Create documentation:**
1. How to login (/admin/)
2. How to create blog post
3. How to edit program page
4. How to upload images
5. How to use editorial workflow (drafts)

**Sample editor guide:**

```markdown
# vaemptiness CMS Quick Start

## Login
1. Go to https://vaemptiness.com/admin/
2. Click "Login with Netlify Identity"
3. Enter your email and password

## Create Blog Post
1. Click "Blog Posts" in sidebar
2. Click "New Blog Post"
3. Fill in:
   - Title (required)
   - Date (required)
   - Featured Image (required)
   - Excerpt (required)
   - Content sections (add as many as needed)
4. Click "Save"
5. Click "Publish" when ready

Changes appear on site in ~30 seconds.

## Upload Images
1. Click "Media" in sidebar
2. Click "Upload"
3. Drag-and-drop image
4. Image is now available in dropdowns

## Use Drafts
1. Create post
2. Click "Save"
3. Post is in "Drafts" column
4. Click "Set status" → "In review" when ready
5. Another editor can approve and publish
```

### Month 1: Optimize

**Performance monitoring:**
- Check Netlify Analytics (free)
- Monitor build times
- Review image optimization

**Add features:**
- Image resize/optimization (Netlify Large Media)
- Scheduled publishing (Netlify Functions)
- Search (Algolia or Pagefind)
- Comments (if needed)

### Future Enhancements

**Consider adding:**
- [ ] Preview deploys per branch
- [ ] A/B testing for CTAs
- [ ] Form submissions (Netlify Forms)
- [ ] Newsletter signup (Mailchimp integration)
- [ ] Blog post scheduling
- [ ] Content versioning dashboard
- [ ] Image optimization pipeline

---

## Appendix: Full config.yml Reference

See final complete configuration in:
`/src/admin/config.yml`

---

## Appendix: Netlify.toml (Optional)

Create `netlify.toml` in project root for advanced configuration:

```toml
[build]
  command = "npm run build"
  publish = "_site"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[redirects]]
  from = "/admin/"
  to = "/admin/index.html"
  status = 200

[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
```

---

## Support Resources

**Netlify:**
- Docs: https://docs.netlify.com/
- Support: support@netlify.com
- Status: https://www.netlifystatus.com/

**Decap CMS:**
- Docs: https://decapcms.org/docs/
- Discord: https://decapcms.org/chat/
- GitHub: https://github.com/decaporg/decap-cms

**Community:**
- Eleventy Discord: https://www.11ty.dev/blog/discord/
- Netlify Community: https://answers.netlify.com/

---

**Migration Complete!** 🎉

Your website now has:
✅ Faster hosting (Netlify CDN)
✅ Automated builds (push to master)
✅ User-friendly CMS (no Git/JSON knowledge needed)
✅ Draft/review workflow
✅ Image uploads
✅ Zero ongoing costs (free tiers)

**Questions?** Create an issue in the GitHub repo or contact the development team.

---

**Last Updated:** January 7, 2026
**Version:** 1.0
