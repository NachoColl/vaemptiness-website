const driveClient = require('./drive-client-oauth');
const fs = require('fs').promises;

async function main() {
  const fileId = '19-kcGaB2GQ4wpBa9F8EsZXdBxxLjN3HE'; // home.json from metadata
  const localPath = 'src/data/pages/home.json';
  
  await driveClient.initialize();
  
  const driveContent = await driveClient.downloadFile(fileId);
  const localContent = await fs.readFile(localPath, 'utf-8');
  
  if (driveContent === localContent) {
    console.log('✓ Files are identical');
  } else {
    console.log('⚠️  Files are DIFFERENT\n');
    
    // Parse and compare
    const driveJson = JSON.parse(driveContent);
    const localJson = JSON.parse(localContent);
    
    // Find differences
    console.log('=== CHECKING DIFFERENCES ===\n');
    
    // Compare specific sections
    if (JSON.stringify(driveJson.hero) !== JSON.stringify(localJson.hero)) {
      console.log('DIFF in hero section');
      console.log('Drive:', JSON.stringify(driveJson.hero, null, 2));
      console.log('\nLocal:', JSON.stringify(localJson.hero, null, 2));
    }
    
    if (JSON.stringify(driveJson.learningIntro) !== JSON.stringify(localJson.learningIntro)) {
      console.log('\nDIFF in learningIntro section');
      console.log('Drive:', JSON.stringify(driveJson.learningIntro, null, 2));
      console.log('\nLocal:', JSON.stringify(localJson.learningIntro, null, 2));
    }
    
    if (JSON.stringify(driveJson.programsSection) !== JSON.stringify(localJson.programsSection)) {
      console.log('\nDIFF in programsSection');
      console.log('Drive:', JSON.stringify(driveJson.programsSection, null, 2));
      console.log('\nLocal:', JSON.stringify(localJson.programsSection, null, 2));
    }
  }
}

main().catch(console.error);
