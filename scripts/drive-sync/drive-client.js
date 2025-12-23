/**
 * Google Drive API client
 */

const { google } = require('googleapis');
const config = require('./config');
const logger = require('./logger');

class DriveClient {
  constructor() {
    this.drive = null;
    this.initialized = false;
  }

  /**
   * Initialize Google Drive API client
   */
  async initialize() {
    if (this.initialized) return;

    if (!config.drive.credentials) {
      throw new Error('Google Drive credentials not configured. Set GOOGLE_DRIVE_CREDENTIALS environment variable.');
    }

    try {
      const auth = new google.auth.GoogleAuth({
        credentials: config.drive.credentials,
        scopes: ['https://www.googleapis.com/auth/drive']
      });

      this.drive = google.drive({ version: 'v3', auth });
      this.initialized = true;
      logger.info('Google Drive client initialized');
    } catch (error) {
      logger.error('Failed to initialize Google Drive client', { error: error.message });
      throw error;
    }
  }

  /**
   * List files in a folder
   */
  async listFiles(folderId, options = {}) {
    await this.initialize();

    const query = [`'${folderId}' in parents`, 'trashed = false'];

    if (options.mimeType) {
      query.push(`mimeType='${options.mimeType}'`);
    }

    try {
      const response = await this.drive.files.list({
        q: query.join(' and '),
        fields: 'files(id, name, mimeType, modifiedTime, parents)',
        orderBy: 'name',
        pageSize: 1000
      });

      logger.debug(`Listed ${response.data.files.length} files in folder ${folderId}`);
      return response.data.files;
    } catch (error) {
      logger.error('Failed to list files', { folderId, error: error.message });
      throw error;
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(fileId) {
    await this.initialize();

    try {
      const response = await this.drive.files.get({
        fileId,
        fields: 'id, name, mimeType, modifiedTime, parents, size'
      });

      return response.data;
    } catch (error) {
      if (error.code === 404) {
        logger.warn('File not found', { fileId });
        return null;
      }
      logger.error('Failed to get file metadata', { fileId, error: error.message });
      throw error;
    }
  }

  /**
   * Download file content
   */
  async downloadFile(fileId) {
    await this.initialize();

    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        const response = await this.drive.files.get(
          { fileId, alt: 'media' },
          { responseType: 'text' }
        );

        logger.debug('Downloaded file', { fileId });
        return response.data;
      } catch (error) {
        if (error.code === 429 && retries < maxRetries - 1) {
          // Rate limit - exponential backoff
          const delay = Math.pow(2, retries) * 1000;
          logger.warn(`Rate limited, retrying in ${delay}ms`, { fileId });
          await new Promise(resolve => setTimeout(resolve, delay));
          retries++;
        } else if (error.code === 404) {
          logger.warn('File not found', { fileId });
          return null;
        } else {
          logger.error('Failed to download file', { fileId, error: error.message });
          throw error;
        }
      }
    }

    throw new Error(`Failed to download file after ${maxRetries} retries`);
  }

  /**
   * Upload or update file
   */
  async uploadFile(folderId, fileName, content, fileId = null) {
    await this.initialize();

    const media = {
      mimeType: 'application/json',
      body: content
    };

    try {
      if (fileId) {
        // Update existing file
        const response = await this.drive.files.update({
          fileId,
          media,
          fields: 'id, name, modifiedTime'
        });
        logger.info('Updated file in Drive', { fileName, fileId });
        return response.data;
      } else {
        // Create new file
        const fileMetadata = {
          name: fileName,
          parents: [folderId]
        };

        const response = await this.drive.files.create({
          requestBody: fileMetadata,
          media,
          fields: 'id, name, modifiedTime'
        });
        logger.info('Created file in Drive', { fileName, fileId: response.data.id });
        return response.data;
      }
    } catch (error) {
      logger.error('Failed to upload file', { fileName, error: error.message });
      throw error;
    }
  }

  /**
   * Create folder
   */
  async createFolder(parentFolderId, folderName) {
    await this.initialize();

    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId]
    };

    try {
      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        fields: 'id, name'
      });

      logger.info('Created folder in Drive', { folderName, folderId: response.data.id });
      return response.data;
    } catch (error) {
      logger.error('Failed to create folder', { folderName, error: error.message });
      throw error;
    }
  }

  /**
   * Find folder by name
   */
  async findFolder(parentFolderId, folderName) {
    await this.initialize();

    const query = [
      `'${parentFolderId}' in parents`,
      `name='${folderName}'`,
      `mimeType='application/vnd.google-apps.folder'`,
      'trashed = false'
    ];

    try {
      const response = await this.drive.files.list({
        q: query.join(' and '),
        fields: 'files(id, name)',
        pageSize: 1
      });

      return response.data.files[0] || null;
    } catch (error) {
      logger.error('Failed to find folder', { folderName, error: error.message });
      throw error;
    }
  }

  /**
   * Get or create folder
   */
  async getOrCreateFolder(parentFolderId, folderName) {
    const existing = await this.findFolder(parentFolderId, folderName);
    if (existing) {
      logger.debug('Folder exists', { folderName, folderId: existing.id });
      return existing;
    }
    return await this.createFolder(parentFolderId, folderName);
  }
}

module.exports = new DriveClient();
