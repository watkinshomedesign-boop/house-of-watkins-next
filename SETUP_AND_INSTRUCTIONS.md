# Complete Image & Metadata Upload Automation – Setup & Execution

## Overview

This automation suite will:
1. Upload **1,900+ images** to Sanity CMS from 4 variant folders
2. Extract **metadata from 50+ .docx product files**
3. Populate **7 Sanity page singletons** with images
4. Create/update **~45 plan documents** with images + specs
5. **Publish everything** live

**Total time: 60–90 minutes**

---

## Prerequisites

### Tools

- **Node.js** v16+ (download from nodejs.org if needed)
- **npm** (comes with Node.js)
- **Windsurf** (already installed)

### Credentials

- **Sanity Project ID** – Find in `sanity.json` or Sanity dashboard
- **Sanity API Token** – Create in Sanity dashboard → Settings → API Tokens (permissions: read, write, assets.manage)

### Folder Structure

Confirm these folders exist:
- `D:\New Website Assets\Website Images_Processed\site-avif\`
- `D:\New Website Assets\Website Images_Processed\site-avif-mobile\`
- `D:\New Website Assets\Website Images_Processed\products-mobile\`
- `D:\New Website Assets\Website Images_Processed\products-thumb\`

---

## Step 1: Configure (15 minutes)

1. **Open `image-upload-config.json`** in any text editor (Notepad, VSCode, etc.)

2. **Find the `sanity` section:**
   ```json
   "sanity": {
     "projectId": "YOUR_SANITY_PROJECT_ID",
     "dataset": "production",
     "apiToken": "YOUR_SANITY_API_TOKEN"
   }
   ```

3. **Replace placeholders:**
   - `YOUR_SANITY_PROJECT_ID` → Your actual Project ID from `sanity.json`
   - `YOUR_SANITY_API_TOKEN` → Your actual API token from Sanity dashboard
   - Leave `dataset: "production"` unchanged

4. **Verify folder paths** (optional, but recommended):
   - Check your page folder names match what's in the config
   - Example: If your folder is "Home Marketing" instead of "Marketing", update it

5. **Save the file**

---

## Step 2: Install Dependencies (5 minutes)

1. **Open PowerShell**
   - Right-click on desktop or in File Explorer → "Open PowerShell"
   - Or type `powershell` in Command Prompt

2. **Navigate to your project root:**
   ```powershell
   cd C:\path\to\your\houseofwatkins\repo
   ```

3. **Install packages:**
   ```powershell
   npm install @sanity/client mammoth glob dotenv
   ```

4. **Wait for completion** – Should see "added X packages" at the end

---

## Step 3: Generate Script via Windsurf (10 minutes)

1. **Open `WINDSURF_AUTOMATION_PROMPT.md`** (in any text editor)

2. **Copy ALL the text** (Ctrl+A, then Ctrl+C)

3. **Open Windsurf**

4. **Create a new chat/file** in Windsurf

5. **Paste the prompt** (Ctrl+V)

6. **Add this intro above the prompt:**
   ```
   Here is my image-upload-config.json:
   
   [PASTE YOUR ENTIRE image-upload-config.json file contents here]
   
   Now, using the prompt below, write and execute the automation:
   ```

7. **Tell Windsurf to proceed:**
   ```
   Write the Node.js script that implements this automation. 
   Save it as upload-all-content-to-sanity.js in my project root.
   Then run: node upload-all-content-to-sanity.js --dry-run
   ```

Windsurf will:
- Generate the script
- Run dry-run automatically
- Show you preview output

---

## Step 4: Review Dry-Run Output (10 minutes)

**Windsurf will show output. Check:**

✓ **No errors** – Look for "ERROR" text; if found, note it and fix config

✓ **Page counts** – Should show ~7 pages (Home, About, Portfolio, FAQ, What's Included, Contractors, Contact)

✓ **Product counts** – Should show ~45 plans (from your Products Organized by Folder)

✓ **File paths** – Check a sample path shown; should start with: `D:\New Website Assets\Website Images_Processed\`

✓ **Metadata** – Should show at least 1 plan with bedrooms, bathrooms, sq ft extracted

✓ **Sanity connection** – Should say "Connected to Sanity" without auth errors

**If all looks good:** Proceed to Step 5

**If you see errors:**
- Stop here (don't run real execution)
- Check error message
- Fix `image-upload-config.json`
- Ask Windsurf to re-run dry-run
- Repeat until dry-run is clean

---

## Step 5: Execute Full Upload (15 minutes)

**WARNING: This will actually upload 1,902 images.**

1. **Confirm dry-run looked good** ✓

2. **In Windsurf, ask to execute:**
   ```
   Perfect! The dry-run looks good. Now execute without --dry-run:
   node upload-all-content-to-sanity.js
   ```

3. **Wait for completion** (5–15 minutes)
   - Watch the console output
   - Most operations should show ✓ (checkmark)
   - Script continues even if individual items fail

4. **Look for final report:**
   - "1,902 images uploaded"
   - "7 pages updated"
   - "45 plans created/updated"
   - "0 errors" (or list of failed items)

---

## Step 6: Verify (10 minutes)

### In Sanity Studio

1. **Start your dev server** (if not running):
   ```powershell
   npm run dev
   ```

2. **Go to Studio:** http://localhost:3000/studio

3. **Check Home document:**
   - Left nav → Click "Home"
   - Should see images in `heroImages` field (~5 images)
   - Should see images in `tripleCarouselImages` (~12 images)

4. **Check one Plan document:**
   - Look for "Plans" or similar in left nav
   - Open "2 Bed ADU" or first plan
   - Should see:
     - Images: floor plan, elevations, front render
     - Metadata: bedrooms, bathrooms, square footage, description

### On Live Website

1. **Go to:** http://localhost:3000

2. **Check Home page:**
   - Hero carousel at top should show rotating images
   - No broken image placeholders

3. **Check another page (About, Portfolio, etc.):**
   - Images should display
   - Content should be visible

---

## Troubleshooting

### Issue: "Cannot find module @sanity/client"

**Fix:** You didn't install dependencies. Run:
```powershell
npm install @sanity/client mammoth glob
```

### Issue: "Sanity API authentication failed"

**Fix:** 
- Verify API token is correct (very long string)
- Verify it has read, write, and assets.manage permissions
- Try generating a new token

### Issue: "Cannot find image folder"

**Fix:**
- Check folder names in config match your actual folders exactly
- Windows is case-sensitive for paths
- No extra spaces or typos

### Issue: "DOCX parsing failed for plan X"

**Fix:**
- That .docx file may be corrupted
- Try re-saving it in Microsoft Word
- Or manually add that plan's data in Sanity Studio later

### Issue: "Images uploaded but not showing on website"

**Fix:**
1. Hard refresh browser: `Ctrl + Shift + R`
2. Check documents are **Published** (not Draft) in Sanity Studio
3. Check browser console (F12) for errors
4. Clear browser cache if needed

### Issue: Dry-run shows wrong file paths

**Fix:**
- Update folder names in `image-upload-config.json`
- Ensure paths match your actual folder structure
- Re-run dry-run to confirm

---

## What Gets Uploaded (Summary)

| Category | Count | Details |
|----------|-------|---------|
| **Page images** | ~150 | From site-avif and site-avif-mobile folders |
| **Product images** | ~540 | 45 plans × 6 types × 2 variants |
| **Product metadata** | ~45 | Extracted from .docx files |
| **Pages updated** | 7 | Home, About, Portfolio, FAQ, What's Included, Contractors, Contact |
| **Plans created/updated** | ~45 | All plans in Products Organized by Folder |

---

## Safety & Best Practices

✅ **Original images never touched** – Only reads from `Website Images_Processed`

✅ **Always dry-run first** – Preview before executing

✅ **Error-tolerant** – One image failure won't stop the whole upload

✅ **Idempotent** – Safe to run twice; updates instead of duplicating

✅ **Logged** – Full report shows exactly what was done

---

## Success Checklist

After completion, confirm:

- [ ] Sanity Studio shows images on all pages
- [ ] Home page hero carousel rotates
- [ ] Product pages display floor plans, elevations, descriptions
- [ ] Live website shows all content without broken images
- [ ] No errors in final script output

---

## Next Steps

1. **Configure** – Fill in `image-upload-config.json` with Sanity credentials
2. **Install** – Run `npm install @sanity/client mammoth glob dotenv`
3. **Generate** – Copy Windsurf prompt and execute
4. **Verify** – Check Sanity Studio and live website

**You're ready to go!** 🚀
