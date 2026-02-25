/**
 * Direct Shopify sync script — runs locally, bypasses Vercel.
 * 
 * Usage: node scripts/shopify-sync-direct.mjs
 * 
 * Requires env vars (or uses hardcoded values below):
 *   SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_ACCESS_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { config } from "dotenv";
config({ path: ".env.local" });

const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "vterik-w0.myshopify.com";
const SHOPIFY_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
const API_VERSION = "2024-01";

if (!SHOPIFY_TOKEN) {
  console.error("Missing SHOPIFY_ADMIN_ACCESS_TOKEN env var");
  process.exit(1);
}
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env var");
  process.exit(1);
}
if (!SANITY_PROJECT_ID) {
  console.warn("WARNING: NEXT_PUBLIC_SANITY_PROJECT_ID not set — images will be missing");
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// Supabase helpers
// ---------------------------------------------------------------------------

async function fetchPlans() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/plans?select=*&status=in.(published,active,Published,ACTIVE)&order=name.asc`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase plans fetch failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function fetchPricing() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/pricing_settings?select=*&limit=1`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase pricing fetch failed: ${res.status} ${await res.text()}`);
  const rows = await res.json();
  return rows[0] || { base_price_cents: 79500, per_heated_sqft_cents: 28 };
}

// ---------------------------------------------------------------------------
// Sanity helpers — match images to plans by filename
// ---------------------------------------------------------------------------

async function fetchAllSanityImages() {
  if (!SANITY_PROJECT_ID) return [];
  const all = [];
  const batchSize = 500;
  let offset = 0;
  while (true) {
    const q = encodeURIComponent(
      `*[_type == "sanity.imageAsset"] | order(_id asc) [${offset}...${offset + batchSize}] { _id, url, originalFilename, "w": metadata.dimensions.width, "h": metadata.dimensions.height }`
    );
    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${q}`;
    const res = await fetch(url);
    if (!res.ok) { console.warn(`  Sanity fetch failed at offset ${offset}: ${res.status}`); break; }
    const data = await res.json();
    const items = data?.result || [];
    all.push(...items);
    if (items.length < batchSize) break;
    offset += batchSize;
  }
  return all;
}

/**
 * Build a map: planSlug → array of desktop-quality Sanity image URLs.
 *
 * Desktop product images are typically 2400x1600 or 1920x1280 with
 * filenames ending in "-desktop.jpg".
 *
 * Pinterest pins are 800x1200 (tall portrait) with short display names
 * like "Crystal Creek-v1.jpg" — these must be EXCLUDED.
 *
 * Selection criteria:
 *   1. Must have "-desktop" in the filename, OR width >= 1920
 *   2. Must NOT be portrait orientation (w < h) — those are Pinterest pins
 *   3. Skip -thumb and -mobile variants
 */
function buildImageMap(plans, sanityImages) {
  const norm = (s) =>
    decodeURIComponent(String(s || ""))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  // Build lookup keys from plan names and slugs
  const keyToSlug = new Map();
  for (const p of plans) {
    if (!p.slug) continue;
    const slugKey = norm(p.slug);
    const nameKey = norm(p.name);
    keyToSlug.set(slugKey, p.slug);
    if (nameKey && nameKey !== slugKey) keyToSlug.set(nameKey, p.slug);
  }

  // Sort keys longest-first so we match the most specific plan name
  const sortedKeys = [...keyToSlug.keys()].sort((a, b) => b.length - a.length);

  const map = {};
  for (const p of plans) {
    if (p.slug) map[p.slug] = { front: null, gallery: [] };
  }

  let skippedPins = 0;
  let skippedSmall = 0;
  let skippedMobile = 0;
  let skippedThumb = 0;

  for (const asset of sanityImages) {
    const fn = asset.originalFilename || "";
    const fnNorm = norm(fn);
    const fnLower = fn.toLowerCase();
    const w = asset.w || 0;
    const h = asset.h || 0;

    // Skip thumb and mobile variants
    if (fnLower.includes("-thumb") || fnNorm.includes("thumb")) { skippedThumb++; continue; }
    if (fnLower.includes("-mobile") || fnNorm.includes("mobile")) { skippedMobile++; continue; }

    // Skip Pinterest pins: portrait orientation (height > width)
    if (w > 0 && h > 0 && h > w) { skippedPins++; continue; }

    // Only include desktop-quality images: must have "-desktop" in name OR width >= 1920
    const isDesktop = fnLower.includes("-desktop") || fnLower.includes("desktop");
    const isLargeEnough = w >= 1920;
    if (!isDesktop && !isLargeEnough) { skippedSmall++; continue; }

    // Find which plan this image belongs to
    let matchedSlug = null;
    for (const key of sortedKeys) {
      if (fnNorm.startsWith(key) || fnNorm.includes(key)) {
        matchedSlug = keyToSlug.get(key);
        break;
      }
    }
    if (!matchedSlug || !map[matchedSlug]) continue;

    const entry = map[matchedSlug];
    const url = asset.url;
    if (!url) continue;

    // Classify: front-image / front-view / exterior-front go first
    if (fnLower.includes("front-image") || fnLower.includes("front%20image") ||
        fnLower.includes("front-view") || fnLower.includes("image-of-front") ||
        fnLower.includes("exterior-front") || fnLower.includes("product-image")) {
      if (!entry.front) entry.front = url;
      else entry.gallery.push(url);
    } else {
      entry.gallery.push(url);
    }
  }

  console.log(`    Skipped: ${skippedPins} Pinterest pins, ${skippedMobile} mobile, ${skippedThumb} thumbs, ${skippedSmall} too small`);
  return map;
}

