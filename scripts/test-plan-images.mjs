import { config } from "dotenv";
config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SANITY_PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DS = process.env.NEXT_PUBLIC_SANITY_DATASET;

// Fetch a few plans and inspect their image-related fields
const res = await fetch(
  `${SUPABASE_URL}/rest/v1/plans?select=slug,name,images,filters&status=in.(published,active,Published,ACTIVE)&limit=5`,
  { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
);
const plans = await res.json();

for (const p of plans) {
  console.log(`\n=== ${p.slug} ===`);
  console.log("images:", JSON.stringify(p.images, null, 2));
  const f = p.filters || {};
  console.log("filters.galleryImages:", JSON.stringify(f.galleryImages?.slice(0, 3)));
  console.log("filters.floorplanImages:", JSON.stringify(f.floorplanImages?.slice(0, 3)));
}

// If there are Sanity asset IDs, try resolving one
const firstPlan = plans[0];
const f = firstPlan?.filters || {};
const sampleIds = [...(f.galleryImages || []), ...(f.floorplanImages || [])].slice(0, 3);
if (sampleIds.length > 0) {
  console.log("\n--- Resolving sample Sanity asset IDs ---");
  console.log("IDs:", sampleIds);
  const q = encodeURIComponent(`*[_id in $ids] { _id, url }`);
  const params = encodeURIComponent(JSON.stringify({ ids: sampleIds }));
  const sUrl = `https://${SANITY_PID}.api.sanity.io/v2025-01-01/data/query/${SANITY_DS}?query=${q}&$ids=${params}`;
  const sRes = await fetch(sUrl);
  const sData = await sRes.json();
  console.log("Resolved:", JSON.stringify(sData.result, null, 2));
} else {
  console.log("\nNo Sanity asset IDs found in filters");
}
