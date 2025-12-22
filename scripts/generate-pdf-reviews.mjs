import { chromium } from '@playwright/test';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Pages to review
const pages = [
  { path: '/', name: 'index', title: 'INICIO (Homepage)' },
  { path: '/sobre-nosotros/', name: 'sobre-nosotros', title: 'SOBRE NOSOTROS' },
  { path: '/vaemptiness-program/', name: 'vaemptiness-program', title: 'VAEMPTÎNESS PROGRAM' },
  { path: '/vaemptiness-equipos/', name: 'vaemptiness-equipos', title: 'VAEMPTÎNESS EQUIPOS' },
  { path: '/vaemptiness-teen/', name: 'vaemptiness-teen', title: 'VAEMPTÎNESS TEEN' },
  { path: '/vaemptiness-kids/', name: 'vaemptiness-kids', title: 'VAEMPTÎNESS KIDS' },
  { path: '/blog/', name: 'blog', title: 'BLOG (Listado)' },
  { path: '/blog/filosofia-budista-vaemptiness/', name: 'blog-post', title: 'BLOG POST - Filosofía Budista' },
  { path: '/faq/', name: 'faq', title: 'FAQ (Preguntas Frecuentes)' },
  { path: '/contacto/', name: 'contacto', title: 'CONTACTO' },
  { path: '/aprendizaje-y-metodologia/', name: 'aprendizaje', title: 'APRENDIZAJE Y METODOLOGÍA' },
  { path: '/reset/', name: 'reset', title: 'RESET' },
];

const baseUrl = 'http://localhost:8080';

