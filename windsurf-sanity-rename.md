# 🤖 Windsurf: Rename Mobile Images in Sanity - Complete Instructions

## Your Task
Add `-mobile` suffix to all mobile image filenames in Sanity CMS automatically.

---

## Step 1: Get Your Credentials from Your Local Project

Your Sanity credentials are already stored locally. You need to extract them from your `.env.local` file:

**File location:**
```
C:\Users\user\Downloads\moss-clone-nextjs-fixed\repo\.env.local
```

**Open this file and look for these variables:**
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=<your_project_id>
SANITY_API_TOKEN=<your_api_token>
```

Copy the VALUES (not the variable names) - you'll need them in Step 3.

---

## Step 2: Create the Rename Script in Your Project

In your project root (`C:\Users\user\Downloads\moss-clone-nextjs-fixed\repo\`), create this new folder and file:

**File path:** `scripts/rename-mobile-images.js`

**Content:**
```javascript
import sanityClient from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
})

// List of asset IDs that are mobile images
// YOU WILL FILL THIS IN from Step 4
const mobileAssetIds = [
  // 'image-YOUR_ASSET_ID_1-640x480-jpg',
  // 'image-YOUR_ASSET_ID_2-640x480-jpg',
]

async function renameAssets() {
  console.log(`Starting rename of ${mobileAssetIds.length} mobile images...`)

  for (const assetId of mobileAssetIds) {
    try {
      const asset = await client.getDocument(assetId)
      const currentName = asset.originalFilename

      const nameParts = currentName.split('.')
      const extension = nameParts.pop()
      const newName = `${nameParts.join('.')}-mobile.${extension}`

      await client.patch(assetId).set({
        originalFilename: newName
      }).commit()

      console.log(`✓ Renamed: ${currentName} → ${newName}`)
    } catch (error) {
      console.error(`✗ Failed to rename ${assetId}:`, error.message)
    }
  }

  console.log('Done!')
}

renameAssets()
```

---

## Step 3: Install Dependencies

From your project root, run:

```bash
npm install @sanity/client dotenv
```

---

## Step 4: Identify Mobile Image Asset IDs

You need to get the actual asset IDs from Sanity.

### Option A: Use Sanity Vision (Easiest)

1. Open your Sanity Studio in the browser (usually at `http://localhost:3333`)
2. Click **Vision** (bottom left of the interface)
3. Paste this GROQ query:

```groq
*[_type == "sanity.imageAsset" && originalFilename match "*mobile*"] {
  _id,
  originalFilename
}
```

4. Run the query (hit Enter or click Run)
5. Copy all the `_id` values from the results
6. Paste them into the `mobileAssetIds` array in your script

**Example:**
```javascript
const mobileAssetIds = [
  'image-abc123def456-640x480-jpg',
  'image-xyz789uvw012-640x480-jpg',
  'image-pqr345stu678-640x480-jpg',
]
```

### Option B: Query via API (If Vision doesn't work)

Run this command in your terminal (replace `YOUR_TOKEN` with actual token from `.env.local`):

```bash
curl -X GET "https://api.sanity.io/v1/data/query/production?query=*%5B_type%20==%20%22sanity.imageAsset%22%5D%20%7C%20order(_createdAt%20desc)%20%7B%20_id,%20originalFilename%20%7D" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Step 5: Test with 1-2 Images First

Before running on all images, test with just 1 image:

```javascript
const mobileAssetIds = [
  'image-abc123def456-640x480-jpg',  // Just one for testing
]
```

Then run:
```bash
node scripts/rename-mobile-images.js
```

Expected output:
```
Starting rename of 1 mobile images...
✓ Renamed: cherry-creek-living-area-mobile.jpg → cherry-creek-living-area-mobile-mobile.jpg
Done!
```

---

## Step 6: Expand to All Mobile Images

Once testing works, add all your mobile image asset IDs to the array and run again:

```bash
node scripts/rename-mobile-images.js
```

---

## Step 7: Verify in Sanity

1. Go to Sanity Studio → Vision
2. Run this query:

```groq
*[_type == "sanity.imageAsset"] | order(_createdAt desc) {
  _id,
  originalFilename
}
```

3. Confirm mobile images now have `-mobile` in their filenames

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Cannot find module '@sanity/client'` | Run `npm install @sanity/client dotenv` |
| `NEXT_PUBLIC_SANITY_PROJECT_ID is undefined` | Check `.env.local` exists and has correct variables |
| `Unauthorized` | Verify token is valid and has Editor permissions in Sanity |
| `Asset not found` | Double-check asset IDs from Vision query - copy exactly |
| Script won't run | Make sure you're in project root: `C:\Users\user\Downloads\moss-clone-nextjs-fixed\repo\` |

---

## What Happens After Running

✅ Filenames in Sanity metadata are updated
✅ Asset IDs stay the same (URLs don't break)
✅ All document references remain valid
✅ Your website continues working normally

---

## Next Phase (After This Works)

Once mobile images are done, repeat this process for:
- **Thumbnails:** Add `-thumb` suffix
- **Full resolution:** Add `-full` suffix

Just change the GROQ query and filenames accordingly.
