module.exports = {
  eleventyComputed: {
    seo: (data) => data.pages["aprendizaje-y-metodologia"].meta.seo,
    bodyClass: (data) => data.pages["aprendizaje-y-metodologia"].meta.bodyClass,
    title: (data) => data.pages["aprendizaje-y-metodologia"].meta.title,
    permalink: (data) => data.pages["aprendizaje-y-metodologia"].meta.permalink
  }
};
