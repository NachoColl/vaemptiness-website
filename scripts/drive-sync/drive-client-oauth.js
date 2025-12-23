/**
 * Google Drive API client with OAuth2 support
 */

const { google } = require('googleapis');
const fs = require('fs-extra');
const config = require('./config');
const logger = require('./logger');

const TOKEN_PATH = '.drive-token.json';

class DriveClientOAuth {
  constructor() {
    this.drive = null;
    this.oauth2Client = null;
    this.initialized = false;
  }

  /**
   * Initialize Google Drive API client with OAuth2
   */
  async initialize() {
    if (this.initialized) return;

    try {
      // Check if we have OAuth2 tokens
      let tokens;

      if (config.drive.credentials && config.drive.credentials.refresh_token) {
        // Tokens from environment variable (GitHub Actions)
        tokens = config.drive.credentials;
        logger.debug('Using OAuth2 tokens from environment');
      } else if (await fs.pathExists(TOKEN_PATH)) {
        // Tokens from local file
        tokens = await fs.readJson(TOKEN_PATH);
        logger.debug('Using OAuth2 tokens from file');
      } else {
        throw new Error('No OAuth2 tokens found. Run: npm run drive:authorize');
      }

      // Get client ID and secret
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set');
      }

      // Create OAuth2 client
      this.oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        'http://localhost:3000/oauth2callback'
      );

      // Set credentials
      this.oauth2Client.setCredentials(tokens);

      // Auto-refresh tokens
      this.oauth2Client.on('tokens', async (newTokens) => {
        logger.info('OAuth2 tokens refreshed');

        if (newTokens.refresh_token) {
          tokens.refresh_token = newTokens.refresh_token;
        }

        tokens.access_token = newTokens.access_token;
        tokens.expiry_date = newTokens.expiry_date;

        // Save updated tokens
        if (await fs.pathExists(TOKEN_PATH)) {
          await fs.writeJson(TOKEN_PATH, tokens, { spaces: 2 });
          logger.debug('Saved refreshed tokens to file');
        }
      });

      this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
      this.initialized = true;
      logger.info('Google Drive client initialized with OAuth2');
    } catch (error) {
      logger.error('Failed to initialize Google Drive client', { error: error.message });
      throw error;
    }
  }

  // All other methods are identical to drive-client.js
  // Copy-paste from drive-client.js:

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

  async uploadFile(folderId, fileName, content, fileId = null) {
    await this.initialize();

    const media = {
      mimeType: 'application/json',
      body: content
    };

    try {
      if (fileId) {
        const response = await this.drive.files.update({
          fileId,
          media,
          fields: 'id, name, modifiedTime'
        });
        logger.info('Updated file in Drive', { fileName, fileId });
        return response.data;
      } else {
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

  async getOrCreateFolder(parentFolderId, folderName) {
    const existing = await this.findFolder(parentFolderId, folderName);
    if (existing) {
      logger.debug('Folder exists', { folderName, folderId: existing.id });
      return existing;
    }
    return await this.createFolder(parentFolderId, folderName);
  }

  async deleteFile(fileId) {
    await this.initialize();

    try {
      await this.drive.files.delete({
        fileId
      });
      logger.debug('Deleted file', { fileId });
      return true;
    } catch (error) {
      logger.error('Failed to delete file', { fileId, error: error.message });
      throw error;
    }
  }
}

module.exports = new DriveClientOAuth();
