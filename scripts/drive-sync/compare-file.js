const driveClient = require('./drive-client-oauth');
const fs = require('fs').promises;

async function main() {
  const fileId = '1JlczK2GaYr8nQWFh9Hb84sgesunWvcTs'; // on-off.json
  const localPath = 'src/data/pages/on-off.json';
  
  await driveClient.initialize();
  
  console.log('\n=== DOWNLOADING FROM DRIVE ===\n');
  const driveContent = await driveClient.downloadFile(fileId);
  
  console.log('\n=== READING LOCAL FILE ===\n');
  const localContent = await fs.readFile(localPath, 'utf-8');
  
  if (driveContent === localContent) {
    console.log('✓ Files are identical');
  } else {
    console.log('⚠️  Files are DIFFERENT\n');
    console.log('=== DRIVE VERSION ===');
    console.log(driveContent);
    console.log('\n=== LOCAL VERSION ===');
    console.log(localContent);
  }
}

main().catch(console.error);