// ---------------------------------------------------------------------------
// Shopify helpers
// ---------------------------------------------------------------------------

const HOME_GARDEN_CATEGORY_GID = "gid://shopify/TaxonomyCategory/hg";

const shopifyHeaders = {
  "Content-Type": "application/json",
  "X-Shopify-Access-Token": SHOPIFY_TOKEN,
};

async function shopifyGet(path) {
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}${path}`, {
    headers: shopifyHeaders,
  });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}: ${await res.text()}`);
  return { json: await res.json(), headers: res.headers };
}

async function shopifyPost(path, body) {
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}${path}`, {
    method: "POST",
    headers: shopifyHeaders,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}: ${await res.text()}`);
  return res.json();
}

async function shopifyPut(path, body) {
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}${path}`, {
    method: "PUT",
    headers: shopifyHeaders,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT ${path} → ${res.status}: ${await res.text()}`);
  return res.json();
}

async function shopifyGraphQL(query, variables) {
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: shopifyHeaders,
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`GraphQL ${res.status}: ${await res.text()}`);
  return res.json();
}

async function setProductCategory(productId) {
  const gid = `gid://shopify/Product/${productId}`;
  const mutation = `mutation productUpdate($input: ProductInput!) {
    productUpdate(input: $input) {
      product { id category { id name } }
      userErrors { field message }
    }
  }`;
  const r = await shopifyGraphQL(mutation, {
    input: { id: gid, category: HOME_GARDEN_CATEGORY_GID },
  });
  const errs = r.data?.productUpdate?.userErrors || [];
  if (errs.length > 0) {
    throw new Error(`Category update failed: ${errs.map(e => e.message).join(", ")}`);
  }
  return r.data?.productUpdate?.product;
}

async function getAllShopifyProducts() {
  const all = [];
  let url = `/products.json?limit=250`;
  while (url) {
    const { json, headers } = await shopifyGet(url);
    all.push(...(json.products || []));
    const link = headers.get("link") || "";
    const next = link.match(/<([^>]+)>;\s*rel="next"/);
    if (next) {
      const u = new URL(next[1]);
      url = u.pathname.replace(`/admin/api/${API_VERSION}`, "") + u.search;
    } else {
      url = null;
    }
  }
  return all;
}

// ---------------------------------------------------------------------------
// Build product payload
// ---------------------------------------------------------------------------

function collectImages(plan, imageEntry) {
  const urls = [];
  const seen = new Set();

  const add = (url) => {
    if (!url) return;
    const s = String(url).trim();
    if (!s || !s.startsWith("http") || seen.has(s)) return;
    seen.add(s);
    urls.push(s);
  };

  // Front image first (hero / primary)
  if (imageEntry) {
    add(imageEntry.front);
    for (const u of imageEntry.gallery) add(u);
  }

  // Limit to 20 images max (Shopify limit)
  return urls.slice(0, 20).map((src) => ({ src }));
}

function buildPayload(plan, baseCents, perSqFtCents, imageEntry) {
  const heatedSqFt = plan.heated_sqft || 0;
  const singlePrice = (baseCents + perSqFtCents * heatedSqFt) / 100;
  const builderPrice = singlePrice * 3;

  const specs = [];
  if (plan.heated_sqft) specs.push(`${plan.heated_sqft} Heated Sq Ft`);
  if (plan.beds) specs.push(`${plan.beds} Bed${plan.beds > 1 ? "s" : ""}`);
  if (plan.baths) specs.push(`${plan.baths} Bath${plan.baths > 1 ? "s" : ""}`);
  if (plan.stories) specs.push(`${plan.stories} Stor${plan.stories > 1 ? "ies" : "y"}`);

  const body_html = [
    plan.description || "",
    specs.length ? `<p><strong>Plan Specs:</strong> ${specs.join(" | ")}</p>` : "",
  ].filter(Boolean).join("\n") || plan.name;

  const tags = [
    ...(plan.tags || []),
    plan.beds ? `${plan.beds}-bed` : null,
    plan.baths ? `${plan.baths}-bath` : null,
    plan.stories ? `${plan.stories}-story` : null,
  ].filter(Boolean).join(", ");

  return {
    title: plan.name,
    handle: plan.slug,
    body_html,
    vendor: "House of Watkins",
    product_type: "House Plan",
    status: "active",
    published: true,
    tags,
    options: [{ name: "License", values: ["Single Build License", "Builder License"] }],
    variants: [
      {
        option1: "Single Build License",
        price: singlePrice.toFixed(2),
        sku: `${plan.slug}-single`,
        requires_shipping: false,
        inventory_management: null,
        taxable: true,
      },
      {
        option1: "Builder License",
        price: builderPrice.toFixed(2),
        sku: `${plan.slug}-builder`,
        requires_shipping: false,
        inventory_management: null,
        taxable: true,
      },
    ],
    // images: collectImages(plan, imageEntry), // disabled — images uploaded manually
  };
}

