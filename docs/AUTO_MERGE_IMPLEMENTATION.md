# Auto-Merge Implementation - Simplified Plan

## ✅ Decisions Made

1. **No files require manual review** - Only conflicts trigger manual review
2. **Auto-merge: ON** - Enable immediately when deployed
3. **Grace period: 5 minutes** - Simultaneous edits within 5 min auto-resolve to most recent
4. **Notifications: Email** - Send email when manual review needed

---

## 🎯 Behavior Summary

### Scenario A: Clean Change (Auto-Merge) ✅

**Example**: User edits `faq.json` in Drive, no GitHub changes to that file.

```
Drive Edit (10:00) → Sync Detects (10:15) → PR Created → ✨ Auto-Merged → Deployed → Live (10:20)
```

**All files** can auto-merge when there's no conflict!

---

### Scenario B: Simultaneous Edit Within Grace Period (Auto-Merge) ✅

**Example**: User edits `home.json` in Drive at 10:00, dev commits to `home.json` at 10:02.

```
Time difference: 2 minutes (< 5 min grace period)
Result: Use most recent version (Drive edit at 10:00)
Action: Auto-merge with Drive content
```

**No manual review needed** - system picks most recent.

---

### Scenario C: Real Conflict (Manual Review) ⚠️

**Example**: User edits `home.json` in Drive at 10:00, dev committed to `home.json` at 9:50.

```
Time difference: 10 minutes (> 5 min grace period)
Result: CONFLICT detected
Action: Create PR with label "requires-review"
Email: Sent to ignacio.coll@gmail.com
Manual: Human reviews and merges
```

---

## 🔧 Implementation Tasks

### Task 1: Add minimatch Dependency

**File**: `package.json`

```bash
npm install minimatch
```

---

### Task 2: Add Auto-Merge Logic

**File**: `scripts/drive-sync/sync-from-drive.js`

Add new function before `syncFromDrive()`:

```javascript
const minimatch = require('minimatch');

/**
 * Determine if PR should auto-merge
 */
async function autoMergeIfEligible(pr, result) {
  // Check 1: Do we have conflicts?
  if (result.hasConflicts) {
    logger.info('Skipping auto-merge: conflicts detected', { prNumber: pr.number });
    await githubClient.addLabel(pr.number, 'requires-review');
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
  const merged = await githubClient.mergePR(pr.number, {
    merge_method: 'squash',
    commit_title: `${pr.title} (#${pr.number})`,
    commit_message: pr.body
  });

  return { merged: true, prNumber: pr.number, sha: merged.sha };
}
```

Update the PR creation section (around line 86):

```javascript
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

// ✨ Auto-merge if eligible
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
```

---

### Task 3: Add GitHub API Methods

**File**: `scripts/drive-sync/github-client.js`

Add these two methods to the `GitHubClient` class:

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

---

### Task 4: Add Email Notifications

**File**: `.github/workflows/drive-sync.yml`

Add email notification step after sync:

```yaml
- name: Run Drive → GitHub sync
  id: sync
  env:
    GOOGLE_DRIVE_CREDENTIALS: ${{ secrets.GOOGLE_DRIVE_CREDENTIALS }}
    GOOGLE_DRIVE_FOLDER_ID: ${{ secrets.GOOGLE_DRIVE_FOLDER_ID }}
    GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
    GOOGLE_CLIENT_SECRET: ${{ secrets.GOOGLE_CLIENT_SECRET }}
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    NOTIFY_EMAIL: ${{ secrets.NOTIFY_EMAIL }}
  run: npm run drive:sync
  continue-on-error: true

- name: Send email notification for manual review
  if: failure() || contains(steps.sync.outputs.labels, 'requires-review')
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    secure: true
    username: ${{ secrets.SMTP_USERNAME }}
    password: ${{ secrets.SMTP_PASSWORD }}
    subject: '⚠️ Drive Sync Requires Manual Review'
    to: ${{ secrets.NOTIFY_EMAIL }}
    from: Drive Sync <noreply@vaemptiness.com>
    body: |
      A Google Drive content sync requires manual review.

      Reason: Conflict detected or validation failed

      Please review and merge the pull request:
      https://github.com/${{ github.repository }}/pulls

      Time: ${{ github.event.head_commit.timestamp }}
