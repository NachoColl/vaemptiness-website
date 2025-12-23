# Page Corruption Investigation Report

**Date:** 2025-12-21
**Commits Investigated:** f9e230f, e90b33e, 2161ede
**Status:** Issues identified, fix plan prepared

---

## Executive Summary

Investigation of reported page corruption across the vaemptiness website revealed **two distinct issues**:

1. **Missing team member images** on `/sobre-nosotros/` page (3 of 4 images missing)
2. **Structural corruption in all program pages** - philosophy quote incorrectly nested inside session structure section

The blog page `/blog/filosofia-budista-vaemptiness/` appears structurally sound; any visual issues there are likely CSS-related rather than content corruption.

---

## Issue #1: Missing Team Member Images (sobre-nosotros page)

### Impact
**Page:** `/sobre-nosotros/`
**Severity:** HIGH - Broken images visible to users
**Section:** "¿Quién está detrás?" (team section)

### Root Cause
The page references 4 team member images, but only 1 exists in the repository:
- ✅ `rosa-cano.jpg` - EXISTS
- ❌ `maria-saiz.jpg` - MISSING
- ❌ `lola-saavedra.jpg` - MISSING
- ❌ `rosa-rodriguez.jpg` - MISSING

### Technical Details

**Template:** `src/templates/sobre-nosotros.njk` (lines 67-97)
**Data File:** `src/data/team.json`
**Image Directory:** `src/assets/images/team/`

**Data structure in team.json:**
```json
{
  "members": [
    {
      "name": "Rosa Cano",
      "role": "Fundadora y Directora",
      "image": "/assets/images/team/rosa-cano.jpg",
      "bio": "..."
    },
    {
      "name": "María Saiz",
      "role": "Psicóloga Clínica",
      "image": "/assets/images/team/maria-saiz.jpg",  // BROKEN
      "bio": "..."
    },
    {
      "name": "Lola Saavedra",
      "role": "Instructora Teen",
      "image": "/assets/images/team/lola-saavedra.jpg",  // BROKEN
      "bio": "..."
    },
    {
      "name": "Rosa Rodríguez",
      "role": "Instructora Kids",
      "image": "/assets/images/team/rosa-rodriguez.jpg",  // BROKEN
      "bio": "..."
    }
  ]
}
```

### Historical Analysis
- **Commit 2161ede** (initial): Images never existed in repository
- **Commit f9e230f** (domain update): No team images were deleted (they were never there)
- The data file was created with references to non-existent images from the start

### User Impact
The sobre-nosotros page displays 3 broken image placeholders in the team section, severely degrading the professional appearance of the page.

---

## Issue #2: Program Pages Structural Corruption

### Impact
**Pages:**
- `/vaemptiness-program/`
- `/vaemptiness-equipos/`
- `/vaemptiness-teen/`
- `/vaemptiness-kids/`

**Severity:** MEDIUM - Content visible but incorrectly positioned
**Section:** "Estructura de Sesiones" displays philosophy quote in wrong location

### Root Cause
The philosophy quote is **incorrectly nested inside the session structure section** as a grid column instead of being in its own dedicated section.

### Technical Details

**Template:** `src/templates/programa.njk` (lines 43-64)
**Data File:** `src/data/programs.json`
**CSS:** `src/assets/css/main.css` (lines 1660-1709)

**Current incorrect structure (programa.njk lines 43-64):**
```nunjucks
{% if program.sessionStructure %}
<section class="program-session">
  <div class="container">
    <h2>{{ program.sessionStructure.title }}</h2>
    <div class="session-grid">
      <!-- LEFT COLUMN: Session details (correct) -->
      <div class="session-details">
        <p class="session-duration"><strong>Duración:</strong> {{ program.sessionStructure.duration }}</p>
        <ul class="session-activities">
          {% for activity in program.sessionStructure.activities %}
          <li>{{ activity }}</li>
          {% endfor %}
        </ul>
      </div>
      <!-- RIGHT COLUMN: Philosophy quote (WRONG - should be separate section) -->
      {% if program.philosophy %}
      <div class="session-philosophy">
        <p class="quote-medium">{{ program.philosophy }}</p>
      </div>
      {% endif %}
    </div>
  </div>
</section>
{% endif %}
```

