# Windsurf Token Update Prompt – Replace with .env.local Token

---

## Task

Update `image-upload-config.json` to use the correct token from `.env.local`.

---

## Step-by-Step

### Step 1: Read .env.local

Open: `C:\Users\user\Downloads\moss-clone-nextjs-fixed\repo\.env.local`

Find the line:
```
SANITY_API_TOKEN=...
```

Extract the token value (everything after the equals sign). This is the **correct token**.

### Step 2: Update image-upload-config.json

Open: `C:\Users\user\Downloads\moss-clone-nextjs-fixed\repo\image-upload-config.json`

Find this section:
```json
"sanity": {
  "projectId": "oz82ztaw",
  "dataset": "production",
  "apiToken": "skD6phXDuQPo7S5jJBDGkBVZeUPbQ1tslq5QULRcvEMNjHPcUhN17BRw0pGgOLzyg"
}
```

Replace the `apiToken` value with the token from `.env.local` (the one that starts with `skD6phXDuQPoIwiqAUpj`).

Save the file.

### Step 3: Verify Token Was Updated

Read the updated `image-upload-config.json` and confirm:
- ✓ apiToken field now contains the correct token (from .env.local)
- ✓ File was saved successfully

### Step 4: Test Connection

Run:
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
client.request({ uri: '/users/me' }).then(() => console.log('✓ Connection OK')).catch(e => console.log('✗ Failed:', e.message));
"
```

Expected: `✓ Connection OK`

### Step 5: Re-run Dry-Run

If connection test passes, run:
```bash
node upload-all-content-to-sanity.js --dry-run
```

Expected output:
```
✓ Connected to project: oz82ztaw
✓ Sanity connection OK

Phase 1: Page Images (AVIF)
✓ Found 88 page images total

Phase 2: Product Images (Desktop + Mobile + Thumbnail)
✓ Found 1459 product images total

Phase 3: Product Metadata & Plans
✓ Found 79 product plans

===== SUMMARY =====
Images to upload (estimate): 1547
Documents to update: 79 plans + 6 pages
Errors found: 0

Status: SUCCESS
```

---

## Execute Now

1. Read .env.local and get the token
2. Update image-upload-config.json
3. Save the file
4. Run connection test
5. Run dry-run test
6. Report results

Do NOT create any new tokens. Just use the one from .env.local.
