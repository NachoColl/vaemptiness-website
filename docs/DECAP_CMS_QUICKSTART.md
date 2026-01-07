# Decap CMS Quick Start

**Status:** ✅ Initial files created and ready
**Next Step:** Deploy to Netlify to activate CMS

---

## What I've Created

### 1. Admin Interface Files

**Location:** `src/admin/`
- ✅ `index.html` - CMS interface loader
- ✅ `config.yml` - Content schema configuration

### 2. Build Configuration

**Updated:** `.eleventy.js`
- Added passthrough copy for admin folder
- Admin interface will be available at `/admin/` after build

### 3. Initial Collections Configured

Your CMS is configured with 3 content types:

#### Blog Posts (`/admin/#/collections/blog`)
- Create/edit blog posts
- Upload featured images
- Manage SEO metadata
- Add content sections
- Assign tags

#### Programs (`/admin/#/collections/programs`)
- Create/edit program pages
- Add hero/card images
- Manage testimonials
- Configure pillars and outcomes

#### Pages (`/admin/#/collections/pages`)
- Edit Homepage
- Edit About Us page
- More pages can be added

---

## Current Build Status

✅ **Build working:** Run `npm run build`
✅ **Admin files copied:** Available at `_site/admin/`
✅ **Config valid:** YAML syntax correct

⚠️ **Not active yet:** Requires Netlify deployment + Identity setup

---

## Next Steps (Follow Migration Guide)

### Option 1: Full Migration (Recommended)
Follow the complete guide: `/docs/NETLIFY_DECAP_MIGRATION_GUIDE.md`

**Timeline:** 1-2 days
**Result:** Fully functional CMS with user auth

### Option 2: Quick Test (Local Only)
Test the CMS interface locally before deploying:

```bash
# 1. Start dev server
npm run dev

# 2. Visit http://localhost:8080/admin/
# (Won't work fully - needs Netlify Identity for auth)

# 3. You'll see the CMS interface structure
```

**Note:** Local testing is limited without OAuth backend.

---

## What the CMS Will Look Like

### Login Screen
- Netlify Identity login
- Email + password or social auth
- Secure, no GitHub knowledge needed

### Dashboard
**Left Sidebar:**
- 📝 Blog Posts (create/edit)
- 📚 Programs (create/edit)
- 📄 Pages (edit homepage, about)
- 🖼️ Media (image library)
- 👤 Account settings

**Main Area:**
- Content list (all posts/programs)
- Search and filter
- Draft/In Review/Published columns

### Editor Interface
**Form-based editing:**
- Text fields for titles
- Rich text editors for content
- Image upload dropdowns
- Drag-and-drop for images
- Auto-save drafts
- Preview button

### Workflow
1. Create new post → Fill form → Save draft
2. Click "Set status" → In Review
3. Another user approves → Publish
4. Creates Git commit automatically
5. Netlify rebuilds site (~30s)
6. Live at vaemptiness.com

---

## Configuration Highlights

### Editorial Workflow Enabled
```yaml
publish_mode: editorial_workflow
```

**This means:**
- Drafts column (work in progress)
- In Review column (ready for approval)
- Ready column (approved, publish when ready)
- Each creates a Git branch
- Publish = merge to master

### Media Management
```yaml
media_folder: "src/assets/images"
public_folder: "/assets/images"
```

**Upload images:**
- Drag-and-drop in CMS
- Saved to `src/assets/images/`
- Auto-committed to Git
- Referenced correctly in content

### Locale
```yaml
locale: 'es'
```

CMS interface in Spanish (can be changed to 'en' for English).

---

## Files Created Summary

```
vaemptiness-website/
├── src/
│   └── admin/
│       ├── index.html          ✅ Created
│       └── config.yml          ✅ Created
├── .eleventy.js                 ✅ Updated
└── docs/
    ├── CMS_MIGRATION_ANALYSIS.md           ✅ Created
    ├── NETLIFY_DECAP_MIGRATION_GUIDE.md    ✅ Created
    └── DECAP_CMS_QUICKSTART.md             ✅ Created (this file)
```

---

## Committing These Files

```bash
# Review changes
git status

# Stage new files
git add src/admin/ .eleventy.js docs/

# Commit
git commit -m "feat: add Decap CMS initial configuration

- Add admin interface (index.html, config.yml)
- Configure collections: blog, programs, pages
- Enable editorial workflow for drafts/review
- Update Eleventy config to copy admin folder
- Add migration documentation"

# Push to GitHub
git push origin master
```

---

## Testing Without Netlify (Limited)

You can preview the CMS interface structure:

```bash
# Build site
npm run build

# The admin interface is at _site/admin/index.html
# You can open it in browser, but login won't work without Netlify Identity
```

