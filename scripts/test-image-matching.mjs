import { config } from "dotenv";
config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SANITY_PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DS = process.env.NEXT_PUBLIC_SANITY_DATASET;
const SANITY_VER = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

// Fetch plans
const res = await fetch(
  `${SUPABASE_URL}/rest/v1/plans?select=slug,name&status=in.(published,active,Published,ACTIVE)&order=name.asc`,
  { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
);
const plans = await res.json();
console.log(`${plans.length} plans`);

// Fetch all Sanity images
const all = [];
let offset = 0;
while (true) {
  const q = encodeURIComponent(
    `*[_type == "sanity.imageAsset"] | order(_id asc) [${offset}...${offset + 500}] { _id, url, originalFilename }`
  );
  const r = await fetch(`https://${SANITY_PID}.api.sanity.io/v${SANITY_VER}/data/query/${SANITY_DS}?query=${q}`);
  const d = await r.json();
  const items = d?.result || [];
  all.push(...items);
  if (items.length < 500) break;
  offset += 500;
}
console.log(`${all.length} Sanity image assets`);

// Matching logic (same as sync script)
const norm = (s) =>
  decodeURIComponent(String(s || ""))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const keyToSlug = new Map();
for (const p of plans) {
  if (!p.slug) continue;
  keyToSlug.set(norm(p.slug), p.slug);
  if (p.name) {
    const nk = norm(p.name);
    if (nk) keyToSlug.set(nk, p.slug);
  }
}
const sortedKeys = [...keyToSlug.keys()].sort((a, b) => b.length - a.length);

const map = {};
for (const p of plans) {
  if (p.slug) map[p.slug] = { front: null, gallery: [] };
}

let matched = 0, skippedThumb = 0, skippedMobile = 0, unmatched = 0;

for (const asset of all) {
  const fn = asset.originalFilename || "";
  const fnNorm = norm(fn);
  const fnLower = fn.toLowerCase();

  if (fnLower.includes("-thumb") || fnNorm.includes("-thumb")) { skippedThumb++; continue; }
  if (fnLower.includes("-mobile") || fnNorm.includes("-mobile")) { skippedMobile++; continue; }

  let matchedSlug = null;
  for (const key of sortedKeys) {
    if (fnNorm.startsWith(key) || fnNorm.includes(key)) {
      matchedSlug = keyToSlug.get(key);
      break;
    }
  }
  if (!matchedSlug || !map[matchedSlug]) { unmatched++; continue; }

  matched++;
  const entry = map[matchedSlug];
  if (fnLower.includes("front-image") || fnLower.includes("front%20image") || fnLower.includes("-v1")) {
    if (!entry.front) entry.front = asset.url;
    else entry.gallery.push(asset.url);
  } else {
    entry.gallery.push(asset.url);
  }
}

console.log(`\nMatching results:`);
console.log(`  Matched to plans: ${matched}`);
console.log(`  Skipped (thumb): ${skippedThumb}`);
console.log(`  Skipped (mobile): ${skippedMobile}`);
console.log(`  Unmatched: ${unmatched}`);

const withFront = Object.entries(map).filter(([, v]) => v.front);
const withAny = Object.entries(map).filter(([, v]) => v.front || v.gallery.length > 0);
const withNone = Object.entries(map).filter(([, v]) => !v.front && v.gallery.length === 0);

console.log(`\nPlan coverage:`);
console.log(`  Plans with front image: ${withFront.length}`);
console.log(`  Plans with any image: ${withAny.length}`);
console.log(`  Plans with NO images: ${withNone.length}`);

// Show a few examples
console.log(`\nSample plans with images:`);
for (const [slug, v] of withAny.slice(0, 5)) {
  console.log(`  ${slug}: front=${v.front ? "YES" : "no"}, gallery=${v.gallery.length}`);
}

console.log(`\nPlans with NO images:`);
for (const [slug] of withNone) {
  console.log(`  ${slug}`);
}
