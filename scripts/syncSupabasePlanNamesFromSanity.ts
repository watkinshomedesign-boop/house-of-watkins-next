import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { getSanityClient } from "../src/lib/sanity/client";
import { getSupabaseAdmin } from "../src/lib/supabaseAdmin";

type Args = {
  dryRun: boolean;
  apply: boolean;
  limit: number | null;
  status: string | null;
};

function parseArgs(argv: string[]): Args {
  const args: Args = { dryRun: true, apply: false, limit: null, status: null };

  for (const a of argv) {
    if (a === "--dry-run") {
      args.dryRun = true;
      args.apply = false;
    }
    if (a === "--apply") {
      args.apply = true;
      args.dryRun = false;
    }
    if (a.startsWith("--limit=")) {
      const raw = a.slice("--limit=".length);
      const n = Number(raw);
      args.limit = Number.isFinite(n) ? Math.max(1, Math.floor(n)) : null;
    }
    if (a.startsWith("--status=")) {
      const raw = a.slice("--status=".length);
      args.status = raw.trim() ? raw.trim() : null;
    }
  }

  return args;
}

async function main() {
  const { dryRun, apply, limit, status } = parseArgs(process.argv.slice(2));

  const token = process.env.SANITY_API_READ_TOKEN ?? process.env.SANITY_API_TOKEN;
  if (!token) {
    throw new Error(
      "Missing SANITY_API_READ_TOKEN (or SANITY_API_TOKEN) in .env.local. Create a Sanity API token with read access and set SANITY_API_READ_TOKEN=...",
    );
  }

  const sanity = getSanityClient({ token, useCdn: false, perspective: "published" });
  const supabase = getSupabaseAdmin() as any;

  const groq = `*[_type == "planMedia" && defined(planSlug) && defined(title)]{ planSlug, title }`;
  const sanityRows = (await sanity.fetch(groq)) as Array<{ planSlug: string; title: string }>;

  const titleBySlug = new Map<string, string>();
  for (const r of sanityRows ?? []) {
    const slug = String(r?.planSlug ?? "").trim();
    const title = String(r?.title ?? "").trim();
    if (!slug || !title) continue;
    // If duplicates exist, keep the first seen (stable) and log later via count.
    if (!titleBySlug.has(slug)) titleBySlug.set(slug, title);
  }

  if (titleBySlug.size === 0) {
    console.log("No planMedia rows found in Sanity.");
    return;
  }

  let query = supabase.from("plans").select("id, slug, name, status").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  if (typeof limit === "number" && limit > 0) query = query.limit(limit);

  const { data: plans, error }: any = await query;
  if (error) throw error;

  const rows = (plans ?? []) as Array<{ id: string; slug: string; name: string; status?: string | null }>;
  if (rows.length === 0) {
    console.log("No plans found in Supabase.");
    return;
  }

  let scanned = 0;
  let missingInSanity = 0;
  let wouldUpdate = 0;
  let updated = 0;

  for (const p of rows) {
    scanned += 1;
    const slug = String(p.slug ?? "").trim();
    if (!slug) continue;

    const sanityTitle = titleBySlug.get(slug);
    if (!sanityTitle) {
      missingInSanity += 1;
      continue;
    }

    const currentName = String(p.name ?? "").trim();
    if (currentName === sanityTitle) continue;

    wouldUpdate += 1;

    if (dryRun) {
      console.log(`[dry-run] update plans.slug=${slug} name: ${JSON.stringify(currentName)} -> ${JSON.stringify(sanityTitle)}`);
      continue;
    }

    if (apply) {
      const { error: updErr }: any = await supabase.from("plans").update({ name: sanityTitle }).eq("slug", slug);
      if (updErr) throw updErr;
      updated += 1;
      console.log(`[apply] updated plans.slug=${slug} name -> ${JSON.stringify(sanityTitle)}`);
    }
  }

  console.log(
    JSON.stringify(
      {
        mode: dryRun ? "dry-run" : "apply",
        statusFilter: status,
        limit,
        sanityPlanMediaCount: sanityRows.length,
        uniqueSlugsInSanity: titleBySlug.size,
        scannedSupabasePlans: scanned,
        missingInSanity,
        wouldUpdate,
        updated,
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
