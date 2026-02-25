import { config } from "dotenv";
config({ path: ".env.local" });

const SANITY_PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DS = process.env.NEXT_PUBLIC_SANITY_DATASET;
const SANITY_VER = "2025-01-01";

// Fetch ALL sanity image assets with dimensions
const all = [];
let offset = 0;
while (true) {
  const q = encodeURIComponent(
    `*[_type == "sanity.imageAsset"] | order(_id asc) [${offset}...${offset + 500}] { _id, url, originalFilename, "w": metadata.dimensions.width, "h": metadata.dimensions.height }`
  );
  const r = await fetch(`https://${SANITY_PID}.api.sanity.io/v${SANITY_VER}/data/query/${SANITY_DS}?query=${q}`);
  const d = await r.json();
  const items = d?.result || [];
  all.push(...items);
  if (items.length < 500) break;
  offset += 500;
}
console.log(`Total assets: ${all.length}\n`);

// Analyze aspect ratios and dimensions
const tall = []; // likely Pinterest (tall portrait)
const wide = []; // likely product images (landscape or square)
const other = [];

for (const a of all) {
  const fn = (a.originalFilename || "").toLowerCase();
  const w = a.w || 0;
  const h = a.h || 0;
  const ratio = h > 0 ? w / h : 0;
  
  a._ratio = ratio;
  a._fnLower = fn;
  
  // Pinterest pins are typically tall portrait (ratio < 0.75, like 800x1200 = 0.67)
  if (ratio > 0 && ratio < 0.75) {
    tall.push(a);
  } else if (ratio >= 0.75) {
    wide.push(a);
  } else {
    other.push(a);
  }
}

console.log(`Tall/portrait (likely Pinterest): ${tall.length}`);
console.log(`Wide/landscape/square (likely product): ${wide.length}`);
console.log(`No dimensions: ${other.length}`);

// Show sample tall images
console.log("\n--- Sample TALL images (likely Pinterest pins) ---");
for (const a of tall.slice(0, 15)) {
  console.log(`  ${a.w}x${a.h} ratio=${a._ratio.toFixed(2)} ${a.originalFilename}`);
}

// Show sample wide images
console.log("\n--- Sample WIDE images (likely product) ---");
for (const a of wide.slice(0, 15)) {
  console.log(`  ${a.w}x${a.h} ratio=${a._ratio.toFixed(2)} ${a.originalFilename}`);
}

// Check filename patterns in tall vs wide
const suffixes = ["-desktop", "-mobile", "-thumb", "-pin", "-pinterest", "-v1", "-v2", "-v3"];
console.log("\n--- Suffix distribution ---");
for (const suffix of suffixes) {
  const inTall = tall.filter(a => a._fnLower.includes(suffix)).length;
  const inWide = wide.filter(a => a._fnLower.includes(suffix)).length;
  console.log(`  "${suffix}": tall=${inTall}, wide=${inWide}`);
}

// Check common dimension pairs
const dimCounts = {};
for (const a of all) {
  const key = `${a.w}x${a.h}`;
  dimCounts[key] = (dimCounts[key] || 0) + 1;
}
const sorted = Object.entries(dimCounts).sort((a, b) => b[1] - a[1]);
console.log("\n--- Top 20 dimension pairs ---");
for (const [dim, count] of sorted.slice(0, 20)) {
  console.log(`  ${dim}: ${count}`);
}
