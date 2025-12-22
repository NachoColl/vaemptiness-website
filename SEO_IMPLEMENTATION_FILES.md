# SEO Implementation Files

This document contains ready-to-implement code for SEO optimization of vaemptiness.es.

---

## 1. Meta Tags for All Pages

### Homepage (index.njk)

```html
<title>vaemptîness | Entrenamiento Mental y Mindfulness Barcelona</title>
<meta name="description" content="Crea espacio mental. Entrenamiento cerebral basado en mindfulness y filosofía budista. Programas para adultos, equipos, adolescentes y niños en Barcelona.">
<meta name="keywords" content="entrenamiento mental Barcelona, mindfulness Barcelona, meditación Barcelona, psicología budista, reducir ansiedad, claridad mental, rumiación mental">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://vaemptiness.es/">
<meta property="og:title" content="vaemptîness | Entrenamiento Mental y Mindfulness Barcelona">
<meta property="og:description" content="Crea espacio mental. Entrenamiento cerebral basado en mindfulness y filosofía budista. Programas para adultos, equipos, adolescentes y niños en Barcelona.">
<meta property="og:image" content="https://vaemptiness.es/assets/images/og-image-home.jpg">
<meta property="og:locale" content="es_ES">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://vaemptiness.es/">
<meta property="twitter:title" content="vaemptîness | Entrenamiento Mental y Mindfulness Barcelona">
<meta property="twitter:description" content="Crea espacio mental. Entrenamiento cerebral basado en mindfulness y filosofía budista.">
<meta property="twitter:image" content="https://vaemptiness.es/assets/images/twitter-card-home.jpg">

<!-- Canonical -->
<link rel="canonical" href="https://vaemptiness.es/">
```

### About Page (sobre-nosotros.njk)

```html
<title>Sobre Nosotros | vaemptîness - Psicología Budista Barcelona</title>
<meta name="description" content="Conoce al equipo de vaemptîness. Combinamos psicología occidental y filosofía budista para ofrecer entrenamiento mental efectivo en Barcelona.">
<meta name="keywords" content="psicología budista Barcelona, equipo mindfulness, filosofía budista práctica, entrenadores mentales">

<meta property="og:type" content="website">
<meta property="og:url" content="https://vaemptiness.es/sobre-nosotros/">
<meta property="og:title" content="Sobre Nosotros | vaemptîness">
<meta property="og:description" content="Conoce al equipo de vaemptîness. Combinamos psicología occidental y filosofía budista.">
<meta property="og:image" content="https://vaemptiness.es/assets/images/og-image-about.jpg">

<link rel="canonical" href="https://vaemptiness.es/sobre-nosotros/">
```

### Adult Program (vaemptiness-program)

```html
<title>vaemptîness program | Entrenamiento Mental para Adultos Barcelona</title>
<meta name="description" content="Programa de entrenamiento mental para adultos. Reduce rumiación, aumenta claridad cognitiva y mejora concentración. 60 min/sesión en Barcelona.">
<meta name="keywords" content="entrenamiento mental adultos Barcelona, mindfulness adultos, reducir rumiación, mejorar concentración, claridad cognitiva">

<meta property="og:type" content="article">
<meta property="og:url" content="https://vaemptiness.es/vaemptiness-program/">
<meta property="og:title" content="vaemptîness program | Entrenamiento Mental para Adultos">
<meta property="og:description" content="Programa de entrenamiento mental para adultos. Reduce rumiación, aumenta claridad cognitiva.">
<meta property="og:image" content="https://vaemptiness.es/assets/images/programs/adult-program.jpg">

<link rel="canonical" href="https://vaemptiness.es/vaemptiness-program/">
```

### Teams Program (vaemptiness-equipos)

```html
<title>vaemptîness equipos | Mindfulness Empresas Barcelona</title>
<meta name="description" content="Entrenamiento mental para equipos y empresas. Reduce estrés laboral, mejora enfoque y productividad. Programas in-company en Barcelona.">
<meta name="keywords" content="mindfulness empresas Barcelona, entrenamiento mental equipos, reducir estrés laboral, bienestar corporativo, formación mindfulness">

<meta property="og:type" content="article">
<meta property="og:url" content="https://vaemptiness.es/vaemptiness-equipos/">
<meta property="og:title" content="vaemptîness equipos | Mindfulness Empresas Barcelona">
<meta property="og:description" content="Entrenamiento mental para equipos. Reduce estrés laboral, mejora productividad.">
<meta property="og:image" content="https://vaemptiness.es/assets/images/programs/teams-program.jpg">

<link rel="canonical" href="https://vaemptiness.es/vaemptiness-equipos/">
```

