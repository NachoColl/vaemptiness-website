/**
 * Apply validated changes from Drive to GitHub
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const githubClient = require('./github-client');
const syncMetadata = require('./sync-metadata');
const config = require('./config');
const logger = require('./logger');

async function applyChanges(validationResult, downloadResult) {
  logger.info('Applying changes to repository');

  const changes = downloadResult.downloaded;
  const conflicts = [];
  const applied = [];

  for (const file of changes) {
    const metaPath = `${file.localPath}.meta`;
    const meta = await fs.readJson(metaPath);

    if (meta.resolution === 'MANUAL_REVIEW') {
      conflicts.push(file);
      logger.warn('Conflict requires manual review', { path: file.path });
    } else {
      // Copy file to src/data/pages
      const destPath = path.join(config.paths.pages, file.path);
      await fs.ensureDir(path.dirname(destPath));
      await fs.copy(file.localPath, destPath);

      applied.push(file.path);
      logger.info('Applied file', { path: file.path });

      // Update metadata
      syncMetadata.setFile(file.path, {
        driveId: meta.driveId,
        driveModifiedTime: meta.driveModified,
        lastSyncedTime: new Date().toISOString(),
        syncDirection: 'drive-to-github'
      });
    }
  }

  if (applied.length > 0) {
    // Git add files
    for (const filePath of applied) {
      const fullPath = path.join(config.paths.pages, filePath);
      execSync(`git add "${fullPath}"`);
    }

    // Commit changes
    const commitMsg = `content: update from Google Drive

Modified files:
${applied.map(f => `- ${f}`).join('\\n')}

🤖 Automated sync from Google Drive`;

    execSync(`git commit -m "${commitMsg}"`);

    // Push to content-updates branch
    const branch = config.github.branches.contentUpdates;
    execSync(`git checkout -B ${branch}`);
    execSync(`git push -u origin ${branch} --force`);

    logger.info('Committed and pushed changes', { branch, files: applied.length });
  }

  // Save metadata
  await syncMetadata.save();

  const result = {
    applied,
    conflicts,
    hasConflicts: conflicts.length > 0
  };

  // Output for GitHub Actions
  console.log('::set-output name=applied::' + JSON.stringify(applied));
  console.log('::set-output name=has-conflicts::' + (conflicts.length > 0));

  return result;
}

if (require.main === module) {
  const validationFile = process.argv[2] || '.drive-sync-temp/validation.json';
  const downloadFile = process.argv[3] || '.drive-sync-temp/download.json';

  Promise.all([
    fs.readJson(validationFile),
    fs.readJson(downloadFile)
  ])
    .then(([validation, download]) => applyChanges(validation, download))
    .then(() => process.exit(0))
    .catch(error => {
      logger.error('Fatal error', { error: error.message });
      process.exit(1);
    });
}

module.exports = { applyChanges };
