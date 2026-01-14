const { test } = require('@playwright/test');

test('Debug Beneficios section on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 851 });

  await page.goto('http://localhost:8080/vaemptiness-equipos/');

  // Scroll to outcomes/beneficios section
  const outcomesSection = page.locator('.program-outcomes');
  await outcomesSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Take screenshot
  await page.screenshot({
    path: 'test-results/mobile-beneficios-viewport.png',
    fullPage: false
  });

  // Take screenshot of just the section
  await outcomesSection.screenshot({
    path: 'test-results/mobile-beneficios-section.png'
  });

  // Get outcomes list info
  const outcomesList = page.locator('.outcomes-list');
  const listInfo = await outcomesList.evaluate(el => {
    const styles = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      width: rect.width,
      display: styles.display,
      gridTemplateColumns: styles.gridTemplateColumns,
      gap: styles.gap
    };
  });

  console.log('Outcomes list info:', listInfo);

  // Get individual outcome items
  const outcomeItems = page.locator('.outcome-item');
  const itemCount = await outcomeItems.count();
  console.log('Number of outcome items:', itemCount);

  // Get first item dimensions
  const firstItemInfo = await outcomeItems.first().evaluate(el => {
    const styles = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      gridColumn: styles.gridColumn
    };
  });

  console.log('First item info:', firstItemInfo);

  // Check if items are stacking vertically
  const items = await outcomeItems.evaluateAll(elements => {
    return elements.map(el => {
      const rect = el.getBoundingClientRect();
      return {
        top: rect.top,
        left: rect.left,
        width: rect.width
      };
    });
  });

  console.log('Item positions:', items);

  // Check if they're in a single column (all have same left position)
  const leftPositions = items.map(item => Math.round(item.left));
  const uniqueLefts = [...new Set(leftPositions)];
  console.log('Unique left positions:', uniqueLefts);
  console.log('Are items in single column?', uniqueLefts.length === 1);
});