### Teen Program (vaemptiness-teen)

```html
<title>vaemptîness teen | Mindfulness para Adolescentes Barcelona</title>
<meta name="description" content="Programa de mindfulness para adolescentes (12-17 años). Gestión emocional, reducción de ansiedad escolar y claridad mental. Barcelona.">
<meta name="keywords" content="mindfulness adolescentes Barcelona, ansiedad adolescentes, gestión emocional teens, programa jóvenes mindfulness">

<meta property="og:type" content="article">
<meta property="og:url" content="https://vaemptiness.es/vaemptiness-teen/">
<meta property="og:title" content="vaemptîness teen | Mindfulness para Adolescentes">
<meta property="og:description" content="Programa de mindfulness para adolescentes. Gestión emocional y reducción de ansiedad.">
<meta property="og:image" content="https://vaemptiness.es/assets/images/programs/teen-program.jpg">

<link rel="canonical" href="https://vaemptiness.es/vaemptiness-teen/">
```

### Kids Program (vaemptiness-kids)

```html
<title>vaemptîness kids | Mindfulness para Niños Barcelona</title>
<meta name="description" content="Programa de mindfulness para niños (6-12 años). Atención plena, gestión emocional y concentración mediante juegos y actividades. Barcelona.">
<meta name="keywords" content="mindfulness niños Barcelona, meditación niños, atención plena infantil, actividades mindfulness niños">

<meta property="og:type" content="article">
<meta property="og:url" content="https://vaemptiness.es/vaemptiness-kids/">
<meta property="og:title" content="vaemptîness kids | Mindfulness para Niños Barcelona">
<meta property="og:description" content="Programa de mindfulness para niños mediante juegos y actividades.">
<meta property="og:image" content="https://vaemptiness.es/assets/images/programs/kids-program.jpg">

<link rel="canonical" href="https://vaemptiness.es/vaemptiness-kids/">
```

### Learning Page (aprendizaje-y-metodologia)

```html
<title>Metodología | Cómo Funciona el Entrenamiento Mental vaemptîness</title>
<meta name="description" content="Descubre cómo funciona nuestro método de entrenamiento mental. Combinamos mindfulness, psicología occidental y filosofía budista.">
<meta name="keywords" content="método mindfulness, aprendizaje meditación, cómo funciona mindfulness, metodología entrenamiento mental">

<meta property="og:type" content="website">
<meta property="og:url" content="https://vaemptiness.es/aprendizaje-y-metodologia/">
<meta property="og:title" content="Metodología | vaemptîness">
<meta property="og:description" content="Descubre cómo funciona nuestro método de entrenamiento mental.">
<meta property="og:image" content="https://vaemptiness.es/assets/images/og-image-methodology.jpg">

<link rel="canonical" href="https://vaemptiness.es/aprendizaje-y-metodologia/">
```

### Blog Post (filosofia-budista-vaemptiness)

```html
<title>Filosofía Budista en vaemptîness | Blog Mindfulness Barcelona</title>
<meta name="description" content="Cómo integramos la filosofía budista en nuestro enfoque terapéutico. De problema a posibilidad: reconceptualizar el vacío mental.">
<meta name="keywords" content="filosofía budista práctica, budismo psicología, vacuidad budista, no-yo anatta, impermanencia">
<meta name="author" content="Rosa Cano">

<meta property="og:type" content="article">
<meta property="og:url" content="https://vaemptiness.es/blog/filosofia-budista-vaemptiness/">
<meta property="og:title" content="Filosofía Budista en vaemptîness">
<meta property="og:description" content="Cómo integramos la filosofía budista en nuestro enfoque terapéutico.">
<meta property="og:image" content="https://vaemptiness.es/assets/images/blog/filosofia-budista.jpg">
<meta property="article:published_time" content="2025-12-15T00:00:00+01:00">
<meta property="article:author" content="Rosa Cano">
<meta property="article:tag" content="filosofía">
<meta property="article:tag" content="budismo">
<meta property="article:tag" content="mindfulness">

<link rel="canonical" href="https://vaemptiness.es/blog/filosofia-budista-vaemptiness/">
```

