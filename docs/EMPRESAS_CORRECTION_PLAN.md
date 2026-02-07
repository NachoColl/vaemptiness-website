# Empresas Landing Page - Correction Plan

## Executive Summary

The current implementation has critical styling discrepancies:
- **Primary color:** Using blue/violet instead of rust/bronze `rgb(161, 122, 69)`
- **Fonts:** Using Google Fonts instead of `CameraPlainVariable`

This plan outlines how to extract accurate styles and correct the implementation.

---

## Phase 1: Manual Style Extraction

### Objective
Extract exact computed styles from the original site using browser DevTools.

### Tasks

#### 1.1 Color Extraction

**Process:**
1. Open https://vaemptiness.lovable.app/ in Chrome/Firefox
2. Right-click → Inspect on each element type
3. Go to "Computed" tab
4. Record exact values

**Elements to inspect:**

| Element | Property | Purpose |
|---------|----------|---------|
| "Solicitar Demo" button | `background-color` | Primary action color |
| Headline "para Equipos de Alto Rendimiento" | `color` | Primary accent text |
| Stats cards border | `border-color` | Accent borders |
| Navigation links | `color` (normal + hover) | Link colors |
| Body text | `color` | Main text color |
| Section backgrounds | `background-color` | Layout backgrounds |
| Card backgrounds | `background-color` | Component backgrounds |
| Icons | `color` or `fill` | Icon color |

**Output format:**
```
PRIMARY_COLOR: rgb(161, 122, 69) / #A17A45 / hsl(30, 40%, 45%)
TEXT_PRIMARY: rgb(?, ?, ?) / #?????? / hsl(?, ?, ?)
TEXT_MUTED: rgb(?, ?, ?) / #?????? / hsl(?, ?, ?)
BACKGROUND: rgb(?, ?, ?) / #?????? / hsl(?, ?, ?)
CARD_BG: rgb(?, ?, ?) / #?????? / hsl(?, ?, ?)
BORDER: rgb(?, ?, ?) / #?????? / hsl(?, ?, ?)
```

#### 1.2 Font Extraction

**Process:**
1. Inspect headline text
2. Check "Computed" → `font-family`
3. Check "Computed" → `font-weight`
4. Check "Computed" → `font-size`
5. Check "Computed" → `line-height`
6. Repeat for each text style

**Elements to inspect:**

| Element | Properties | Purpose |
|---------|------------|---------|
| H1 headline | font-family, weight, size, line-height | Main heading style |
| H2 section titles | font-family, weight, size, line-height | Section style |
| H3 subsections | font-family, weight, size, line-height | Subsection style |
| Body text | font-family, weight, size, line-height | Paragraph style |
| Buttons | font-family, weight, size | CTA style |
| Small text (labels) | font-family, weight, size | Label style |

**Output format:**
```
H1: CameraPlainVariable, 700, 4.5rem, 1.1
H2: CameraPlainVariable, 600, 3rem, 1.2
H3: CameraPlainVariable, 600, 1.75rem, 1.3
BODY: CameraPlainVariable, 400, 1rem, 1.5
BUTTON: CameraPlainVariable, 600, 1rem, 1
SMALL: CameraPlainVariable, 400, 0.875rem, 1.4
```

#### 1.3 Spacing Extraction

**Process:**
1. Inspect container elements
2. Check "Computed" → `padding`, `margin`, `gap`
3. Check "Computed" → `max-width`

**Elements to inspect:**

| Element | Properties | Purpose |
|---------|------------|---------|
| `.container` | max-width, padding-x | Layout width |
| Sections | padding-y | Vertical rhythm |
| Cards | padding | Internal spacing |
| Grid/Flex | gap | Element spacing |
| Headings | margin-bottom | Title spacing |

#### 1.4 Shadow & Border Extraction

**Process:**
1. Inspect cards and elevated elements
2. Check "Computed" → `box-shadow`
3. Check "Computed" → `border-radius`

#### 1.5 CSS Custom Properties

**Process:**
1. Inspect `<html>` or `<body>` element
2. Go to "Styles" tab
3. Look for `:root` selector
4. Document all `--variable-name` values

**Expected variables:**
```css
:root {
  --primary: ?;
  --primary-foreground: ?;
  --background: ?;
  --foreground: ?;
  --muted: ?;
  --muted-foreground: ?;
  --border: ?;
  --accent: ?;
  /* ... etc */
}
```

---

## Phase 2: CSS Corrections

### Objective
Update `src/assets/css/empresas-landing.css` with accurate values.

### 2.1 Color Variables Update

**File:** `src/assets/css/empresas-landing.css`

**Current (WRONG):**
```css
:root {
  --primary: 240 67% 61%;  /* Blue/violet */
  --primary-foreground: 210 40% 98%;
  /* ... */
}
```