**CSS grid layout creating the problem (main.css lines 1660-1665):**
```css
.session-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* 2 columns: activities | quote */
  gap: var(--space-2xl);
  align-items: start;
}
```

### Affected Programs

| Program | Philosophy Quote Text | Status |
|---------|----------------------|--------|
| vaemptiness-program | "La rumiación no resuelve problemas..." | CORRUPTED |
| vaemptiness-equipos | "Un equipo que piensa con claridad..." | CORRUPTED |
| vaemptiness-teen | "Acompañando a los adolescentes..." | CORRUPTED |
| vaemptiness-kids | "El programa prioriza comprender..." | CORRUPTED |

### Structural Issues

1. **Semantic Problem:** Philosophy quote is page-level content, not session structure content
2. **Layout Problem:** Quote squeezed into grid column instead of full-width section
3. **Visual Hierarchy:** Quote lacks prominence of a dedicated section
4. **Responsive Issue:** On mobile, quote appears below activities (improper flow)
5. **Data-Template Mismatch:** Data has `philosophy` as top-level property, but template treats it as part of session structure

### Expected vs Actual Structure

**EXPECTED:**
```
1. Hero Section
2. Pilares Section
3. Estructura de Sesiones Section (activities only)
4. Philosophy Quote Section (dedicated, full-width)
5. Beneficios Section
6. CTA Section
```

**ACTUAL (CORRUPTED):**
```
1. Hero Section
2. Pilares Section
3. Estructura de Sesiones Section
   └── [2-column grid: activities | philosophy quote ❌]
4. Beneficios Section
5. CTA Section
```

---

## Issue #3: Blog Page (filosofia-budista)

### Status: ✅ NO CORRUPTION DETECTED

**Page:** `/blog/filosofia-budista-vaemptiness/`
**Template:** `src/templates/blog-post.njk` - Structurally sound
**Data:** `src/data/blog.json` - Complete data present
**Image:** `/assets/images/blog/filosofia-budista.jpg` - EXISTS

If this page appears visually corrupted, the issue is likely CSS styling rather than missing content or structural problems. Further investigation would require visual testing.

---

## Fix Plan

### Phase 1: Fix Team Images (sobre-nosotros)

**Option A: Add Missing Images** (RECOMMENDED)
1. Obtain actual photos for the 3 team members
2. Add images to `src/assets/images/team/`:
   - `maria-saiz.jpg`
   - `lola-saavedra.jpg`
   - `rosa-rodriguez.jpg`
3. Commit and deploy

**Option B: Update Data**
1. Edit `src/data/team.json`
2. Remove entries for María Saiz, Lola Saavedra, Rosa Rodríguez
3. Keep only Rosa Cano (existing image)
4. Commit and deploy

**Option C: Add Graceful Fallback** (TEMPORARY)
1. Update `src/templates/sobre-nosotros.njk`
2. Add conditional image rendering with placeholder/default avatar
3. Display team members even without images
4. Commit and deploy

**Recommendation:** Option A is best for professional appearance. If images aren't available immediately, implement Option C as a temporary solution.

---

### Phase 2: Fix Program Pages Structure

**Required Changes:**

#### Change 1: Restructure programa.njk Template

**File:** `src/templates/programa.njk`
**Lines:** 43-64

**Action:** Move philosophy quote outside `program-session` section

**Current structure:**
```nunjucks
{% if program.sessionStructure %}
<section class="program-session">
  ...session content + philosophy quote (WRONG)...
</section>
{% endif %}
```

**New structure:**
```nunjucks
{% if program.sessionStructure %}
<section class="program-session">
  ...session content only (no philosophy)...
</section>
{% endif %}

{% if program.philosophy %}
<section class="program-philosophy-section">
  <div class="container">
    <div class="content-section centered">
      <p class="quote-large">{{ program.philosophy }}</p>
    </div>
  </div>
</section>
{% endif %}
```

#### Change 2: Update CSS Grid

**File:** `src/assets/css/main.css`
**Lines:** 1660-1709