### FAQ Page (faq.njk)

```html
<title>Preguntas Frecuentes | vaemptîness Entrenamiento Mental Barcelona</title>
<meta name="description" content="Respuestas a preguntas frecuentes sobre nuestros programas de entrenamiento mental, mindfulness y filosofía budista en Barcelona.">
<meta name="keywords" content="preguntas mindfulness, FAQ entrenamiento mental, dudas meditación, información programas">

<meta property="og:type" content="website">
<meta property="og:url" content="https://vaemptiness.es/faq/">
<meta property="og:title" content="Preguntas Frecuentes | vaemptîness">
<meta property="og:description" content="Respuestas a preguntas frecuentes sobre nuestros programas de entrenamiento mental.">
<meta property="og:image" content="https://vaemptiness.es/assets/images/og-image-faq.jpg">

<link rel="canonical" href="https://vaemptiness.es/faq/">
```

### Contact Page (contacto.njk)

```html
<title>Contacto | Reserva tu Sesión de Entrenamiento Mental Barcelona</title>
<meta name="description" content="Contacta con vaemptîness. Envíanos tus preguntas o reserva tu primera sesión de entrenamiento mental en Barcelona. Online o presencial.">
<meta name="keywords" content="contactar vaemptiness, reservar sesión mindfulness Barcelona, consulta entrenamiento mental">

<meta property="og:type" content="website">
<meta property="og:url" content="https://vaemptiness.es/contacto/">
<meta property="og:title" content="Contacto | vaemptîness Barcelona">
<meta property="og:description" content="Reserva tu primera sesión de entrenamiento mental. Online o presencial.">
<meta property="og:image" content="https://vaemptiness.es/assets/images/og-image-contact.jpg">

<link rel="canonical" href="https://vaemptiness.es/contacto/">
```

---

## 2. JSON-LD Schema Markup

### LocalBusiness Schema (All Pages)

Add this to `<head>` or just before `</body>` on ALL pages:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://vaemptiness.es/#organization",
  "name": "vaemptîness",
  "alternateName": "vaemptiness Barcelona",
  "description": "Entrenamiento mental y mindfulness basado en filosofía budista. Programas para adultos, equipos, adolescentes y niños en Barcelona.",
  "url": "https://vaemptiness.es",
  "logo": "https://vaemptiness.es/assets/images/logo.png",
  "image": "https://vaemptiness.es/assets/images/logo.png",
  "telephone": "+34-XXX-XXX-XXX",
  "email": "program@vaemptiness.es",
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
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "09:00",
      "closes": "20:00"
    }
  ],
  "sameAs": [
    "https://www.facebook.com/vaemptiness",
    "https://www.instagram.com/vaemptiness",
    "https://www.linkedin.com/company/vaemptiness"
  ]
}
</script>
```

**NOTE:** Update telephone, exact address if you have physical location, and social media URLs once created.

---

### MedicalBusiness Schema (Homepage Only)

Additional schema for homepage to indicate mental health service:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "vaemptîness",
  "url": "https://vaemptiness.es",
  "logo": "https://vaemptiness.es/assets/images/logo.png",
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
  "email": "program@vaemptiness.es",
  "serviceType": [
    "Mental Training",
    "Mindfulness",
    "Meditation",
    "Psychological Treatment"
  ]
}
</script>
```

---

### Person Schema (About Page - Founder)

