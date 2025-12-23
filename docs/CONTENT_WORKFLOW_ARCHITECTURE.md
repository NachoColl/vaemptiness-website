# Content Workflow - Technical Architecture

## System Components

### 1. Google Drive Storage
```
Component: Cloud file storage
Purpose: Content editor workspace
Technology: Google Drive API v3
Authentication: Service Account
```

### 2. Sync Scripts (Node.js)
```
Location: scripts/drive-sync/
Language: Node.js 20+
Dependencies:
  - googleapis (Google Drive API client)
  - @octokit/rest (GitHub API client)
  - fs-extra (File operations)
  - dayjs (Date handling)
```

### 3. GitHub Actions
```
Trigger: Schedule (cron) + Manual + Webhook
Runner: ubuntu-latest
Secrets:
  - GOOGLE_DRIVE_CREDENTIALS
  - GITHUB_TOKEN (auto-provided)
```

### 4. Website Build Pipeline
```
Trigger: PR merge to master
Build: Eleventy static site generator
Deploy: GitHub Pages
```

---

## Data Flow Architecture

### Scenario 1: Drive → GitHub (No Conflicts)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Editor saves home.json in Google Drive                  │
│    Modified: 2025-12-23 10:30:00                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. GitHub Action (15 min later)                             │
│    - Runs detect-changes.js                                 │
│    - Compares Drive modifiedTime vs lastSync                │
│    - Finds: home.json modified in Drive                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Download & Validate                                      │
│    - download-changes.js fetches home.json                  │
│    - validate-json.js checks structure                      │
│    - ✅ Validation passed                                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Check for GitHub conflicts                               │
│    Git hash of src/data/pages/home.json                     │
│    = Last synced hash in sync-state.json                    │
│    ✅ No conflict                                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Apply Changes                                            │
│    - Copy home.json → src/data/pages/home.json              │
│    - Git add src/data/pages/home.json                       │
│    - Git commit "content: update home.json from Drive"      │
│    - Git push origin content-updates                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Create Pull Request                                      │
│    Title: "Content update from Google Drive"                │
│    Files: home.json                                          │
│    Auto-merge: Optional (configurable)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. PR Merged → Build & Deploy                               │
│    - Eleventy builds site                                   │
│    - Deploys to GitHub Pages                                │
│    - Live in ~2 minutes                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. Update Sync State                                        │
│    sync-state.json:                                         │
│      home.json.lastSyncedTime = 2025-12-23 10:45:00         │
│      home.json.githubSha = new commit SHA                   │
│    Upload sync-state.json to Drive                          │
└─────────────────────────────────────────────────────────────┘
```

**Total Time:** ~17-20 minutes (15 min polling + 2-5 min build/deploy)

---

### Scenario 2: Drive → GitHub (With Conflicts)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Parallel modifications:                                  │
│    - Editor modifies home.json in Drive at 10:00            │
│    - Developer commits to GitHub at 10:05                   │
│    - Last sync was at 09:45                                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. GitHub Action detects both changes                       │
│    driveModified: 2025-12-23 10:00:00                       │
│    githubModified: 2025-12-23 10:05:00                      │
│    lastSynced: 2025-12-23 09:45:00                          │
│    ⚠️  CONFLICT DETECTED                                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Conflict Analysis                                        │
│    Time difference: 5 minutes                                │
│    Grace period: 5 minutes                                   │
│    Resolution: Most recent wins (GitHub version)            │
│                                                              │
│    OR (if grace period exceeded):                           │
│    Resolution: MANUAL_REVIEW_REQUIRED                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Create Conflict PR                                       │
│    Branch: content-conflicts-1234                           │
│    Title: "⚠️  Content conflicts require review"             │
│    Body: Detailed conflict info with both versions          │
│    Files:                                                    │
│      - home.json.drive (Drive version)                      │
│      - home.json.github (GitHub version)                    │
│    Labels: [conflict, needs-review]                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Manual Resolution                                        │
│    Developer reviews both versions:                         │
│    - Compares changes line by line                          │
│    - Chooses one version or merges manually                 │
│    - Commits resolution                                     │
│    - Merges PR to master                                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Build, Deploy, Sync Back                                 │
│    - Website rebuilds with resolved version                 │
│    - Uploads resolved version back to Drive                 │
│    - Updates sync-state.json                                │
│    - Notifies both editor and developer                     │
└─────────────────────────────────────────────────────────────┘
```

