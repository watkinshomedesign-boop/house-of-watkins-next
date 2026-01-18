# 🚀 Complete Website Image & Metadata Automation

**Start here.** This is your master guide to uploading 1,902 images + 45 product specs to your Sanity CMS in one automated run.

---

## 📚 Files You Have

I've created a complete automation package with these files:

1. **`README_START_HERE.md`** ← You are here
2. **`AUTOMATION_PACKAGE_SUMMARY.md`** – Overview of what's included and how it works
3. **`EXECUTION_CHECKLIST.md`** – Step-by-step checklist to follow during execution
4. **`SETUP_AND_INSTRUCTIONS.md`** – Detailed setup guide with troubleshooting
5. **`WINDSURF_AUTOMATION_PROMPT.md`** – Prompt to give to Windsurf (copy-paste)
6. **`image-upload-config.json`** – Configuration file (you need to fill in Sanity credentials)

---

## ⏱️ Time Estimate

**Total time to fully populate your website: 60–90 minutes**

Breakdown:
- Setup & configuration: 15 min
- Install dependencies: 5 min
- Generate script via Windsurf: 10 min
- Dry-run test: 10 min
- Full automation execution: 10–15 min
- Verification: 10 min

---

## 🎯 What This Does

This automation will:

✅ **Upload 1,902 images** to Sanity CMS  
✅ **Populate 7 web pages** (Home, About, Portfolio, FAQ, What's Included, Contractors, Contact) with the right images  
✅ **Create/update 45 product plans** with images + specifications  
✅ **Extract metadata** from product .docx files (bedrooms, bathrooms, sq ft, descriptions, etc.)  
✅ **Publish everything** so it's live on your website  

All in one coordinated automated run.

---

## 🚦 Quick Start (3 Steps)

### Step 1: Fill in Your Sanity Credentials (5 minutes)

1. Open `image-upload-config.json` in a text editor
2. Find these lines:
   ```json
   "projectId": "YOUR_SANITY_PROJECT_ID",
   "apiToken": "YOUR_SANITY_API_TOKEN",
   ```
3. Replace with your actual Sanity credentials:
   - **Project ID**: Find in `sanity.json` in your repo root, or Sanity dashboard
   - **API Token**: Create in Sanity dashboard → Settings → API Tokens (permissions: read, write, assets.manage)
4. Save the file

### Step 2: Install Dependencies (5 minutes)

Open PowerShell in your project root:

```powershell
npm install @sanity/client mammoth glob dotenv
```

### Step 3: Give Windsurf the Automation Prompt (30 minutes)

1. Open `WINDSURF_AUTOMATION_PROMPT.md`
2. Copy all the text
3. Paste it into Windsurf
4. Add: "Using this config: [paste your image-upload-config.json]"
5. Say: "Write and execute the automation script. First run dry-run, then execute full upload."
6. Windsurf will handle the rest

That's it! ✨

---

## 📖 Reading Guide

**If you have 5 minutes:**
- Read this file (README_START_HERE.md)

**If you have 10 minutes:**
- Read `AUTOMATION_PACKAGE_SUMMARY.md` for overview
- Read the Quick Start section above

**If you're ready to execute:**
- Follow `EXECUTION_CHECKLIST.md` step-by-step
- It's designed to be clicked off as you go

**If you need detailed help:**
- Read `SETUP_AND_INSTRUCTIONS.md` for comprehensive setup guide
- It includes troubleshooting for common issues

**If Windsurf asks questions:**
- Read `WINDSURF_AUTOMATION_PROMPT.md` for context on what the script does

---

## 🔑 Key Points

### What Gets Uploaded

**Page Images (~150 total):**
- Home: 5 hero + 1 welcome + 12 carousel = 18 images
- About, Portfolio, FAQ, What's Included, Contractors, Contact: ~6–10 images each

**Product Images (~540 total):**
- 45 plans × 6 image types (floor plan, elevations, renders) = 270 images
- × 2 variants (desktop JPG + thumbnail) = 540 total

**Product Metadata:**
- 45 plans with extracted specs (bedrooms, bathrooms, sq ft, descriptions, dimensions, roof specs, etc.)

### Where Things Go

**Images:**
- All images → Sanity Assets storage
- Asset references → Sanity page/plan documents

**Page documents:**
- Updated in Sanity Studio singletons: home, about, portfolioIndex, faq, whatsIncluded, contractors, contact

**Plan documents:**
- Created (or updated if exists) in Sanity plan collection
- Each has images + all metadata fields filled

---

## ⚠️ Before You Start

**Make sure you have:**

- [ ] Sanity Project ID (find in `sanity.json` or Sanity dashboard)
- [ ] Sanity API Token with read, write, and assets.manage permissions
- [ ] Node.js v16+ installed (`node --version` in PowerShell)
- [ ] All processed images in: `D:\New Website Assets\Website Images_Processed\`
- [ ] Product .docx files in each plan folder under "Products Organized by Folder"

**Make sure it's correct:**

- [ ] Folder paths in config match your actual folder names (case-sensitive)
- [ ] Sanity credentials are real and valid
- [ ] Your dev server can start (`npm run dev` works)

---

## 🛡️ Safety Notes

- **Original images are never touched.** The automation only reads from `Website Images_Processed`
- **Dry-run first.** Always preview with `--dry-run` before executing
- **Reversible.** If you run the script twice, it updates existing documents (doesn't create duplicates)
- **Error-tolerant.** If one image fails, the script continues (reports errors at end)

---

## 🎯 Success Criteria

After execution, you should see:

1. **In Sanity Studio:**
   - Home page has hero carousel images
   - About page has section images
   - Each plan has floor plan + elevations + description

2. **On live website:**
   - Hero images rotate on home page
   - Product pages display specs and images
   - No broken images

3. **In script output:**
   - "Status: SUCCESS" or equivalent
   - "1,902 images uploaded"
   - "7 pages updated"
   - "45 plans created/updated"
   - "0 errors"

---

## 🚨 If Something Goes Wrong

**Most common issue:** Sanity credentials not filled in config file
- **Fix:** Open `image-upload-config.json`, verify credentials are real, try again

**Second most common:** Folder path mismatch
- **Fix:** Check folder names in config match actual folders exactly
- **Windows tips:** Use exact spacing, capitalization matches

**Third:** DOCX file corrupted
- **Fix:** Re-save the .docx file in Microsoft Word, try again

**For other issues:**
- Check `SETUP_AND_INSTRUCTIONS.md` → Troubleshooting section
- Look at dry-run output (it's very detailed)
- Run again with `--dry-run` to debug without making changes

---

## 📞 Help & Support

**Quick answers:**
- Check `SETUP_AND_INSTRUCTIONS.md` → Troubleshooting

**Detailed troubleshooting:**
- Run: `node upload-all-content-to-sanity.js --dry-run`
- Review the output for clues
- Most errors are in the config (wrong credentials or folder paths)

**If stuck:**
- Don't proceed to full execution yet
- Fix the issue and dry-run again
- Once dry-run shows no errors, execute for real

---

## 🎬 Next Action

### Right Now (5 minutes):
1. ✅ Read this file (you're doing it!)
2. ⬜ Open `image-upload-config.json`
3. ⬜ Fill in your Sanity credentials (Project ID + API Token)
4. ⬜ Save the file

### Next (5 minutes):
5. ⬜ Open PowerShell
6. ⬜ Run: `npm install @sanity/client mammoth glob dotenv`

### Then (30 minutes):
7. ⬜ Open `WINDSURF_AUTOMATION_PROMPT.md`
8. ⬜ Copy it, paste into Windsurf
9. ⬜ Ask Windsurf to write and execute the script

### Finally (10 minutes):
10. ⬜ Verify in Sanity Studio and on live website

---

## 📊 What You'll Get

After completing this automation:

📸 **1,902 images** properly formatted and hosted on Sanity  
📄 **7 page documents** fully populated with images  
🏠 **45 house plan documents** with images + complete specifications  
✨ **Live website** with all content visible and working  

Your website will go from empty to fully populated with all assets and content in under 2 hours.

---

## 💡 Pro Tips

- **Keep the config file.** You can use it again anytime you add new images
- **Keep the script.** If you need to update images later, run the script again
- **Backup first.** Before running on production, test on a staging dataset
- **Monitor progress.** Watch the console output; it's very detailed and helps debug if needed

---

## ✨ Summary

You have everything you need. The automation is:
- ✅ **Complete** – handles all 3 data streams (pages, products, metadata)
- ✅ **Safe** – dry-run first, never modifies originals, reversible
- ✅ **Fast** – 1,900+ images in ~15 minutes
- ✅ **Documented** – every step has a guide

**Start with the Quick Start section above, follow the checklist, and you're done.** 🚀

---

## 📚 Document Index

- **README_START_HERE.md** (this file) – Overview and quick start
- **AUTOMATION_PACKAGE_SUMMARY.md** – What's included and how it works
- **EXECUTION_CHECKLIST.md** – Step-by-step checklist (print this!)
- **SETUP_AND_INSTRUCTIONS.md** – Detailed setup + troubleshooting
- **WINDSURF_AUTOMATION_PROMPT.md** – Prompt for Windsurf
- **image-upload-config.json** – Configuration (fill in credentials)

---

**Ready? Start with filling in your Sanity credentials in `image-upload-config.json`, then follow the Quick Start section above. You've got this! 🎉**