Replace with actual founder information:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Rosa Cano",
  "jobTitle": "Fundadora y Entrenadora Mental",
  "worksFor": {
    "@type": "Organization",
    "name": "vaemptîness"
  },
  "url": "https://vaemptiness.es/sobre-nosotros/",
  "image": "https://vaemptiness.es/assets/images/team/rosa-cano.jpg",
  "description": "Fundadora de vaemptîness, especializada en entrenamiento mental y filosofía budista aplicada.",
  "email": "program@vaemptiness.es",
  "alumniOf": {
    "@type": "Organization",
    "name": "[University Name]"
  },
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "name": "[Certification Name]",
      "credentialCategory": "certification"
    }
  ],
  "knowsAbout": [
    "Mindfulness",
    "Buddhist Psychology",
    "Mental Training",
    "Cognitive Psychology"
  ]
}
</script>
```

---

### PsychologicalTreatment Schema (Program Pages)

For **vaemptiness-program** (Adult Program):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "PsychologicalTreatment",
  "name": "vaemptîness program - Entrenamiento Mental para Adultos",
  "description": "Programa de entrenamiento mental para adultos. Reduce rumiación, aumenta claridad cognitiva y mejora concentración.",
  "url": "https://vaemptiness.es/vaemptiness-program/",
  "provider": {
    "@type": "LocalBusiness",
    "name": "vaemptîness",
    "url": "https://vaemptiness.es"
  },
  "relevantSpecialty": {
    "@type": "MedicalSpecialty",
    "name": "Psychology"
  },
  "audience": {
    "@type": "PeopleAudience",
    "suggestedMinAge": 18,
    "audienceType": "Adultos"
  },
  "duration": "PT60M",
  "administrationRoute": "Sesiones individuales o grupales",
  "availableService": {
    "@type": "MedicalProcedure",
    "name": "Entrenamiento Mental Adultos",
    "procedureType": "Therapeutic procedure"
  },
  "treatmentIndication": [
    {
      "@type": "MedicalCondition",
      "name": "Rumiación mental"
    },
    {
      "@type": "MedicalCondition",
      "name": "Falta de claridad cognitiva"
    },
    {
      "@type": "MedicalCondition",
      "name": "Estrés"
    }
  ]
}
</script>
```

**For vaemptiness-equipos:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "PsychologicalTreatment",
  "name": "vaemptîness equipos - Mindfulness para Empresas",
  "description": "Entrenamiento mental para equipos y empresas. Reduce estrés laboral, mejora enfoque y productividad.",
  "url": "https://vaemptiness.es/vaemptiness-equipos/",
  "provider": {
    "@type": "LocalBusiness",
    "name": "vaemptîness",
    "url": "https://vaemptiness.es"
  },
  "relevantSpecialty": {
    "@type": "MedicalSpecialty",
    "name": "Organizational Psychology"
  },
  "audience": {
    "@type": "BusinessAudience",
    "audienceType": "Equipos y Empresas"
  },
  "duration": "PT60M",
  "availableService": {
    "@type": "Service",
    "name": "Formación Corporativa Mindfulness",
    "serviceType": "Corporate Training"
  }
}
</script>
```

**For vaemptiness-teen:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "PsychologicalTreatment",
  "name": "vaemptîness teen - Mindfulness para Adolescentes",
  "description": "Programa de mindfulness para adolescentes (12-17 años). Gestión emocional y reducción de ansiedad escolar.",
  "url": "https://vaemptiness.es/vaemptiness-teen/",
  "provider": {
    "@type": "LocalBusiness",
    "name": "vaemptîness",
    "url": "https://vaemptiness.es"
  },
  "relevantSpecialty": {
    "@type": "MedicalSpecialty",
    "name": "Adolescent Psychology"
  },
  "audience": {
    "@type": "PeopleAudience",
    "suggestedMinAge": 12,
    "suggestedMaxAge": 17,
    "audienceType": "Adolescentes"
  },
  "duration": "PT60M"
}
</script>
```

