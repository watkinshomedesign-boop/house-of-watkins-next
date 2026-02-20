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
const API_VERSION = "2024-01";

if (!SHOPIFY_TOKEN) {
  console.error("Missing SHOPIFY_ADMIN_ACCESS_TOKEN env var");
  process.exit(1);
}
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env var");
  process.exit(1);
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
// Shopify helpers
// ---------------------------------------------------------------------------

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

function buildPayload(plan, baseCents, perSqFtCents) {
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
  };
}

// ---------------------------------------------------------------------------
// Main sync
// ---------------------------------------------------------------------------

async function main() {
  console.log("Loading plans from Supabase...");
  const [plans, pricing] = await Promise.all([fetchPlans(), fetchPricing()]);
  console.log(`  ${plans.length} published plans, pricing: base=${pricing.base_price_cents}c, sqft=${pricing.per_heated_sqft_cents}c`);

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
      const payload = buildPayload(plan, pricing.base_price_cents, pricing.per_heated_sqft_cents);
      const ex = byHandle.get(plan.slug);

      if (ex) {
        // Update — map variant IDs
        const updatePayload = { ...payload };
        if (ex.variants && ex.variants.length >= 2) {
          updatePayload.variants = payload.variants.map((v, idx) => ({
            ...v,
            id: ex.variants[idx]?.id,
          }));
        }
        await shopifyPut(`/products/${ex.id}.json`, { product: updatePayload });
        results.updated++;
        console.log(`  ✓ ${label} — updated`);
      } else {
        await shopifyPost("/products.json", { product: payload });
        results.created++;
        console.log(`  ✓ ${label} — created`);
      }
    } catch (e) {
      const msg = e?.message || String(e);
      // Retry on 429
      if (msg.includes("429")) {
        console.log(`  ⏳ ${label} — rate limited, waiting 3s...`);
        await sleep(3000);
        try {
          const payload = buildPayload(plan, pricing.base_price_cents, pricing.per_heated_sqft_cents);
          const ex = byHandle.get(plan.slug);
          if (ex) {
            const up = { ...payload };
            if (ex.variants?.length >= 2) up.variants = payload.variants.map((v, idx) => ({ ...v, id: ex.variants[idx]?.id }));
            await shopifyPut(`/products/${ex.id}.json`, { product: up });
            results.updated++;
            console.log(`  ✓ ${label} — updated (retry)`);
          } else {
            await shopifyPost("/products.json", { product: payload });
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
