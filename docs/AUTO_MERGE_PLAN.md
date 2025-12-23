# Auto-Merge Implementation Plan for Drive Sync

## Current Mechanism Analysis

### 1. Sync Workflow Overview

**Trigger**: Every 15 minutes via GitHub Actions cron job

**Flow**:
```
Drive Changes → Detect → Download → Validate → Apply → Create PR
```

**Steps**:
1. **Change Detection** (`detect-changes.js`)
   - Compares Drive files vs GitHub files
   - Uses metadata tracking (last sync time)
   - Categorizes changes as:
     - `NO_CHANGE` - No modifications
     - `DRIVE_ONLY` - Only Drive changed → Auto-apply
     - `GITHUB_ONLY` - Only GitHub changed → Skip (will sync back to Drive)
     - `CONFLICT` - Both changed → Check grace period

2. **Conflict Resolution** (`detect-changes.js:detectConflict`)
   - If both Drive and GitHub changed:
     - **Within 5-min grace period** → Use most recent (auto-resolve)
     - **Outside grace period** → Mark as `MANUAL_REVIEW`

3. **Download** (`download-changes.js`)
   - Downloads changed files from Drive to `.drive-sync-temp/`
   - Saves metadata with resolution strategy

4. **Validation** (`validate-json.js`)
   - Validates JSON syntax
   - Validates structure (meta, content, SEO fields)
   - Validates safety (no dangerous patterns)

5. **Apply Changes** (`apply-changes.js`)
   - **Non-conflicts**: Copies to `src/data/pages/` and commits
   - **Conflicts**: Skips and adds to conflicts array
   - Creates git commit on `content-updates` branch
   - Force-pushes branch to origin

6. **PR Creation** (`sync-from-drive.js` + `github-client.js`)
   - Creates/updates PR titled "Content update from Google Drive"
   - PR body shows modified files
   - Labels: `content-sync`, `automated`
   - **Current behavior**: PR stays open, waits for manual merge

### 2. Current Configuration

From `scripts/drive-sync/config.js`:

```javascript
sync: {
  conflictGracePeriod: 5 * 60 * 1000, // 5 minutes
  autoMergeNonConflicts: false,        // Currently disabled
  requireReview: [
    'pages/home.json',
    'programs/vaemptiness-program.json'
  ],
  autoApprove: [
    'pages/faq.json',
    'blog/*.json'
  ]
}
```

### 3. What's Missing for Auto-Merge

**Current limitation**: PRs are created but never automatically merged.

**What needs to happen**:
- ✅ Non-conflict changes → Auto-merge PR → Trigger deploy
- ⚠️ Conflict changes → Require manual review → Manual merge

---

## Desired Behavior

### Scenario A: Non-Conflicting Changes (Auto-Merge)

**Example**: User edits `faq.json` in Drive, no one has edited it in GitHub.

**Desired Flow**:
1. ✅ Detect change (DRIVE_ONLY)
2. ✅ Download and validate
3. ✅ Apply to repository
4. ✅ Create PR with changes
5. **✨ Auto-merge PR to master**
6. **✨ Trigger deploy workflow**
7. **✨ Site updates automatically**

**Benefits**:
- Fast content updates (15 min max)
- PR serves as audit trail/history
- Automatic deployment

### Scenario B: Conflicting Changes (Manual Review)

**Example**: User edits `home.json` in Drive, but someone also committed changes to `home.json` in GitHub >5 minutes ago.

**Desired Flow**:
1. ✅ Detect change (CONFLICT + MANUAL_REVIEW)
2. ✅ Download both versions
3. ⚠️ Create PR with conflict markers
4. ⚠️ Label PR with `requires-review`
5. ⚠️ Notify team (optional: Slack/email)
6. 👤 Human reviews and resolves conflict
7. 👤 Manual merge to master
8. **✨ Trigger deploy workflow**

**Benefits**:
- Prevents accidental overwrites
- Human review for complex changes
- PR documents resolution decision

### Scenario C: Critical Files (Always Manual Review)

**Example**: User edits `home.json` or `vaemptiness-program.json` (critical pages).

**Desired Flow**:
1. ✅ Detect change (even if DRIVE_ONLY)
2. ✅ Override resolution to MANUAL_REVIEW
3. ⚠️ Create PR labeled `requires-review` + `critical-file`
4. 👤 Human approves changes
5. 👤 Manual merge to master

**Benefits**:
- Extra safety for important content
- Prevents accidental homepage changes
- Team awareness of critical updates

---

## Implementation Plan

### Phase 1: Add Auto-Merge Logic

**File**: `scripts/drive-sync/sync-from-drive.js`

**Changes**:
1. After PR creation, check if auto-merge should happen
2. Add auto-merge logic based on conflict status