**Corrected (based on extracted values):**
```css
:root {
  --primary: 30 40% 45%;   /* Rust/bronze rgb(161, 122, 69) */
  --primary-foreground: 0 0% 100%;  /* White text on rust */

  /* Update ALL color variables based on extraction */
  --background: [EXTRACTED_VALUE];
  --foreground: [EXTRACTED_VALUE];
  --card: [EXTRACTED_VALUE];
  --card-foreground: [EXTRACTED_VALUE];
  --secondary: [EXTRACTED_VALUE];
  --secondary-foreground: [EXTRACTED_VALUE];
  --muted: [EXTRACTED_VALUE];
  --muted-foreground: [EXTRACTED_VALUE];
  --accent: [EXTRACTED_VALUE];
  --accent-foreground: [EXTRACTED_VALUE];
  --border: [EXTRACTED_VALUE];
  --input: [EXTRACTED_VALUE];
  --ring: 30 40% 45%;  /* Match primary */
}
```

**Also update:**
- Dark mode variables (if dark mode exists)
- Utility class colors (`.text-green-600` if used)
- Gradient definitions

### 2.2 Font Variables Update

**Current (WRONG):**
```css
:root {
  --font-display: 'Cormorant Garamond', serif;
  --font-body: 'Inter', sans-serif;
}
```

**Corrected:**
```css
:root {
  --font-display: 'CameraPlainVariable', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-body: 'CameraPlainVariable', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

**Verify font loading:**
- Keep `@font-face` declaration for CameraPlainVariable
- Ensure CDN URL is correct and accessible
- Test font fallback on slow connections

### 2.3 Typography Scale Update

**Update font sizes based on extracted values:**

```css
/* Current */
.text-5xl { font-size: 3rem; line-height: 1; }
.text-7xl { font-size: 4.5rem; line-height: 1; }

/* Update to match original (example) */
.text-5xl { font-size: [EXTRACTED_VALUE]; line-height: [EXTRACTED_VALUE]; }
.text-7xl { font-size: [EXTRACTED_VALUE]; line-height: [EXTRACTED_VALUE]; }
```

### 2.4 Spacing Update

**Update spacing variables if needed:**

```css
/* Verify these match the original */
:root {
  --space-xs: 0.5rem;    /* 8px */
  --space-sm: 1rem;      /* 16px */
  --space-md: 1.5rem;    /* 24px */
  --space-lg: 2rem;      /* 32px */
  --space-xl: 3rem;      /* 48px */
  --space-2xl: 4rem;     /* 64px */
  --space-3xl: 6rem;     /* 96px */
}
```

### 2.5 Shadow Definitions Update

**Update shadow utilities based on extracted values:**

```css
.shadow-soft {
  box-shadow: [EXTRACTED_VALUE];
}

.shadow-elevated {
  box-shadow: [EXTRACTED_VALUE];
}
```

---

## Phase 3: Template Adjustments

### Objective
Update Nunjucks template if needed for style classes.

### 3.1 Remove Google Fonts

**File:** `src/templates/empresas.njk`

**Remove:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

**Keep:**
```html
<!-- CameraPlainVariable is already loaded via CSS @font-face -->
```

### 3.2 Verify Gradient Classes

**Check if gradients need updating:**

```css
/* Current */
.gradient-hero {
  background: linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--secondary)) 100%);
}

/* Update if original uses different gradients */
.gradient-hero {
  background: [EXTRACTED_GRADIENT];
}
```

---

## Phase 4: Testing & Verification

### Objective
Ensure the corrected implementation matches the original.

### 4.1 Visual Comparison

**Method:** Side-by-side browser windows

1. Open original: https://vaemptiness.lovable.app/
2. Open local: http://localhost:8080/empresas/
3. Compare section by section:
   - [ ] Header/navigation
   - [ ] Hero section
   - [ ] Challenge cards (#beneficios)
   - [ ] Solution section
   - [ ] Program timeline (#programa)
   - [ ] Testimonials (#testimonios)
   - [ ] Metrics section
   - [ ] Contact form (#contacto)
   - [ ] Footer

**Check:**
- ✓ Colors match exactly
- ✓ Fonts render identically
- ✓ Spacing is consistent
- ✓ Shadows and borders match
- ✓ Hover states identical

### 4.2 Screenshot Diff Testing

**Tools:**
- Browser screenshot
- Image diff tool (ImageMagick, PixelMatch)

**Process:**
1. Take full-page screenshot of original
2. Take full-page screenshot of local
3. Use diff tool to highlight differences
4. Iterate until no visual differences

### 4.3 Color Verification

**Method:** Browser color picker extension

1. Install ColorZilla or similar
2. Sample colors from both sites
3. Verify RGB values match exactly
4. Document any remaining discrepancies

### 4.4 Font Verification

**Method:** WhatFont extension + DevTools

1. Verify CameraPlainVariable loads and renders
2. Check font weights at all usage points
3. Verify no fallback to system fonts
4. Test font loading on slow connection

### 4.5 Responsive Testing

**Breakpoints to test:**
- 375px (Mobile - iPhone SE)
- 768px (Tablet - iPad)
- 1024px (Desktop - Small)
- 1920px (Desktop - Large)

**Verify:**
- Layout adapts identically
- Font sizes scale correctly
- Spacing adjusts appropriately
- No layout breaks or overflows

### 4.6 Cross-browser Testing

**Browsers:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Check:**
- Font rendering consistent
- Colors display correctly
- Layout identical
- Animations smooth

---

## Phase 5: Documentation Update

### Objective
Document the accurate design system for future reference.

### 5.1 Create Design System Reference

**File:** `docs/empresas-design-system.md`

**Contents:**
```markdown
# Empresas Landing Page Design System

