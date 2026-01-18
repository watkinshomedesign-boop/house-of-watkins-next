# Windsurf Sanity Token Fix Prompt

---

## Problem

The dry-run shows:
- ✅ Configuration valid
- ✅ All 1,547 images found (88 page AVIF + 1,459 product JPGs)
- ✅ 79 product plans identified
- ❌ **Sanity connection FAILED: "Unauthorized - Session not found"**

The API token in `image-upload-config.json` is either:
1. Expired
2. Revoked
3. Invalid
4. Missing required permissions

---

## Your Task

You are a credential verification agent. Do this:

### Step 1: Read .env.local Again

Open: `C:\Users\user\Downloads\moss-clone-nextjs-fixed\repo\.env.local`

Find the line with `SANITY_API_TOKEN=...`

**Copy the exact value** (the long string after the equals sign).

### Step 2: Verify Token in Sanity Dashboard

Tell the user:
```
The current API token in image-upload-config.json may be invalid.

You need to:
1. Go to: https://sanity.io/manage
2. Log in to your Sanity project
3. Go to: Settings → API Tokens
4. Find a token with permissions: read, write, assets.manage
5. If one exists, use it. If not, create a new one with those permissions.
6. Copy the full token string

Then either:
A) If you have the correct token from .env.local: Tell me the first 20 characters
B) If you need to create a new token in Sanity: Create it and share the full token

I will then update image-upload-config.json with the correct token.
```

### Step 3: Update Configuration (Once User Provides Token)

Once the user provides the correct token:

1. Extract token value
2. Open `image-upload-config.json`
3. Find this section:
```json
"sanity": {
  "projectId": "oz82ztaw",
  "dataset": "production",
  "apiToken": "skD6phXDuQPo7S5jJBDGkBVZeUPbQ1tslq5QULRcvEMNjHPcUhN17BRw0pGgOLzyg"
}
```

4. Replace the `apiToken` value with the correct one from .env.local or Sanity dashboard
5. Save the file

### Step 4: Test Connection

Run this to test:
```bash
node -e "
const config = require('./image-upload-config.json');
const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: config.sanity.projectId,
  dataset: config.sanity.dataset,
  token: config.sanity.apiToken,
  useCdn: false
});
client.request({ uri: '/users/me' }).then(() => console.log('✓ Sanity connection OK')).catch(e => console.log('✗ Error:', e.message));
"
```

Expected output: `✓ Sanity connection OK`

If it fails, report the error.

### Step 5: Re-run Dry-Run

Once connection test passes, run:
```bash
node upload-all-content-to-sanity.js --dry-run
```

Should now show:
```
✓ Connected to project: oz82ztaw
[... rest of dry-run ...]
```

---

## Instructions for User

You have two options:

### Option A: Use Token from .env.local (Recommended)

1. Open: `C:\Users\user\Downloads\moss-clone-nextjs-fixed\repo\.env.local`
2. Find: `SANITY_API_TOKEN=...`
3. Tell Windsurf: "Use the token from SANITY_API_TOKEN in .env.local"
4. Windsurf will read it and update image-upload-config.json

### Option B: Create New Token in Sanity Dashboard

1. Go to: https://sanity.io/manage
2. Log in
3. Select project: oz82ztaw
4. Go to: Settings → API Tokens
5. Create new token (name: "Image Upload Automation")
6. Permissions needed:
   - ✓ read
   - ✓ write
   - ✓ assets.manage
7. Copy the token value
8. Tell Windsurf the token
9. Windsurf will update image-upload-config.json

---

## Start Now

Read .env.local and tell the user what to do.
