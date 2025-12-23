module.exports = {
  eleventyComputed: {
    seo: (data) => data.pages.reset.meta.seo,
    bodyClass: (data) => data.pages.reset.meta.bodyClass,
    title: (data) => data.pages.reset.meta.title,
    permalink: (data) => data.pages.reset.meta.permalink
  }
};
