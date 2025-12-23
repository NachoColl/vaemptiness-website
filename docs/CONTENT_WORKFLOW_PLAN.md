# Content Editing Workflow Plan
## Google Drive ↔ GitHub Synchronization

**Document Version:** 1.0
**Date:** 2025-12-23
**Status:** Planning Phase

---

## Overview

Enable content editors to modify website content through Google Drive JSON files, with automatic synchronization to GitHub and website deployment.

**Google Drive Folder:** https://drive.google.com/drive/folders/18lNMWacTTf5_5EIFP_UUTLq3UBU3rfZY?usp=sharing

---

## Critical Challenge: Two-Source Modification Problem

### The Problem
JSON files can be modified in **TWO** places:
1. **GitHub** - By developers via git commits
2. **Google Drive** - By content editors via Drive interface

This creates potential conflicts that must be resolved safely.

---

## Proposed Architecture

### Strategy: **GitHub as Source of Truth with Drive Editing Branch**

**Core Principle:** Google Drive changes are treated as external contributions that go through a review/merge process before reaching production.

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    INITIAL SETUP (One-time)                     │
│                                                                 │
│  GitHub (master) → Script → Google Drive                       │
│                                                                 │
│  - Copy all src/data/pages/*.json to Drive                     │
│  - Create metadata tracking file                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   ONGOING WORKFLOW (Continuous)                 │
│                                                                 │
│  1. Editor modifies JSON in Drive                               │
│  2. GitHub Action detects changes (polling or webhook)          │
│  3. Script downloads modified files from Drive                  │
│  4. Compare with current master branch                          │
│  5a. No conflicts → Commit to content-updates branch            │
│  5b. Conflicts detected → Create manual review PR               │
│  6. Auto-merge if validation passes (optional)                  │
│  7. Trigger build and deploy                                    │
│  8. Sync successful changes back to Drive                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Detailed Implementation Plan

### Phase 1: Initial Setup & Infrastructure

#### 1.1 Google Drive API Setup
- [ ] Create Google Cloud Project
- [ ] Enable Google Drive API
- [ ] Create Service Account with credentials
- [ ] Grant Service Account access to shared Drive folder
- [ ] Store credentials securely (GitHub Secrets)

#### 1.2 Drive Folder Structure
```
/vaemptiness-content/
  ├── pages/
  │   ├── home.json
  │   ├── sobre-nosotros.json
  │   ├── contacto.json
  │   ├── faq.json
  │   ├── aprendizaje-y-metodologia.json
  │   ├── reset.json
  │   ├── politica-privacidad.json
  │   └── terminos-condiciones.json
  ├── programs/
  │   ├── vaemptiness-program.json
  │   ├── vaemptiness-equipos.json
  │   ├── vaemptiness-teen.json
  │   └── vaemptiness-kids.json
  ├── blog/
  │   └── filosofia-budista-vaemptiness.json
  └── .metadata/
      └── sync-state.json
```

#### 1.3 Metadata Tracking File
**Purpose:** Track synchronization state to detect conflicts

```json
{
  "lastSync": "2025-12-23T10:30:00Z",
  "files": {
    "pages/home.json": {
      "driveId": "1ABC...",
      "driveModifiedTime": "2025-12-23T10:30:00Z",
      "githubSha": "abc123...",
      "githubModifiedTime": "2025-12-23T10:30:00Z",
      "lastSyncedTime": "2025-12-23T10:30:00Z"
    }
  }
}
```

---

### Phase 2: Synchronization Scripts

#### 2.1 Script: `scripts/drive-sync/initial-upload.js`
**Purpose:** One-time upload of all JSON files to Drive

```javascript
/**
 * Initial setup script
 * - Reads all files from src/data/pages/
 * - Uploads to Google Drive folder structure
 * - Creates metadata tracking file
 * - Stores Drive file IDs for future sync
 */
```

**Tasks:**
- Authenticate with Google Drive API
- Create folder structure in Drive
- Upload all JSON files
- Generate initial sync-state.json
- Upload sync-state.json to Drive

#### 2.2 Script: `scripts/drive-sync/detect-changes.js`
**Purpose:** Detect which files have changed in Drive

```javascript
/**
 * Change detection
 * - Download current sync-state.json from Drive
 * - Query Drive API for modified files (modifiedTime > lastSync)
 * - Compare with GitHub master branch
 * - Return list of changed files with conflict status
 */