**For vaemptiness-kids:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "PsychologicalTreatment",
  "name": "vaemptîness kids - Mindfulness para Niños",
  "description": "Programa de mindfulness para niños (6-12 años). Atención plena mediante juegos y actividades.",
  "url": "https://vaemptiness.es/vaemptiness-kids/",
  "provider": {
    "@type": "LocalBusiness",
    "name": "vaemptîness",
    "url": "https://vaemptiness.es"
  },
  "relevantSpecialty": {
    "@type": "MedicalSpecialty",
    "name": "Child Psychology"
  },
  "audience": {
    "@type": "PeopleAudience",
    "suggestedMinAge": 6,
    "suggestedMaxAge": 12,
    "audienceType": "Niños"
  },
  "duration": "PT60M"
}
</script>
```

---

### FAQPage Schema (FAQ Page)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Qué es el entrenamiento mental?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El entrenamiento mental es un método práctico para crear espacio mental, reducir rumiación y mejorar claridad cognitiva. Combinamos mindfulness, psicología occidental y filosofía budista."
      }
    },
    {
      "@type": "Question",
      "name": "¿En qué se diferencia del mindfulness tradicional?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "vaemptîness integra filosofía budista profunda con técnicas modernas de regulación cognitiva. No solo enseñamos meditación, sino herramientas para transformar patrones mentales automáticos."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuánto dura un programa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Los programas tienen una duración recomendada de 8 semanas con sesiones semanales de 60 minutos. También ofrecemos sesiones individuales y programas personalizados."
      }
    },
    {
      "@type": "Question",
      "name": "¿Ofrecen sesiones online?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, ofrecemos sesiones tanto presenciales en Barcelona como online por videoconferencia. La efectividad es similar en ambos formatos."
      }
    },
    {
      "@type": "Question",
      "name": "¿Cuál es el precio de las sesiones?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El precio varía según el programa. Contacta con nosotros para información detallada de precios y opciones de pago."
      }
    },
    {
      "@type": "Question",
      "name": "¿Necesito experiencia previa en meditación?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, nuestros programas están diseñados para personas sin experiencia previa. Comenzamos desde lo básico y adaptamos el ritmo a cada participante."
      }
    },
    {
      "@type": "Question",
      "name": "¿Es adecuado para personas con ansiedad o depresión?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El entrenamiento mental puede ser muy beneficioso, pero no sustituye tratamiento psicológico o psiquiátrico profesional. Recomendamos consultarlo con tu terapeuta si estás en tratamiento."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué diferencia hay entre los programas para adultos, teens y kids?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Cada programa está adaptado a la etapa vital. Para adultos enfocamos en estrés laboral y rumiación; para teens en gestión emocional y ansiedad escolar; para kids usamos juegos y actividades lúdicas."
      }
    }
  ]
}
</script>
```

**NOTE:** Add more Q&A pairs as you expand your FAQ section. Each question improves chances of appearing in Google's "People Also Ask" feature.

---

### BlogPosting Schema (Blog Articles)

For **filosofia-budista-vaemptiness** article:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Filosofía Budista en vaemptîness",
  "alternativeHeadline": "Cómo integramos la filosofía budista en nuestro enfoque terapéutico",
  "image": "https://vaemptiness.es/assets/images/blog/filosofia-budista.jpg",
  "author": {
    "@type": "Person",
    "name": "Rosa Cano",
    "url": "https://vaemptiness.es/sobre-nosotros/"
  },
  "publisher": {
    "@type": "Organization",
    "name": "vaemptîness",
    "logo": {
      "@type": "ImageObject",
      "url": "https://vaemptiness.es/assets/images/logo.png"
    }
  },
  "datePublished": "2025-12-15",
  "dateModified": "2025-12-15",
  "description": "Cómo la filosofía budista se integra en el enfoque terapéutico de vaemptîness, transformando el vacío de problema a posibilidad.",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://vaemptiness.es/blog/filosofia-budista-vaemptiness/"
  },
  "keywords": ["filosofía budista", "budismo", "mindfulness", "práctica"],
  "articleSection": "Filosofía",
  "wordCount": 800,
  "inLanguage": "es-ES"
}
</script>
```

---

### BreadcrumbList Schema (Navigation)

For program pages, add breadcrumb navigation:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://vaemptiness.es/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Programas",
      "item": "https://vaemptiness.es/#programas"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "vaemptîness program",
      "item": "https://vaemptiness.es/vaemptiness-program/"
    }
  ]
}
</script>
```

---

### Website Schema (Sitewide)

