# SEO Implementation Plan - Adding Meta Tags & Best Practices

**Goal:** Add SEO meta tags, schema markup, and best practices to all pages of vaemptiness.es

**Approach:**
1. Create centralized SEO data structure
2. Update base template with comprehensive meta tags
3. Add page-specific SEO data
4. Implement schema markup
5. Test and validate

---

## Phase 1: Create SEO Data Structure

### Step 1.1: Create SEO Data File

**File:** `src/data/seo.json`

This file will contain default SEO settings and reusable schema data.

```json
{
  "defaultTitle": "vaemptîness | Entrenamiento Mental y Mindfulness Barcelona",
  "titleSuffix": " | vaemptîness",
  "defaultDescription": "Crea espacio mental. Entrenamiento cerebral basado en mindfulness y filosofía budista en Barcelona.",
  "defaultKeywords": "entrenamiento mental Barcelona, mindfulness Barcelona, meditación, psicología budista",
  "ogImage": "/assets/images/og-default.jpg",
  "twitterCard": "summary_large_image",
  "twitterImage": "/assets/images/twitter-card-default.jpg",
  "organization": {
    "name": "vaemptîness",
    "alternateName": "vaemptiness Barcelona",
    "description": "Entrenamiento mental y mindfulness basado en filosofía budista. Programas para adultos, equipos, adolescentes y niños en Barcelona.",
    "logo": "/assets/images/logo.png",
    "email": "program@vaemptiness.es",
    "telephone": "+34-XXX-XXX-XXX",
    "address": {
      "locality": "Barcelona",
      "region": "Cataluña",
      "country": "ES"
    },
    "geo": {
      "latitude": "41.3851",
      "longitude": "2.1734"
    },
    "priceRange": "€€",
    "openingHours": [
      {
        "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "20:00"
      }
    ],
    "socialMedia": {
      "facebook": "",
      "instagram": "",
      "linkedin": ""
    }
  }
}
```

### Step 1.2: Add SEO Data to Page Templates

Each page template will have front matter with SEO-specific data:

**Example for Homepage (index.njk):**
```yaml
---
layout: base.njk
permalink: /
bodyClass: home-page
seo:
  title: "vaemptîness | Entrenamiento Mental y Mindfulness Barcelona"
  description: "Crea espacio mental. Entrenamiento cerebral basado en mindfulness y filosofía budista. Programas para adultos, equipos, adolescentes y niños en Barcelona."
  keywords: "entrenamiento mental Barcelona, mindfulness Barcelona, meditación Barcelona, psicología budista, reducir ansiedad, claridad mental"
  ogImage: "/assets/images/og-home.jpg"
  schemaType: "WebSite"
---
```

**Page-by-Page SEO Data:**

1. **Homepage (index.njk)**
   - Title: "vaemptîness | Entrenamiento Mental y Mindfulness Barcelona"
   - Description: "Crea espacio mental. Entrenamiento cerebral basado en mindfulness y filosofía budista. Programas para adultos, equipos, adolescentes y niños en Barcelona."
   - Schema: WebSite + MedicalBusiness

2. **About (sobre-nosotros.njk)**
   - Title: "Sobre Nosotros | vaemptîness - Psicología Budista Barcelona"
   - Description: "Conoce al equipo de vaemptîness. Combinamos psicología occidental y filosofía budista para ofrecer entrenamiento mental efectivo en Barcelona."
   - Schema: Person (for team members)

3. **Contact (contacto.njk)**
   - Title: "Contacto | Reserva tu Sesión de Entrenamiento Mental Barcelona"
   - Description: "Contacta con vaemptîness. Envíanos tus preguntas o reserva tu primera sesión de entrenamiento mental en Barcelona. Online o presencial."

