const driveClient = require('./drive-client-oauth');
const fs = require('fs').promises;

async function main() {
  const fileId = '19-kcGaB2GQ4wpBa9F8EsZXdBxxLjN3HE';
  const localPath = 'src/data/pages/home.json';
  
  await driveClient.initialize();
  
  const driveContent = await driveClient.downloadFile(fileId);
  const localContent = await fs.readFile(localPath, 'utf-8');
  
  // Write to temp files for diff
  await fs.writeFile('/tmp/drive-home.json', driveContent);
  await fs.writeFile('/tmp/local-home.json', localContent);
  
  console.log('Files written to /tmp/ for comparison');
}

main().catch(console.error);
