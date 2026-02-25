import { config } from "dotenv";
config({ path: ".env.local" });

const SANITY_PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DS = process.env.NEXT_PUBLIC_SANITY_DATASET;
const SANITY_VER = "2025-01-01";

// Search for images that might match "cottage retreat" or "crystal"
for (const term of ["cottage", "crystal"]) {
  const q = encodeURIComponent(`*[_type == "sanity.imageAsset" && originalFilename match "*${term}*"] { originalFilename, url }`);
  const r = await fetch(`https://${SANITY_PID}.api.sanity.io/v${SANITY_VER}/data/query/${SANITY_DS}?query=${q}`);
  const d = await r.json();
  console.log(`\n"${term}" matches (${d.result.length}):`);
  for (const a of d.result) {
    console.log(`  ${a.originalFilename}`);
  }
}
