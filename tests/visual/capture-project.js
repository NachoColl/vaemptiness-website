const { chromium } = require('@playwright/test');
const path = require('path');

async function captureProject() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  console.log('Capturing project page...');
  await page.goto('https://themerain.com/demo/scena/project/we-stole-the-fire/', { 
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  await page.waitForTimeout(5000); // Wait for content to load
  
  await page.screenshot({
    path: path.join(__dirname, 'references', 'project.png'),
    fullPage: true
  });
  
  console.log('Saved project.png');
  await browser.close();
}

captureProject().catch(console.error);