**What works:**
- ✅ See CMS interface design
- ✅ View collection structure
- ✅ See form fields

**What doesn't work:**
- ❌ Login (needs Netlify Identity)
- ❌ Editing content (needs auth)
- ❌ Saving changes (needs Git Gateway)

---

## When You Deploy to Netlify

### Automatic Setup
1. Push these files to GitHub
2. Netlify detects changes
3. Builds site with admin folder
4. Admin available at https://vaemptiness.com/admin/

### Manual Setup Required
1. Enable Netlify Identity (Site Settings → Identity)
2. Enable Git Gateway (Identity → Services → Git Gateway)
3. Invite users (Identity → Invite users)
4. Users receive email, set password
5. Can now login and edit content

---

## Customizing the Configuration

### Add More Fields to Blog Posts

Edit `src/admin/config.yml`, find the blog collection, add fields:

```yaml
- {label: "Read Time", name: "readTime", widget: "number"}
- {label: "Category", name: "category", widget: "select", options: ["Mindfulness", "Psychology", "Philosophy"]}
```

### Add New Page Types

```yaml
- label: "FAQ Page"
  name: "faq"
  file: "src/data/pages/faq.json"
  fields:
    - {label: "Title", name: "title", widget: "string"}
    # ... more fields
```

### Change Interface Language

```yaml
locale: 'en'  # English interface
# or
locale: 'es'  # Spanish interface
```

---

## Troubleshooting Before Deploy

### Config Syntax Errors

**Validate YAML:**
```bash
# Install YAML validator
npm install -g yaml-validator

# Check syntax
yaml-validator src/admin/config.yml
```

**Common errors:**
- Incorrect indentation (use 2 spaces, not tabs)
- Missing quotes around special characters
- Wrong field types

### Admin Files Not Copying

**Check build output:**
```bash
npm run build

# Should see:
# [11ty] Copied 45 files...

# Verify admin folder exists:
ls _site/admin/
# Should show: config.yml, index.html
```

### Collections Not Matching Files

**Ensure paths are correct:**
```yaml
folder: "src/data/pages/blog"  # Must match actual folder
extension: "json"               # Must match file type
format: "json"                  # Parser to use
```

---

## Resources

### Documentation
- **Decap CMS:** https://decapcms.org/docs/
- **Netlify Identity:** https://docs.netlify.com/visitor-access/identity/
- **Git Gateway:** https://docs.netlify.com/visitor-access/git-gateway/

### Configuration Reference
- **Widget types:** https://decapcms.org/docs/widgets/
- **Backend options:** https://decapcms.org/docs/backends-overview/
- **Collection types:** https://decapcms.org/docs/collection-types/

### Community
- **Discord:** https://decapcms.org/chat/
- **GitHub:** https://github.com/decaporg/decap-cms
- **Forum:** https://answers.netlify.com/

---

## Cost Breakdown

### What's Free Forever
- ✅ Decap CMS (open source)
- ✅ Netlify hosting (100GB bandwidth/month)
- ✅ Netlify Identity (1,000 users)
- ✅ Git Gateway (unlimited)
- ✅ Deploy previews
- ✅ HTTPS/SSL certificates
- ✅ Build minutes (300 minutes/month)

### What Costs Money
- ❌ Nothing for vaemptiness use case!

**Your site is well within free tiers:**
- ~10 deploys/month = 5 build minutes
- ~5 active editors
- Small asset storage (~10MB)

---

## Comparison: Before vs After

### Before (Current)
```
Editor workflow:
1. Clone Git repo
2. Find JSON file
3. Edit JSON (error-prone)
4. Commit to Git
5. Push to GitHub
6. Wait for build

Pain points:
- Requires Git knowledge
- JSON syntax errors
- No preview
- Complex image uploads
```

### After (With Decap CMS)
```
Editor workflow:
1. Go to vaemptiness.com/admin/
2. Click "New Blog Post"
3. Fill form (user-friendly)
4. Upload images (drag-drop)
5. Click "Publish"

Benefits:
- No Git knowledge needed
- No JSON errors
- Live preview
- Easy image management
- Draft/review workflow
- Mobile-friendly
```

---

## Ready to Deploy?

Follow the full migration guide:
📖 `/docs/NETLIFY_DECAP_MIGRATION_GUIDE.md`

**Or jump to specific sections:**
- [Phase 1: Netlify Setup (15 min)](#2-phase-1-netlify-setup-15-minutes)
- [Phase 2: Domain Config (10 min)](#3-phase-2-domain-configuration-10-minutes)
- [Phase 3: Enable Identity](#4-phase-3-decap-cms-installation-30-minutes)

---

**Questions?** Check the troubleshooting section in the migration guide or reach out!

**Last Updated:** January 7, 2026