---

### Scenario 3: GitHub → Drive (Developer Updates)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Developer commits changes to master                      │
│    Modified: src/data/pages/faq.json                        │
│    Commit: "content: update FAQ answers"                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. GitHub Action: On Push to Master                         │
│    Trigger: workflow runs on push                           │
│    Job: sync-to-drive                                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Detect GitHub Changes                                    │
│    Compare current master with sync-state.json              │
│    Found: faq.json modified in GitHub                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Check Drive for conflicts                                │
│    Get Drive file modifiedTime                              │
│    Compare with lastSyncedTime                              │
│    ✅ No Drive modifications since last sync                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Upload to Drive                                          │
│    - Upload faq.json to Drive (overwrites)                  │
│    - Update sync-state.json metadata                        │
│    - Upload sync-state.json                                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Notification                                             │
│    - Editors see updated faq.json in Drive                  │
│    - File shows "Last modified: GitHub Sync Bot"            │
│    - Email notification sent (optional)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Script Specifications

### 1. detect-changes.js

**Input:**
- Google Drive folder ID
- GitHub repository path

**Process:**
1. Load sync-state.json from Drive
2. Query Drive API for files modified since lastSync
3. Query GitHub API for files modified since lastSync
4. Compare modification times
5. Classify each file: DRIVE_ONLY, GITHUB_ONLY, CONFLICT, NO_CHANGE

**Output:**
```json
{
  "timestamp": "2025-12-23T10:45:00Z",
  "changes": {
    "pages/home.json": {
      "status": "DRIVE_ONLY",
      "driveModified": "2025-12-23T10:30:00Z",
      "githubModified": "2025-12-22T15:00:00Z",
      "lastSynced": "2025-12-22T15:00:00Z"
    },
    "pages/contacto.json": {
      "status": "CONFLICT",
      "driveModified": "2025-12-23T10:00:00Z",
      "githubModified": "2025-12-23T10:05:00Z",
      "lastSynced": "2025-12-23T09:45:00Z",
      "resolution": "MANUAL_REVIEW"
    }
  },
  "summary": {
    "total": 2,
    "driveOnly": 1,
    "githubOnly": 0,
    "conflicts": 1,
    "noChange": 6
  }
}
```

---

### 2. download-changes.js

**Input:**
- Change detection results
- Output directory

**Process:**
1. For each file with DRIVE_ONLY or CONFLICT status
2. Download file from Drive using file ID
3. Save to temporary directory
4. Preserve Drive metadata (modifiedTime, etc.)

**Output:**
```
temp/
├── pages/
│   ├── home.json
│   ├── home.json.meta (Drive metadata)
│   ├── contacto.json
│   └── contacto.json.meta
└── download-results.json
```

---

### 3. validate-json.js

**Input:**
- Directory of JSON files to validate

**Process:**
1. For each .json file
2. Parse JSON (syntax check)
3. Validate structure against schema
4. Check required fields
5. Run content safety checks (no scripts, etc.)
6. Check file size limits

**Output:**
```json
{
  "valid": true,
  "files": {
    "pages/home.json": {
      "valid": true,
      "warnings": []
    },
    "pages/contacto.json": {
      "valid": false,
      "errors": [
        "Missing required field: meta.seo.title"
      ]
    }
  }
}
```

**Exit Code:**
- 0 if all valid
- 1 if any invalid

---

### 4. apply-changes.js

