# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a portfolio website for Mateo Coll, a film editor. It's built with Eleventy (11ty) using Nunjucks templates, deployed to GitHub Pages.

## Commands

```bash
# Development
npm run dev          # Start dev server on localhost:8080

# Build
npm run build        # Build site to _site/

# Visual regression testing
npm run build                    # Build first (tests require built site)
npm run test:visual              # Run Playwright visual tests
npm run test:visual:update       # Update snapshots
```

## Architecture

### Eleventy Structure
- **Templates**: `src/templates/` - Nunjucks templates (`.njk`)
- **Includes**: `src/templates/_includes/` - `base.njk`, `header.njk`, `footer.njk`
- **Data**: `src/data/` - JSON data files (`site.json`, `projects.json`, etc.)
- **Assets**: `src/assets/` - CSS, JS, images (copied to `_site/assets/`)
- **Output**: `_site/` - Built site

### Data Flow
Templates access data via Eleventy's data cascade. For example, `{{ site.title }}` pulls from `src/data/site.json`.

### Visual Testing
Playwright tests in `tests/visual/` capture screenshots of key pages and compare against reference snapshots in `tests/visual/snapshots/`.

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

## Deployment

Pushes to `master` trigger GitHub Actions (`.github/workflows/deploy.yml`) which builds and deploys to GitHub Pages. The `ELEVENTY_PATH_PREFIX` env var is set for the subdirectory deployment.

## Git Worktrees

For parallel feature development, use worktree scripts:

```bash
npm run worktree:create <branch-name>   # Create worktree in .trees/<branch-name>/
npm run worktree:list                   # Show all worktrees
npm run worktree:merge <branch-name>    # Merge worktree into current branch
npm run worktree:remove <branch-name>   # Clean up worktree
```

See `docs/worktrees/WORKTREES.md` for detailed workflow documentation.


⚠️ **IMPORTANT**: Read `CLAUDE_INSTRUCTIONS.md` for context before making changes in this repository.