// ---------------------------------------------------------------------------
// Main sync
// ---------------------------------------------------------------------------

async function main() {
  console.log("Loading plans from Supabase...");
  const [plans, pricing] = await Promise.all([fetchPlans(), fetchPricing()]);
  console.log(`  ${plans.length} published plans, pricing: base=${pricing.base_price_cents}c, sqft=${pricing.per_heated_sqft_cents}c`);

  console.log("Loading all Sanity image assets...");
  const sanityImages = await fetchAllSanityImages();
  console.log(`  ${sanityImages.length} total image assets in Sanity`);

  console.log("Matching images to plans by filename...");
  const imageMap = buildImageMap(plans, sanityImages);
  const withImages = Object.entries(imageMap).filter(([, v]) => v.front || v.gallery.length > 0);
  console.log(`  ${withImages.length} of ${plans.length} plans matched to at least 1 image`);

  console.log("Loading existing Shopify products...");
  const existing = await getAllShopifyProducts();
  console.log(`  ${existing.length} products in Shopify`);

  const byHandle = new Map();
  for (const p of existing) {
    if (p.handle) byHandle.set(p.handle, p);
  }

  const results = { created: 0, updated: 0, skipped: 0, errors: [] };

  for (let i = 0; i < plans.length; i++) {
    const plan = plans[i];
    if (!plan.slug) {
      results.skipped++;
      continue;
    }

    const label = `[${i + 1}/${plans.length}] ${plan.slug}`;

    try {
      const imgEntry = imageMap[plan.slug] || null;
      const payload = buildPayload(plan, pricing.base_price_cents, pricing.per_heated_sqft_cents, imgEntry);
      const imgCount = payload.images?.length || 0;
      const ex = byHandle.get(plan.slug);

      if (ex) {
        // Update — map variant IDs
        const updatePayload = { ...payload };
        if (payload.images.length === 0) {
          delete updatePayload.images;
        }
        if (ex.variants && ex.variants.length >= 2) {
          updatePayload.variants = payload.variants.map((v, idx) => ({
            ...v,
            id: ex.variants[idx]?.id,
          }));
        }
        await shopifyPut(`/products/${ex.id}.json`, { product: updatePayload });
        await setProductCategory(ex.id);
        results.updated++;
        console.log(`  ✓ ${label} — updated (${imgCount} imgs, category=Home & Garden)`);
      } else {
        const created = await shopifyPost("/products.json", { product: payload });
        const newId = created?.product?.id;
        if (newId) await setProductCategory(newId);
        results.created++;
        console.log(`  ✓ ${label} — created (${imgCount} imgs, category=Home & Garden)`);
      }
    } catch (e) {
      const msg = e?.message || String(e);
      // Retry on 429
      if (msg.includes("429")) {
        console.log(`  ⏳ ${label} — rate limited, waiting 3s...`);
        await sleep(3000);
        try {
          const payload = buildPayload(plan, pricing.base_price_cents, pricing.per_heated_sqft_cents, imageMap[plan.slug] || null);
          const ex = byHandle.get(plan.slug);
          if (ex) {
            const up = { ...payload };
            if (ex.variants?.length >= 2) up.variants = payload.variants.map((v, idx) => ({ ...v, id: ex.variants[idx]?.id }));
            await shopifyPut(`/products/${ex.id}.json`, { product: up });
            await setProductCategory(ex.id);
            results.updated++;
            console.log(`  ✓ ${label} — updated (retry)`);
          } else {
            const cr = await shopifyPost("/products.json", { product: payload });
            if (cr?.product?.id) await setProductCategory(cr.product.id);
            results.created++;
            console.log(`  ✓ ${label} — created (retry)`);
          }
        } catch (e2) {
          results.errors.push({ slug: plan.slug, error: e2?.message || String(e2) });
          console.log(`  ✗ ${label} — ${e2?.message}`);
        }
      } else {
        results.errors.push({ slug: plan.slug, error: msg });
        console.log(`  ✗ ${label} — ${msg}`);
      }
    }

    await sleep(1000); // rate limit
  }

  console.log("\n=== SYNC COMPLETE ===");
  console.log(`Created: ${results.created}`);
  console.log(`Updated: ${results.updated}`);
  console.log(`Skipped: ${results.skipped}`);
  console.log(`Errors:  ${results.errors.length}`);
  if (results.errors.length > 0) {
    console.log("\nErrors:");
    for (const e of results.errors) {
      console.log(`  ${e.slug}: ${e.error}`);
    }
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