**Input:**
- Validated downloaded files
- Change detection results

**Process:**
```javascript
for (const file of changedFiles) {
  if (file.status === 'CONFLICT') {
    // Create conflict resolution branch
    await createConflictBranch(file);
    await createConflictPR(file);
  } else if (file.status === 'DRIVE_ONLY') {
    // Apply Drive version
    await copyFile(file, 'src/data/pages/');
    await gitAdd(file);
  }
}

// Commit all non-conflict changes
await gitCommit('content: update from Google Drive');
await gitPush('origin', 'content-updates');
```

**Output:**
- Git commits on content-updates branch
- Pull requests created
- Output JSON with results

---

### 5. upload-to-drive.js

**Input:**
- GitHub commit SHA (optional, defaults to latest master)

**Process:**
1. Compare files in GitHub master vs Drive
2. For files newer in GitHub:
   - Upload to Drive (overwrites)
   - Update file modifiedTime metadata
3. Update sync-state.json
4. Upload sync-state.json

**Output:**
- Updated files in Drive
- Upload results JSON

---

## Sync State Metadata Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "version": {
      "type": "string",
      "description": "Metadata format version"
    },
    "lastSync": {
      "type": "string",
      "format": "date-time",
      "description": "Timestamp of last successful sync"
    },
    "repository": {
      "type": "object",
      "properties": {
        "owner": { "type": "string" },
        "repo": { "type": "string" },
        "branch": { "type": "string", "default": "master" }
      }
    },
    "drive": {
      "type": "object",
      "properties": {
        "folderId": { "type": "string" },
        "folderUrl": { "type": "string" }
      }
    },
    "files": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "driveId": {
            "type": "string",
            "description": "Google Drive file ID"
          },
          "driveModifiedTime": {
            "type": "string",
            "format": "date-time"
          },
          "githubPath": {
            "type": "string",
            "description": "Path in repository"
          },
          "githubSha": {
            "type": "string",
            "description": "Git commit SHA of file"
          },
          "githubModifiedTime": {
            "type": "string",
            "format": "date-time"
          },
          "lastSyncedTime": {
            "type": "string",
            "format": "date-time"
          },
          "syncDirection": {
            "type": "string",
            "enum": ["drive-to-github", "github-to-drive", "both"],
            "description": "Direction of last sync"
          }
        },
        "required": ["driveId", "githubPath", "lastSyncedTime"]
      }
    },
    "syncHistory": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "timestamp": { "type": "string", "format": "date-time" },
          "direction": { "type": "string" },
          "filesChanged": { "type": "array", "items": { "type": "string" } },
          "conflicts": { "type": "number" },
          "status": { "type": "string", "enum": ["success", "partial", "failed"] }
        }
      },
      "maxItems": 100,
      "description": "Last 100 sync operations"
    }
  },
  "required": ["version", "lastSync", "files"]
}
```

---

## GitHub Actions Job Matrix

```yaml
jobs:
  # Job 1: Scheduled sync from Drive
  sync-from-drive:
    runs-on: ubuntu-latest
    if: github.event_name == 'schedule'
    outputs:
      has-changes: ${{ steps.detect.outputs.has-changes }}
      has-conflicts: ${{ steps.apply.outputs.has-conflicts }}

  # Job 2: Sync to Drive on master push
  sync-to-drive:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/master'

  # Job 3: Validation (runs on all PRs)
  validate-content:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    steps:
      - run: npm run validate-json
      - run: npm run build  # Ensure site builds

  # Job 4: Deploy (runs on master merge)
  deploy:
    runs-on: ubuntu-latest
    needs: sync-to-drive
    if: github.ref == 'refs/heads/master'
    steps:
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
```

---

## Error Handling Strategy

### 1. Google Drive API Errors

```javascript
async function downloadFile(fileId) {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      return await drive.files.get({ fileId, alt: 'media' });
    } catch (error) {
      if (error.code === 429) {
        // Rate limit - exponential backoff
        await sleep(Math.pow(2, retries) * 1000);
        retries++;
      } else if (error.code === 404) {
        // File not found - log and skip
        console.error(`File ${fileId} not found in Drive`);
        return null;
      } else {
        // Other errors - fail fast
        throw error;
      }
    }
  }

  throw new Error(`Failed to download file after ${maxRetries} retries`);
}
```

### 2. Validation Failures

```javascript
if (!validationResult.valid) {
  // Create issue in GitHub
  await createIssue({
    title: `Content validation failed for ${file}`,
    body: validationResult.errors.join('\n'),
    labels: ['validation-error', 'content']
  });

  // Notify editor via email
  await sendEmail({
    to: 'editor@vaemptiness.es',
    subject: 'Content validation failed',
    body: `File ${file} has validation errors...`
  });

  // Do not apply changes
  return { status: 'failed', reason: 'validation' };
}
```

### 3. Build Failures

```javascript
// In apply-changes.js
await gitCommit('content: update from Drive');
const buildResult = await runBuild();

