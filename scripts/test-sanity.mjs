import { config } from "dotenv";
config({ path: ".env.local" });

const pid = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const ds = process.env.NEXT_PUBLIC_SANITY_DATASET;

// Test 1: How many planMedia docs exist?
const q1 = encodeURIComponent('{"total": count(*[_type == "planMedia"]), "sample": *[_type == "planMedia"][0..2] { planSlug, "thumb": frontThumbnail.asset->url, "galleryCount": count(gallery), "fpCount": count(floorplans) }}');
const url1 = `https://${pid}.api.sanity.io/v2025-01-01/data/query/${ds}?query=${q1}`;

const res1 = await fetch(url1);
const data1 = await res1.json();
console.log("planMedia docs:", JSON.stringify(data1.result, null, 2));

// Test 2: Check what _types exist that might have images
const q2 = encodeURIComponent('array::unique(*[]._type)');
const url2 = `https://${pid}.api.sanity.io/v2025-01-01/data/query/${ds}?query=${q2}`;
const res2 = await fetch(url2);
const data2 = await res2.json();
console.log("\nAll document types:", data2.result);
