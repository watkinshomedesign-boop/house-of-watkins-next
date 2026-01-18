import dotenv from "dotenv";
import { readdir } from "fs/promises";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { getSanityClient } from "../src/lib/sanity/client";

dotenv.config({ path: ".env.local" });

/**
 * Sync URL slugs between local thumbnail folders, Supabase, and Sanity.
 *
 * Env vars (Supabase):
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY (preferred for updates) OR NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * Env vars (Sanity):
 * - NEXT_PUBLIC_SANITY_PROJECT_ID
 * - NEXT_PUBLIC_SANITY_DATASET
 * - SANITY_API_WRITE_TOKEN (preferred for updates) OR SANITY_API_TOKEN
 *
 * Usage:
 * - node --import tsx scripts/sync-slugs.ts
 * - node --import tsx scripts/sync-slugs.ts --apply
 * - node --import tsx scripts/sync-slugs.ts --root "C:\\Users\\user\\Downloads\\moss-clone-nextjs-fixed\\repo\\assets\\products-thumb" --apply
 */

type Args = {
  root: string;
  apply: boolean;
};

type FolderRow = {
  folderName: string;
  folderPath: string;
  imageFileName: string;
  baseName: string;
  derivedSlug: string;
  slug: string;
};

type SupabasePlan = {
  id: string;
  name: string;
  slug: string | null;
};

type SanityPlanMedia = {
  _id: string;
  title: string;
  planSlug: string;
};

type Status = "no match" | "duplicate match" | "same" | "will update" | "updated" | "skipped";

const DEFAULT_ROOT = "C:\\Users\\user\\Downloads\\moss-clone-nextjs-fixed\\repo\\assets\\products-thumb";

type MatchOverride = {
  supabaseName?: string;
  sanityTitle?: string;
  ignore?: boolean;
};

const MATCH_OVERRIDES: Record<string, MatchOverride> = {
  "ADU over Garage": { supabaseName: "ADU Over 2-Car Garage", sanityTitle: "ADU Over 2-Car Garage" },
  "Cherry Creek 4 Car": { supabaseName: "Cherry Creek House Plan", sanityTitle: "Cherry Creek House Plan" },
  "Metropolitain Sanctuary": { supabaseName: "Metropolitan Sanctuary", sanityTitle: "Metropolitan Sanctuary" },
  "Minimal Elegance": { supabaseName: "Minimalist Elegance", sanityTitle: "Minimalist Elegance" },
  "Modern Family Comfort": { supabaseName: "Family comfort House Plan", sanityTitle: "Family comfort House Plan" },
  "Narrow Lot Contemporary": { supabaseName: "Narrow Lot House Plan", sanityTitle: "Narrow Lot House Plan" },
  "Rivers Edge": { supabaseName: "Wolf's Ridge", sanityTitle: "Wolf's Ridge" },
  "Rosebud 2 Car": { supabaseName: "Rosebud House Plan", sanityTitle: "Rosebud House Plan" },
  "Sage House Plan": { supabaseName: "Sage Cottage", sanityTitle: "Sage Cottage" },
  "Via Gardenia": { ignore: true },
};

function parseArgs(argv: string[]): Args {
  let root = DEFAULT_ROOT;
  let apply = false;

  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--apply") apply = true;
    if (a === "--root" && argv[i + 1]) {
      root = argv[i + 1];
      i += 1;
    }
    if (a.startsWith("--root=")) {
      root = a.slice("--root=".length);
    }
  }

  return { root, apply };
}

function isImageFileName(name: string) {
  const n = String(name || "").toLowerCase();
  return n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".png") || n.endsWith(".webp");
}

function stripThumbSuffix(fileName: string) {
  const n = String(fileName || "").trim();
  const ext = path.extname(n);
  const base = path.basename(n, ext);
  return base.toLowerCase().endsWith("-thumb") ? base.slice(0, -"-thumb".length) : base;
}

function getBaseNameFromImage(fileName: string) {
  const n = String(fileName || "").trim();
  const ext = path.extname(n);
  if (!ext) return stripThumbSuffix(n);
  return stripThumbSuffix(path.basename(n, ext));
}

