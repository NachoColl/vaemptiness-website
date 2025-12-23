# Google Drive Sync - Setup Guide

Complete step-by-step instructions to set up the Google Drive ↔ GitHub content synchronization system.

---

## Prerequisites

- Google Cloud account
- GitHub repository access
- Node.js 20+ installed locally (for initial setup)
- npm installed

---

## Part 1: Google Cloud Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing):
   - Name: `vaemptiness-website-sync`
   - Click "Create"

### Step 2: Enable Google Drive API

1. In the project, go to **APIs & Services → Library**
2. Search for "Google Drive API"
3. Click "Enable"

### Step 3: Create Service Account

1. Go to **APIs & Services → Credentials**
2. Click "Create Credentials" → "Service Account"
3. Fill in details:
   - Name: `content-sync`
   - Description: `Service account for content sync between Drive and GitHub`
4. Click "Create and Continue"
5. Skip "Grant this service account access to project" (optional)
6. Click "Done"

### Step 4: Create Service Account Key

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Choose "JSON" format
5. Click "Create"
6. **Save the downloaded JSON file securely** - you'll need it later

### Step 5: Grant Drive Folder Access

1. Open the downloaded JSON file
2. Copy the `client_email` value (looks like `content-sync@...iam.gserviceaccount.com`)
3. Go to your Google Drive folder: https://drive.google.com/drive/folders/18lNMWacTTf5_5EIFP_UUTLq3UBU3rfZY
4. Click "Share"
5. Paste the service account email
6. Set permission to "Editor"
7. Click "Send" (uncheck "Notify people")

---

## Part 2: GitHub Setup

### Step 1: Add GitHub Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"

**Add these secrets:**

1. **GOOGLE_DRIVE_CREDENTIALS**
   - Name: `GOOGLE_DRIVE_CREDENTIALS`
   - Value: Paste the ENTIRE contents of the service account JSON file
   - Click "Add secret"

2. **GOOGLE_DRIVE_FOLDER_ID**
   - Name: `GOOGLE_DRIVE_FOLDER_ID`
   - Value: `18lNMWacTTf5_5EIFP_UUTLq3UBU3rfZY`
   - Click "Add secret"

### Step 2: Verify GitHub Token

GitHub Actions automatically provides `GITHUB_TOKEN` for workflows. No action needed.

---

## Part 3: Local Setup (Optional, for Testing)

### Step 1: Create .env File

```bash
cp .env.example .env
```

### Step 2: Edit .env File

1. Open `.env` in your text editor
2. Replace `GOOGLE_DRIVE_CREDENTIALS` value with your service account JSON:
   - Must be a single line
   - Keep all quotes and escapes
   - Or use the file path method (see below)

**Example:**
```bash
GOOGLE_DRIVE_CREDENTIALS='{"type":"service_account",...}'
```

**Alternative (using file path):**

Edit `scripts/drive-sync/config.js`:
```javascript
credentials: process.env.GOOGLE_DRIVE_CREDENTIALS
  ? JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS)
  : require('/path/to/service-account-key.json'),  // ← Add this
```

### Step 3: Install Dependencies

```bash
npm install
```

---

## Part 4: Initial Upload to Drive

This step uploads all existing JSON files from `src/data/pages/` to Google Drive.

### Step 1: Verify Files to Upload

```bash
ls -R src/data/pages/
```

Verify these are the files you want to sync.

### Step 2: Run Initial Upload

```bash
npm run drive:init
```

**Expected output:**
```
[INFO] Starting initial upload to Google Drive
[INFO] Using Drive folder { folderId: '18lN...' }
[INFO] Uploading pages directory
[INFO] Uploaded file { fileName: 'home.json', relativePath: 'home.json' }
[INFO] Uploaded file { fileName: 'sobre-nosotros.json', ... }
...
[INFO] Initial upload complete
[INFO] View files: https://drive.google.com/drive/folders/18lN...
```

### Step 3: Verify in Google Drive

1. Open the Drive folder link from the output
2. Verify all JSON files are present
3. Check that folder structure matches `src/data/pages/`

---

## Part 5: Test the Sync

### Test 1: Manual Sync (Local)

1. Edit a file in Google Drive (e.g., `home.json`)
2. Save changes
3. Run manual sync:
   ```bash
   npm run drive:sync
   ```

**Expected:**
- Detects changes
- Downloads file
- Validates JSON
- Creates PR with changes

### Test 2: GitHub Actions (Automated)