4. **Program Pages (programa.njk template used by 4 pages)**

   **vaemptiness-program:**
   - Title: "vaemptîness program | Entrenamiento Mental para Adultos Barcelona"
   - Description: "Programa de entrenamiento mental para adultos. Reduce rumiación, aumenta claridad cognitiva y mejora concentración. 60 min/sesión en Barcelona."
   - Schema: PsychologicalTreatment

   **vaemptiness-equipos:**
   - Title: "vaemptîness equipos | Mindfulness Empresas Barcelona"
   - Description: "Entrenamiento mental para equipos y empresas. Reduce estrés laboral, mejora enfoque y productividad. Programas in-company en Barcelona."
   - Schema: PsychologicalTreatment

   **vaemptiness-teen:**
   - Title: "vaemptîness teen | Mindfulness para Adolescentes Barcelona"
   - Description: "Programa de mindfulness para adolescentes (12-17 años). Gestión emocional, reducción de ansiedad escolar y claridad mental. Barcelona."
   - Schema: PsychologicalTreatment

   **vaemptiness-kids:**
   - Title: "vaemptîness kids | Mindfulness para Niños Barcelona"
   - Description: "Programa de mindfulness para niños (6-12 años). Atención plena, gestión emocional y concentración mediante juegos y actividades. Barcelona."
   - Schema: PsychologicalTreatment

5. **Learning (aprendizaje.njk)**
   - Title: "Metodología | Cómo Funciona el Entrenamiento Mental vaemptîness"
   - Description: "Descubre cómo funciona nuestro método de entrenamiento mental. Combinamos mindfulness, psicología occidental y filosofía budista."

6. **Blog Listing (blog.njk)**
   - Title: "Blog | vaemptîness - Mindfulness y Filosofía Budista"
   - Description: "Artículos sobre entrenamiento mental, mindfulness, filosofía budista y psicología aplicada. Recursos para tu desarrollo personal."

7. **Blog Post (blog-post.njk)**
   - Title: Dynamic from post data
   - Description: Dynamic from post excerpt
   - Schema: BlogPosting

8. **FAQ (faq.njk)**
   - Title: "Preguntas Frecuentes | vaemptîness Entrenamiento Mental Barcelona"
   - Description: "Respuestas a preguntas frecuentes sobre nuestros programas de entrenamiento mental, mindfulness y filosofía budista en Barcelona."
   - Schema: FAQPage

9. **Reset (reset.njk)**
   - Title: "Reset | Programa de Reinicio Mental vaemptîness"
   - Description: "Descubre cómo resetear tu mente y crear espacio mental duradero con nuestro programa especializado."

10. **Privacy Policy (politica-privacidad.njk)**
    - Title: "Política de Privacidad | vaemptîness"
    - Description: "Política de privacidad de vaemptîness. Información sobre protección de datos y cumplimiento RGPD."

11. **Terms (terminos-condiciones.njk)**
    - Title: "Términos y Condiciones | vaemptîness"
    - Description: "Términos y condiciones de uso de los servicios de vaemptîness."

---

## Phase 2: Update Base Template

### Step 2.1: Enhanced Meta Tags in base.njk

**File:** `src/templates/_includes/base.njk`

Replace the `<head>` section with:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">

  <!-- SEO Meta Tags -->
  <title>{% if seo.title %}{{ seo.title }}{% else %}{{ title }}{{ seo.titleSuffix | default(' | vaemptîness') }}{% endif %}</title>
  <meta name="description" content="{% if seo.description %}{{ seo.description }}{% else %}{{ site.description }}{% endif %}">
  {% if seo.keywords %}<meta name="keywords" content="{{ seo.keywords }}">{% endif %}
  <meta name="author" content="{{ site.author }}">
  <meta name="language" content="{{ lang | default('es') }}">
  <link rel="canonical" href="{{ site.url }}{{ page.url }}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="{% if seo.ogType %}{{ seo.ogType }}{% else %}website{% endif %}">
  <meta property="og:url" content="{{ site.url }}{{ page.url }}">
  <meta property="og:title" content="{% if seo.title %}{{ seo.title }}{% else %}{{ title }}{{ seo.titleSuffix | default(' | vaemptîness') }}{% endif %}">
  <meta property="og:description" content="{% if seo.description %}{{ seo.description }}{% else %}{{ site.description }}{% endif %}">
  <meta property="og:image" content="{{ site.url }}{% if seo.ogImage %}{{ seo.ogImage }}{% else %}{{ seo.defaultOgImage | default('/assets/images/og-default.jpg') }}{% endif %}">
  <meta property="og:locale" content="es_ES">
  <meta property="og:site_name" content="vaemptîness">

  <!-- Twitter -->
  <meta property="twitter:card" content="{{ seo.twitterCard | default('summary_large_image') }}">
  <meta property="twitter:url" content="{{ site.url }}{{ page.url }}">
  <meta property="twitter:title" content="{% if seo.title %}{{ seo.title }}{% else %}{{ title }}{{ seo.titleSuffix | default(' | vaemptîness') }}{% endif %}">
  <meta property="twitter:description" content="{% if seo.description %}{{ seo.description }}{% else %}{{ site.description }}{% endif %}">
  <meta property="twitter:image" content="{{ site.url }}{% if seo.twitterImage %}{{ seo.twitterImage }}{% else %}{{ seo.defaultTwitterImage | default('/assets/images/twitter-card-default.jpg') }}{% endif %}">

  <!-- Additional SEO -->
  <meta name="robots" content="index, follow">
  <meta name="googlebot" content="index, follow">
  <meta name="theme-color" content="#b85c4f">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cardo:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">

  <!-- Styles -->
  <link rel="stylesheet" href="{{ '/assets/css/main.css' | url }}">

  {% block head %}{% endblock %}

  <!-- Schema.org Markup -->
  {% include "schemas/local-business.njk" %}
  {% block schema %}{% endblock %}
