const driveClient = require('./drive-client-oauth');
const fs = require('fs').promises;

async function main() {
  const fileId = '1xAeH2DDfivpMZRLmOcdynbuFJFC1yJhA'; // vaemptiness-equipos.json
  
  await driveClient.initialize();
  
  const driveContent = await driveClient.downloadFile(fileId);
  const localContent = await fs.readFile('src/data/pages/programs/vaemptiness-equipos.json', 'utf-8');
  
  const driveJson = JSON.parse(driveContent);
  const localJson = JSON.parse(localContent);
  
  // Preserve local whatIs section
  const localWhatIs = localJson.whatIs;
  
  // Merge: take all from Drive, but preserve local whatIs
  const merged = {
    ...driveJson,
    whatIs: localWhatIs
  };
  
  await fs.writeFile('src/data/pages/programs/vaemptiness-equipos.json', JSON.stringify(merged, null, 2) + '\n');
  
  console.log('✓ Merged successfully');
  console.log('  - Drive properties updated');
  console.log('  - Local whatIs section preserved');
}

main().catch(console.error);
