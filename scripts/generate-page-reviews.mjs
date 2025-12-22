import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
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

// Create output directory
const outputDir = join(rootDir, 'page-reviews');
mkdirSync(outputDir, { recursive: true });

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

      // Paragraphs (not in quotes or special classes)
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

      // Buttons and links
      section.querySelectorAll('a.button, .button-primary, .button-secondary').forEach(btn => {
        sectionData.buttons.push(cleanText(btn.textContent));
      });

      sections.push(sectionData);
    });

    // Extract footer
    const footer = document.querySelector('footer');
    const footerData = {};
    if (footer) {
      // Footer sections
      footer.querySelectorAll('nav').forEach((nav, idx) => {
        const title = nav.querySelector('h3')?.textContent?.trim();
        const links = Array.from(nav.querySelectorAll('a')).map(a => cleanText(a.textContent));
        if (title) {
          footerData[title] = links;
        }
      });

      // Copyright
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

async function generateReviewDocument(pageInfo, desktopScreenshot, mobileScreenshot, textContent) {
  const { name, title, path } = pageInfo;

  let markdown = `# Página: ${title}\n`;
  markdown += `**URL:** https://vaemptiness.es${path}\n\n`;
  markdown += `---\n\n`;

  // DESKTOP VERSION - Page 1: Screenshot
  markdown += `## VERSIÓN DESKTOP - PÁGINA 1: CAPTURA DE PANTALLA\n\n`;
  markdown += `![Captura de pantalla Desktop de ${title}](./screenshots/${name}-desktop.png)\n\n`;
  markdown += `---\n---\n\n`;

  // DESKTOP VERSION - Page 2: Text content
  markdown += `## VERSIÓN DESKTOP - PÁGINA 2: CONTENIDO DE TEXTO PARA REVISIÓN\n\n`;
  markdown += `A continuación se muestra todo el texto visible en la página. Por favor, revisa cada sección y escribe tus comentarios o modificaciones en el espacio proporcionado después de cada elemento.\n\n`;
  markdown += `---\n\n`;

  // Navigation
  if (textContent.navigation && textContent.navigation.length > 0) {
    markdown += `### NAVEGACIÓN (Header)\n\n`;
    markdown += `**Enlaces de menú:**\n`;
    textContent.navigation.forEach(link => {
      markdown += `- ${link}\n`;
    });
    markdown += `\n**Modificaciones sugeridas:**\n\`\`\`\n\n\n\n\`\`\`\n\n---\n\n`;
  }

  // Sections
  textContent.sections.forEach((section, idx) => {
    const sectionName = section.className.split(' ')[0] || `Sección ${idx + 1}`;
    markdown += `### SECCIÓN: ${sectionName.toUpperCase()}\n\n`;

    // Headings
    if (section.headings.length > 0) {
      section.headings.forEach(h => {
        markdown += `**${h.level.toUpperCase()}:**\n- ${h.text}\n\n`;
      });
    }

    // Paragraphs
    if (section.paragraphs.length > 0) {
      markdown += `**Texto:**\n`;
      section.paragraphs.forEach(p => {
        markdown += `- ${p}\n`;
      });
      markdown += `\n`;
    }

    // Quotes
    if (section.quotes.length > 0) {
      markdown += `**Citas destacadas:**\n`;
      section.quotes.forEach(q => {
        markdown += `- "${q}"\n`;
      });
      markdown += `\n`;
    }

    // Lists
    if (section.lists.length > 0) {
      markdown += `**Listas:**\n`;
      section.lists.forEach((list, listIdx) => {
        markdown += `\nLista ${listIdx + 1}:\n`;
        list.forEach(item => {
          markdown += `- ${item}\n`;
        });
      });
      markdown += `\n`;
    }

    // Buttons
    if (section.buttons.length > 0) {
      markdown += `**Botones/Enlaces:**\n`;
      section.buttons.forEach(btn => {
        markdown += `- ${btn}\n`;
      });
      markdown += `\n`;
    }

    markdown += `**Modificaciones sugeridas:**\n\`\`\`\n\n\n\n\`\`\`\n\n---\n\n`;
  });

  // Footer
  if (textContent.footer && Object.keys(textContent.footer).length > 0) {
    markdown += `### FOOTER (Pie de página)\n\n`;

    Object.entries(textContent.footer).forEach(([key, value]) => {
      if (key === 'copyright') {
        markdown += `**Copyright:**\n- ${value}\n\n`;
      } else if (Array.isArray(value)) {
        markdown += `**${key}:**\n`;
        value.forEach(item => {
          markdown += `- ${item}\n`;
        });
        markdown += `\n`;
      }
    });

    markdown += `**Modificaciones sugeridas:**\n\`\`\`\n\n\n\n\`\`\`\n\n---\n\n`;
  }

  // General notes for desktop
  markdown += `## NOTAS GENERALES - VERSIÓN DESKTOP\n\n`;
  markdown += `**Comentarios adicionales, problemas detectados, o cambios estructurales necesarios:**\n`;
  markdown += `\`\`\`\n\n\n\n\`\`\`\n\n`;
  markdown += `---\n---\n---\n\n`;

  // ========== MOBILE VERSION ==========

  // MOBILE VERSION - Page 1: Screenshot
  markdown += `## VERSIÓN MOBILE - PÁGINA 1: CAPTURA DE PANTALLA\n\n`;
  markdown += `![Captura de pantalla Mobile de ${title}](./screenshots/${name}-mobile.png)\n\n`;
  markdown += `---\n---\n\n`;

  // MOBILE VERSION - Page 2: Review
  markdown += `## VERSIÓN MOBILE - PÁGINA 2: REVISIÓN\n\n`;
  markdown += `El contenido de texto es el mismo que en la versión desktop. Por favor, revisa los siguientes aspectos específicos de la versión móvil:\n\n`;
  markdown += `### ASPECTOS A REVISAR EN MOBILE:\n\n`;
  markdown += `**1. Navegación móvil (menú hamburguesa):**\n`;
  markdown += `- ¿Funciona correctamente?\n`;
  markdown += `- ¿Es fácil de usar?\n\n`;
  markdown += `**Comentarios:**\n\`\`\`\n\n\n\`\`\`\n\n`;

  markdown += `**2. Legibilidad del texto:**\n`;
  markdown += `- ¿El tamaño de fuente es adecuado?\n`;
  markdown += `- ¿Los espacios entre elementos son correctos?\n\n`;
  markdown += `**Comentarios:**\n\`\`\`\n\n\n\`\`\`\n\n`;

  markdown += `**3. Imágenes y elementos visuales:**\n`;
  markdown += `- ¿Las imágenes se adaptan bien al tamaño de pantalla?\n`;
  markdown += `- ¿Los elementos visuales están bien proporcionados?\n\n`;
  markdown += `**Comentarios:**\n\`\`\`\n\n\n\`\`\`\n\n`;

  markdown += `**4. Botones y enlaces:**\n`;
  markdown += `- ¿Los botones son fáciles de pulsar?\n`;
  markdown += `- ¿El tamaño es apropiado para dedos?\n\n`;
  markdown += `**Comentarios:**\n\`\`\`\n\n\n\`\`\`\n\n`;

  markdown += `**5. Diseño general responsive:**\n`;
  markdown += `- ¿El diseño se adapta bien a pantalla pequeña?\n`;
  markdown += `- ¿Hay elementos que se solapen o se vean mal?\n\n`;
  markdown += `**Comentarios:**\n\`\`\`\n\n\n\`\`\`\n\n`;

  markdown += `---\n\n`;

  // General notes for mobile
  markdown += `## NOTAS GENERALES - VERSIÓN MOBILE\n\n`;
  markdown += `**Comentarios adicionales, problemas detectados, o cambios estructurales necesarios:**\n`;
  markdown += `\`\`\`\n\n\n\n\`\`\`\n\n---\n\n`;
  markdown += `**Revisado por:** ___________________________\n`;
  markdown += `**Fecha:** ___________________________\n`;

  return markdown;
}

async function main() {
  console.log('🚀 Iniciando generación de documentos de revisión (Desktop + Mobile)...\n');

  // Wait for server to be ready
  console.log('⏳ Esperando que el servidor esté listo...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  const browser = await chromium.launch();

  // Create screenshots directory
  const screenshotsDir = join(outputDir, 'screenshots');
  mkdirSync(screenshotsDir, { recursive: true });

  for (const pageInfo of pages) {
    console.log(`\n📄 Procesando: ${pageInfo.title} (${pageInfo.path})`);

    const url = `${baseUrl}${pageInfo.path}`;

    try {
      // DESKTOP VERSION
      console.log(`   🖥️  DESKTOP: Capturando versión desktop...`);
      const desktopContext = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
      });
      const desktopPage = await desktopContext.newPage();

      await desktopPage.goto(url, { waitUntil: 'networkidle' });

      const desktopScreenshot = join(screenshotsDir, `${pageInfo.name}-desktop.png`);
      await desktopPage.screenshot({
        path: desktopScreenshot,
        fullPage: true
      });

      // Extract text content from desktop version
      const textContent = await extractTextContent(desktopPage);
      await desktopContext.close();

      // MOBILE VERSION
      console.log(`   📱 MOBILE: Capturando versión mobile...`);
      const mobileContext = await browser.newContext({
        viewport: { width: 375, height: 667 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
      });
      const mobilePage = await mobileContext.newPage();

      await mobilePage.goto(url, { waitUntil: 'networkidle' });

      const mobileScreenshot = join(screenshotsDir, `${pageInfo.name}-mobile.png`);
      await mobilePage.screenshot({
        path: mobileScreenshot,
        fullPage: true
      });
      await mobileContext.close();

      // Generate review document with both versions
      console.log(`   ➜ Generando documento de revisión...`);
      const markdown = await generateReviewDocument(
        pageInfo,
        desktopScreenshot,
        mobileScreenshot,
        textContent
      );

      // Save markdown file
      const markdownPath = join(outputDir, `${pageInfo.name}.md`);
      writeFileSync(markdownPath, markdown, 'utf-8');

      console.log(`   ✅ Completado: ${markdownPath}`);

    } catch (error) {
      console.error(`   ❌ Error procesando ${pageInfo.title}:`, error.message);
    }
  }

  await browser.close();

  console.log('\n✅ Todos los documentos de revisión han sido generados en:', outputDir);
  console.log('\n📋 Archivos generados:');
  pages.forEach(p => {
    console.log(`   - ${p.name}.md`);
    console.log(`     ├─ Desktop: screenshots/${p.name}-desktop.png`);
    console.log(`     └─ Mobile:  screenshots/${p.name}-mobile.png`);
  });

  console.log('\n💡 Próximos pasos:');
  console.log('   1. Revisa los archivos .md en la carpeta page-reviews/');
  console.log('   2. Cada documento incluye versión Desktop y Mobile');
  console.log('   3. Puedes copiar el contenido a Google Docs para compartir con el cliente');
}

main().catch(console.error);
