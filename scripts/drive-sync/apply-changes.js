/**
 * Apply validated changes from Drive to GitHub
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const githubClient = require('./github-client');
const syncMetadata = require('./sync-metadata');
const { mergeJSON } = require('./merge-json');
const config = require('./config');
const logger = require('./logger');

async function applyChanges(validationResult, downloadResult) {
  logger.info('Applying changes to repository');

  const changes = downloadResult.downloaded;
  const applied = [];
  const mergeDetails = [];

  for (const file of changes) {
    const metaPath = `${file.localPath}.meta`;
    const meta = await fs.readJson(metaPath);

    // Load Drive version (just downloaded)
    const driveContent = await fs.readJson(file.localPath);

    // Load current Git version (if exists)
    const destPath = path.join(config.paths.pages, file.path);
    let gitContent = null;

    try {
      if (await fs.pathExists(destPath)) {
        gitContent = await fs.readJson(destPath);
      }
    } catch (error) {
      logger.warn('Could not load Git version', { path: file.path, error: error.message });
    }

    // Merge: Drive properties override, Git-only properties preserved
    let finalContent;
    let mergeInfo = {
      path: file.path,
      gitOnly: [],
      driveOverride: []
    };

    if (gitContent) {
      const mergeResult = mergeJSON(gitContent, driveContent);
      finalContent = mergeResult.merged;
      mergeInfo.gitOnly = mergeResult.gitOnly;
      mergeInfo.driveOverride = mergeResult.driveOverride;

      if (mergeResult.gitOnly.length > 0) {
        logger.info('Merged with Git-only properties preserved', {
          path: file.path,
          gitOnlyProps: mergeResult.gitOnly
        });
      }
    } else {
      // No Git version - use Drive version entirely
      finalContent = driveContent;
      logger.info('New file from Drive', { path: file.path });
    }

    // Write merged content
    await fs.ensureDir(path.dirname(destPath));
    await fs.writeJson(destPath, finalContent, { spaces: 2 });

    applied.push(file.path);
    mergeDetails.push(mergeInfo);

    // Update metadata
    syncMetadata.setFile(file.path, {
      driveId: meta.driveId,
      driveModifiedTime: meta.driveModified,
      lastSyncedTime: new Date().toISOString(),
      syncDirection: 'drive-to-github'
    });
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
    mergeDetails
  };

  // Output for GitHub Actions
  console.log('::set-output name=applied::' + JSON.stringify(applied));
  console.log('::set-output name=merge-details::' + JSON.stringify(mergeDetails));

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
