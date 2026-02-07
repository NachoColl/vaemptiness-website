# Empresas Landing Page Implementation

## Overview

The corporate landing page (`/empresas/`) is a standalone, self-contained page for the vaemptîness mental training corporate program. It is completely independent from the main site design and uses its own styling system.

**Live URL:** `https://vaemptiness.com/empresas/`

## Architecture

### Design Philosophy
- **Standalone page:** Does not use the main site's header, footer, or base template
- **Dark theme:** Uses its own color palette (different from main site)
- **Complete independence:** All styles are scoped to this page only
- **No layout:** Sets `layout: null` in frontmatter to bypass base.njk

### File Structure

```
src/
├── data/
│   └── pages/
│       └── empresas.json              # All page content and configuration
├── templates/
│   ├── empresas.njk                   # Main template (full HTML document)
│   └── _includes/
│       └── icons-empresas.njk         # SVG icon macros (Lucide icons)
└── assets/
    ├── css/
    │   └── empresas-landing.css       # Standalone CSS (theme system, utilities)
    ├── js/
    │   └── empresas-landing.js        # Vanilla JS (smooth scroll, form handling)
    └── images/
        └── empresas/
            ├── og-image.png           # [TO ADD] Open Graph image for social media
            └── README.md              # Image guidelines
```

## Content Management

All content is stored in `src/data/pages/empresas.json` and is organized into sections:

### Sections
1. **Hero** - Main headline, stats, CTAs
2. **Challenges** - 4 problem cards (mental overload, lack of focus, stress, low collaboration)
3. **Solution** - Feature list with visual element
4. **Program** - Day schedule with 6 time blocks
5. **Testimonials** - 3 testimonial cards with 5-star ratings
6. **Metrics** - 4 ROI/impact statistics
7. **Contact** - Lead capture form with 6 fields
8. **Footer** - Links and copyright

### Editing Content

To update text, modify `src/data/pages/empresas.json`:

```json
{
  "hero": {
    "eyebrow": "Programa Corporativo de 1 Día",
    "headline": "Taller de Entrenamiento Mental",
    "headlineEmphasis": "para Equipos de Alto Rendimiento",
    ...
  }
}
```

**No code changes required** - just edit JSON values and rebuild.

## Styling System

### CSS Variables

The page uses a complete CSS variable system defined in `empresas-landing.css`:

```css
:root {
  /* Colors */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 240 67% 61%;
  --secondary: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  ...

  /* Typography */
  --font-display: 'Cormorant Garamond', serif;
  --font-body: 'Inter', sans-serif;
}
```

### Utility Classes

The template includes Tailwind-style utility classes (inline in `<style>` block):
- Layout: `flex`, `grid`, `container`
- Spacing: `gap-*`, `p-*`, `m-*`
- Typography: `text-*`, `font-*`
- Responsive: `md:*`, `lg:*`

**Important:** Do NOT add Tailwind CSS as a dependency. The utilities are simple static CSS classes.

### Fonts

- **Display font:** Cormorant Garamond (Google Fonts)
- **Body font:** Inter (Google Fonts)
- **Icon font:** CameraPlainVariable (CDN, used in external reference)

## JavaScript Features

`empresas-landing.js` provides:

