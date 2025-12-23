const driveClient = require('./drive-client-oauth');
const config = require('./config');

async function cleanupDuplicates() {
  const folderId = config.drive.folderId;

  async function listAllFiles(folderId, path = '') {
    const items = await driveClient.listFiles(folderId);
    const files = [];

    for (const item of items) {
      const itemPath = path ? `${path}/${item.name}` : item.name;

      if (item.mimeType === 'application/vnd.google-apps.folder') {
        const subFiles = await listAllFiles(item.id, itemPath);
        files.push(...subFiles);
      } else {
        files.push({
          name: item.name,
          path: itemPath,
          id: item.id,
          modifiedTime: item.modifiedTime
        });
      }
    }

    return files;
  }

  const allFiles = await listAllFiles(folderId);

  // Group by path
  const grouped = {};
  for (const file of allFiles) {
    if (!grouped[file.path]) {
      grouped[file.path] = [];
    }
    grouped[file.path].push(file);
  }

  console.log('\n=== CLEANING UP DUPLICATES ===\n');

  let deletedCount = 0;

  for (const [path, files] of Object.entries(grouped)) {
    if (files.length > 1) {
      // Sort by modified time, newest first
      files.sort((a, b) => new Date(b.modifiedTime) - new Date(a.modifiedTime));

      console.log(`\n📁 ${path} - ${files.length} copies`);
      console.log(`   ✓ Keeping: ${files[0].id} (${files[0].modifiedTime})`);

      // Delete all but the first (newest)
      for (let i = 1; i < files.length; i++) {
        console.log(`   🗑️  Deleting: ${files[i].id} (${files[i].modifiedTime})`);
        await driveClient.deleteFile(files[i].id);
        deletedCount++;
      }
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Files deleted: ${deletedCount}`);
  console.log(`Files remaining: ${Object.keys(grouped).length}`);
}

cleanupDuplicates()
  .then(() => {
    console.log('\n✅ Cleanup complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