**New function**:
```javascript
async function autoMergeIfEligible(pr, result) {
  // Don't auto-merge if there are conflicts
  if (result.hasConflicts) {
    logger.info('Skipping auto-merge: conflicts detected', { prNumber: pr.number });
    return { merged: false, reason: 'conflicts' };
  }

  // Check if any files require manual review
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

  // Check config setting
  if (!config.sync.autoMergeNonConflicts) {
    logger.info('Skipping auto-merge: feature disabled in config', { prNumber: pr.number });
    return { merged: false, reason: 'disabled' };
  }

  // All checks passed - auto-merge!
  logger.info('Auto-merging PR', { prNumber: pr.number });
  const merged = await githubClient.mergePR(pr.number, {
    merge_method: 'squash',
    commit_title: `${pr.title} (#${pr.number})`,
    commit_message: pr.body
  });

  return { merged: true, prNumber: pr.number, sha: merged.sha };
}
```

### Phase 2: Add PR Merge Method to GitHub Client

**File**: `scripts/drive-sync/github-client.js`

**New method**:
```javascript
/**
 * Merge a pull request
 */
async mergePR(prNumber, options = {}) {
  this.initialize();

  try {
    const response = await this.octokit.pulls.merge({
      owner: config.github.owner,
      repo: config.github.repo,
      pull_number: prNumber,
      merge_method: options.merge_method || 'squash',
      commit_title: options.commit_title,
      commit_message: options.commit_message
    });

    logger.info('Merged PR', {
      prNumber,
      sha: response.data.sha,
      merged: response.data.merged
    });

    return response.data;
  } catch (error) {
    logger.error('Failed to merge PR', {
      prNumber,
      error: error.message
    });
    throw error;
  }
}

/**
 * Add label to issue/PR
 */
