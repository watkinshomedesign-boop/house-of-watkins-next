import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import path from "node:path";
import mammoth from "mammoth";
import { getSupabaseAdmin } from "../src/lib/supabaseAdmin";

type Args = {
  commit: boolean;
  filePath: string;
  status: "draft" | "published" | "archived";
  slug: string | null;
};

type PlanInsertRow = {
  slug: string;
  name: string;
  status: string;
  description?: string | null;
  total_sqft: number;
  main_level_sqft?: number | null;
  upper_level_sqft?: number | null;
  back_patio_sqft?: number | null;
  front_porch_sqft?: number | null;
  balcony_sqft?: number | null;
  beds?: number | null;
  baths?: number | null;
  stories?: number | null;
  garage_bays?: number | null;
  garage_type?: string | null;
  width_ft?: number | null;
  depth_ft?: number | null;
  building_height_ft?: number | null;
  ceiling_height_ft: number;
  main_level_ceiling_height_ft: number;
  upper_level_ceiling_height_ft: number;
  roof_primary_slope?: string | null;
  roof_secondary_slope?: string | null;
  tags?: string[] | null;
  images: any;
  filters: any;
  meta_description?: string | null;
  old_slugs: string[];
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    commit: false,
    filePath: path.resolve(process.cwd(), "assets", "Woodside House Plan.docx"),
    status: "published",
    slug: null,
  };

  for (const a of argv) {
    if (a === "--commit") args.commit = true;
    if (a.startsWith("--file=")) {
      const raw = a.slice("--file=".length).trim();
      if (raw) args.filePath = path.isAbsolute(raw) ? raw : path.resolve(process.cwd(), raw);
    }
    if (a.startsWith("--status=")) {
      const v = a.slice("--status=".length).trim().toLowerCase();
      if (v === "draft" || v === "published" || v === "archived") args.status = v;
    }
    if (a.startsWith("--slug=")) {
      const raw = a.slice("--slug=".length).trim();
      const cleaned = raw.replace(/^\/+/, "").replace(/\/+$/, "").trim();
      args.slug = cleaned || null;
    }
  }

  return args;
}

