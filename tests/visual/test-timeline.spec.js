const { test, expect } = require('@playwright/test');

test.describe('Session Timeline', () => {
  test('capture timeline on desktop', async ({ page }) => {
    await page.goto('http://localhost:8080/vaemptiness-program/');

    // Scroll to timeline section
    await page.locator('.session-timeline').scrollIntoViewIfNeeded();

    // Take screenshot of the timeline
    const timeline = await page.locator('.session-timeline');
    await timeline.screenshot({
      path: 'tests/visual/snapshots/timeline-desktop.png'
    });

    console.log('Timeline screenshot captured');
  });
});
