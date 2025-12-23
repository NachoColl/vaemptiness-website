/**
 * Sync metadata management
 * Handles reading/writing sync-state.json in Google Drive
 */

const dayjs = require('dayjs');
const driveClient = require('./drive-client');
const config = require('./config');
const logger = require('./logger');

const METADATA_FILE = 'sync-state.json';

class SyncMetadata {
  constructor() {
    this.metadata = null;
    this.metadataFileId = null;
  }

  /**
   * Get metadata folder ID (create if doesn't exist)
   */
  async getMetadataFolder() {
    const rootFolderId = config.drive.folderId;
    const metadataFolderName = config.drive.structure.metadata;

    const folder = await driveClient.getOrCreateFolder(rootFolderId, metadataFolderName);
    return folder.id;
  }

  /**
   * Load sync state from Drive
   */
  async load() {
    try {
      const metadataFolderId = await this.getMetadataFolder();

      // Find metadata file
      const files = await driveClient.listFiles(metadataFolderId);
      const metadataFile = files.find(f => f.name === METADATA_FILE);

      if (!metadataFile) {
        logger.info('No existing sync state found, creating new one');
        this.metadata = this.createEmptyMetadata();
        return this.metadata;
      }

      // Download and parse metadata
      this.metadataFileId = metadataFile.id;
      const content = await driveClient.downloadFile(metadataFile.id);
      this.metadata = JSON.parse(content);

      logger.info('Loaded sync state', {
        filesTracked: Object.keys(this.metadata.files).length,
        lastSync: this.metadata.lastSync
      });

      return this.metadata;
    } catch (error) {
      logger.error('Failed to load sync metadata', { error: error.message });
      throw error;
    }
  }

  /**
   * Save sync state to Drive
   */
  async save() {
    try {
      if (!this.metadata) {
        throw new Error('No metadata to save');
      }

      const metadataFolderId = await this.getMetadataFolder();

      // Update lastSync timestamp
      this.metadata.lastSync = new Date().toISOString();

      const content = JSON.stringify(this.metadata, null, 2);

      const result = await driveClient.uploadFile(
        metadataFolderId,
        METADATA_FILE,
        content,
        this.metadataFileId
      );

      this.metadataFileId = result.id;
      logger.info('Saved sync state', { fileId: this.metadataFileId });
    } catch (error) {
      logger.error('Failed to save sync metadata', { error: error.message });
      throw error;
    }
  }

  /**
   * Create empty metadata structure
   */
  createEmptyMetadata() {
    return {
      version: '1.0',
      lastSync: new Date().toISOString(),
      repository: {
        owner: config.github.owner,
        repo: config.github.repo,
        branch: config.github.branch
      },
      drive: {
        folderId: config.drive.folderId,
        folderUrl: `https://drive.google.com/drive/folders/${config.drive.folderId}`
      },
      files: {},
      syncHistory: []
    };
  }

  /**
   * Get file metadata
   */
  getFile(path) {
    if (!this.metadata) {
      throw new Error('Metadata not loaded');
    }
    return this.metadata.files[path] || null;
  }

  /**
   * Set file metadata
   */
  setFile(path, fileData) {
    if (!this.metadata) {
      throw new Error('Metadata not loaded');
    }

    this.metadata.files[path] = {
      ...this.metadata.files[path],
      ...fileData,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Add sync history entry
   */
  addSyncHistory(entry) {
    if (!this.metadata) {
      throw new Error('Metadata not loaded');
    }

    this.metadata.syncHistory.unshift({
      timestamp: new Date().toISOString(),
      ...entry
    });

    // Keep only last 100 entries
    if (this.metadata.syncHistory.length > 100) {
      this.metadata.syncHistory = this.metadata.syncHistory.slice(0, 100);
    }
  }

  /**
   * Get all tracked files
   */
  getAllFiles() {
    if (!this.metadata) {
      throw new Error('Metadata not loaded');
    }
    return this.metadata.files;
  }

  /**
   * Get last sync time
   */
  getLastSync() {
    if (!this.metadata) {
      return null;
    }
    return this.metadata.lastSync;
  }
}

module.exports = new SyncMetadata();
