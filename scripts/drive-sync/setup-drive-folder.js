/**
 * Setup: Create Drive folder owned by service account and share it
 */

const driveClient = require('./drive-client-oauth');
const config = require('./config');
const logger = require('./logger');

async function setupDriveFolder(ownerEmail) {
  try {
    logger.info('=== Setting up Drive folder ===');

    await driveClient.initialize();

    // Create root folder for vaemptiness content
    logger.info('Creating folder owned by service account...');

    const folderMetadata = {
      name: 'vaemptiness-content',
      mimeType: 'application/vnd.google-apps.folder'
    };

    const folder = await driveClient.drive.files.create({
      requestBody: folderMetadata,
      fields: 'id, name, webViewLink'
    });

    const folderId = folder.data.id;
    const folderUrl = folder.data.webViewLink;

    logger.info('✅ Folder created!', {
      name: folder.data.name,
      id: folderId,
      url: folderUrl
    });

    // Share folder with owner email
    if (ownerEmail) {
      logger.info('Sharing folder with owner...', { email: ownerEmail });

      await driveClient.drive.permissions.create({
        fileId: folderId,
        requestBody: {
          type: 'user',
          role: 'writer', // Editor permission
          emailAddress: ownerEmail
        },
        sendNotificationEmail: false
      });

      logger.info('✅ Folder shared with owner', { email: ownerEmail });
    }

    // Make folder publicly readable (anyone with link can view)
    logger.info('Making folder accessible with link...');

    await driveClient.drive.permissions.create({
      fileId: folderId,
      requestBody: {
        type: 'anyone',
        role: 'reader'
      }
    });

    logger.info('✅ Folder is now accessible with link');

    console.log('\n' + '='.repeat(60));
    console.log('🎉 SUCCESS! Drive folder is ready');
    console.log('='.repeat(60));
    console.log('\n📁 Folder Details:');
    console.log(`   Name: ${folder.data.name}`);
    console.log(`   ID: ${folderId}`);
    console.log(`   URL: ${folderUrl}`);
    console.log('\n📝 Next Steps:');
    console.log('   1. Update GOOGLE_DRIVE_FOLDER_ID in GitHub Secrets to:');
    console.log(`      ${folderId}`);
    console.log('   2. Update .env file (if using locally) with new folder ID');
    console.log('   3. Run: npm run drive:init');
    console.log('   4. Share this URL with content editors:');
    console.log(`      ${folderUrl}`);
    console.log('\n' + '='.repeat(60) + '\n');

    return {
      folderId,
      folderUrl
    };

  } catch (error) {
    logger.error('Setup failed', { error: error.message });
    throw error;
  }
}

// Get owner email from command line argument
const ownerEmail = process.argv[2];

if (!ownerEmail) {
  console.error('Usage: node setup-drive-folder.js YOUR_EMAIL@gmail.com');
  process.exit(1);
}

setupDriveFolder(ownerEmail)
  .then(() => process.exit(0))
  .catch(error => {
    logger.error('Fatal error', { error: error.message });
    process.exit(1);
  });
