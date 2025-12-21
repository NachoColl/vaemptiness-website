import { chromium } from '@playwright/test';
import path from 'path';

const REFERENCES_DIR = path.join(__dirname, 'references');

const PAGES = [
  {
    name: 'home',
    url: 'https://themerain.com/demo/scena/work-grid/',
    viewport: { width: 1920, height: 1080 }
  },
  {
    name: 'about',
    url: 'https://themerain.com/demo/scena/about/',
    viewport: { width: 1920, height: 1080 }
  },
  {
    name: 'contact',
    url: 'https://themerain.com/demo/scena/contact/',
    viewport: { width: 1920, height: 1080 }
  },
  {
    name: 'project',
    url: 'https://themerain.com/demo/scena/project/we-stole-the-fire/',
    viewport: { width: 1920, height: 1080 }
  }
];

async function captureReferences() {
  const browser = await chromium.launch();
  
  for (const page of PAGES) {
    console.log(`Capturing ${page.name}...`);
    const context = await browser.newContext({
      viewport: page.viewport
    });
    const browserPage = await context.newPage();
    
    await browserPage.goto(page.url, { waitUntil: 'networkidle' });
    await browserPage.waitForTimeout(2000); // Wait for animations
    
    await browserPage.screenshot({
      path: path.join(REFERENCES_DIR, `${page.name}.png`),
      fullPage: true
    });
    
    await context.close();
    console.log(`  Saved ${page.name}.png`);
  }
  
  await browser.close();
  console.log('Done capturing references!');
}

captureReferences().catch(console.error);
