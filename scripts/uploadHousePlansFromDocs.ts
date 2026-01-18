import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import path from "path";
import mammoth from "mammoth";
import { readdir } from "fs/promises";
import { createWriteStream } from "fs";
import { getSupabaseAdmin } from "../src/lib/supabaseAdmin";

type Args = {
  dryRun: boolean;
  limit: number | null;
  status: "draft" | "published" | "archived";
};

type GarageType = "front-load" | "side-load" | "detached";

const GENERIC_SLUG_WORDS = new Set(["with", "featuring", "only", "under"]);

type ParsedPlan = {
  sourceFile: string;
  slug: string;
  name: string;
  description: string;
  total_sqft: number;
  beds: number | null;
  baths: number | null;
  stories: number | null;
  garage_bays: number;
  width_ft: number;
  depth_ft: number;
  ceiling_height_ft: number;
  building_height_ft: string;
  roof_primary_slope: string;
  roof_secondary_slope: string | null;
  meta_description: string | null;
  status: "draft" | "published" | "archived";
  filters: {
    garageType: GarageType;
    foundationType: string | null;
    priceCents: number | null;
  };
  warnings: string[];
};

const DOCS_DIR = path.resolve(process.cwd(), "House Plan docs");
const LOG_PATH = path.resolve(process.cwd(), "upload-house-plans-log.txt");

function parseArgs(argv: string[]): Args {
  const args: Args = { dryRun: false, limit: null, status: "published" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") args.dryRun = true;
    else if (a === "--limit") {
      const n = Number(argv[i + 1]);
      i++;
      if (!Number.isFinite(n) || n <= 0) throw new Error("--limit must be a positive number");
      args.limit = n;
    } else if (a === "--status") {
      const v = String(argv[i + 1] || "").trim().toLowerCase();
      i++;
      if (v === "active") args.status = "published";
      else if (v === "draft" || v === "published" || v === "archived") args.status = v;
      else throw new Error("--status must be one of: active | draft | published | archived");
    }
  }
  return args;
}

function parseRoofSlopes(lines: string[], warnings: string[]): { roof_primary_slope: string; roof_secondary_slope: string | null } {
  // Examples: "6:12 slope" or "Roof: 4:12" etc.
  const slopes: string[] = [];
  for (const raw of lines.slice(0, 250)) {
    const m = raw.match(/\b(\d{1,2}\s*:\s*\d{1,2})\b/);
    if (!m) continue;
    const l = raw.toLowerCase();
    if (!l.includes("slope") && !l.includes("roof")) continue;
    slopes.push(m[1].replace(/\s+/g, ""));
    if (slopes.length >= 2) break;
  }
  const primary = slopes[0] || "flat";
  const secondary = slopes.length > 1 ? slopes[1] : null;
  if (!slopes.length) warnings.push("Could not parse roof slopes; defaulted roof_primary_slope to flat");
  return { roof_primary_slope: primary, roof_secondary_slope: secondary };
}

