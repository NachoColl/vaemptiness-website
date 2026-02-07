# Empresas Landing Page - Final Correction Plan

## Investigation Complete

Used Playwright to load and extract the fully rendered React SPA:
- ✅ Captured complete HTML structure
- ✅ Extracted computed styles
- ✅ Identified all missing components
- ✅ Screenshot saved for reference

**Files:** See `EMPRESAS_MISSING_COMPONENTS_ANALYSIS.md` for detailed findings.

---

## Critical Issues Found

### 1. Hero Section - Major Structural Issues
- ❌ Missing logo graphic (circle with "va")
- ❌ Missing floating decorative circle
- ❌ Missing badge with animated pulse dot
- ❌ Missing scroll indicator
- ❌ Wrong layout (not full-screen centered)
- ❌ Wrong heading structure

### 2. Stats Section - Wrong Design
- ❌ Has card backgrounds (should be simple text)
- ❌ Wrong font sizes
- ❌ Wrong container width

### 3. CSS - Missing Classes
- ❌ Animation delay utilities (animation-delay-100 through 500)
- ❌ Scale transform utilities
- ❌ Pulse animation
- ❌ Fade-in animation

### 4. Buttons - Missing Effects
- ❌ Scale transforms on hover/active
- ❌ Wrong shadow combinations
- ❌ Wrong heights

---

## Implementation Plan

### PHASE 1: Add Missing CSS Classes

**File:** `src/assets/css/empresas-landing.css`

#### 1.1 Add Animation Delays

```css
/* Animation Delays for Stagger Effects */
.animation-delay-100 {
  animation-delay: 100ms;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

.animation-delay-300 {
  animation-delay: 300ms;
}

.animation-delay-400 {
  animation-delay: 400ms;
}

.animation-delay-500 {
  animation-delay: 500ms;
}
```

#### 1.2 Add Missing Animations

```css
/* Fade In Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

/* Pulse Animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

#### 1.3 Add Scale Transform Utilities

```css
/* Hover Scale Effects */
.hover\:scale-\[1\.01\]:hover {
  transform: scale(1.01);
}

.hover\:scale-\[1\.02\]:hover {
  transform: scale(1.02);
}

.active\:scale-\[0\.98\]:active {
  transform: scale(0.98);
}

.active\:scale-\[0\.99\]:active {
  transform: scale(0.99);
}
```

#### 1.4 Add Backdrop Blur Variant

```css
/* Backdrop Blur Utilities */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
}
```

#### 1.5 Add Button Size Utility

```css
/* Button Heights */
.h-14 {
  height: 3.5rem; /* 56px */
}
```

---

### PHASE 2: Update Hero Section Template

**File:** `src/templates/empresas.njk`

#### 2.1 Replace Hero Section Completely

**CURRENT (Wrong):**
```html
<section class="pt-32 pb-24 px-6 gradient-hero">
  <div class="container mx-auto max-w-6xl text-center">
    <!-- Wrong structure -->
  </div>
