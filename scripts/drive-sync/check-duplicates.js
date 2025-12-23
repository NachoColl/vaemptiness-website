const driveClient = require('./drive-client-oauth');
const config = require('./config');

async function checkDuplicates() {
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
          id: item.id
        });
      }
    }

    return files;
  }

  const allFiles = await listAllFiles(folderId);

  // Group by name
  const grouped = {};
  for (const file of allFiles) {
    if (!grouped[file.path]) {
      grouped[file.path] = [];
    }
    grouped[file.path].push(file);
  }

  // Find duplicates
  console.log('\n=== FILES IN DRIVE ===');
  let duplicateCount = 0;

  for (const [path, files] of Object.entries(grouped)) {
    if (files.length > 1) {
      console.log(`\n⚠️  DUPLICATE: ${path} (${files.length} copies)`);
      files.forEach((f, i) => {
        console.log(`   ${i + 1}. ID: ${f.id}`);
      });
      duplicateCount++;
    } else {
      console.log(`✓ ${path}`);
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Total files: ${allFiles.length}`);
  console.log(`Unique paths: ${Object.keys(grouped).length}`);
  console.log(`Duplicates: ${duplicateCount}`);
}

checkDuplicates()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
