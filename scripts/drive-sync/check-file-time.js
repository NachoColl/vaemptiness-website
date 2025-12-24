const driveClient = require('./drive-client-oauth');
const syncMetadata = require('./sync-metadata');

async function main() {
  await driveClient.initialize();
  await syncMetadata.load();
  
  const fileId = '19-kcGaB2GQ4wpBa9F8EsZXdBxxLjN3HE'; // home.json
  
  // Get file metadata from Drive
  const file = await driveClient.drive.files.get({
    fileId,
    fields: 'id, name, modifiedTime'
  });
  
  console.log('\n=== DRIVE FILE INFO ===');
  console.log('File:', file.data.name);
  console.log('Modified:', file.data.modifiedTime);
  
  const metadata = syncMetadata.getFile('home.json');
  console.log('\n=== METADATA INFO ===');
  console.log('Last Synced:', metadata.lastSyncedTime);
  console.log('Drive Modified (tracked):', metadata.driveModifiedTime);
  
  const driveModified = new Date(file.data.modifiedTime);
  const lastSynced = new Date(metadata.lastSyncedTime);
  
  console.log('\n=== COMPARISON ===');
  console.log('Drive modified:', driveModified.toISOString());
  console.log('Last synced:', lastSynced.toISOString());
  console.log('Needs sync:', driveModified > lastSynced ? 'YES' : 'NO');
}

main().catch(console.error);
