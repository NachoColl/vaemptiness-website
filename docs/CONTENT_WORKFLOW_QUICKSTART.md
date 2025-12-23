# Content Workflow - Quick Reference

## TL;DR

**Goal:** Content editors modify JSON files in Google Drive → Changes sync to GitHub → Website rebuilds automatically

**Strategy:** GitHub is source of truth. Drive changes create PRs for review.

---

## How It Works

### For Content Editors

1. **Edit JSON files** in Google Drive folder
2. **Save changes** (no special action needed)
3. **Wait 15 minutes** for automatic sync
4. **Receive email** confirmation when changes are live

**Important:** Only edit the `meta` and `content` sections of JSON files. Don't modify the `_instructions` section.

---

## Sync Flow

```
Editor saves in Drive
        ↓
   (15 min wait)
        ↓
GitHub Action detects change
        ↓
Downloads & validates JSON
        ↓
┌─────────────────────────┐
│   No conflicts?         │
├─────────────┬───────────┤
│    YES      │    NO     │
↓             ↓
Auto PR       Manual PR
↓             ↓
Review        Review conflicts
↓             ↓
Merge         Choose version
↓             ↓
Build site    Merge
↓             ↓
Deploy        Build & deploy
↓             ↓
Sync back     Sync back
to Drive      to Drive
```

---

## Conflict Resolution

### What is a conflict?
When the same JSON file is modified in **both** GitHub and Google Drive between syncs.

### How conflicts are handled:

1. **Recent changes (< 5 min apart):** Most recent version wins automatically
2. **Older conflicts:** Manual review required via GitHub PR

### For developers:
```bash
# Check for conflicts
git fetch origin content-conflicts-*

# Resolve manually
git checkout content-conflicts-123
# Review changes, choose version
git commit
git push
```

---

## File Structure in Drive

```
vaemptiness-content/
├── pages/
│   ├── home.json                      ← Homepage
│   ├── sobre-nosotros.json            ← About page
│   ├── contacto.json                  ← Contact page
│   ├── faq.json                       ← FAQ page
│   ├── aprendizaje-y-metodologia.json ← Learning page
│   ├── reset.json                     ← Reset page
│   ├── politica-privacidad.json       ← Privacy policy
│   └── terminos-condiciones.json      ← Terms
├── programs/
│   ├── vaemptiness-program.json       ← Adult program
│   ├── vaemptiness-equipos.json       ← Teams program
│   ├── vaemptiness-teen.json          ← Teen program
│   └── vaemptiness-kids.json          ← Kids program
└── blog/
    └── filosofia-budista-vaemptiness.json
```

---

## JSON File Template

```json
{
  "_instructions": {
    "DO_NOT_EDIT_THIS_SECTION": true,
    "editingGuidelines": "Edit only 'meta' and 'content' sections below"
  },
  "meta": {
    "slug": "page-name",
    "permalink": "/page-name/",
    "bodyClass": "page-class",
    "seo": {
      "title": "Page Title | vaemptîness",
      "description": "SEO description",
      "keywords": "keyword1, keyword2"
    }
  },
  "content": {
    "hero": {
      "title": "Page heading",
      "subtitle": "Subheading text"
    }
  }
}
```

---

## Common Tasks

### Update homepage hero text
**File:** `pages/home.json`
```json
{
  "content": {
    "hero": {
      "title": "vaemptîness",
      "tagline": "brain training",  ← Edit this
      "subtitle": "Your new subtitle here"  ← Edit this
    }
  }
}
```

### Update program description
**File:** `programs/vaemptiness-program.json`
```json
{
  "content": {
    "hero": {
      "title": "vaemptîness program",  ← Edit this
      "description": "New description"  ← Edit this
    }
  }
}
```

### Update contact form
**File:** `pages/contacto.json`
```json
{
  "content": {
    "form": {
      "topics": [
        "Programa adultos",  ← Add/edit topics
        "Equipos",
        "Teen",
        "Kids"
      ]
    }
  }
}
```

---

## Validation Rules

✅ **Allowed:**
- Text content changes
- Adding/removing list items
- Changing URLs
- Updating images paths

❌ **Not Allowed:**
- Invalid JSON syntax
- Removing required fields
- Adding `<script>` tags
- Modifying `_instructions` section

---

## Troubleshooting

### My changes aren't showing up
- Wait full 15 minutes for sync
- Check email for error notifications
- Verify JSON syntax is valid
- Contact dev team if issue persists

### I made a mistake
- Edit the file again with correct content
- Save and wait for next sync
- Or contact dev team for immediate rollback

### Validation error
- Check JSON syntax (brackets, quotes, commas)
- Use a JSON validator: https://jsonlint.com/
- Ensure required fields are present
- Contact dev team for help

---

## Sync Schedule

- **Frequency:** Every 15 minutes
- **Hours:** 24/7
- **Delay:** 15-30 minutes from save to live
- **Notifications:** Email on success/failure

---

## Support

**For content questions:**
- Rosa Cano: program@vaemptiness.es

**For technical issues:**
- Dev team: [GitHub Issues](https://github.com/NachoColl/vaemptiness-website/issues)

---

## Safety Features

- ✅ All changes tracked in git history
- ✅ Automatic validation before deployment
- ✅ Rollback available if needed
- ✅ Preview environment before production
- ✅ Email notifications on every sync

---

## Implementation Status

| Phase | Status | Notes |
|-------|--------|-------|
| Planning | ✅ Complete | This document |
| Google Drive Setup | ⏳ Pending | Week 1 |
| Initial Upload | ⏳ Pending | Week 1 |
| Sync Scripts | ⏳ Pending | Week 2-3 |
| GitHub Actions | ⏳ Pending | Week 3 |
| Testing | ⏳ Pending | Week 5 |
| Production | ⏳ Pending | Week 6 |

---

## Quick Commands (For Developers)

```bash
# Initial upload to Drive
npm run drive:init

# Manual sync from Drive
npm run drive:sync

# Validate all JSON files
npm run validate-json

# Upload GitHub changes to Drive
npm run drive:upload

# Check sync status
npm run drive:status
```

---

**Last Updated:** 2025-12-23
**Version:** 1.0