function toSlug(baseName: string) {
  const raw = String(baseName || "").trim().toLowerCase();
  const step1 = raw.replace(/[\s_]+/g, "-");
  const step2 = step1.replace(/[^a-z0-9-]/g, "");
  const step3 = step2.replace(/-+/g, "-");
  return step3.replace(/^-+/, "").replace(/-+$/, "");
}

function toComparableName(v: string) {
  return String(v || "")
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function getFolders(rootPath: string) {
  const entries = await readdir(rootPath, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory())
    .map((e) => ({ name: e.name, path: path.join(rootPath, e.name) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function getSingleImageFile(folderPath: string) {
  const entries = await readdir(folderPath, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile()).map((e) => e.name);
  const images = files.filter(isImageFileName);
  if (images.length !== 1) return null;
  return images[0];
}

function uniquifySlug(slug: string, used: Set<string>) {
  const base = String(slug || "").trim();
  if (!base) return base;
  if (!used.has(base)) {
    used.add(base);
    return base;
  }
  let i = 1;
  while (true) {
    const candidate = `${base}-v${i}`;
    if (!used.has(candidate)) {
      used.add(candidate);
      return candidate;
    }
    i += 1;
  }
}

async function scanFolders(root: string): Promise<FolderRow[]> {
  const folders = await getFolders(root);
  const out: FolderRow[] = [];

  for (const f of folders) {
    const imageFileName = await getSingleImageFile(f.path);
    if (!imageFileName) {
      console.warn(`[skip] ${f.name}: expected exactly one image file (.jpg/.jpeg/.png/.webp)`);
      continue;
    }

    const baseName = getBaseNameFromImage(imageFileName);
    const derivedSlug = toSlug(baseName);
    if (!derivedSlug) {
      console.warn(`[skip] ${f.name}: could not derive slug from ${imageFileName}`);
      continue;
    }

    out.push({
      folderName: f.name,
      folderPath: f.path,
      imageFileName,
      baseName,
      derivedSlug,
      slug: derivedSlug,
    });
  }

  const used = new Set<string>();
  return out
    .sort((a, b) => a.folderName.localeCompare(b.folderName))
    .map((r) => ({ ...r, slug: uniquifySlug(r.slug, used) }));
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL in .env.local");
  const key = serviceKey || anonKey;
  if (!key) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");

  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function loadSupabasePlans(): Promise<SupabasePlan[]> {
  const supabase = getSupabaseClient() as any;

  const pageSize = 1000;
  let offset = 0;
  const rows: SupabasePlan[] = [];

  while (true) {
    const { data, error } = await supabase
      .from("plans")
      .select("id,name,slug")
      .order("name", { ascending: true })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;
    rows.push(
      ...(data ?? []).map((r: any) => ({
        id: String(r.id),
        name: String(r.name ?? ""),
        slug: r.slug == null ? null : String(r.slug),
      })),
    );

    if (!data || data.length < pageSize) break;
    offset += pageSize;
  }

  return rows;
}

async function updateSupabaseSlug(planId: string, slug: string, apply: boolean) {
  if (!apply) {
    console.log(`[dry-run] Supabase: set plans.id=${planId} slug=${JSON.stringify(slug)}`);
    return;
  }

  const supabase = getSupabaseClient() as any;
  const { error } = await supabase.from("plans").update({ slug }).eq("id", planId);
  if (error) throw error;
  console.log(`[apply] Supabase: updated plans.id=${planId} slug=${JSON.stringify(slug)}`);
}

function getSanityWriteClient() {
  const token = process.env.SANITY_API_WRITE_TOKEN ?? process.env.SANITY_API_TOKEN;
  if (!token) {
    throw new Error(
      "Missing SANITY_API_WRITE_TOKEN (or SANITY_API_TOKEN) in .env.local. Create a Sanity API token with write access and set SANITY_API_WRITE_TOKEN=...",
    );
  }
  return getSanityClient({ token, useCdn: false, perspective: "published" });
}

async function loadSanityPlanMedia(): Promise<SanityPlanMedia[]> {
  const sanity = getSanityWriteClient() as any;
  const groq = `*[_type == "planMedia" && defined(title)]{ _id, title, planSlug }`;
  const rows = (await sanity.fetch(groq)) as any[];
  return (rows ?? []).map((r) => ({
    _id: String(r._id),
    title: String(r.title ?? ""),
    planSlug: String(r.planSlug ?? ""),
  }));
}

async function updateSanitySlug(docId: string, slug: string, apply: boolean) {
  if (!apply) {
    console.log(`[dry-run] Sanity: set planMedia._id=${docId} planSlug=${JSON.stringify(slug)}`);
    return;
  }

  const sanity = getSanityWriteClient() as any;
  await sanity.patch(docId).set({ planSlug: slug }).commit({ autoGenerateArrayKeys: true });
  console.log(`[apply] Sanity: updated planMedia._id=${docId} planSlug=${JSON.stringify(slug)}`);
}

function indexByComparableName<T extends { name?: string; title?: string }>(
  rows: T[],
  getName: (r: T) => string,
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const r of rows) {
    const key = toComparableName(getName(r));
    if (!key) continue;
    const arr = map.get(key) ?? [];
    arr.push(r);
    map.set(key, arr);
  }
  return map;
}

function indexBySlug<T extends { slug?: string | null; planSlug?: string }>(rows: T[], getSlug: (r: T) => string) {
  const map = new Map<string, T[]>();
  for (const r of rows) {
    const s = String(getSlug(r) || "").trim();
    if (!s) continue;
    const arr = map.get(s) ?? [];
    arr.push(r);
    map.set(s, arr);
  }
  return map;
}

function chooseSingleMatch<T>(candidates: T[] | undefined | null): { match: T | null; reason: "no" | "multi" | "ok" } {
  const arr = candidates ?? [];
  if (arr.length === 0) return { match: null, reason: "no" };
  if (arr.length > 1) return { match: null, reason: "multi" };
  return { match: arr[0], reason: "ok" };
}

function findUniqueContainsMatch<T>(rows: T[], getName: (r: T) => string, needleRaw: string) {
  const needle = toComparableName(needleRaw);
  if (!needle) return { match: null as T | null, reason: "no" as const };
  if (needle.length < 4) return { match: null as T | null, reason: "no" as const };

  const hits = rows.filter((r) => {
    const hay = toComparableName(getName(r));
    if (!hay) return false;
    return hay.includes(needle) || needle.includes(hay);
  });

  return chooseSingleMatch(hits);
}

type SyncRow = {
  folderName: string;
  imageFileName: string;
  baseName: string;
  slug: string;
  supabaseStatus: Status;
  sanityStatus: Status;
  supabaseId?: string;
  sanityId?: string;
};

async function run() {
  const args = parseArgs(process.argv.slice(2));

  const folderRows = await scanFolders(args.root);
  const supabasePlans = await loadSupabasePlans();
  const sanityDocs = await loadSanityPlanMedia();

  const supabaseByName = indexByComparableName(supabasePlans as any, (r: any) => r.name);
  const sanityByTitle = indexByComparableName(sanityDocs as any, (r: any) => r.title);

  const supabaseBySlug = indexBySlug(supabasePlans as any, (r: any) => String(r.slug ?? ""));
  const sanityBySlug = indexBySlug(sanityDocs as any, (r: any) => String(r.planSlug ?? ""));

  const updates: SyncRow[] = [];
  const missing: Array<{ folderName: string; baseName: string; slug: string }> = [];

  for (const fr of folderRows) {
    const override = MATCH_OVERRIDES[fr.folderName];

    if (override?.ignore) {
      updates.push({
        folderName: fr.folderName,
        imageFileName: fr.imageFileName,
        baseName: fr.baseName,
        slug: fr.slug,
        supabaseStatus: "skipped",
        sanityStatus: "skipped",
      });
      continue;
    }

    const keyFolder = toComparableName(fr.folderName);
    const keyBase = toComparableName(fr.baseName);

    const supByOverride = override?.supabaseName
      ? supabaseByName.get(toComparableName(override.supabaseName)) ?? []
      : [];
    const sanByOverride = override?.sanityTitle
      ? sanityByTitle.get(toComparableName(override.sanityTitle)) ?? []
      : [];

    const supByName = supByOverride.length ? supByOverride : (supabaseByName.get(keyFolder) ?? supabaseByName.get(keyBase) ?? []);
    const sanByName = sanByOverride.length ? sanByOverride : (sanityByTitle.get(keyFolder) ?? sanityByTitle.get(keyBase) ?? []);

    const supByExistingSlug = supabaseBySlug.get(fr.slug) ?? supabaseBySlug.get(fr.derivedSlug) ?? [];
    const sanByExistingSlug = sanityBySlug.get(fr.slug) ?? sanityBySlug.get(fr.derivedSlug) ?? [];

    const supPrimary = chooseSingleMatch(supByName.length ? supByName : supByExistingSlug);
    const supPick =
      supPrimary.reason === "ok"
        ? supPrimary
        : (() => {
            const needle1 = override?.supabaseName ?? fr.folderName;
            const byFolder = findUniqueContainsMatch(supabasePlans, (p: SupabasePlan) => p.name, needle1);
            if (byFolder.reason === "ok") return byFolder;
            return findUniqueContainsMatch(supabasePlans, (p: SupabasePlan) => p.name, fr.baseName);
          })();

    const sanPrimary = chooseSingleMatch(sanByName.length ? sanByName : sanByExistingSlug);
    const sanPick =
      sanPrimary.reason === "ok"
        ? sanPrimary
        : (() => {
            const needle1 = override?.sanityTitle ?? fr.folderName;
            const byFolder = findUniqueContainsMatch(sanityDocs, (d: SanityPlanMedia) => d.title, needle1);
            if (byFolder.reason === "ok") return byFolder;
            return findUniqueContainsMatch(sanityDocs, (d: SanityPlanMedia) => d.title, fr.baseName);
          })();

    let supabaseStatus: Status = "skipped";
    let sanityStatus: Status = "skipped";

    const outRow: SyncRow = {
      folderName: fr.folderName,
      imageFileName: fr.imageFileName,
      baseName: fr.baseName,
      slug: fr.slug,
      supabaseStatus,
      sanityStatus,
    };

    if (supPick.reason === "no") {
      supabaseStatus = "no match";
    } else if (supPick.reason === "multi") {
      supabaseStatus = "duplicate match";
    } else {
      const plan = supPick.match as any as SupabasePlan;
      outRow.supabaseId = plan.id;
      const current = String(plan.slug ?? "").trim();
      supabaseStatus = current === fr.slug ? "same" : "will update";
    }

    if (sanPick.reason === "no") {
      sanityStatus = "no match";
    } else if (sanPick.reason === "multi") {
      sanityStatus = "duplicate match";
    } else {
      const doc = sanPick.match as any as SanityPlanMedia;
      outRow.sanityId = doc._id;
      const current = String(doc.planSlug ?? "").trim();
      sanityStatus = current === fr.slug ? "same" : "will update";
    }

    outRow.supabaseStatus = supabaseStatus;
    outRow.sanityStatus = sanityStatus;

    if (supabaseStatus === "no match" && sanityStatus === "no match") {
      missing.push({ folderName: fr.folderName, baseName: fr.baseName, slug: fr.slug });
    }

    updates.push(outRow);
  }

  console.table(
    updates.map((r) => ({
      folderName: r.folderName,
      imageFileName: r.imageFileName,
      baseName: r.baseName,
      slug: r.slug,
      supabase: r.supabaseStatus,
      sanity: r.sanityStatus,
    })),
  );

  if (missing.length > 0) {
    console.log("\nMissing (no match in Supabase AND no match in Sanity):");
    for (const m of missing) {
      console.log(`- ${m.folderName} (base=${m.baseName}, slug=${m.slug})`);
    }
  }

  if (!args.apply) {
    console.log("\nDry run only. Re-run with --apply to perform updates.");
    return;
  }

  for (const r of updates) {
    if (r.supabaseStatus === "will update" && r.supabaseId) {
      await updateSupabaseSlug(r.supabaseId, r.slug, true);
      r.supabaseStatus = "updated";
    }
    if (r.sanityStatus === "will update" && r.sanityId) {
      await updateSanitySlug(r.sanityId, r.slug, true);
      r.sanityStatus = "updated";
    }
  }

  console.log("\nApply complete.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