function parseBuildingHeightFt(lines: string[], warnings: string[]): string {
  // Examples: "27’-6” high" or "17’-5” high"
  for (const raw of lines.slice(0, 200)) {
    const l = raw.toLowerCase();
    if (!l.includes("high")) continue;
    const m = raw.match(/(\d{1,3})\s*[’']\s*-?\s*(\d{1,2})?\s*[”"]?\s*high\b/i);
    if (!m) continue;
    const ft = Number(m[1]);
    const inch = m[2] ? Number(m[2]) : 0;
    if (!Number.isFinite(ft) || !Number.isFinite(inch)) continue;
    const val = Math.round((ft + inch / 12) * 1000) / 1000;
    if (val > 0) return String(val);
  }
  warnings.push("Could not parse building_height_ft; defaulted to 0");
  return "0";
}

function safeSlugFromFilename(docPath: string): string {
  const base = path.basename(docPath, path.extname(docPath));
  return slugify(base);
}

function slugify(input: string): string {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function normalizeSpaces(s: string) {
  return String(s || "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function parseNumber(raw: string): number | null {
  const m = String(raw).match(/\b(\d+(?:,\d{3})*(?:\.\d+)?)\b/);
  if (!m) return null;
  const n = Number(m[1].replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

function parseSqft(lines: string[], warnings: string[]): number {
  for (const raw of lines) {
    const l = raw.toLowerCase();
    if (l.includes("total finished") && l.includes("sq")) {
      const n = parseNumber(raw);
      if (n != null) return Math.round(n);
    }
  }
  let best: number | null = null;
  for (const raw of lines) {
    if (!raw.toLowerCase().includes("sq")) continue;
    const n = parseNumber(raw);
    if (n == null) continue;
    const r = Math.round(n);
    if (best == null || r > best) best = r;
  }
  if (best == null) {
    warnings.push("Could not parse heated_sqft");
    return 0;
  }
  return best;
}

function parseBeds(lines: string[]): number | null {
  for (const raw of lines) {
    const l = raw.toLowerCase();
    if (l.includes("bed") || l.includes("bedroom")) {
      const n = parseNumber(raw);
      if (n != null) return Math.round(n);
    }
  }
  return null;
}

function parseBaths(lines: string[]): number | null {
  for (const raw of lines) {
    if (!raw.toLowerCase().includes("bath")) continue;
    const n = parseNumber(raw);
    if (n != null) return n;
  }
  return null;
}

function parseStories(lines: string[]): number | null {
  for (const raw of lines) {
    const l = raw.toLowerCase();
    if (l.includes("story") || l.includes("stories") || l.includes("level")) {
      const n = parseNumber(raw);
      if (n != null) return Math.round(n);
    }
  }
  return null;
}

function parseWidthDepth(lines: string[], warnings: string[]) {
  let width: number | null = null;
  let depth: number | null = null;

  for (const raw of lines) {
    const m = raw.match(/(\d{1,3})\s*[’']\s*-?\s*(\d{1,2})?\s*[”"]?\s*wide\s*x\s*(\d{1,3})\s*[’']\s*-?\s*(\d{1,2})?\s*[”"]?\s*deep/i);
    if (m) {
      const wFt = Number(m[1]);
      const wIn = m[2] ? Number(m[2]) : 0;
      const dFt = Number(m[3]);
      const dIn = m[4] ? Number(m[4]) : 0;
      width = Math.round((wFt + wIn / 12) * 1000) / 1000;
      depth = Math.round((dFt + dIn / 12) * 1000) / 1000;
      break;
    }
    if (width == null && raw.toLowerCase().includes("wide")) {
      const m2 = raw.match(/(\d{1,3})\s*[’']\s*-?\s*(\d{1,2})?\s*[”"]?\s*wide/i);
      if (m2) width = Math.round((Number(m2[1]) + (m2[2] ? Number(m2[2]) : 0) / 12) * 1000) / 1000;
    }
    if (depth == null && raw.toLowerCase().includes("deep")) {
      const m3 = raw.match(/(\d{1,3})\s*[’']\s*-?\s*(\d{1,2})?\s*[”"]?\s*deep/i);
      if (m3) depth = Math.round((Number(m3[1]) + (m3[2] ? Number(m3[2]) : 0) / 12) * 1000) / 1000;
    }
  }

  if (width == null) warnings.push("Could not parse width_ft; defaulted to 0");
  if (depth == null) warnings.push("Could not parse depth_ft; defaulted to 0");

  return { width_ft: width ?? 0, depth_ft: depth ?? 0 };
}

function parseCeilingHeightFt(lines: string[], warnings: string[]): number {
  // Examples: "ML Ceiling: 9 ft." "Living Ceiling: 12’" "Ceiling Height: 10 ft"
  for (const raw of lines.slice(0, 120)) {
    const l = raw.toLowerCase();
    if (!l.includes("ceiling")) continue;
    const m = raw.match(/\b(\d{1,2}(?:\.\d+)?)\s*(?:ft\.?|feet|')\b/i);
    if (!m) continue;
    const n = Number(m[1]);
    if (Number.isFinite(n) && n > 0) return n;
  }
  warnings.push("Could not parse ceiling_height_ft; defaulted to 0");
  return 0;
}

function parsePlanId(lines: string[]): string | null {
  // Primary: explicit "Plan <ID>" patterns
  // Only scan early lines to avoid matching prose in the description body.
  const scan = lines.slice(0, 60);
  for (const raw of scan) {
    const line = normalizeSpaces(raw);
    const m = line.match(/\bplan\s*(?:#|no\.|number)?\s*[:\-]?\s*([a-z0-9][a-z0-9-]{2,})\b/i);
    if (m) {
      const id = String(m[1] || "").trim();
      // Require at least one digit to avoid capturing words like "will".
      if (id && /\d/.test(id) && !GENERIC_SLUG_WORDS.has(id.toLowerCase())) return id;
    }
  }

  // Fallback: common catalog IDs like 280037DOM (digits + optional letters)
  for (const raw of scan) {
    const line = normalizeSpaces(raw);
    const m = line.match(/\b(\d{5,}[a-z]{0,6})\b/i);
    if (m) return m[1];
  }

  return null;
}

function parsePlanName(lines: string[]): string | null {
  const nonEmpty = lines.map((l) => l.trim()).filter(Boolean);
  if (!nonEmpty.length) return null;

  // Prefer "Title:" section
  for (let i = 0; i < nonEmpty.length; i++) {
    if (/^title\s*:/i.test(nonEmpty[i])) {
      const candidate = normalizeSpaces(String(nonEmpty[i]).replace(/^title\s*:\s*/i, ""));
      if (candidate && !GENERIC_SLUG_WORDS.has(candidate.toLowerCase())) return candidate;

      // Sometimes Title: is on its own line, and value is on the next
      const next = normalizeSpaces(nonEmpty[i + 1] || "");
      if (next && !GENERIC_SLUG_WORDS.has(next.toLowerCase())) return next;
    }
  }

  // Fallback: first line that looks like "<Plan Name> Product Description"
  for (const raw of nonEmpty.slice(0, 10)) {
    const cleaned = normalizeSpaces(raw).replace(/\s+product\s+description\s*$/i, "").trim();
    if (!cleaned) continue;
    const lower = cleaned.toLowerCase();
    if (lower === "with" || lower === "featuring") continue;
    // Avoid single-word throwaways
    if (cleaned.length < 3) continue;
    return cleaned;
  }

  return null;
}

function parseSectionAfterHeading(rawText: string, heading: string): string | null {
  const lower = rawText.toLowerCase();
  const idx = lower.indexOf(heading.toLowerCase());
  if (idx < 0) return null;
  const after = rawText.slice(idx + heading.length);
  return after.replace(/^\s*[:\-]?\s*/m, "").trim() || null;
}

function parseProductDescription(rawText: string, warnings: string[]): string | null {
  // Primary: Product Description heading
  const fromProduct = parseSectionAfterHeading(rawText, "Product Description");
  if (fromProduct) return fromProduct;

  // Fallback: some docs only contain the description body without heading.
  // If they contain Meta Description, we start after it.
  const fromMeta = parseSectionAfterHeading(rawText, "Meta Description");
  if (fromMeta) {
    warnings.push("Missing 'Product Description' heading; used text after 'Meta Description'");
    return fromMeta;
  }

  warnings.push("Missing 'Product Description' heading");
  return null;
}

function parseMetaDescription(rawText: string): string | null {
  const lower = rawText.toLowerCase();
  const idx = lower.indexOf("meta description");
  if (idx < 0) return null;
  const after = rawText.slice(idx + "meta description".length);
  const cleaned = after.replace(/^\s*[:\-]?\s*/m, "");
  // Stop at the next heading if present
  const stop = cleaned.search(/\n\s*(product description|features|title)\s*[:\-]?\s*/i);
  const sliced = stop >= 0 ? cleaned.slice(0, stop) : cleaned;
  const v = sliced.trim();
  return v || null;
}

function parsePriceCents(lines: string[]): number | null {
  // Prefer lines that explicitly mention price
  for (const raw of lines) {
    if (!raw.toLowerCase().includes("price")) continue;
    const m = raw.match(/\$\s*([0-9][0-9,]*)/);
    if (m) {
      const dollars = Number(m[1].replace(/,/g, ""));
      if (Number.isFinite(dollars)) return Math.round(dollars * 100);
    }
  }

  // Fallback: any "$X,XXX" in the header area
  for (const raw of lines.slice(0, 120)) {
    const m = raw.match(/\$\s*([0-9][0-9,]*)/);
    if (!m) continue;
    const dollars = Number(m[1].replace(/,/g, ""));
    if (Number.isFinite(dollars) && dollars > 0) return Math.round(dollars * 100);
  }

  return null;
}

function parseFoundationType(lines: string[]): string | null {
  for (const raw of lines) {
    if (!raw.toLowerCase().includes("foundation")) continue;
    const m = raw.match(/foundation\s*:\s*(.+)$/i);
    if (m) return normalizeSpaces(m[1]) || null;
  }
  return null;
}

function parseGarage(lines: string[]): { bays: number | null; type: GarageType | null } {
  for (const raw of lines) {
    const l = raw.toLowerCase();
    if (!l.includes("garage")) continue;

    let bays: number | null = null;
    const m = raw.match(/\b(\d+)\s*[- ]?car\b/i);
    if (m) {
      const n = Number(m[1]);
      if (Number.isFinite(n)) bays = n;
    }

    let type: GarageType | null = null;
    if (l.includes("front-load")) type = "front-load";
    else if (l.includes("side-load")) type = "side-load";
    else if (l.includes("detached")) type = "detached";

    return { bays, type };
  }

  return { bays: null, type: null };
}

async function extractRawText(filePath: string): Promise<string> {
  const r = await mammoth.extractRawText({ path: filePath });
  return String(r.value || "");
}

function parseDocToPlan(docPath: string, rawText: string, args: Args): ParsedPlan {
  const warnings: string[] = [];
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l !== "");

  const planId = parsePlanId(lines);
  const planName = parsePlanName(lines);

  const fileBase = path.basename(docPath, path.extname(docPath));

  // Per your rules: slug should come from Plan ID inside doc when possible.
  // If missing, fallback to plan name from doc.
  const slugBase = planId || planName || fileBase;
  let slug = slugify(slugBase);

  // Final safety: if we somehow still got a generic slug, fallback to filename.
  if (!slug || GENERIC_SLUG_WORDS.has(slug)) {
    const fallback = slugify(fileBase);
    if (fallback && !GENERIC_SLUG_WORDS.has(fallback)) {
      warnings.push(`Derived slug was too generic ('${slug || ""}'); fell back to filename`);
      slug = fallback;
    }
  }

  if (planId && slug) {
    // Ensure a stable convention if Plan IDs are numeric-like
    // (e.g. "280037DOM" -> "plan-280037dom")
    if (/^\d/.test(slug) && !slug.startsWith("plan-")) slug = `plan-${slug}`;
  }
  if (!slug) warnings.push("Could not derive slug");

  const name = planName || (planId ? `Plan ${planId}` : fileBase);

  const description = parseProductDescription(rawText, warnings);
  // DB has NOT NULL on description; if missing, store the raw text as a last resort.
  const normalizedDescription = (description && description.trim() ? description : rawText.trim()) || "";
  if (!description || !description.trim()) warnings.push("Description missing; used full raw document text as fallback");

  const total_sqft = parseSqft(lines, warnings);
  const beds = parseBeds(lines);
  const baths = parseBaths(lines);
  const stories = parseStories(lines);

  const { width_ft, depth_ft } = parseWidthDepth(lines, warnings);
  const ceiling_height_ft = parseCeilingHeightFt(lines, warnings);
  const building_height_ft = parseBuildingHeightFt(lines, warnings);
  const { roof_primary_slope, roof_secondary_slope } = parseRoofSlopes(lines, warnings);

  const foundationType = parseFoundationType(lines);
  const priceCents = parsePriceCents(lines);
  const meta_description = parseMetaDescription(rawText);

  const garageParsed = parseGarage(lines);
  const baysFromDoc = garageParsed.bays;
  const hasGarageField = baysFromDoc != null;

  let garage_bays = 0;
  let garageType: GarageType = "detached";

  if (hasGarageField && baysFromDoc != null && baysFromDoc > 0) {
    garage_bays = baysFromDoc;
    garageType = garageParsed.type || "detached";
    if (!garageParsed.type) warnings.push("Garage bays present but garage type missing; defaulted to detached");
  } else {
    garage_bays = 0;
    garageType = "detached";
  }

  return {
    sourceFile: path.basename(docPath),
    slug,
    name,
    description: normalizedDescription,
    total_sqft,
    beds,
    baths,
    stories,
    garage_bays,
    width_ft,
    depth_ft,
    ceiling_height_ft,
    building_height_ft,
    roof_primary_slope,
    roof_secondary_slope,
    meta_description,
    status: args.status,
    filters: {
      garageType,
      foundationType,
      priceCents,
    },
    warnings,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const logStream = createWriteStream(LOG_PATH, { flags: "w" });
  const log = (line: string) => {
    logStream.write(line + "\n");
    console.log(line);
  };

  const all = (await readdir(DOCS_DIR)).filter((f) => f.toLowerCase().endsWith(".docx"));
  all.sort((a, b) => a.localeCompare(b));

  const files = args.limit ? all.slice(0, args.limit) : all;
  log(`Found ${all.length} .docx files. Processing ${files.length}. dryRun=${args.dryRun} status=${args.status}`);

  const supabase = getSupabaseAdmin() as any;

  const seenSlugs = new Map<string, number>();

  let ok = 0;
  let failed = 0;
  let skippedInvalid = 0;

  const examples: Array<{ slug: string; descriptionLen: number; garage_bays: number; garageType: string; priceCents: number | null }> = [];

  for (const f of files) {
    const fullPath = path.join(DOCS_DIR, f);
    try {
      const rawText = await extractRawText(fullPath);
      const plan = parseDocToPlan(fullPath, rawText, args);

      // Prevent accidental overwrites when multiple docs map to the same slug (common when Plan ID is missing).
      // We suffix only within this run; upsert remains deterministic per-run.
      const prev = seenSlugs.get(plan.slug) ?? 0;
      if (prev > 0) {
        // Prefer filename fallback if this doc doesn't have a strong Plan ID.
        const fallback = safeSlugFromFilename(fullPath);
        if (fallback && fallback !== plan.slug && !seenSlugs.has(fallback)) {
          plan.warnings.push(`Duplicate slug '${plan.slug}' in this run; using filename slug '${fallback}' to avoid overwrite`);
          (plan as any).slug = fallback;
        } else {
          const newSlug = `${plan.slug}-${prev + 1}`;
          plan.warnings.push(`Duplicate slug '${plan.slug}' in this run; using '${newSlug}' to avoid overwrite`);
          (plan as any).slug = newSlug;
        }
      }
      // Track the final slug actually used.
      const finalSlug = (plan as any).slug as string;
      seenSlugs.set(finalSlug, (seenSlugs.get(finalSlug) ?? 0) + 1);

      if (!plan.slug || plan.total_sqft <= 0) {
        skippedInvalid++;
        log(`SKIP: ${plan.sourceFile} :: invalid slug or total_sqft (slug='${plan.slug}', total_sqft=${plan.total_sqft})`);
        continue;
      }

      if (args.dryRun) {
        ok++;
        log(`DRYRUN: would upsert ${plan.slug} :: ${plan.name} :: descLen=${plan.description.length}`);
      } else {
        const payload: any = {
          slug: plan.slug,
          name: plan.name,
          description: plan.description,
          total_sqft: plan.total_sqft,
          beds: plan.beds,
          baths: plan.baths,
          stories: plan.stories,
          garage_bays: plan.garage_bays,
          width_ft: plan.width_ft,
          depth_ft: plan.depth_ft,
          ceiling_height_ft: plan.ceiling_height_ft,
          building_height_ft: plan.building_height_ft,
          roof_primary_slope: plan.roof_primary_slope,
          roof_secondary_slope: plan.roof_secondary_slope,
          meta_description: plan.meta_description,
          status: plan.status,
          filters: {
            ...(plan.filters || {}),
          },
        };

        const { error }: any = await supabase.from("plans").upsert(payload, { onConflict: "slug" });
        if (error) throw error;
        ok++;
        log(`OK: upserted ${plan.slug} :: descLen=${plan.description.length}`);
      }

      if (plan.warnings.length) {
        log(`WARN: ${plan.slug} :: ${plan.warnings.join(" | ")}`);
      }

      if (examples.length < 10) {
        examples.push({
          slug: plan.slug,
          descriptionLen: plan.description.length,
          garage_bays: plan.garage_bays,
          garageType: plan.filters.garageType,
          priceCents: plan.filters.priceCents,
        });
      }
    } catch (e: any) {
      failed++;
      log(`ERROR: ${f} :: ${e?.message || String(e)}`);
    }
  }

  log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  log(`DONE. ok=${ok} failed=${failed} skippedInvalid=${skippedInvalid}`);
  log("Examples:");
  for (const ex of examples) {
    log(`- ${ex.slug} :: descLen=${ex.descriptionLen} :: garage_bays=${ex.garage_bays} :: garageType=${ex.garageType} :: priceCents=${ex.priceCents ?? "null"}`);
  }

  logStream.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
