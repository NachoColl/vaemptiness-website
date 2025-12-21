import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests - Mateo Coll Portfolio', () => {

  test('Home page renders correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify key elements exist
    await expect(page.locator('.site-header')).toBeVisible();
    await expect(page.locator('.logo')).toHaveText('Mateo Coll');
    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.locator('.projects-grid')).toBeVisible();
    await expect(page.locator('.project-card')).toHaveCount(2);
    await expect(page.locator('.site-footer')).toBeVisible();

    // Visual snapshot
    await expect(page).toHaveScreenshot('home.png', {
      fullPage: true,
      threshold: 0.1
    });
  });

  test('About page renders correctly', async ({ page }) => {
    await page.goto('/about/');
    await page.waitForLoadState('networkidle');

    // Verify key elements
    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.locator('.services-grid')).toBeVisible();
    await expect(page.locator('.service-column')).toHaveCount(3);
    await expect(page.locator('.gallery')).toBeVisible();
    await expect(page.locator('.cta')).toBeVisible();

    // Visual snapshot
    await expect(page).toHaveScreenshot('about.png', {
      fullPage: true,
      threshold: 0.1
    });
  });

  test('Contact page renders correctly', async ({ page }) => {
    await page.goto('/contact/');
    await page.waitForLoadState('networkidle');

    // Verify key elements
    await expect(page.locator('.hero-title')).toBeVisible();
    await expect(page.locator('.contact-form')).toBeVisible();
    await expect(page.locator('.contact-info')).toBeVisible();
    await expect(page.locator('.social-links')).toBeVisible();

    // Visual snapshot
    await expect(page).toHaveScreenshot('contact.png', {
      fullPage: true,
      threshold: 0.1
    });
  });

  test('Project page renders correctly', async ({ page }) => {
    await page.goto('/project/wstf/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Verify key elements
    await expect(page.locator('.project-hero')).toBeVisible();
    await expect(page.locator('.project-content')).toBeVisible();
    await expect(page.locator('.project-title')).toBeVisible();
    await expect(page.locator('.project-metadata')).toBeVisible();
    await expect(page.locator('.next-project')).toBeVisible();

    // Visual snapshot
    await expect(page).toHaveScreenshot('project.png', {
      fullPage: true,
      threshold: 0.1
    });
  });

  test('Navigation works correctly', async ({ page }) => {
    await page.goto('/');

    // Test navigation links
    await page.click('a[href="/about/"]');
    await expect(page).toHaveURL('/about/');

    await page.click('a[href="/contact/"]');
    await expect(page).toHaveURL('/contact/');

    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
  });

  test('Project card links work', async ({ page }) => {
    await page.goto('/');

    // Click first project
    await page.click('.project-card:first-child a');
    await expect(page).toHaveURL(/\/project\//);
  });

  test('Dark theme is applied', async ({ page }) => {
    await page.goto('/');

    // Check body has dark background
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });

    // Should be black (rgb or rgba)
    expect(bgColor).toMatch(/rgba?\(0,\s*0,\s*0/);
  });

});
