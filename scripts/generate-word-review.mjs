import { chromium } from '@playwright/test';
import {Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak, ImageRun, Table, TableCell, TableRow, WidthType, BorderStyle } from 'docx';
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

async function scrollAndCaptureScreenshot(page, outputPath) {
  // Scroll through the entire page to load all lazy-loaded content
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if(totalHeight >= scrollHeight){
          clearInterval(timer);
          // Scroll back to top
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
  });

  // Wait a bit for any animations or content to settle
  await page.waitForTimeout(2000);

  // Take full page screenshot at high quality (2x device scale)
  await page.screenshot({
    path: outputPath,
    fullPage: true,
    type: 'png',
  });
}

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

function createCommentBox(label) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'B85C4F' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'B85C4F' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'B85C4F' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'B85C4F' },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: label,
                    bold: true,
                    color: 'B85C4F',
                  }),
                ],
              }),
              new Paragraph({ text: '' }),
              new Paragraph({ text: '' }),
              new Paragraph({ text: '' }),
            ],
          }),
        ],
      }),
    ],
  });
}

async function generateWordDocument(allPagesData, screenshotsDir) {
  const doc = new Document({
    sections: [],
  });

  // Cover Page
  const coverChildren = [
    new Paragraph({
      text: 'vaemptîness',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { before: 4000, after: 400 },
    }),
    new Paragraph({
      text: 'Documento de Revisión Web',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
    }),
    new Paragraph({
      text: `Este documento contiene la revisión completa de todas las páginas del sitio web vaemptiness.es`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: `Total de páginas: ${pages.length}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: `Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      pageBreakBefore: true,
      text: '',
    }),
    // Table of Contents
    new Paragraph({
      text: 'Índice de Contenidos',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 400 },
    }),
  ];

  pages.forEach((page, idx) => {
    coverChildren.push(
      new Paragraph({
        text: `${idx + 1}. ${page.title}`,
        spacing: { after: 200 },
      })
    );
  });

  coverChildren.push(new Paragraph({ pageBreakBefore: true, text: '' }));

  // Process each page
  for (let i = 0; i < allPagesData.length; i++) {
    const { pageInfo, textContent, desktopScreenshot, mobileScreenshot } = allPagesData[i];

    const pageChildren = [
      // Page header
      new Paragraph({
        text: `Página ${i + 1} de ${pages.length}`,
        alignment: AlignmentType.RIGHT,
        spacing: { after: 200 },
      }),
      new Paragraph({
        text: pageInfo.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
      }),
      new Paragraph({
        text: `URL: https://vaemptiness.es${pageInfo.path}`,
        spacing: { after: 400 },
      }),

      // Desktop version
      new Paragraph({
        text: 'VERSIÓN DESKTOP',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      }),
      new Paragraph({
        text: 'CAPTURA DE PANTALLA - DESKTOP',
        heading: HeadingLevel.HEADING_3,
        spacing: { after: 200 },
      }),
    ];

    // Add desktop screenshot (full width for better quality)
    try {
      const desktopImage = readFileSync(desktopScreenshot);
      pageChildren.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: desktopImage,
              transformation: {
                width: 650, // Wider for better quality
                height: 400,
              },
            }),
          ],
          spacing: { after: 400 },
        })
      );
    } catch (error) {
      console.error(`Error loading desktop image: ${error.message}`);
    }

    pageChildren.push(
      new Paragraph({
        text: 'CONTENIDO DE TEXTO PARA REVISIÓN - DESKTOP',
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 400, after: 200 },
      }),
      new Paragraph({
        text: 'A continuación se muestra todo el texto visible en la página. Por favor, revisa cada sección y escribe tus comentarios en los espacios proporcionados.',
        spacing: { after: 400 },
      })
    );

    // Navigation
    if (textContent.navigation && textContent.navigation.length > 0) {
      pageChildren.push(
        new Paragraph({
          text: 'NAVEGACIÓN (Header)',
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [new TextRun({ text: 'Enlaces de menú:', bold: true })],
          spacing: { after: 100 },
        })
      );

      textContent.navigation.forEach(link => {
        pageChildren.push(
          new Paragraph({
            text: `• ${link}`,
            bullet: { level: 0 },
          })
        );
      });

      pageChildren.push(
        new Paragraph({ text: '', spacing: { after: 200 } }),
        createCommentBox('Modificaciones sugeridas:'),
        new Paragraph({ text: '', spacing: { after: 200 } })
      );
    }

    // Sections
    textContent.sections.forEach((section, idx) => {
      const sectionName = section.className.split(' ')[0] || `Sección ${idx + 1}`;

      pageChildren.push(
        new Paragraph({
          text: `SECCIÓN: ${sectionName.toUpperCase()}`,
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 200, after: 100 },
        })
      );

      if (section.headings.length > 0) {
        pageChildren.push(
          new Paragraph({
            children: [new TextRun({ text: 'Títulos:', bold: true })],
          })
        );
        section.headings.forEach(h => {
          pageChildren.push(new Paragraph({ text: `• ${h.text}`, bullet: { level: 0 } }));
        });
      }

      if (section.paragraphs.length > 0) {
        pageChildren.push(
          new Paragraph({
            children: [new TextRun({ text: 'Texto:', bold: true })],
            spacing: { before: 100 },
          })
        );
        section.paragraphs.forEach(p => {
          pageChildren.push(new Paragraph({ text: `• ${p}`, bullet: { level: 0 } }));
        });
      }

      if (section.quotes.length > 0) {
        pageChildren.push(
          new Paragraph({
            children: [new TextRun({ text: 'Citas destacadas:', bold: true })],
            spacing: { before: 100 },
          })
        );
        section.quotes.forEach(q => {
          pageChildren.push(new Paragraph({ text: `• "${q}"`, bullet: { level: 0 } }));
        });
      }

      if (section.lists.length > 0) {
        pageChildren.push(
          new Paragraph({
            children: [new TextRun({ text: 'Listas:', bold: true })],
            spacing: { before: 100 },
          })
        );
        section.lists.forEach((list, listIdx) => {
          pageChildren.push(
            new Paragraph({ text: `Lista ${listIdx + 1}:`, bullet: { level: 0 } })
          );
          list.forEach(item => {
            pageChildren.push(new Paragraph({ text: `• ${item}`, bullet: { level: 1 } }));
          });
        });
      }

      if (section.buttons.length > 0) {
        pageChildren.push(
          new Paragraph({
            children: [new TextRun({ text: 'Botones/Enlaces:', bold: true })],
            spacing: { before: 100 },
          })
        );
        section.buttons.forEach(btn => {
          pageChildren.push(new Paragraph({ text: `• ${btn}`, bullet: { level: 0 } }));
        });
      }

      pageChildren.push(
        new Paragraph({ text: '', spacing: { after: 200 } }),
        createCommentBox('Modificaciones sugeridas:'),
        new Paragraph({ text: '', spacing: { after: 200 } })
      );
    });

    // Footer content
    if (textContent.footer && Object.keys(textContent.footer).length > 0) {
      pageChildren.push(
        new Paragraph({
          text: 'FOOTER (Pie de página)',
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 200, after: 100 },
        })
      );

      Object.entries(textContent.footer).forEach(([key, value]) => {
        if (key === 'copyright') {
          pageChildren.push(
            new Paragraph({
              children: [new TextRun({ text: `Copyright: ${value}`, bold: true })],
            })
          );
        } else if (Array.isArray(value)) {
          pageChildren.push(
            new Paragraph({
              children: [new TextRun({ text: `${key}:`, bold: true })],
            })
          );
          value.forEach(item => {
            pageChildren.push(new Paragraph({ text: `• ${item}`, bullet: { level: 0 } }));
          });
        }
      });

      pageChildren.push(
        new Paragraph({ text: '', spacing: { after: 200 } }),
        createCommentBox('Modificaciones sugeridas:'),
        new Paragraph({ text: '', spacing: { after: 200 } })
      );
    }

    // Desktop general notes
    pageChildren.push(
      new Paragraph({
        text: 'NOTAS GENERALES - VERSIÓN DESKTOP',
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 400, after: 200 },
      }),
      createCommentBox('Comentarios adicionales, problemas detectados, o cambios estructurales necesarios:'),
      new Paragraph({ text: '', spacing: { after: 400 } })
    );

    // Mobile version
    pageChildren.push(
      new Paragraph({
        text: 'VERSIÓN MOBILE',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      }),
      new Paragraph({
        text: 'CAPTURA DE PANTALLA - MOBILE',
        heading: HeadingLevel.HEADING_3,
        spacing: { after: 200 },
      })
    );

    // Add mobile screenshot (better quality)
    try {
      const mobileImage = readFileSync(mobileScreenshot);
      pageChildren.push(
        new Paragraph({
          children: [
            new ImageRun({
              data: mobileImage,
              transformation: {
                width: 280, // Proportional to actual mobile viewport
                height: 497, // 375:667 ratio preserved
              },
            }),
          ],
          spacing: { after: 400 },
        })
      );
    } catch (error) {
      console.error(`Error loading mobile image: ${error.message}`);
    }

    // Mobile review checklist
    pageChildren.push(
      new Paragraph({
        text: 'REVISIÓN - MOBILE',
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 400, after: 200 },
      }),
      new Paragraph({
        text: 'El contenido de texto es el mismo que en la versión desktop. Por favor, revisa los siguientes aspectos específicos de la versión móvil:',
        spacing: { after: 200 },
      }),
      new Paragraph({
        text: 'ASPECTOS A REVISAR EN MOBILE:',
        heading: HeadingLevel.HEADING_4,
        spacing: { before: 200, after: 100 },
      })
    );

    const mobileAspects = [
      {
        title: '1. Navegación móvil (menú hamburguesa):',
        points: ['¿Funciona correctamente?', '¿Es fácil de usar?'],
      },
      {
        title: '2. Legibilidad del texto:',
        points: ['¿El tamaño de fuente es adecuado?', '¿Los espacios entre elementos son correctos?'],
      },
      {
        title: '3. Imágenes y elementos visuales:',
        points: ['¿Las imágenes se adaptan bien al tamaño de pantalla?', '¿Los elementos visuales están bien proporcionados?'],
      },
      {
        title: '4. Botones y enlaces:',
        points: ['¿Los botones son fáciles de pulsar?', '¿El tamaño es apropiado para dedos?'],
      },
      {
        title: '5. Diseño general responsive:',
        points: ['¿El diseño se adapta bien a pantalla pequeña?', '¿Hay elementos que se solapen o se vean mal?'],
      },
    ];

    mobileAspects.forEach(aspect => {
      pageChildren.push(
        new Paragraph({
          children: [new TextRun({ text: aspect.title, bold: true })],
          spacing: { before: 100 },
        })
      );
      aspect.points.forEach(point => {
        pageChildren.push(new Paragraph({ text: `• ${point}`, bullet: { level: 0 } }));
      });
      pageChildren.push(
        new Paragraph({ text: '', spacing: { after: 100 } }),
        createCommentBox('Comentarios:'),
        new Paragraph({ text: '', spacing: { after: 200 } })
      );
    });

    // Mobile general notes
    pageChildren.push(
      new Paragraph({
        text: 'NOTAS GENERALES - VERSIÓN MOBILE',
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 400, after: 200 },
      }),
      createCommentBox('Comentarios adicionales, problemas detectados, o cambios estructurales necesarios:')
    );

    // Page break before next page
    if (i < allPagesData.length - 1) {
      pageChildren.push(new Paragraph({ pageBreakBefore: true, text: '' }));
    }

    coverChildren.push(...pageChildren);
  }

  // Final signature section
  coverChildren.push(
    new Paragraph({ pageBreakBefore: true, text: '' }),
    new Paragraph({
      text: 'FIRMA Y APROBACIÓN',
      heading: HeadingLevel.HEADING_2,
      spacing: { after: 400 },
    }),
    createCommentBox('Revisado por: ___________________________ \n\nFecha: ___________________________ \n\nFirma:')
  );

  doc.addSection({
    children: coverChildren,
  });

  return doc;
}

