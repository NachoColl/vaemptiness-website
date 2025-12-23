/**
 * Upload GitHub changes back to Google Drive (bidirectional sync)
 */

const fs = require('fs-extra');
const path = require('path');
const driveClient = require('./drive-client-oauth');
const githubClient = require('./github-client');
const syncMetadata = require('./sync-metadata');
const config = require('./config');
const logger = require('./logger');

async function uploadToDrive() {
  logger.info('=== Starting GitHub → Drive sync ===');

  try {
    await syncMetadata.load();
    const trackedFiles = syncMetadata.getAllFiles();

    let uploaded = 0;

    for (const [relativePath, fileMeta] of Object.entries(trackedFiles)) {
      const localPath = path.join(config.paths.pages, relativePath);

      if (!await fs.pathExists(localPath)) {
        logger.warn('Local file not found, skipping', { path: relativePath });
        continue;
      }

      // Get GitHub commit info
      const commit = await githubClient.getFileCommit(`src/data/pages/${relativePath}`);

      if (!commit) {
        logger.warn('No commit found for file', { path: relativePath });
        continue;
      }

      // Check if file changed in GitHub since last sync
      const githubModified = new Date(commit.date);
      const lastSynced = fileMeta.lastSyncedTime ? new Date(fileMeta.lastSyncedTime) : null;

      if (lastSynced && githubModified <= lastSynced) {
        logger.debug('File unchanged in GitHub', { path: relativePath });
        continue;
      }

      // Upload to Drive
      const content = await fs.readFile(localPath, 'utf-8');
      const fileName = path.basename(relativePath);

      // Find Drive folder for this file
      const dirPath = path.dirname(relativePath);
      let folderId = config.drive.folderId;

      if (dirPath !== '.') {
        const folder = await driveClient.findFolder(folderId, dirPath);
        folderId = folder ? folder.id : await driveClient.createFolder(folderId, dirPath).then(f => f.id);
      }

      await driveClient.uploadFile(folderId, fileName, content, fileMeta.driveId);

      // Update metadata
      syncMetadata.setFile(relativePath, {
        ...fileMeta,
        githubSha: commit.sha,
        githubModifiedTime: commit.date,
        lastSyncedTime: new Date().toISOString(),
        syncDirection: 'github-to-drive'
      });

      uploaded++;
      logger.info('Uploaded to Drive', { path: relativePath });
    }

    if (uploaded > 0) {
      syncMetadata.addSyncHistory({
        direction: 'github-to-drive',
        filesChanged: uploaded,
        status: 'success'
      });

      await syncMetadata.save();
    }

    logger.info('=== Upload complete ===', { uploaded });
    return { success: true, uploaded };
  } catch (error) {
    logger.error('Upload failed', { error: error.message });
    throw error;
  }
}

if (require.main === module) {
  uploadToDrive()
    .then(() => process.exit(0))
    .catch(error => {
      logger.error('Fatal error', { error: error.message });
      process.exit(1);
    });
}

module.exports = { uploadToDrive };
