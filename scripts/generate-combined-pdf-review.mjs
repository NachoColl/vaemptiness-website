import { chromium } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'fs';
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

async function extractTextContent(page) {
  return await page.evaluate(() => {
    const content = {};
    const cleanText = (text) => text?.trim().replace(/\s+/g, ' ') || '';

    const header = document.querySelector('header');
    if (header) {
      const navLinks = Array.from(header.querySelectorAll('nav a')).map(a => cleanText(a.textContent));
      content.navigation = navLinks;
    }

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

      section.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
        sectionData.headings.push({
          level: h.tagName.toLowerCase(),
          text: cleanText(h.textContent)
        });
      });

      section.querySelectorAll('p').forEach(p => {
        const text = cleanText(p.textContent);
        if (text && !p.closest('.quote-large, .quote-medium, .quote-emphasis, blockquote')) {
          sectionData.paragraphs.push(text);
        }
      });

      section.querySelectorAll('.quote-large, .quote-medium, .quote-emphasis, blockquote').forEach(q => {
        const text = cleanText(q.textContent);
        if (text) {
          sectionData.quotes.push(text);
        }
      });

      section.querySelectorAll('ul, ol').forEach(list => {
        const items = Array.from(list.querySelectorAll('li')).map(li => cleanText(li.textContent));
        if (items.length > 0) {
          sectionData.lists.push(items);
        }
      });

      section.querySelectorAll('a.button, .button-primary, .button-secondary').forEach(btn => {
        sectionData.buttons.push(cleanText(btn.textContent));
      });

      sections.push(sectionData);
    });

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

    return { sections, footer: footerData };
  });
}

function generatePageHTML(pageInfo, textContent, pageNumber, totalPages, screenshotsPath) {
  const { name, title, path } = pageInfo;

  const desktopImagePath = `file://${screenshotsPath}/${name}-desktop.png`;
  const mobileImagePath = `file://${screenshotsPath}/${name}-mobile.png`;

  let html = `
  <!-- Page ${pageNumber} of ${totalPages} -->
  <div class="page-section">
    <div class="page-number-header">Página ${pageNumber} de ${totalPages}</div>
    <h1>${title}</h1>
    <p class="url"><strong>URL:</strong> https://vaemptiness.es${path}</p>

    <div class="version-header">VERSIÓN DESKTOP</div>

    <h2>CAPTURA DE PANTALLA - DESKTOP</h2>
    <img src="${desktopImagePath}" alt="Screenshot Desktop ${title}" class="screenshot">

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

    if (section.headings.length > 0) {
      html += `<div class="content-item"><strong>Títulos:</strong><ul>`;
      section.headings.forEach(h => {
        html += `<li>${h.text}</li>`;
      });
      html += `</ul></div>`;
    }

    if (section.paragraphs.length > 0) {
      html += `<div class="content-item"><strong>Texto:</strong><ul>`;
      section.paragraphs.forEach(p => {
        html += `<li>${p}</li>`;
      });
      html += `</ul></div>`;
    }

    if (section.quotes.length > 0) {
      html += `<div class="content-item"><strong>Citas destacadas:</strong><ul>`;
      section.quotes.forEach(q => {
        html += `<li>"${q}"</li>`;
      });
      html += `</ul></div>`;
    }

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

  // Desktop notes
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
    <img src="${mobileImagePath}" alt="Screenshot Mobile ${title}" class="screenshot">

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

    <div class="page-break"></div>
  </div>
  `;

  return html;
}

