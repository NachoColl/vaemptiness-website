module.exports = {
  eleventyComputed: {
    seo: (data) => data.pages["politica-privacidad"].meta.seo,
    bodyClass: (data) => data.pages["politica-privacidad"].meta.bodyClass,
    title: (data) => data.pages["politica-privacidad"].meta.title,
    permalink: (data) => data.pages["politica-privacidad"].meta.permalink
  }
};
