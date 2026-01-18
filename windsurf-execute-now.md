# 🤖 Windsurf: Execute Sanity Image Rename Instructions

## Your Task Right Now

You have a guide file on your local machine that contains all the instructions for renaming mobile images in Sanity. Follow these steps to find and execute it.

---

## Step 1: Open the Guide File

**File path:**
```
C:\Users\user\Downloads\moss-clone-nextjs-fixed\repo\windsurf-sanity-rename.md
```

**In Windsurf:**
1. Use the File Explorer (or `Ctrl+P` to open files)
2. Navigate to the location above
3. Open `windsurf-sanity-rename.md`
4. Read through the entire guide

---

## Step 2: Follow the Guide Step-by-Step

The guide contains 7 steps:

1. **Get Credentials** - Extract from `.env.local` (located at the same root folder)
2. **Create Rename Script** - Create `scripts/rename-mobile-images.js` with provided code
3. **Install Dependencies** - Run `npm install @sanity/client dotenv`
4. **Get Asset IDs** - Use Sanity Vision to query mobile images
5. **Test with 1-2 Images** - Verify the script works
6. **Expand to All Images** - Run full rename
7. **Verify Results** - Check in Sanity that renaming worked

---

## Step 3: Execute Each Step

As you go through the guide:

- ✅ Copy code blocks and paste them into your project files
- ✅ Run terminal commands exactly as shown
- ✅ Replace placeholder values with your actual values
- ✅ Test before going full-scale

---

## Quick Command Reference

Once you have the script ready:

```bash
# From project root directory:
cd C:\Users\user\Downloads\moss-clone-nextjs-fixed\repo

# Install dependencies:
npm install @sanity/client dotenv

# Run the rename script:
node scripts/rename-mobile-images.js
```

---

## Key Reminders

⚠️ **From the guide:**
- Your credentials are in `C:\Users\user\Downloads\moss-clone-nextjs-fixed\repo\.env.local`
- Test with 1-2 images FIRST before running on all images
- Asset IDs come from Sanity Vision (GROQ query)
- The script will log what it's doing

---

## When You're Done

After completing all 7 steps:
1. Report back with the output from your script
2. Confirm mobile images show up with `-mobile` suffix in Sanity Vision
3. We can then move to thumbnails and full-res versions

---

## Need Help?

If any step fails:
- Check the **Troubleshooting** section in the guide
- Verify file paths are correct
- Confirm credentials are valid
- Make sure you're running from the correct project directory

**Go open `windsurf-sanity-rename.md` now and follow it through!**