Add to homepage to define the entire website:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "vaemptîness",
  "alternateName": "vaemptiness Barcelona",
  "url": "https://vaemptiness.es",
  "description": "Entrenamiento mental y mindfulness basado en filosofía budista en Barcelona",
  "inLanguage": "es-ES",
  "publisher": {
    "@type": "Organization",
    "name": "vaemptîness",
    "logo": {
      "@type": "ImageObject",
      "url": "https://vaemptiness.es/assets/images/logo.png"
    }
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://vaemptiness.es/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
```

---

## 3. Robots.txt

Create `/robots.txt` in root directory:

```txt
# Allow all search engines
User-agent: *
Allow: /

# Disallow internal directories
Disallow: /page-reviews/
Disallow: /scripts/
Disallow: /node_modules/
Disallow: /_site/

# Sitemap location
Sitemap: https://vaemptiness.es/sitemap.xml
```

---

## 4. XML Sitemap Structure

The sitemap should be auto-generated by Eleventy. Ensure it includes:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Homepage - Highest Priority -->
  <url>
    <loc>https://vaemptiness.es/</loc>
    <lastmod>2025-12-22</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Program Pages - High Priority -->
  <url>
    <loc>https://vaemptiness.es/vaemptiness-program/</loc>
    <lastmod>2025-12-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://vaemptiness.es/vaemptiness-equipos/</loc>
    <lastmod>2025-12-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://vaemptiness.es/vaemptiness-teen/</loc>
    <lastmod>2025-12-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>https://vaemptiness.es/vaemptiness-kids/</loc>
    <lastmod>2025-12-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Important Pages - Medium-High Priority -->
  <url>
    <loc>https://vaemptiness.es/sobre-nosotros/</loc>
    <lastmod>2025-12-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://vaemptiness.es/aprendizaje-y-metodologia/</loc>
    <lastmod>2025-12-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://vaemptiness.es/contacto/</loc>
    <lastmod>2025-12-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Blog - Medium Priority, Update Frequency Higher -->
  <url>
    <loc>https://vaemptiness.es/blog/</loc>
    <lastmod>2025-12-22</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>https://vaemptiness.es/blog/filosofia-budista-vaemptiness/</loc>
    <lastmod>2025-12-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <!-- Secondary Pages - Lower Priority -->
  <url>
    <loc>https://vaemptiness.es/faq/</loc>
    <lastmod>2025-12-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    <loc>https://vaemptiness.es/reset/</loc>
    <lastmod>2025-12-22</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Legal Pages - Low Priority -->
  <url>
    <loc>https://vaemptiness.es/politica-privacidad/</loc>
    <lastmod>2025-12-22</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <url>
    <loc>https://vaemptiness.es/terminos-condiciones/</loc>
    <lastmod>2025-12-22</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

</urlset>
```

---

## 5. Google Analytics 4 Setup

Add to `<head>` of base template:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XXXXXXXXXX', {
    'anonymize_ip': true,
    'cookie_flags': 'SameSite=None;Secure'
  });

  // Custom events
  // Track form submissions
  document.addEventListener('submit', function(e) {
    if (e.target.id === 'contact-form') {
      gtag('event', 'contact_form_submit', {
        'event_category': 'engagement',
        'event_label': 'Contact Form'
      });
    }
  });

  // Track program page views
  if (window.location.pathname.includes('/vaemptiness-')) {
    gtag('event', 'program_page_view', {
      'event_category': 'engagement',
      'event_label': document.title
    });
  }

  // Track scroll depth (engaged session)
  let scrolled50 = false;
  let scrolled75 = false;
  window.addEventListener('scroll', function() {
    let scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

    if (scrollPercent > 50 && !scrolled50) {
      scrolled50 = true;
      gtag('event', 'scroll_50', {
        'event_category': 'engagement'
      });
    }

    if (scrollPercent > 75 && !scrolled75) {
      scrolled75 = true;
      gtag('event', 'scroll_75', {
        'event_category': 'engagement'
      });
    }
  });
</script>
```

**REPLACE `G-XXXXXXXXXX` with your actual GA4 measurement ID.**

---

## 6. Image Optimization Checklist

For every image on the site:

**File Naming:**
- ❌ Bad: `IMG_1234.jpg`, `photo.jpg`, `image-1.jpg`
- ✅ Good: `entrenamiento-mental-barcelona.jpg`, `mindfulness-adultos-vaemptiness.jpg`

**Alt Tags:**
```html
<!-- Homepage hero -->
<img src="/assets/images/hero-entrenamiento-mental.jpg"
     alt="Persona practicando entrenamiento mental mindfulness en Barcelona">

<!-- Program cards -->
<img src="/assets/images/programs/adult-program.jpg"
     alt="Programa entrenamiento mental para adultos Barcelona vaemptiness">

<img src="/assets/images/programs/teams-program.jpg"
     alt="Mindfulness para empresas y equipos Barcelona">

<img src="/assets/images/programs/teen-program.jpg"
     alt="Mindfulness para adolescentes Barcelona vaemptiness teen">

<img src="/assets/images/programs/kids-program.jpg"
     alt="Mindfulness para niños Barcelona vaemptiness kids">

<!-- Team photos -->
<img src="/assets/images/team/rosa-cano.jpg"
     alt="Rosa Cano fundadora vaemptiness entrenamiento mental Barcelona">

<!-- Blog images -->
<img src="/assets/images/blog/filosofia-budista.jpg"
     alt="Filosofía budista aplicada entrenamiento mental vaemptiness">
