module.exports = {
  eleventyComputed: {
    seo: (data) => data.pages.contacto.meta.seo,
    bodyClass: (data) => data.pages.contacto.meta.bodyClass,
    permalink: (data) => data.pages.contacto.meta.permalink
  }
};
