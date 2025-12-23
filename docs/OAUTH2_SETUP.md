# OAuth2 Setup Guide for Google Drive Sync

This guide walks you through setting up OAuth2 authentication instead of service account.

---

## Why OAuth2?

OAuth2 uses **your personal Google Drive storage** instead of a service account. This solves the storage quota issue we encountered.

---

## Part 1: Create OAuth2 Credentials (Google Cloud Console)

### Step 1: Go to Google Cloud Console

1. Open: https://console.cloud.google.com/
2. Select your project: `vaemptiness-website-sync` (or whatever you named it)

### Step 2: Enable Google Drive API (if not already enabled)

1. Go to **APIs & Services** → **Library**
2. Search for "Google Drive API"
3. Click **Enable** (if not already enabled)

### Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**

2. Choose **External** (unless you have Google Workspace)

3. Click **CREATE**

4. Fill in required fields:
   - **App name:** `vaemptiness Content Sync`
   - **User support email:** Your email
   - **Developer contact:** Your email
   - Click **SAVE AND CONTINUE**

5. **Scopes:** Click **ADD OR REMOVE SCOPES**
   - Search for: `https://www.googleapis.com/auth/drive.file`
   - Check the box
   - Click **UPDATE**
   - Click **SAVE AND CONTINUE**

6. **Test users:** Click **ADD USERS**
   - Add your email: `ignacio.coll@gmail.com`
   - Click **ADD**
   - Click **SAVE AND CONTINUE**

7. Click **BACK TO DASHBOARD**

### Step 4: Create OAuth2 Client ID

1. Go to **APIs & Services** → **Credentials**

2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**

3. **Application type:** Select **Desktop app**

4. **Name:** `vaemptiness-sync-desktop`

5. Click **CREATE**

6. **Download the credentials:**
   - Click the **Download JSON** button (download icon)
   - Save the file as `client_secret.json`

7. Click **OK**

---

## Part 2: Authorize the Application

### Step 1: Place credentials file

Move the downloaded `client_secret.json` to your project root:

```bash
# Move downloaded file to project root
mv ~/Downloads/client_secret_*.json ./client_secret.json
```

### Step 2: Run authorization script

```bash
npm run drive:authorize
```

**What happens:**
1. Opens your browser
2. Asks you to sign in with Google
3. Asks for permission to access Drive
4. Click "Allow"
5. You'll see "Authorization successful!"
6. Close the browser

**A `.drive-token.json` file will be created** with your refresh token.

---

## Part 3: Add Token to GitHub Secrets

### Step 1: Read the token file

```bash
cat .drive-token.json
```

Copy the entire contents.

### Step 2: Add to GitHub Secrets

1. Go to: https://github.com/NachoColl/vaemptiness-website/settings/secrets/actions

2. **Update existing secret:**
   - Click **GOOGLE_DRIVE_CREDENTIALS**
   - Click **Update**
   - Paste the contents of `.drive-token.json`
   - Click **Update secret**

3. **Update folder ID:**
   - Click **GOOGLE_DRIVE_FOLDER_ID**
   - Click **Update**
   - Change to: `18lNMWacTTf5_5EIFP_UUTLq3UBU3rfZY` (your original folder)
   - Click **Update secret**

---

## Part 4: Test

### Test locally:

```bash
npm run drive:init
```

**Expected:** Files upload successfully to your Drive folder!

### Test in GitHub Actions:

1. Go to Actions → "Google Drive Content Sync"
2. Click "Run workflow"
3. Should complete successfully

---

## Token Refresh

OAuth2 tokens expire after ~7 days of inactivity, but the **refresh token lasts forever**.

Our scripts automatically refresh the access token when needed. No manual action required!

If you ever need to re-authorize:
```bash
rm .drive-token.json
npm run drive:authorize
```

---

## Security Notes

✅ **Safe to use:**
- OAuth2 is the standard way to access Google APIs
- Refresh token is encrypted in GitHub Secrets
- Token only has access to files it creates (not your entire Drive)

✅ **client_secret.json is safe to commit:**
- It's not actually secret (Google's naming is confusing)
- It identifies the application, not the user
- However, we'll add it to .gitignore anyway for cleanliness

---

## Troubleshooting

### "Access blocked: This app's request is invalid"

**Solution:** Make sure you added yourself as a test user in OAuth consent screen.

### "Token has been expired or revoked"

**Solution:** Run `npm run drive:authorize` again to re-authorize.

### "Insufficient permissions"

**Solution:** Make sure you selected the `drive.file` scope in OAuth consent screen.

---

**Next:** Run the authorization script once you've created OAuth2 credentials.
