const { test } = require('@playwright/test');

test('Debug mobile carousel display', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 393, height: 851 }); // Pixel 5

  // Navigate to the page
  await page.goto('http://localhost:8080/vaemptiness-equipos/');

  // Scroll to testimonials
  await page.locator('.program-testimonials').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Take full screenshot
  await page.screenshot({
    path: 'test-results/mobile-carousel-full.png',
    fullPage: false
  });

  // Take screenshot of just the testimonials section
  const testimonialsSection = page.locator('.program-testimonials');
  await testimonialsSection.screenshot({
    path: 'test-results/mobile-carousel-section.png'
  });

  // Get computed styles and dimensions
  const carousel = page.locator('.testimonials-carousel');
  const carouselInfo = await carousel.evaluate(el => {
    const styles = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      width: rect.width,
      maxWidth: styles.maxWidth,
      overflow: styles.overflow,
      position: styles.position,
      boxSizing: styles.boxSizing
    };
  });

  console.log('Carousel info:', carouselInfo);

  // Get track info
  const track = page.locator('.testimonials-track');
  const trackInfo = await track.evaluate(el => {
    const styles = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      width: rect.width,
      display: styles.display,
      transform: styles.transform,
      transition: styles.transition
    };
  });

  console.log('Track info:', trackInfo);

  // Get slide info
  const slide = page.locator('.testimonial-slide').first();
  const slideInfo = await slide.evaluate(el => {
    const styles = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      width: rect.width,
      minWidth: styles.minWidth,
      flexShrink: styles.flexShrink
    };
  });

  console.log('Slide info:', slideInfo);

  // Get content info
  const content = page.locator('.testimonial-content').first();
  const contentInfo = await content.evaluate(el => {
    const styles = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      width: rect.width,
      maxWidth: styles.maxWidth,
      padding: styles.padding,
      boxSizing: styles.boxSizing
    };
  });

  console.log('Content info:', contentInfo);

  // Get quote info
  const quote = page.locator('.testimonial-quote').first();
  const quoteInfo = await quote.evaluate(el => {
    const styles = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      width: rect.width,
      fontSize: styles.fontSize,
      lineHeight: styles.lineHeight,
      whiteSpace: styles.whiteSpace,
      wordBreak: styles.wordBreak
    };
  });

  console.log('Quote info:', quoteInfo);

  // Check if content is overflowing
  const isOverflowing = await page.evaluate(() => {
    const carousel = document.querySelector('.testimonials-carousel');
    return carousel.scrollWidth > carousel.clientWidth;
  });

  console.log('Is carousel overflowing?', isOverflowing);

  // Click second dot and take screenshot
  await page.locator('.carousel-dot').nth(1).click();
  await page.waitForTimeout(600);

  await page.screenshot({
    path: 'test-results/mobile-carousel-slide2.png',
    fullPage: false
  });

  console.log('Screenshots saved to test-results/');
});
