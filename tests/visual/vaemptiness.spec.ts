import { test, expect } from '@playwright/test';

test.describe('vaemptîness Website Tests', () => {

  test('Homepage renders correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify header and navigation
    await expect(page.locator('.site-header')).toBeVisible();
    await expect(page.locator('.logo img')).toBeVisible();
    await expect(page.locator('.main-nav')).toBeVisible();

    // Verify hero section with content from JSON
    await expect(page.locator('.hero-brand')).toContainText('vaemptîness');
    await expect(page.locator('.hero-tagline')).toContainText('brain training');
    await expect(page.locator('.hero-subtitle')).toContainText('Crea espacio mental');

    // Verify principles section
    await expect(page.locator('.principles-section')).toBeVisible();
    await expect(page.locator('.principle-card')).toHaveCount(3);

    // Verify CTA section has content from JSON
    await expect(page.locator('.cta-title')).toContainText('Únete al universo vaemptîness');
    await expect(page.locator('.cta-description')).toContainText('Pulsa para volver a tí');

    // Verify footer
    await expect(page.locator('.site-footer')).toBeVisible();
  });

  test('Navigation menu has correct links', async ({ page }) => {
    await page.goto('/');

    // Check main navigation items exist (scoped to nav to avoid footer duplicates)
    await expect(page.locator('.main-nav a:has-text("Inicio")')).toBeVisible();
    await expect(page.locator('.main-nav a:has-text("Sobre nosotros")')).toBeVisible();
    await expect(page.locator('.main-nav a:has-text("Programas")')).toBeVisible();
    await expect(page.locator('.main-nav a:has-text("Blog")')).toBeVisible();
    await expect(page.locator('.main-nav a:has-text("FAQ")')).toBeVisible();
    await expect(page.locator('.main-nav a:has-text("Contacto")')).toBeVisible();
  });

  test('Aprendizaje page renders with JSON content', async ({ page }) => {
    await page.goto('/aprendizaje-y-metodologia/');
    await page.waitForLoadState('networkidle');

    // Verify page hero from JSON
    await expect(page.locator('.page-title')).toContainText('Aprendizaje y metodología');
    await expect(page.locator('.page-subtitle')).toContainText('Experimenta, no memorices');

    // Verify pathways section from JSON
    await expect(page.locator('.section-title')).toContainText('Tres Caminos de Aprendizaje');
    const pathwayCards = page.locator('.pathway-card');
    await expect(pathwayCards.first()).toBeVisible();
    await expect(page.locator('.pathway-letter').first()).toBeVisible();

    // Verify CTA section
    await expect(page.locator('.cta-section')).toBeVisible();
  });

  test('Reset page renders with JSON content', async ({ page }) => {
    await page.goto('/reset/');
    await page.waitForLoadState('networkidle');

    // Verify page content from JSON
    await expect(page.locator('.page-title')).toContainText('reset');
    await expect(page.locator('.page-subtitle')).toContainText('Interrumpe el ciclo');

    // Verify reset sections from JSON exist
    await expect(page.locator('.reset-section').first()).toBeVisible();
    await expect(page.locator('h2:has-text("CTRL + X")').first()).toBeVisible();
    await expect(page.locator('h2:has-text("CTRL + Z")').first()).toBeVisible();
  });

  test('Programs page loads correctly', async ({ page }) => {
    await page.goto('/vaemptiness-program/');
    await page.waitForLoadState('networkidle');

    // Verify program hero
    await expect(page.locator('.program-hero')).toBeVisible();
    await expect(page.locator('.program-hero-title')).toContainText('vaemptîness program');

    // Verify pillars section if exists
    const pillarsSection = page.locator('.program-pillars');
    if (await pillarsSection.isVisible()) {
      await expect(page.locator('.pillar-card')).toHaveCount(4);
    }
  });

  test('Blog index page loads', async ({ page }) => {
    await page.goto('/blog/');
    await page.waitForLoadState('networkidle');

    // Verify blog page elements
    await expect(page.locator('.page-title')).toContainText('Blog');
    await expect(page.locator('.blog-posts')).toBeVisible();
    await expect(page.locator('.post-card')).toHaveCount(1); // We have 1 blog post
  });

  test('Blog post renders with JSON content', async ({ page }) => {
    await page.goto('/blog/filosofia-budista-vaemptiness/');
    await page.waitForLoadState('networkidle');

    // Verify blog post content from JSON
    await expect(page.locator('.post-title')).toContainText('Filosofía Budista en vaemptîness');
    await expect(page.locator('.post-author')).toContainText('Rosa Cano');

    // Verify sections exist
    await expect(page.locator('.post-section')).toHaveCount(6);

    // Verify list items are rendered as boxes
    await expect(page.locator('.blog-list-items')).toHaveCount(6);
  });

  test('Contact page loads', async ({ page }) => {
    await page.goto('/contacto/');
    await page.waitForLoadState('networkidle');

    // Verify contact page elements
    await expect(page.locator('.page-title')).toBeVisible();
    await expect(page.locator('.site-footer')).toBeVisible();
  });

  test('Privacy policy page renders with JSON content', async ({ page }) => {
    await page.goto('/politica-privacidad/');
    await page.waitForLoadState('networkidle');

    // Verify page title from JSON
    await expect(page.locator('.page-title')).toContainText('Política de Privacidad');

    // Verify sections are rendered (check for key section headings)
    await expect(page.locator('h2:has-text("Responsable del Tratamiento")').first()).toBeVisible();
    await expect(page.locator('h2:has-text("Datos que Recopilamos y Finalidad")').first()).toBeVisible();

    // Verify CTA
    await expect(page.locator('.cta-title')).toContainText('¿Tienes dudas sobre tu privacidad?');
  });

  test('Terms page renders with JSON content', async ({ page }) => {
    await page.goto('/terminos-condiciones/');
    await page.waitForLoadState('networkidle');

    // Verify page title from JSON
    await expect(page.locator('.page-title')).toContainText('Términos y Condiciones');

    // Verify sections are rendered (check for key section headings)
    await expect(page.locator('h2:has-text("Aceptación y Descripción")').first()).toBeVisible();
    await expect(page.locator('h2:has-text("Participación y Responsabilidades")').first()).toBeVisible();
  });

  test('Footer renders correctly', async ({ page }) => {
    await page.goto('/');

    // Verify footer exists
    await expect(page.locator('.site-footer')).toBeVisible();

    // Verify footer has key content
    await expect(page.locator('.site-footer:has-text("Programas")')).toBeVisible();
    await expect(page.locator('.site-footer:has-text("vaemptîness")')).toBeVisible();
  });

  test('All program pages load correctly', async ({ page }) => {
    const programs = [
      'vaemptiness-program',
      'vaemptiness-equipos',
      'vaemptiness-teen',
      'vaemptiness-kids'
    ];

    for (const program of programs) {
      await page.goto(`/${program}/`);
      await page.waitForLoadState('networkidle');

      // Verify program page loaded
      await expect(page.locator('.program-hero')).toBeVisible();
      await expect(page.locator('.cta-section')).toBeVisible();
    }
  });

});