```

**Output:**
```json
{
  "changedInDrive": ["pages/home.json", "pages/contacto.json"],
  "changedInGithub": ["pages/home.json"],
  "conflicts": ["pages/home.json"],
  "driveOnly": ["pages/contacto.json"]
}
```

#### 2.3 Script: `scripts/drive-sync/download-changes.js`
**Purpose:** Download modified files from Drive

```javascript
/**
 * Download modified content
 * - Download specified files from Drive
 * - Validate JSON structure
 * - Save to temporary directory
 */
```

#### 2.4 Script: `scripts/drive-sync/apply-changes.js`
**Purpose:** Apply Drive changes to git repository

```javascript
/**
 * Apply changes to repository
 *
 * For non-conflicting files:
 * 1. Copy files to src/data/pages/
 * 2. Run validation (npm run validate-json)
 * 3. Git add and commit
 * 4. Push to content-updates branch
 *
 * For conflicting files:
 * 1. Create conflict resolution branch
 * 2. Add both versions (Drive version + original)
 * 3. Add conflict markers in commit message
 * 4. Create PR with detailed conflict info
 */
```

#### 2.5 Script: `scripts/drive-sync/upload-to-drive.js`
**Purpose:** Sync GitHub changes back to Drive

```javascript
/**
 * Upload GitHub changes to Drive
 * - Compare GitHub master with Drive files
 * - Upload newer GitHub files to Drive
 * - Update sync-state.json metadata
 */
```

---

### Phase 3: Conflict Resolution Strategy

#### 3.1 Conflict Detection Logic

```javascript
function detectConflict(file) {
  const driveModified = getFileModifiedTime(drive, file);
  const githubModified = getFileModifiedTime(github, file);
  const lastSynced = getSyncState(file).lastSyncedTime;

  const driveChanged = driveModified > lastSynced;
  const githubChanged = githubModified > lastSynced;

  return {
    isConflict: driveChanged && githubChanged,
    driveChanged,
    githubChanged,
    resolution: driveChanged && githubChanged
      ? 'MANUAL_REVIEW_REQUIRED'
      : driveChanged
        ? 'USE_DRIVE_VERSION'
        : 'USE_GITHUB_VERSION'
  };
}
```

#### 3.2 Conflict Resolution Options

**Option A: Timestamp-Based (Automated)**
- Most recent modification wins
- Risk: May lose changes if timing is close
- Best for: Low-conflict scenarios

**Option B: Manual Review (Safe)**
- All conflicts create PR for human review
- Slowest but safest
- Best for: Critical content

**Option C: Hybrid (Recommended)**
- Drive changes within last 5 minutes → Auto-merge
- Older Drive changes conflicting with GitHub → Manual review
- Configurable grace period

```javascript
const CONFLICT_GRACE_PERIOD = 5 * 60 * 1000; // 5 minutes

function resolveConflict(file, driveModified, githubModified) {
  const timeDiff = Math.abs(driveModified - githubModified);

  if (timeDiff < CONFLICT_GRACE_PERIOD) {
    // Recent changes - use most recent
    return driveModified > githubModified ? 'DRIVE' : 'GITHUB';
  } else {
    // Significant time difference - manual review
    return 'MANUAL_REVIEW';
  }
}
```

---

### Phase 4: GitHub Actions Workflow

#### 4.1 Workflow: `.github/workflows/drive-sync.yml`

```yaml
name: Google Drive Content Sync

on:
  # Option A: Scheduled polling (every 15 minutes)
  schedule:
    - cron: '*/15 * * * *'

  # Option B: Manual trigger
  workflow_dispatch:

  # Option C: Webhook from Google Drive (requires additional setup)
  repository_dispatch:
    types: [drive-content-changed]