async addLabel(issueNumber, label) {
  this.initialize();

  try {
    await this.octokit.issues.addLabels({
      owner: config.github.owner,
      repo: config.github.repo,
      issue_number: issueNumber,
      labels: [label]
    });

    logger.info('Added label', { issueNumber, label });
  } catch (error) {
    logger.error('Failed to add label', {
      issueNumber,
      label,
      error: error.message
    });
    throw error;
  }
}
```

### Phase 3: Update Sync Orchestrator

**File**: `scripts/drive-sync/sync-from-drive.js`

**Update PR creation section** (around line 68-105):
```javascript
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

  logger.info('Created/updated pull request', {
    prNumber: pr.number,
    url: pr.html_url
  });

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
```

### Phase 4: Add Pattern Matching Utility

**Install dependency**:
```bash
npm install minimatch
```

**Add to files that need pattern matching**:
```javascript
const minimatch = require('minimatch');
```

### Phase 5: Update Configuration

**File**: `scripts/drive-sync/config.js`

**Enable auto-merge**:
```javascript
sync: {
  conflictGracePeriod: 5 * 60 * 1000, // 5 minutes
  autoMergeNonConflicts: true,  // ✨ Enable auto-merge

  // Files that always require manual review (even if no conflict)
  requireReview: [
    'home.json',                        // Homepage
    'programs/vaemptiness-program.json' // Main program
  ],

  // Files that can auto-merge without extra scrutiny
  autoApprove: [
    'faq.json',
    'contacto.json',
    'blog/*.json',
    'politica-privacidad.json',
    'terminos-condiciones.json'
  ]
}
```

### Phase 6: Handle Deployment

**Current**: Deployment happens on push to `master` (existing workflow)

**After auto-merge**:
1. PR merges to master
2. `on: push` trigger fires existing deploy workflow
3. Site rebuilds and deploys automatically

**No changes needed** - existing deploy workflow already handles this!

---

## Edge Cases & Safeguards

### 1. Validation Failures
**Scenario**: Downloaded file fails validation (malformed JSON, missing fields).

**Current behavior**: Script fails, no PR created.

**Proposed**: Keep this behavior - never auto-merge invalid content.

### 2. Multiple Files Changed
**Scenario**: 10 files changed, 8 safe, 2 critical.

**Behavior**:
- All 10 files included in PR
- PR marked `requires-review` due to critical files
- No auto-merge
- Human reviews all changes together

### 3. Rapid Successive Changes
**Scenario**: User makes 3 changes to FAQ in Drive within 10 minutes.

**Behavior**:
- First sync (minute 0): Creates PR, auto-merges
- Second sync (minute 10): Updates PR on `content-updates` branch
  - **Problem**: Branch just merged, now has conflicts with master
  - **Solution**: Delete old branch, create fresh branch from master

**Fix needed**: Before creating PR, check if branch exists and force-reset from master:
```javascript
// In apply-changes.js
execSync(`git checkout master`);
execSync(`git pull origin master`);
execSync(`git checkout -B ${branch}`); // -B recreates branch
```

### 4. GitHub API Rate Limits
**Scenario**: Too many API calls in short time.

**Mitigation**:
- Sync runs every 15 minutes max
- Each sync: ~5-10 API calls (list commits, create/update PR, merge)
- GitHub limit: 5,000 requests/hour
- Usage: ~30 requests/hour (well under limit)

### 5. Concurrent Merges
**Scenario**: Two PRs try to merge simultaneously.

**GitHub behavior**: Second merge will fail with conflict.

**Our behavior**: Next sync cycle will detect conflict and create manual review PR.

---

## Testing Strategy

### Test Case 1: Simple Non-Conflict Change
1. Edit `faq.json` in Drive
2. Wait for sync (or trigger manually)
3. ✅ Verify PR created
4. ✅ Verify PR auto-merged
5. ✅ Verify deploy triggered
6. ✅ Verify site updated

### Test Case 2: Critical File Change
1. Edit `home.json` in Drive
2. Wait for sync
3. ✅ Verify PR created
4. ✅ Verify PR labeled `requires-review` + `critical-file`
5. ✅ Verify PR NOT auto-merged
6. 👤 Manually merge
7. ✅ Verify deploy triggered

### Test Case 3: Conflict Detection
1. Edit `faq.json` in Drive
2. Edit same file in GitHub (different change)
3. Wait >5 minutes
4. Sync from Drive
5. ✅ Verify conflict detected
6. ✅ Verify PR created with conflict note
7. ✅ Verify PR NOT auto-merged
8. 👤 Manually resolve and merge

### Test Case 4: Validation Failure
1. Edit `faq.json` in Drive with invalid JSON
2. Wait for sync
3. ✅ Verify sync fails
4. ✅ Verify no PR created
5. ✅ Verify error logged

---

## Rollout Plan

### Phase 1: Implement Code (Week 1)
- [ ] Add `minimatch` dependency
- [ ] Add `autoMergeIfEligible()` function
- [ ] Add `mergePR()` and `addLabel()` to github-client.js
- [ ] Update sync-from-drive.js orchestrator
- [ ] Fix branch reset logic in apply-changes.js

### Phase 2: Test Locally (Week 1)
- [ ] Test with mock PRs
- [ ] Test critical file detection
- [ ] Test pattern matching
- [ ] Test merge API calls

### Phase 3: Deploy to Production with Auto-Merge OFF (Week 2)
- [ ] Push code to master
- [ ] Keep `autoMergeNonConflicts: false`
- [ ] Monitor sync behavior
- [ ] Verify PRs still created correctly

### Phase 4: Enable Auto-Merge for Safe Files (Week 2)
- [ ] Set `autoMergeNonConflicts: true`
- [ ] Update `requireReview` to include all critical pages
- [ ] Monitor first auto-merge carefully
- [ ] Test with FAQ change (safe file)

### Phase 5: Monitor & Tune (Week 3+)
- [ ] Review auto-merge logs
- [ ] Adjust `requireReview` list as needed
- [ ] Add more files to `autoApprove` if needed
- [ ] Fine-tune grace period if conflicts happen frequently

---

## Configuration Reference

### Auto-Merge Decision Matrix

| Condition | Auto-Merge? | Label Added |
|-----------|-------------|-------------|
| No conflicts + Safe file + Feature ON | ✅ YES | `content-sync`, `automated` |
| No conflicts + Critical file | ❌ NO | `requires-review`, `critical-file` |
| Has conflicts | ❌ NO | `requires-review`, `conflict` |
| Validation failed | ❌ NO PR | N/A |
| Feature OFF (`autoMergeNonConflicts: false`) | ❌ NO | `content-sync`, `automated` |

### File Categories

**Critical Files** (always manual review):
- `home.json` - Homepage content
- `programs/vaemptiness-program.json` - Main program offering

**Safe Files** (can auto-merge):
- `faq.json` - FAQ content
- `contacto.json` - Contact page
- `blog/*.json` - Blog posts
- `politica-privacidad.json` - Privacy policy
- `terminos-condiciones.json` - Terms & conditions

**Medium Risk** (auto-merge but monitor):
- `sobre-nosotros.json` - About us
- `aprendizaje-y-metodologia.json` - Learning methodology
- `reset.json` - Reset program
- `programs/vaemptiness-*.json` - Other program pages

---

## Benefits Summary

### For Content Editors
- ✅ Fast updates (max 15 min delay)
- ✅ No GitHub knowledge needed
- ✅ Edit directly in Google Drive
- ✅ Changes appear automatically

### For Developers
- ✅ Full audit trail in PRs
- ✅ Git history preserved
- ✅ Safety net for critical files
- ✅ Manual override always available

### For the Team
- ✅ Reduced manual work
- ✅ Faster content iteration
- ✅ Reduced deployment friction
- ✅ Clear process for conflicts

---

## Success Metrics

After implementation, track:
- **Auto-merge rate**: % of PRs that auto-merge
- **Conflict rate**: % of syncs with conflicts
- **Time to publish**: Average time from Drive edit to live site
- **Manual interventions**: Number of manual merges per month
- **False positives**: Critical files that should have been reviewed but auto-merged

**Target metrics**:
- Auto-merge rate: >80%
- Conflict rate: <5%
- Time to publish: <20 minutes
- Manual interventions: <5 per month
- False positives: 0

---

## Next Steps

1. Review this plan with team
2. Get approval for auto-merge approach
3. Decide on initial `requireReview` file list
4. Implement code changes
5. Test thoroughly
6. Deploy with feature flag OFF
7. Enable auto-merge for safe files
8. Monitor and tune

---

**Document Version**: 1.0
**Last Updated**: 2025-12-23
**Author**: Claude Code Implementation