</head>
```

### Step 2.2: Create Schema Includes Directory

**Directory:** `src/templates/_includes/schemas/`

Create the following schema include files:

---

## Phase 3: Create Schema Include Files

### Step 3.1: LocalBusiness Schema (All Pages)

**File:** `src/templates/_includes/schemas/local-business.njk`

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "{{ site.url }}/#organization",
  "name": "vaemptîness",
  "alternateName": "vaemptiness Barcelona",
  "description": "Entrenamiento mental y mindfulness basado en filosofía budista. Programas para adultos, equipos, adolescentes y niños en Barcelona.",
  "url": "{{ site.url }}",
  "logo": "{{ site.url }}/assets/images/logo.png",
  "image": "{{ site.url }}/assets/images/logo.png",
  "telephone": "+34-XXX-XXX-XXX",
  "email": "{{ site.email }}",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Barcelona",
    "addressRegion": "Cataluña",
    "addressCountry": "ES"
  },
  "areaServed": {
    "@type": "City",
    "name": "Barcelona"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "41.3851",
    "longitude": "2.1734"
  },
  "priceRange": "€€",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "20:00"
    }
  ]{% if site.socialMedia.facebook or site.socialMedia.instagram or site.socialMedia.linkedin %},
  "sameAs": [
    {% if site.socialMedia.facebook %}"{{ site.socialMedia.facebook }}"{% if site.socialMedia.instagram or site.socialMedia.linkedin %},{% endif %}{% endif %}
    {% if site.socialMedia.instagram %}"{{ site.socialMedia.instagram }}"{% if site.socialMedia.linkedin %},{% endif %}{% endif %}
    {% if site.socialMedia.linkedin %}"{{ site.socialMedia.linkedin }}"{% endif %}
  ]{% endif %}
}
</script>
```

### Step 3.2: MedicalBusiness Schema (Homepage Only)

**File:** `src/templates/_includes/schemas/medical-business.njk`

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "vaemptîness",
  "url": "{{ site.url }}",
  "logo": "{{ site.url }}/assets/images/logo.png",
  "description": "Centro de entrenamiento mental y mindfulness basado en filosofía budista",
  "medicalSpecialty": "Psychology",
  "priceRange": "€€",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Barcelona",
    "addressRegion": "Cataluña",
    "addressCountry": "ES"
  },
  "telephone": "+34-XXX-XXX-XXX",
  "email": "{{ site.email }}",
  "serviceType": [
    "Mental Training",
    "Mindfulness",
    "Meditation",
    "Psychological Treatment"
  ]
}
</script>
```

### Step 3.3: WebSite Schema (Homepage Only)

**File:** `src/templates/_includes/schemas/website.njk`

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "vaemptîness",
  "alternateName": "vaemptiness Barcelona",
  "url": "{{ site.url }}",
  "description": "Entrenamiento mental y mindfulness basado en filosofía budista en Barcelona",
  "inLanguage": "es-ES",
  "publisher": {
    "@type": "Organization",
    "name": "vaemptîness",
    "logo": {
      "@type": "ImageObject",
      "url": "{{ site.url }}/assets/images/logo.png"
    }
  }
}
</script>
```

