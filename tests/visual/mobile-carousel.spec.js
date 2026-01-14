const { test, expect } = require('@playwright/test');

test.describe('Mobile Testimonials Carousel', () => {
  test('carousel should be responsive and work on mobile', async ({ page }) => {
    // Navigate to the program page
    await page.goto('http://localhost:8080/vaemptiness-equipos/');

    // Scroll to testimonials section
    const testimonialsSection = page.locator('.program-testimonials');
    await testimonialsSection.scrollIntoViewIfNeeded();

    // Check carousel is visible
    const carousel = page.locator('.testimonials-carousel');
    await expect(carousel).toBeVisible();

    // Get viewport and carousel dimensions
    const viewport = page.viewportSize();
    const carouselBox = await carousel.boundingBox();
    console.log('Viewport width:', viewport.width);
    console.log('Carousel width:', carouselBox.width);

    // Carousel should not exceed viewport width
    expect(carouselBox.width).toBeLessThanOrEqual(viewport.width);

    // Check that testimonial slides exist
    const slides = page.locator('.testimonial-slide');
    await expect(slides).toHaveCount(2);

    // Check that dots exist
    const dots = page.locator('.carousel-dot');
    await expect(dots).toHaveCount(2);

    // First dot should be active
    await expect(dots.first()).toHaveClass(/active/);

    // Click second dot
    await dots.nth(1).click();
    await page.waitForTimeout(600); // Wait for transition

    // Second dot should now be active
    await expect(dots.nth(1)).toHaveClass(/active/);

    // Check carousel transform
    const track = page.locator('.testimonials-track');
    const transform = await track.evaluate(el => window.getComputedStyle(el).transform);
    console.log('Transform after clicking second dot:', transform);

    // Transform should be approximately -100% (moving to second slide)
    // On Pixel 5 (393px), that's roughly -393px
    expect(transform).toContain('matrix');

    // Verify quote icon is visible on first slide
    const firstSlide = slides.first();
    const quoteIcon = firstSlide.locator('.testimonial-quote-icon');
    await expect(quoteIcon).toBeVisible();

    // Check quote font size is readable
    const quote = page.locator('.testimonial-quote').first();
    const fontSize = await quote.evaluate(el => window.getComputedStyle(el).fontSize);
    console.log('Quote font size:', fontSize);

    const fontSizeNum = parseInt(fontSize);
    expect(fontSizeNum).toBeGreaterThanOrEqual(16);

    // Click first dot to go back
    await dots.first().click();
    await page.waitForTimeout(600);

    // First dot should be active again
    await expect(dots.first()).toHaveClass(/active/);
  });
});
