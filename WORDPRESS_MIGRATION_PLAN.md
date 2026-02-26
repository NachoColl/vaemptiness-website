# WordPress Migration Plan - vaemptîness Website

## Table of Contents
1. [Overview](#overview)
2. [Pre-Migration Preparation](#pre-migration-preparation)
3. [WordPress Installation & Setup](#wordpress-installation--setup)
4. [Theme Selection & Configuration](#theme-selection--configuration)
5. [Content Migration](#content-migration)
6. [Design System Migration](#design-system-migration)
7. [Components & Layouts](#components--layouts)
8. [Assets Migration](#assets-migration)
9. [Interactive Features & JavaScript](#interactive-features--javascript)
10. [Forms Implementation](#forms-implementation)
11. [SEO & Schema Markup](#seo--schema-markup)
12. [Testing & Quality Assurance](#testing--quality-assurance)
13. [Deployment & Go-Live](#deployment--go-live)

---

## Overview

### Current Site Architecture
- **Static Site Generator**: Eleventy (11ty)
- **Template Engine**: Nunjucks (.njk files)
- **Data Storage**: JSON files in `src/data/`
- **CSS**: Custom CSS with design tokens and variables
- **Hosting**: GitHub Pages
- **Total Pages**: ~15 pages + blog posts
- **Languages**: Spanish (primary)

### Migration Scope
- **14 main pages** (home, about, contact, FAQ, programs, legal, etc.)
- **8 blog posts** (content stored in JSON)
- **4 program pages** (adults, teams, teens, kids)
- **1 landing page** (empresas - business workshops)
- **Design system** with custom CSS variables
- **Interactive components** (FAQ accordion, contact forms, category filters)
- **Assets**: 50+ images (programs, blog, team, OG images)
- **JavaScript**: 7 custom JS files
- **Schema.org markup** for SEO

---

## Pre-Migration Preparation

### Step 1: Audit Current Content

**1.1 Create Content Inventory Spreadsheet**

Create a spreadsheet with these columns:
- Page Title
- URL/Slug
- Template Used
- Data File Path
- Content Sections
- Special Components
- Images Used
- SEO Metadata

**1.2 Document Current Pages**

Main Pages:
```
/ (index.njk) → Home page with hero, principles, programs
/sobre-nosotros/ (sobre-nosotros.njk) → About us
/contacto/ (contacto.njk) → Contact form
/faq/ (faq.njk) → FAQ with accordion
/blog/ (blog.njk) → Blog listing
/vaemptiness-program/ (aprendizaje.njk) → Learning methodology
/vaemptiness-adultos/ (programa.njk) → Adults program
/vaemptiness-equipos/ (programa.njk) → Teams program
/vaemptiness-teen/ (programa.njk) → Teen program
/vaemptiness-kids/ (programa.njk) → Kids program
/taller-empresas/ (empresas.njk) → Business workshop landing
/on-off/ (on-off.njk) → On-Off program
/reset/ (reset.njk) → Reset program
/politica-privacidad/ → Privacy policy
/terminos-condiciones/ → Terms & conditions
```

Blog Posts (8 total):
```
/blog/entrenamiento-mental/
/blog/entrenar-atencion/
/blog/espacio-estimulo-respuesta/
/blog/ciencia-budista-vaemptiness/
/blog/filosofia-budista-vaemptiness/
/blog/mente-en-bucle/
/blog/responder-vs-reaccionar/
/blog/rumiacion-mental/
```

**1.3 Export Current Content to Structured Format**

Create a migration folder:
```bash
mkdir wordpress-migration
cd wordpress-migration
mkdir content images css javascript
```

For each page, create a markdown file with:
- Title
- Slug
- SEO metadata
- Full content (extract from JSON)
- Required images list

### Step 2: Backup Everything

```bash
# Create complete backup
cp -r /mnt/x/Git/nacho.coll/vaemptiness-website wordpress-site-backup-$(date +%Y%m%d)

# Export all JSON data
cp -r src/data/pages wordpress-migration/content/

# Copy all assets
cp -r src/assets wordpress-migration/assets/
```

### Step 3: Environment Setup

**Requirements:**
- Local development environment (XAMPP, MAMP, or Local by Flywheel)
- PHP 8.0+
- MySQL 5.7+ or MariaDB
- WordPress 6.4+
- Git for version control

---

## WordPress Installation & Setup

### Step 1: Local WordPress Installation

**Option A: Using Local by Flywheel (Recommended)**

1. Download Local by Flywheel from [localwp.com](https://localwp.com)
2. Install and launch Local
3. Click "Create a new site"
4. Site name: `vaemptiness-local`
5. Choose PHP 8.1, MySQL 8.0
6. Create admin account (save credentials)
7. Click "Add Site"

**Option B: Manual Installation**

```bash
# Download WordPress
wget https://wordpress.org/latest.tar.gz
tar -xzvf latest.tar.gz

# Create database
mysql -u root -p
CREATE DATABASE vaemptiness_wp;
CREATE USER 'vaemptiness'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON vaemptiness_wp.* TO 'vaemptiness'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Configure wp-config.php
cp wordpress/wp-config-sample.php wordpress/wp-config.php
# Edit database credentials in wp-config.php
```

### Step 2: Essential WordPress Configuration

**2.1 Permalink Structure**
- Go to Settings → Permalinks
- Select "Post name" structure
- Save changes

**2.2 Site Settings**
- Settings → General
  - Site Title: `vaemptîness`
  - Tagline: `mental training`
  - WordPress Address: Your local URL
  - Site Address: Your local URL
  - Email: `program@vaemptiness.com`
  - Site Language: Español
  - Timezone: Europe/Madrid

**2.3 Reading Settings**
- Settings → Reading
- Posts page: Create and select "Blog"
- Homepage: Create and select "Home"

### Step 3: Install Required Plugins

**Essential Plugins:**

```
1. Advanced Custom Fields (ACF) PRO - For custom fields and flexible content
2. Yoast SEO - For SEO metadata and schema
3. Contact Form 7 - For contact forms
4. WP Migrate DB - For database backup/migration
5. Regenerate Thumbnails - For image optimization
6. WP Super Cache or WP Rocket - For performance
7. Wordfence Security - For security
8. Custom Post Type UI - For custom post types (programs)
9. Enable Media Replace - For asset management
10. WPCode - For custom code snippets
```

**Installation Steps:**
1. Dashboard → Plugins → Add New
2. Search for each plugin
3. Click "Install Now" then "Activate"
4. Configure each plugin (detailed steps below)

---

## Theme Selection & Configuration

### Step 1: Choose WordPress Theme Approach

**Option A: Page Builder Theme (Recommended for non-developers)**
- **Elementor Pro** + Hello Theme
- **Divi** builder
- **Beaver Builder**

**Option B: Blank/Starter Theme (Recommended for custom design)**
- **GeneratePress** Premium
- **Kadence** Theme
- **Blocksy** Pro
- **Underscores** (_s) starter theme

**Option C: Custom Theme Development**
- Create child theme from blank starter
- Full control over markup and styles

**Recommendation:** Use **GeneratePress Premium** for:
- Clean, semantic HTML
- Performance-optimized
- Excellent CSS customization
- No bloat
- Good for custom design migration

### Step 2: Install and Activate Theme

**For GeneratePress:**

1. Purchase GeneratePress Premium
2. Download GP Premium plugin
3. Dashboard → Appearance → Themes
4. Click "Add New" → "Upload Theme"
5. Upload GeneratePress theme
6. Click "Activate"
7. Dashboard → Plugins → Add New
8. Upload GP Premium plugin
9. Activate and enter license key

### Step 3: Configure Theme Settings

**GeneratePress Settings → Layout:**

```
Layout:
- Container Width: 1200px (matches current site)
- Sidebar: No sidebar (full width)

Header:
- Header Layout: Contained
- Sticky Navigation: Yes
- Mobile Menu: Off-canvas panel

Footer:
- Footer Widgets: 3 columns (for footer sections)
```

**GeneratePress → Colors:**

Temporarily skip - we'll handle colors in CSS migration section

**GeneratePress → Typography:**

Temporarily skip - we'll handle typography in CSS migration section

---

## Content Migration

### Step 1: Create Custom Post Types

**Create "Programs" Custom Post Type:**

Using Custom Post Type UI plugin:

1. Dashboard → CPT UI → Add/Edit Post Types
2. Slug: `program`
3. Plural Label: `Programs`
4. Singular Label: `Program`
5. Settings:
   - Public: Yes
   - Has Archive: Yes
   - Archive Slug: `programas`
   - Show in REST API: Yes
   - Supports: Title, Editor, Featured Image, Custom Fields
6. Save Post Type

### Step 2: Create Custom Taxonomies

No custom taxonomies needed for this site.

### Step 3: Migrate Homepage Content

**3.1 Create Home Page**

1. Pages → Add New
2. Title: `Home`
3. URL: Set to homepage in Settings → Reading

**3.2 Add Custom Fields (ACF)**

Create Field Group "Home Page Fields":

```
Field Group: Home Page
Location: Page is equal to Home

Fields:
┌─ Tab: Hero Section
│  ├─ hero_tagline (Text)
│  ├─ hero_subtitle (Textarea)
│  ├─ hero_button_text (Text)
│  ├─ hero_button_url (URL)
│  └─ hero_scroll_text (Text)
│
┌─ Tab: Intro Section
│  ├─ intro_title (Text)
│  └─ intro_paragraphs (Repeater)
│     └─ paragraph (Textarea)
│
┌─ Tab: Learning Intro
│  ├─ learning_icon (Text)
│  ├─ learning_title (Text)
│  ├─ learning_text (WYSIWYG)
│  ├─ learning_highlight (Text)
│  ├─ learning_button_text (Text)
│  └─ learning_button_url (URL)
│
┌─ Tab: Principles
│  └─ principles (Repeater)
│     ├─ title (Text)
│     └─ description (Textarea)
│
┌─ Tab: Philosophy Section
│  ├─ philosophy_title (Text)
│  ├─ philosophy_text (Textarea)
│  ├─ philosophy_highlight (Text)
│  ├─ philosophy_button_text (Text)
│  └─ philosophy_button_url (URL)
│
└─ Tab: CTA Section
   ├─ cta_title (Text)
   ├─ cta_description (Textarea)
   ├─ cta_button_text (Text)
   └─ cta_button_url (URL)
```

**3.3 Populate Content from JSON**

Reference: `src/data/pages/home.json`

Manually copy content from JSON into ACF fields:

```
Hero Tagline: "mental training"
Hero Subtitle: "Crea espacio mental, libérate del ruido"
Hero Button Text: "Descubre más"
Hero Button URL: "/vaemptiness-program/"
...
(Continue for all fields)
```

### Step 4: Migrate About Page

**4.1 Create About Page**

1. Pages → Add New
2. Title: `Sobre nosotros`
3. Slug: `sobre-nosotros`

**4.2 Create ACF Field Group for About Page**

Reference: `src/data/pages/sobre-nosotros.json`

```
Field Group: About Page
Location: Page template is equal to About Template

Fields:
┌─ Tab: Hero
│  └─ hero_subtitle (Textarea)
│
┌─ Tab: Services
│  ├─ services_title (Text)
│  └─ services_items (Repeater)
│     ├─ icon (Text) - Font Awesome class
│     ├─ title (Text)
│     └─ description (Textarea)
│
┌─ Tab: Vision
│  ├─ vision_title (Text)
│  └─ vision_highlights (Repeater)
│     ├─ title (Text)
│     └─ text (Textarea)
│
┌─ Tab: Brand Philosophy
│  ├─ brand_title (Text)
│  ├─ brand_intro (Textarea)
│  └─ brand_sections (Repeater)
│     ├─ title (Text)
│     ├─ text (Textarea)
│     └─ quote (Text)
│
└─ Tab: Team
   ├─ team_title (Text)
   └─ team_members (Repeater)
      ├─ name (Text)
      ├─ title (Text)
      ├─ image (Image)
      ├─ bio (Textarea)
      └─ credentials (Repeater)
         └─ credential (Text)
```

**4.3 Populate Content**

Copy all content from `src/data/pages/sobre-nosotros.json` into ACF fields.

### Step 5: Migrate Program Pages

**5.1 Create Program Template with ACF**

```
Field Group: Program Template
Location: Post Type is equal to Program

Fields:
┌─ Tab: Basic Info
│  ├─ age_range (Text) - e.g., "Adultos"
│  ├─ short_description (Textarea)
│  └─ featured (True/False)
│
┌─ Tab: Hero
│  └─ hero_subtitle (Text)
│
┌─ Tab: What Is Section
│  ├─ what_is_title (Text)
│  ├─ what_is_intro (Repeater)
│  │  └─ paragraph (Textarea)
│  ├─ what_is_detail_title (Text)
│  ├─ what_is_detail (Textarea)
│  ├─ what_is_detail_quote (Text)
│  └─ helps_items (Repeater)
│     └─ item (Text)
│
┌─ Tab: Pillars
│  ├─ pillars_title (Text)
│  ├─ pillars_subtitle (Text)
│  └─ pillars (Repeater)
│     ├─ title (Text)
│     ├─ description (Textarea)
│     └─ icon (Text) - Font Awesome class
│
┌─ Tab: Session Structure
│  ├─ session_title (Text)
│  ├─ session_intro (Textarea)
│  ├─ session_duration_text (Text)
│  └─ session_phases (Repeater)
│     ├─ phase (Text)
│     ├─ duration (Text)
│     └─ description (Textarea)
│
┌─ Tab: Learning Outcomes
│  ├─ outcomes_title (Text)
│  ├─ outcomes_intro (Textarea)
│  └─ outcomes_items (Repeater)
│     ├─ icon (Text)
│     ├─ title (Text)
│     └─ description (Text)
│
┌─ Tab: Program Details
│  ├─ details_sections (Repeater)
│  │  ├─ title (Text)
│  │  ├─ items (Repeater)
│  │  │  └─ item (Text)
│  │  └─ note (Text)
│  └─ cta_button_text (Text)
│
└─ Tab: Teachers
   ├─ teachers_title (Text)
   ├─ teachers_subtitle (Text)
   └─ teachers (Repeater)
      ├─ name (Text)
      ├─ title (Text)
      ├─ image (Image)
      ├─ bio (Textarea)
      └─ credentials (Repeater)
         └─ credential (Text)
```

**5.2 Create 4 Program Posts**

For each program:
1. Posts → Programs → Add New
2. Title: Use program name from JSON
3. Slug: Use slug from JSON
4. Featured Image: Upload from `src/assets/images/programs/`
5. Fill all ACF fields

**Program 1: vaemptîness adultos**
- Source: `src/data/pages/programs/vaemptiness-adultos.json`
- Featured Image: `src/assets/images/programs/adultos-card.jpg`

**Program 2: vaemptîness equipos**
- Source: `src/data/pages/programs/vaemptiness-equipos.json`
- Featured Image: `src/assets/images/programs/teams-card.jpg`

**Program 3: vaemptîness teen**
- Source: `src/data/pages/programs/vaemptiness-teen.json`
- Featured Image: `src/assets/images/programs/teen-card.jpg`

**Program 4: vaemptîness kids**
- Source: `src/data/pages/programs/vaemptiness-kids.json`
- Featured Image: `src/assets/images/programs/kids-card.jpg`

### Step 6: Migrate Blog Posts

**6.1 Configure WordPress Posts**

Posts will use default WordPress post type.

**6.2 Create Blog Post Fields (ACF)**

```
Field Group: Blog Post Meta
Location: Post Type is equal to Post

Fields:
├─ excerpt (Textarea) - Manual excerpt
├─ featured (True/False) - Featured post flag
└─ seo_keywords (Text) - Additional keywords
```

**6.3 Create 8 Blog Posts**

For each blog post in `src/data/pages/blog/`:

1. Posts → Add New
2. Title: From JSON `title` field
3. Slug: From JSON `slug` field
4. Content: Convert JSON `content.sections` array to HTML
5. Featured Image: From JSON `image` field
6. Author: Set to "Rosa Cano"
7. Date: From JSON `date` field
8. Category: Create "Blog" category if needed
9. Excerpt: From JSON `excerpt` field

**Content Conversion Template:**

JSON structure:
```json
{
  "content": {
    "sections": [
      {
        "title": "Section Title",
        "intro": "Introduction paragraph",
        "items": ["Item 1", "Item 2"],
        "closing": "Closing paragraph"
      }
    ]
  }
}
```

Convert to HTML:
```html
<h2>Section Title</h2>
<p>Introduction paragraph</p>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
<p>Closing paragraph</p>
```

**Blog Posts to Migrate:**

1. **entrenamiento-mental** (Nov 8, 2025)
2. **entrenar-atencion** (date from JSON)
3. **espacio-estimulo-respuesta** (date from JSON)
4. **ciencia-budista-vaemptiness** (date from JSON)
5. **filosofia-budista-vaemptiness** (date from JSON)
6. **mente-en-bucle** (date from JSON)
7. **responder-vs-reaccionar** (date from JSON)
8. **rumiacion-mental** (date from JSON)

### Step 7: Migrate Other Pages

**7.1 Contact Page**

1. Pages → Add New
2. Title: `Contacto`
3. Slug: `contacto`
4. Template: Contact Template
5. ACF Fields:
   ```
   - hero_title (Text)
   - hero_subtitle (Textarea)
   - form_topics (Repeater) - for form dropdown options
   ```
6. Add Contact Form 7 shortcode (setup in Forms section)

**7.2 FAQ Page**

1. Pages → Add New
2. Title: `FAQ`
3. Slug: `faq`
4. ACF Fields:
   ```
   Field Group: FAQ Page
   └─ faq_items (Repeater)
      ├─ category (Text) - e.g., "General", "Program", "Logistics"
      ├─ question (Text)
      └─ answer (WYSIWYG)
   ```
5. Source: `src/data/pages/faq.json`

**7.3 Learning/Methodology Page**

1. Pages → Add New
2. Title: `vaemptîness program`
3. Slug: `vaemptiness-program`
4. Create custom ACF fields based on `src/data/pages/aprendizaje-y-metodologia.json`

**7.4 Legal Pages**

**Privacy Policy:**
1. Pages → Add New
2. Title: `Política de privacidad`
3. Slug: `politica-privacidad`
4. Content: Copy from `src/data/pages/politica-privacidad.json`

**Terms & Conditions:**
1. Pages → Add New
2. Title: `Términos y condiciones`
3. Slug: `terminos-condiciones`
4. Content: Copy from `src/data/pages/terminos-condiciones.json`

**7.5 Business Workshop Landing Page**

1. Pages → Add New
2. Title: `Taller Empresas`
3. Slug: `taller-empresas`
4. Template: Custom Empresas Template
5. Source: `src/data/pages/empresas.json`
6. Uses special styling: `src/assets/css/empresas-landing.css`

**7.6 On-Off & Reset Pages**

Create these pages with content from:
- `src/data/pages/on-off.json`
- `src/data/pages/reset.json`

### Step 8: Create Navigation Menus

**8.1 Primary Navigation**

Source: `src/data/navigation.json`

1. Appearance → Menus
2. Create menu: "Primary Menu"
3. Menu Structure:
   ```
   ├─ Inicio (/)
   ├─ Sobre nosotros (/sobre-nosotros/)
   ├─ Programas (dropdown)
   │  ├─ vaemptîness program (/vaemptiness-program/)
   │  ├─ vaemptîness adultos (/vaemptiness-adultos/)
   │  ├─ vaemptîness equipos (/vaemptiness-equipos/)
   │  ├─ vaemptîness teen (/vaemptiness-teen/)
   │  ├─ vaemptîness kids (/vaemptiness-kids/)
   │  └─ Taller Empresas (/taller-empresas/)
   ├─ Blog (/blog/)
   ├─ FAQ (/faq/)
   └─ Contacto (/contacto/)
   ```
4. Assign to Primary Menu location

**8.2 Footer Menus**

Source: `src/data/site.json` → `footer` section

Create 3 footer menus:

**Footer Menu 1 - Programas:**
```
├─ vaemptîness adultos
├─ vaemptîness equipos
├─ vaemptîness teen
└─ vaemptîness kids
```

**Footer Menu 2 - Información:**
```
├─ Sobre nosotros
├─ Blog
└─ FAQ
```

**Footer Menu 3 - Contacto:**
```
├─ Formulario (/contacto/)
└─ program@vaemptiness.com (custom link)
```

**Footer Legal Menu:**
```
├─ Política de privacidad
└─ Términos y condiciones
```

---

## Design System Migration

### Step 1: Understand Current Design System

Current CSS Variables (`src/assets/css/main.css`):

```css
/* Colors */
--color-primary-bg: #f9f9f9;
--color-primary-text: #111111;
--color-accent-beige: #d4c5b9;
--color-accent-rust: #b85c4f;
--color-accent-sage: #a4b8a0;
--color-accent-cream: #f5f0e8;
--color-border: #e1e1e1;
--color-hover: #8a7968;
--color-shadow: rgba(17, 17, 17, 0.08);

/* Typography */
--font-heading: 'Cardo', serif;
--font-body: 'Inter', sans-serif;

/* Fluid Typography */
--text-hero: clamp(2.5rem, 6vw, 4.5rem);
--text-h1: clamp(2rem, 4vw, 3.5rem);
--text-h2: clamp(1.5rem, 3vw, 2.5rem);
--text-h3: clamp(1.25rem, 2vw, 1.75rem);
--text-h4: clamp(1rem, 1.5vw, 1.125rem);
--text-body-lg: clamp(1.125rem, 1.5vw, 1.25rem);
--text-body: 1rem;
--text-small: 0.875rem;

/* Spacing */
--space-xs: 0.5rem;
--space-sm: 1rem;
--space-md: 1.5rem;
--space-lg: 2rem;
--space-xl: 3rem;
--space-2xl: 4rem;
--space-3xl: 6rem;

/* Layout */
--container-max: 1200px;
--container-padding: clamp(1.5rem, 5vw, 3rem);
--section-spacing: clamp(4rem, 10vw, 8rem);
--element-spacing: clamp(2rem, 4vw, 3rem);

/* Border Radius */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-full: 9999px;

/* Shadows */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.07);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
--shadow-xl: 0 20px 25px rgba(0,0,0,0.15);

/* Transitions */
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
--transition-slow: 350ms ease;
```

### Step 2: Add Custom CSS to WordPress

**Method 1: Using WordPress Customizer (Simple)**

1. Appearance → Customize → Additional CSS
2. Paste all CSS variables and global styles
3. Save & Publish

**Method 2: Using Child Theme (Recommended)**

Create child theme:

```bash
# In wp-content/themes/
mkdir generatepress-child
cd generatepress-child

# Create style.css
cat > style.css << 'EOF'
/*
Theme Name: GeneratePress Child - vaemptiness
Theme URI: https://vaemptiness.com
Description: Custom child theme for vaemptiness
Author: Your Name
Template: generatepress
Version: 1.0.0
*/

/* CSS Variables imported below */
EOF

# Create functions.php
cat > functions.php << 'EOF'
<?php
function vaemptiness_enqueue_styles() {
    wp_enqueue_style('parent-style', get_template_directory_uri() . '/style.css');
    wp_enqueue_style('child-style', get_stylesheet_directory_uri() . '/style.css', array('parent-style'));
    wp_enqueue_style('vaemptiness-custom', get_stylesheet_directory_uri() . '/assets/css/custom.css', array('child-style'));
}
add_action('wp_enqueue_scripts', 'vaemptiness_enqueue_styles');

function vaemptiness_enqueue_scripts() {
    wp_enqueue_script('vaemptiness-main', get_stylesheet_directory_uri() . '/assets/js/main.js', array('jquery'), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'vaemptiness_enqueue_scripts');
?>
EOF
```

**Method 3: Using WPCode Plugin (Easiest)**

1. Dashboard → Code Snippets → Add Snippet
2. Code Type: CSS Snippet
3. Paste CSS variables
4. Location: Site Wide Header
5. Save & Activate

### Step 3: Import CSS Files

**3.1 Create Custom CSS File Structure**

In child theme:
```
generatepress-child/
├─ assets/
│  ├─ css/
│  │  ├─ variables.css (design tokens)
│  │  ├─ base.css (resets, typography)
│  │  ├─ components.css (buttons, cards, forms)
│  │  ├─ layouts.css (sections, grids)
│  │  ├─ pages.css (page-specific styles)
│  │  └─ empresas-landing.css (business landing page)
│  └─ js/
│     └─ (JavaScript files - covered later)
└─ style.css
```

**3.2 Extract and Organize Current CSS**

From `src/assets/css/main.css`, split into files:

**variables.css:**
```css
:root {
  /* Copy all CSS variables from current site */
  --color-primary-bg: #f9f9f9;
  --color-primary-text: #111111;
  /* ... all other variables ... */
}
```

**base.css:**
```css
/* Base element styles */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  font-family: var(--font-body);
  font-size: var(--text-body);
  line-height: 1.7;
  color: var(--color-primary-text);
  background: var(--color-primary-bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  font-weight: 400;
  line-height: 1.2;
  margin-bottom: var(--space-md);
}

/* Typography classes */
.quote-emphasis {
  font-size: var(--text-h1);
  font-family: var(--font-heading);
  font-style: italic;
  font-weight: 400;
  color: var(--color-accent-rust);
  line-height: 1.4;
  margin: var(--space-2xl) 0;
}

.quote-large {
  font-size: var(--text-h2);
  font-family: var(--font-heading);
  font-style: italic;
  font-weight: 400;
  color: var(--color-accent-rust);
  line-height: 1.4;
  margin: var(--space-xl) 0;
}

.quote-medium {
  font-size: var(--text-h3);
  font-family: var(--font-heading);
  font-style: italic;
  font-weight: 400;
  color: var(--color-accent-rust);
  line-height: 1.4;
  margin: var(--space-lg) 0;
}

.card-title {
  font-size: var(--text-h3);
  font-family: var(--font-heading);
  font-weight: 400;
  margin-bottom: var(--space-md);
  color: var(--color-primary-text);
}

/* Continue with all typography styles... */
```

**components.css:**
```css
/* Buttons */
.button {
  display: inline-block;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-body);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-base);
  cursor: pointer;
  border: none;
}

.button-primary {
  background: var(--color-accent-rust);
  color: white;
}

.button-primary:hover {
  background: var(--color-hover);
  transform: translateY(-2px);
}

/* Cards */
.program-card {
  background: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-base);
}

.program-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* FAQ Accordion */
.faq-item {
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-md) 0;
}

.faq-question {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-h4);
  font-family: var(--font-heading);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--transition-slow);
}

.faq-item.active .faq-answer {
  max-height: 500px;
  padding-top: var(--space-md);
}

/* Continue with all component styles... */
```

**layouts.css:**
```css
/* Container */
.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding-left: var(--container-padding);
  padding-right: var(--container-padding);
}

/* Hero sections */
.hero {
  padding: var(--space-3xl) 0;
  text-align: center;
}

/* Colored background sections */
.philosophy-section,
.learning-intro-section,
.cta-section {
  background: var(--color-accent-cream);
  padding: var(--space-3xl) 0;
}

@media (max-width: 768px) {
  .philosophy-section,
  .learning-intro-section,
  .cta-section {
    padding: var(--space-2xl) 0;
  }
}

/* Grids */
.programs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-xl);
  margin-top: var(--space-xl);
}

.principles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-lg);
}

/* Continue with all layout styles... */
```

**3.3 Load Google Fonts**

Add to child theme functions.php:

```php
function vaemptiness_google_fonts() {
    wp_enqueue_style('vaemptiness-fonts', 'https://fonts.googleapis.com/css2?family=Cardo:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600&family=Poppins:wght@700&display=swap', array(), null);
}
add_action('wp_enqueue_scripts', 'vaemptiness_google_fonts');
```

**3.4 Load Font Awesome**

```php
function vaemptiness_font_awesome() {
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css', array(), '6.5.1');
}
add_action('wp_enqueue_scripts', 'vaemptiness_font_awesome');
```

### Step 4: Configure Theme Typography

**GeneratePress → Typography:**

```
Body:
- Font Family: Inter
- Font Weight: 400
- Font Size: 16px (1rem)
- Line Height: 1.7

Headings:
- Font Family: Cardo
- Font Weight: 400
- H1 Size: Use CSS variable (clamp)
- H2 Size: Use CSS variable (clamp)
- H3 Size: Use CSS variable (clamp)
```

**Note:** Typography is primarily handled by CSS variables, so GeneratePress settings can be minimal.

### Step 5: Configure Theme Colors

**GeneratePress → Colors:**

```
Primary Color: #b85c4f (rust)
Background Color: #f9f9f9
Text Color: #111111
Link Color: #111111
Link Hover Color: #b85c4f
```

---

## Components & Layouts

### Step 1: Create Custom Page Templates

In child theme, create template files:

**page-home.php:**
```php
<?php
/**
 * Template Name: Home Page
 */

get_header();
?>

<div id="primary" class="content-area">
    <main id="main" class="site-main">

        <!-- Hero Section -->
        <section class="hero">
            <div class="container">
                <div class="hero-content">
                    <div class="hero-brand-block">
                        <!-- Circle SVG animation -->
                        <svg class="hero-circle-animation" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                        </svg>

                        <h1 class="hero-title">
                            <span class="hero-brand">
                                <span class="hero-brand-va">va</span><span class="hero-brand-emptiness">emptîness</span>
                            </span>
                            <span class="hero-tagline"><?php the_field('hero_tagline'); ?></span>
                        </h1>
                    </div>

                    <p class="hero-subtitle"><?php the_field('hero_subtitle'); ?></p>

                    <?php if (get_field('hero_button_text') && get_field('hero_button_url')): ?>
                    <a href="<?php the_field('hero_button_url'); ?>" class="button button-primary hero-cta-button">
                        <?php the_field('hero_button_text'); ?>
                    </a>
                    <?php endif; ?>
                </div>

                <div class="scroll-indicator" aria-label="Scroll down">
                    <span class="scroll-text"><?php the_field('hero_scroll_text'); ?></span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4L12 20M12 20L6 14M12 20L18 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
        </section>

        <!-- Intro Section -->
        <section class="home-intro-section">
            <div class="container">
                <div class="home-intro-content">
                    <h2 class="home-intro-title"><?php the_field('intro_title'); ?></h2>
                    <?php if (have_rows('intro_paragraphs')): ?>
                        <?php $index = 1; ?>
                        <?php while (have_rows('intro_paragraphs')): the_row(); ?>
                            <p class="home-intro-text<?php echo ($index == 2) ? ' home-intro-text-secondary' : ''; ?>">
                                <?php the_sub_field('paragraph'); ?>
                            </p>
                            <?php $index++; ?>
                        <?php endwhile; ?>
                    <?php endif; ?>
                </div>
            </div>
        </section>

        <!-- Learning Intro Section -->
        <section class="learning-intro-section">
            <div class="container">
                <div class="learning-intro">
                    <div class="intro-icon">
                        <i class="<?php the_field('learning_icon'); ?>" aria-hidden="true"></i>
                    </div>
                    <h3 class="intro-title"><?php the_field('learning_title'); ?></h3>
                    <div class="intro-text"><?php the_field('learning_text'); ?></div>
                    <p class="intro-highlight"><?php the_field('learning_highlight'); ?></p>
                    <a href="<?php the_field('learning_button_url'); ?>" class="button button-primary">
                        <?php the_field('learning_button_text'); ?>
                    </a>
                </div>
            </div>
        </section>

        <!-- Principles Section -->
        <section class="principles-section">
            <div class="container">
                <div class="principles-grid">
                    <?php if (have_rows('principles')): ?>
                        <?php $principle_index = 1; ?>
                        <?php while (have_rows('principles')): the_row(); ?>
                            <div class="principle-card">
                                <!-- Progressive circle indicator -->
                                <svg class="principle-circle" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <circle
                                        cx="30"
                                        cy="30"
                                        r="26"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        <?php if ($principle_index == 1): ?>
                                        stroke-dasharray="163.4"
                                        stroke-dashoffset="98"
                                        <?php elseif ($principle_index == 2): ?>
                                        stroke-dasharray="163.4"
                                        stroke-dashoffset="49"
                                        <?php else: ?>
                                        stroke-dasharray="163.4"
                                        stroke-dashoffset="0"
                                        <?php endif; ?>
                                    />
                                </svg>

                                <h2 class="principle-title"><?php the_sub_field('title'); ?></h2>
                                <p class="principle-description"><?php the_sub_field('description'); ?></p>
                            </div>
                            <?php $principle_index++; ?>
                        <?php endwhile; ?>
                    <?php endif; ?>
                </div>

                <div class="principles-action">
                    <h3 class="principles-action-title"><?php the_field('principles_action_title'); ?></h3>
                    <p class="principles-action-text"><?php the_field('principles_action_text'); ?></p>
                    <a href="<?php the_field('principles_action_button_url'); ?>" class="button button-primary">
                        <?php the_field('principles_action_button_text'); ?>
                    </a>
                </div>
            </div>
        </section>

        <!-- Philosophy Section -->
        <section class="philosophy-section">
            <div class="container">
                <div class="philosophy-content">
                    <h3 class="philosophy-title"><?php the_field('philosophy_title'); ?></h3>
                    <p class="philosophy-text"><?php the_field('philosophy_text'); ?></p>
                    <p class="philosophy-highlight"><?php the_field('philosophy_highlight'); ?></p>
                    <a href="<?php the_field('philosophy_button_url'); ?>" class="button button-primary">
                        <?php the_field('philosophy_button_text'); ?>
                    </a>
                </div>
            </div>
        </section>

        <!-- Programs Section -->
        <section class="programs-section">
            <div class="container">
                <h2 class="section-title">Nuestros Programas</h2>

                <div class="programs-grid">
                    <?php
                    $programs = new WP_Query(array(
                        'post_type' => 'program',
                        'posts_per_page' => -1,
                        'meta_key' => 'featured',
                        'meta_value' => '1',
                        'orderby' => 'menu_order',
                        'order' => 'ASC'
                    ));

                    if ($programs->have_posts()):
                        while ($programs->have_posts()): $programs->the_post();
                    ?>
                        <article class="program-card">
                            <a href="<?php the_permalink(); ?>">
                                <div class="program-card-image">
                                    <?php the_post_thumbnail('medium_large'); ?>
                                    <div class="program-card-overlay">
                                        <span class="program-age-range"><?php the_field('age_range'); ?></span>
                                    </div>
                                </div>
                                <div class="program-card-content">
                                    <h3 class="program-card-title"><?php the_title(); ?></h3>
                                    <p class="program-card-description"><?php the_field('short_description'); ?></p>
                                    <span class="program-card-link">Ver programa</span>
                                </div>
                            </a>
                        </article>
                    <?php
                        endwhile;
                        wp_reset_postdata();
                    endif;
                    ?>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section">
            <div class="container">
                <div class="cta-content">
                    <h2 class="cta-title"><?php the_field('cta_title'); ?></h2>
                    <p class="cta-description"><?php the_field('cta_description'); ?></p>
                    <a href="<?php the_field('cta_button_url'); ?>" class="button button-primary">
                        <?php the_field('cta_button_text'); ?>
                    </a>
                </div>
            </div>
        </section>

    </main>
</div>

<?php
get_footer();
```

**single-program.php:**
```php
<?php
/**
 * Template for single program posts
 */

get_header();
?>

<div id="primary" class="content-area">
    <main id="main" class="site-main">

        <?php while (have_posts()): the_post(); ?>

        <!-- Program Hero -->
        <section class="program-hero">
            <div class="container">
                <h1 class="page-title"><?php the_title(); ?></h1>
                <p class="page-subtitle"><?php the_field('hero_subtitle'); ?></p>
            </div>
        </section>

        <!-- What Is Section -->
        <section class="program-what-is">
            <div class="container">
                <h2 class="section-title"><?php the_field('what_is_title'); ?></h2>

                <?php if (have_rows('what_is_intro')): ?>
                    <?php while (have_rows('what_is_intro')): the_row(); ?>
                        <p><?php the_sub_field('paragraph'); ?></p>
                    <?php endwhile; ?>
                <?php endif; ?>

                <details class="what-is-details">
                    <summary><?php the_field('what_is_detail_title'); ?></summary>
                    <p><?php the_field('what_is_detail'); ?></p>
                    <?php if (get_field('what_is_detail_quote')): ?>
                        <p class="quote-medium"><?php the_field('what_is_detail_quote'); ?></p>
                    <?php endif; ?>
                </details>

                <h3><?php the_field('helps_title'); ?></h3>
                <?php if (have_rows('helps_items')): ?>
                    <ul class="helps-list">
                        <?php while (have_rows('helps_items')): the_row(); ?>
                            <li><?php the_sub_field('item'); ?></li>
                        <?php endwhile; ?>
                    </ul>
                <?php endif; ?>
            </div>
        </section>

        <!-- Pillars Section -->
        <section class="program-pillars">
            <div class="container">
                <h2 class="section-title"><?php the_field('pillars_title'); ?></h2>
                <p class="section-subtitle"><?php the_field('pillars_subtitle'); ?></p>

                <div class="pillars-grid">
                    <?php if (have_rows('pillars')): ?>
                        <?php while (have_rows('pillars')): the_row(); ?>
                            <div class="pillar-card">
                                <div class="pillar-icon">
                                    <i class="<?php the_sub_field('icon'); ?>" aria-hidden="true"></i>
                                </div>
                                <h3 class="card-title"><?php the_sub_field('title'); ?></h3>
                                <p><?php the_sub_field('description'); ?></p>
                            </div>
                        <?php endwhile; ?>
                    <?php endif; ?>
                </div>
            </div>
        </section>

        <!-- Session Structure Section -->
        <?php if (have_rows('session_phases')): ?>
        <section class="program-session">
            <div class="container">
                <h2 class="section-title"><?php the_field('session_title'); ?></h2>
                <p><?php the_field('session_intro'); ?></p>
                <p class="session-duration"><?php the_field('session_duration_text'); ?></p>

                <div class="session-phases">
                    <?php while (have_rows('session_phases')): the_row(); ?>
                        <div class="phase-item">
                            <h4><?php the_sub_field('phase'); ?></h4>
                            <span class="phase-duration"><?php the_sub_field('duration'); ?></span>
                            <p><?php the_sub_field('description'); ?></p>
                        </div>
                    <?php endwhile; ?>
                </div>
            </div>
        </section>
        <?php endif; ?>

        <!-- Learning Outcomes Section -->
        <?php if (have_rows('outcomes_items')): ?>
        <section class="learning-outcomes">
            <div class="container">
                <h2 class="section-title"><?php the_field('outcomes_title'); ?></h2>
                <p><?php the_field('outcomes_intro'); ?></p>

                <div class="outcomes-grid">
                    <?php while (have_rows('outcomes_items')): the_row(); ?>
                        <div class="outcome-item">
                            <div class="outcome-icon">
                                <i class="<?php the_sub_field('icon'); ?>"></i>
                            </div>
                            <h3><?php the_sub_field('title'); ?></h3>
                            <p><?php the_sub_field('description'); ?></p>
                        </div>
                    <?php endwhile; ?>
                </div>
            </div>
        </section>
        <?php endif; ?>

        <!-- Program Details Section -->
        <?php if (have_rows('details_sections')): ?>
        <section class="program-details">
            <div class="container">
                <?php while (have_rows('details_sections')): the_row(); ?>
                    <div class="detail-section">
                        <h3><?php the_sub_field('title'); ?></h3>
                        <?php if (have_rows('items')): ?>
                            <ul>
                                <?php while (have_rows('items')): the_row(); ?>
                                    <li><?php the_sub_field('item'); ?></li>
                                <?php endwhile; ?>
                            </ul>
                        <?php endif; ?>
                        <?php if (get_sub_field('note')): ?>
                            <p class="detail-note"><?php the_sub_field('note'); ?></p>
                        <?php endif; ?>
                    </div>
                <?php endwhile; ?>
            </div>
        </section>
        <?php endif; ?>

        <!-- CTA -->
        <section class="program-cta">
            <div class="container">
                <a href="/contacto/" class="button button-primary">
                    <?php the_field('cta_button_text'); ?>
                </a>
            </div>
        </section>

        <?php endwhile; ?>

    </main>
</div>

<?php
get_footer();
```

**page-faq.php:**
```php
<?php
/**
 * Template Name: FAQ Page
 */

get_header();
?>

<div id="primary" class="content-area">
    <main id="main" class="site-main">

        <section class="faq-hero">
            <div class="container">
                <h1 class="page-title"><?php the_title(); ?></h1>
            </div>
        </section>

        <section class="faq-content">
            <div class="container">
                <?php if (have_rows('faq_items')): ?>
                    <div class="faq-list">
                        <?php
                        $current_category = '';
                        while (have_rows('faq_items')): the_row();
                            $category = get_sub_field('category');

                            // Show category heading if it changed
                            if ($category != $current_category):
                                $current_category = $category;
                        ?>
                            <h2 class="faq-category"><?php echo esc_html($category); ?></h2>
                        <?php endif; ?>

                        <div class="faq-item">
                            <div class="faq-question">
                                <h3><?php the_sub_field('question'); ?></h3>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-answer">
                                <?php the_sub_field('answer'); ?>
                            </div>
                        </div>

                        <?php endwhile; ?>
                    </div>
                <?php endif; ?>
            </div>
        </section>

    </main>
</div>

<?php
get_footer();
```

### Step 2: Create Custom Header

**header.php** (in child theme):

```php
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header" role="banner">
    <div class="container">
        <div class="header-inner">
            <!-- Logo -->
            <div class="site-logo">
                <a href="<?php echo esc_url(home_url('/')); ?>">
                    <img src="<?php echo get_stylesheet_directory_uri(); ?>/assets/images/logo.png" alt="<?php bloginfo('name'); ?>">
                </a>
            </div>

            <!-- Primary Navigation -->
            <nav class="primary-navigation" role="navigation" aria-label="Primary navigation">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'container' => false,
                    'menu_class' => 'primary-menu',
                    'fallback_cb' => false,
                ));
                ?>
            </nav>

            <!-- Mobile Menu Toggle -->
            <button class="mobile-menu-toggle" aria-label="Toggle menu" aria-expanded="false">
                <span class="menu-bar"></span>
                <span class="menu-bar"></span>
                <span class="menu-bar"></span>
            </button>
        </div>
    </div>
</header>

<!-- Mobile Navigation -->
<nav class="mobile-navigation" id="mobile-menu" aria-label="Mobile navigation">
    <?php
    wp_nav_menu(array(
        'theme_location' => 'primary',
        'container' => false,
        'menu_class' => 'mobile-menu',
        'fallback_cb' => false,
    ));
    ?>
</nav>
```

### Step 3: Create Custom Footer

**footer.php** (in child theme):

```php
<footer class="site-footer" role="contentinfo">
    <div class="container">
        <div class="footer-content">
            <!-- Footer Columns -->
            <div class="footer-columns">
                <!-- Column 1: Programas -->
                <div class="footer-column">
                    <h3 class="footer-column-title">Programas</h3>
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'footer-programs',
                        'container' => false,
                        'menu_class' => 'footer-menu',
                        'fallback_cb' => false,
                    ));
                    ?>
                </div>

                <!-- Column 2: Información -->
                <div class="footer-column">
                    <h3 class="footer-column-title">Información</h3>
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'footer-info',
                        'container' => false,
                        'menu_class' => 'footer-menu',
                        'fallback_cb' => false,
                    ));
                    ?>
                </div>

                <!-- Column 3: Contacto -->
                <div class="footer-column">
                    <h3 class="footer-column-title">Contacto</h3>
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'footer-contact',
                        'container' => false,
                        'menu_class' => 'footer-menu',
                        'fallback_cb' => false,
                    ));
                    ?>
                </div>
            </div>

            <!-- Footer Bottom -->
            <div class="footer-bottom">
                <p class="footer-copyright">© <?php echo date('Y'); ?> vaemptîness. Todos los derechos reservados.</p>

                <div class="footer-legal">
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'footer-legal',
                        'container' => false,
                        'menu_class' => 'footer-legal-menu',
                        'fallback_cb' => false,
                    ));
                    ?>
                </div>
            </div>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
```

### Step 4: Register Menus and Template Parts

Add to child theme **functions.php**:

```php
// Register navigation menus
function vaemptiness_register_menus() {
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'vaemptiness'),
        'footer-programs' => __('Footer - Programs', 'vaemptiness'),
        'footer-info' => __('Footer - Information', 'vaemptiness'),
        'footer-contact' => __('Footer - Contact', 'vaemptiness'),
        'footer-legal' => __('Footer - Legal', 'vaemptiness'),
    ));
}
add_action('init', 'vaemptiness_register_menus');

// Add custom image sizes
function vaemptiness_custom_image_sizes() {
    add_image_size('program-card', 600, 400, true);
    add_image_size('blog-featured', 1200, 600, true);
    add_image_size('team-photo', 400, 400, true);
}
add_action('after_setup_theme', 'vaemptiness_custom_image_sizes');

// Enable featured images
add_theme_support('post-thumbnails');

// Add excerpt support to pages
add_post_type_support('page', 'excerpt');
```

---

## Assets Migration

### Step 1: Organize Images

**Directory structure in child theme:**

```
generatepress-child/
└─ assets/
   └─ images/
      ├─ logo.png
      ├─ programs/
      │  ├─ adultos-card.jpg
      │  ├─ teams-card.jpg
      │  ├─ teen-card.jpg
      │  ├─ kids-card.jpg
      │  ├─ adult-program.jpg
      │  ├─ teams-program.jpg
      │  ├─ teen-program.jpg
      │  └─ kids-program.jpg
      ├─ blog/
      │  ├─ entrenamiento-mental.jpg
      │  ├─ entrenar-atencion.jpg
      │  ├─ espacio-estimulo-respuesta.jpg
      │  └─ ... (all blog images)
      ├─ team/
      │  ├─ rosa-cano.jpg
      │  ├─ lola-saavedra.jpg
      │  ├─ maria-saiz.jpg
      │  └─ ... (all team photos)
      └─ og-images/
         ├─ og-default.jpg
         ├─ og-home.jpg
         ├─ og-about.jpg
         └─ ... (all OG images)
```

### Step 2: Upload Images to WordPress Media Library

**Option A: Manual Upload (Small sites)**

1. Media → Add New
2. Drag and drop all images
3. WordPress will organize by date uploaded

**Option B: Preserve Directory Structure (Recommended)**

Using FTP or file manager:

1. Copy entire `assets/images/` folder to:
   ```
   wp-content/uploads/vaemptiness/
   ```

2. Install "Enable Media Replace" plugin
3. Use "Add From Server" plugin to import images with original paths

**Option C: Programmatic Import**

Create a PHP script to import images:

```php
// import-images.php (run once)
<?php
require_once('wp-load.php');

$images_path = get_stylesheet_directory() . '/assets/images/';
$upload_dir = wp_upload_dir();

function import_image_to_media($file_path, $post_id = 0) {
    $filename = basename($file_path);

    $upload_file = wp_upload_bits($filename, null, file_get_contents($file_path));

    if (!$upload_file['error']) {
        $wp_filetype = wp_check_filetype($filename, null);

        $attachment = array(
            'post_mime_type' => $wp_filetype['type'],
            'post_title' => preg_replace('/\.[^.]+$/', '', $filename),
            'post_content' => '',
            'post_status' => 'inherit'
        );

        $attach_id = wp_insert_attachment($attachment, $upload_file['file'], $post_id);

        require_once(ABSPATH . 'wp-admin/includes/image.php');
        $attach_data = wp_generate_attachment_metadata($attach_id, $upload_file['file']);
        wp_update_attachment_metadata($attach_id, $attach_data);

        return $attach_id;
    }

    return false;
}

// Import program images
$program_images = glob($images_path . 'programs/*.jpg');
foreach ($program_images as $image) {
    $attach_id = import_image_to_media($image);
    echo "Imported: " . basename($image) . " (ID: $attach_id)<br>";
}

// Import blog images
$blog_images = glob($images_path . 'blog/*.jpg');
foreach ($blog_images as $image) {
    $attach_id = import_image_to_media($image);
    echo "Imported: " . basename($image) . " (ID: $attach_id)<br>";
}

// Import team images
$team_images = glob($images_path . 'team/*.jpg');
foreach ($team_images as $image) {
    $attach_id = import_image_to_media($image);
    echo "Imported: " . basename($image) . " (ID: $attach_id)<br>";
}

echo "Image import complete!";
?>
```

### Step 3: Set Featured Images

After importing:

1. Go to each Program post
2. Set featured image from "adultos-card.jpg", "teams-card.jpg", etc.
3. Go to each Blog post
4. Set featured image from corresponding blog image
5. Save posts

---

## Interactive Features & JavaScript

### Step 1: Migrate JavaScript Files

Copy JavaScript files to child theme:

```
generatepress-child/
└─ assets/
   └─ js/
      ├─ main.js
      ├─ faq-accordion.js
      ├─ contact-form.js
      ├─ category-filter.js
      ├─ video-background.js
      ├─ video-preview.js
      └─ empresas-landing.js
```

### Step 2: Enqueue Scripts

Add to **functions.php**:

```php
function vaemptiness_enqueue_scripts() {
    // Main JS
    wp_enqueue_script(
        'vaemptiness-main',
        get_stylesheet_directory_uri() . '/assets/js/main.js',
        array('jquery'),
        '1.0.0',
        true
    );

    // FAQ Accordion (only on FAQ page)
    if (is_page('faq')) {
        wp_enqueue_script(
            'vaemptiness-faq',
            get_stylesheet_directory_uri() . '/assets/js/faq-accordion.js',
            array('jquery'),
            '1.0.0',
            true
        );
    }

    // Contact Form (only on Contact page)
    if (is_page('contacto')) {
        wp_enqueue_script(
            'vaemptiness-contact-form',
            get_stylesheet_directory_uri() . '/assets/js/contact-form.js',
            array('jquery'),
            '1.0.0',
            true
        );
    }

    // Category Filter (only on Blog page)
    if (is_home() || is_archive()) {
        wp_enqueue_script(
            'vaemptiness-category-filter',
            get_stylesheet_directory_uri() . '/assets/js/category-filter.js',
            array('jquery'),
            '1.0.0',
            true
        );
    }

    // Empresas Landing (only on Empresas page)
    if (is_page('taller-empresas')) {
        wp_enqueue_script(
            'vaemptiness-empresas',
            get_stylesheet_directory_uri() . '/assets/js/empresas-landing.js',
            array('jquery'),
            '1.0.0',
            true
        );
    }
}
add_action('wp_enqueue_scripts', 'vaemptiness_enqueue_scripts');
```

### Step 3: Adapt JavaScript for WordPress

**main.js modifications:**

Current code references DOM directly. May need adjustments for WordPress:

```javascript
// Before (Eleventy)
document.addEventListener('DOMContentLoaded', function() {
    // code
});

// After (WordPress with jQuery)
jQuery(document).ready(function($) {
    // code - can now use $ for jQuery
});
```

**FAQ Accordion** - Should work as-is if class names match

**Contact Form** - Will need integration with Contact Form 7 (see Forms section)

---

## Forms Implementation

### Step 1: Install Contact Form 7

1. Plugins → Add New
2. Search "Contact Form 7"
3. Install and Activate

### Step 2: Create Contact Forms

**Main Contact Form:**

1. Dashboard → Contact → Contact Forms
2. Click "Add New"
3. Form Title: "Formulario de Contacto"

Form markup:
```html
<div class="contact-form">
    <div class="form-row">
        <label>Nombre completo*
            [text* nombre class:form-input placeholder "Tu nombre"]
        </label>
    </div>

    <div class="form-row">
        <label>Email*
            [email* email class:form-input placeholder "tu@email.com"]
        </label>
    </div>

    <div class="form-row">
        <label>Teléfono
            [tel telefono class:form-input placeholder "+34 600 000 000"]
        </label>
    </div>

    <div class="form-row">
        <label>Tema*
            [select* tema class:form-select "Información general" "vaemptîness adultos" "vaemptîness equipos" "vaemptîness teen" "vaemptîness kids" "Taller Empresas" "Otro"]
        </label>
    </div>

    <div class="form-row">
        <label>Mensaje*
            [textarea* mensaje class:form-textarea placeholder "Cuéntanos en qué podemos ayudarte"]
        </label>
    </div>

    <div class="form-row form-consent">
        <label>
            [checkbox* consent class:form-checkbox "He leído y acepto la política de privacidad"]
        </label>
    </div>

    <div class="form-row">
        [submit class:button class:button-primary "Enviar mensaje"]
    </div>
</div>
```

**Mail Settings:**

```
To: program@vaemptiness.com
From: [email]
Subject: Nuevo mensaje de contacto - [tema]
Message body:
Nombre: [nombre]
Email: [email]
Teléfono: [telefono]
Tema: [tema]

Mensaje:
[mensaje]
```

**Additional Settings:**

```
on_sent_ok: "location = '/gracias/';"
```

### Step 3: Add Form to Contact Page

In Contact page template or using shortcode:

```php
<?php echo do_shortcode('[contact-form-7 id="123" title="Formulario de Contacto"]'); ?>
```

Replace `123` with actual form ID from Contact Form 7.

### Step 4: Style Contact Form

Add CSS to match current design:

```css
.contact-form {
    max-width: 600px;
    margin: 0 auto;
}

.form-row {
    margin-bottom: var(--space-lg);
}

.form-input,
.form-textarea,
.form-select {
    width: 100%;
    padding: var(--space-sm) var(--space-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-family: var(--font-body);
    font-size: var(--text-body);
    transition: border-color var(--transition-base);
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
    outline: none;
    border-color: var(--color-accent-rust);
}

.form-textarea {
    min-height: 150px;
    resize: vertical;
}

.form-consent {
    display: flex;
    align-items: flex-start;
    gap: var(--space-sm);
}

.form-checkbox {
    margin-top: 4px;
}

.wpcf7-submit {
    /* Button styles already defined in components.css */
}
```

---

## SEO & Schema Markup

### Step 1: Configure Yoast SEO

**General Settings:**

1. SEO → General → Company Info
   - Company name: vaemptîness
   - Logo: Upload logo
   - Organization type: LocalBusiness

2. SEO → Search Appearance
   - Organization or Person: Organization
   - Name: vaemptîness
   - Logo: (use uploaded logo)

**Title & Metas Template:**

```
Homepage:
Title: vaemptîness | mental training
Meta Description: Crea espacio mental, libérate del ruido

Post Types - Programs:
Title: %%title%% | vaemptîness
Meta Description: %%excerpt%%

Post Types - Posts:
Title: %%title%% | Blog vaemptîness
Meta Description: %%excerpt%%

Pages:
Title: %%title%% | vaemptîness
Meta Description: %%excerpt%%
```

**Social Settings:**

1. SEO → Social → Facebook
   - Facebook Page URL: (if applicable)
   - Default Image: Upload default OG image

2. SEO → Social → Twitter
   - Default Image: Upload Twitter card image

### Step 2: Add Schema.org Markup

Current site uses multiple schema types. In WordPress, add using Yoast or custom code.

**Using Yoast Schema Blocks:**

Yoast SEO automatically adds basic schema. For advanced schema, use WPCode plugin:

**Schema for Programs:**

Add to **single-program.php**:

```php
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "<?php the_title(); ?>",
  "description": "<?php the_field('short_description'); ?>",
  "provider": {
    "@type": "Organization",
    "name": "vaemptîness",
    "url": "https://vaemptiness.com"
  },
  "audience": {
    "@type": "PeopleAudience",
    "suggestedMinAge": "<?php echo get_field('audience')['minAge']; ?>",
    "audienceType": "<?php echo get_field('audience')['label']; ?>"
  }
}
</script>
```

**Schema for Blog Posts:**

Add to **single.php**:

```php
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "<?php the_title(); ?>",
  "image": "<?php echo get_the_post_thumbnail_url(get_the_ID(), 'full'); ?>",
  "author": {
    "@type": "Person",
    "name": "<?php the_author(); ?>"
  },
  "publisher": {
    "@type": "Organization",
    "name": "vaemptîness",
    "logo": {
      "@type": "ImageObject",
      "url": "<?php echo get_stylesheet_directory_uri(); ?>/assets/images/logo.png"
    }
  },
  "datePublished": "<?php echo get_the_date('c'); ?>",
  "dateModified": "<?php echo get_the_modified_date('c'); ?>"
}
</script>
```

**Local Business Schema:**

Add to **footer.php** or site-wide via WPCode:

```php
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "vaemptîness",
  "description": "Crea espacio mental, libérate del ruido",
  "url": "https://vaemptiness.com",
  "telephone": "+34-XXX-XXX-XXX",
  "email": "program@vaemptiness.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Barcelona",
    "addressCountry": "ES"
  }
}
</script>
```

### Step 3: Set Up Redirects (If URL Structure Changes)

If URLs changed from Eleventy to WordPress, create redirects:

**Using Redirection Plugin:**

1. Install "Redirection" plugin
2. Tools → Redirection
3. Add redirects for any changed URLs

Example redirects:
```
/vaemptiness-adultos.html → /vaemptiness-adultos/
/blog/post-slug.html → /blog/post-slug/
```

### Step 4: Generate XML Sitemap

Yoast SEO automatically generates sitemap at:
```
https://yoursite.com/sitemap_index.xml
```

Submit to Google Search Console.

---

## Testing & Quality Assurance

### Step 1: Functionality Testing

**Homepage:**
- [ ] Hero section displays correctly
- [ ] Hero tagline and subtitle render
- [ ] Circle SVG animation works
- [ ] Scroll indicator appears
- [ ] Intro section text displays
- [ ] Learning intro section (colored background)
- [ ] Principles grid (3 cards with progressive circles)
- [ ] Philosophy section (colored background)
- [ ] Programs grid shows 4 featured programs
- [ ] Program cards have images and overlays
- [ ] CTA section (colored background)

**Program Pages:**
- [ ] Hero with title and subtitle
- [ ] What Is section with expandable details
- [ ] Helps/Benefits list
- [ ] Pillars grid (4 cards with icons)
- [ ] Session structure phases
- [ ] Learning outcomes grid
- [ ] Program details sections
- [ ] CTA button links to contact

**Blog:**
- [ ] Blog listing page shows all posts
- [ ] Featured images display
- [ ] Post excerpts appear
- [ ] Categories work (if implemented)
- [ ] Single blog post shows full content
- [ ] Author and date display

**Contact Page:**
- [ ] Contact form displays
- [ ] All fields render correctly
- [ ] Topic dropdown has all options
- [ ] Form validation works
- [ ] Form submission succeeds
- [ ] Thank you message/redirect works
- [ ] Email notification received

**FAQ Page:**
- [ ] All FAQ items display
- [ ] Categories group questions
- [ ] Accordion expand/collapse works
- [ ] Icons rotate on expand

**Navigation:**
- [ ] Primary menu displays
- [ ] Dropdown menu works (Programs submenu)
- [ ] Mobile menu toggle works
- [ ] Mobile menu displays correctly
- [ ] All links work

**Footer:**
- [ ] 3 footer columns display
- [ ] Footer menus render
- [ ] Legal links work
- [ ] Copyright year is current
- [ ] Email link works

### Step 2: Design & Visual Testing

**Typography:**
- [ ] Cardo font loads for headings
- [ ] Inter font loads for body text
- [ ] Font sizes match original (use clamp values)
- [ ] Line heights correct
- [ ] Quote styles (emphasis, large, medium) match
- [ ] Mobile typography scales properly

**Colors:**
- [ ] Primary rust color (#b85c4f) used correctly
- [ ] Cream background sections (#f5f0e8) match
- [ ] Hover states work (color changes)
- [ ] Borders use correct color
- [ ] Shadows render properly

**Spacing:**
- [ ] Colored sections have correct padding (96px/64px)
- [ ] Card padding uses 3-tier system
- [ ] Container max-width is 1200px
- [ ] Section spacing matches original
- [ ] Mobile spacing reduces appropriately

**Components:**
- [ ] Buttons match style and hover effect
- [ ] Cards have proper shadows and hover lift
- [ ] Program card overlays work
- [ ] Icons render correctly (Font Awesome)
- [ ] SVG circles display and animate

**Responsive Design:**
- [ ] Test on mobile (375px, 414px)
- [ ] Test on tablet (768px, 1024px)
- [ ] Test on desktop (1280px, 1920px)
- [ ] Grids stack properly on mobile
- [ ] Images resize correctly
- [ ] Text remains readable on all sizes

### Step 3: Performance Testing

**Page Speed:**
1. Test with Google PageSpeed Insights
   - Target: 90+ on mobile, 95+ on desktop
2. Test with GTmetrix
3. Test with WebPageTest

**Optimization checklist:**
- [ ] Images optimized (use WebP format)
- [ ] CSS minified
- [ ] JavaScript minified
- [ ] Caching enabled (WP Super Cache or WP Rocket)
- [ ] GZIP compression enabled
- [ ] Lazy loading images
- [ ] Remove unused CSS/JS
- [ ] Inline critical CSS

### Step 4: SEO Testing

**On-Page SEO:**
- [ ] All pages have unique titles
- [ ] All pages have meta descriptions
- [ ] H1 tags present and correct
- [ ] Heading hierarchy logical (H1 → H2 → H3)
- [ ] Images have alt text
- [ ] URLs are clean and descriptive
- [ ] Internal linking works
- [ ] Canonical URLs set correctly

**Schema Validation:**
1. Test with Google Rich Results Test
2. Verify schema markup renders correctly
3. Check all schema types (LocalBusiness, BlogPosting, etc.)

**Sitemap & Robots:**
- [ ] XML sitemap generates correctly
- [ ] robots.txt configured properly
- [ ] Sitemap submitted to Google Search Console
- [ ] No indexing errors in GSC

### Step 5: Accessibility Testing

**WCAG Compliance:**
- [ ] Color contrast ratios meet AA standard
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] ARIA labels on interactive elements
- [ ] Form labels associated correctly
- [ ] Images have alt text
- [ ] Skip to content link (if needed)

**Testing Tools:**
1. WAVE browser extension
2. axe DevTools
3. Lighthouse accessibility audit

### Step 6: Cross-Browser Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (macOS and iOS)
- [ ] Edge (latest)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

### Step 7: Form Testing

**Contact Form:**
- [ ] Test successful submission
- [ ] Test validation (required fields)
- [ ] Test email format validation
- [ ] Test phone number format (if validated)
- [ ] Verify email notification received
- [ ] Test spam protection (if enabled)
- [ ] Test "Thank you" redirect/message
- [ ] Test error handling

---

## Deployment & Go-Live

### Step 1: Choose Hosting Provider

**Recommended WordPress Hosts:**
- **WP Engine** - Premium managed WordPress
- **Kinsta** - High-performance managed hosting
- **SiteGround** - Good balance of price and performance
- **Cloudways** - Flexible cloud hosting

**Requirements:**
- PHP 8.0+
- MySQL 5.7+ or MariaDB 10.3+
- HTTPS/SSL certificate (free with Let's Encrypt)
- At least 512MB PHP memory limit
- Daily backups

### Step 2: Prepare Production Environment

**Set up hosting:**
1. Create hosting account
2. Install WordPress via host's installer
3. Configure domain (vaemptiness.com)
4. Enable SSL certificate
5. Set up email accounts

**Security hardening:**
```
- Install Wordfence or Sucuri security plugin
- Enable two-factor authentication
- Limit login attempts
- Disable file editing in dashboard
- Set strong passwords
- Use security headers
```

### Step 3: Migrate from Local to Production

**Using WP Migrate DB:**

1. **On Local:**
   - Plugins → WP Migrate DB
   - Export database
   - Find & Replace:
     - Find: `http://localhost/vaemptiness`
     - Replace: `https://vaemptiness.com`
   - Export file

2. **On Production:**
   - Install WordPress
   - Install WP Migrate DB
   - Import database from local
   - Verify URLs replaced correctly

3. **Transfer Files:**
   ```bash
   # Using FTP or host's file manager
   - Upload wp-content/themes/generatepress-child/
   - Upload wp-content/plugins/ (all plugins)
   - Upload wp-content/uploads/ (media library)
   ```

**OR Using Migration Plugin (All-in-One WP Migration):**

1. Install "All-in-One WP Migration" on local
2. Tools → Export → Export to File
3. Download export file
4. Install fresh WordPress on production
5. Install "All-in-One WP Migration" on production
6. Tools → Import → Upload export file
7. Wait for migration to complete
8. Permalinks → Save to flush rewrite rules

### Step 4: DNS Configuration

**Point domain to new host:**

1. Get nameservers from hosting provider
2. Update nameservers at domain registrar
3. Wait for DNS propagation (up to 48 hours)

**OR use A Record:**
```
Type: A
Name: @
Value: [Your server IP]

Type: A
Name: www
Value: [Your server IP]
```

### Step 5: Post-Migration Checklist

**Immediate checks:**
- [ ] Homepage loads correctly
- [ ] All pages accessible
- [ ] Images display
- [ ] Forms work and send emails
- [ ] Navigation menus work
- [ ] SSL certificate active (HTTPS)
- [ ] Permalinks working (no 404s)
- [ ] Admin dashboard accessible

**Configuration:**
- [ ] Verify site URL in Settings → General
- [ ] Check permalink structure
- [ ] Test contact form submissions
- [ ] Verify email notifications
- [ ] Check caching works
- [ ] Enable CDN (if using Cloudflare)

**SEO:**
- [ ] Submit new sitemap to Google Search Console
- [ ] Verify Google Analytics tracking
- [ ] Check robots.txt is correct
- [ ] Set up 301 redirects from old site (if applicable)

### Step 6: Performance Optimization

**Enable Caching:**
1. Install WP Super Cache or WP Rocket
2. Enable page caching
3. Enable GZIP compression
4. Enable browser caching

**Image Optimization:**
1. Install Smush or EWWW Image Optimizer
2. Bulk optimize all images
3. Enable lazy loading

**CDN Setup (Optional but recommended):**
1. Sign up for Cloudflare (free plan)
2. Add site to Cloudflare
3. Update nameservers to Cloudflare
4. Configure caching rules

**Database Optimization:**
1. Install WP-Optimize
2. Clean post revisions
3. Remove spam comments
4. Optimize database tables

### Step 7: Backup Strategy

**Automated Backups:**
1. Install UpdraftPlus or BackupBuddy
2. Configure daily backups
3. Store backups offsite (Google Drive, Dropbox, etc.)
4. Test restoration process

**Backup schedule:**
```
- Database: Daily
- Files: Weekly
- Full site: Weekly
- Retention: Keep 30 days
```

### Step 8: Monitoring & Maintenance

**Set up monitoring:**
- Google Search Console (track SEO health)
- Google Analytics (track traffic)
- Uptime monitoring (UptimeRobot or Pingdom)
- Security monitoring (Wordfence)

**Regular maintenance:**
- Update WordPress core monthly
- Update plugins weekly
- Update theme as needed
- Review and clean spam comments
- Check broken links monthly
- Review backups monthly

### Step 9: Decommission Old Site

**After 1-2 weeks of successful new site:**

1. Verify traffic is going to new site
2. Ensure all URLs redirect properly
3. Archive old Eleventy site
4. Keep GitHub Pages redirect active:
   ```html
   <!-- On old site -->
   <meta http-equiv="refresh" content="0; url=https://vaemptiness.com">
   ```
5. Update all external links to new site

---

## Appendix

### A. Content Migration Checklist

**Pages (14 total):**
- [ ] Home (index.njk)
- [ ] Sobre nosotros (sobre-nosotros.njk)
- [ ] Contacto (contacto.njk)
- [ ] FAQ (faq.njk)
- [ ] Blog listing (blog.njk)
- [ ] Aprendizaje/Metodología (aprendizaje.njk)
- [ ] vaemptîness adultos (programa.njk)
- [ ] vaemptîness equipos (programa.njk)
- [ ] vaemptîness teen (programa.njk)
- [ ] vaemptîness kids (programa.njk)
- [ ] Taller Empresas (empresas.njk)
- [ ] On-Off (on-off.njk)
- [ ] Reset (reset.njk)
- [ ] Política de privacidad
- [ ] Términos y condiciones

**Blog Posts (8 total):**
- [ ] Entrenamiento mental
- [ ] Entrenar la atención
- [ ] Espacio entre estímulo y respuesta
- [ ] Ciencia budista vaemptiness
- [ ] Filosofía budista vaemptiness
- [ ] Mente en bucle
- [ ] Responder vs reaccionar
- [ ] Rumiación mental

### B. Plugin List

**Essential:**
1. Advanced Custom Fields PRO
2. Yoast SEO
3. Contact Form 7
4. WP Migrate DB
5. WP Super Cache / WP Rocket
6. Wordfence Security
7. Custom Post Type UI
8. UpdraftPlus

**Optional:**
9. Smush / EWWW Image Optimizer
10. WP-Optimize
11. Redirection
12. Enable Media Replace
13. WPCode
14. All-in-One WP Migration

### C. Data File Reference

**JSON Data Files:**
```
src/data/
├─ site.json (global site data)
├─ navigation.json (menu structure)
└─ pages/
   ├─ home.json
   ├─ sobre-nosotros.json
   ├─ contacto.json
   ├─ faq.json
   ├─ aprendizaje-y-metodologia.json
   ├─ empresas.json
   ├─ on-off.json
   ├─ politica-privacidad.json
   ├─ terminos-condiciones.json
   ├─ programs/
   │  ├─ vaemptiness-adultos.json
   │  ├─ vaemptiness-equipos.json
   │  ├─ vaemptiness-teen.json
   │  └─ vaemptiness-kids.json
   └─ blog/
      ├─ entrenamiento-mental.json
      ├─ entrenar-atencion.json
      ├─ espacio-estimulo-respuesta.json
      ├─ ciencia-budista-vaemptiness.json
      ├─ filosofia-budista-vaemptiness.json
      ├─ mente-en-bucle.json
      ├─ responder-vs-reaccionar.json
      └─ rumiacion-mental.json
```

### D. Custom Code Snippets

**Auto-bold "vaemptîness" in content:**

Add to functions.php:
```php
function vaemptiness_auto_bold_brand($content) {
    // Only process on frontend
    if (is_admin()) return $content;

    // Bold vaemptîness in post content
    $content = preg_replace('/\b(vaempt[îi]ness)\b/', '<strong>$1</strong>', $content);

    return $content;
}
add_filter('the_content', 'vaemptiness_auto_bold_brand');
```

**Dynamic copyright year in footer:**
```php
<?php echo date('Y'); ?>
```

### E. Troubleshooting Common Issues

**Issue: 404 on all pages except homepage**
- Solution: Settings → Permalinks → Save Changes

**Issue: Images not displaying**
- Check file paths (absolute vs relative)
- Verify images uploaded to Media Library
- Check file permissions (755 for directories, 644 for files)

**Issue: Styles not loading**
- Clear cache (browser and WordPress)
- Check CSS enqueue in functions.php
- Verify file paths are correct
- Hard refresh (Ctrl+Shift+R)

**Issue: Contact form not sending emails**
- Check SMTP settings
- Install WP Mail SMTP plugin
- Verify server can send emails
- Check spam folder

**Issue: White screen (WSOD)**
- Enable debug mode in wp-config.php
- Check PHP error logs
- Disable plugins one by one
- Switch to default theme temporarily

**Issue: Slow site performance**
- Enable caching
- Optimize images
- Minimize CSS/JS
- Use a CDN
- Upgrade hosting if needed

---

## Estimated Timeline

**Week 1-2: Setup & Infrastructure**
- WordPress installation and configuration
- Theme selection and setup
- Plugin installation
- Custom post type creation

**Week 3-4: Content Migration**
- Create ACF field groups
- Migrate all pages
- Create program posts
- Import blog posts
- Upload and organize media

**Week 5-6: Design Implementation**
- CSS migration
- Template creation
- Component building
- Forms setup
- Navigation menus

**Week 7: JavaScript & Interactive Features**
- Migrate and adapt JS files
- Test FAQ accordion
- Test contact forms
- Test mobile menu

**Week 8: SEO & Schema**
- Configure Yoast SEO
- Add schema markup
- Create redirects
- Submit sitemaps

**Week 9: Testing**
- Functionality testing
- Cross-browser testing
- Mobile responsiveness
- Performance optimization
- Accessibility audit

**Week 10: Deployment**
- Production setup
- Migration to live server
- DNS configuration
- Final testing
- Go live!

**Total: 10-12 weeks** for complete migration with thorough testing.

---

## Final Notes

This migration plan provides a complete step-by-step guide for migrating the vaemptîness Eleventy website to WordPress. The plan prioritizes:

1. **Content preservation** - All content from JSON files is mapped to WordPress
2. **Design fidelity** - CSS variables and design system are maintained
3. **Functionality** - All interactive features are recreated
4. **SEO continuity** - Schema markup and SEO settings are preserved
5. **Performance** - Optimization best practices throughout

**Key Success Factors:**
- Take backups before each major step
- Test thoroughly before going live
- Maintain the existing URL structure to preserve SEO
- Keep the design system intact (CSS variables)
- Document all customizations for future reference

**Need Help?**
Consider hiring a WordPress developer for:
- Complex ACF field group creation
- Custom template development
- Performance optimization
- Security hardening

Good luck with your migration!