### Step 3.4: Person Schema (About Page)

**File:** `src/templates/_includes/schemas/person.njk`

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "{{ site.author }}",
  "jobTitle": "Fundadora y Entrenadora Mental",
  "worksFor": {
    "@type": "Organization",
    "name": "vaemptîness"
  },
  "url": "{{ site.url }}/sobre-nosotros/",
  "image": "{{ site.url }}/assets/images/team/rosa-cano.jpg",
  "description": "Fundadora de vaemptîness, especializada en entrenamiento mental y filosofía budista aplicada.",
  "email": "{{ site.email }}",
  "knowsAbout": [
    "Mindfulness",
    "Buddhist Psychology",
    "Mental Training",
    "Cognitive Psychology"
  ]
}
</script>
```

### Step 3.5: PsychologicalTreatment Schema (Program Pages)

**File:** `src/templates/_includes/schemas/psychological-treatment.njk`

This will be a parametrized include that accepts program data:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "PsychologicalTreatment",
  "name": "{{ program.name }}",
  "description": "{{ program.shortDescription }}",
  "url": "{{ site.url }}/{{ program.slug }}/",
  "provider": {
    "@type": "LocalBusiness",
    "name": "vaemptîness",
    "url": "{{ site.url }}"
  },
  "relevantSpecialty": {
    "@type": "MedicalSpecialty",
    "name": "Psychology"
  }{% if program.audience %},
  "audience": {
    "@type": "{{ program.audience.type | default('PeopleAudience') }}",
    {% if program.audience.minAge %}"suggestedMinAge": {{ program.audience.minAge }},{% endif %}
    {% if program.audience.maxAge %}"suggestedMaxAge": {{ program.audience.maxAge }},{% endif %}
    "audienceType": "{{ program.audience.label }}"
  }{% endif %},
  "duration": "PT60M"
}
</script>
```

### Step 3.6: FAQPage Schema (FAQ Page)

**File:** `src/templates/_includes/schemas/faq-page.njk`

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {% for category in faq.categories %}
      {% for item in category.questions %}
    {
      "@type": "Question",
      "name": "{{ item.question }}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{ item.answer }}"
      }
    }{% if not loop.last %},{% endif %}
      {% endfor %}
      {% if not loop.last %},{% endif %}
    {% endfor %}
  ]
}
</script>
```

### Step 3.7: BlogPosting Schema (Blog Posts)

**File:** `src/templates/_includes/schemas/blog-posting.njk`

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{{ post.title }}",
  "alternativeHeadline": "{{ post.excerpt }}",
  "image": "{{ site.url }}{{ post.image }}",
  "author": {
    "@type": "Person",
    "name": "{{ post.author }}",
    "url": "{{ site.url }}/sobre-nosotros/"
  },
  "publisher": {
    "@type": "Organization",
    "name": "vaemptîness",
    "logo": {
      "@type": "ImageObject",
      "url": "{{ site.url }}/assets/images/logo.png"
    }
  },
  "datePublished": "{{ post.date }}",
  "dateModified": "{{ post.date }}",
  "description": "{{ post.excerpt }}",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "{{ site.url }}/blog/{{ post.slug }}/"
  },
  "keywords": [{% for tag in post.tags %}"{{ tag }}"{% if not loop.last %},{% endif %}{% endfor %}],
  "articleSection": "{{ post.tags[0] }}",
  "inLanguage": "es-ES"
}
</script>
```

---

## Phase 4: Update Individual Page Templates

### Step 4.1: Homepage (index.njk)

Add to front matter:

