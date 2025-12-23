# JSON Refactoring Plan: 1 JSON File Per Page

## Goal
Move all text content from templates into JSON files with a **1 JSON file per page** structure, enabling customers to easily edit content without touching templates.

## Current State Analysis

### Existing Pages (18 total)
- **11 static pages**: Home, About, Contact, Aprendizaje, Reset, Privacy, Terms, Blog Index, 404, Thank You, Programa Index
- **7 generated pages**: 4 program detail pages (adultos, equipos, adolescentes, ninos) + 1 blog post (filosofia-budista)

### Current Data Structure (12 JSON files)
```
src/data/
├── site.json          # Global site data (title, contact, SEO defaults)
├── navigation.json    # Menu items
├── hero.json          # Homepage hero section
├── programs.json      # Array of all programs
├── team.json          # Team members
├── blog.json          # Array of blog posts
├── testimonio.json    # Testimonials
├── approach.json      # Methodology/approach content
├── about.json         # About page content
├── contact.json       # Contact form labels
├── footer.json        # Footer content
└── seo.json           # SEO defaults
```

### Current Hardcoded Text Locations
1. **Templates with extensive hardcoded Spanish text**:
   - `aprendizaje-y-metodologia.njk` - Full page content (sections, quotes, lists)
   - `reset.njk` - Full page content (intro, sections, exercises)
   - `privacy.njk` - Complete privacy policy
   - `terms.njk` - Complete terms and conditions
   - `index.njk` - Some section headings and CTAs
   - `header.njk` - Logo alt text, mobile menu labels
   - `footer.njk` - Footer headings and legal links

2. **Templates using existing JSON data**:
   - `programa.njk` - Uses programs.json (pagination)
   - `blog-post.njk` - Uses blog.json (pagination)
   - `nosotros.njk` - Uses about.json + team.json
   - `contacto.njk` - Uses contact.json
   - `404.njk` - Minimal hardcoded text

---

## Proposed Structure

### New Directory Structure
```
src/data/pages/
├── home.json                    # Homepage (index.njk)
├── nosotros.json                # About page
├── aprendizaje-y-metodologia.json
├── reset.json
├── contacto.json
├── programas.json               # Programs index page
├── blog.json                    # Blog index page
├── privacidad.json              # Privacy policy
├── terminos.json                # Terms and conditions
├── 404.json                     # 404 page
├── gracias.json                 # Thank you page
└── programs/
    ├── adultos.json
    ├── equipos.json
    ├── adolescentes.json
    └── ninos.json
└── blog/
    └── filosofia-budista-vaemptiness.json
```

### Shared Data (Keep Separate)
```
src/data/
├── site.json          # Global config (SEO defaults, contact info, analytics)
├── navigation.json    # Menu structure (shared across all pages)
└── footer.json        # Footer structure (shared across all pages)
```

**Rationale**: Site config, navigation, and footer are truly global components used on every page. Duplicating them in each page JSON would create maintenance burden.

---

## Data Schema Definitions

### Schema 1: Static Page (e.g., home.json, aprendizaje.json, reset.json)
```json
{
  "meta": {
    "slug": "home",
    "layout": "base.njk",
    "bodyClass": "home-page",
    "seo": {
      "title": "vaemptîness | Entrenamiento Mental y Mindfulness Barcelona",
      "description": "...",
      "keywords": "...",
      "ogImage": "/assets/images/og-home.jpg",
      "ogType": "website"
    }
  },
  "content": {
    "hero": {
      "title": "vaemptîness",
      "tagline": "brain training",
      "subtitle": "Crea espacio mental,<br class=\"mobile-break\"> libérate del ruido.",
      "scrollText": "Descubre más"
    },
    "learningIntro": {
      "text": "Un enfoque que fusiona teoría y práctica...",
      "quote": "No memorizas conceptos, <br class=\"desktop-break\">los experimentas",
      "buttonText": "Conocer más",
      "buttonUrl": "/aprendizaje-y-metodologia/"
    },
    "principles": [
      {
        "number": "01",
        "title": "Fusiona",
        "description": "Teoría y práctica en cada experiencia..."
      }
    ],
    "philosophy": {
      "quote": "El vacío no es un problema...",
      "buttonText": "Haz reset",
      "buttonUrl": "/reset/"
    },
    "programsSection": {
      "title": "Nuestros Programas"
    },
    "cta": {
      "title": "Únete al universo vaemptîness",
      "description": "Pulsa para volver a tí.",
      "buttonText": "Cuestiónate y calma",
      "buttonUrl": "/contacto/"
    }
  },
  "schema": [
    {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      "name": "vaemptîness",
      ...
    }
  ]
}
```

