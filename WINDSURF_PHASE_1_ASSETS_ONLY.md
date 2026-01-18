# Windsurf Phase 1 Prompt – Asset Upload Only (Safe Mode)

---

## Objective

You are a safe upload agent. Your job is to:

1. **Upload all 1,547 images as Sanity Assets** (no schema dependencies)
2. **Create a mapping file** (localPath → sanityAssetId)
3. **Report results**

This is SAFE because it only uploads files—no document patching, no publishing.

---

## Context

- **Working directory:** `C:\Users\user\Downloads\moss-clone-nextjs-fixed\repo`
- **Total images to upload:** 1,547 (88 page AVIF + 1,459 product JPG)
- **Sanity project:** oz82ztaw
- **Token:** Already configured and tested ✓
- **What to do:** Upload files only, create mapping

---

## Implementation

### Modify upload-all-content-to-sanity.js

Create a NEW version (or update existing) that:

#### Phase 1: Upload All Assets

Loop through ALL image files:
- `D:\New Website Assets\Website Images_Processed\site-avif\**\*.avif`
- `D:\New Website Assets\Website Images_Processed\site-avif-mobile\**\*.avif`
- `D:\New Website Assets\Website Images\Products Organized by Folder\**\*.jpg`
- `D:\New Website Assets\Website Images_Processed\products-mobile\**\*.jpg`
- `D:\New Website Assets\Website Images_Processed\products-thumb\**\*.jpg`

For each file:
1. Read file from disk
2. Upload to Sanity using: `client.assets.upload('file', readStream, { filename: originalName })`
3. Capture the returned asset ID
4. Store mapping: `{ localPath, fileName, assetId, folder, type }`

#### Error Handling

- If one file fails: log it, continue (don't halt)
- At end: report total uploaded vs total errors
- Consider success if 95%+ uploads complete

#### Output Format

Print progress as you go:
```
Phase 1: Uploading Assets
✓ Uploaded: site-avif\Home Page Assets\hero-1.avif → asset-abc123def456
✓ Uploaded: site-avif\Home Page Assets\hero-2.avif → asset-xyz789...
[... many more ...]
✓ Total uploaded: 1547
✗ Failed: 0
```

### Create Mapping File

After all uploads complete, create a CSV file: `asset-mapping.csv`

Format:
```csv
localPath,fileName,assetId,folder,imageType,uploadedAt
D:\New Website Assets\Website Images_Processed\site-avif\Home Page Assets\hero-1.avif,hero-1.avif,asset-abc123def456,Home Page Assets,page-avif,2025-12-28T15:51:00Z
D:\New Website Assets\Website Images_Processed\site-avif\Home Page Assets\hero-2.avif,hero-2.avif,asset-xyz789ghi012,Home Page Assets,page-avif,2025-12-28T15:51:05Z
D:\New Website Assets\Website Images\Products Organized by Folder\2 Bed ADU\2-bed-adu-floor-plan.jpg,2-bed-adu-floor-plan.jpg,asset-product001,2 Bed ADU,product-desktop,2025-12-28T15:52:00Z
...
```

Also create: `asset-mapping.json` with same data in JSON format for programmatic use.

### Final Report

At end, print:
```
===== PHASE 1 COMPLETE =====
Asset Upload Summary
Total images uploaded: 1547 ✓
Upload errors: 0 ✓
Success rate: 100% ✓

Output files created:
✓ asset-mapping.csv (1547 rows)
✓ asset-mapping.json (1547 entries)

All assets ready for Phase 2 (document creation & updates)

Next: David will review schema and plan Phase 2
```

---

## Execute Now

1. Modify `upload-all-content-to-sanity.js` to implement Phase 1 only
2. Run: `node upload-all-content-to-sanity.js --upload-assets-only`
3. Monitor progress (takes 10-20 minutes)
4. Generate mapping files
5. Report completion with final summary

This uploads all images safely without touching any schemas or documents.

---

## Safety Assurances

✅ **No document creation** - doesn't depend on plan schema existing
✅ **No document patching** - doesn't modify any existing docs
✅ **No publishing** - doesn't publish anything
✅ **Error tolerant** - continues if one file fails
✅ **Reversible** - assets can be deleted from Sanity later if needed
✅ **Mapping provided** - you have record of every upload for Phase 2

Go!