```yaml
---
layout: base.njk
permalink: /
bodyClass: home-page
seo:
  title: "vaemptîness | Entrenamiento Mental y Mindfulness Barcelona"
  description: "Crea espacio mental. Entrenamiento cerebral basado en mindfulness y filosofía budista. Programas para adultos, equipos, adolescentes y niños en Barcelona."
  keywords: "entrenamiento mental Barcelona, mindfulness Barcelona, meditación Barcelona, psicología budista, reducir ansiedad, claridad mental, rumiación mental"
  ogImage: "/assets/images/og-home.jpg"
  ogType: "website"
---

{% block schema %}
  {% include "schemas/medical-business.njk" %}
  {% include "schemas/website.njk" %}
{% endblock %}
```

### Step 4.2: About Page (sobre-nosotros.njk)

Add to front matter:

```yaml
seo:
  title: "Sobre Nosotros | vaemptîness - Psicología Budista Barcelona"
  description: "Conoce al equipo de vaemptîness. Combinamos psicología occidental y filosofía budista para ofrecer entrenamiento mental efectivo en Barcelona."
  keywords: "psicología budista Barcelona, equipo mindfulness, filosofía budista práctica, entrenadores mentales"
  ogImage: "/assets/images/og-about.jpg"
```

Add after main content:

```html
{% block schema %}
  {% include "schemas/person.njk" %}
{% endblock %}
```

### Step 4.3: Contact Page (contacto.njk)

Add to front matter:

```yaml
seo:
  title: "Contacto | Reserva tu Sesión de Entrenamiento Mental Barcelona"
  description: "Contacta con vaemptîness. Envíanos tus preguntas o reserva tu primera sesión de entrenamiento mental en Barcelona. Online o presencial."
  keywords: "contactar vaemptiness, reservar sesión mindfulness Barcelona, consulta entrenamiento mental"
  ogImage: "/assets/images/og-contact.jpg"
```

### Step 4.4: Program Template (programa.njk)

This template is used by all 4 program pages. Update it to use program-specific SEO data from programs.json.

Add to front matter area (each program page will pass its data):

```yaml
seo:
  title: "{{ program.hero.title }}{{ seo.titleSuffix }}"
  description: "{{ program.hero.description }}"
  keywords: "{{ program.seoKeywords | default('mindfulness Barcelona, entrenamiento mental') }}"
  ogImage: "/assets/images/programs/{{ program.id }}-program.jpg"
  ogType: "article"
```

Add at end of template:

```html
{% block schema %}
  {% include "schemas/psychological-treatment.njk" %}
{% endblock %}
```

### Step 4.5: Learning Page (aprendizaje.njk)

Add to front matter:

```yaml
seo:
  title: "Metodología | Cómo Funciona el Entrenamiento Mental vaemptîness"
  description: "Descubre cómo funciona nuestro método de entrenamiento mental. Combinamos mindfulness, psicología occidental y filosofía budista."
  keywords: "método mindfulness, aprendizaje meditación, cómo funciona mindfulness, metodología entrenamiento mental"
  ogImage: "/assets/images/og-methodology.jpg"
```

### Step 4.6: FAQ Page (faq.njk)

Add to front matter:

```yaml
seo:
  title: "Preguntas Frecuentes | vaemptîness Entrenamiento Mental Barcelona"
  description: "Respuestas a preguntas frecuentes sobre nuestros programas de entrenamiento mental, mindfulness y filosofía budista en Barcelona."
  keywords: "preguntas mindfulness, FAQ entrenamiento mental, dudas meditación, información programas"
  ogImage: "/assets/images/og-faq.jpg"
```

Add at end of template:

```html
{% block schema %}
  {% include "schemas/faq-page.njk" %}
{% endblock %}
```

### Step 4.7: Blog Post Template (blog-post.njk)

Add to front matter handling:

```yaml
seo:
  title: "{{ post.title }} | Blog vaemptîness"
  description: "{{ post.excerpt }}"
  keywords: "{{ post.tags | join(', ') }}"
  ogImage: "{{ post.image }}"
  ogType: "article"
```

Add at end of template:

```html
{% block schema %}
  {% include "schemas/blog-posting.njk" %}
{% endblock %}
```

### Step 4.8: Other Pages

**Reset Page:**
```yaml
seo:
  title: "Reset | Programa de Reinicio Mental vaemptîness"
  description: "Descubre cómo resetear tu mente y crear espacio mental duradero con nuestro programa especializado."
```

