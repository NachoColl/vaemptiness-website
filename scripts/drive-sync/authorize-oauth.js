/**
 * OAuth2 Authorization Flow
 * Run this once to get refresh token
 */

const { google } = require('googleapis');
const fs = require('fs-extra');
const http = require('http');
const url = require('url');
const open = require('open');
const logger = require('./logger');

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = '.drive-token.json';
const CREDENTIALS_PATH = 'client_secret.json';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

async function authorize() {
  try {
    // Check if client_secret.json exists
    if (!await fs.pathExists(CREDENTIALS_PATH)) {
      console.error('\n❌ Error: client_secret.json not found\n');
      console.log('Please follow these steps:\n');
      console.log('1. Go to Google Cloud Console');
      console.log('2. Create OAuth2 Desktop credentials');
      console.log('3. Download the JSON file as client_secret.json');
      console.log('4. Place it in the project root directory\n');
      console.log('See docs/OAUTH2_SETUP.md for detailed instructions\n');
      process.exit(1);
    }

    // Load client secrets
    const credentials = await fs.readJson(CREDENTIALS_PATH);
    const { client_id, client_secret } = credentials.installed || credentials.web;

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      REDIRECT_URI
    );

    // Generate authorization URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent' // Force to get refresh token
    });

    console.log('\n' + '='.repeat(60));
    console.log('🔐 Google Drive Authorization');
    console.log('='.repeat(60) + '\n');

    // Create local server to receive callback
    const server = http.createServer(async (req, res) => {
      try {
        const qs = new url.URL(req.url, REDIRECT_URI).searchParams;
        const code = qs.get('code');

        if (code) {
          res.end('✅ Authorization successful! You can close this window.');

          // Exchange code for tokens
          const { tokens } = await oauth2Client.getToken(code);

          // Save tokens
          await fs.writeJson(TOKEN_PATH, tokens, { spaces: 2 });

          console.log('✅ Authorization successful!');
          console.log(`\n📝 Token saved to: ${TOKEN_PATH}`);
          console.log('\n' + '='.repeat(60));
          console.log('Next steps:');
          console.log('1. Add token to GitHub Secrets (copy from .drive-token.json)');
          console.log('2. Run: npm run drive:init');
          console.log('='.repeat(60) + '\n');

          server.close();
        } else {
          res.end('❌ Authorization failed. No code received.');
          server.close();
          process.exit(1);
        }
      } catch (error) {
        logger.error('Authorization error', { error: error.message });
        res.end('❌ Error during authorization');
        server.close();
        process.exit(1);
      }
    });

    server.listen(3000, async () => {
      console.log('📡 Local server started on http://localhost:3000\n');
      console.log('🔗 Authorization URL:');
      console.log('─'.repeat(60));
      console.log(authUrl);
      console.log('─'.repeat(60) + '\n');

      // Try to open browser (may not work in WSL)
      try {
        console.log('Attempting to open browser...\n');
        await open(authUrl);
        console.log('✅ Browser opened. Please authorize the application.\n');
      } catch (error) {
        console.log('⚠️  Could not auto-open browser (WSL/headless environment)');
        console.log('👉 Please manually copy the URL above and open it in your browser.\n');
      }

      console.log('⏳ Waiting for authorization...\n');
    });

  } catch (error) {
    logger.error('Fatal error', { error: error.message });
    process.exit(1);
  }
}

authorize();
