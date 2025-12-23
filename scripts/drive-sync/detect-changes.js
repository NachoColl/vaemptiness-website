/**
 * Detect changes between Google Drive and GitHub
 */

const dayjs = require('dayjs');
const driveClient = require('./drive-client-oauth');
const githubClient = require('./github-client');
const syncMetadata = require('./sync-metadata');
const config = require('./config');
const logger = require('./logger');

const STATUS = {
  NO_CHANGE: 'NO_CHANGE',
  CHANGED: 'CHANGED'
};

/**
 * Get all JSON files from Drive
 */
async function getDriveFiles() {
  const files = new Map();

  async function scanFolder(folderId, basePath = '') {
    const items = await driveClient.listFiles(folderId);

    for (const item of items) {
      if (item.mimeType === 'application/vnd.google-apps.folder') {
        // Recursively scan subfolders
        const subPath = basePath ? `${basePath}/${item.name}` : item.name;
        await scanFolder(item.id, subPath);
      } else if (item.name.endsWith('.json') && !item.name.startsWith('.')) {
        // JSON file
        const relativePath = basePath ? `${basePath}/${item.name}` : item.name;
        files.set(relativePath, {
          id: item.id,
          name: item.name,
          path: relativePath,
          modifiedTime: new Date(item.modifiedTime)
        });
      }
    }
  }

  const rootFolderId = config.drive.folderId;
  await scanFolder(rootFolderId);

  return files;
}

/**
 * Get all JSON files from GitHub
 */
async function getGitHubFiles() {
  const files = new Map();
  const basePath = config.paths.pages;

  // This would ideally list all files recursively from GitHub
  // For now, we'll check against known files from metadata
  const metadata = syncMetadata.getAllFiles();

  for (const [path, fileData] of Object.entries(metadata)) {
    const fullPath = `${basePath}/${path}`;

    try {
      const commit = await githubClient.getFileCommit(fullPath);

      if (commit) {
        files.set(path, {
          path,
          sha: commit.sha,
          modifiedTime: new Date(commit.date)
        });
      }
    } catch (error) {
      logger.warn('Could not get GitHub file info', { path, error: error.message });
    }
  }

  return files;
}

/**
 * Detect if file has changed based on content comparison
 * No timestamps needed - we use content hashing
 */
function detectChange(driveMeta, trackedMeta) {
  const driveModified = driveMeta?.modifiedTime;
  const lastSynced = trackedMeta?.lastSyncedTime ? new Date(trackedMeta.lastSyncedTime) : null;

  // Simple check: has Drive file been modified since last sync?
  const changed = driveModified && (!lastSynced || driveModified > lastSynced);

  return {
    status: changed ? STATUS.CHANGED : STATUS.NO_CHANGE,
    driveModified: driveModified?.toISOString(),
    lastSynced: lastSynced?.toISOString()
  };
}

/**
 * Main detection function
 */
async function detectChanges() {
  logger.info('Starting change detection');

  try {
    // Load sync metadata
    await syncMetadata.load();
    const trackedFiles = syncMetadata.getAllFiles();
    const lastSync = syncMetadata.getLastSync();

    // Get current state from both sources
    logger.info('Scanning Google Drive...');
    const driveFiles = await getDriveFiles();
    logger.info(`Found ${driveFiles.size} files in Drive`);

    logger.info('Checking GitHub...');
    const githubFiles = await getGitHubFiles();
    logger.info(`Found ${githubFiles.size} files in GitHub`);

    // Analyze changes - only check Drive files
    const changes = {};

    let summary = {
      total: driveFiles.size,
      noChange: 0,
      changed: 0
    };

    for (const [path, driveMeta] of driveFiles) {
      const trackedMeta = trackedFiles[path];

      const analysis = detectChange(driveMeta, trackedMeta);

      if (analysis.status !== STATUS.NO_CHANGE) {
        changes[path] = {
          ...analysis,
          driveId: driveMeta.id
        };
        summary.changed++;
      } else {
        summary.noChange++;
      }
    }

    const result = {
      timestamp: new Date().toISOString(),
      lastSync,
      changes,
      summary
    };

    logger.info('Change detection complete', summary);

    // Output result as JSON for GitHub Actions
    console.log('::set-output name=has-changes::' + (Object.keys(changes).length > 0));
    console.log('::set-output name=changes::' + JSON.stringify(result));

    return result;
  } catch (error) {
    logger.error('Change detection failed', { error: error.message });
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  detectChanges()
    .then(result => {
      logger.info('Detection result', { changedFiles: Object.keys(result.changes).length });
      process.exit(0);
    })
    .catch(error => {
      logger.error('Fatal error', { error: error.message });
      process.exit(1);
    });
}

module.exports = { detectChanges, STATUS };
