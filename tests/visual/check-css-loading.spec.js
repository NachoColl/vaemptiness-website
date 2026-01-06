const { test } = require('@playwright/test');

test('Check CSS media query application', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 851 });

  await page.goto('http://localhost:8080/vaemptiness-equipos/');

  // Check viewport size is actually set
  const viewportSize = page.viewportSize();
  console.log('Actual viewport:', viewportSize);

  // Check if media query matches
  const matchesMedia = await page.evaluate(() => {
    return window.matchMedia('(max-width: 768px)').matches;
  });
  console.log('Media query (max-width: 768px) matches:', matchesMedia);

  // Get all CSS rules for .outcomes-list
  const cssRules = await page.evaluate(() => {
    const element = document.querySelector('.outcomes-list');
    if (!element) return 'Element not found';

    const styles = window.getComputedStyle(element);
    const allRules = [];

    for (let sheet of document.styleSheets) {
      try {
        for (let rule of sheet.cssRules || sheet.rules) {
          if (rule.selectorText && rule.selectorText.includes('outcomes-list')) {
            allRules.push({
              selector: rule.selectorText,
              gridTemplateColumns: rule.style.gridTemplateColumns,
              media: rule.parentRule ? rule.parentRule.conditionText : 'none'
            });
          }
        }
      } catch (e) {
        // CORS error, skip
      }
    }

    return {
      computedGridTemplateColumns: styles.gridTemplateColumns,
      rules: allRules
    };
  });

  console.log('CSS rules for .outcomes-list:', JSON.stringify(cssRules, null, 2));
});