### Schema 2: Paginated Content Source (programs.json, blog.json)
**Keep existing structure** but move to `src/data/pages/programs/` and `src/data/pages/blog/`

Each program/blog post becomes its own file:
```json
// src/data/pages/programs/adultos.json
{
  "id": "adultos",
  "slug": "adultos",
  "name": "Adultos",
  "featured": true,
  "ageRange": "18+",
  "shortDescription": "...",
  "description": "...",
  "benefits": [...],
  "approach": {...},
  "sessions": {...},
  "pricing": {...},
  "seo": {...}
}
```

### Schema 3: Legal Pages (privacy.json, terms.json)
```json
{
  "meta": {
    "slug": "privacidad",
    "layout": "base.njk",
    "seo": {...}
  },
  "content": {
    "title": "Política de Privacidad",
    "lastUpdated": "2024-01-15",
    "sections": [
      {
        "title": "1. Información que recopilamos",
        "content": "<p>Recopilamos información que nos proporcionas directamente...</p>"
      },
      {
        "title": "2. Cómo usamos tu información",
        "content": "<p>Utilizamos la información para...</p>"
      }
    ]
  }
}
```

---

## Template Modifications Needed

### Phase 1: Simple Static Pages (Low Risk)

#### 1. `src/templates/index.njk`
**Current**: Mixed - uses `hero.json` but has hardcoded CTA text
**Changes**:
```nunjucks
<!-- OLD -->
<h2 class="cta-title">Únete al universo vaemptîness</h2>
<p class="cta-description">Pulsa para volver a tí.</p>

<!-- NEW -->
<h2 class="cta-title">{{ content.cta.title }}</h2>
<p class="cta-description">{{ content.cta.description }}</p>
```

**Data source**: `pages/home.json`
**Access via**: Front matter or global data

#### 2. `src/templates/404.njk`
**Current**: Hardcoded heading and text
**Changes**: Replace all hardcoded strings with `{{ content.title }}`, `{{ content.message }}`
**Data source**: `pages/404.json`

#### 3. `src/templates/gracias.njk`
**Current**: Hardcoded thank you message
**Changes**: Replace with `{{ content.title }}`, `{{ content.message }}`
**Data source**: `pages/gracias.json`

---

### Phase 2: Complex Static Pages (Medium Risk)

#### 4. `src/templates/aprendizaje-y-metodologia.njk`
**Current**: Extensive hardcoded sections, lists, quotes
**Changes**:
- Move all section content to `pages/aprendizaje-y-metodologia.json`
- Use loops for sections: `{% for section in content.sections %}`
- Support rich HTML in JSON with `| safe` filter

**Example structure**:
```nunjucks
{% for section in content.sections %}
<section class="{{ section.class }}">
  <div class="container">
    <h2>{{ section.title }}</h2>
    <div class="section-content">{{ section.content | safe }}</div>
    {% if section.list %}
    <ul>
      {% for item in section.list %}
      <li>{{ item | safe }}</li>
      {% endfor %}
    </ul>
    {% endif %}
  </div>
</section>
{% endfor %}
```

#### 5. `src/templates/reset.njk`
**Current**: Full page with intro, multiple sections, exercises
**Changes**: Similar to aprendizaje.njk - loop through sections from `pages/reset.json`

---

### Phase 3: Legal Pages (Low Risk, High Volume)

#### 6-7. `src/templates/privacy.njk` & `src/templates/terms.njk`
**Current**: Massive hardcoded HTML content
**Changes**:
```nunjucks
<article class="legal-content">
  <h1>{{ content.title }}</h1>
  <p class="last-updated">Última actualización: {{ content.lastUpdated }}</p>

  {% for section in content.sections %}
  <section>
    <h2>{{ section.title }}</h2>
    <div class="section-content">{{ section.content | safe }}</div>
  </section>
  {% endfor %}
</article>
```

**Data source**: `pages/privacidad.json`, `pages/terminos.json`

---

### Phase 4: Shared Components (High Risk - Used Everywhere)

#### 8. `src/templates/_includes/header.njk`
**Current**: Uses `navigation.json` but has hardcoded logo alt text and mobile labels
**Changes**:
```nunjucks
<!-- OLD -->
<img src="/assets/images/logo.svg" alt="vaemptîness logo">
<span class="mobile-menu-label">Menú</span>

<!-- NEW -->
<img src="/assets/images/logo.svg" alt="{{ navigation.logoAlt }}">
<span class="mobile-menu-label">{{ navigation.mobileMenuLabel }}</span>
```

