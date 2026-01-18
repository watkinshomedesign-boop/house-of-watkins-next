# Windsurf Complete Automation Prompt – Do Everything

---

## Your Task

You are a complete automation agent. Your job is to do ALL of the following work in sequence:

1. **Install npm dependencies**
2. **Generate the complete upload script** (upload-all-content-to-sanity.js)
3. **Run dry-run test** and show results
4. **Wait for user approval**
5. **Execute the real upload** when approved

**Do NOT ask questions or stop for input. Execute each step sequentially.**

---

## Context

**Working directory:** `C:\Users\user\Downloads\moss-clone-nextjs-fixed\repo`

**Configuration file:** `image-upload-config.json` (already in your repo, correctly configured)

**What you need to do:**
- Install 4 npm packages
- Write a complete Node.js script
- Run it in dry-run mode
- Report results
- Execute real upload after dry-run passes

---

## Step 1: Install Dependencies

Use PowerShell or Node.js child_process to run:

```bash
npm install @sanity/client mammoth glob dotenv
```

If packages are already installed, that's fine – npm will skip them.

**Expected output:** "added X packages" or "up to date"

---

## Step 2: Generate the Upload Script

Create a file: `upload-all-content-to-sanity.js`

This script must:

### A. Configuration & Initialization
- Read `image-upload-config.json` from the repo root
- Extract: projectId, dataset, apiToken
- Initialize Sanity client with these credentials
- Handle --dry-run flag (process.argv includes '--dry-run')

### B. Phase 1: Upload Page Images (AVIF)
Walk these folders and upload all images:
- `D:\New Website Assets\Website Images_Processed\site-avif\` (desktop)
- `D:\New Website Assets\Website Images_Processed\site-avif-mobile\` (mobile)

For each image:
- Upload to Sanity Assets using client.assets.upload()
- Collect asset references
- Map to page documents based on folder structure:
  - `site-avif\Marketing\Hero\*` → home.heroImages (up to 5)
  - `site-avif\Marketing\WelcomeCard\*` → home.welcomeBackgroundImage
  - `site-avif\Marketing\TripleCarousel\*` → home.tripleCarouselImages (up to 12)
  - `site-avif\About Us Page\*` → about.pageImages
  - `site-avif\Portfolio\*` → portfolioIndex.portfolioImages
  - `site-avif\FAQ\*` → faq.faqImages
  - `site-avif\What's Included\*` → whatsIncluded.sectionImages
  - `site-avif\Contractors\*` → contractors.pageImages
  - `site-avif\Contact\*` → contact.pageImages

### C. Phase 2: Upload Product Images (Desktop + Mobile + Thumbnail)

**Important:** Product images come from THREE sources:

**Desktop images** (original, high-res):
- Source: `D:\New Website Assets\Website Images\Products Organized by Folder\`
- Upload all files matching patterns: `*floor-plan*`, `*elevation*`, `*image-of-front*`
- Store references for: floorPlanImage, frontElevationImage, rightElevationImage, backElevationImage, leftElevationImage

**Mobile images** (optimized):
- Source: `D:\New Website Assets\Website Images_Processed\products-mobile\Products Organized by Folder\`
- Upload same files (optional – for responsive design)

**Thumbnail images** (small):
- Source: `D:\New Website Assets\Website Images_Processed\products-thumb\Products Organized by Folder\`
- Upload files matching: `*product-image*`, `*card*`
- Store reference for: cardImage

### D. Phase 3: Extract Product Metadata & Create Plan Documents

For each folder in `D:\New Website Assets\Website Images\Products Organized by Folder\`:

1. **Find the .docx file** in that folder
2. **Parse it using mammoth** to extract text
3. **Extract these fields** from the text:
   - Bedrooms (look for "bedroom" or "bed")
   - Bathrooms (look for "bathroom" or "bath")
   - Stories (look for "story" or "stories")
   - Square footage (look for "sqft", "sq ft", "square feet")
   - Width, depth, ceiling height
   - Roof height, slopes
   - Description (full product description)
   - SEO meta (shorter meta description)

4. **Collect images** from all three sources for this product:
   - Floor plan (desktop)
   - Elevations (desktop)
   - Front render (desktop)
   - Card image (thumbnail)

5. **Create/update Sanity document:**
   - Type: "plan"
   - Name: [Product folder name]
   - Bedrooms, bathrooms, squareFootage: [extracted]
   - description, seoMeta: [extracted]
   - Image references: [from uploads]

### E. Phase 4: Publish All Documents

After creating/updating, publish:
- All 7 page documents (home, about, portfolio, faq, whatsIncluded, contractors, contact)
- All 45 plan documents

Use `client.publish()` for each.

### F. Error Handling

- If one image fails: log it with error, continue (don't stop)
- If one .docx fails to parse: log it, skip that product, continue
- If one mutation fails: log it, continue
- At end: report total errors (should be 0 for success)

### G. Dry-Run Mode

If `--dry-run` flag is present:
- Do NOT call Sanity API at all
- Do NOT upload images
- Do NOT modify documents
- Instead, PRINT what WOULD happen:
  - List all image files found (count them)
  - Show sample file paths
  - Count product folders found
  - List sample products with metadata extracted
  - Show Sanity connection test (try once, report success/fail)
  - Do NOT actually upload or mutate anything

### H. Output Format

Print progress in phases with checkmarks:

```
Initializing...
✓ Read image-upload-config.json
✓ Sanity client initialized (project: oz82ztaw)