jobs:
  sync-from-drive:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history for conflict detection

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Detect Drive changes
        env:
          GOOGLE_DRIVE_CREDENTIALS: ${{ secrets.GOOGLE_DRIVE_CREDENTIALS }}
        run: node scripts/drive-sync/detect-changes.js

      - name: Download modified files
        if: steps.detect.outputs.has_changes == 'true'
        run: node scripts/drive-sync/download-changes.js

      - name: Validate JSON structure
        run: npm run validate-json

      - name: Apply changes
        run: node scripts/drive-sync/apply-changes.js

      - name: Create/Update PR
        if: steps.apply.outputs.has_conflicts == 'false'
        uses: peter-evans/create-pull-request@v5
        with:
          branch: content-updates
          title: 'Content update from Google Drive'
          body: |
            ## Automated Content Sync

            Files modified in Google Drive:
            ${{ steps.apply.outputs.modified_files }}

            Last sync: ${{ steps.detect.outputs.last_sync }}

            ✅ No conflicts detected
            ✅ JSON validation passed
          commit-message: |
            content: update from Google Drive

            Modified files:
            ${{ steps.apply.outputs.modified_files }}

      - name: Create Conflict PR
        if: steps.apply.outputs.has_conflicts == 'true'
        uses: peter-evans/create-pull-request@v5
        with:
          branch: content-conflicts-${{ github.run_number }}
          title: '⚠️ Content conflicts require review'
          body: |
            ## ⚠️ Manual Review Required

            Conflicts detected between GitHub and Google Drive:

            ${{ steps.apply.outputs.conflict_details }}

            ### Resolution Options:
            1. Review changes in both sources
            2. Choose which version to keep
            3. Manually merge if needed

            ### Conflicting Files:
            ${{ steps.apply.outputs.conflict_files }}
          labels: ['content-conflict', 'needs-review']

  sync-to-drive:
    runs-on: ubuntu-latest
    # Run when master branch is updated
    if: github.ref == 'refs/heads/master'
    steps:
      - uses: actions/checkout@v4

      - name: Upload changes to Drive
        env:
          GOOGLE_DRIVE_CREDENTIALS: ${{ secrets.GOOGLE_DRIVE_CREDENTIALS }}
        run: node scripts/drive-sync/upload-to-drive.js
```

---

### Phase 5: Validation & Safety

#### 5.1 JSON Validation Script: `scripts/validate-json.js`

```javascript
/**
 * Validate JSON files before applying changes
 *
 * Checks:
 * - Valid JSON syntax
 * - Required structure (meta, content)
 * - Required fields (slug, seo, title)
 * - No duplicate content in arrays
 * - Character encoding (UTF-8)
 * - File size limits
 */
```

#### 5.2 Validation Rules

```javascript
const validationRules = {
  // Structure validation
  pages: {
    required: ['meta', 'content'],
    meta: {
      required: ['slug', 'permalink', 'seo', 'bodyClass']
    },
    content: {
      // Page-specific content rules
    }
  },

  // Content validation
  maxFileSize: 1024 * 1024, // 1MB
  encoding: 'utf-8',

  // Safety checks
  disallowedPatterns: [
    /<script/gi,  // No script tags
    /javascript:/gi,  // No javascript: URLs
    /on\w+=/gi,  // No inline event handlers
  ]
};
```

#### 5.3 Rollback Strategy

```javascript
/**
 * If build fails after applying Drive changes:
 *
 * 1. Revert the content-updates branch
 * 2. Create issue with failure details
 * 3. Notify content editors
 * 4. Mark files in Drive with error marker
 */
