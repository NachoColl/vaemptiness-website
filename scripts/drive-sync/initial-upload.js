/**
 * Initial upload of all JSON files to Google Drive
 * Run this once to set up the Drive folder structure
 */

const fs = require('fs-extra');
const path = require('path');
const driveClient = require('./drive-client-oauth');
const syncMetadata = require('./sync-metadata');
const config = require('./config');
const logger = require('./logger');

async function uploadFile(folderId, filePath, relativePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const fileName = path.basename(filePath);

  // Check if file already exists in metadata
  const existingFile = syncMetadata.getFile(relativePath);
  const fileId = existingFile?.driveId || null;

  const result = await driveClient.uploadFile(folderId, fileName, content, fileId);

  if (fileId) {
    logger.info('Updated file', { fileName, relativePath, fileId });
  } else {
    logger.info('Uploaded file', { fileName, relativePath });
  }

  return {
    driveId: result.id,
    driveModifiedTime: result.modifiedTime,
    githubPath: `src/data/pages/${relativePath}`,
    lastSyncedTime: new Date().toISOString(),
    syncDirection: 'github-to-drive'
  };
}

async function uploadDirectory(localDir, driveFolderId, basePath = '') {
  const items = await fs.readdir(localDir, { withFileTypes: true });

  for (const item of items) {
    const localPath = path.join(localDir, item.name);
    const relativePath = basePath ? `${basePath}/${item.name}` : item.name;

    if (item.isDirectory()) {
      // Create subfolder in Drive
      const folder = await driveClient.getOrCreateFolder(driveFolderId, item.name);
      await uploadDirectory(localPath, folder.id, relativePath);
    } else if (item.name.endsWith('.json')) {
      // Upload JSON file
      const metadata = await uploadFile(driveFolderId, localPath, relativePath);
      syncMetadata.setFile(relativePath, metadata);
    }
  }
}

async function initialUpload() {
  logger.info('Starting initial upload to Google Drive');

  try {
    // Initialize
    await syncMetadata.load();

    // Get root folder
    const rootFolderId = config.drive.folderId;
    logger.info('Using Drive folder', { folderId: rootFolderId });

    // Upload src/data/pages
    const pagesDir = config.paths.pages;
    logger.info('Uploading pages directory', { pagesDir });
    await uploadDirectory(pagesDir, rootFolderId);

    // Save metadata
    await syncMetadata.save();

    logger.info('Initial upload complete');
    logger.info(`View files: https://drive.google.com/drive/folders/${rootFolderId}`);
  } catch (error) {
    logger.error('Initial upload failed', { error: error.message });
    throw error;
  }
}

if (require.main === module) {
  initialUpload()
    .then(() => process.exit(0))
    .catch(error => {
      logger.error('Fatal error', { error: error.message });
      process.exit(1);
    });
}

module.exports = { initialUpload };
