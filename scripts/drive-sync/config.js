/**
 * Configuration for Google Drive content sync
 */

require('dotenv').config();

module.exports = {
  // Google Drive configuration
  drive: {
    // Main folder ID (from URL: https://drive.google.com/drive/folders/{FOLDER_ID})
    folderId: process.env.GOOGLE_DRIVE_FOLDER_ID || '18lNMWacTTf5_5EIFP_UUTLq3UBU3rfZY',

    // Credentials (OAuth2 tokens or service account JSON)
    credentials: process.env.GOOGLE_DRIVE_CREDENTIALS
      ? JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS)
      : null,

    // OAuth2 client credentials (for authorization)
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,

    // Folder structure in Drive (mirrors src/data structure)
    structure: {
      pages: 'pages',
      programs: 'programs',
      blog: 'blog',
      metadata: '.metadata'
    }
  },

  // GitHub configuration
  github: {
    owner: process.env.GITHUB_REPOSITORY_OWNER || 'NachoColl',
    repo: process.env.GITHUB_REPOSITORY_NAME || 'vaemptiness-website',
    branch: process.env.GITHUB_BRANCH || 'master',
    token: process.env.GITHUB_TOKEN,

    // Branch names
    branches: {
      contentUpdates: 'content-updates',
      conflictPrefix: 'content-conflicts-'
    }
  },

  // Local paths
  paths: {
    data: 'src/data',
    pages: 'src/data/pages',
    temp: '.drive-sync-temp',
    metadata: '.drive-sync-temp/.metadata'
  },

  // Sync configuration
  sync: {
    // Conflict resolution grace period (milliseconds)
    // Changes within this window are considered simultaneous
    conflictGracePeriod: 5 * 60 * 1000, // 5 minutes

    // Auto-merge non-conflicting changes
    autoMergeNonConflicts: false, // Start conservative, can enable later

    // Files that always require manual review
    requireReview: [
      'pages/home.json',
      'programs/vaemptiness-program.json'
    ],

    // Files that can auto-merge (if autoMergeNonConflicts enabled)
    autoApprove: [
      'pages/faq.json',
      'blog/*.json'
    ]
  },

  // Validation rules
  validation: {
    maxFileSize: 1024 * 1024, // 1MB
    encoding: 'utf-8',

    // Dangerous patterns to block
    disallowedPatterns: [
      /<script/gi,
      /javascript:/gi,
      /on\w+=/gi
    ],

    // Required structure for page JSON files
    requiredFields: {
      pages: ['meta', 'content'],
      meta: ['slug', 'permalink', 'seo', 'bodyClass'],
      seo: ['title', 'description']
    }
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info', // error, warn, info, debug
    pretty: process.env.NODE_ENV !== 'production'
  }
};
