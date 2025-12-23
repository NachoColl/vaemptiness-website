const fs = require('fs');
const path = require('path');

module.exports = function(eleventyConfig) {
  // Pass through assets - copy src/assets to _site/assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Copy CNAME file for custom domain
  eleventyConfig.addPassthroughCopy("CNAME");

  // Watch for changes
  eleventyConfig.addWatchTarget("src/assets/");

  // Add current year shortcode for dynamic copyright
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

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