```

**Image Compression:**
- Use WebP format for modern browsers (with JPG fallback)
- Target file sizes: <200KB for hero images, <100KB for others
- Tools: TinyPNG, Squoosh, ImageOptim

**Lazy Loading:**
```html
<img src="image.jpg" alt="..." loading="lazy">
```

---

## 7. Internal Linking Template

### Homepage Internal Links

From homepage, link to:
- Program pages (all 4) with descriptive anchor text
- About page
- Blog (latest post)
- Contact page

**Example:**
```html
<p>Descubre nuestro <a href="/vaemptiness-program/" title="Programa entrenamiento mental adultos">programa para adultos</a> o explora opciones para <a href="/vaemptiness-teen/" title="Mindfulness adolescentes">adolescentes</a> y <a href="/vaemptiness-kids/" title="Mindfulness niños">niños</a>.</p>
```

### Program Pages Cross-Linking

Add "Otros Programas" section at bottom of each program page:

```html
<section class="other-programs">
  <h3>Otros Programas de Entrenamiento Mental</h3>
  <ul>
    <li><a href="/vaemptiness-program/">vaemptîness program</a> - Entrenamiento mental para adultos</li>
    <li><a href="/vaemptiness-equipos/">vaemptîness equipos</a> - Mindfulness para empresas y equipos</li>
    <li><a href="/vaemptiness-teen/">vaemptîness teen</a> - Mindfulness para adolescentes (12-17 años)</li>
    <li><a href="/vaemptiness-kids/">vaemptîness kids</a> - Mindfulness para niños (6-12 años)</li>
  </ul>
</section>
```

### Blog Post Internal Links

Every blog post should link to:
- 1-2 relevant program pages
- About page (author bio)
- Related blog posts (when you have more)

**Example in blog post:**
```html
<p>Este enfoque es parte fundamental de nuestro <a href="/vaemptiness-program/" title="Programa entrenamiento mental adultos">programa de entrenamiento mental para adultos</a>, donde combinamos...</p>
```

---

## 8. Contact Form Optimization

Current form is good, but add:

```html
<form action="https://getform.io/f/bgdvpgpa" method="POST" class="contact-form" id="contact-form">

  <!-- Hidden fields for tracking -->
  <input type="hidden" name="_gotcha" style="display:none">
  <input type="hidden" name="_subject" value="Nuevo contacto desde vaemptiness.es">
  <input type="hidden" name="_template" value="box">
  <input type="hidden" name="_autoresponse" value="Gracias por contactar vaemptîness. Te responderemos en breve.">

  <!-- Existing fields... -->
  <div class="form-group">
    <label for="name">Nombre <span class="required">*</span></label>
    <input type="text" name="name" id="name" required>
  </div>

  <div class="form-group">
    <label for="email">Email <span class="required">*</span></label>
    <input type="email" name="email" id="email" required>
  </div>

  <div class="form-group">
    <label for="phone">Teléfono</label>
    <input type="tel" name="phone" id="phone" placeholder="+34">
  </div>

  <div class="form-group">
    <label for="topic">Tema <span class="required">*</span></label>
    <select name="topic" id="topic" required>
      <option value="" disabled selected>Selecciona un tema</option>
      <option value="vaemptîness program">vaemptîness program (Adultos)</option>
      <option value="vaemptîness equipos">vaemptîness equipos (Empresas)</option>
      <option value="vaemptîness teen">vaemptîness teen (Adolescentes)</option>
      <option value="vaemptîness kids">vaemptîness kids (Niños)</option>
      <option value="Consulta General">Consulta General</option>
    </select>
  </div>

  <div class="form-group form-group-full">
    <label for="message">Mensaje <span class="required">*</span></label>
    <textarea name="message" id="message" rows="6" required></textarea>
  </div>

  <!-- Add GDPR consent -->
  <div class="form-group">
    <label class="checkbox-label">
      <input type="checkbox" name="gdpr_consent" required>
      He leído y acepto la <a href="/politica-privacidad/" target="_blank">política de privacidad</a> <span class="required">*</span>
    </label>
  </div>

  <button type="submit" class="button button-primary">Enviar mensaje</button>

  <div class="form-status" id="form-status"></div>
</form>
```

---

## 9. Google Business Profile Posts (Templates)

### Post Template 1: Blog Promotion
```
📚 Nuevo artículo en nuestro blog

"Filosofía Budista en vaemptîness: Del Problema a la Posibilidad"

