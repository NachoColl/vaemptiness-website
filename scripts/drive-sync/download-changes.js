/**
 * Download modified files from Google Drive
 */

const fs = require('fs-extra');
const path = require('path');
const driveClient = require('./drive-client');
const config = require('./config');
const logger = require('./logger');

/**
 * Download files that changed in Drive
 */
async function downloadChanges(changeDetectionResult) {
  logger.info('Starting file downloads from Drive');

  const tempDir = config.paths.temp;
  await fs.ensureDir(tempDir);

  const downloaded = [];
  const errors = [];

  for (const [filePath, change] of Object.entries(changeDetectionResult.changes)) {
    if (change.status === 'GITHUB_ONLY') {
      logger.debug('Skipping GitHub-only file', { filePath });
      continue;
    }

    if (!change.driveId) {
      logger.warn('No Drive ID for file', { filePath });
      continue;
    }

    try {
      logger.info('Downloading file', { filePath, driveId: change.driveId });

      const content = await driveClient.downloadFile(change.driveId);

      if (!content) {
        logger.warn('File not found or empty', { filePath });
        continue;
      }

      // Save to temp directory
      const localPath = path.join(tempDir, filePath);
      await fs.ensureDir(path.dirname(localPath));
      await fs.writeFile(localPath, content, 'utf-8');

      // Save metadata
      const metaPath = `${localPath}.meta`;
      await fs.writeJson(metaPath, {
        driveId: change.driveId,
        driveModified: change.driveModified,
        downloadedAt: new Date().toISOString(),
        status: change.status,
        resolution: change.resolution
      }, { spaces: 2 });

      downloaded.push({
        path: filePath,
        localPath,
        driveId: change.driveId
      });

      logger.debug('Downloaded file', { filePath, size: content.length });
    } catch (error) {
      logger.error('Failed to download file', { filePath, error: error.message });
      errors.push({ path: filePath, error: error.message });
    }
  }

  const result = {
    downloaded,
    errors,
    downloadDir: tempDir
  };

  logger.info('Download complete', {
    downloaded: downloaded.length,
    errors: errors.length
  });

  // Output for GitHub Actions
  console.log('::set-output name=downloaded::' + JSON.stringify(downloaded));

  return result;
}

// Run if called directly
if (require.main === module) {
  // Read change detection result from stdin or file
  const changesFile = process.argv[2] || '.drive-sync-temp/changes.json';

  fs.readJson(changesFile)
    .then(downloadChanges)
    .then(() => process.exit(0))
    .catch(error => {
      logger.error('Fatal error', { error: error.message });
      process.exit(1);
    });
}

module.exports = { downloadChanges };
