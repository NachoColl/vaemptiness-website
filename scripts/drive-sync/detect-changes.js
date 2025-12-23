/**
 * Detect changes between Google Drive and GitHub
 */

const dayjs = require('dayjs');
const driveClient = require('./drive-client');
const githubClient = require('./github-client');
const syncMetadata = require('./sync-metadata');
const config = require('./config');
const logger = require('./logger');

const STATUS = {
  NO_CHANGE: 'NO_CHANGE',
  DRIVE_ONLY: 'DRIVE_ONLY',
  GITHUB_ONLY: 'GITHUB_ONLY',
  CONFLICT: 'CONFLICT'
};

const RESOLUTION = {
  USE_DRIVE: 'USE_DRIVE',
  USE_GITHUB: 'USE_GITHUB',
  MANUAL_REVIEW: 'MANUAL_REVIEW'
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
 * Detect conflict and determine resolution
 */
function detectConflict(driveMeta, githubMeta, lastSyncTime) {
  const driveModified = driveMeta?.modifiedTime;
  const githubModified = githubMeta?.modifiedTime;
  const lastSynced = lastSyncTime ? new Date(lastSyncTime) : null;

  const driveChanged = driveModified && (!lastSynced || driveModified > lastSynced);
  const githubChanged = githubModified && (!lastSynced || githubModified > lastSynced);

  let status;
  let resolution;

  if (!driveChanged && !githubChanged) {
    status = STATUS.NO_CHANGE;
    resolution = null;
  } else if (driveChanged && !githubChanged) {
    status = STATUS.DRIVE_ONLY;
    resolution = RESOLUTION.USE_DRIVE;
  } else if (!driveChanged && githubChanged) {
    status = STATUS.GITHUB_ONLY;
    resolution = RESOLUTION.USE_GITHUB;
  } else {
    // Both changed - conflict
    status = STATUS.CONFLICT;

    // Check if within grace period
    const timeDiff = Math.abs(driveModified - githubModified);

    if (timeDiff < config.sync.conflictGracePeriod) {
      // Recent simultaneous changes - use most recent
      resolution = driveModified > githubModified
        ? RESOLUTION.USE_DRIVE
        : RESOLUTION.USE_GITHUB;
    } else {
      // Significant time difference - manual review needed
      resolution = RESOLUTION.MANUAL_REVIEW;
    }
  }

  return {
    status,
    resolution,
    driveModified: driveModified?.toISOString(),
    githubModified: githubModified?.toISOString(),
    lastSynced: lastSynced?.toISOString(),
    driveChanged,
    githubChanged
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

    // Analyze changes
    const changes = {};
    const allPaths = new Set([
      ...driveFiles.keys(),
      ...githubFiles.keys(),
      ...Object.keys(trackedFiles)
    ]);

    let summary = {
      total: allPaths.size,
      noChange: 0,
      driveOnly: 0,
      githubOnly: 0,
      conflicts: 0,
      manualReview: 0
    };

    for (const path of allPaths) {
      const driveMeta = driveFiles.get(path);
      const githubMeta = githubFiles.get(path);
      const trackedMeta = trackedFiles[path];

      const analysis = detectConflict(
        driveMeta,
        githubMeta,
        trackedMeta?.lastSyncedTime
      );

      if (analysis.status !== STATUS.NO_CHANGE) {
        changes[path] = {
          ...analysis,
          driveId: driveMeta?.id,
          githubSha: githubMeta?.sha
        };
      }

      // Update summary
      if (analysis.status === STATUS.NO_CHANGE) summary.noChange++;
      else if (analysis.status === STATUS.DRIVE_ONLY) summary.driveOnly++;
      else if (analysis.status === STATUS.GITHUB_ONLY) summary.githubOnly++;
      else if (analysis.status === STATUS.CONFLICT) summary.conflicts++;

      if (analysis.resolution === RESOLUTION.MANUAL_REVIEW) summary.manualReview++;
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

module.exports = { detectChanges, STATUS, RESOLUTION };
