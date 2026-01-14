const { test } = require('@playwright/test');

test('Capture testimonials section on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 851 });

  await page.goto('http://localhost:8080/vaemptiness-equipos/');

  // Scroll past the outcomes section to testimonials
  await page.evaluate(() => {
    const testimonials = document.querySelector('.program-testimonials');
    if (testimonials) {
      testimonials.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  });

  await page.waitForTimeout(500);

  // Take screenshot of viewport showing testimonials
  await page.screenshot({
    path: 'test-results/mobile-testimonials-viewport.png',
    fullPage: false
  });

  // Take screenshot of just testimonials section
  const testimonials = page.locator('.program-testimonials');
  await testimonials.screenshot({
    path: 'test-results/mobile-testimonials-only.png'
  });

  // Get the actual testimonial text visibility
  const firstQuote = await page.locator('.testimonial-quote').first().textContent();
  console.log('First testimonial text:', firstQuote.substring(0, 100) + '...');

  // Check if quote icon is visible
  const iconVisible = await page.locator('.testimonial-quote-icon').first().isVisible();
  console.log('Quote icon visible:', iconVisible);

  // Check carousel dots
  const dotsCount = await page.locator('.carousel-dot').count();
  console.log('Number of carousel dots:', dotsCount);

  // Click second dot and capture
  if (dotsCount > 1) {
    await page.locator('.carousel-dot').nth(1).click();
    await page.waitForTimeout(600);

    await page.screenshot({
      path: 'test-results/mobile-testimonials-slide2-viewport.png',
      fullPage: false
    });

    const secondQuote = await page.locator('.testimonial-quote').nth(1).textContent();
    console.log('Second testimonial text:', secondQuote.substring(0, 100) + '...');
  }
});
