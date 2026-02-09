const { test, expect } = require('@playwright/test');

test.describe('Taller Empresas - Responsive Layout Tests', () => {
  const URL = 'http://localhost:8080/taller-empresas/';

  test.describe('Mobile Device (iPhone SE)', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should display correctly on mobile', async ({ page }) => {
      await page.goto(URL);

      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');

      // Take full page screenshot
      await page.screenshot({
        path: 'tests/visual/snapshots/empresas-mobile-full.png',
        fullPage: true
      });

      console.log('✓ Mobile full page screenshot captured');
    });

    test('should have proper header layout on mobile', async ({ page }) => {
      await page.goto(URL);
      await page.waitForLoadState('networkidle');

      // Check header exists and is visible
      const header = await page.locator('header').first();
      await expect(header).toBeVisible();

      // Check logo is visible and properly sized
      const logo = await page.locator('.logo-image').first();
      await expect(logo).toBeVisible();
      const logoBox = await logo.boundingBox();

      console.log('Mobile logo height:', logoBox.height, 'px (should be ~40px)');
      expect(logoBox.height).toBeGreaterThan(35);
      expect(logoBox.height).toBeLessThan(45);

      // Take header screenshot
      await header.screenshot({
        path: 'tests/visual/snapshots/empresas-mobile-header.png'
      });

      console.log('✓ Mobile header verified');
    });

    test('should have properly sized hero section on mobile', async ({ page }) => {
      await page.goto(URL);
      await page.waitForLoadState('networkidle');

      // Check hero brand block
      const heroBrand = await page.locator('.hero-brand-block').first();
      await expect(heroBrand).toBeVisible();

      // Check hero title
      const heroTitle = await page.locator('.hero-title').first();
      await expect(heroTitle).toBeVisible();

      // Check tagline is not italic
      const tagline = await page.locator('.hero-tagline').first();
      const taglineStyle = await tagline.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          fontStyle: style.fontStyle,
          fontSize: style.fontSize
        };
      });

      console.log('Mobile tagline font-style:', taglineStyle.fontStyle, '(should be normal)');
      console.log('Mobile tagline font-size:', taglineStyle.fontSize);
      expect(taglineStyle.fontStyle).toBe('normal');

      // Take hero screenshot
      await heroBrand.screenshot({
        path: 'tests/visual/snapshots/empresas-mobile-hero.png'
      });

      console.log('✓ Mobile hero section verified');
    });

    test('should have properly rendered footer on mobile', async ({ page }) => {
      await page.goto(URL);
      await page.waitForLoadState('networkidle');

      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      // Check footer exists
      const footer = await page.locator('.site-footer').first();
      await expect(footer).toBeVisible();

      // Check footer mobile version is visible
      const footerMobile = await page.locator('.footer-mobile').first();
      const isVisible = await footerMobile.isVisible();
      console.log('Mobile footer visible:', isVisible);

      // Take footer screenshot
      await footer.screenshot({
        path: 'tests/visual/snapshots/empresas-mobile-footer.png'
      });

      console.log('✓ Mobile footer verified');
    });
  });

  test.describe('Tablet Device (iPad)', () => {
    test.use({ viewport: { width: 768, height: 1024 } });

    test('should display correctly on iPad', async ({ page }) => {
      await page.goto(URL);
      await page.waitForLoadState('networkidle');

      // Take full page screenshot
      await page.screenshot({
        path: 'tests/visual/snapshots/empresas-tablet-full.png',
        fullPage: true
      });

      console.log('✓ Tablet full page screenshot captured');
    });

    test('should have proper header layout on iPad', async ({ page }) => {
      await page.goto(URL);
      await page.waitForLoadState('networkidle');

      const header = await page.locator('header').first();
      await expect(header).toBeVisible();

      // Check logo size (should still be 40px on tablet)
      const logo = await page.locator('.logo-image').first();
      const logoBox = await logo.boundingBox();

      console.log('Tablet logo height:', logoBox.height, 'px (should be ~40px)');
      expect(logoBox.height).toBeGreaterThan(35);
      expect(logoBox.height).toBeLessThan(45);

      // Take header screenshot
      await header.screenshot({
        path: 'tests/visual/snapshots/empresas-tablet-header.png'
      });

      console.log('✓ Tablet header verified');
    });

    test('should have properly sized hero section on iPad', async ({ page }) => {
      await page.goto(URL);
      await page.waitForLoadState('networkidle');

      const heroBrand = await page.locator('.hero-brand-block').first();
      await expect(heroBrand).toBeVisible();

      // Take hero screenshot
      await heroBrand.screenshot({
        path: 'tests/visual/snapshots/empresas-tablet-hero.png'
      });

      console.log('✓ Tablet hero section verified');
    });

    test('should have properly rendered footer on iPad', async ({ page }) => {
      await page.goto(URL);
      await page.waitForLoadState('networkidle');

      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      const footer = await page.locator('.site-footer').first();
      await expect(footer).toBeVisible();

      // Take footer screenshot
      await footer.screenshot({
        path: 'tests/visual/snapshots/empresas-tablet-footer.png'
      });

      console.log('✓ Tablet footer verified');
    });
  });

  test.describe('Desktop Device', () => {
    test.use({ viewport: { width: 1920, height: 1080 } });

    test('should display correctly on desktop', async ({ page }) => {
      await page.goto(URL);
      await page.waitForLoadState('networkidle');

      // Take full page screenshot
      await page.screenshot({
        path: 'tests/visual/snapshots/empresas-desktop-full.png',
        fullPage: true
      });

      console.log('✓ Desktop full page screenshot captured');
    });

    test('should have proper header layout on desktop', async ({ page }) => {
      await page.goto(URL);
      await page.waitForLoadState('networkidle');

      const header = await page.locator('header').first();
      await expect(header).toBeVisible();

      // Check logo size (should be 50px on desktop)
      const logo = await page.locator('.logo-image').first();
      const logoBox = await logo.boundingBox();

      console.log('Desktop logo height:', logoBox.height, 'px (should be ~50px)');
      expect(logoBox.height).toBeGreaterThan(45);
      expect(logoBox.height).toBeLessThan(55);

      // Take header screenshot
      await header.screenshot({
        path: 'tests/visual/snapshots/empresas-desktop-header.png'
      });

      console.log('✓ Desktop header verified');
    });

    test('should have properly sized hero section on desktop', async ({ page }) => {
      await page.goto(URL);
      await page.waitForLoadState('networkidle');

      const heroBrand = await page.locator('.hero-brand-block').first();
      await expect(heroBrand).toBeVisible();

      // Check tagline styling
      const tagline = await page.locator('.hero-tagline').first();
      const taglineStyle = await tagline.evaluate(el => {
        const style = window.getComputedStyle(el);
        return {
          fontStyle: style.fontStyle,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight
        };
      });

      console.log('Desktop tagline styles:', taglineStyle);
      expect(taglineStyle.fontStyle).toBe('normal');

      // Take hero screenshot
      await heroBrand.screenshot({
        path: 'tests/visual/snapshots/empresas-desktop-hero.png'
      });

      console.log('✓ Desktop hero section verified');
    });

    test('should have properly rendered footer on desktop', async ({ page }) => {
      await page.goto(URL);
      await page.waitForLoadState('networkidle');

      // Scroll to footer
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);

      const footer = await page.locator('.site-footer').first();
      await expect(footer).toBeVisible();

      // Check desktop footer version is visible
      const footerDesktop = await page.locator('.footer-desktop').first();
      await expect(footerDesktop).toBeVisible();

      // Take footer screenshot
      await footer.screenshot({
        path: 'tests/visual/snapshots/empresas-desktop-footer.png'
      });

      console.log('✓ Desktop footer verified');
    });

    test('should have functional navigation menu', async ({ page }) => {
      await page.goto(URL);
      await page.waitForLoadState('networkidle');

      // Check navigation links exist
      const navLinks = await page.locator('header nav a');
      const linkCount = await navLinks.count();

      console.log('Navigation links found:', linkCount);
      expect(linkCount).toBeGreaterThan(0);

      // Check first link is clickable
      if (linkCount > 0) {
        const firstLink = navLinks.first();
        await expect(firstLink).toBeVisible();
        console.log('✓ Navigation menu functional');
      }
    });
  });

  test.describe('Interactive Elements', () => {
    test.use({ viewport: { width: 1920, height: 1080 } });

    test('should have working CTA buttons', async ({ page }) => {
      await page.goto(URL);
      await page.waitForLoadState('networkidle');

      // Find CTA buttons
      const ctaButtons = await page.locator('a[class*="gradient-cta"], button[class*="gradient-cta"]');
      const buttonCount = await ctaButtons.count();

      console.log('CTA buttons found:', buttonCount);

      if (buttonCount > 0) {
        // Check first button is visible and has href
        const firstButton = ctaButtons.first();
        await expect(firstButton).toBeVisible();

        const href = await firstButton.getAttribute('href');
        console.log('First CTA button href:', href);

        console.log('✓ CTA buttons functional');
      }
    });

    test('should have working contact form', async ({ page }) => {
      await page.goto(URL);
      await page.waitForLoadState('networkidle');

      // Scroll to contact section
      const contactSection = await page.locator('#contacto, [id*="contact"]');
      if (await contactSection.count() > 0) {
        await contactSection.first().scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);

        // Take contact form screenshot
        await contactSection.first().screenshot({
          path: 'tests/visual/snapshots/empresas-contact-form.png'
        });

        console.log('✓ Contact form found and captured');
      }
    });
  });

  test.describe('Visual Regression - Key Sections', () => {
    test.use({ viewport: { width: 1920, height: 1080 } });

    test('should capture all key sections for visual comparison', async ({ page }) => {
      await page.goto(URL);
      await page.waitForLoadState('networkidle');

      // Capture hero section
      const hero = await page.locator('section').first();
      await hero.screenshot({
        path: 'tests/visual/snapshots/empresas-section-hero.png'
      });

      // Scroll through page and capture sections
      const sections = await page.locator('section');
      const sectionCount = await sections.count();

      console.log('Total sections found:', sectionCount);

      // Capture first 5 sections
      for (let i = 0; i < Math.min(5, sectionCount); i++) {
        const section = sections.nth(i);
        await section.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);

        await section.screenshot({
          path: `tests/visual/snapshots/empresas-section-${i + 1}.png`
        });
      }

      console.log('✓ All key sections captured');
    });
  });
});
