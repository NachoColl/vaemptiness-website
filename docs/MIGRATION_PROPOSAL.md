# vaemptîness Website Migration & Redesign Proposal

**Date:** December 19, 2025
**Project:** Migration from portfolio site to vaemptîness mental training platform
**Source:** https://vaemptiness.com/ (current WordPress site)
**Target:** Eleventy static site with improved design and modern features

---

## Executive Summary

This proposal outlines the migration of vaemptîness.com content (a mental wellness/cognitive training platform) into the existing Eleventy framework, while maintaining the contact form utility and improving the overall design with modern aesthetics and enhanced user experience for both desktop and mobile.

---

## 1. Current Repository Analysis

### Existing Structure
- **Framework:** Eleventy (11ty) with Nunjucks templates
- **Multilingual:** Spanish, English, French support
- **Content Type:** Portfolio for film editor (Mateo Coll)
- **Design:** Dark, premium aesthetic (black background, white text)
- **Features to Preserve:**
  - Contact form integration (GetForm.io)
  - Responsive structure
  - Data-driven architecture (JSON files)
  - Asset pipeline
  - Visual regression testing (Playwright)

### Technical Assets
```
src/
├── templates/          # Nunjucks templates
│   ├── _includes/     # base.njk, header.njk, footer.njk
│   ├── index.njk      # Homepage
│   ├── about.njk      # About page
│   ├── contact.njk    # Contact with form
│   └── project.njk    # Dynamic project pages
├── data/              # JSON data files
├── assets/
│   ├── css/          # main.css (1,666 lines)
│   └── js/           # Utilities, form handler, animations
```

---

## 2. Target Website (vaemptiness.com) Content Analysis

### Site Structure

#### Pages & Navigation
1. **Inicio (Home)** - Hero + program overview
2. **Sobre nosotros (About Us)** - Philosophy, mission, team
3. **vaemptîness kids** - Program for ages 5-8
4. **vaemptîness teen** - Program for teens (content to be sourced)
5. **Blog** - Educational/philosophical content
6. **FAQ (Preguntas frecuentes)** - Common questions
7. **Contacto (Contact)** - Email: program@vaemptiness.com

#### Content Breakdown

**Homepage - Inicio**
- **Hero Message:** "Crea espacio mental, libérate del ruido" (Create mental space, free yourself from noise)
- **Three Core Principles:**
  - **Fusiona:** Learning + methodology
  - **Elimina:** Cognitive burden
  - **Implementa:** Tools to identify mental "saboteurs"
- **Program Cards:**
  - vaemptîness Kids (ages 5-8)
  - vaemptîness Teen (pre-adolescence to adolescence)
  - vaemptîness Program (adults and work teams)
- **Philosophy:** "No se trata de pensar más, sino mejor" (Think better, not more)

**Sobre nosotros (About Us)**
- **Sections:**
  - Philosophy: Mental training for balance, clarity, functional presence
  - Vision: Understanding thought structure to deactivate automation
  - Mission: Accompany individuals/teams in reclaiming mental space
  - Team: Rosa Cano (founder), María Saiz, Lola Saavedra, Rosa Rodríguez
  - Core Services: Gradual training, noise reduction, emotional regulation, body-mind integration
  - Brand Philosophy: Emptiness as fertile, habitable space
- **Images:** 2 images (landscape, portrait)

**vaemptîness Kids**
- **Age Range:** 5-8 years
- **5 Core Pillars:**
  1. **Body Calm:** Breathing/movement exercises
  2. **Mind Calm:** Brief attention practices ("like an owl")
  3. **Named Emotions:** Stories with characters (dragon=anger, cloud=sadness, mouse=fear)
  4. **Inner Space:** Internal "quiet place" concept
  5. **Kindness & Connection:** Cooperative games, gratitude rituals
- **Session Structure:** 20-30 minutes (storytelling, breathing, movement, 20-40s silence, creative activities)
- **Outcomes:** Emotion recognition, tension release, concentration, calm relationships

**vaemptîness Teen**
- [Content to be sourced - page returned 404]
- Target audience: Pre-adolescence to adolescence

