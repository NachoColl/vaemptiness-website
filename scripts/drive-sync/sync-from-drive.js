/**
 * Main orchestrator: sync changes from Google Drive to GitHub
 */

const fs = require('fs-extra');
const minimatch = require('minimatch');
const { detectChanges } = require('./detect-changes');
const { downloadChanges } = require('./download-changes');
const { validate } = require('./validate-json');
const { applyChanges } = require('./apply-changes');
const githubClient = require('./github-client');
const syncMetadata = require('./sync-metadata');
const config = require('./config');
const logger = require('./logger');

/**
 * Determine if PR should auto-merge
 */
async function autoMergeIfEligible(pr, result) {
  // Check 1: Do we have conflicts?
  if (result.hasConflicts) {
    logger.info('Skipping auto-merge: conflicts detected', { prNumber: pr.number });
    await githubClient.addLabel(pr.number, 'requires-review');
    await githubClient.addLabel(pr.number, 'conflict');
    return { merged: false, reason: 'conflicts' };
  }

  // Check 2: Is auto-merge enabled?
  if (!config.sync.autoMergeNonConflicts) {
    logger.info('Skipping auto-merge: feature disabled', { prNumber: pr.number });
    return { merged: false, reason: 'disabled' };
  }

  // Check 3: Any files require manual review?
  const requiresReview = result.applied.some(filePath => {
    return config.sync.requireReview.some(pattern => {
      return minimatch(filePath, pattern);
    });
  });

  if (requiresReview) {
    logger.info('Skipping auto-merge: critical files changed', { prNumber: pr.number });
    await githubClient.addLabel(pr.number, 'requires-review');
    await githubClient.addLabel(pr.number, 'critical-file');
    return { merged: false, reason: 'critical-files' };
  }

  // All checks passed - auto-merge!
  logger.info('Auto-merging PR', { prNumber: pr.number });

  try {
    const merged = await githubClient.mergePR(pr.number, {
      merge_method: 'squash',
      commit_title: `${pr.title} (#${pr.number})`,
      commit_message: pr.body
    });

    return { merged: true, prNumber: pr.number, sha: merged.sha };
  } catch (error) {
    logger.error('Auto-merge failed', { prNumber: pr.number, error: error.message });
    await githubClient.addLabel(pr.number, 'auto-merge-failed');
    return { merged: false, reason: 'merge-error', error: error.message };
  }
}

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
${result.hasConflicts ? '⚠️ Conflicts detected - manual review required' : '✅ No conflicts detected'}

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)`;

      const pr = await githubClient.createOrUpdatePR(
        branch,
        'Content update from Google Drive',
        prBody,
        ['content-sync', 'automated']
      );

      logger.info('Created/updated pull request', { prNumber: pr.number, url: pr.html_url });

      // Auto-merge if eligible
      const mergeResult = await autoMergeIfEligible(pr, result);

      // Add to sync history
      syncMetadata.addSyncHistory({
        direction: 'drive-to-github',
        filesChanged: result.applied,
        conflicts: result.conflicts.length,
        status: 'success',
        prNumber: pr.number,
        autoMerged: mergeResult.merged,
        mergeReason: mergeResult.reason
      });

      await syncMetadata.save();

      if (mergeResult.merged) {
        logger.info('✅ PR auto-merged to master', {
          prNumber: pr.number,
          sha: mergeResult.sha
        });
      } else {
        logger.info('⚠️ PR requires manual review', {
          prNumber: pr.number,
          reason: mergeResult.reason
        });
      }
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