if (!buildResult.success) {
  // Revert commit
  await gitReset('HEAD~1');

  // Create issue
  await createIssue({
    title: 'Build failed after Drive sync',
    body: buildResult.error,
    labels: ['build-failure', 'content']
  });

  // Rollback sync state
  await revertSyncState();

  return { status: 'reverted', reason: 'build-failure' };
}
```

---

## Performance Considerations

### 1. API Rate Limits

**Google Drive API:**
- Queries per day: 1,000,000,000
- Queries per 100 seconds per user: 1,000
- Queries per 100 seconds: 10,000

**Our usage:**
- 96 syncs per day (every 15 min)
- ~10 API calls per sync
- **Total: ~960 calls/day** (well within limits)

### 2. Caching Strategy

```javascript
// Cache Drive file list for 5 minutes
const fileListCache = new Map();

async function listDriveFiles(folderId) {
  const cacheKey = `folder-${folderId}`;
  const cached = fileListCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
    return cached.files;
  }

  const files = await drive.files.list({ q: `'${folderId}' in parents` });
  fileListCache.set(cacheKey, { files, timestamp: Date.now() });

  return files;
}
```

### 3. Parallel Processing

```javascript
// Download multiple files in parallel
const downloads = changedFiles.map(file =>
  downloadFile(file.driveId).catch(err => ({
    file,
    error: err
  }))
);

