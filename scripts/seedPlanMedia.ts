import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import crypto from "node:crypto";
import { getSanityClient } from "../src/lib/sanity/client";
import { getSupabaseAdmin } from "../src/lib/supabaseAdmin";

type Args = {
  dryRun: boolean;
  overwriteTitle: boolean;
  limit: number | null;
  status: string | null;
  slugs: string[] | null;
};

function parseArgs(argv: string[]): Args {
  const args: Args = { dryRun: false, overwriteTitle: false, limit: null, status: null, slugs: null };

  for (const a of argv) {
    if (a === "--dry-run") args.dryRun = true;
    if (a === "--overwrite-title") args.overwriteTitle = true;
    if (a.startsWith("--slugs=")) {
      const raw = a.slice("--slugs=".length);
      const slugs = raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      args.slugs = slugs.length ? slugs : null;
    }
    if (a.startsWith("--slug=")) {
      const raw = a.slice("--slug=".length).trim();
      if (raw) args.slugs = [...new Set([...(args.slugs ?? []), raw])];
    }
    if (a.startsWith("--limit=")) {
      const raw = a.slice("--limit=".length);
      const n = Number(raw);
      args.limit = Number.isFinite(n) ? n : null;
    }
    if (a.startsWith("--status=")) {
      const raw = a.slice("--status=".length);
      args.status = raw.trim() ? raw.trim() : null;
    }
  }

  return args;
}

function stablePlanMediaIdForSlug(slug: string) {
  const s = String(slug || "").trim();
  const direct = `planMedia.${s}`;
  // Sanity document IDs must not exceed 128 chars.
  if (direct.length <= 128) return direct;
  const hash = crypto.createHash("sha1").update(s).digest("hex");
  return `planMedia.${hash}`;
}

async function main() {
  const { dryRun, overwriteTitle, limit, status, slugs } = parseArgs(process.argv.slice(2));

  const token = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_API_TOKEN;
  if (!token) {
    throw new Error(
      "Missing SANITY_API_WRITE_TOKEN (or SANITY_API_TOKEN) in .env.local. Create a Sanity API token with write access and set SANITY_API_WRITE_TOKEN=...",
    );
  }

  const sanity = getSanityClient({ token, useCdn: false, perspective: "published" });
  const supabase = getSupabaseAdmin() as any;

  let query = supabase.from("plans").select("slug, name, status").order("slug", { ascending: true });
  if (status) query = query.eq("status", status);
  if (slugs && slugs.length > 0) query = query.in("slug", slugs);
  if (typeof limit === "number" && limit > 0) query = query.limit(limit);

  const { data: plans, error }: any = await query;
  if (error) throw error;

  const rows = (plans ?? []) as Array<{ slug: string; name: string; status?: string | null }>;
  if (rows.length === 0) {
    console.log("No plans found to seed.");
    return;
  }

  let created = 0;
  let patched = 0;
  let updatedTitles = 0;
  let updatedSlugs = 0;

  for (const p of rows) {
    const slug = String(p.slug || "").trim();
    const name = String(p.name || "").trim();
    if (!slug || !name) {
      console.log(`Skipping invalid plan row: ${JSON.stringify(p)}`);
      continue;
    }

    const existingBySlug = (await sanity.fetch(
      `*[_type == "planMedia" && planSlug == $slug][0]{ _id, title, planSlug }`,
      { slug },
    )) as any;

    const _id = existingBySlug?._id ? String(existingBySlug._id) : stablePlanMediaIdForSlug(slug);

    const createDoc = {
      _id,
      _type: "planMedia",
      title: name,
      planSlug: slug,
    } as any;

    const before: any = existingBySlug ?? (await sanity.getDocument(_id));
    const beforeTitle = String(before?.title ?? "").trim();
    const beforeSlug = String(before?.planSlug ?? "").trim();

    const needsCreate = !before;
    const needsSlugUpdate = Boolean(before) && beforeSlug && beforeSlug !== slug;
    const needsTitleUpdate = Boolean(overwriteTitle) && Boolean(before) && beforeTitle !== name;

    if (dryRun) {
      if (needsCreate) {
        console.log(`[dry-run] create ${_id} (title=${JSON.stringify(name)}, planSlug=${JSON.stringify(slug)})`);
      } else {
        const changes: string[] = [];
        if (!beforeSlug || beforeSlug !== slug) changes.push(`planSlug: ${JSON.stringify(beforeSlug)} -> ${JSON.stringify(slug)}`);
        if (overwriteTitle && beforeTitle !== name) changes.push(`title: ${JSON.stringify(beforeTitle)} -> ${JSON.stringify(name)}`);

        if (changes.length === 0) {
          console.log(`[dry-run] ok ${_id} (no changes)`);
        } else {
          console.log(`[dry-run] patch ${_id} (${changes.join(", ")})`);
        }
      }
      continue;
    }

    await sanity.createIfNotExists(createDoc);
    if (needsCreate) created += 1;

    const patch = sanity.patch(_id).set({ planSlug: slug });
    if (overwriteTitle) {
      patch.set({ title: name } as any);
    } else {
      patch.setIfMissing({ title: name } as any);
    }
    await patch.commit({ autoGenerateArrayKeys: true });

    patched += 1;
    if (needsSlugUpdate) updatedSlugs += 1;
    if (needsTitleUpdate) updatedTitles += 1;
  }

  console.log(`Seeded plan media for ${rows.length} plans (created=${created}, patched=${patched}).`);
  if (overwriteTitle) {
    console.log(`Synced titles from Supabase (updatedTitles=${updatedTitles}).`);
  }
  console.log(`Updated planSlug for docs that existed but had a different slug (updatedSlugs=${updatedSlugs}).`);
  console.log("Note: This script never overwrites image fields.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
