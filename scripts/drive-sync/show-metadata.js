const syncMetadata = require('./sync-metadata');

async function main() {
  await syncMetadata.load();
  const files = syncMetadata.getAllFiles();
  
  console.log('\n=== METADATA FILE IDS ===\n');
  for (const [path, data] of Object.entries(files)) {
    console.log(`${path}`);
    console.log(`  Drive ID: ${data.driveId}`);
    console.log(`  Last Synced: ${data.lastSyncedTime}`);
    console.log(`  Direction: ${data.syncDirection}`);
    console.log('');
  }
}

main().catch(console.error);
