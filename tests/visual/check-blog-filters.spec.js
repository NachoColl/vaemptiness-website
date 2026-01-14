const { test, expect } = require('@playwright/test');

test('Check blog filters - Desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:8080/blog/');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Take screenshot of initial state (months hidden)
  await page.screenshot({
    path: 'test-results/blog-filters-desktop-initial.png',
    fullPage: false
  });

  // Click on 2026 year filter to show months
  await page.click('[data-filter-type="year"][data-filter-value="2026"]');
  await page.waitForTimeout(500);

  // Take screenshot with months visible
  await page.screenshot({
    path: 'test-results/blog-filters-desktop-months-visible.png',
    fullPage: false
  });

  // Check that months row is visible
  const monthsRow = page.locator('.filter-row-months');
  await expect(monthsRow).toBeVisible();

  // Get computed styles
  const gap = await monthsRow.evaluate(el => window.getComputedStyle(el).gap);
  const marginBottom = await monthsRow.evaluate(el => window.getComputedStyle(el).marginBottom);

  console.log('Desktop - Months row gap:', gap);
  console.log('Desktop - Months row margin-bottom:', marginBottom);

  // Check month link styles
  const firstMonthLink = page.locator('.filter-row-months .filter-link').first();
  const lineHeight = await firstMonthLink.evaluate(el => window.getComputedStyle(el).lineHeight);
  const padding = await firstMonthLink.evaluate(el => window.getComputedStyle(el).padding);

  console.log('Desktop - Month link line-height:', lineHeight);
  console.log('Desktop - Month link padding:', padding);
});

test('Check blog filters - Mobile', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 851 });
  await page.goto('http://localhost:8080/blog/');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Take screenshot of initial state (months hidden)
  await page.screenshot({
    path: 'test-results/blog-filters-mobile-initial.png',
    fullPage: false
  });

  // Click on 2026 year filter to show months
  await page.click('[data-filter-type="year"][data-filter-value="2026"]');
  await page.waitForTimeout(500);

  // Take screenshot with months visible
  await page.screenshot({
    path: 'test-results/blog-filters-mobile-months-visible.png',
    fullPage: false
  });

  // Check that months row is visible
  const monthsRow = page.locator('.filter-row-months');
  await expect(monthsRow).toBeVisible();

  // Get computed styles
  const gap = await monthsRow.evaluate(el => window.getComputedStyle(el).gap);
  const marginBottom = await monthsRow.evaluate(el => window.getComputedStyle(el).marginBottom);

  console.log('Mobile - Months row gap:', gap);
  console.log('Mobile - Months row margin-bottom:', marginBottom);

  // Check month link styles
  const firstMonthLink = page.locator('.filter-row-months .filter-link').first();
  const lineHeight = await firstMonthLink.evaluate(el => window.getComputedStyle(el).lineHeight);
  const padding = await firstMonthLink.evaluate(el => window.getComputedStyle(el).padding);

  console.log('Mobile - Month link line-height:', lineHeight);
  console.log('Mobile - Month link padding:', padding);

  // Take full page screenshot to see how months wrap
  await page.screenshot({
    path: 'test-results/blog-filters-mobile-full.png',
    fullPage: true
  });
});
