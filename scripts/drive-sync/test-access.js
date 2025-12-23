/**
 * Test if service account can access the Drive folder
 */

const driveClient = require('./drive-client-oauth');
const config = require('./config');
const logger = require('./logger');

async function testAccess() {
  try {
    logger.info('Testing Drive access...');

    await driveClient.initialize();
    logger.info('✅ Service account authenticated');

    const folderId = config.drive.folderId;
    logger.info('Attempting to access folder', { folderId });

    // Try to get folder metadata
    const metadata = await driveClient.getFileMetadata(folderId);

    if (metadata) {
      logger.info('✅ Can access folder', {
        name: metadata.name,
        id: metadata.id,
        mimeType: metadata.mimeType
      });

      // Try to list files in folder
      const files = await driveClient.listFiles(folderId);
      logger.info('✅ Can list files in folder', { count: files.length });

      if (files.length > 0) {
        logger.info('Files found:', files.map(f => f.name));
      }

      // Try to create a test file
      logger.info('Testing file creation...');
      const testContent = JSON.stringify({ test: true }, null, 2);

      try {
        const result = await driveClient.uploadFile(
          folderId,
          '_test_file.json',
          testContent
        );
        logger.info('✅ Successfully created test file!', { fileId: result.id });

        // Clean up - delete test file
        await driveClient.drive.files.delete({ fileId: result.id });
        logger.info('✅ Cleaned up test file');

        logger.info('🎉 All tests passed! Drive access is working.');
      } catch (uploadError) {
        logger.error('❌ Cannot create files', { error: uploadError.message });

        if (uploadError.message.includes('storage quota')) {
          logger.error('This is the storage quota issue. The folder needs to be in a Shared Drive or use supportsAllDrives parameter.');
        }
      }

    } else {
      logger.error('❌ Cannot access folder - it may not be shared with the service account');
    }

  } catch (error) {
    logger.error('Test failed', { error: error.message });
  }
}

testAccess()
  .then(() => process.exit(0))
  .catch(error => {
    logger.error('Fatal error', { error: error.message });
    process.exit(1);
  });
