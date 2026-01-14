const { test, expect } = require('@playwright/test');

test.describe('Mobile Hero Section Alignment', () => {
  test('vaemptiness-program hero should be vertically centered on mobile', async ({ page }) => {
    await page.goto('http://localhost:8080/vaemptiness-program/');

    // Get hero section dimensions
    const hero = await page.locator('.program-hero').first();
    const heroBox = await hero.boundingBox();

    // Get title + subtitle dimensions
    const content = await page.locator('.program-hero-content').first();
    const contentBox = await content.boundingBox();

    console.log('Hero section height:', heroBox.height);
    console.log('Content height:', contentBox.height);
    console.log('Content Y position:', contentBox.y);
    console.log('Hero Y position:', heroBox.y);
    console.log('Top space:', contentBox.y - heroBox.y);
    console.log('Bottom space:', (heroBox.y + heroBox.height) - (contentBox.y + contentBox.height));

    // Take screenshot of just the hero section
    await hero.screenshot({
      path: 'tests/visual/snapshots/hero-mobile-alignment.png'
    });

    // Check if content is roughly centered (allowing some margin for error)
    const topSpace = contentBox.y - heroBox.y;
    const bottomSpace = (heroBox.y + heroBox.height) - (contentBox.y + contentBox.height);
    const diff = Math.abs(topSpace - bottomSpace);

    console.log('Vertical alignment difference:', diff, 'px');
    console.log('Content is centered:', diff < 50 ? 'YES' : 'NO');
  });
});