async function generateHTMLTemplate(pageInfo, textContent) {
  const { name, title, path } = pageInfo;

  let html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Revisión: ${title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      line-height: 1.6;
      color: #333;
    }
    h1 {
      color: #b85c4f;
      border-bottom: 3px solid #b85c4f;
      padding-bottom: 10px;
    }
    h2 {
      color: #555;
      margin-top: 30px;
      border-bottom: 2px solid #ddd;
      padding-bottom: 5px;
    }
    h3 {
      color: #666;
      margin-top: 20px;
    }
    .page-break {
      page-break-after: always;
    }
    .screenshot {
      width: 100%;
      border: 1px solid #ddd;
      margin: 20px 0;
    }
    .comment-box {
      background: #f9f9f9;
      border: 2px solid #b85c4f;
      border-radius: 5px;
      padding: 15px;
      margin: 15px 0;
      min-height: 80px;
    }
    .comment-label {
      font-weight: bold;
      color: #b85c4f;
      margin-bottom: 5px;
    }
    .content-item {
      margin: 10px 0;
      padding-left: 20px;
    }
    .section-divider {
      border-top: 1px solid #ddd;
      margin: 30px 0;
    }
    ul {
      margin: 5px 0;
    }
    li {
      margin: 3px 0;
    }
    .version-header {
      background: #b85c4f;
      color: white;
      padding: 20px;
      margin: 30px -40px 30px -40px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
    }
    .url {
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <h1>Página: ${title}</h1>
  <p class="url"><strong>URL:</strong> https://vaemptiness.es${path}</p>

  <!-- DESKTOP VERSION -->
  <div class="version-header">VERSIÓN DESKTOP</div>

  <h2>CAPTURA DE PANTALLA - DESKTOP</h2>
  <img src="screenshots/${name}-desktop.png" alt="Screenshot Desktop ${title}" class="screenshot">

  <div class="page-break"></div>

  <h2>CONTENIDO DE TEXTO PARA REVISIÓN - DESKTOP</h2>
  <p>A continuación se muestra todo el texto visible en la página. Por favor, revisa cada sección y escribe tus comentarios en los espacios proporcionados.</p>
`;

  // Navigation
  if (textContent.navigation && textContent.navigation.length > 0) {
    html += `
  <div class="section-divider"></div>
  <h3>NAVEGACIÓN (Header)</h3>
  <div class="content-item">
    <strong>Enlaces de menú:</strong>
    <ul>`;
    textContent.navigation.forEach(link => {
      html += `<li>${link}</li>`;
    });
    html += `
    </ul>
  </div>
  <div class="comment-box">
    <div class="comment-label">Modificaciones sugeridas:</div>
    <div style="min-height: 60px;"></div>
  </div>`;
  }

  // Sections
  textContent.sections.forEach((section, idx) => {
    const sectionName = section.className.split(' ')[0] || `Sección ${idx + 1}`;
    html += `
  <div class="section-divider"></div>
  <h3>SECCIÓN: ${sectionName.toUpperCase()}</h3>`;

    // Headings
    if (section.headings.length > 0) {
      html += `<div class="content-item"><strong>Títulos:</strong><ul>`;
      section.headings.forEach(h => {
        html += `<li>${h.text}</li>`;
      });
      html += `</ul></div>`;
    }

    // Paragraphs
    if (section.paragraphs.length > 0) {
      html += `<div class="content-item"><strong>Texto:</strong><ul>`;
      section.paragraphs.forEach(p => {
        html += `<li>${p}</li>`;
      });
      html += `</ul></div>`;
    }

    // Quotes
    if (section.quotes.length > 0) {
      html += `<div class="content-item"><strong>Citas destacadas:</strong><ul>`;
      section.quotes.forEach(q => {
        html += `<li>"${q}"</li>`;
      });
      html += `</ul></div>`;
    }

    // Lists
    if (section.lists.length > 0) {
      html += `<div class="content-item"><strong>Listas:</strong>`;
      section.lists.forEach((list, listIdx) => {
        html += `<br>Lista ${listIdx + 1}:<ul>`;
        list.forEach(item => {
          html += `<li>${item}</li>`;
        });
        html += `</ul>`;
      });
      html += `</div>`;
    }

    // Buttons
    if (section.buttons.length > 0) {
      html += `<div class="content-item"><strong>Botones/Enlaces:</strong><ul>`;
      section.buttons.forEach(btn => {
        html += `<li>${btn}</li>`;
      });
      html += `</ul></div>`;
    }

    html += `
  <div class="comment-box">
    <div class="comment-label">Modificaciones sugeridas:</div>
    <div style="min-height: 60px;"></div>
  </div>`;
  });

  // Footer
  if (textContent.footer && Object.keys(textContent.footer).length > 0) {
    html += `
  <div class="section-divider"></div>
  <h3>FOOTER (Pie de página)</h3>`;

    Object.entries(textContent.footer).forEach(([key, value]) => {
      if (key === 'copyright') {
        html += `<div class="content-item"><strong>Copyright:</strong> ${value}</div>`;
      } else if (Array.isArray(value)) {
        html += `<div class="content-item"><strong>${key}:</strong><ul>`;
        value.forEach(item => {
          html += `<li>${item}</li>`;
        });
        html += `</ul></div>`;
      }
    });

    html += `
  <div class="comment-box">
    <div class="comment-label">Modificaciones sugeridas:</div>
    <div style="min-height: 60px;"></div>
  </div>`;
  }

  // Desktop general notes
  html += `
  <div class="section-divider"></div>
  <h2>NOTAS GENERALES - VERSIÓN DESKTOP</h2>
  <div class="comment-box">
    <div class="comment-label">Comentarios adicionales, problemas detectados, o cambios estructurales necesarios:</div>
    <div style="min-height: 100px;"></div>
  </div>

  <div class="page-break"></div>

  <!-- MOBILE VERSION -->
  <div class="version-header">VERSIÓN MOBILE</div>

  <h2>CAPTURA DE PANTALLA - MOBILE</h2>
  <img src="screenshots/${name}-mobile.png" alt="Screenshot Mobile ${title}" class="screenshot">

  <div class="page-break"></div>

  <h2>REVISIÓN - MOBILE</h2>
  <p>El contenido de texto es el mismo que en la versión desktop. Por favor, revisa los siguientes aspectos específicos de la versión móvil:</p>

  <h3>ASPECTOS A REVISAR EN MOBILE:</h3>

  <div class="content-item">
    <strong>1. Navegación móvil (menú hamburguesa):</strong>
    <ul>
      <li>¿Funciona correctamente?</li>
      <li>¿Es fácil de usar?</li>
    </ul>
  </div>
  <div class="comment-box">
    <div class="comment-label">Comentarios:</div>
    <div style="min-height: 60px;"></div>
  </div>

  <div class="content-item">
    <strong>2. Legibilidad del texto:</strong>
    <ul>
      <li>¿El tamaño de fuente es adecuado?</li>
      <li>¿Los espacios entre elementos son correctos?</li>
    </ul>
  </div>
  <div class="comment-box">
    <div class="comment-label">Comentarios:</div>
    <div style="min-height: 60px;"></div>
  </div>

  <div class="content-item">
    <strong>3. Imágenes y elementos visuales:</strong>
    <ul>
      <li>¿Las imágenes se adaptan bien al tamaño de pantalla?</li>
      <li>¿Los elementos visuales están bien proporcionados?</li>
    </ul>
  </div>
  <div class="comment-box">
    <div class="comment-label">Comentarios:</div>
    <div style="min-height: 60px;"></div>
  </div>

  <div class="content-item">
    <strong>4. Botones y enlaces:</strong>
    <ul>
      <li>¿Los botones son fáciles de pulsar?</li>
      <li>¿El tamaño es apropiado para dedos?</li>
    </ul>
  </div>
  <div class="comment-box">
    <div class="comment-label">Comentarios:</div>
    <div style="min-height: 60px;"></div>
  </div>

  <div class="content-item">
    <strong>5. Diseño general responsive:</strong>
    <ul>
      <li>¿El diseño se adapta bien a pantalla pequeña?</li>
      <li>¿Hay elementos que se solapen o se vean mal?</li>
    </ul>
  </div>
  <div class="comment-box">
    <div class="comment-label">Comentarios:</div>
    <div style="min-height: 60px;"></div>
  </div>

  <div class="section-divider"></div>
  <h2>NOTAS GENERALES - VERSIÓN MOBILE</h2>
  <div class="comment-box">
    <div class="comment-label">Comentarios adicionales, problemas detectados, o cambios estructurales necesarios:</div>
    <div style="min-height: 100px;"></div>
  </div>

  <div class="section-divider"></div>
  <p><strong>Revisado por:</strong> ___________________________</p>
  <p><strong>Fecha:</strong> ___________________________</p>
</body>
</html>`;

  return html;
}

async function extractTextContent(page) {
  return await page.evaluate(() => {
    const content = {};

    // Helper to clean text
    const cleanText = (text) => text?.trim().replace(/\s+/g, ' ') || '';

    // Extract header/navigation
    const header = document.querySelector('header');
    if (header) {
      const navLinks = Array.from(header.querySelectorAll('nav a')).map(a => cleanText(a.textContent));
      content.navigation = navLinks;
    }

    // Extract all sections
    const sections = [];
    document.querySelectorAll('main section').forEach((section, idx) => {
      const sectionData = {
        className: section.className,
        headings: [],
        paragraphs: [],
        lists: [],
        buttons: [],
        quotes: [],
      };

      // Headings
      section.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
        sectionData.headings.push({
          level: h.tagName.toLowerCase(),
          text: cleanText(h.textContent)
        });
      });

      // Paragraphs
      section.querySelectorAll('p').forEach(p => {
        const text = cleanText(p.textContent);
        if (text && !p.closest('.quote-large, .quote-medium, .quote-emphasis, blockquote')) {
          sectionData.paragraphs.push(text);
        }
      });

      // Quotes
      section.querySelectorAll('.quote-large, .quote-medium, .quote-emphasis, blockquote').forEach(q => {
        const text = cleanText(q.textContent);
        if (text) {
          sectionData.quotes.push(text);
        }
      });

      // Lists
      section.querySelectorAll('ul, ol').forEach(list => {
        const items = Array.from(list.querySelectorAll('li')).map(li => cleanText(li.textContent));
        if (items.length > 0) {
          sectionData.lists.push(items);
        }
      });

      // Buttons
      section.querySelectorAll('a.button, .button-primary, .button-secondary').forEach(btn => {
        sectionData.buttons.push(cleanText(btn.textContent));
      });

      sections.push(sectionData);
    });

    // Extract footer
    const footer = document.querySelector('footer');
    const footerData = {};
    if (footer) {
      footer.querySelectorAll('nav').forEach((nav, idx) => {
        const title = nav.querySelector('h3')?.textContent?.trim();
        const links = Array.from(nav.querySelectorAll('a')).map(a => cleanText(a.textContent));
        if (title) {
          footerData[title] = links;
        }
      });

      const copyright = footer.querySelector('.copyright');
      if (copyright) {
        footerData.copyright = cleanText(copyright.textContent);
      }
    }

    return {
      sections,
      footer: footerData
    };
  });
}

async function main() {
  console.log('🚀 Generando PDFs de revisión con campos editables...\n');

  const outputDir = join(rootDir, 'page-reviews');
  const pdfOutputDir = join(outputDir, 'pdf');
  mkdirSync(pdfOutputDir, { recursive: true });

  console.log('⏳ Esperando que el servidor esté listo...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  const browser = await chromium.launch();

  for (const pageInfo of pages) {
    console.log(`\n📄 Procesando: ${pageInfo.title} (${pageInfo.path})`);

    const url = `${baseUrl}${pageInfo.path}`;

    try {
      // Desktop version - extract text content
      console.log(`   📝 Extrayendo contenido de texto...`);
      const desktopContext = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
      });
      const desktopPage = await desktopContext.newPage();
      await desktopPage.goto(url, { waitUntil: 'networkidle' });
      const textContent = await extractTextContent(desktopPage);
      await desktopContext.close();

      // Generate HTML template
      console.log(`   🌐 Generando plantilla HTML...`);
      const html = await generateHTMLTemplate(pageInfo, textContent);
      const htmlPath = join(pdfOutputDir, `${pageInfo.name}.html`);
      writeFileSync(htmlPath, html, 'utf-8');

      // Generate PDF from HTML with Puppeteer
      console.log(`   📄 Generando PDF...`);
      const pdfContext = await browser.newContext();
      const pdfPage = await pdfContext.newPage();

      // Navigate to HTML file
      await pdfPage.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });

      const pdfPath = join(pdfOutputDir, `${pageInfo.name}.pdf`);
      await pdfPage.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        }
      });

      await pdfContext.close();

      console.log(`   ✅ PDF generado: ${pdfPath}`);

    } catch (error) {
      console.error(`   ❌ Error procesando ${pageInfo.title}:`, error.message);
    }
  }

  await browser.close();

  console.log('\n✅ Todos los PDFs han sido generados en:', pdfOutputDir);
  console.log('\n📋 Archivos generados:');
  pages.forEach(p => {
    console.log(`   - ${p.name}.pdf`);
  });

  console.log('\n💡 Próximos pasos:');
  console.log('   1. Los PDFs están en page-reviews/pdf/');
  console.log('   2. Cada PDF incluye versión Desktop y Mobile con screenshots');
  console.log('   3. Los usuarios pueden editar los campos de comentarios en el PDF');
  console.log('   4. Comparte los PDFs con el cliente para revisión');
}

main().catch(console.error);
