# Website Editor Options: Comprehensive Analysis

**Date:** January 7, 2026
**Current Stack:** Eleventy (11ty) + Nunjucks + JSON data files + GitHub Pages
**Goal:** Enable non-technical users to easily edit texts, images, and placements

---

## Table of Contents

1. [Current State Analysis](#1-current-state-analysis)
2. [Option 1: LLM-Based Editing Workflow](#2-option-1-llm-based-editing-workflow)
3. [Option 2: WordPress Migration](#3-option-2-wordpress-migration)
4. [Option 3: Headless CMS Solutions](#4-option-3-headless-cms-solutions)
5. [Option 4: Git-Based CMS (Decap/Netlify CMS)](#5-option-4-git-based-cms-decapnetlify-cms)
6. [Option 5: Visual Page Builders](#6-option-5-visual-page-builders)
7. [Detailed Comparison Matrix](#7-detailed-comparison-matrix)
8. [Migration Complexity Analysis](#8-migration-complexity-analysis)
9. [Cost Analysis](#9-cost-analysis)
10. [Recommendations](#10-recommendations)

---

## 1. Current State Analysis

### Architecture Summary
- **Static Site Generator:** Eleventy v2.0.1
- **Templates:** Nunjucks (`.njk` files)
- **Content Storage:** 22 JSON files in `src/data/`
- **Images:** ~7.2MB in `src/assets/images/`
- **Deployment:** GitHub Actions → GitHub Pages
- **Build Time:** ~4-7 seconds
- **Total Site Size:** ~7.7MB

### Content Structure
```
src/data/
├── site.json (global metadata)
├── navigation.json
├── pages/
│   ├── home.json
│   ├── sobre-nosotros.json
│   ├── programs/
│   │   ├── vaemptiness-program.json
│   │   ├── vaemptiness-equipos.json
│   │   ├── vaemptiness-teen.json
│   │   └── vaemptiness-kids.json
│   └── blog/
│       ├── ciencia-budista-vaemptiness.json
│       ├── entrenamiento-mental.json
│       └── [6 more blog posts]
```

### Current Pain Points
1. ❌ Requires Git knowledge to make changes
2. ❌ JSON editing is error-prone for non-developers
3. ❌ No visual preview before deploying
4. ❌ Complex image upload process (manual file copy)
5. ❌ No content scheduling/drafts
6. ❌ No collaborative editing features
7. ✅ But: Fast, secure, version-controlled

---

## 2. Option 1: LLM-Based Editing Workflow

### Concept
Build a custom web interface where editors describe changes in natural language, and an LLM (Claude/GPT-4) generates the necessary JSON/file updates.

### Architecture

```
┌──────────────────┐
│  Editor Portal   │ (Next.js/React web app)
│  (Web Interface) │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   LLM Service    │ (Claude API / GPT-4)
│  - Parse intent  │
│  - Generate JSON │
│  - Validate      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  GitHub API      │ (Create commits/PRs)
│  - Update files  │
│  - Trigger build │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Eleventy Build  │ (Existing process)
└──────────────────┘
```

### Implementation Details

**Phase 1: Simple Text Editor (2-3 weeks)**
- Web form with natural language input
- Example: "Change the homepage hero title to 'Nueva forma de entrenar la mente'"
- LLM parses intent → identifies `src/data/pages/home.json` → updates `content.hero.title`
- Creates GitHub commit via API
- Shows preview link before publishing

**Phase 2: Image Upload (1-2 weeks)**
- Drag-and-drop image upload
- Example: "Upload this image for the blog post about Buddhist science"
- LLM identifies correct blog entry → uploads to `src/assets/images/blog/`
- Updates JSON file with new path

**Phase 3: Layout Changes (2-3 weeks)**
- More complex instructions
- Example: "Move the testimonials section above the programs section on the homepage"
- LLM modifies template order or JSON structure

### Technology Stack
```yaml
Frontend: Next.js + TailwindCSS
Backend: Node.js API (serverless functions)
LLM: Claude 3.5 Sonnet or GPT-4
Storage: GitHub API (existing repo)
Auth: Auth0 or NextAuth
Preview: Netlify Deploy Previews
```

### Pros
✅ **No migration needed** - keeps existing Eleventy setup
✅ **Natural language interface** - extremely user-friendly
✅ **Version control maintained** - all changes tracked in Git
✅ **Custom to your needs** - built exactly for vaemptiness workflow
✅ **Iterative development** - can build in phases
✅ **No vendor lock-in** - you own the code
✅ **Preview before publish** - LLM can generate preview builds

### Cons
❌ **Development time** - 6-8 weeks for full implementation
❌ **Ongoing maintenance** - custom code requires upkeep
❌ **LLM API costs** - $0.01-0.05 per edit (Claude/GPT pricing)
❌ **Potential errors** - LLM might misinterpret complex instructions
❌ **Limited to structured changes** - radical redesigns still need developer
❌ **Single point of failure** - if LLM service down, editing blocked

### Cost Estimate
- **Development:** €8,000-12,000 (freelance developer @ €50-75/hour × 160-200 hours)
- **Hosting:** €20-40/month (Vercel/Netlify for editor portal)
- **LLM API:** €10-50/month (depends on edit frequency)
- **Total Year 1:** €8,400-12,800
- **Ongoing:** €360-1,080/year

### Migration Complexity: ⭐ (1/5)
- Minimal - adds interface layer, no content migration
- Eleventy site remains unchanged
- Can roll back easily if needed

---

## 3. Option 2: WordPress Migration

### Concept
Migrate from Eleventy to WordPress - the most popular CMS (43% of web).

### Architecture

```
┌──────────────────┐
│  WordPress Admin │ (Built-in editor)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  MySQL Database  │ (Content storage)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  PHP Theme       │ (Custom design)
│  - Templates     │
│  - CSS/JS        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Hosting Server  │ (VPS/Managed WP)
└──────────────────┘
```

### Implementation Path

**Phase 1: Setup (1-2 weeks)**
1. Choose hosting (Kinsta, WP Engine, or Siteground)
2. Install WordPress + essential plugins
3. Configure SSL, backups, security

**Phase 2: Theme Development (3-4 weeks)**
1. Convert Nunjucks templates to PHP
2. Migrate CSS/JS (mostly direct copy)
3. Create Custom Post Types (Programs, Blog)
4. Build page templates for each section

**Phase 3: Content Migration (1-2 weeks)**
1. Write scripts to import JSON → WordPress database
2. Upload images to Media Library
3. Recreate page layouts using Gutenberg blocks
4. Set up navigation menus

**Phase 4: Testing & Launch (1 week)**
1. QA all pages
2. SEO verification (301 redirects)
3. Performance optimization
4. Go live

### WordPress Setup
```yaml
Core: WordPress 6.4+
Theme: Custom theme based on current design
Page Builder: Gutenberg (native) or Elementor
Plugins:
  - Yoast SEO (SEO management)
  - Advanced Custom Fields (flexible content)
  - WP Rocket (caching)
  - Wordfence (security)
  - UpdraftPlus (backups)
```

### Pros
✅ **Industry standard** - massive ecosystem & support
✅ **User-friendly** - Gutenberg editor is intuitive
✅ **Plugin ecosystem** - 60,000+ plugins available
✅ **No coding for editors** - WYSIWYG interface
✅ **Media library** - drag-and-drop image uploads
✅ **User roles** - admin, editor, author permissions
✅ **Preview/drafts** - built-in scheduling & revisions
✅ **SEO plugins** - Yoast/RankMath for optimization

### Cons
❌ **Security maintenance** - regular updates required
❌ **Performance** - slower than static sites (needs caching)
❌ **Hosting costs** - requires managed WordPress hosting
❌ **Plugin bloat** - can become sluggish over time
❌ **Migration effort** - 6-8 weeks full project
❌ **Database dependency** - more complex backups
❌ **Theme lock-in** - custom theme needs ongoing maintenance
❌ **Overkill** - most features won't be used

### Cost Estimate
- **Development:** €10,000-18,000 (theme development + migration)
- **Hosting:** €25-80/month (Kinsta/WP Engine managed hosting)
- **Plugins:** €100-300/year (premium plugins)
- **Maintenance:** €100-200/month (updates, backups, security)
- **Total Year 1:** €13,500-21,700
- **Ongoing:** €3,300-5,200/year

### Migration Complexity: ⭐⭐⭐⭐ (4/5)
- High complexity - full platform change
- Requires PHP theme development
- Database setup and management
- SEO preservation critical (301 redirects)
- 6-8 weeks project timeline

---

## 4. Option 3: Headless CMS Solutions

### Concept
Keep Eleventy frontend, add a headless CMS backend for content management.

### Top Headless CMS Options

#### A. **Sanity.io** (Recommended)

**Architecture:**
```
┌──────────────────┐
│  Sanity Studio   │ (Admin interface)
│  (Self-hosted)   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Sanity Content  │ (Cloud API)
│  Lake (Storage)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Eleventy Build  │ (Fetch from Sanity API)
│  (Your templates)│
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  GitHub Pages    │ (Static output)
└──────────────────┘
```

**Features:**
- Real-time collaborative editing
- Portable Text (structured rich text)
- Image hotspot cropping
- Custom input components
- GROQ query language (powerful data fetching)
- Built-in localization support
- Vision plugin (AI content assist)

**Pros:**
✅ **Keep Eleventy** - minimal frontend changes
✅ **Excellent UX** - intuitive Studio interface
✅ **Structured content** - enforces data schemas
✅ **Real-time preview** - see changes before publish
✅ **Image pipeline** - automatic optimization
✅ **Version history** - roll back changes
✅ **API-first** - flexible integration

**Cons:**
❌ **Learning curve** - GROQ queries require learning
❌ **Migration effort** - JSON → Sanity schemas
❌ **Dependency** - vendor lock-in to Sanity
❌ **Build hooks** - needs webhook setup for deployments

**Cost:**
- Free tier: 3 users, 10GB assets
- Growth: $99/month (10 users, 200GB)
- **Suitable for vaemptiness:** Free tier sufficient

**Migration Complexity:** ⭐⭐⭐ (3/5)

---

#### B. **Strapi** (Self-hosted option)

**Architecture:**
```
┌──────────────────┐
│  Strapi Admin    │ (Self-hosted UI)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  PostgreSQL DB   │ (Your server)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Strapi API      │ (REST/GraphQL)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Eleventy Build  │ (Fetch from Strapi)
└──────────────────┘
```

**Features:**
- Fully open-source
- Self-hosted (full control)
- Customizable admin panel
- REST & GraphQL APIs
- Role-based access control
- Media library with folders

**Pros:**
✅ **Open source** - no vendor lock-in
✅ **Self-hosted** - full data control
✅ **Customizable** - extend with plugins
✅ **Free** - no subscription costs

**Cons:**
❌ **Server management** - need VPS hosting
❌ **Maintenance overhead** - updates, security, backups
❌ **Setup complexity** - requires DevOps knowledge

**Cost:**
- Hosting: €15-50/month (VPS like DigitalOcean/Hetzner)
- Setup: €2,000-4,000 (initial configuration)
- **Ongoing:** €180-600/year

**Migration Complexity:** ⭐⭐⭐⭐ (4/5)

---

#### C. **Contentful**

**Features:**
- Enterprise-grade CMS
- Rich content modeling
- Powerful localization
- Workflow management
- GraphQL API

**Pros:**
✅ **Enterprise features** - approval workflows
✅ **Scalable** - handles high traffic
✅ **Great docs** - comprehensive resources

**Cons:**
❌ **Expensive** - $489/month for Growth plan
❌ **Overkill** - too many features for small site
❌ **Complex** - steep learning curve

**Cost:** Too expensive for vaemptiness use case

---

## 5. Option 4: Git-Based CMS (Decap/Netlify CMS)

### Concept
Add a web interface that directly edits your Git repository - no database needed.

### Architecture

```
┌──────────────────┐
│  Decap CMS       │ (Admin at /admin/)
│  (Static app)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  GitHub API      │ (Direct file edits)
│  (Your repo)     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Eleventy Build  │ (Triggered by commit)
└──────────────────┘
```

### Implementation

**Setup (1-2 days):**
1. Add `admin/` folder with `config.yml`
2. Define content schemas (mirror your JSON structure)
3. Configure GitHub OAuth
4. Deploy admin interface

**config.yml example:**
```yaml
backend:
  name: github
  repo: NachoColl/vaemptiness-website
  branch: master

media_folder: "src/assets/images"
public_folder: "/assets/images"

collections:
  - name: "blog"
    label: "Blog Posts"
    folder: "src/data/pages/blog"
    create: true
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Author", name: "author", widget: "string"}
      - {label: "Date", name: "date", widget: "datetime"}
      - {label: "Featured Image", name: "image", widget: "image"}
      - {label: "Content", name: "body", widget: "markdown"}

  - name: "programs"
    label: "Programs"
    folder: "src/data/pages/programs"
    fields:
      - {label: "Name", name: "name", widget: "string"}
      - {label: "Hero Image", name: "heroImage", widget: "image"}
      # ... more fields
```

### Pros
✅ **Zero backend** - static CMS, no database
✅ **Keep Git workflow** - all changes still tracked
✅ **Fast setup** - 1-2 days to configure
✅ **Free** - no subscription costs
✅ **Familiar interface** - CMS-style editing
✅ **Preview** - can integrate preview builds
✅ **No vendor lock-in** - just static files

### Cons
❌ **Limited UI** - basic compared to WordPress
❌ **Config required** - must define all schemas
❌ **GitHub dependency** - tied to GitHub
❌ **No advanced features** - no workflows, approval processes
❌ **Image handling** - basic upload only

### Cost Estimate
- **Setup:** €500-1,500 (configure schemas & auth)
- **Hosting:** €0 (static files in your repo)
- **Ongoing:** €0
- **Total:** €500-1,500 one-time

### Migration Complexity: ⭐ (1/5)
- Minimal - just adds admin interface
- No content migration required
- Can start with 1-2 collections, expand gradually

---

## 6. Option 5: Visual Page Builders

### Top Options

#### A. **Builder.io** (Visual editor)

**Concept:** Add visual editing to Eleventy without full migration.

**Features:**
- Drag-and-drop visual editor
- Component library
- A/B testing built-in
- Personalization features
- Integrates with existing code

**Pros:**
✅ Visual editing experience
✅ No code changes for editors
✅ Keep Eleventy structure

**Cons:**
❌ Expensive: $199/month minimum
❌ Overkill for small site

---

#### B. **Webflow** (Complete platform change)

**Would require full migration** - not recommended for your use case.

---

## 7. Detailed Comparison Matrix

| Criteria | LLM Editor | WordPress | Sanity | Decap CMS | Strapi |
|----------|------------|-----------|---------|-----------|--------|
| **Ease of Use** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Migration Effort** | ⭐ (minimal) | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐ | ⭐⭐⭐⭐ |
| **Setup Time** | 6-8 weeks | 6-8 weeks | 2-3 weeks | 1-2 days | 3-4 weeks |
| **Monthly Cost** | €30-70 | €50-200 | €0-99 | €0 | €15-50 |
| **Year 1 Cost** | €8,500-13,000 | €14,000-22,000 | €2,000-3,500 | €500-1,500 | €2,500-4,500 |
| **Ongoing Cost** | €400-900/yr | €3,500-5,500/yr | €0-1,200/yr | €0 | €200-700/yr |
| **Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Security** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Flexibility** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Vendor Lock-in** | Low | Medium | Medium | None | None |
| **Learning Curve** | Low | Low | Medium | Medium | High |
| **Maintenance** | Low | High | Low | Very Low | Medium |
| **Collaborative Editing** | No | Yes | Yes | No | Yes |
| **Version Control** | Yes (Git) | Via plugins | Yes | Yes (Git) | No |
| **Image Management** | Basic | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Preview/Staging** | Yes | Yes | Yes | Limited | Yes |
| **Mobile App** | No | Yes | Yes | No | Limited |
| **Multilingual** | Possible | Yes | Yes | Yes | Yes |
| **SEO Tools** | Custom | Excellent | Good | Basic | Good |

---

## 8. Migration Complexity Analysis

### JSON → Different Systems

#### Sanity Migration Example
**Current JSON:**
```json
{
  "title": "vaemptîness Program",
  "hero": {
    "title": "Entrenamiento Mental",
    "subtitle": "Para reducir el ruido mental"
  }
}
```

**Sanity Schema:**
```javascript
export default {
  name: 'program',
  type: 'document',
  fields: [
    {name: 'title', type: 'string'},
    {
      name: 'hero',
      type: 'object',
      fields: [
        {name: 'title', type: 'string'},
        {name: 'subtitle', type: 'text'}
      ]
    }
  ]
}
```

**Migration Script Needed:** Yes (convert JSON → Sanity documents)

---

#### Decap CMS Migration
**config.yml:**
```yaml
collections:
  - name: "programs"
    folder: "src/data/pages/programs"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - label: "Hero"
        name: "hero"
        widget: "object"
        fields:
          - {label: "Title", name: "title", widget: "string"}
          - {label: "Subtitle", name: "subtitle", widget: "text"}
```

**Migration Script Needed:** No - reads existing JSON files

---

### SEO Preservation

All options can maintain SEO if properly configured:
- 301 redirects from old URLs
- Preserve meta tags, Open Graph, Schema.org
- Maintain sitemap.xml
- Keep canonical URLs

**Easiest SEO preservation:**
1. Decap CMS (no URL changes)
2. LLM Editor (no URL changes)
3. Sanity (maintain Eleventy routing)
4. WordPress (requires redirect configuration)

---

## 9. Cost Analysis

### 3-Year Total Cost of Ownership

| Solution | Year 1 | Year 2 | Year 3 | **3-Year Total** |
|----------|--------|--------|--------|------------------|
| **Decap CMS** | €1,000 | €0 | €0 | **€1,000** ⭐ |
| **LLM Editor** | €8,800 | €700 | €700 | **€10,200** |
| **Sanity (Free)** | €2,500 | €0 | €0 | **€2,500** |
| **Sanity (Growth)** | €3,700 | €1,200 | €1,200 | **€6,100** |
| **Strapi** | €3,500 | €500 | €500 | **€4,500** |
| **WordPress** | €15,000 | €4,000 | €4,000 | **€23,000** |

**Winner:** Decap CMS (most cost-effective)

---

## 10. Recommendations

### 🥇 **BEST OPTION: Decap CMS (Formerly Netlify CMS)**

**Why:**
- ✅ **Fastest to implement** (1-2 days setup)
- ✅ **Zero ongoing costs** (completely free)
- ✅ **No migration risk** (edits existing JSON files)
- ✅ **Keep Git workflow** (version control preserved)
- ✅ **Adequate features** for vaemptiness needs
- ✅ **Easy to remove** if you want to try something else later

**Ideal For:**
- Small team (1-3 editors)
- Simple content updates (text, images)
- Budget-conscious projects
- Quick wins needed

**Implementation Plan:**
1. **Week 1:** Configure Decap CMS
   - Set up `admin/config.yml`
   - Define blog collection schema
   - Configure GitHub OAuth
   - Deploy admin interface

2. **Week 2:** Expand collections
   - Add programs collection
   - Add pages collection (home, about, etc.)
   - Configure image uploads
   - Train team on interface

**Total Time:** 1-2 weeks
**Total Cost:** €500-1,500 one-time

---

### 🥈 **RUNNER-UP: Sanity.io (Headless CMS)**

**Why:**
- ✅ **Better UX** than Decap (modern, intuitive)
- ✅ **Free tier sufficient** for vaemptiness
- ✅ **Scalable** (can grow with site)
- ✅ **Great image handling** (automatic optimization)
- ✅ **Real-time collaboration**

**Consider If:**
- You plan to significantly expand content (50+ blog posts, multiple programs)
- Multiple editors need to work simultaneously
- You want advanced features (localization, workflows)
- Budget allows €2,500 initial setup

**Implementation Plan:**
1. **Week 1-2:** Schema design & Sanity Studio setup
2. **Week 3:** Migration scripts (JSON → Sanity)
3. **Week 4:** Integrate Eleventy with Sanity API
4. **Week 5:** Testing & training

**Total Time:** 4-5 weeks
**Total Cost:** €2,500-3,500 one-time

---

### 🥉 **LONG-TERM: LLM-Based Editor**

**Why:**
- ✅ **Most innovative** approach
- ✅ **Best UX** (natural language)
- ✅ **Future-proof** (AI-first editing)
- ❌ **High initial cost**
- ❌ **Longer development time**

**Consider If:**
- You have budget (€10,000+)
- You want cutting-edge solution
- Natural language editing excites your team
- You're willing to wait 6-8 weeks

**Not Recommended For:**
- Immediate needs (takes 2+ months)
- Tight budgets
- Risk-averse teams

---

### ❌ **NOT RECOMMENDED: WordPress**

**Why:**
- ❌ Too expensive (€23,000 over 3 years)
- ❌ Overkill for site size (22 content pages)
- ❌ Performance concerns (slower than static)
- ❌ Security overhead (constant updates)
- ❌ High migration risk (6-8 week project)

**Only Consider If:**
- You need e-commerce (WooCommerce)
- You want mobile app editing
- Enterprise features required (approval workflows, advanced user management)

---

## Final Recommendation

### **PHASE 1 (Now): Implement Decap CMS**
- Cost: €1,000
- Time: 1-2 weeks
- Risk: Very low

**Benefits:**
- Immediate solution
- Zero ongoing costs
- Editors can start working in 2 weeks
- No vendor lock-in
- Can migrate later if needed

### **PHASE 2 (6-12 months): Evaluate Upgrade**
If Decap CMS proves limiting, consider:
- **Sanity.io** if you need better UX and collaboration
- **LLM Editor** if you have budget and want innovation

### **Never:**
- Migrate to WordPress (too expensive, too complex for your needs)
- Use Contentful (enterprise pricing, unnecessary)
- Build custom CMS from scratch (huge risk)

---

## Next Steps

### To Proceed with Decap CMS:

1. **Create admin config:**
   ```bash
   mkdir -p src/admin
   touch src/admin/config.yml
   touch src/admin/index.html
   ```

2. **Configure GitHub OAuth:**
   - Create GitHub OAuth App
   - Set callback URL

3. **Define content schemas:**
   - Blog posts
   - Programs
   - Pages

4. **Test locally:**
   ```bash
   npm run dev
   # Visit http://localhost:8080/admin/
   ```

5. **Deploy & train team**

**Want me to implement Decap CMS setup?** I can create the configuration files and get you started in < 1 hour.

---

## Resources

- **Decap CMS:** https://decapcms.org/
- **Sanity.io:** https://www.sanity.io/
- **Strapi:** https://strapi.io/
- **Eleventy + CMS guides:** https://11ty.rocks/

---

**Document Version:** 1.0
**Last Updated:** January 7, 2026
**Author:** Claude Code Analysis