**Data source**: Add fields to existing `navigation.json`:
```json
{
  "logoAlt": "vaemptîness logo",
  "mobileMenuLabel": "Menú",
  "items": [...]
}
```

#### 9. `src/templates/_includes/footer.njk`
**Current**: Uses `footer.json` but some hardcoded headings
**Changes**: Ensure all text comes from `footer.json`

---

### Phase 5: Paginated Pages (High Complexity)

#### 10. `src/templates/programa.njk`
**Current**: Pagination from `programs.json` array
**New approach**: Individual JSON files per program

**Eleventy pagination config**:
```js
// .eleventy.js
eleventyConfig.addCollection("programs", function(collectionApi) {
  const fs = require('fs');
  const path = require('path');
  const programsDir = path.join(__dirname, 'src/data/pages/programs');

  return fs.readdirSync(programsDir)
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const data = JSON.parse(fs.readFileSync(path.join(programsDir, file)));
      return data;
    });
});
```

**Template changes**: Minimal - still access via `{{ program.name }}` but now `program` is the entire JSON file

#### 11. `src/templates/blog-post.njk`
**Same approach as programs** - individual files in `pages/blog/`

---

## Migration Strategy

### Step-by-Step Approach

#### Phase 1: Setup (30 min)
1. Create new directory structure: `src/data/pages/`, `src/data/pages/programs/`, `src/data/pages/blog/`
2. Create `.eleventy.js` configuration to make page data available globally

#### Phase 2: Migrate Simple Pages (1-2 hours)
**Order**: 404 → Thank You → Home (CTA only)
1. Create JSON file for page
2. Update template to use JSON data
3. Test build and verify content displays correctly
4. Commit each page individually

#### Phase 3: Migrate Complex Static Pages (2-3 hours)
**Order**: Aprendizaje → Reset → Privacy → Terms
1. Extract all hardcoded text to JSON
2. Preserve HTML formatting with `<strong>`, `<br>`, `<em>` tags in JSON
3. Update template to loop through sections
4. Test thoroughly - these pages have complex layouts
5. Commit each page

#### Phase 4: Migrate Shared Components (1 hour)
**Order**: Footer → Header → Navigation
1. Update existing JSON files (footer.json, navigation.json)
2. Update templates to use new fields
3. Test on all pages
4. Commit

#### Phase 5: Refactor Paginated Content (2-3 hours)
**Order**: Programs → Blog
1. Split `programs.json` array into individual files (4 files)
2. Split `blog.json` array into individual files (1 file currently)
3. Update `.eleventy.js` to create collections from directory
4. Update templates if needed
5. Test pagination still works
6. Commit

#### Phase 6: Cleanup (30 min)
1. Delete old JSON files: `hero.json`, `approach.json`, etc.
2. Update documentation
3. Create customer editing guide

---

## Eleventy Configuration Changes

### Required Changes to `.eleventy.js`

```js
// Make page data globally available
eleventyConfig.addGlobalData("pages", function() {
  const fs = require('fs');
  const path = require('path');
  const pagesDir = path.join(__dirname, 'src/data/pages');

  const pages = {};

  // Read all JSON files in pages directory
  fs.readdirSync(pagesDir).forEach(file => {
    if (file.endsWith('.json')) {
      const pageName = file.replace('.json', '');
      pages[pageName] = JSON.parse(fs.readFileSync(path.join(pagesDir, file)));
    }
  });

  return pages;
});

// Create programs collection from individual files
eleventyConfig.addCollection("programs", function(collectionApi) {
  const fs = require('fs');
  const path = require('path');
  const programsDir = path.join(__dirname, 'src/data/pages/programs');

  return fs.readdirSync(programsDir)
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const data = JSON.parse(fs.readFileSync(path.join(programsDir, file)));
      return {
        ...data,
        url: `/${data.slug}/`,
        template: 'programa.njk'
      };
    })
    .sort((a, b) => a.order - b.order); // Sort by order field
});

// Create blog collection from individual files
eleventyConfig.addCollection("blog", function(collectionApi) {
  const fs = require('fs');
  const path = require('path');
  const blogDir = path.join(__dirname, 'src/data/pages/blog');

  return fs.readdirSync(blogDir)
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const data = JSON.parse(fs.readFileSync(path.join(blogDir, file)));
      return {
        ...data,
        url: `/blog/${data.slug}/`,
        template: 'blog-post.njk'
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first
});
```

### Template Front Matter Changes

**Current approach**: Templates use front matter to set pagination
```nunjucks
---
pagination:
  data: programs
  size: 1
  alias: program
permalink: "/{{ program.slug }}/"
---
```

