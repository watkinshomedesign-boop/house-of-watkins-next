# Execution Checklist: Complete Image Upload Automation

Print or keep this open while executing. Check off each step as you complete it.

---

## Pre-Execution Setup (Do Once)

- [ ] **Have Node.js installed?**
  - Run: `node --version` in PowerShell
  - Should show v16 or higher

- [ ] **Have your Sanity Project ID?**
  - Find it in: `sanity.json` (in repo root) or Sanity dashboard

- [ ] **Have your Sanity API Token?**
  - Sanity dashboard → Settings → API Tokens
  - Create new token with: read, write, assets.manage

- [ ] **Downloaded the 6 config files?**
  - [ ] `image-upload-config.json`
  - [ ] `README_START_HERE.md`
  - [ ] `AUTOMATION_PACKAGE_SUMMARY.md`
  - [ ] `EXECUTION_CHECKLIST.md`
  - [ ] `SETUP_AND_INSTRUCTIONS.md`
  - [ ] `WINDSURF_AUTOMATION_PROMPT.md`

---

## Configuration (15 minutes)

- [ ] **Open `image-upload-config.json`**

- [ ] **Find the sanity section and replace:**
  ```json
  "projectId": "YOUR_ACTUAL_PROJECT_ID",
  "apiToken": "YOUR_ACTUAL_API_TOKEN",
  ```

- [ ] **Save the file**

- [ ] **Verify folder structure:**
  - [ ] `D:\New Website Assets\Website Images_Processed\site-avif\` exists
  - [ ] `D:\New Website Assets\Website Images_Processed\products-mobile\` exists

---

## Install Dependencies (5 minutes)

- [ ] **Open PowerShell in project root**

- [ ] **Run:**
  ```powershell
  npm install @sanity/client mammoth glob dotenv
  ```

- [ ] **Wait for completion**

---

## Generate Automation Script (10 minutes)

- [ ] **Open `WINDSURF_AUTOMATION_PROMPT.md`**

- [ ] **Copy all text**

- [ ] **Open Windsurf**

- [ ] **Paste the prompt**

- [ ] **Tell Windsurf:**
  ```
  Using this config:
  [paste your image-upload-config.json content]
  
  Write the Node.js script that implements this automation. 
  Save it as upload-all-content-to-sanity.js in my project root.
  Then run: node upload-all-content-to-sanity.js --dry-run
  ```

- [ ] **Windsurf generates and tests the script**

---

## Review Dry-Run Output (10 minutes)

- [ ] **Check for errors** – Should show "Status: OK" or similar
- [ ] **Verify page counts** – Should show ~7 pages
- [ ] **Verify product counts** – Should show ~45 plans
- [ ] **Check file paths** – Should start with correct root path
- [ ] **Confirm metadata parsing** – Should show bedrooms, bathrooms extracted

**If any issues:** Stop here, fix config, re-run dry-run

**If all good:** Proceed to next section

---

## Execute Full Upload (15 minutes)

- [ ] **In Windsurf, ask to execute real run:**
  ```
  Great! Now run without --dry-run:
  node upload-all-content-to-sanity.js
  ```

- [ ] **Wait for completion** (5-15 minutes)

- [ ] **Monitor console for progress**

---

## Verify Results (10 minutes)

### In Sanity Studio

- [ ] **Go to:** `http://localhost:3000/studio`

- [ ] **Check Home page:**
  - Click "Home" in left nav
  - Should see images in heroImages field
  - Should see images in tripleCarouselImages field

- [ ] **Check one Plan:**
  - Find a plan document
  - Should see floorPlanImage, elevations, descriptions filled

### On Live Website

- [ ] **Go to:** `http://localhost:3000`

- [ ] **Check Home page:**
  - Hero carousel shows rotating images
  - No broken image placeholders

- [ ] **Check another page (About, Portfolio):**
  - Images display properly

---

## Success Indicators

- [ ] ✅ 1,902 images uploaded
- [ ] ✅ 7 pages updated
- [ ] ✅ 45 plans created/updated
- [ ] ✅ No errors in output
- [ ] ✅ Images visible on live site
- [ ] ✅ Sanity Studio fully populated

---

## Troubleshooting Quick Reference

| Problem | Fix |
|---------|-----|
| "Cannot find module" | Run: `npm install @sanity/client mammoth glob` |
| Sanity auth error | Check API token is valid, has correct permissions |
| Folder not found | Verify folder names in config match actual names |
| Images not showing | Hard refresh: Ctrl+Shift+R, check documents Published |

---

**DONE! Your website is now fully populated. 🎉**
