import { PDFDocument, PDFTextField, StandardFonts, rgb } from 'pdf-lib';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const pdfDir = join(rootDir, 'page-reviews', 'pdf');
const editablePdfDir = join(rootDir, 'page-reviews', 'pdf-editable');

// Ensure output directory exists
import { mkdirSync } from 'fs';
mkdirSync(editablePdfDir, { recursive: true });

async function addFormFieldsToPDF(inputPath, outputPath, pageName) {
  console.log(`\n📄 Procesando: ${pageName}`);

  try {
    // Load the existing PDF
    const pdfBytes = readFileSync(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Get the form
    const form = pdfDoc.getForm();
    const pages = pdfDoc.getPages();

    // Font for form fields
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let fieldCounter = 0;

    // We'll search for gray boxes in the PDF and add text fields
    // Since we can't easily detect boxes, we'll add fields at predefined positions
    // based on the structure we know from the HTML template

    // Strategy: Add form fields at approximate locations where comment boxes appear
    // For each page, add multiple text fields for different sections

    pages.forEach((page, pageIndex) => {
      const { width, height } = page.getSize();

      // Add fields based on typical layout
      // Desktop content pages (odd pages after first screenshot)
      // Mobile content pages (even pages after mobile screenshot)

      // We'll add 3-5 text fields per content page
      const fieldsPerPage = 4;
      const fieldHeight = 60;
      const fieldWidth = width - 100;
      const startY = height - 200;
      const spacing = 150;

      for (let i = 0; i < fieldsPerPage; i++) {
        const yPosition = startY - (i * spacing);

        if (yPosition > 100) { // Make sure we don't go off the page
          const fieldName = `${pageName}_page${pageIndex + 1}_field${fieldCounter++}`;

          const textField = form.createTextField(fieldName);
          textField.setText('');
          textField.setFontSize(10);
          textField.enableMultiline();
          textField.addToPage(page, {
            x: 50,
            y: yPosition,
            width: fieldWidth,
            height: fieldHeight,
            borderColor: rgb(0.72, 0.36, 0.31), // #b85c4f in RGB
            borderWidth: 1,
            backgroundColor: rgb(0.98, 0.98, 0.98),
          });
        }
      }
    });

    console.log(`   ✅ Agregados ${fieldCounter} campos editables`);

    // Save the modified PDF
    const modifiedPdfBytes = await pdfDoc.save();
    writeFileSync(outputPath, modifiedPdfBytes);

    console.log(`   💾 Guardado en: ${outputPath}`);

  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 Agregando campos de formulario editables a los PDFs...\n');

  // Get all PDF files
  const pdfFiles = readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));

  for (const pdfFile of pdfFiles) {
    const inputPath = join(pdfDir, pdfFile);
    const outputPath = join(editablePdfDir, pdfFile);
    const pageName = pdfFile.replace('.pdf', '');

    await addFormFieldsToPDF(inputPath, outputPath, pageName);
  }

  console.log('\n✅ Proceso completado!');
  console.log(`\n📁 PDFs editables guardados en: ${editablePdfDir}`);
  console.log('\n💡 Los usuarios ahora pueden hacer clic en los campos y escribir sus comentarios.');
  console.log('   Los PDFs son completamente editables y pueden enviarse por email.');
}

main().catch(console.error);
