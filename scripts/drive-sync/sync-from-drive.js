/**
 * Main orchestrator: sync changes from Google Drive to GitHub
 */

const fs = require('fs-extra');
const { detectChanges } = require('./detect-changes');
const { downloadChanges } = require('./download-changes');
const { validate } = require('./validate-json');
const { applyChanges } = require('./apply-changes');
const githubClient = require('./github-client');
const syncMetadata = require('./sync-metadata');
const config = require('./config');
const logger = require('./logger');

async function syncFromDrive() {
  logger.info('=== Starting Google Drive → GitHub sync ===');

  try {
    // Ensure temp directory exists
    await fs.ensureDir(config.paths.temp);

    // 1. Detect changes
    logger.info('Step 1: Detecting changes');
    const changes = await detectChanges();

    if (Object.keys(changes.changes).length === 0) {
      logger.info('No changes detected');
      return { success: true, changes: 0 };
    }

    // Save changes for later steps
    await fs.writeJson(`${config.paths.temp}/changes.json`, changes, { spaces: 2 });

    // 2. Download changed files
    logger.info('Step 2: Downloading files from Drive');
    const download = await downloadChanges(changes);

    if (download.downloaded.length === 0) {
      logger.info('No files to download');
      return { success: true, changes: 0 };
    }

    await fs.writeJson(`${config.paths.temp}/download.json`, download, { spaces: 2 });

    // 3. Validate JSON
    logger.info('Step 3: Validating downloaded files');
    const validation = await validate();

    if (!validation.valid) {
      logger.error('Validation failed', { errors: validation.errors });

      // Create issue for validation failure
      await githubClient.createIssue(
        'Content validation failed',
        `Validation errors:\\n\`\`\`\\n${validation.errors.join('\\n')}\\n\`\`\``,
        ['validation-error', 'content']
      );

      throw new Error('Validation failed');
    }

    await fs.writeJson(`${config.paths.temp}/validation.json`, validation, { spaces: 2 });

    // 4. Apply changes
    logger.info('Step 4: Applying changes to repository');
    const result = await applyChanges(validation, download);

    // 5. Create Pull Request
    if (result.applied.length > 0) {
      const branch = config.github.branches.contentUpdates;

      const prBody = `## Automated Content Sync from Google Drive

**Files modified:** ${result.applied.length}

${result.applied.map(f => `- \`${f}\``).join('\\n')}

**Sync timestamp:** ${new Date().toISOString()}

✅ Validation passed
✅ No conflicts detected

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)`;

      const pr = await githubClient.createOrUpdatePR(
        branch,
        'Content update from Google Drive',
        prBody,
        ['content-sync', 'automated']
      );

      logger.info('Created/updated pull request', { prNumber: pr.number, url: pr.html_url });

      // Add to sync history
      syncMetadata.addSyncHistory({
        direction: 'drive-to-github',
        filesChanged: result.applied,
        conflicts: result.conflicts.length,
        status: 'success',
        prNumber: pr.number
      });

      await syncMetadata.save();
    }

    logger.info('=== Sync complete ===', {
      applied: result.applied.length,
      conflicts: result.conflicts.length
    });

    return {
      success: true,
      changes: result.applied.length,
      conflicts: result.conflicts.length
    };
  } catch (error) {
    logger.error('Sync failed', { error: error.message });

    // Add failed sync to history
    try {
      await syncMetadata.load();
      syncMetadata.addSyncHistory({
        direction: 'drive-to-github',
        status: 'failed',
        error: error.message
      });
      await syncMetadata.save();
    } catch (metaError) {
      logger.error('Could not save error to metadata', { error: metaError.message });
    }

    throw error;
  }
}

if (require.main === module) {
  syncFromDrive()
    .then(result => {
      logger.info('Sync completed successfully', result);
      process.exit(0);
    })
    .catch(error => {
      logger.error('Fatal error', { error: error.message });
      process.exit(1);
    });
}

module.exports = { syncFromDrive };
