import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "node:fs";
import path from "node:path";
import { getSanityClient } from "../src/lib/sanity/client";

type Args = {
  exteriorPath: string;
  floorplanPath: string;
  dryRun: boolean;
  overwrite: boolean;
  forceUpload: boolean;
};

function parseArgs(argv: string[]): Args {
  const defaults: Args = {
    exteriorPath:
      "D:\\New Website Assets\\Website Images\\Website Images_Processed\\site-avif-desktop\\Product Details Page\\Not-So-Big-House-Plans-Design-Principles-desktop.avif",
    floorplanPath:
      "D:\\New Website Assets\\Website Images\\Website Images_Processed\\site-avif-desktop\\Product Details Page\\residential-floor-plan-design-desktop.avif",
    dryRun: false,
    overwrite: false,
    forceUpload: false,
  };

  for (const a of argv) {
    if (a === "--dry-run") defaults.dryRun = true;
    if (a === "--overwrite") defaults.overwrite = true;
    if (a === "--force-upload") defaults.forceUpload = true;
    if (a.startsWith("--exterior=")) defaults.exteriorPath = a.slice("--exterior=".length);
    if (a.startsWith("--floorplan=")) defaults.floorplanPath = a.slice("--floorplan=".length);
  }

  return defaults;
}

function imageRef(assetId: string) {
  return {
    _type: "image",
    asset: { _type: "reference", _ref: assetId },
  } as const;
}

async function findExistingAssetIdByFilename(sanity: any, filename: string): Promise<string | null> {
  const existing = (await sanity.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]{_id}`,
    { filename },
  )) as any;
  return existing?._id ? String(existing._id) : null;
}

async function uploadImageAsset(sanity: any, filePath: string, forceUpload: boolean): Promise<string> {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    throw new Error(`Missing local file: ${abs}`);
  }

  const filename = path.basename(abs);

  if (!forceUpload) {
    const existingId = await findExistingAssetIdByFilename(sanity, filename);
    if (existingId) return existingId;
  }

  const stream = fs.createReadStream(abs);
  const uploaded = (await sanity.assets.upload("image", stream, { filename })) as any;
  const assetId = uploaded?._id ? String(uploaded._id) : null;
  if (!assetId) throw new Error(`Upload succeeded but no asset id returned for ${filename}`);
  return assetId;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const token = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_API_TOKEN;
  if (!token) {
    throw new Error(
      "Missing SANITY_API_WRITE_TOKEN (or SANITY_API_TOKEN) in .env.local. Create a Sanity API token with write access and set SANITY_API_WRITE_TOKEN=...",
    );
  }

  const sanity = getSanityClient({ token, useCdn: false, perspective: "published" });

  const exteriorFilename = path.basename(args.exteriorPath);
  const floorplanFilename = path.basename(args.floorplanPath);

  const planMediaIds = (await sanity.fetch(`*[_type == "planMedia"]._id`)) as string[];
  const ids = Array.isArray(planMediaIds) ? planMediaIds.map(String) : [];

  if (ids.length === 0) {
    console.log("No planMedia documents found.");
    return;
  }

  if (args.dryRun) {
    console.log(`[dry-run] Would upload/reuse assets:`);
    console.log(`- exterior: ${args.exteriorPath}`);
    console.log(`- floorplan: ${args.floorplanPath}`);
    console.log(`[dry-run] Would patch ${ids.length} planMedia docs (${args.overwrite ? "overwrite" : "set-if-missing"}).`);
    return;
  }

  console.log(`Uploading/reusing assets...`);
  const exteriorAssetId = await uploadImageAsset(sanity, args.exteriorPath, args.forceUpload);
  const floorplanAssetId = await uploadImageAsset(sanity, args.floorplanPath, args.forceUpload);

  console.log(`- exterior (${exteriorFilename}): ${exteriorAssetId}`);
  console.log(`- floorplan (${floorplanFilename}): ${floorplanAssetId}`);

  const exteriorValue = imageRef(exteriorAssetId);
  const floorplanValue = imageRef(floorplanAssetId);

  const chunkSize = 50;
  let updated = 0;

  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    let tx = sanity.transaction();

    for (const id of chunk) {
      if (args.overwrite) {
        tx = tx.patch(id, (p: any) =>
          p.set({ buildFeatureExterior: exteriorValue, buildFeatureFloorplan: floorplanValue }),
        );
      } else {
        tx = tx.patch(id, (p: any) =>
          p.setIfMissing({ buildFeatureExterior: exteriorValue, buildFeatureFloorplan: floorplanValue }),
        );
      }
    }

    await tx.commit({ autoGenerateArrayKeys: true });
    updated += chunk.length;
    console.log(`Patched ${updated}/${ids.length} planMedia docs...`);
  }

  console.log(
    `Done. Set Build-tab images on ${ids.length} planMedia docs (${args.overwrite ? "overwrite" : "set-if-missing"}).`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
