# Unused Data Files Cleanup Plan

## Summary

After consolidating all page content into `src/data/pages/`, the following root-level JSON files in `src/data/` are no longer used and can be safely deleted.

## Files to Delete

### 1. `src/data/contact.json` ❌ UNUSED
**Status:** Replaced by `src/data/pages/contacto.json`

**Previous usage:** Contact page data
**Templates:** `contacto.njk` now uses `pages.contacto.content`

**Verification:**
```bash
grep -r "contact\." src/templates/*.njk
# No results (except in pageData references)
```

---

### 2. `src/data/faq.json` ❌ UNUSED
**Status:** Replaced by `src/data/pages/faq.json`

**Previous usage:** FAQ page data
**Templates:** `faq.njk` now uses `pages.faq.content`

**Verification:**
```bash
grep -r "faq\." src/templates/*.njk
# No results (except in pageData references)
```

---

### 3. `src/data/team.json` ❌ UNUSED
**Status:** Merged into `src/data/pages/sobre-nosotros.json`

**Previous usage:** Team information for about page
**Templates:** `sobre-nosotros.njk` now uses `pages["sobre-nosotros"].content.team`

**Verification:**
```bash
grep -r "team\." src/templates/*.njk
# No results (except in pageData references)
```

---

### 4. `src/data/seo.json` ❌ UNUSED
**Status:** Never actually used (defaults in `site.json`)

**Previous usage:** SEO defaults
**Current:** Templates use `site.description`, `site.author`, etc. directly
**Note:** SEO data is now in each page's `meta.seo` object

**Verification:**
```bash
grep -r "seo\[" src/
grep -r "seo\." src/templates/
# No results
```

---

## Files to KEEP ✅

### 1. `src/data/navigation.json` ✅ IN USE
**Used by:** `src/templates/_includes/header.njk`

```njk
{{ navigation.logoAlt }}
{{ navigation.mobileMenuLabel }}
{% for item in navigation.mainMenu %}
```

---

### 2. `src/data/site.json` ✅ IN USE
**Used by:** Multiple templates
- `src/templates/_includes/base.njk` - SEO meta tags
- `src/templates/_includes/footer.njk` - Footer content

```njk
{{ site.url }}
{{ site.description }}
{{ site.author }}
{{ site.footer.sections }}
```

---

### 3. `src/data/pages.js` ✅ IN USE
**Critical:** Data loader for all page JSON files
**Used by:** Eleventy data cascade
**Purpose:** Loads all files from `src/data/pages/` recursively

---

## Deletion Plan

### Step 1: Verify No References
Run comprehensive search to ensure files aren't referenced anywhere:

```bash
# Check templates
grep -r "contact\." src/templates/
grep -r "faq\." src/templates/
grep -r "team\." src/templates/
grep -r "seo\." src/templates/

# Check JavaScript
grep -r "contact\." src/assets/js/
grep -r "faq\." src/assets/js/
grep -r "team\." src/assets/js/

# Check Eleventy config
grep -r "contact\|faq\|team\|seo" .eleventy.js
```

### Step 2: Build Test
Ensure website builds successfully before deletion:

```bash
npm run build
# Should complete without errors
```

### Step 3: Run Tests
Verify all tests pass:

```bash
npx playwright test
# All tests should pass
```

### Step 4: Safe Deletion
Delete unused files:

```bash
rm src/data/contact.json
rm src/data/faq.json
rm src/data/team.json
rm src/data/seo.json
```

### Step 5: Post-Deletion Verification

```bash
# Rebuild
npm run build

# Run all tests
npx playwright test

# Check for any errors
git status
```

### Step 6: Commit

```bash
git add -A
git commit -m "chore: remove unused root-level data files

- Delete contact.json (moved to pages/contacto.json)
- Delete faq.json (moved to pages/faq.json)
- Delete team.json (merged into pages/sobre-nosotros.json)
- Delete seo.json (never used, data in page meta)

All page content now in src/data/pages/ directory
Build and tests verified passing"

git push origin master
```

---

## Risk Assessment

**Risk Level:** LOW ⚠️

**Reasoning:**
1. ✅ All files have been migrated to page JSON structure
2. ✅ Templates updated to use new data sources
3. ✅ No grep results for old references
4. ✅ Build currently passing
5. ✅ All tests passing
6. ✅ Git allows easy rollback if needed

**Rollback Plan:**
If issues arise, revert commit:
```bash
git revert HEAD
git push origin master
```

---

## File Structure After Cleanup

```
src/data/
├── pages.js                    # Data loader ✅
├── navigation.json             # Header navigation ✅
├── site.json                   # Site config & footer ✅
└── pages/                      # All page content ✅
    ├── home.json
    ├── sobre-nosotros.json     # includes team data
    ├── contacto.json           # replaces contact.json
    ├── faq.json                # replaces faq.json
    ├── aprendizaje-y-metodologia.json
    ├── reset.json
    ├── politica-privacidad.json
    ├── terminos-condiciones.json
    ├── programs/
    │   ├── vaemptiness-program.json
    │   ├── vaemptiness-equipos.json
    │   ├── vaemptiness-teen.json
    │   └── vaemptiness-kids.json
    └── blog/
        └── filosofia-budista-vaemptiness.json
```

---

## Testing Checklist

Before deleting files, verify:

- [ ] `npm run build` completes successfully
- [ ] All Playwright tests pass (`npx playwright test`)
- [ ] No grep results for old data references
- [ ] Website renders correctly in browser
- [ ] Contact form still works
- [ ] FAQ page loads
- [ ] About page shows team
- [ ] All navigation links work
- [ ] Footer renders properly

After deleting files, verify:

- [ ] `npm run build` still works
- [ ] All Playwright tests still pass
- [ ] Website still renders correctly
- [ ] No console errors in browser
- [ ] All pages load properly

---

## Notes

- The `pages.js` file is critical - do NOT delete it
- `navigation.json` and `site.json` are shared across all pages - keep them
- All page-specific content is now in `src/data/pages/` with proper structure
- Each page JSON file has `meta` (metadata) and `content` (page content) sections
