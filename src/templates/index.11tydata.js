module.exports = {
  eleventyComputed: {
    seo: (data) => data.pages.home.meta.seo,
    bodyClass: (data) => data.pages.home.meta.bodyClass
  }
};
