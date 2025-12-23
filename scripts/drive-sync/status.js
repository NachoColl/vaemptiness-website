/**
 * Show sync status and history
 */

const syncMetadata = require('./sync-metadata');
const logger = require('./logger');
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

async function showStatus() {
  await syncMetadata.load();

  const metadata = syncMetadata.metadata;

  console.log('\\n=== Google Drive Sync Status ===\\n');
  console.log(`Drive Folder: ${metadata.drive.folderUrl}`);
  console.log(`Last Sync: ${dayjs(metadata.lastSync).fromNow()} (${metadata.lastSync})\\n`);

  console.log(`Files Tracked: ${Object.keys(metadata.files).length}\\n`);

  if (metadata.syncHistory.length > 0) {
    console.log('Recent Sync History:\\n');

    metadata.syncHistory.slice(0, 10).forEach((entry, i) => {
      const time = dayjs(entry.timestamp).fromNow();
      const status = entry.status === 'success' ? '✅' : '❌';
      const direction = entry.direction === 'drive-to-github' ? 'Drive → GitHub' : 'GitHub → Drive';

      console.log(`${i + 1}. ${status} ${direction} - ${time}`);
      if (entry.filesChanged) {
        console.log(`   Files: ${Array.isArray(entry.filesChanged) ? entry.filesChanged.length : entry.filesChanged}`);
      }
      if (entry.conflicts) {
        console.log(`   Conflicts: ${entry.conflicts}`);
      }
      if (entry.error) {
        console.log(`   Error: ${entry.error}`);
      }
      console.log('');
    });
  }

  // Show some tracked files
  console.log('Sample Tracked Files:\\n');
  const files = Object.entries(metadata.files).slice(0, 5);
  files.forEach(([path, meta]) => {
    const lastSync = dayjs(meta.lastSyncedTime).fromNow();
    console.log(`- ${path}`);
    console.log(`  Last synced: ${lastSync} (${meta.syncDirection})`);
  });

  if (Object.keys(metadata.files).length > 5) {
    console.log(`\\n... and ${Object.keys(metadata.files).length - 5} more files\\n`);
  }
}

if (require.main === module) {
  showStatus()
    .then(() => process.exit(0))
    .catch(error => {
      logger.error('Failed to show status', { error: error.message });
      process.exit(1);
    });
}

module.exports = { showStatus };