**Privacy Policy:**
```yaml
seo:
  title: "Política de Privacidad | vaemptîness"
  description: "Política de privacidad de vaemptîness. Información sobre protección de datos y cumplimiento RGPD."
  robots: "noindex, follow"
```

**Terms:**
```yaml
seo:
  title: "Términos y Condiciones | vaemptîness"
  description: "Términos y condiciones de uso de los servicios de vaemptîness."
  robots: "noindex, follow"
```

---

## Phase 5: Update programs.json with SEO Data

### Step 5.1: Add SEO Fields to programs.json

Add to each program object:

```json
{
  "id": "adult",
  "name": "vaemptîness program",
  "seoKeywords": "entrenamiento mental adultos Barcelona, mindfulness adultos, reducir rumiación, mejorar concentración, claridad cognitiva",
  "audience": {
    "type": "PeopleAudience",
    "minAge": 18,
    "label": "Adultos"
  },
  ...
}
```

**Complete SEO additions for all programs:**

- **adult:** `"seoKeywords": "entrenamiento mental adultos Barcelona, mindfulness adultos, reducir rumiación, mejorar concentración, claridad cognitiva"`
- **teams:** `"seoKeywords": "mindfulness empresas Barcelona, entrenamiento mental equipos, reducir estrés laboral, bienestar corporativo, formación mindfulness"`
- **teen:** `"seoKeywords": "mindfulness adolescentes Barcelona, ansiedad adolescentes, gestión emocional teens, programa jóvenes mindfulness"`
- **kids:** `"seoKeywords": "mindfulness niños Barcelona, meditación niños, atención plena infantil, actividades mindfulness niños"`

---

## Phase 6: Create OG/Twitter Images

### Step 6.1: Image Requirements

Create the following images:

**Dimensions:**
- Open Graph: 1200x630px
- Twitter Card: 1200x600px

**Images Needed:**
1. `og-default.jpg` / `twitter-card-default.jpg` - Default/homepage
2. `og-home.jpg` - Homepage specific
3. `og-about.jpg` - About page
4. `og-contact.jpg` - Contact page
5. `og-methodology.jpg` - Learning page
6. `og-faq.jpg` - FAQ page
7. `programs/adult-program.jpg` - Adult program
8. `programs/teams-program.jpg` - Teams program
9. `programs/teen-program.jpg` - Teen program
10. `programs/kids-program.jpg` - Kids program

**Design Guidelines:**
- Include vaemptîness logo
- Page title in large text
- Accent color #b85c4f (rust)
- Clean, minimalist design
- High contrast for readability

---

## Phase 7: Testing & Validation

### Step 7.1: Validation Tools Checklist

After implementation, test each page with:

- [ ] **Google Rich Results Test**
  - URL: https://search.google.com/test/rich-results
  - Test homepage, program pages, FAQ, blog post
  - Verify schema markup is valid

- [ ] **Schema.org Validator**
  - URL: https://validator.schema.org/
  - Paste page HTML
  - Check for warnings/errors

- [ ] **Facebook Sharing Debugger**
  - URL: https://developers.facebook.com/tools/debug/
  - Test Open Graph tags
  - Verify image displays correctly

- [ ] **Twitter Card Validator**
  - URL: https://cards-dev.twitter.com/validator
  - Test Twitter Card tags

- [ ] **Meta Tags Check**
  - View page source
  - Verify all meta tags present
  - Check canonical URL is correct
  - Ensure no duplicate titles/descriptions

### Step 7.2: Manual Testing Checklist

- [ ] All pages have unique title tags
- [ ] All pages have unique meta descriptions
- [ ] No title tags exceed 60 characters
- [ ] No meta descriptions exceed 155 characters
- [ ] All images load correctly
- [ ] Canonical URLs are correct
- [ ] Schema markup doesn't have errors
- [ ] Open Graph images display in social share preview
- [ ] No broken links in schema markup

---

## Implementation Order (Priority)

### Priority 1 (Do First - 4 hours)
1. Create `seo.json` data file
2. Update `base.njk` with enhanced meta tags
3. Create schemas directory structure
4. Create `local-business.njk` schema
5. Update homepage with SEO data

