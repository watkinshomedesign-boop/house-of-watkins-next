# Google Search Console Cleanup Guide

## Problem
Google is showing old SEO data from the previous website version, including:
- Pages with "Archives" in titles (e.g., "Small house plans Archives")
- Meta descriptions containing contact information (email, phone)
- Truncated or incorrect descriptions

## Solution Steps

### Step 1: Remove Old URLs from Google Index

1. **Go to Google Search Console:**
   - Visit: https://search.google.com/search-console
   - Select your property: `https://houseofwatkins.com`

2. **Use the Removal Tool:**
   - Navigate to: **Removals** (in left sidebar)
   - Click: **"New Request"** → **"Remove outdated content"**

3. **Add Old URLs to Remove:**
   Add these URLs (one at a time or as a list):
   ```
   https://houseofwatkins.com/small-house-plans-archives
   https://houseofwatkins.com/2-story-house-plans-archives
   https://houseofwatkins.com/craftsman-house-plans-archives
   https://houseofwatkins.com/how-to-choose-a-floor-plan
   ```
   
   **Note:** If you see other URLs with "Archives" or incorrect descriptions, add them too.

4. **Submit Removal Request:**
   - Click **"Request removal"**
   - Google will process the request (usually within 24-48 hours)

### Step 2: Request Re-indexing of Correct Pages

After old URLs are removed, request indexing for the correct pages:

1. **Go to URL Inspection Tool:**
   - In Search Console, use the search bar at the top
   - Or go to: **URL Inspection** (in left sidebar)

2. **Request Indexing for Important Pages:**
   Test and request indexing for:
   - `https://houseofwatkins.com`
   - `https://houseofwatkins.com/house-plans`
   - `https://houseofwatkins.com/about`
   - `https://houseofwatkins.com/contact-us`

3. **For Each URL:**
   - Enter the URL
   - Click **"Test Live URL"**
   - If the page looks correct, click **"Request Indexing"**

### Step 3: Monitor Progress

1. **Check Removal Status:**
   - Go to **Removals** → **"Temporary removals"**
   - See which URLs are pending or completed

2. **Check Indexing Status:**
   - Go to **Coverage** report
   - Look for any errors or warnings
   - Check that new pages are being indexed

3. **Verify in Search:**
   - After 1-2 weeks, search for: `site:houseofwatkins.com`
   - Check that old "Archives" pages are gone
   - Verify that descriptions are correct

### Step 4: Submit Updated Sitemap

1. **Go to Sitemaps:**
   - In Search Console, click **"Sitemaps"** (in left sidebar)

2. **Add/Resubmit Sitemap:**
   - Enter: `https://houseofwatkins.com/sitemap.xml`
   - Click **"Submit"**
   - This helps Google discover all your pages faster

### Step 5: Wait and Monitor

- **Timeline:** Changes typically appear in search results within 1-4 weeks
- **Check Weekly:** Monitor Search Console for indexing status
- **Verify:** Search for your brand name and check that results look correct

## Additional Notes

- **Removals are temporary:** Google will re-crawl removed URLs after ~90 days. Make sure redirects are in place before then.
- **Redirects are set:** Old URLs with "Archives" will redirect to `/house-plans` (after code deployment)
- **New metadata is ready:** All pages now have proper SEO metadata that will be picked up on next crawl

## What Was Fixed in Code

1. ✅ Added `generateMetadata` for `/house-plans` page
2. ✅ Added redirects for old "Archives" URLs (in `next.config.mjs`)
3. ✅ All pages now have proper canonical URLs
4. ✅ Proper meta descriptions for all pages

---

**Created:** 2026-01-27
**Status:** Ready for client action in Google Search Console
