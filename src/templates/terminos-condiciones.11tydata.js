module.exports = {
  eleventyComputed: {
    seo: (data) => data.pages["terminos-condiciones"].meta.seo,
    bodyClass: (data) => data.pages["terminos-condiciones"].meta.bodyClass,
    title: (data) => data.pages["terminos-condiciones"].meta.title,
    permalink: (data) => data.pages["terminos-condiciones"].meta.permalink
  }
};