</section>
```

**NEW (Correct):**
```html
<section class="min-h-screen gradient-hero flex flex-col items-center justify-center relative px-6 pt-20">
  {# Floating decorative circle #}
  <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full border border-primary/10 animate-float opacity-50"></div>

  {# Main content #}
  <div class="max-w-4xl mx-auto text-center z-10">

    {# Badge with pulse dot #}
    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border mb-8 animate-fade-up">
      <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
      <span class="text-sm font-body text-muted-foreground">{{ data.hero.eyebrow }}</span>
    </div>

    {# Logo graphic + Title #}
    <div class="mb-6 animate-fade-up animation-delay-100">
      <div class="w-24 h-24 mx-auto mb-6 rounded-full border-2 border-primary/20 flex items-center justify-center">
        <span class="font-display text-3xl font-light text-foreground">va</span>
      </div>
      <h1 class="font-display text-5xl md:text-7xl font-light tracking-tight mb-2">
        <span class="font-bold">va</span>emptîness
      </h1>
      <p class="font-display text-xl text-primary/80 italic">mental training</p>
    </div>

    {# Subtitle #}
    <h2 class="font-display text-3xl md:text-5xl font-light text-foreground mb-6 animate-fade-up animation-delay-200">
      {{ data.hero.headline }}<br>
      <span class="text-primary">{{ data.hero.headlineEmphasis }}</span>
    </h2>

    {# Description #}
    <p class="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up animation-delay-300">
      {{ data.hero.subheadline }}
    </p>

    {# CTAs #}
    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up animation-delay-400">
      <a href="{{ data.hero.ctaPrimary.href }}" class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-body gradient-cta text-primary-foreground shadow-elevated hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] h-14 rounded-lg px-10 text-lg">
        {{ data.hero.ctaPrimary.text }}
      </a>
      <a href="{{ data.hero.ctaSecondary.href }}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-body border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground h-14 rounded-lg px-10 text-lg">
        {{ data.hero.ctaSecondary.text }}
      </a>
    </div>

    {# Stats - Simple text, no cards #}
    <div class="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto animate-fade-up animation-delay-500">
      {% for stat in data.hero.stats %}
      <div class="text-center">
        <p class="font-display text-4xl font-semibold text-primary">{{ stat.value }}</p>
        <p class="font-body text-sm text-muted-foreground mt-1">{{ stat.label }}</p>
      </div>
      {% endfor %}
    </div>
  </div>

  {# Scroll indicator #}
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground animate-fade-in animation-delay-500">
    <span class="text-sm font-body">Descubre más</span>
    {{ icons.icon("arrow-down", "w-4 h-4 animate-bounce") }}
  </div>
</section>
```

---

### PHASE 3: Update Header Template

**File:** `src/templates/empresas.njk`

#### 3.1 Update Header Classes

**CHANGE:**
```html
<header class="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
```

**TO:**
```html
<header class="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
```

#### 3.2 Update Logo Circle Border

**CHANGE:**
```html
<div class="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center">
```

**TO:**
```html
<div class="w-10 h-10 rounded-full border-2 border-primary/30 flex items-center justify-center">
```

#### 3.3 Update Header CTA Button

**CHANGE:**
```html
<a href="#contacto" class="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors">
```

**TO:**
```html
<a href="#contacto" class="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-body gradient-cta text-primary-foreground shadow-soft hover:shadow-elevated hover:scale-[1.01] active:scale-[0.99] h-9 rounded-md px-3">
```

---

### PHASE 4: Add Missing Utility Classes to Inline Styles

**File:** `src/templates/empresas.njk`

#### 4.1 Add to Inline `<style>` Block

```css
/* Position utilities */
.top-1\/4 { top: 25%; }
.left-1\/2 { left: 50%; }
.bottom-8 { bottom: 2rem; }
.-translate-x-1\/2 { transform: translateX(-50%); }

/* Size utilities */
.w-2 { width: 0.5rem; }
.h-2 { height: 0.5rem; }
.w-24 { width: 6rem; }
.h-24 { height: 6rem; }
.w-64 { width: 16rem; }
.h-64 { height: 16rem; }
.min-h-screen { min-height: 100vh; }

/* Opacity utilities */
.opacity-50 { opacity: 0.5; }

/* Transform utilities */
.tracking-tight { letter-spacing: -0.025em; }
.translate-x-1\/2 { transform: translateX(50%); }

/* Text alignment */
.italic { font-style: italic; }

/* Color opacity utilities */
.border-primary\/10 { border-color: hsl(var(--primary) / 0.1); }
.border-primary\/20 { border-color: hsl(var(--primary) / 0.2); }
.border-primary\/30 { border-color: hsl(var(--primary) / 0.3); }
.border-border\/50 { border-color: hsl(var(--border) / 0.5); }
.bg-secondary\/50 { background-color: hsl(var(--secondary) / 0.5); }
.text-primary\/80 { color: hsl(var(--primary) / 0.8); }

/* Text size */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
```

---

### PHASE 5: Update Buttons Throughout Template

**Find all button instances and update to match the pattern:**

```html
<!-- Primary CTA buttons -->
<a class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-body gradient-cta text-primary-foreground shadow-elevated hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] h-14 rounded-lg px-10 text-lg">

<!-- Secondary/outline buttons -->
<a class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-body border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground h-14 rounded-lg px-10 text-lg">
```

---

## Testing Checklist

### Visual Verification

- [ ] Hero section is full-screen height
- [ ] Logo graphic appears (circle with "va")
- [ ] Floating decorative circle visible and animating
- [ ] Badge has animated pulse dot
- [ ] Scroll indicator at bottom with bouncing arrow
- [ ] Stats are simple text (no card backgrounds)
- [ ] Buttons have scale effects on hover
- [ ] Stagger animations work (elements appear in sequence)
- [ ] All colors match (rust/bronze theme)
- [ ] Gradients display correctly

### Layout Verification

- [ ] Hero content max-width: 1024px (max-w-4xl)
- [ ] Stats container max-width: 576px (max-w-xl)
- [ ] Section spacing consistent (py-24 px-6)
- [ ] Header backdrop blur effect visible
- [ ] Buttons height 56px (h-14) for primary CTAs

### Animation Verification

- [ ] Hero elements fade up with stagger delays
- [ ] Pulse dot animates continuously
- [ ] Floating circle has float animation
- [ ] Scroll arrow bounces
- [ ] Buttons scale on hover/active
- [ ] Smooth transitions (duration-300)

### Responsive Verification

- [ ] Hero layouts correctly on mobile
- [ ] Stats stay in 3 columns (even on mobile)
- [ ] Text sizes scale properly (md: breakpoints)
- [ ] Buttons stack on mobile

---

## Implementation Order

1. ✅ Update CSS file (add missing classes)
2. ✅ Update hero section template
3. ✅ Update header template
4. ✅ Update button instances
5. ✅ Add inline utility classes
6. ✅ Rebuild and test
7. ✅ Visual comparison with original
8. ✅ Iterate if needed

---

## Time Estimate

- CSS updates: 30 minutes
- Hero template: 45 minutes
- Header template: 15 minutes
- Button updates: 30 minutes
- Inline utilities: 15 minutes
- Testing: 45 minutes
- **Total: ~3 hours**

---

## Success Criteria

✅ **Visual fidelity:** Side-by-side looks identical to original
✅ **Animations:** All effects work smoothly
✅ **Responsive:** Works on all breakpoints
✅ **Performance:** No jank or slow loading
✅ **Accessibility:** All interactive elements keyboard accessible

---

## Reference Files

- Original screenshot: `/tmp/vaemptiness-screenshot.png`
- Rendered HTML: `/tmp/vaemptiness-rendered.html`
- Extracted data: `/tmp/vaemptiness-extracted.json`
- Analysis doc: `docs/EMPRESAS_MISSING_COMPONENTS_ANALYSIS.md`

---

## Next Action

Ready to implement Phase 1 (CSS updates)?