```

**Required GitHub Secrets**:
- `NOTIFY_EMAIL` = `ignacio.coll@gmail.com`
- `SMTP_USERNAME` = Gmail address
- `SMTP_PASSWORD` = Gmail app password

---

### Task 5: Update Environment Variables

**File**: `.env.example`

Add email configuration:

```bash
# Email notifications
NOTIFY_EMAIL=ignacio.coll@gmail.com
SMTP_USERNAME=your-gmail@gmail.com
SMTP_PASSWORD=your-gmail-app-password
```

---

## 📧 Setting Up Gmail for Notifications

### Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification

### Step 2: Create App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select app: "Mail"
3. Select device: "Other (Custom name)" → "GitHub Actions"
4. Click "Generate"
5. Copy the 16-character password

### Step 3: Add to GitHub Secrets
1. Go to repository settings → Secrets
2. Add `SMTP_USERNAME` = your Gmail address
3. Add `SMTP_PASSWORD` = the 16-character app password
4. Add `NOTIFY_EMAIL` = `ignacio.coll@gmail.com`

---

## 🧪 Testing Plan

### Test 1: Simple Auto-Merge
1. Edit `faq.json` in Drive
2. Wait for sync (or trigger manually)
3. ✅ Verify PR created
4. ✅ Verify PR auto-merged
5. ✅ Verify no email sent
6. ✅ Verify site deployed

### Test 2: Grace Period Auto-Resolve
1. Edit `home.json` in GitHub (commit at 10:00)
2. Edit same file in Drive (save at 10:02)
3. Wait for sync
4. ✅ Verify Drive version used (most recent)
5. ✅ Verify auto-merged
6. ✅ Verify no email sent

### Test 3: Real Conflict
1. Edit `home.json` in GitHub (commit at 10:00)
2. Wait 10 minutes
3. Edit same file in Drive (save at 10:10)
4. Wait for sync
5. ✅ Verify PR created with `requires-review` label
6. ✅ Verify PR NOT auto-merged
7. ✅ Verify email sent to ignacio.coll@gmail.com
8. 👤 Manually merge PR
9. ✅ Verify site deployed

### Test 4: Validation Failure
1. Edit `faq.json` with invalid JSON in Drive
2. Wait for sync
3. ✅ Verify sync fails
4. ✅ Verify email sent with error details
5. ✅ Verify no PR created

---

## 🚀 Deployment Steps

### Step 1: Install Dependencies
```bash
npm install minimatch
```

### Step 2: Add Code Changes
- Update `sync-from-drive.js` with auto-merge logic
- Update `github-client.js` with merge/label methods
- Update `drive-sync.yml` with email notification
- Update `.env.example` with email config

### Step 3: Configure Gmail
- Enable 2FA
- Create app password
- Add to GitHub Secrets

### Step 4: Test Locally (Optional)
```bash
# Set local env vars
export NOTIFY_EMAIL=ignacio.coll@gmail.com
export SMTP_USERNAME=your-gmail@gmail.com
export SMTP_PASSWORD=your-app-password

# Test sync
npm run drive:sync
```

### Step 5: Deploy to GitHub
```bash
git add .
git commit -m "feat: implement auto-merge for Drive sync PRs"
git push origin master
```

### Step 6: Monitor First Sync
- Make a test edit in Drive
- Watch GitHub Actions workflow
- Verify auto-merge happens
- Check email only arrives for conflicts

---

## 📊 Success Criteria

After 1 week of operation:

- ✅ Auto-merge rate: >90% (most changes auto-merge)
- ✅ Conflict rate: <10% (few real conflicts)
- ✅ Time to publish: <20 minutes (Drive edit → Live site)
- ✅ Email noise: Low (only real conflicts/errors)
- ✅ False negatives: 0 (no conflicts missed)

---

## 🔧 Troubleshooting

### Auto-merge not happening?
**Check**:
1. Is `autoMergeNonConflicts: true` in config.js?
2. Does PR have conflicts?
3. Check GitHub Actions logs for merge errors
4. Verify `GITHUB_TOKEN` has write permissions

### Email not sending?
**Check**:
1. Gmail app password correct?
2. SMTP secrets added to GitHub?
3. 2FA enabled on Gmail?
4. Check GitHub Actions workflow logs

### Grace period too strict/lenient?
**Adjust**:
```javascript
conflictGracePeriod: 10 * 60 * 1000, // 10 minutes (more lenient)
conflictGracePeriod: 2 * 60 * 1000,  // 2 minutes (more strict)
```

---

## 📝 Next Steps

1. ✅ Review this implementation plan
2. ⏳ Install minimatch dependency
3. ⏳ Add auto-merge code
4. ⏳ Add email notification workflow
5. ⏳ Set up Gmail app password
6. ⏳ Add GitHub Secrets
7. ⏳ Deploy and test
8. ⏳ Monitor first auto-merge

**Estimated time**: 2-3 hours to implement and test

---

**Ready to implement?** Let me know and I'll start with Task 1!
