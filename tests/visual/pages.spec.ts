import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {

  test('Home page - work grid layout', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('home-grid.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('About page layout', async ({ page }) => {
    await page.goto('/about/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('about.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('Contact page layout', async ({ page }) => {
    await page.goto('/contact/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('contact.png', {
      fullPage: true,
      threshold: 0.2,
    });
  });

  test('Project page - WSTF', async ({ page }) => {
    await page.goto('/project/wstf/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('project-wstf.png', {
      threshold: 0.3,
    });
  });

  test('Project page - scrolled state', async ({ page }) => {
    await page.goto('/project/wstf/');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, window.innerHeight));
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('project-scrolled.png', {
      threshold: 0.2,
    });
  });

});
