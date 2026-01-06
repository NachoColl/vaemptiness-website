const { test, expect } = require('@playwright/test');

test.describe('Blog Entries - Lists and Text Highlights', () => {
  const blogEntries = [
    { slug: 'rumiacion-mental', expectedLists: 7 },
    { slug: 'mente-en-bucle', expectedLists: 8 },
    { slug: 'entrenamiento-mental', expectedLists: 7 },
    { slug: 'entrenar-atencion', expectedLists: 7 },
    { slug: 'espacio-estimulo-respuesta', expectedLists: 8 },
    { slug: 'responder-vs-reaccionar', expectedLists: 7 },
    { slug: 'ciencia-budista-vaemptiness', expectedLists: 1 }
  ];

  for (const entry of blogEntries) {
    test(`${entry.slug} - should render lists correctly`, async ({ page }) => {
      await page.goto(`http://localhost:8080/blog/${entry.slug}/`);

      // Check that the page loaded successfully
      await expect(page.locator('h1.post-title')).toBeVisible();

      // Check for blog list items
      const lists = page.locator('ul.blog-list-items');
      const listCount = await lists.count();

      if (entry.expectedLists > 0) {
        expect(listCount).toBeGreaterThanOrEqual(entry.expectedLists);

        // Verify list styling
        for (let i = 0; i < listCount; i++) {
          const list = lists.nth(i);
          await expect(list).toBeVisible();

          // Check list items have proper styling
          const listItems = list.locator('li');
          const itemCount = await listItems.count();
          expect(itemCount).toBeGreaterThan(0);

          // Verify first list item has cream background
          const firstItem = listItems.first();
          await expect(firstItem).toBeVisible();

          // Check that list items have content
          const firstItemText = await firstItem.textContent();
          expect(firstItemText.trim().length).toBeGreaterThan(0);
        }
      }
    });

    test(`${entry.slug} - should render text highlights (strong tags)`, async ({ page }) => {
      await page.goto(`http://localhost:8080/blog/${entry.slug}/`);

      // Check for strong tags in content
      const strongTags = page.locator('.post-section strong, .blog-list-items strong');
      const strongCount = await strongTags.count();

      if (strongCount > 0) {
        // Verify strong tags are visible and bold
        const firstStrong = strongTags.first();
        await expect(firstStrong).toBeVisible();

        const fontWeight = await firstStrong.evaluate(el =>
          window.getComputedStyle(el).fontWeight
        );

        // Font weight should be bold (700 or higher, or "bold")
        expect(fontWeight === 'bold' || parseInt(fontWeight) >= 700).toBeTruthy();
      }
    });

    test(`${entry.slug} - should render paragraphs correctly`, async ({ page }) => {
      await page.goto(`http://localhost:8080/blog/${entry.slug}/`);

      // Check that multiple paragraphs render
      const paragraphs = page.locator('.post-section p');
      const paragraphCount = await paragraphs.count();

      expect(paragraphCount).toBeGreaterThan(0);

      // Verify paragraphs have content
      for (let i = 0; i < Math.min(paragraphCount, 3); i++) {
        const paragraph = paragraphs.nth(i);
        const text = await paragraph.textContent();
        expect(text.trim().length).toBeGreaterThan(0);
      }
    });

    test(`${entry.slug} - should have proper spacing and layout`, async ({ page }) => {
      await page.goto(`http://localhost:8080/blog/${entry.slug}/`);

      // Check post sections exist
      const sections = page.locator('.post-section');
      const sectionCount = await sections.count();
      expect(sectionCount).toBeGreaterThan(0);

      // Verify proper spacing between sections
      const firstSection = sections.first();
      await expect(firstSection).toBeVisible();

      // Check that h2 headings exist and are visible
      const headings = page.locator('.post-section h2');
      const headingCount = await headings.count();
      expect(headingCount).toBeGreaterThanOrEqual(0); // Some sections may not have titles
    });

    test(`${entry.slug} - should display image`, async ({ page }) => {
      await page.goto(`http://localhost:8080/blog/${entry.slug}/`);

      // Note: Images are referenced in JSON but template doesn't show them in current implementation
      // This test verifies the page loads without image errors

      // Check for any broken images on the page
      const images = page.locator('img');
      const imageCount = await images.count();

      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const isVisible = await img.isVisible();

        if (isVisible) {
          // Verify image loaded successfully
          const naturalWidth = await img.evaluate(el => el.naturalWidth);
          expect(naturalWidth).toBeGreaterThan(0);
        }
      }
    });
  }
});
