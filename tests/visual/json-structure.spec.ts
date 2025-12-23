import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('JSON Structure Tests', () => {

  test('All pages with templates have corresponding JSON files', () => {
    const templatesDir = path.join(process.cwd(), 'src/templates');
    const pagesDir = path.join(process.cwd(), 'src/data/pages');
    const dataDir = path.join(process.cwd(), 'src/data');

    // Get all template files
    const templateFiles = fs.readdirSync(templatesDir)
      .filter(file => file.endsWith('.njk') && !file.startsWith('_'));

    // Define which templates need page JSON files
    // Some templates use root data files (contact.json, faq.json) or collections (blog.njk, blog-post.njk)
    const pageTemplateMapping = {
      'index.njk': 'pages/home.json',
      'sobre-nosotros.njk': 'pages/sobre-nosotros.json',
      'aprendizaje.njk': 'pages/aprendizaje-y-metodologia.json',
      'reset.njk': 'pages/reset.json',
      'politica-privacidad.njk': 'pages/politica-privacidad.json',
      'terminos-condiciones.njk': 'pages/terminos-condiciones.json',
      'programa.njk': 'pages/programs/', // Directory with multiple program files
      'blog-post.njk': 'pages/blog/', // Directory with blog post files
      'contacto.njk': 'pages/contacto.json',
      'faq.njk': 'pages/faq.json',
      'blog.njk': null // Uses collections, no specific JSON file needed
    };

    for (const [template, jsonPath] of Object.entries(pageTemplateMapping)) {
      if (jsonPath === null) continue; // Skip templates that don't need JSON files

      const fullPath = jsonPath.startsWith('pages/')
        ? path.join(pagesDir, jsonPath.replace('pages/', ''))
        : path.join(dataDir, jsonPath);

      // Check if it's a directory (for programa.njk and blog-post.njk)
      if (jsonPath.endsWith('/')) {
        expect(fs.existsSync(fullPath), `Directory ${fullPath} should exist for ${template}`).toBeTruthy();
        expect(fs.statSync(fullPath).isDirectory(), `${fullPath} should be a directory`).toBeTruthy();

        // Verify directory has at least one JSON file
        const jsonFiles = fs.readdirSync(fullPath).filter(f => f.endsWith('.json'));
        expect(jsonFiles.length, `${fullPath} should contain at least one JSON file`).toBeGreaterThan(0);
      } else {
        // Check if file exists
        expect(fs.existsSync(fullPath), `JSON file ${fullPath} should exist for ${template}`).toBeTruthy();

        // Verify it's valid JSON
        const content = fs.readFileSync(fullPath, 'utf8');
        expect(() => JSON.parse(content), `${fullPath} should be valid JSON`).not.toThrow();
      }
    }
  });

  test('All page JSON files have required structure', () => {
    const pagesDir = path.join(process.cwd(), 'src/data/pages');

    function checkJsonFiles(dir: string, isBlogDir: boolean = false) {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          checkJsonFiles(fullPath, item === 'blog');
        } else if (item.endsWith('.json')) {
          const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

          // Blog posts and program files have different structure
          if (isBlogDir || fullPath.includes('/programs/')) {
            // Blog posts and programs should have basic fields
            expect(content, `${fullPath} should have slug`).toHaveProperty('slug');
            const hasTitle = content.hasOwnProperty('title') || content.hasOwnProperty('name');
            expect(hasTitle, `${fullPath} should have title or name property`).toBeTruthy();
          } else {
            // Regular pages should have meta and content structure
            expect(content, `${fullPath} should have meta object`).toHaveProperty('meta');
            expect(content, `${fullPath} should have content object`).toHaveProperty('content');
            expect(content.meta, `${fullPath} meta should have slug`).toHaveProperty('slug');
            expect(content.meta, `${fullPath} meta should have seo object`).toHaveProperty('seo');
          }
        }
      }
    }

    checkJsonFiles(pagesDir);
  });

  test('No duplicate content in JSON arrays', () => {
    const pagesDir = path.join(process.cwd(), 'src/data/pages');

    function checkForDuplicates(dir: string) {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          checkForDuplicates(fullPath);
        } else if (item.endsWith('.json')) {
          const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

          // Check arrays for duplicates
          function checkArraysRecursively(obj: any, path: string = '') {
            if (Array.isArray(obj)) {
              // Check if array has duplicates by comparing JSON strings
              const seen = new Set<string>();
              for (const item of obj) {
                const itemStr = JSON.stringify(item);
                expect(seen.has(itemStr), `${fullPath}${path} has duplicate items: ${itemStr.substring(0, 100)}...`).toBeFalsy();
                seen.add(itemStr);
              }

              // Recursively check items in array
              obj.forEach((item, index) => {
                if (typeof item === 'object' && item !== null) {
                  checkArraysRecursively(item, `${path}[${index}]`);
                }
              });
            } else if (typeof obj === 'object' && obj !== null) {
              for (const [key, value] of Object.entries(obj)) {
                checkArraysRecursively(value, `${path}.${key}`);
              }
            }
          }

          checkArraysRecursively(content);
        }
      }
    }

    checkForDuplicates(pagesDir);
  });

  test('Templates should not contain literal content text', () => {
    const templatesDir = path.join(process.cwd(), 'src/templates');
    const allowedLiteralPatterns = [
      // Allow structural HTML/attributes
      /class="[^"]*"/g,
      /id="[^"]*"/g,
      /aria-[a-z]+="[^"]*"/g,
      /href="[^"]*"/g,
      /src="[^"]*"/g,
      /alt=""/g, // Empty alt is OK
      /type="[^"]*"/g,
      /name="[^"]*"/g,
      /for="[^"]*"/g,
      /value=""/g, // Empty value is OK
      /placeholder=""/g, // Empty placeholder is OK
      // Allow common structural elements
      /<\/?[a-z]+/gi, // HTML tags
      /\{\{[^}]+\}\}/g, // Nunjucks variables
      /\{%[^%]+%\}/g, // Nunjucks tags
      /---[\s\S]*?---/g, // Front matter
    ];

    const templateFiles = fs.readdirSync(templatesDir)
      .filter(file => file.endsWith('.njk') && !file.startsWith('_'));

    for (const templateFile of templateFiles) {
      const fullPath = path.join(templatesDir, templateFile);
      let content = fs.readFileSync(fullPath, 'utf8');

      // Remove all allowed patterns
      for (const pattern of allowedLiteralPatterns) {
        content = content.replace(pattern, '');
      }

      // Remove whitespace, newlines, tabs
      content = content.replace(/\s+/g, ' ').trim();

      // Check for Spanish text (common words that indicate literal content)
      const spanishWords = [
        'Selecciona un tema', // from contacto.njk
        'Enviar mensaje',
        'Envíanos un mensaje',
        'Artículos sobre', // from blog.njk
        'Leer más →',
        '¿Quieres saber más?',
        'Contacta con nosotros',
        'Contáctanos'
      ];

      for (const word of spanishWords) {
        if (content.includes(word)) {
          // Check if it's not coming from a variable
          const originalContent = fs.readFileSync(fullPath, 'utf8');
          const regex = new RegExp(`(?<!\\{\\{[^}]*)"${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"(?![^{]*\\}\\})`, 'g');
          const matches = originalContent.match(regex);

          if (matches) {
            throw new Error(`Template ${templateFile} contains literal Spanish text: "${word}". All content should be in JSON files.`);
          }
        }
      }
    }
  });

});