**New approach**: Use collections instead
```nunjucks
---
pagination:
  data: collections.programs
  size: 1
  alias: program
permalink: "/{{ program.slug }}/"
---
```

---

## Challenges and Solutions

### Challenge 1: HTML in JSON
**Problem**: Legal pages have extensive HTML formatting
**Solution**: Store HTML as strings in JSON, use `| safe` filter in templates
**Example**:
```json
{
  "content": "<p>Recopilamos <strong>información personal</strong> que incluye:<br>- Nombre<br>- Email</p>"
}
```

### Challenge 2: Pagination with Individual Files
**Problem**: Current pagination reads from array, new structure has individual files
**Solution**: Create Eleventy collections that read directory and build array dynamically (see `.eleventy.js` changes above)

### Challenge 3: Data Access in Templates
**Problem**: Templates currently access data via `{{ hero.title }}` (global data cascade)
**Solution**: Two options:
1. **Global data** (recommended): Make all page data globally available via `pages.home.content.hero.title`
2. **Front matter**: Pass data file to each template via front matter `data: pages/home.json`

**Recommendation**: Use global data for consistency. Templates access via:
```nunjucks
<!-- Homepage -->
{{ pages.home.content.hero.title }}

<!-- About page -->
{{ pages.nosotros.content.intro }}
```

### Challenge 4: Keeping Build Fast
**Problem**: Reading many individual JSON files could slow builds
**Solution**:
- Use Eleventy's caching (already built-in)
- Only read files once in `.eleventy.js` and cache in collections
- Total files: ~20 JSON files (not performance issue for 11ty)

### Challenge 5: Customer Editing Nested JSON
**Problem**: Nested JSON structure might be confusing for non-technical users
**Solution**:
- Provide clear documentation with examples
- Use consistent structure across all pages
- Consider future CMS integration (Netlify CMS, Decap CMS)

---

## Customer Editing Guide (To Create)

After migration, create `docs/CUSTOMER_EDITING_GUIDE.md` with:

1. **Introduction**: How to find and edit content
2. **File structure overview**: What each JSON file controls
3. **Common tasks**:
   - Edit homepage hero text → `src/data/pages/home.json`
   - Update program pricing → `src/data/pages/programs/adultos.json`
   - Add new blog post → Create new file in `src/data/pages/blog/`
   - Edit footer links → `src/data/footer.json`
4. **JSON syntax basics**:
   - Use double quotes for strings
   - Escape special characters
   - HTML allowed in content fields (with examples)
5. **Testing changes locally**: `npm run dev`
6. **Deploying changes**: Git commit and push

---

## Testing Checklist

After each phase, verify:

- [ ] All pages build without errors (`npm run build`)
- [ ] All text displays correctly (no missing content)
- [ ] HTML formatting preserved (bold, line breaks, links)
- [ ] No hardcoded Spanish text remains in templates (grep for common words)
- [ ] Visual regression tests pass (`npm run test:visual`)
- [ ] SEO meta tags still populate correctly
- [ ] Pagination works (programs, blog)
- [ ] All links work
- [ ] Mobile responsive layout unchanged

---

## Rollback Plan

If issues arise during migration:

1. **Per-page rollback**: Each page migrated in separate commit
   - Revert specific commit: `git revert <commit-hash>`
2. **Phase rollback**: Each phase is separate PR/branch
   - Abandon branch if needed
3. **Full rollback**: Keep backup of `src/templates/` and `src/data/` before starting
   - Copy backup back if catastrophic failure

---

## Estimated Timeline

- **Phase 1 (Setup)**: 30 min
- **Phase 2 (Simple pages)**: 1-2 hours
- **Phase 3 (Complex pages)**: 2-3 hours
- **Phase 4 (Shared components)**: 1 hour
- **Phase 5 (Pagination)**: 2-3 hours
- **Phase 6 (Cleanup)**: 30 min
- **Testing & Documentation**: 1-2 hours

**Total**: 8-12 hours of focused work

---

## Success Criteria

✅ **Complete** when:
1. Every page has exactly ONE corresponding JSON file
2. ZERO hardcoded Spanish text in templates (except HTML structure)
3. Customer can edit all visible content by editing JSON files
4. All visual regression tests pass
5. Site builds and deploys successfully
6. Customer editing guide is complete

---

## Future Enhancements (Out of Scope)

- **CMS Integration**: Add Netlify CMS or Decap CMS for GUI editing
- **Internationalization**: Add locale system for multi-language support
- **Content Validation**: JSON schema validation to catch errors before build
- **Dynamic Data**: Move forms, testimonials to external API/database