async function main() {
  console.log('🚀 Generando documento Word con todas las páginas...\n');

  const outputDir = join(rootDir, 'page-reviews');
  const screenshotsDir = join(outputDir, 'screenshots');
  mkdirSync(screenshotsDir, { recursive: true });

  console.log('⏳ Esperando que el servidor esté listo...');
  await new Promise(resolve => setTimeout(resolve, 2000));

  const browser = await chromium.launch();
  const allPagesData = [];

  // Capture screenshots with proper scrolling
  for (let i = 0; i < pages.length; i++) {
    const pageInfo = pages[i];
    console.log(`\n📄 Procesando ${i + 1}/${pages.length}: ${pageInfo.title}`);

    const url = `${baseUrl}${pageInfo.path}`;

    try {
      // Desktop version - capture at 2x resolution for better quality
      console.log(`   🖥️  DESKTOP: Capturando con scroll...`);
      const desktopContext = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 2, // 2x resolution for crisper images
      });
      const desktopPage = await desktopContext.newPage();
      await desktopPage.goto(url, { waitUntil: 'networkidle' });

      const desktopScreenshot = join(screenshotsDir, `${pageInfo.name}-desktop.png`);
      await scrollAndCaptureScreenshot(desktopPage, desktopScreenshot);

      // Extract text content
      const textContent = await extractTextContent(desktopPage);
      await desktopContext.close();

      // Mobile version - capture at 2x resolution for better quality
      console.log(`   📱 MOBILE: Capturando con scroll...`);
      const mobileContext = await browser.newContext({
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2, // 2x resolution for crisper images
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
      });
      const mobilePage = await mobileContext.newPage();
      await mobilePage.goto(url, { waitUntil: 'networkidle' });

      const mobileScreenshot = join(screenshotsDir, `${pageInfo.name}-mobile.png`);
      await scrollAndCaptureScreenshot(mobilePage, mobileScreenshot);
      await mobileContext.close();

      allPagesData.push({
        pageInfo,
        textContent,
        desktopScreenshot,
        mobileScreenshot,
      });

      console.log(`   ✅ Contenido capturado`);

    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
    }
  }

  await browser.close();

  // Generate Word document
  console.log(`\n📝 Generando documento Word...`);
  const doc = await generateWordDocument(allPagesData, screenshotsDir);

  // Save document
  const docPath = join(outputDir, 'revision-completa-vaemptiness.docx');
  const buffer = await Packer.toBuffer(doc);
  writeFileSync(docPath, buffer);

  console.log(`\n✅ Documento Word generado exitosamente!`);
  console.log(`\n📁 Ubicación: ${docPath}`);
  console.log(`\n📊 Contenido:`);
  console.log(`   - Portada`);
  console.log(`   - Índice de contenidos`);
  console.log(`   - ${pages.length} páginas completas (Desktop + Mobile)`);
  console.log(`   - Screenshots con todo el contenido cargado (scroll completo)`);
  console.log(`   - Espacios editables para comentarios`);
  console.log(`\n💡 El documento puede:`);
  console.log(`   - Abrirse en Microsoft Word`);
  console.log(`   - Abrirse en Google Docs`);
  console.log(`   - Editarse y compartirse fácilmente`);
}

main().catch(console.error);