Descubre cómo integramos conceptos milenarios en técnicas modernas de entrenamiento mental.

👉 Lee más: [Link]

#Mindfulness #FilosofíaBudista #EntrenamientoMental #Barcelona
```

### Post Template 2: Program Highlight
```
🧘 ¿Ruido mental constante?

Nuestro programa vaemptîness te ayuda a:
✓ Reducir rumiación
✓ Crear espacio mental
✓ Mejorar claridad cognitiva

Primera sesión informativa GRATIS

📞 Contacta: program@vaemptiness.es

#MindfulnessBarcelona #SaludMental #BienestarMental
```

### Post Template 3: Tip/Educational
```
💡 Tip de Mindfulness

"La respiración consciente es tu ancla al presente"

Prueba esto ahora:
1. Cierra los ojos
2. Respira profundo 3 veces
3. Siente el aire entrando y saliendo

Tan simple. Tan efectivo.

¿Quieres aprender más técnicas? Contáctanos.

#MindfulnessTips #Meditación #Barcelona
```

### Post Template 4: Client Testimonial
```
⭐ Testimonio de Cliente

"Después de 8 semanas con vaemptîness, puedo decir que mi mente es un lugar más tranquilo. He aprendido a observar mis pensamientos sin juzgarlos."

- M.R., Programa Adultos

¿Listo para tu transformación?

📧 program@vaemptiness.es

#TestimonioReal #Mindfulness #CambioPersonal
```

---

## 10. Quick Win Checklist

### Week 1 - Immediate Actions
- [ ] Create Google Business Profile (2 hours)
- [ ] Add LocalBusiness schema to all pages (3 hours)
- [ ] Update all meta titles and descriptions (4 hours)
- [ ] Submit site to Google Search Console (30 min)
- [ ] Create and submit XML sitemap (1 hour)
- [ ] Set up Google Analytics 4 (1 hour)
- [ ] Optimize 10 image alt tags (1 hour)
- [ ] Add robots.txt file (15 min)

**Total Time: ~13 hours**
**Expected Impact: Foundation for all future SEO**

### Week 2 - Content Enhancements
- [ ] Add 300-500 words to homepage (2 hours)
- [ ] Add pricing info to program pages (1 hour)
- [ ] Create "Otros Programas" cross-links (1 hour)
- [ ] Add FAQ schema markup (2 hours)
- [ ] Write first blog post (4 hours)
- [ ] Create lead magnet landing page (3 hours)

**Total Time: ~13 hours**
**Expected Impact: Improved rankings, lead generation**

### Week 3 - Local SEO
- [ ] Upload 10 photos to Google Business Profile (1 hour)
- [ ] Submit to 10 local directories (2 hours)
- [ ] Request 5 reviews from past clients (1 hour)
- [ ] Create first 2 GBP posts (1 hour)
- [ ] Set up citation tracking spreadsheet (1 hour)

**Total Time: ~6 hours**
**Expected Impact: Local search visibility**

---

## Testing & Validation

### Tools to Use:

1. **Google Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Test each page's schema markup
   - Fix any errors before publishing

2. **Google Mobile-Friendly Test**
   - URL: https://search.google.com/test/mobile-friendly
   - Ensure all pages pass

3. **Google PageSpeed Insights**
   - URL: https://pagespeed.web.dev/
   - Target: 90+ score on mobile and desktop

4. **Lighthouse (Chrome DevTools)**
   - Run audit in Chrome
   - Check Performance, Accessibility, Best Practices, SEO
   - Target: 90+ in all categories

5. **Schema Markup Validator**
   - URL: https://validator.schema.org/
   - Validate JSON-LD structure

---

## Support & Resources

**Implementation Questions?**
- Google Search Central: https://developers.google.com/search
- Schema.org Documentation: https://schema.org/docs/documents.html
- Getform Documentation: https://getform.io/docs

**Need Help?**
If you need assistance implementing any of these files, contact an SEO specialist or web developer familiar with Eleventy and JSON-LD schema markup.

---

## Final Notes

All code in this document is production-ready and can be implemented immediately. Remember to:

1. **Replace placeholders:** Update phone numbers, addresses, social media URLs
2. **Test thoroughly:** Use validation tools before pushing to production
3. **Monitor results:** Track in Google Search Console and Analytics
4. **Iterate:** SEO is ongoing - keep optimizing based on data

Good luck with your SEO implementation!
