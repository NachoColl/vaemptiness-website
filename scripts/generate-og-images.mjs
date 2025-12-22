#!/usr/bin/env node

import { chromium } from '@playwright/test';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// OG image dimensions (1200x630 works for both OG and Twitter)
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// Pages to capture
const pages = [
  { url: '/', filename: 'og-home.jpg', title: 'Homepage' },
  { url: '/sobre-nosotros/', filename: 'og-about.jpg', title: 'About' },
  { url: '/contacto/', filename: 'og-contact.jpg', title: 'Contact' },
  { url: '/aprendizaje-y-metodologia/', filename: 'og-methodology.jpg', title: 'Methodology' },
  { url: '/faq/', filename: 'og-faq.jpg', title: 'FAQ' },
  { url: '/blog/', filename: 'og-blog.jpg', title: 'Blog' },
  { url: '/reset/', filename: 'og-reset.jpg', title: 'Reset' },
  { url: '/vaemptiness-program/', filename: 'adult-program.jpg', title: 'Adult Program', subfolder: 'programs' },
  { url: '/vaemptiness-equipos/', filename: 'teams-program.jpg', title: 'Teams Program', subfolder: 'programs' },
  { url: '/vaemptiness-teen/', filename: 'teen-program.jpg', title: 'Teen Program', subfolder: 'programs' },
  { url: '/vaemptiness-kids/', filename: 'kids-program.jpg', title: 'Kids Program', subfolder: 'programs' },
];

async function generateOGImages() {
  console.log('🚀 Starting OG image generation...\n');

  // Create output directories
  const baseDir = join(projectRoot, 'src/assets/images');
  const programsDir = join(baseDir, 'programs');

  await mkdir(baseDir, { recursive: true });
  await mkdir(programsDir, { recursive: true });

  // Launch browser
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: OG_WIDTH, height: OG_HEIGHT },
    deviceScaleFactor: 2, // Higher quality images
  });

  const page = await context.newPage();

  // Generate images for each page
  for (const pageConfig of pages) {
    const { url, filename, title, subfolder } = pageConfig;
    const fullUrl = `http://localhost:8080${url}`;

    console.log(`📸 Capturing: ${title} (${url})`);

    try {
      // Navigate to page
      await page.goto(fullUrl, { waitUntil: 'networkidle' });

      // Wait a bit for animations/fonts to load
      await page.waitForTimeout(1000);

      // Determine output path
      const outputDir = subfolder ? join(baseDir, subfolder) : baseDir;
      const outputPath = join(outputDir, filename);

      // Take screenshot
      await page.screenshot({
        path: outputPath,
        type: 'jpeg',
        quality: 90,
        fullPage: false, // Only capture viewport (1200x630)
      });

      console.log(`   ✅ Saved: ${subfolder ? subfolder + '/' : ''}${filename}`);
    } catch (error) {
      console.error(`   ❌ Error capturing ${title}:`, error.message);
    }
  }

  // Also create a default/fallback image (same as homepage)
  console.log(`\n📸 Creating default fallback image...`);
  const defaultPath = join(baseDir, 'og-default.jpg');
  const homePath = join(baseDir, 'og-home.jpg');

  try {
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: defaultPath,
      type: 'jpeg',
      quality: 90,
      fullPage: false,
    });
    console.log(`   ✅ Saved: og-default.jpg`);
  } catch (error) {
    console.error(`   ❌ Error creating default image:`, error.message);
  }

  // Create Twitter card default (same dimensions work for both)
  console.log(`\n📸 Creating Twitter card default image...`);
  const twitterPath = join(baseDir, 'twitter-card-default.jpg');

  try {
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: twitterPath,
      type: 'jpeg',
      quality: 90,
      fullPage: false,
    });
    console.log(`   ✅ Saved: twitter-card-default.jpg`);
  } catch (error) {
    console.error(`   ❌ Error creating Twitter card image:`, error.message);
  }

  await browser.close();

  console.log('\n✨ OG image generation complete!');
  console.log(`📁 Images saved to: src/assets/images/`);
  console.log(`📁 Program images saved to: src/assets/images/programs/`);
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:8080');
    return response.ok;
  } catch {
    return false;
  }
}

// Main
(async () => {
  console.log('🔍 Checking if dev server is running...');
  const serverRunning = await checkServer();

  if (!serverRunning) {
    console.error('\n❌ Error: Development server is not running!');
    console.error('   Please run "npm run build" first, then start a server:');
    console.error('   npx http-server _site -p 8080\n');
    process.exit(1);
  }

  console.log('✅ Server is running\n');

  try {
    await generateOGImages();
  } catch (error) {
    console.error('\n❌ Error generating OG images:', error);
    process.exit(1);
  }
})();
