const fs = require('fs');
const path = require('path');

module.exports = function(eleventyConfig) {
  // Pass through assets - copy src/assets to _site/assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Copy CNAME file for custom domain
  eleventyConfig.addPassthroughCopy("CNAME");

  // Copy admin folder for Decap CMS
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });

  // Watch for changes
  eleventyConfig.addWatchTarget("src/assets/");

  // Add current year shortcode for dynamic copyright
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Add custom filter for startsWith check
  eleventyConfig.addFilter("startsWith", function(str, prefix) {
    if (typeof str !== 'string' || typeof prefix !== 'string') return false;
    return str.indexOf(prefix) === 0;
  });

  // Transform to automatically bold "vaemptîness" across all pages
  eleventyConfig.addTransform("autoBoldVaemptiness", function(content, outputPath) {
    // Only process HTML files
    if (!outputPath || !outputPath.endsWith(".html")) {
      return content;
    }

    let result = content;

    // Step 1: Preserve blocks we don't want to modify
    const preservedBlocks = [];
    let blockIndex = 0;

    // Preserve script tags
    result = result.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (match) => {
      preservedBlocks.push(match);
      return `<!--PRESERVED_BLOCK_${blockIndex++}-->`;
    });

    // Preserve style tags
    result = result.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, (match) => {
      preservedBlocks.push(match);
      return `<!--PRESERVED_BLOCK_${blockIndex++}-->`;
    });

    // Preserve code and pre tags
    result = result.replace(/<(code|pre)\b[^>]*>[\s\S]*?<\/\1>/gi, (match) => {
      preservedBlocks.push(match);
      return `<!--PRESERVED_BLOCK_${blockIndex++}-->`;
    });

    // Preserve headings (titles and subtitles - h1, h2, h3, h4, h5, h6)
    result = result.replace(/<(h[1-6])\b[^>]*>[\s\S]*?<\/\1>/gi, (match) => {
      preservedBlocks.push(match);
      return `<!--PRESERVED_BLOCK_${blockIndex++}-->`;
    });

    // Step 2: Temporarily replace already-bold instances with placeholder
    const alreadyBoldInstances = [];
    let boldIndex = 0;

    result = result.replace(/<(strong|b)([^>]*)>(.*?vaempt[îi]ness.*?)<\/\1>/gi, (match) => {
      alreadyBoldInstances.push(match);
      return `<!--ALREADY_BOLD_${boldIndex++}-->`;
    });

    // Step 3: Bold all remaining instances of vaemptîness/vaemptiness
    // Only match word boundaries to avoid partial matches
    result = result.replace(/\b(vaempt[îi]ness)\b/gi, '<strong>$1</strong>');

    // Step 4: Restore already-bold instances (prevent double-bolding)
    alreadyBoldInstances.forEach((bold, index) => {
      result = result.replace(`<!--ALREADY_BOLD_${index}-->`, bold);
    });

    // Step 5: Restore preserved blocks
    preservedBlocks.forEach((block, index) => {
      result = result.replace(`<!--PRESERVED_BLOCK_${index}-->`, block);
    });

    return result;
  });

  // Note: Page data is loaded via src/data/pages.js instead of addGlobalData

  // Create programs collection from individual files (will be used later)
  eleventyConfig.addCollection("programsFromFiles", function() {
    const programsDir = path.join(__dirname, 'src/data/pages/programs');

    if (!fs.existsSync(programsDir)) return [];

    return fs.readdirSync(programsDir)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const data = JSON.parse(fs.readFileSync(path.join(programsDir, file), 'utf8'));
        return {
          ...data,
          url: `/${data.slug}/`,
          template: 'programa.njk'
        };
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  });

  // Create blog collection from individual files (will be used later)
  eleventyConfig.addCollection("blogFromFiles", function() {
    const blogDir = path.join(__dirname, 'src/data/pages/blog');

    if (!fs.existsSync(blogDir)) return [];

    return fs.readdirSync(blogDir)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        const data = JSON.parse(fs.readFileSync(path.join(blogDir, file), 'utf8'));
        return {
          ...data,
          url: `/blog/${data.slug}/`,
          template: 'blog-post.njk'
        };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  // Use pathPrefix only when deploying to GitHub Pages subdirectory
  // When custom domain is configured, this will be empty
  const pathPrefix = process.env.ELEVENTY_PATH_PREFIX || "";

  return {
    dir: {
      input: "src/templates",
      output: "_site",
      includes: "_includes",
      data: "../data"
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    pathPrefix: pathPrefix
  };
};