Phase 1: Page Images (AVIF)
✓ Found 5 images in site-avif\Marketing\Hero\
✓ Found 1 image in site-avif\Marketing\WelcomeCard\
✓ Found 12 images in site-avif\Marketing\TripleCarousel\
[... more folders ...]
✓ Total page images: ~150 AVIF
✓ Ready to upload (or "Skipping upload in dry-run mode")

Phase 2: Product Images (Desktop + Mobile + Thumbnail)
✓ Found ~180 desktop JPGs in Products Organized by Folder\
✓ Found ~180 mobile JPGs in products-mobile\
✓ Found ~180 thumbnails in products-thumb\
✓ Total product images: ~540 JPGs
✓ Ready to upload (or "Skipping upload in dry-run mode")

Phase 3: Product Metadata & Plans
✓ Found 45 product folders
✓ Sample: "2 Bed ADU" - 2 bed, 1.5 bath, 1200 sqft
✓ Sample: "3 Bed Cottage" - 3 bed, 2 bath, 1800 sqft
[... more samples ...]
✓ Ready to create/update documents (or "Skipping mutations in dry-run mode")

===== SUMMARY =====
Mode: DRY-RUN (no actual changes)
Status: READY TO PROCEED
Images to upload: ~690 (150 AVIF page + 540 JPG product)
Documents to update: 7 pages + 45 plans
Errors found: 0
```

---

## Step 3: Run Dry-Run Test

After script is created, execute:

```bash
node upload-all-content-to-sanity.js --dry-run
```

**Expected output:** Shows file counts and summary without making changes

---

## Step 4: Report Results to User

After dry-run completes, print a formatted report:

```
DRY-RUN RESULTS
===============
✓ Configuration valid
✓ Page images found: ~150
✓ Product images found: ~540
✓ Product plans identified: 45
✓ Sanity connection: OK
✓ No errors

NEXT: User will review and approve before real execution
```

---

## Step 5: Execute Real Upload (After User Approval)

When user says "ready to proceed" or "execute", run:

```bash
node upload-all-content-to-sanity.js
```

This will:
- Actually upload all images
- Extract all metadata
- Create/update all documents
- Publish everything
- Report final results

---

## Key Implementation Details

### Using mammoth for .docx parsing:
```javascript
const mammoth = require('mammoth');
const result = await mammoth.extractRawText({ path: filePath });
const text = result.value;
// Search through text for: "2 bed", "1.5 bath", "1200 sq ft", etc.
```

### Using glob for file patterns:
```javascript
const glob = require('glob');
const files = glob.sync('path/to/**/*.jpg');
```

### Using Sanity client:
```javascript
const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: config.sanity.projectId,
  dataset: config.sanity.dataset,
  token: config.sanity.apiToken,
  useCdn: false
});

// Upload asset
const asset = await client.assets.upload('file', fs.createReadStream(filePath));

// Update document
await client.patch(docId).set(updates).commit();

// Publish
await client.publish(docId);
```

---

## Important Notes

✅ **Use correct image sources:**
- Desktop products: Original folder (high-res JPGs)
- Mobile products: products-mobile folder (optimized JPGs)
- Thumbnails: products-thumb folder (small JPGs)

✅ **Metadata in original folder:**
- All .docx files are in: `D:\New Website Assets\Website Images\Products Organized by Folder\`

✅ **Page images from processed folder:**
- AVIF images from: `D:\New Website Assets\Website Images_Processed\`

✅ **Error tolerance:**
- If one file fails, skip it and continue
- Report all failures at the end
- Still consider success if 95%+ completes

✅ **Always show progress:**
- Print each phase clearly
- Show file counts
- Report any issues immediately

---

## Do This Now

1. ✅ Install dependencies: `npm install @sanity/client mammoth glob dotenv`
2. ✅ Create `upload-all-content-to-sanity.js` with all phases above
3. ✅ Run: `node upload-all-content-to-sanity.js --dry-run`
4. ✅ Report results to user
5. ⏸️ Wait for user to say "ready" before executing real upload

**Start immediately. No questions. Execute step by step.**