function slugify(input: string) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function toNumberFromText(v: string | null | undefined): number | null {
  const cleaned = String(v ?? "").replace(/[^0-9.\-]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  return n;
}

function toIntFromText(v: string | null | undefined): number | null {
  const n = toNumberFromText(v);
  if (n == null) return null;
  return Math.floor(n);
}

function parseFeetInchesLoose(input: string | null | undefined): number | null {
  const s = String(input ?? "").trim();
  if (!s) return null;
  // Supports 44’-9”, 44'-9", 29'-8" etc.
  const m = s.match(/(\d+)\s*[’']\s*-?\s*(\d+)?\s*[”"]?/);
  if (!m) return null;
  const feet = Number(m[1] ?? 0);
  const inches = Number(m[2] ?? 0);
  if (!Number.isFinite(feet) || !Number.isFinite(inches)) return null;
  return Math.round((feet + inches / 12) * 1000) / 1000;
}

function parseSqftByLabel(text: string, label: string): number | null {
  const re = new RegExp(`${label}\\s*:\\s*([0-9][0-9,]*)\\s*(?:sq\\.?\\s*ft\\.?|sq\\s*ft|sf)`, "i");
  const m = text.match(re);
  if (!m) return null;
  return toIntFromText(m[1]);
}

function parseLineValue(text: string, label: string): string | null {
  const re = new RegExp(`^${label}\\s*:\\s*(.+)$`, "im");
  const m = text.match(re);
  return m ? String(m[1]).trim() : null;
}

function parseMultilineValue(text: string, label: string): string | null {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const re = new RegExp(`^${label}\\s*:\\s*(.*)$`, "i");
  const idx = lines.findIndex((l) => re.test(l.trim()));
  if (idx < 0) return null;

  const first = String(lines[idx] || "").replace(re, "$1").trim();
  const parts: string[] = [first];

  for (let i = idx + 1; i < lines.length; i++) {
    const line = String(lines[i] || "").trim();
    if (!line) break;

    // Stop if we hit a new label (e.g. "Total Heated Area:").
    if (/^[A-Z][A-Za-z0-9 ,()\/\-]+:\s*/.test(line)) break;
    parts.push(line);
  }

  const joined = parts.join(" ").replace(/\s+/g, " ").trim();
  return joined || null;
}

function parseDescription(text: string): string | null {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const startIdx = lines.findIndex((l) => /^Product\s+Description\s*:/i.test(l.trim()));
  if (startIdx >= 0) {
    const sliced = lines
      .slice(startIdx)
      .join("\n")
      .replace(/^Product\s+Description\s*:\s*/i, "")
      .trim();
    return sliced || null;
  }

  const idx = lines.findIndex((l) => /bedroom/i.test(l) && /house\s+plan/i.test(l));
  if (idx >= 0) {
    const sliced = lines.slice(idx).join("\n").trim();
    return sliced || null;
  }

  return text.trim() || null;
}

function parseStories(text: string, upperLevelSqft: number | null): number | null {
  const lt = text.toLowerCase();
  if (/(two\s*-?story|2\s*-?story|two\s*story)/.test(lt)) return 2;
  if (/(one\s*-?story|1\s*-?story|one\s*story)/.test(lt)) return 1;
  if (upperLevelSqft != null && upperLevelSqft > 0) return 2;
  return null;
}

function parseRoofPitch(text: string, label: string): string | null {
  const v = parseLineValue(text, label);
  if (!v) return null;
  const m = v.match(/\b(\d{1,2}\s*:\s*\d{1,2})\b/);
  return m ? m[1].replace(/\s+/g, "") : v;
}

async function extractRawText(filePath: string): Promise<string> {
  const r = await mammoth.extractRawText({ path: filePath });
  return String(r.value || "").replace(/\r\n/g, "\n");
}

async function buildRow(filePath: string, status: string) {
  const text = await extractRawText(filePath);
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const nameFromDoc = parseLineValue(text, "Name");
  const name = String(nameFromDoc || lines[0] || path.basename(filePath, path.extname(filePath))).trim();

  const slugFromDoc = (() => {
    const raw = parseMultilineValue(text, "Slug");
    if (!raw) return null;
    // DOCX exports sometimes wrap long slugs across lines. We strip whitespace to keep a valid slug.
    const cleaned = raw.replace(/\s+/g, "").replace(/^\/+/, "").replace(/\/+$/, "").trim();
    return cleaned || null;
  })();

  const total_sqft =
    parseSqftByLabel(text, "Total Heated Area") ??
    parseSqftByLabel(text, "Total Heated") ??
    parseSqftByLabel(text, "Total square foot") ??
    parseSqftByLabel(text, "Total square footage") ??
    parseSqftByLabel(text, "Total area") ??
    null;

  if (total_sqft == null || total_sqft <= 0) {
    throw new Error("Could not parse total_sqft from DOCX (expected something like 'Total Heated Area: 2,384 sq. ft.')");
  }

  const main_level_sqft = parseSqftByLabel(text, "1st Floor") ?? parseSqftByLabel(text, "First Floor") ?? null;

  const upper_level_sqft =
    parseSqftByLabel(text, "Second story") ??
    parseSqftByLabel(text, "Second Story") ??
    parseSqftByLabel(text, "2nd Floor") ??
    parseSqftByLabel(text, "Second Floor") ??
    null;

  const back_patio_sqft = parseSqftByLabel(text, "Back Patio") ?? null;
  const front_porch_sqft = parseSqftByLabel(text, "Porch, Front") ?? parseSqftByLabel(text, "Front Porch") ?? null;

  const beds = toIntFromText(parseLineValue(text, "Bedrooms"));

  // Prefer narrative "5.5 bathrooms" if present; else fall back to "Full bathrooms" only.
  const bathNarrative = (() => {
    const m = text.match(/\b(\d+(?:\.\d+)?)\s+bathrooms?\b/i);
    return m ? toNumberFromText(m[1]) : null;
  })();
  const fullBaths = toIntFromText(parseLineValue(text, "Full bathrooms"));
  const baths = bathNarrative ?? (fullBaths != null ? fullBaths : null);

  const width_ft = parseFeetInchesLoose(parseLineValue(text, "Width"));
  const depth_ft = parseFeetInchesLoose(parseLineValue(text, "Depth"));

  const buildingHeightMatch = text.match(/Max Ridge Height\s*:\s*[\s\S]{0,40}?(\d{1,3}\s*[’']\s*-?\s*\d{0,2}\s*[”"]?)\s*high\b/i);
  const building_height_ft = buildingHeightMatch ? parseFeetInchesLoose(buildingHeightMatch[1]) : null;

  const garage_type = (() => {
    const entry = parseLineValue(text, "Entry Location");
    if (entry) return entry;
    const type = parseLineValue(text, "Type");
    return type;
  })();

  const garage_bays = (() => {
    const m = text.match(/\bGarage[\s\S]{0,300}?\bCount\s*:\s*(\d+)\b/i);
    return m ? toIntFromText(m[1]) : null;
  })();

  const mainCeil = (() => {
    const m = text.match(/First Floor\s*:\s*(\d+(?:\.\d+)?)\s*(?:feet|ft)\b/i);
    return m ? toNumberFromText(m[1]) : null;
  })();
  const upperCeil = (() => {
    const m = text.match(/Second Floor\s*:\s*(\d+(?:\.\d+)?)\s*(?:feet|ft)\b/i);
    return m ? toNumberFromText(m[1]) : null;
  })();

  const roof_primary_slope = parseRoofPitch(text, "Primary Pitch");
  const roof_secondary_slope = parseRoofPitch(text, "Secondary Pitch");

  const stories = parseStories(text, upper_level_sqft);

  const description = parseDescription(text);
  const meta_description = description ? (description.length > 160 ? `${description.slice(0, 157).trim()}...` : description) : null;

  const row: Omit<PlanInsertRow, "slug"> = {
    name,
    status,
    description,
    total_sqft,
    main_level_sqft,
    upper_level_sqft,
    back_patio_sqft,
    front_porch_sqft,
    balcony_sqft: null,
    beds,
    baths,
    stories,
    garage_bays,
    garage_type,
    width_ft,
    depth_ft,
    building_height_ft,
    ceiling_height_ft: mainCeil ?? 0,
    main_level_ceiling_height_ft: mainCeil ?? 0,
    upper_level_ceiling_height_ft: upperCeil ?? 0,
    roof_primary_slope: roof_primary_slope ?? null,
    roof_secondary_slope: roof_secondary_slope ?? null,
    images: {},
    filters: {},
    tags: [],
    meta_description,
    old_slugs: [],
  };

  return { text, name, slugFromDoc, row };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const supabase = getSupabaseAdmin() as any;

  const { data: existing, error: existingErr }: any = await supabase.from("plans").select("slug,name").limit(5000);
  if (existingErr) throw existingErr;

  const existingSlugs = new Set<string>((existing ?? []).map((r: any) => String(r.slug || "").trim()).filter(Boolean));
  const existingNames = new Set<string>((existing ?? []).map((r: any) => String(r.name || "").trim()).filter(Boolean));

  const { name, slugFromDoc, row } = await buildRow(args.filePath, args.status);

  if (!name) throw new Error("Could not derive plan name from DOCX");
  if (existingNames.has(name)) throw new Error(`Name already exists in plans table: ${name}`);

  let slug: string;
  if (args.slug) {
    slug = args.slug;
    if (existingSlugs.has(slug)) throw new Error(`Slug already exists in plans table: ${slug}`);
  } else if (slugFromDoc) {
    slug = slugFromDoc;
    if (existingSlugs.has(slug)) throw new Error(`Slug already exists in plans table: ${slug}`);
  } else {
    const base = `${slugify(name)}-house-plan`;
    slug = base;
    let n = 2;
    while (existingSlugs.has(slug)) {
      slug = `${base}-${n}`;
      n++;
    }
  }

  const insertRow: PlanInsertRow = { slug, ...row };

  if (!args.commit) {
    const summary = {
      name: insertRow.name,
      slug: insertRow.slug,
      status: insertRow.status,
      total_sqft: insertRow.total_sqft,
      main_level_sqft: insertRow.main_level_sqft ?? null,
      upper_level_sqft: insertRow.upper_level_sqft ?? null,
      front_porch_sqft: insertRow.front_porch_sqft ?? null,
      back_patio_sqft: insertRow.back_patio_sqft ?? null,
      beds: insertRow.beds ?? null,
      baths: insertRow.baths ?? null,
      stories: insertRow.stories ?? null,
      garage_bays: insertRow.garage_bays ?? null,
      garage_type: insertRow.garage_type ?? null,
      width_ft: insertRow.width_ft ?? null,
      depth_ft: insertRow.depth_ft ?? null,
      building_height_ft: insertRow.building_height_ft ?? null,
      ceiling_height_ft: insertRow.ceiling_height_ft,
      main_level_ceiling_height_ft: insertRow.main_level_ceiling_height_ft,
      upper_level_ceiling_height_ft: insertRow.upper_level_ceiling_height_ft,
      roof_primary_slope: insertRow.roof_primary_slope ?? null,
      roof_secondary_slope: insertRow.roof_secondary_slope ?? null,
    };

    process.stdout.write(JSON.stringify({ commit: false, file: args.filePath, summary }, null, 2));
    return;
  }

  const { data, error }: any = await supabase
    .from("plans")
    .insert(insertRow as any)
    .select("id, slug, name, status")
    .maybeSingle();

  if (error) throw error;
  process.stdout.write(JSON.stringify({ commit: true, inserted: data ?? null }, null, 2));
}

main().catch((err) => {
  console.error(String(err?.message || err));
  process.exit(1);
});