1. Go to your repository → Actions
2. Find "Google Drive Content Sync" workflow
3. Click "Run workflow" → "Run workflow"
4. Watch the workflow execute
5. Check for PR creation

### Test 3: Check Sync Status

```bash
npm run drive:status
```

**Expected output:**
```
=== Google Drive Sync Status ===

Drive Folder: https://drive.google.com/drive/folders/...
Last Sync: 2 minutes ago (2025-12-23T...)

Files Tracked: 12

Recent Sync History:

1. ✅ Drive → GitHub - 2 minutes ago
   Files: 1

...
```

---

## Part 6: Enable Scheduled Sync

The GitHub Actions workflow is already configured to run every 15 minutes automatically. No additional setup needed!

**To verify:**
1. Go to Actions tab
2. You should see the workflow running every 15 minutes
3. Or click "Run workflow" to trigger manually

---

## Troubleshooting

### Error: "Google Drive credentials not configured"

**Solution:**
- Verify `GOOGLE_DRIVE_CREDENTIALS` secret is set in GitHub
- For local testing, check `.env` file has correct JSON

### Error: "Failed to access Drive folder"

**Solution:**
- Verify service account email has "Editor" permission on folder
- Check folder ID is correct: `18lNMWacTTf5_5EIFP_UUTLq3UBU3rfZY`

### Error: "Validation failed"

**Solution:**
- Check the error message in GitHub Actions logs
- Fix the JSON syntax in the Drive file
- Ensure required fields are present (meta, content, etc.)

### No changes detected

**Possible causes:**
1. No files modified in Drive since last sync
2. Metadata not tracking files - run `npm run drive:init` again
3. Check `npm run drive:status` to see tracked files

### PR not created

**Possible causes:**
1. No actual changes after validation
2. GitHub token permission issue
3. Check GitHub Actions logs for errors

---

## Daily Operations

### For Content Editors

1. Open Google Drive folder
2. Edit JSON files
3. Save changes
4. Wait 15 minutes (or ask dev to trigger manual sync)
5. Check email for PR notification (optional setup)
6. Changes go live after PR merge

### For Developers

**Check sync status:**
```bash
npm run drive:status
```

**Manual sync (if needed):**
```bash
npm run drive:sync
```

**Upload local changes to Drive:**
```bash
npm run drive:upload
```

**View sync logs:**
- GitHub → Actions tab → Recent workflow runs

---

## Advanced Configuration

### Change Sync Frequency

Edit `.github/workflows/drive-sync.yml`:
```yaml
schedule:
  - cron: '*/15 * * * *'  # Every 15 minutes
  # Change to:
  - cron: '0 * * * *'     # Every hour
  - cron: '*/5 * * * *'   # Every 5 minutes
```

### Enable Auto-Merge

Edit `scripts/drive-sync/config.js`:
```javascript
sync: {
  autoMergeNonConflicts: true,  // Change from false
  ...
}
```

**Warning:** This skips manual review. Only enable for trusted editors.

### Add Email Notifications

Future enhancement - requires additional GitHub Actions setup.

---

## Security Best Practices

✅ **DO:**
- Keep service account JSON secret
- Use GitHub Secrets for credentials
- Review PRs before merging
- Regularly rotate service account keys (every 90 days)

❌ **DON'T:**
- Commit service account JSON to git
- Share credentials in Slack/email
- Give service account more permissions than needed
- Skip validation step

---

## Uninstall / Rollback

If you need to disable the sync:

1. **Disable GitHub Actions:**
   - Go to Actions → Workflows → Drive Sync
   - Click "..." → "Disable workflow"

2. **Revoke Drive Access:**
   - Go to Drive folder
   - Remove service account from sharing

3. **Remove GitHub Secrets:**
   - Settings → Secrets → Delete secrets

4. **Delete Service Account (optional):**
   - Google Cloud Console → IAM → Service Accounts
   - Delete service account

---

## Next Steps

1. ✅ Complete Part 1-4 of setup
2. ✅ Test sync workflow
3. ✅ Train content editors
4. 📧 Set up notifications (optional)
5. 📊 Monitor first week
6. 🔄 Adjust sync frequency if needed

---

## Support

**Issues:** https://github.com/NachoColl/vaemptiness-website/issues
**Documentation:** See `docs/CONTENT_WORKFLOW_*.md` files
**Logs:** GitHub Actions → Workflow runs

---

**Setup Version:** 1.0
**Last Updated:** 2025-12-23
