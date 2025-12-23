module.exports = {
  eleventyComputed: {
    seo: (data) => data.pages["sobre-nosotros"].meta.seo,
    bodyClass: (data) => data.pages["sobre-nosotros"].meta.bodyClass,
    permalink: (data) => data.pages["sobre-nosotros"].meta.permalink
  }
};
