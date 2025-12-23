module.exports = {
  eleventyComputed: {
    seo: (data) => data.pages.faq.meta.seo,
    bodyClass: (data) => data.pages.faq.meta.bodyClass,
    permalink: (data) => data.pages.faq.meta.permalink
  }
};