**Blog**
- **Featured Post:** "Filosofía Budista en vaemptîness"
- **Topics:** Buddhist philosophy, emptiness, mindfulness, equanimity, compassion
- **Author:** Rosa Cano
- **Purpose:** Educational platform supporting therapeutic methodology

**FAQ**
- **Questions Cover:**
  - What you'll see when observing thoughts
  - How thoughts transform vs. disappear
  - Timeline for results (days to 2 months)
  - No prior calm state needed
  - Works with intense emotions
  - Compatible with therapy/meditation
  - Integrates into daily activities
  - No "wrong way" to practice

**Contacto (Contact)**
- **Email:** program@vaemptiness.com
- **Calendar Widget:** December 2025
- **Footer Links:** Privacy Policy, Terms & Conditions

### Design Characteristics

**Color Palette:**
- Base: Off-white (#f9f9f9)
- Contrast: Dark gray (#111111)
- Accents: Warm earth tones (beige, rust, sage green)

**Typography:**
- Body: Inter font family (variable weights)
- Headings: Cardo serif font
- Clean, minimalist aesthetic

**Layout Style:**
- Responsive grid system
- Full-width hero sections with images
- Centered content blocks
- Generous spacing/whitespace
- Image-heavy design with alternating text/visual layouts
- Mobile-responsive navigation (left-side menu on mobile)

**Features:**
- Prefetch functionality
- Emoji support
- WordPress-based (current)

---

## 3. Migration Strategy

### Content Structure (Data Files)

**New Data Files to Create:**

```json
// src/data/site.json
{
  "title": "vaemptîness",
  "tagline": "mental training",
  "description": "Crea espacio mental, libérate del ruido",
  "email": "program@vaemptiness.com",
  "language": "es"
}

// src/data/hero.json
{
  "title": "vaemptîness",
  "subtitle": "Crea espacio mental, libérate del ruido",
  "tagline": "mental training",
  "principles": [
    {
      "title": "Fusiona",
      "description": "Learning + metodología"
    },
    {
      "title": "Elimina",
      "description": "Carga cognitiva"
    },
    {
      "title": "Implementa",
      "description": "Herramientas para identificar saboteadores mentales"
    }
  ]
}

// src/data/programs.json
[
  {
    "id": "kids",
    "name": "vaemptîness kids",
    "ageRange": "5-8 años",
    "slug": "vaemptiness-kids",
    "shortDescription": "Entrenamiento emocional y mental a través del juego",
    "hero": {
      "title": "vaemptîness kids",
      "subtitle": "Edades 5-8",
      "image": "/assets/images/kids-hero.jpg"
    },
    "pillars": [
      {
        "title": "Cuerpo Tranquilo",
        "description": "Ejercicios de respiración y movimiento para reconocer estados de tensión y cansancio",
        "icon": "body"
      },
      {
        "title": "Mente Tranquila",
        "description": "Prácticas breves de atención: observar 'como un búho' o 'escuchar como un koala'",
        "icon": "mind"
      },
      {
        "title": "Emociones con Nombre",
        "description": "Historias e ilustraciones conectando sentimientos con personajes (dragón, nube, ratón)",
        "icon": "emotions"
      },
      {
        "title": "Espacio Interior",
        "description": "Concepto de un 'lugar tranquilo' interno al que los niños pueden acceder mentalmente",
        "icon": "space"
      },
      {
        "title": "Amabilidad y Conexión",
        "description": "Juegos cooperativos y rituales de gratitud enseñando empatía",
        "icon": "kindness"
      }
    ],
    "sessionStructure": {
      "duration": "20-30 minutos",
      "activities": [
        "Narración breve con personajes emocionales",
        "Técnicas de respiración simples",
        "Movimiento consciente",
        "20-40 segundos de silencio guiado",
        "Actividades creativas (colorear, dibujar, pegatinas)",
        "Cierre enfocado en la amabilidad"
      ]
    },
    "outcomes": [
      "Reconocimiento de emociones",
      "Liberación de tensión",
      "Mejor concentración en clase",
      "Relaciones basadas en la calma",
      "Autoconciencia emocional temprana"
    ]
  },
  {
    "id": "teen",
    "name": "vaemptîness teen",
    "ageRange": "Pre-adolescencia a adolescencia",
    "slug": "vaemptiness-teen",
    "shortDescription": "Programa enfocado en adolescentes"
  },
  {
    "id": "adult",
    "name": "vaemptîness",
    "ageRange": "Adultos y equipos de trabajo",
    "slug": "programa",
    "shortDescription": "Entrenamiento mental para adultos buscando mejor concentración y enfoque"
  }
]

// src/data/team.json
{
  "founder": {
    "name": "Rosa Cano",
    "role": "Fundadora",
    "bio": "Fundadora del programa vaemptîness"
  },
  "members": [
    {
      "name": "María Saiz",
      "role": "Colaboradora"
    },
    {
      "name": "Lola Saavedra",
      "role": "Colaboradora"
    },
    {
      "name": "Rosa Rodríguez",
      "role": "Colaboradora"
    }
  ],
  "description": "Desarrollando esta metodología a través de años de estudio, investigación y diseño de protocolos de regulación cognitiva"
}

// src/data/about.json
{
  "philosophy": "El programa presenta el entrenamiento mental como un enfoque distinto para recuperar el equilibrio, la claridad y la presencia funcional. En lugar de buscar silenciar la mente, la metodología busca enseñarle a organizarse, reducir la carga cognitiva y encontrar estabilidad en medio de las distracciones.",
  "vision": "Creemos que los pensamientos automatizados, aunque parezcan abrumadores, poseen una estructura inherente. Comprender esta estructura permite la desactivación. Nuestro principio: No se trata de pensar más, sino mejor.",
  "mission": "Acompañar a individuos y equipos a recuperar su espacio mental, optimizar su funcionamiento y desarrollar patrones de pensamiento más estables y conscientes.",
  "services": [
    "Entrenamiento mental gradual",
    "Reducción del ruido interno y carga cognitiva",
    "Regulación emocional y atencional",
    "Reorganización de prioridades mentales",
    "Integración cuerpo-mente",
    "Implementación de hábitos"
  ],
  "brandPhilosophy": "El nombre refleja entender el vacío como un espacio fértil y habitable donde la mente descansa, permitiendo una mejor observación, toma de decisiones y vida.",
  "images": [
    "/assets/images/about-landscape.jpg",
    "/assets/images/about-portrait.jpg"
  ]
}

// src/data/faq.json
[
  {
    "question": "¿Qué veré cuando observe mis pensamientos?",
    "answer": "Las observaciones iniciales pueden incluir sensaciones, mini impulsos, tensiones, pequeños movimientos internos en lugar de pensamientos claros."
  },
  {
    "question": "¿Los pensamientos desaparecen?",
    "answer": "Los pensamientos no desaparecen, se transforman. El método elimina la identificación con los pensamientos en lugar de eliminarlos por completo."
  },
  {
    "question": "¿Volveré a engancharme con pensamientos?",
    "answer": "La reaparición es normal. Los usuarios desarrollan herramientas para ver el inicio, ver la construcción, ver el patrón, liberar antes."
  },
  {
    "question": "¿Cuánto tiempo para ver resultados?",
    "answer": "Los cambios varían: reducciones notables en días, mayor claridad en 1-2 semanas, disminución de la rumiación en 1-2 meses."
  },
  {
    "question": "¿Necesito estar calmado para practicar?",
    "answer": "No se necesita un estado de calma previo. La práctica funciona efectivamente mientras estás nervioso, enojado, triste, cansado o ansioso."
  },
  {
    "question": "¿Qué hago con emociones intensas?",
    "answer": "Enfoque recomendado: nombrarlo, localizarlo en el cuerpo, permanecer presente durante 20-30 segundos."
  },
  {
    "question": "¿Es compatible con terapia o meditación?",
    "answer": "El método complementa la terapia, mindfulness, meditación, yoga y enfoques cognitivos/somáticos."
  },
  {
    "question": "¿Cuánto tiempo necesito dedicar?",
    "answer": "Funciona dentro de las actividades diarias: durante tareas rutinarias, períodos de espera, observaciones breves de tres segundos."
  },
  {
    "question": "¿Puedo hacerlo mal?",
    "answer": "No hay una 'manera incorrecta': observar, notar patrones y reconocer distracciones, todo cuenta como práctica."
  }
]

// src/data/blog.json
[
  {
    "id": 1,
    "slug": "filosofia-budista-vaemptiness",
    "title": "Filosofía Budista en vaemptîness",
    "author": "Rosa Cano",
    "date": "2025-12-15",
    "excerpt": "El vacío como espacio fértil en lugar de trauma, transformándolo de problema a posibilidad.",
    "content": "La publicación del blog analiza la integración de la filosofía budista en el enfoque terapéutico de vaemptîness...",
    "topics": [
      "Reconceptualizar el Vacío",
      "Herramientas Prácticas",
      "Conceptos Budistas Centrales",
      "Dimensión Existencial"
    ],
    "keyPoints": [
      "El budismo ve el vacío como 'un espacio fértil' en lugar de trauma",
      "Mindfulness, ecuanimidad y compasión como puentes entre el dolor y la transformación",
      "No-yo (anatta) para facilitar la flexibilidad cognitiva",
      "Impermanencia (anicca) para romper patrones de estancamiento",
      "Ética interna enfatizando la no violencia hacia uno mismo"
    ],
    "cta": "Cuestiónate y encuentra calma"
  }
]
```

### Template Structure

**Pages to Create/Modify:**

1. **index.njk** (Homepage)
   - Hero section with main message
   - Three principles section
   - Program cards (kids, teen, adult)
   - CTA to contact

2. **sobre-nosotros.njk** (About Us)
   - Philosophy section
   - Vision & Mission
   - Team section
   - Core services grid
   - Brand philosophy
   - Images

3. **programa.njk** (Program Template)
   - Dynamic template for each program
   - Hero section
   - Program details
   - Pillars/features grid
   - Outcomes
   - CTA

4. **blog.njk** (Blog Index)
   - Blog post listing
   - Featured posts
   - Categories/tags

5. **blog-post.njk** (Individual Post)
   - Post content
   - Author info
   - Related posts

6. **faq.njk** (FAQ)
   - Accordion-style Q&A
   - Categories

7. **contacto.njk** (Contact)
   - Contact form (preserve existing GetForm.io)
   - Email display
   - Optional calendar integration

---

## 4. Design Improvements Proposal

### Color Palette Evolution

**Primary Colors:**
```css
--color-primary-bg: #f9f9f9;        /* Off-white background */
--color-primary-text: #111111;      /* Dark gray text */
--color-accent-beige: #d4c5b9;      /* Warm beige */
--color-accent-rust: #b85c4f;       /* Rust/terracotta */
--color-accent-sage: #a4b8a0;       /* Sage green */
--color-accent-cream: #f5f0e8;      /* Cream */
```

**Secondary/UI Colors:**
```css
--color-border: #e1e1e1;
--color-hover: #8a7968;
--color-shadow: rgba(17, 17, 17, 0.08);
```

### Typography System

**Fonts:**
```css
/* Headings - Cardo Serif */
@import url('https://fonts.googleapis.com/css2?family=Cardo:ital,wght@0,400;0,700;1,400&display=swap');

/* Body - Inter */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
```

**Type Scale:**
```css
--font-heading: 'Cardo', serif;
--font-body: 'Inter', sans-serif;

/* Fluid typography using clamp() */
--text-hero: clamp(2.5rem, 6vw, 4.5rem);      /* 40-72px */
--text-h1: clamp(2rem, 4vw, 3.5rem);          /* 32-56px */
--text-h2: clamp(1.5rem, 3vw, 2.5rem);        /* 24-40px */
--text-h3: clamp(1.25rem, 2vw, 1.75rem);      /* 20-28px */
--text-body-lg: clamp(1.125rem, 1.5vw, 1.25rem); /* 18-20px */
--text-body: 1rem;                             /* 16px */
--text-small: 0.875rem;                        /* 14px */
```

### Layout System

**Container & Spacing:**
```css
--container-max: 1200px;
--container-padding: clamp(1.5rem, 5vw, 3rem);
--section-spacing: clamp(4rem, 10vw, 8rem);
--element-spacing: clamp(2rem, 4vw, 3rem);
```

**Grid System:**
```css
/* 12-column responsive grid */
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 2rem;
}

/* Responsive breakpoints */
--breakpoint-mobile: 640px;
--breakpoint-tablet: 768px;
--breakpoint-desktop: 1024px;
--breakpoint-wide: 1280px;
```

### Component Design

#### 1. Hero Section (Homepage)
```
┌─────────────────────────────────────┐
│                                     │
│        vaemptîness                  │
│        mental training               │
│                                     │
│   Crea espacio mental,              │
│   libérate del ruido                │
│                                     │
│   [Scroll indicator]                │
│                                     │
└─────────────────────────────────────┘
```
- Full viewport height
- Centered content
- Subtle background texture or gradient
- Animated entrance
- Scroll indicator

#### 2. Three Principles Section
```
┌─────────────────────────────────────┐
│                                     │
│    [Fusiona]    [Elimina]  [Implementa] │
│    Learning +   Carga      Herramientas│
│    metodología  cognitiva  mentales    │
│                                     │
└─────────────────────────────────────┘
```
- Three-column grid (stacks on mobile)
- Icon or number for each principle
- Hover effects
- Minimal border styling

#### 3. Program Cards
```
┌─────────────────────────────────────┐
│  ┌────────────┐  ┌────────────┐    │
│  │  [Image]   │  │  [Image]   │    │
│  │            │  │            │    │
│  │ kids 5-8   │  │ teen       │    │
│  │            │  │            │    │
│  └────────────┘  └────────────┘    │
│                                     │
│        ┌────────────┐               │
│        │  [Image]   │               │
│        │            │               │
│        │ adult      │               │
│        │            │               │
│        └────────────┘               │
└─────────────────────────────────────┘
```
- Card-based layout
- Hover effects (scale, shadow)
- Image overlay with text
- Links to detail pages

#### 4. About Page Layout
```
┌─────────────────────────────────────┐
│  Hero Image (full-width)            │
├─────────────────────────────────────┤
│  Philosophy Section                 │
│  [Text content - max 800px width]   │
├─────────────────────────────────────┤
│  Vision & Mission (two columns)     │
├─────────────────────────────────────┤
│  Team Section                       │
│  [Photo grid or list]               │
├─────────────────────────────────────┤
│  Core Services Grid                 │
│  [6 items in 2x3 or 3x2 grid]      │
└─────────────────────────────────────┘
```

#### 5. Program Detail Page
```
┌─────────────────────────────────────┐
│  Hero with Program Name             │
├─────────────────────────────────────┤
│  Introduction                       │
├─────────────────────────────────────┤
│  Pillars/Features Grid              │
│  [Icon + Title + Description]       │
├─────────────────────────────────────┤
│  Session Structure / Details        │
├─────────────────────────────────────┤
│  Expected Outcomes                  │
├─────────────────────────────────────┤
│  CTA to Contact                     │
└─────────────────────────────────────┘
```

#### 6. FAQ Page
```
┌─────────────────────────────────────┐
│  FAQ Header                         │
├─────────────────────────────────────┤
│  ▼ Question 1                       │
│    Answer revealed on click         │
│                                     │
│  ▶ Question 2                       │
│                                     │
│  ▶ Question 3                       │
│                                     │
└─────────────────────────────────────┘
```
- Accordion style (expand/collapse)
- Smooth animations
- Optional categories/tabs

### Modern UI Elements

**1. Smooth Scroll & Animations**
```css
/* Scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Intersection Observer animations */
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
```

**2. Hover Effects**
```css
/* Card hover */
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px var(--color-shadow);
}

/* Link underline animation */
.link-underline {
  position: relative;
}

.link-underline::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-accent-rust);
  transition: width 0.3s ease;
}

.link-underline:hover::after {
  width: 100%;
}
```

**3. Subtle Background Textures**
```css
/* Paper texture overlay */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/assets/images/paper-texture.png');
  opacity: 0.03;
  pointer-events: none;
  z-index: -1;
}
```

**4. Gradient Overlays**
```css
/* Hero gradient */
.hero::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200px;
  background: linear-gradient(to bottom, transparent, var(--color-primary-bg));
  pointer-events: none;
}
```

### Mobile Optimization

**Navigation:**
- Hamburger menu on mobile
- Slide-in drawer from left
- Overlay backdrop

**Touch Targets:**
```css
/* Minimum 44x44px touch targets */
button, a.button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 24px;
}
```

**Responsive Images:**
```html
<picture>
  <source media="(max-width: 640px)" srcset="image-mobile.jpg">
  <source media="(max-width: 1024px)" srcset="image-tablet.jpg">
  <img src="image-desktop.jpg" alt="">
</picture>
```

### Accessibility Enhancements

```css
/* Focus states */
*:focus-visible {
  outline: 2px solid var(--color-accent-rust);
  outline-offset: 2px;
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**ARIA Labels:**
```html
<nav aria-label="Primary navigation">
<button aria-expanded="false" aria-controls="mobile-menu">
<section aria-labelledby="about-heading">
```

---

## 5. Feature Enhancements

### Modern Web Features

**1. Progressive Image Loading**
- Lazy loading for below-fold images
- BlurHash or low-quality placeholders
- WebP format with fallbacks

**2. Smooth Page Transitions**
- Fade between page loads
- Loading states for dynamic content

**3. Interactive Elements**
- Scroll-triggered animations (Intersection Observer)
- Parallax effects (subtle)
- Hover states with smooth transitions

**4. Performance Optimizations**
- Critical CSS inline
- Deferred JavaScript loading
- Image optimization pipeline
- Minified assets

**5. SEO Enhancements**
- Semantic HTML5
- Meta tags for social sharing (Open Graph, Twitter Cards)
- Structured data (JSON-LD)
- Sitemap generation

**6. Form Enhancements**
- Client-side validation
- Success/error states with animations
- Loading indicators
- Preserve existing GetForm.io integration

### New Components

**1. Newsletter Signup (Optional)**
```html
<section class="newsletter">
  <h3>Mantente informado</h3>
  <form>
    <input type="email" placeholder="Tu email">
    <button type="submit">Suscribirse</button>
  </form>
</section>
```

**2. Testimonials Carousel (If content available)**
```html
<section class="testimonials">
  <div class="carousel">
    <!-- Testimonial cards -->
  </div>
</section>
```

**3. Call-to-Action Blocks**
```html
<section class="cta">
  <h2>¿Listo para crear espacio mental?</h2>
  <a href="/contacto" class="button">Contáctanos</a>
</section>
```

---

## 6. Implementation Plan

### Phase 1: Setup & Data Migration (Week 1)

**Tasks:**
1. ✅ Document current structure
2. ✅ Analyze target website
3. Create new data files structure
4. Extract all Spanish text content
5. Gather images from vaemptiness.com
6. Set up image asset pipeline

**Deliverables:**
- Complete data JSON files
- Image assets organized in `/src/assets/images/`
- Updated site configuration

### Phase 2: Template Development (Week 2)

**Tasks:**
1. Update `base.njk` with new design system
2. Create new header/footer for vaemptiness
3. Build homepage template
4. Build about page template
5. Build program detail template
6. Build FAQ template
7. Update contact page (preserve form)

**Deliverables:**
- All page templates functional
- Responsive layouts tested
- Navigation working

### Phase 3: Styling & Design (Week 3)

**Tasks:**
1. Create new CSS architecture (variables, utilities)
2. Implement color palette and typography
3. Build component styles (cards, buttons, forms)
4. Add animations and transitions
5. Implement mobile responsive design
6. Test across devices and browsers

**Deliverables:**
- Complete CSS system
- Responsive design verified
- Cross-browser compatible

### Phase 4: Content & Assets (Week 3-4)

**Tasks:**
1. Add all Spanish text content
2. Optimize and add images
3. Create blog posts (if content available)
4. Populate FAQ
5. Add team photos/bios
6. Set up program pages

**Deliverables:**
- All content populated
- Images optimized and displayed
- No lorem ipsum placeholder text

### Phase 5: Enhancements & Polish (Week 4)

**Tasks:**
1. Add scroll animations
2. Implement lazy loading
3. Add form validation
4. SEO meta tags
5. Social sharing cards
6. Accessibility audit
7. Performance optimization

**Deliverables:**
- Smooth animations
- Fast load times
- Accessible to WCAG 2.1 AA
- SEO-ready

### Phase 6: Testing & Deployment (Week 5)

**Tasks:**
1. Visual regression testing (Playwright)
2. Update test snapshots
3. Manual QA across devices
4. Fix any bugs
5. Update GitHub Actions workflow
6. Deploy to GitHub Pages

**Deliverables:**
- All tests passing
- Production deployment
- Documentation updated

---

## 7. Content Migration Checklist

### Text Content (Spanish)

- [ ] Homepage hero text
- [ ] Three principles descriptions
- [ ] Program summaries (kids, teen, adult)
- [ ] About us - philosophy, vision, mission
- [ ] About us - team bios
- [ ] About us - core services
- [ ] About us - brand philosophy
- [ ] vaemptiness kids - all 5 pillars
- [ ] vaemptiness kids - session structure
- [ ] vaemptiness kids - outcomes
- [ ] vaemptiness teen - complete content
- [ ] FAQ - all 9+ questions and answers
- [ ] Blog - "Filosofía Budista" post
- [ ] Blog - additional posts (if available)
- [ ] Contact page - email, instructions
- [ ] Footer - copyright, links
- [ ] Privacy policy (if needed)
- [ ] Terms & conditions (if needed)

### Images to Source

**Homepage:**
- [ ] Hero background image
- [ ] Kids program card image
- [ ] Teen program card image
- [ ] Adult program card image

**About Page:**
- [ ] Landscape image
- [ ] Portrait image
- [ ] Team photos (Rosa Cano, María Saiz, Lola Saavedra, Rosa Rodríguez)

**Program Pages:**
- [ ] Kids hero image
- [ ] Kids pillar icons (5 icons)
- [ ] Teen hero image
- [ ] Adult program images

**Blog:**
- [ ] Featured post image
- [ ] Additional post images

**General:**
- [ ] Favicon
- [ ] Social sharing image
- [ ] Background textures (optional)

---

## 8. Design Comparison

| Aspect | Current (Portfolio) | Target (vaemptiness) | Proposed Enhancement |
|--------|-------------------|---------------------|---------------------|
| **Color Scheme** | Dark (black bg) | Light (off-white) | Light + warm earth tones |
| **Typography** | Inter + Syne | Inter + Cardo serif | Inter + Cardo (target) |
| **Layout** | Project grid | Content-focused | Content-focused + modern grid |
| **Content Type** | Video portfolio | Educational/service | Educational/service |
| **Navigation** | Fixed header | Standard nav | Fixed header with slide-in mobile |
| **Animations** | Float, scroll reveal | Basic | Enhanced scroll animations |
| **Images** | Vimeo embeds | Static images | Progressive loading, optimized |
| **Forms** | GetForm.io | Email only | Enhanced GetForm.io with validation |
| **Responsive** | Yes | Yes | Enhanced mobile experience |
| **Languages** | ES/EN/FR | ES only | ES (can expand later) |

---

## 9. Technical Specifications

### Browser Support
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile Safari (iOS 13+)
- Chrome Mobile (Android 8+)

### Performance Targets
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1
- Lighthouse Score: 90+ (all categories)

### Accessibility Standards
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Sufficient color contrast (4.5:1 minimum)
- Focus indicators
- Alt text for all images
- ARIA labels where appropriate

### SEO Requirements
- Semantic HTML5 markup
- Meta descriptions (unique per page)
- Open Graph tags
- Twitter Card tags
- Structured data (Organization, FAQPage)
- XML sitemap
- robots.txt
- Canonical URLs

---

## 10. Risks & Mitigation

| Risk | Impact | Mitigation Strategy |
|------|--------|-------------------|
| Missing teen program content | Medium | Request content from client or create placeholder |
| Image quality/availability | Medium | Request high-res images or use optimized versions |
| Blog content incomplete | Low | Start with featured post, add more later |
| Form integration changes | High | Thoroughly test existing GetForm.io setup |
| Design approval delays | Medium | Create interactive prototype for early feedback |
| Performance issues | Medium | Regular performance testing throughout development |

---

## 11. Post-Launch Considerations

### Analytics Setup
- Google Analytics 4
- Conversion tracking (form submissions)
- User behavior analysis
- Page performance monitoring

### Content Management
- Blog posting workflow
- Image optimization process
- FAQ updates
- Program content updates

### Maintenance
- Regular dependency updates
- Security monitoring
- Backup strategy
- Content review cycle

### Future Enhancements
- Email newsletter integration
- Booking/calendar system
- User testimonials section
- Video content integration
- Multilingual expansion (EN, FR)
- Blog categories and search
- Resource library/downloads

---

## 12. Success Metrics

### Technical Metrics
- ✅ All Playwright tests passing
- ✅ Lighthouse scores 90+ across all pages
- ✅ Zero accessibility violations
- ✅ Page load time < 3 seconds
- ✅ Mobile-friendly test passing

### Content Metrics
- ✅ All Spanish text migrated
- ✅ All images optimized and displayed
- ✅ Navigation functional
- ✅ Contact form working
- ✅ All links functional

### User Experience Metrics
- ✅ Responsive design working on all breakpoints
- ✅ Smooth animations
- ✅ Intuitive navigation
- ✅ Clear call-to-actions
- ✅ Fast, seamless experience

---

## 13. Appendix

### Design System Reference

**Spacing Scale:**
```css
--space-xs: 0.5rem;   /* 8px */
--space-sm: 1rem;     /* 16px */
--space-md: 1.5rem;   /* 24px */
--space-lg: 2rem;     /* 32px */
--space-xl: 3rem;     /* 48px */
--space-2xl: 4rem;    /* 64px */
--space-3xl: 6rem;    /* 96px */
```

**Border Radius:**
```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-full: 9999px;
```

**Shadows:**
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.07);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
--shadow-xl: 0 20px 25px rgba(0,0,0,0.15);
```

**Transitions:**
```css
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
--transition-slow: 350ms ease;
```

### File Structure After Migration

```
vaemptiness-website/
├── src/
│   ├── templates/
│   │   ├── _includes/
│   │   │   ├── base.njk
│   │   │   ├── header.njk
│   │   │   ├── footer.njk
│   │   │   ├── program-card.njk
│   │   │   └── faq-item.njk
│   │   ├── index.njk                    # Homepage
│   │   ├── sobre-nosotros.njk           # About
│   │   ├── programa.njk                 # Program detail (dynamic)
│   │   ├── blog.njk                     # Blog index
│   │   ├── blog-post.njk                # Blog post (dynamic)
│   │   ├── faq.njk                      # FAQ
│   │   └── contacto.njk                 # Contact
│   ├── data/
│   │   ├── site.json
│   │   ├── hero.json
│   │   ├── programs.json
│   │   ├── about.json
│   │   ├── team.json
│   │   ├── faq.json
│   │   └── blog.json
│   └── assets/
│       ├── css/
│       │   ├── main.css                 # Core styles
│       │   ├── variables.css            # CSS custom properties
│       │   ├── components/              # Component styles
│       │   └── utilities.css            # Utility classes
│       ├── js/
│       │   ├── main.js
│       │   ├── contact-form.js
│       │   ├── accordion.js             # FAQ accordion
│       │   └── animations.js            # Scroll animations
│       └── images/
│           ├── hero/
│           ├── programs/
│           ├── about/
│           ├── team/
│           └── blog/
├── tests/
│   └── visual/
│       ├── homepage.spec.ts
│       ├── about.spec.ts
│       ├── programs.spec.ts
│       └── contact.spec.ts
├── docs/
│   ├── MIGRATION_PROPOSAL.md            # This document
│   └── DESIGN_SYSTEM.md                 # Design tokens reference
└── .eleventy.js
```

---

## Conclusion

This proposal outlines a comprehensive migration strategy that:

1. **Preserves** the robust Eleventy framework and contact form functionality
2. **Migrates** all Spanish content from vaemptiness.com accurately
3. **Improves** the design with a modern, clean aesthetic suitable for a wellness brand
4. **Enhances** user experience with smooth animations, responsive design, and accessibility
5. **Optimizes** performance for fast loading and SEO
6. **Maintains** flexibility for future content updates and feature additions

The result will be a modern, professional website that effectively communicates the vaemptîness brand philosophy while providing an excellent user experience across all devices.

---

**Next Steps:**
1. Review and approve this proposal
2. Provide missing content (teen program, additional images)
3. Begin Phase 1 implementation
4. Set up regular progress check-ins
5. Plan content review and approval process

---

*Document Version: 1.0*
*Last Updated: December 19, 2025*