## Colors
- Primary: rgb(161, 122, 69) / #A17A45
- [All other colors with values]

## Typography
- Font: CameraPlainVariable (variable font)
- H1: 700 weight, 4.5rem, 1.1 line-height
- [All other styles]

## Spacing
- [All spacing values]

## Shadows
- [All shadow definitions]

## Components
- [Reusable component styles]
```

### 5.2 Update Main Documentation

**Files to update:**
- `docs/empresas-landing-page.md` - Add design system section
- `EMPRESAS_IMPLEMENTATION_SUMMARY.md` - Note corrections made
- `CLAUDE.md` - Add note about accurate color extraction if relevant

---

## Implementation Checklist

### Phase 1: Extraction ✓ ❌ ⏳
- [ ] Extract all colors (RGB/HEX/HSL)
- [ ] Extract all font properties
- [ ] Extract all spacing values
- [ ] Extract shadow definitions
- [ ] Extract CSS custom properties
- [ ] Document findings in spreadsheet/doc

### Phase 2: CSS Corrections ✓ ❌ ⏳
- [ ] Update `:root` color variables
- [ ] Update font variables
- [ ] Remove Google Fonts references
- [ ] Update typography scale
- [ ] Update spacing if needed
- [ ] Update shadow definitions
- [ ] Update gradient definitions
- [ ] Verify all utility classes

### Phase 3: Template Updates ✓ ❌ ⏳
- [ ] Remove Google Fonts `<link>` tags
- [ ] Verify font loading
- [ ] Test font fallbacks
- [ ] Update any hardcoded colors
- [ ] Rebuild site (`npm run build`)

### Phase 4: Testing ✓ ❌ ⏳
- [ ] Visual side-by-side comparison
- [ ] Screenshot diff testing
- [ ] Color picker verification
- [ ] Font rendering verification
- [ ] Responsive testing (4 breakpoints)
- [ ] Cross-browser testing (4 browsers)
- [ ] Hover/focus state testing
- [ ] Animation/transition testing

### Phase 5: Documentation ✓ ❌ ⏳
- [ ] Create design system reference
- [ ] Update main documentation
- [ ] Add color palette visual
- [ ] Add typography examples
- [ ] Update CLAUDE.md if needed

---

## Expected Outcomes

After completing this plan:

✅ **Accurate colors:**
- Primary rust/bronze color used throughout
- All accent colors match original
- Background colors match original
- Text colors match original

✅ **Accurate fonts:**
- CameraPlainVariable loads and renders correctly
- Correct font weights at all points
- No unintended fallback to system fonts
- Typography scale matches original

✅ **Visual fidelity:**
- Side-by-side comparison shows no differences
- Screenshot diff shows <5% pixel difference
- All spacing and layout identical
- All interactive states match

✅ **Documentation:**
- Complete design system documented
- Future updates easier with reference
- Team knows exact style values

---

## Timeline Estimate

| Phase | Duration | Dependencies |
|-------|----------|-------------|
| Phase 1: Extraction | 2-3 hours | Browser DevTools access |
| Phase 2: CSS Corrections | 1-2 hours | Phase 1 complete |
| Phase 3: Template Updates | 30 minutes | Phase 2 complete |
| Phase 4: Testing | 2-3 hours | Phase 3 complete |
| Phase 5: Documentation | 1 hour | Phase 4 complete |
| **TOTAL** | **6-9 hours** | Manual inspection required |

---

## Risk Mitigation

### Risk: Font doesn't render correctly
**Mitigation:**
- Verify CDN accessibility
- Test on multiple devices/browsers
- Have fallback font strategy
- Consider self-hosting if CDN unreliable

### Risk: Colors look different on different screens
**Mitigation:**
- Use color calibration tool
- Test on multiple displays
- Use color profiles (sRGB)
- Document known device variations

### Risk: Spacing slightly off
**Mitigation:**
- Use browser DevTools ruler
- Measure exact pixel values
- Account for browser default styles
- Test with zoom levels

### Risk: Dynamic content changes colors
**Mitigation:**
- Check for hover/focus states
- Test all interactive elements
- Verify color transitions
- Document state-dependent colors

---

## Next Steps

**IMMEDIATE ACTION REQUIRED:**

User must perform Phase 1 (Manual Style Extraction) by:
1. Opening https://vaemptiness.lovable.app/ in browser
2. Using DevTools to inspect and document all computed styles
3. Providing extracted values for implementation

**Once extraction complete:**
Developer will proceed with Phases 2-5 to correct implementation.

---

## Questions?

If unclear during extraction:
- Take screenshots with DevTools open showing computed values
- Use browser's "Copy styles" feature
- Document any ambiguities or variations
- Ask for clarification on specific elements
