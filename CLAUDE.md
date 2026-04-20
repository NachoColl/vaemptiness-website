# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Website for **vaemptîness** (mental training / mindfulness, author Rosa Cano) — Eleventy (11ty) + Nunjucks, Spanish-language, deployed to GitHub Pages with a custom domain (`vaemptiness.com`, `CNAME` file is passed through on build).

## Commands

```bash
# Development
npm run dev                      # Eleventy --serve on localhost:8080

# Build
npm run build                    # Build site to _site/
npm run preview                  # Build then serve _site/ via http-server

# Visual regression (Playwright)
npm run build && npm run test:visual    # Tests require a built _site/
npm run test:visual:update              # Refresh snapshots

# Google Drive content sync (see docs/DRIVE_SYNC_SETUP.md)
npm run drive:authorize | drive:init | drive:sync | drive:upload | drive:status

# Git worktrees (parallel feature dev — see docs/worktrees/WORKTREES.md)
npm run worktree:create <branch>  | worktree:list | worktree:merge <branch> | worktree:remove <branch>
```

Run a single Playwright spec: `npx playwright test tests/visual/<file>.spec.ts`.

## Architecture

### Eleventy layout
- Input: `src/templates/` (Nunjucks `.njk` — one file per page, plus `programa.njk` / `blog-post.njk` used by pagination).
- Includes: `src/templates/_includes/` — `base.njk`, `header.njk`, `footer.njk`, plus `-en`/`-fr` variants and `schemas/` for JSON-LD.
- Data: `src/data/` — `site.json`, `navigation.json`, and `pages.js` (a loader, see below).
- Assets: `src/assets/{css,js,images}` passed through to `_site/assets`.
- Config: `.eleventy.js`. `pathPrefix` comes from `ELEVENTY_PATH_PREFIX` (set by GitHub Actions; empty for the custom domain).

### Page data loader (`src/data/pages.js`)
Rather than Eleventy's default filename-based data cascade, page content lives in `src/data/pages/*.json` and is loaded into a single `pages` global. Templates then pick their slice via an `11tydata.js` sibling file, e.g.:
```js
// src/templates/index.11tydata.js
module.exports = {
  eleventyComputed: {
    seo: (data) => data.pages.home.meta.seo,
    bodyClass: (data) => data.pages.home.meta.bodyClass
  }
};
```
When adding a page, create **both** the `.njk` template and its matching `pages/<slug>.json`, and usually an `.11tydata.js` for SEO/body class wiring.

### Dynamic collections
`.eleventy.js` exposes two collections built from per-item JSON files:
- `programsFromFiles` — reads `src/data/pages/programs/*.json`, sorted by `order`, renders via `programa.njk`.
- `blogFromFiles` — reads `src/data/pages/blog/*.json`, sorted by `date` desc, renders via `blog-post.njk`.

To add a program or blog post, drop a JSON file into the right folder — no template changes required.

### Auto-bold transform
`.eleventy.js` registers an `autoBoldVaemptiness` HTML transform that wraps every text occurrence of `vaemptîness` / `vaemptiness` in `<strong>`, while preserving `<script>`, `<style>`, `<code>`, `<pre>`, `<title>`, headings (`h1`–`h6`), and already-bold instances. **Do not manually bold the brand name in templates or JSON content** — it will be double-wrapped or need undoing. If you see odd bolding inside attributes or headings, check this transform first.

### Visual testing
Playwright config (`playwright.config.ts`) auto-starts `http-server _site -p 8080` and runs Desktop Chrome (1920×1080) + Mobile Chrome (Pixel 5) projects. Snapshots live in `tests/visual/snapshots/`. Always `npm run build` first.

### Deployment
Pushes to `master` trigger `.github/workflows/deploy.yml` which builds and deploys to GitHub Pages. `ELEVENTY_PATH_PREFIX` is set there when needed for subdirectory deployment.

## CSS Typography System

**CRITICAL: Do NOT create new CSS styles or classes unless explicitly requested.**

This project uses a unified typography system with standardized CSS variables and classes. Always use existing styles:

### CSS Variables (defined in `src/assets/css/main.css`)
```css
/* Typography */
--text-hero: clamp(2.5rem, 6vw, 4.5rem);      /* Display text */
--text-h1: clamp(2rem, 4vw, 3.5rem);          /* Page titles */
--text-h2: clamp(1.5rem, 3vw, 2.5rem);        /* Section titles */
--text-h3: clamp(1.25rem, 2vw, 1.75rem);      /* Subsections */
--text-h4: clamp(1rem, 1.5vw, 1.125rem);      /* Minor headings */
--text-body-lg: clamp(1.125rem, 1.5vw, 1.25rem); /* Large body */
--text-body: 1rem;                             /* Regular body */
--text-small: 0.875rem;                        /* Small text */
```

### Unified Quote Classes
- `.quote-emphasis` - Key messages (H1 size, italic, rust)
- `.quote-large` - Main quotes (H2 size, italic, rust)
- `.quote-medium` - Smaller quotes (H3 size, italic, rust)

### Standard Classes
- `.page-title` - Page H1 titles
- `.section-title` - Section H2 headings
- `.card-title` - All card titles (unified)
- `.page-subtitle` - Page subtitles

**When adding text elements:**
1. Use existing CSS variables and classes
2. Do NOT create new font-size declarations
3. Do NOT create new quote/text variations
4. If unsure, ask the user which existing class to use
5. Only create new styles if explicitly requested to extend the system

### Mobile Responsive Typography

**CRITICAL: Do NOT add mobile font-size overrides. Trust the clamp() values.**

All typography CSS variables use `clamp()` for built-in responsive scaling:
- Variables automatically scale from minimum (mobile) to maximum (desktop)
- Example: `--text-h1: clamp(2rem, 4vw, 3.5rem)` = 32px on mobile → 56px on desktop
- This provides excellent readability across all screen sizes

**Rules:**
1. **Never** add `@media (max-width: 768px)` font-size overrides for typography classes
2. Let clamp() handle all responsive font scaling naturally
3. Mobile overrides fight against the built-in responsive system
4. Exception: Only add mobile overrides if explicitly requested with clear justification

**Why this matters:**
- Mobile overrides can make text too small (e.g., forcing H1 to H3 size)
- Creates hierarchy inversions (smaller headings appearing larger than big headings)
- Adds unnecessary complexity and maintenance burden
- The clamp() system already provides optimal scaling

## Spacing System

**CRITICAL: Use standardized spacing variables. Do NOT create custom padding/margin values.**

### Spacing Variables
```css
--space-xs: 0.5rem;    /* 8px */
--space-sm: 1rem;      /* 16px */
--space-md: 1.5rem;    /* 24px */
--space-lg: 2rem;      /* 32px */
--space-xl: 3rem;      /* 48px */
--space-2xl: 4rem;     /* 64px */
--space-3xl: 6rem;     /* 96px */
```

### Colored-Background Sections

**Standard padding for full-width colored sections** (cream background):
- **Desktop**: `padding: var(--space-3xl) 0;` (96px top/bottom)
- **Mobile**: `padding: var(--space-2xl) 0;` (64px top/bottom)

**Sections using this standard:**
- `.philosophy-section`
- `.learning-intro-section`
- `.cta-section`
- `.program-session`
- `.about-services`
- `.about-brand-philosophy`

**Special cases** (justified asymmetric padding):
- `.program-hero` - Extra top padding for hero treatment
- `.site-footer` - Heavier top, lighter bottom

### Card Padding (3-tier system)

**Large cards** (substantial content):
- Padding: `var(--space-2xl)` (64px)
- Examples: `.pathway-card`, `.vision-highlight-card`

**Medium cards** (standard):
- Padding: `var(--space-xl)` (48px)
- Examples: `.pillar-card`, `.service-grid-item`

**Small cards** (compact grid items):
- Padding: `var(--space-lg)` (32px)
- Examples: `.outcome-item`, `.service-item`

**When adding colored-background sections:**
1. Use `var(--space-3xl) 0` for desktop padding
2. Ensure mobile override exists with `var(--space-2xl) 0`
3. Use cream background: `var(--color-accent-cream)`
4. Only deviate for justified special cases (hero, footer)
5. Do NOT create custom padding values

## Note on `CLAUDE_INSTRUCTIONS.md`

This file is **only generated inside worktrees** by `npm run worktree:create`. If you are working inside `.trees/<branch>/`, read it for feature-specific context and the git workflow. It does not exist at the repository root.
