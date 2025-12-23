const fs = require('fs');
const path = require('path');

module.exports = function() {
  const pagesDir = path.join(__dirname, 'pages');
  const pages = {};

  function readJsonFiles(dir, prefix = '') {
    if (!fs.existsSync(dir)) return;

    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        readJsonFiles(fullPath, prefix + file + '/');
      } else if (file.endsWith('.json')) {
        const pageName = prefix + file.replace('.json', '');
        pages[pageName] = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      }
    });
  }

  readJsonFiles(pagesDir);
  return pages;
};