```

---

### Phase 6: Editor Experience

#### 6.1 Google Drive File Headers

Add instructions to each JSON file:

```json
{
  "_instructions": {
    "DO_NOT_EDIT_THIS_SECTION": true,
    "lastSyncedFrom": "github",
    "lastSyncTime": "2025-12-23T10:30:00Z",
    "fileVersion": "1.0",
    "editingGuidelines": "Edit only the 'meta' and 'content' sections. Save changes and they will sync to the website within 15 minutes.",
    "validation": "This file is automatically validated. Invalid JSON will be rejected.",
    "support": "For help, contact: dev-team@vaemptiness.es"
  },
  "meta": {
    ...
  },
  "content": {
    ...
  }
}
```

#### 6.2 Change Notification

When Drive changes are applied:
- Send email to editors confirming sync
- Include link to deployment
- Show preview URL before production

---

### Phase 7: Monitoring & Logging

#### 7.1 Sync Logs

```javascript
// Store in .metadata/sync-log.json in Drive
{
  "syncs": [
    {
      "timestamp": "2025-12-23T10:30:00Z",
      "direction": "drive-to-github",
      "filesChanged": ["pages/home.json"],
      "status": "success",
      "commitSha": "abc123",
      "deploymentUrl": "https://vaemptiness.es"
    }
  ]
}
```

#### 7.2 Monitoring Dashboard (Future)

Track:
- Sync frequency
- Conflict rate
- Failed validations
- Average time from edit to deploy

---

## Implementation Timeline

### Week 1: Foundation
- [ ] Set up Google Drive API credentials
- [ ] Create initial folder structure in Drive
- [ ] Implement `initial-upload.js` script
- [ ] Upload all current JSON files

### Week 2: Core Sync Logic
- [ ] Implement `detect-changes.js`
- [ ] Implement `download-changes.js`
- [ ] Implement validation script
- [ ] Test conflict detection logic

### Week 3: GitHub Integration
- [ ] Create `apply-changes.js` script
- [ ] Set up GitHub Actions workflow
- [ ] Test automated PR creation
- [ ] Implement rollback mechanism

### Week 4: Bidirectional Sync
- [ ] Implement `upload-to-drive.js`
- [ ] Test GitHub → Drive sync
- [ ] Handle edge cases
- [ ] Documentation

### Week 5: Testing & Refinement
- [ ] End-to-end testing
- [ ] Conflict resolution testing
- [ ] Performance optimization
- [ ] Security audit

### Week 6: Deployment
- [ ] Production deployment
- [ ] Editor training
- [ ] Monitor first week
- [ ] Gather feedback

---

## Security Considerations

### 7.1 Access Control
- Service account has read/write only to specific folder
- GitHub Actions secrets encrypted
- No credentials in code repository
- Audit log of all changes

### 7.2 Content Safety
- JSON validation before apply
- No executable code allowed
- Character encoding validation
- File size limits
- Rate limiting on sync frequency

### 7.3 Disaster Recovery
- All changes tracked in git history
- Drive files backed up (Drive's built-in versioning)
- Manual rollback procedure documented
- Testing environment mirrors production

---

## Alternative Approaches Considered

### Alternative 1: Google Sheets Instead of JSON
**Pros:**
- Better UI for non-technical editors
- Cell-level editing
- Built-in validation

**Cons:**
- More complex transformation (Sheet → JSON)
- Harder to maintain structure
- Version control difficult

**Decision:** Stick with JSON for now, consider Sheets for future iteration

### Alternative 2: CMS Integration (Netlify CMS, Sanity, etc.)
**Pros:**
- Purpose-built for content editing
- Better UX
- Built-in preview

**Cons:**
- Additional infrastructure
- Migration required
- Learning curve

**Decision:** Current Google Drive approach is simpler, can migrate later if needed

### Alternative 3: Direct GitHub Web Interface Editing
**Pros:**
- No sync needed
- Single source of truth
- Built-in version control

**Cons:**
- Requires GitHub accounts
- Git knowledge needed
- Less familiar UI for editors

**Decision:** Google Drive is more accessible for content editors

---

## Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Sync conflicts | High | Medium | Hybrid conflict resolution with manual review |
| Invalid JSON breaks build | Medium | High | Validation before commit + rollback |
| API rate limits | Low | Medium | Polling frequency limits, caching |
| Credential leak | Low | Critical | GitHub Secrets, service account with minimal permissions |
| Data loss | Low | Critical | Git history + Drive versioning |
| Editor mistakes | Medium | Medium | Preview environment, easy rollback |

---

## Open Questions

1. **Sync Frequency:** 15 minutes polling vs real-time webhook?
   - **Recommendation:** Start with 15-min polling, add webhook later if needed

2. **Auto-merge policy:** Should non-conflicting changes auto-merge to master?
   - **Recommendation:** Auto-create PR, require manual approval initially

3. **Editor permissions:** Who can edit which files?
   - **Recommendation:** Use Drive folder permissions, all editors can edit all files

4. **Preview environment:** Should there be a staging site for preview?
   - **Recommendation:** Yes, deploy content-updates branch to staging URL

5. **Notification system:** How to notify editors of sync status?
   - **Recommendation:** Email notifications via GitHub Actions

---

## Success Metrics

- Time from content edit to deployment: < 30 minutes
- Conflict rate: < 5% of syncs
- Failed validation rate: < 2%
- Editor satisfaction: > 8/10
- Zero data loss incidents

---

## Next Steps

1. **Decision:** Approve this plan or request modifications
2. **Setup:** Create Google Cloud project and credentials
3. **Prototype:** Build Phase 1 (initial upload) as proof of concept
4. **Review:** Test with small subset of files
5. **Iterate:** Refine based on feedback
6. **Deploy:** Full rollout with monitoring

---

## Documentation Links

- [Google Drive API Documentation](https://developers.google.com/drive/api/v3/about-sdk)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Eleventy Data Files](https://www.11ty.dev/docs/data/)
