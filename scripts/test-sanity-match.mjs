import { config } from "dotenv";
config({ path: ".env.local" });

const SANITY_PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DS = process.env.NEXT_PUBLIC_SANITY_DATASET;

// Get a sample of image assets with their filenames
const q = encodeURIComponent('*[_type == "sanity.imageAsset"] | order(originalFilename asc) [0..29] { _id, url, originalFilename }');
const res = await fetch(`https://${SANITY_PID}.api.sanity.io/v2025-01-01/data/query/${SANITY_DS}?query=${q}`);
const data = await res.json();

console.log("Sample filenames:");
for (const a of data.result) {
  console.log(`  ${a.originalFilename}`);
}

// Check a specific plan slug
const testSlug = "cottage-retreat-house-plan";
const q2 = encodeURIComponent(`*[_type == "sanity.imageAsset" && originalFilename match "*cottage-retreat*"] { _id, url, originalFilename }`);
const res2 = await fetch(`https://${SANITY_PID}.api.sanity.io/v2025-01-01/data/query/${SANITY_DS}?query=${q2}`);
const data2 = await res2.json();
console.log(`\nImages matching "cottage-retreat": ${data2.result.length}`);
for (const a of data2.result) {
  console.log(`  ${a.originalFilename} -> ${a.url}`);
}

// Also check "crystal-house-plan" since that one had images in Shopify
const q3 = encodeURIComponent(`*[_type == "sanity.imageAsset" && originalFilename match "*crystal*"] { _id, url, originalFilename }`);
const res3 = await fetch(`https://${SANITY_PID}.api.sanity.io/v2025-01-01/data/query/${SANITY_DS}?query=${q3}`);
const data3 = await res3.json();
console.log(`\nImages matching "crystal": ${data3.result.length}`);
for (const a of data3.result) {
  console.log(`  ${a.originalFilename}`);
}
