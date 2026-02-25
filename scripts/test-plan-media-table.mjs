import { config } from "dotenv";
config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };

// Check if plan_media table exists and what it contains
const res1 = await fetch(
  `${SUPABASE_URL}/rest/v1/plan_media?select=*&limit=5`,
  { headers }
);
if (res1.ok) {
  const rows = await res1.json();
  console.log(`plan_media table: ${rows.length} sample rows`);
  if (rows.length > 0) {
    console.log("Columns:", Object.keys(rows[0]));
    console.log("Sample:", JSON.stringify(rows[0], null, 2));
  }
} else {
  console.log("plan_media table:", res1.status, await res1.text());
}

// Check Supabase storage buckets
const res2 = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, { headers });
if (res2.ok) {
  const buckets = await res2.json();
  console.log("\nStorage buckets:", buckets.map(b => b.name));
} else {
  console.log("\nStorage buckets:", res2.status);
}

// Check what Sanity image assets look like
const SANITY_PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DS = process.env.NEXT_PUBLIC_SANITY_DATASET;
const q = encodeURIComponent('*[_type == "sanity.imageAsset"][0..2] { _id, url, originalFilename }');
const sRes = await fetch(`https://${SANITY_PID}.api.sanity.io/v2025-01-01/data/query/${SANITY_DS}?query=${q}`);
const sData = await sRes.json();
console.log("\nSanity image assets sample:", JSON.stringify(sData.result, null, 2));
console.log("Total sanity images:", sData.result?.length);

// Count total sanity image assets
const q2 = encodeURIComponent('count(*[_type == "sanity.imageAsset"])');
const sRes2 = await fetch(`https://${SANITY_PID}.api.sanity.io/v2025-01-01/data/query/${SANITY_DS}?query=${q2}`);
const sData2 = await sRes2.json();
console.log("Total sanity.imageAsset count:", sData2.result);