1. **Smooth scrolling** for anchor links (#beneficios, #programa, etc.)
2. **Scroll animations** using IntersectionObserver API
3. **Form submission handling** with loading states
4. **Form validation** for required fields and email format
5. **Success/error messages** displayed inline

All features use vanilla JavaScript - no framework dependencies.

## Form Configuration

### Current Setup

The form action is configured in `empresas.json`:

```json
"form": {
  "action": "https://formspree.io/f/YOUR_FORM_ID",
  ...
}
```

### Integration Options

**Option 1: Formspree (Recommended)**
1. Create account at https://formspree.io/
2. Create new form
3. Copy form endpoint: `https://formspree.io/f/{form_id}`
4. Update `empresas.json` with your form ID
5. Test submission

**Option 2: Netlify Forms**
1. Add `netlify` attribute to form in template:
   ```html
   <form data-netlify="true" netlify-honeypot="bot-field">
   ```
2. Deploy to Netlify
3. Form submissions appear in Netlify dashboard

**Option 3: Custom Backend**
1. Create API endpoint to receive form data
2. Update form action URL in `empresas.json`
3. Ensure CORS is configured if on different domain

### Form Fields

- **nombre** (text, required) - First name
- **apellido** (text, required) - Last name
- **email** (email, required) - Corporate email
- **empresa** (text, required) - Company name
- **tamanoEquipo** (text, required) - Team size
- **mensaje** (textarea, optional) - Message

## Deployment

### Build Process

```bash
npm run build
```

The page is generated at `_site/empresas/index.html` along with assets in `_site/assets/`.

### What Gets Deployed

- HTML: `_site/empresas/index.html`
- CSS: `_site/assets/css/empresas-landing.css`
- JS: `_site/assets/js/empresas-landing.js`
- Images: `_site/assets/images/empresas/`

### GitHub Pages

Deployment is automatic via GitHub Actions when pushing to `master` branch.

**Action file:** `.github/workflows/deploy.yml`

## SEO & Metadata

### Meta Tags

Configured in `empresas.json`:

```json
"meta": {
  "seo": {
    "title": "vaemptîness - Entrenamiento Mental Corporativo",
    "description": "Taller de 1 día para equipos...",
    "ogImage": "/assets/images/empresas/og-image.png"
  }
}
```

### Social Sharing

- Open Graph tags for Facebook/LinkedIn
- Twitter Card tags for Twitter
- Structured data could be added in future

## Testing

### Local Development

```bash
npm run dev
```

Visit: http://localhost:8080/empresas/

### Visual Regression Tests

**To add (recommended):**

Create `tests/visual/empresas-landing.spec.js`:

```javascript
const { test, expect } = require('@playwright/test');

test('empresas landing page - desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:8080/empresas/');
  await expect(page).toHaveScreenshot('empresas-desktop.png', { fullPage: true });
});

test('empresas landing page - mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:8080/empresas/');
  await expect(page).toHaveScreenshot('empresas-mobile.png', { fullPage: true });
});
```

Run tests:
```bash
npm run build
npm run test:visual
```

### Manual Testing Checklist

- [ ] Hero section displays correctly
- [ ] All 4 challenge cards visible
- [ ] Solution features list renders
- [ ] Program timeline shows 6 sessions
- [ ] 3 testimonials display with star ratings
- [ ] 4 metrics cards show correct colors
- [ ] Contact form submits successfully
- [ ] Footer links work
- [ ] Smooth scroll navigation functions
- [ ] Mobile responsive at all breakpoints
- [ ] Form validation shows errors
- [ ] Success message displays after submission

## Maintenance

### Adding New Sections

1. Add section data to `empresas.json`
2. Update template `empresas.njk` with new section HTML
3. Add any new icons to `icons-empresas.njk` if needed
4. Test responsive layout

### Updating Styles

- **Colors:** Modify CSS variables in `empresas-landing.css`
- **Typography:** Update font-family variables or Google Fonts import
- **Spacing:** Use existing utility classes or add new ones to inline `<style>` block

### Adding Icons

SVG icons are defined in `icons-empresas.njk` as Nunjucks macros:

```njk
{% elif name == "new-icon" %}
  <svg class="{{ class }}" ...><!-- SVG path --></svg>
{% endif %}
```

Use in template:
```njk
{{ icons.icon("new-icon", "w-5 h-5 text-primary") }}
```

## Performance

### Optimizations Applied

- Font preconnect to Google Fonts
- CSS variables for efficient theming
- Vanilla JS (no framework overhead)
- Minimal external dependencies
- Simple animation using CSS/IntersectionObserver

### Recommendations

- [ ] Add Open Graph image (optimize to <200KB)
- [ ] Minify CSS/JS in production (add build step)
- [ ] Consider lazy-loading for below-fold content
- [ ] Add service worker for offline support (optional)

## Accessibility

### Features

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators on all interactive elements
- Sufficient color contrast (passes WCAG AA)
- `prefers-reduced-motion` media query support

### Testing

- [ ] Screen reader testing (NVDA/JAWS)
- [ ] Keyboard-only navigation
- [ ] Color contrast audit
- [ ] Lighthouse accessibility score

## Troubleshooting

### Page Not Displaying

1. Check build output: `npm run build` should show `Writing _site/empresas/index.html`
2. Verify permalink in frontmatter: `permalink: /empresas/`
3. Ensure layout is null: `layout: null`

### Styles Not Loading

1. Verify CSS file exists: `_site/assets/css/empresas-landing.css`
2. Check path in template: `href="/assets/css/empresas-landing.css"`
3. Clear browser cache

### Form Not Submitting

1. Verify form action URL in `empresas.json`
2. Check browser console for errors
3. Test with browser DevTools Network tab
4. Ensure CORS is configured if using external endpoint

### Icons Not Showing

1. Check icon name in data matches macro name
2. Verify `icons-empresas.njk` is imported in template
3. Inspect SVG output in browser DevTools

## Future Enhancements

### Potential Additions

- [ ] Add video/animation to hero section
- [ ] Implement calendar integration for demo booking
- [ ] Add live chat widget
- [ ] Create Spanish/English language toggle
- [ ] Add client logo showcase section
- [ ] Implement exit-intent popup
- [ ] Add Google Analytics event tracking
- [ ] Create A/B testing framework for CTAs

### Analytics Events to Track

- Form submissions
- CTA button clicks
- Section scroll depth
- External link clicks
- Video plays (if added)
- Time on page

## Support

For questions or issues with the empresas landing page:

1. Check this documentation first
2. Review `empresas.json` for content issues
3. Inspect browser console for JavaScript errors
4. Check Eleventy build logs for template errors

## Version History

- **v1.0.0** (2024-02-05) - Initial implementation
  - Standalone landing page created
  - Full content extracted from external site
  - Vanilla JS implementation
  - Form integration ready
  - Responsive design complete
