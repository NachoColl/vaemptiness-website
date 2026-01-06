const { test } = require('@playwright/test');

test('Verify CSS file content', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 851 });

  await page.goto('http://localhost:8080/vaemptiness-equipos/');

  // Get the CSS file URL
  const cssUrl = await page.evaluate(() => {
    const link = document.querySelector('link[href*="main.css"]');
    return link ? link.href : 'not found';
  });

  console.log('CSS URL:', cssUrl);

  // Fetch the CSS file content directly
  const response = await page.goto(cssUrl);
  const cssContent = await response.text();

  // Check if media query exists in loaded CSS
  const hasMediaQuery = cssContent.includes('@media (max-width: 768px)');
  const hasOutcomesMediaQuery = cssContent.includes('@media (max-width: 768px)') &&
                                 cssContent.includes('.outcomes-list') &&
                                 cssContent.includes('grid-template-columns: 1fr');

  console.log('CSS file has @media (max-width: 768px):', hasMediaQuery);
  console.log('CSS file has .outcomes-list mobile rule:', hasOutcomesMediaQuery);

  // Find the outcomes-list rules
  const outcomesRules = cssContent.match(/\.outcomes-list\s*{[^}]+}/g);
  console.log('All .outcomes-list rules found:', outcomesRules ? outcomesRules.length : 0);
  if (outcomesRules) {
    outcomesRules.forEach((rule, index) => {
      console.log(`Rule ${index + 1}:`, rule.substring(0, 100));
    });
  }

  // Check media query section
  const mediaQuerySection = cssContent.match(/@media \(max-width: 768px\)\s*{[\s\S]{0,500}outcomes-list[\s\S]{0,200}/);
  if (mediaQuerySection) {
    console.log('Media query section:', mediaQuerySection[0]);
  }
});