**Action:** Remove 2-column grid, make session details single-column

**Current CSS:**
```css
.session-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* REMOVE THIS */
  gap: var(--space-2xl);
  align-items: start;
}
```

**New CSS:**
```css
.session-grid {
  display: block;  /* Single column for session details only */
}
```

**Remove or repurpose:**
- `.session-philosophy` (lines 1697-1699) - no longer needed

**Add new section styles:**
```css
.program-philosophy-section {
  background: var(--color-background-alt);
  padding: var(--space-3xl) 0;
}

.program-philosophy-section .quote-large {
  max-width: 800px;
  margin: 0 auto;
}
```

#### Change 3: Verify Data Structure

**File:** `src/data/programs.json`
**Action:** Verify `philosophy` remains at top level (no changes needed)

All four programs already have correct data structure:
```json
{
  "id": "program-name",
  "hero": { ... },
  "pillars": [ ... ],
  "sessionStructure": { ... },
  "outcomes": { ... },
  "philosophy": "Quote text here"  // ✅ Correct location
}
```

---

### Phase 3: Visual Testing

**After implementing fixes:**

1. **Build site locally:**
   ```bash
   npm run build
   npm run preview
   ```

2. **Test pages:**
   - `/sobre-nosotros/` - Verify team images display correctly
   - `/vaemptiness-program/` - Verify philosophy quote in separate section
   - `/vaemptiness-equipos/` - Verify philosophy quote in separate section
   - `/vaemptiness-teen/` - Verify philosophy quote in separate section
   - `/vaemptiness-kids/` - Verify philosophy quote in separate section
   - `/blog/filosofia-budista-vaemptiness/` - Verify no regression

3. **Mobile responsive testing:**
   - Test all pages on mobile viewport
   - Verify philosophy sections display properly

4. **Run visual regression tests:**
   ```bash
   npm run test:visual:update  # Update snapshots with correct layout
   npm run test:visual         # Verify changes
   ```

---

### Phase 4: Deployment

1. **Create commit:**
   ```bash
   git add -A
   git commit -m "Fix page corruption: team images and program structure"
   git push origin master
   ```

2. **Monitor deployment:**
   ```bash
   gh run watch
   ```

3. **Verify live site:**
   - Visit https://vaemptiness.es/sobre-nosotros/
   - Visit https://vaemptiness.es/vaemptiness-program/
   - Verify all fixes applied correctly

---

## Files Requiring Changes

### Team Images Fix (Option A)
- **Add:** `src/assets/images/team/maria-saiz.jpg`
- **Add:** `src/assets/images/team/lola-saavedra.jpg`
- **Add:** `src/assets/images/team/rosa-rodriguez.jpg`

### Team Images Fix (Option B)
- **Edit:** `src/data/team.json` (remove 3 members)

### Team Images Fix (Option C)
- **Edit:** `src/templates/sobre-nosotros.njk` (add fallback logic)

### Program Pages Fix (Required)
- **Edit:** `src/templates/programa.njk` (lines 43-64)
- **Edit:** `src/assets/css/main.css` (lines 1660-1709, add new section)

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Breaking other pages | Low | High | Run full visual tests before deploy |
| CSS conflicts | Low | Medium | Review all quote-related styles |
| Mobile layout issues | Medium | Medium | Test responsive breakpoints |
| Missing images after deploy | Low | High | Verify image paths before commit |

---

## Timeline Estimate

- **Phase 1 (Team Images):** 30 minutes (if images available)
- **Phase 2 (Program Structure):** 45 minutes (template + CSS changes)
- **Phase 3 (Testing):** 30 minutes (local testing + visual tests)
- **Phase 4 (Deployment):** 15 minutes (commit + monitor)

**Total:** ~2 hours

---

## Next Steps

1. **Decision Required:** Choose team image fix approach (Option A, B, or C)
2. **Obtain Resources:** If Option A, obtain team member photos
3. **Implementation:** Execute fix plan phases 1-4
4. **Verification:** Confirm fixes on live site

---

**Report prepared by:** Claude Code
**Investigation agents used:** aa6dbe6, a52e777