### Priority 2 (Next - 6 hours)
6. Create all schema include files
7. Update all program pages with SEO data
8. Update about, contact, FAQ pages with SEO data
9. Add SEO fields to programs.json

### Priority 3 (Then - 4 hours)
10. Update blog template with SEO data
11. Update remaining pages (reset, legal)
12. Create placeholder OG/Twitter images

### Priority 4 (Finally - 2 hours)
13. Test all pages with validation tools
14. Fix any errors found
15. Document any placeholders to update (phone, address, social media)

**Total Estimated Time: 16 hours**

---

## Files to Create

### New Files:
1. `src/data/seo.json` - SEO configuration
2. `src/templates/_includes/schemas/local-business.njk`
3. `src/templates/_includes/schemas/medical-business.njk`
4. `src/templates/_includes/schemas/website.njk`
5. `src/templates/_includes/schemas/person.njk`
6. `src/templates/_includes/schemas/psychological-treatment.njk`
7. `src/templates/_includes/schemas/faq-page.njk`
8. `src/templates/_includes/schemas/blog-posting.njk`
9. `src/assets/images/og-*.jpg` (10 images)
10. `src/assets/images/twitter-card-*.jpg` (10 images)

### Files to Modify:
1. `src/templates/_includes/base.njk` - Enhanced head section
2. `src/templates/index.njk` - Add SEO front matter + schema block
3. `src/templates/sobre-nosotros.njk` - Add SEO front matter + schema block
4. `src/templates/contacto.njk` - Add SEO front matter
5. `src/templates/programa.njk` - Add SEO front matter + schema block
6. `src/templates/aprendizaje.njk` - Add SEO front matter
7. `src/templates/blog.njk` - Add SEO front matter
8. `src/templates/blog-post.njk` - Add SEO front matter + schema block
9. `src/templates/faq.njk` - Add SEO front matter + schema block
10. `src/templates/reset.njk` - Add SEO front matter
11. `src/templates/politica-privacidad.njk` - Add SEO front matter
12. `src/templates/terminos-condiciones.njk` - Add SEO front matter
13. `src/data/programs.json` - Add seoKeywords and audience fields
14. `src/data/site.json` - Add socialMedia fields (optional)

---

## Placeholders to Update Later

These items need real data before going live:

- [ ] **Phone number:** Replace `+34-XXX-XXX-XXX` with real number
- [ ] **Physical address:** If you have office, add full address
- [ ] **Social media URLs:** Add Facebook, Instagram, LinkedIn URLs once created
- [ ] **Opening hours:** Verify 9am-8pm Mon-Fri is accurate
- [ ] **Team member credentials:** Add education/certifications to Person schema
- [ ] **OG/Twitter images:** Replace placeholders with professional designs
- [ ] **Blog author bios:** Add detailed author information

---

## Success Criteria

✅ **When complete, you will have:**

1. Every page with optimized, unique title tags and meta descriptions
2. Open Graph tags for social media sharing
3. Twitter Card tags for Twitter sharing
4. Canonical URLs on all pages
5. Schema.org markup (JSON-LD) for:
   - Organization/LocalBusiness (all pages)
   - MedicalBusiness (homepage)
   - Person (about page)
   - PsychologicalTreatment (program pages)
   - FAQPage (FAQ page)
   - BlogPosting (blog posts)
   - WebSite (homepage)
6. All pages passing Google Rich Results Test
7. All pages passing Schema.org validator
8. Social share previews displaying correctly
9. Foundation for future SEO growth

---

## Next Steps After This Implementation

Once meta tags and schema are complete:

1. **Google Search Console**
   - Verify ownership
   - Submit sitemap
   - Monitor indexing

2. **Google Business Profile**
   - Create listing
   - Upload photos
   - Start collecting reviews

3. **Google Analytics 4**
   - Set up tracking
   - Configure goals/conversions

4. **Content Creation**
   - Start blog content calendar
   - Create lead magnets

5. **Link Building**
   - Submit to directories
   - Begin outreach

This implementation gives you the technical SEO foundation to build upon. Let's begin!