const results = await Promise.all(downloads);
```

---

## Security Architecture

### 1. Service Account Permissions

```json
{
  "type": "service_account",
  "project_id": "vaemptiness-website",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "content-sync@vaemptiness-website.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

**Permissions in Drive:**
- Read/write access to specific folder only
- No access to other Drive files
- Cannot delete folder (only files within)

### 2. GitHub Secrets

```yaml
# Repository secrets (encrypted)
GOOGLE_DRIVE_CREDENTIALS: <service-account-json>
GOOGLE_DRIVE_FOLDER_ID: 18lNMWacTTf5_5EIFP_UUTLq3UBU3rfZY

# Built-in secrets (auto-provided)
GITHUB_TOKEN: <auto-generated>
```

### 3. Content Security

```javascript
// XSS prevention
function sanitizeContent(obj) {
  const dangerous = /<script|javascript:|on\w+=/gi;

  function sanitize(value) {
    if (typeof value === 'string') {
      if (dangerous.test(value)) {
        throw new Error(`Dangerous content detected: ${value}`);
      }
      return value;
    } else if (Array.isArray(value)) {
      return value.map(sanitize);
    } else if (typeof value === 'object' && value !== null) {
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, sanitize(v)])
      );
    }
    return value;
  }

  return sanitize(obj);
}
```

---

## Monitoring & Observability

### 1. Logging

```javascript
// Structured logging
const logger = {
  info: (msg, meta) => console.log(JSON.stringify({ level: 'info', msg, ...meta })),
  error: (msg, meta) => console.error(JSON.stringify({ level: 'error', msg, ...meta })),
  warn: (msg, meta) => console.warn(JSON.stringify({ level: 'warn', msg, ...meta }))
};

// Usage
logger.info('Sync completed', {
  filesChanged: 3,
  duration: 1234,
  direction: 'drive-to-github'
});
```

### 2. Metrics to Track

- Sync frequency (actual vs expected)
- Success rate
- Conflict rate
- Validation failure rate
- Average time from edit to deploy
- API error rate
- Build failure rate

### 3. Alerts

```yaml
# Future: GitHub Actions monitoring
alerts:
  - name: High conflict rate
    condition: conflicts > 10% of syncs
    action: Email dev team

  - name: Sync failures
    condition: 3 consecutive failures
    action: Page on-call

  - name: Validation failures
    condition: Any validation failure
    action: Email editor + dev team
```

---

## Testing Strategy

### 1. Unit Tests

```javascript
// test/drive-sync/detect-changes.test.js
describe('detectChanges', () => {
  it('should detect Drive-only changes', async () => {
    const result = await detectChanges({
      driveModified: new Date('2025-12-23T10:30:00Z'),
      githubModified: new Date('2025-12-23T09:00:00Z'),
      lastSynced: new Date('2025-12-23T09:00:00Z')
    });

    expect(result.status).toBe('DRIVE_ONLY');
  });

  it('should detect conflicts', async () => {
    const result = await detectChanges({
      driveModified: new Date('2025-12-23T10:30:00Z'),
      githubModified: new Date('2025-12-23T10:25:00Z'),
      lastSynced: new Date('2025-12-23T09:00:00Z')
    });

    expect(result.status).toBe('CONFLICT');
  });
});
```

### 2. Integration Tests

```javascript
// test/drive-sync/integration.test.js
describe('Full sync flow', () => {
  it('should sync Drive changes to GitHub', async () => {
    // 1. Modify file in test Drive folder
    await uploadTestFile('pages/home.json', modifiedContent);

    // 2. Run sync
    await runSync();

    // 3. Verify PR created
    const prs = await getPullRequests();
    expect(prs).toContainEqual(expect.objectContaining({
      title: 'Content update from Google Drive'
    }));

    // 4. Verify file content
    const content = await getFileContent('src/data/pages/home.json', 'content-updates');
    expect(content).toEqual(modifiedContent);
  });
});
```

### 3. E2E Tests

```javascript
// test/e2e/content-workflow.test.js
describe('Content workflow E2E', () => {
  it('should complete full workflow', async () => {
    // 1. Edit in Drive
    await driveClient.updateFile('home.json', newContent);

    // 2. Wait for sync (or trigger manually)
    await waitForSync();

    // 3. Verify PR created
    const pr = await findPR('Content update');
    expect(pr).toBeDefined();

    // 4. Merge PR
    await mergePR(pr.number);

    // 5. Wait for deployment
    await waitForDeployment();

    // 6. Verify live site
    const response = await fetch('https://vaemptiness.es');
    const html = await response.text();
    expect(html).toContain(newContent.title);

    // 7. Verify Drive synced back
    const driveFile = await driveClient.getFile('home.json');
    expect(driveFile.metadata.lastSyncedFrom).toBe('github');
  });
});
```

---

## Deployment Checklist

- [ ] Google Cloud project created
- [ ] Service account configured
- [ ] Drive folder permissions set
- [ ] GitHub secrets added
- [ ] Scripts implemented and tested
- [ ] GitHub Actions workflow created
- [ ] Validation rules configured
- [ ] Initial upload completed
- [ ] Monitoring set up
- [ ] Documentation complete
- [ ] Editor training scheduled
- [ ] Rollback procedure tested

---

**Last Updated:** 2025-12-23
**Document Version:** 1.0
**Status:** Architecture Design Complete