async function main() {
  console.log('🚀 Generando PDF único con todas las páginas...\n');

  const outputDir = join(rootDir, 'page-reviews');
  const pdfOutputDir = join(outputDir, 'pdf');
  mkdirSync(pdfOutputDir, { recursive: true });

  console.log('⏳ Esperando que el servidor esté listo...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  const browser = await chromium.launch();

  // Generate cover page
  let fullHTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Revisión Completa - vaemptîness Website</title>
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
    .cover-page {
      text-align: center;
      padding: 100px 40px;
    }
    .cover-title {
      font-size: 48px;
      color: #b85c4f;
      margin-bottom: 20px;
    }
    .cover-subtitle {
      font-size: 24px;
      color: #666;
      margin-bottom: 40px;
    }
    .cover-info {
      font-size: 18px;
      color: #888;
      margin-top: 60px;
    }
    .page-number-header {
      text-align: right;
      color: #999;
      font-size: 12px;
      margin-bottom: 20px;
    }
    .page-section {
      margin-bottom: 40px;
    }
    .toc {
      margin: 40px 0;
    }
    .toc-item {
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
  </style>
</head>
<body>
  <!-- COVER PAGE -->
  <div class="cover-page">
    <div class="cover-title">vaemptîness</div>
    <div class="cover-subtitle">Documento de Revisión Web</div>
    <p class="cover-info">Este documento contiene la revisión completa de todas las páginas del sitio web vaemptiness.es</p>
    <p class="cover-info">Total de páginas: ${pages.length}</p>
    <p class="cover-info">Fecha de generación: ${new Date().toLocaleDateString('es-ES')}</p>
  </div>
  <div class="page-break"></div>

  <!-- TABLE OF CONTENTS -->
  <h1>Índice de Contenidos</h1>
  <div class="toc">`;

  pages.forEach((page, idx) => {
    fullHTML += `
    <div class="toc-item">
      <strong>${idx + 1}.</strong> ${page.title}
    </div>`;
  });

  fullHTML += `
  </div>
  <div class="page-break"></div>
`;

  // Process each page
  const totalPages = pages.length;
  const screenshotsPath = join(outputDir, 'screenshots');

  for (let i = 0; i < pages.length; i++) {
    const pageInfo = pages[i];
    console.log(`\n📄 Procesando ${i + 1}/${totalPages}: ${pageInfo.title}`);

    const url = `${baseUrl}${pageInfo.path}`;

    try {
      // Extract content
      const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
      const page = await context.newPage();
      await page.goto(url, { waitUntil: 'networkidle' });
      const textContent = await extractTextContent(page);
      await context.close();

      // Generate HTML for this page
      const pageHTML = generatePageHTML(pageInfo, textContent, i + 1, totalPages, screenshotsPath);
      fullHTML += pageHTML;

      console.log(`   ✅ Contenido agregado`);

    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
    }
  }

  // Add final signature section
  fullHTML += `
  <div class="section-divider"></div>
  <h2>FIRMA Y APROBACIÓN</h2>
  <div class="comment-box">
    <p><strong>Revisado por:</strong> ___________________________</p>
    <p><strong>Fecha:</strong> ___________________________</p>
    <p><strong>Firma:</strong></p>
    <div style="min-height: 80px;"></div>
  </div>
</body>
</html>`;

  // Save HTML
  const htmlPath = join(pdfOutputDir, 'revision-completa.html');
  writeFileSync(htmlPath, fullHTML, 'utf-8');
  console.log(`\n💾 HTML guardado en: ${htmlPath}`);

  // Generate PDF
  console.log(`\n📄 Generando PDF único...`);
  const pdfContext = await browser.newContext();
  const pdfPage = await pdfContext.newPage();
  await pdfPage.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });

  const pdfPath = join(pdfOutputDir, 'revision-completa-vaemptiness.pdf');
  await pdfPage.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '15mm',
      right: '15mm',
      bottom: '15mm',
      left: '15mm'
    }
  });

  await pdfContext.close();
  await browser.close();

  console.log(`\n✅ PDF generado exitosamente!`);
  console.log(`\n📁 Ubicación: ${pdfPath}`);
  console.log(`\n📊 Contenido:`);
  console.log(`   - Portada`);
  console.log(`   - Índice de contenidos`);
  console.log(`   - ${pages.length} páginas completas (Desktop + Mobile)`);
  console.log(`   - Espacios editables para comentarios`);
  console.log(`\n💡 El PDF puede imprimirse y llenarse a mano o editarse digitalmente.`);
}

main().catch(console.error);
