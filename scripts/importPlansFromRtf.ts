import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import fs from "node:fs/promises";
import { getSupabaseAdmin } from "../src/lib/supabaseAdmin";

const execFileAsync = promisify(execFile);

type PlanInsertRow = {
  slug: string;
  name: string;
  status: string;
  description?: string | null;
  total_sqft?: number | null;
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

function slugify(input: string) {
  return String(input || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function toNumber(v: string | null | undefined): number | null {
  const cleaned = String(v ?? "").replace(/[^0-9.\-]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return null;
  return n;
}

function parseBathsValue(v: string | null | undefined): number | null {
  const s = String(v ?? "").trim();
  if (!s) return null;

  // Common formats: 3.5, 3 1/2, 3-1/2
  const frac = s.match(/(\d+)\s*(?:-|\s)+\s*1\s*\/\s*2/);
  if (frac) return Number(frac[1]) + 0.5;

  const decimal = toNumber(s);
  if (decimal != null) return decimal;

  return null;
}

function parseFullBathsLine(line: string | null | undefined): { full: number | null; half: number | null } {
  const s = String(line ?? "").trim();
  if (!s) return { full: null, half: null };

  const nums = Array.from(s.matchAll(/\b\d+\b/g)).map((m) => Number(m[0]));
  const hasPowder = /powder/i.test(s);
  const hasHalf = /half/i.test(s);

  // Common format in some docs: "2 Full Bathrooms + 1 Powder"
  if ((hasPowder || hasHalf) && nums.length >= 2) {
    return { full: nums[0] ?? null, half: nums[1] ?? null };
  }

  // Otherwise treat the first number as the full bath count.
  if (nums.length >= 1) {
    return { full: nums[0] ?? null, half: null };
  }

  return { full: null, half: null };
}

function parseFeetInches(input: string | null | undefined): number | null {
  const s = String(input ?? "").trim();
  if (!s) return null;
  // Example: 60'-1" or 29'-11" or 10'
  const m = s.match(/(\d+)\s*'\s*(?:-\s*(\d+))?\s*(?:\"|in)?/);
  if (!m) return null;
  const feet = Number(m[1] ?? 0);
  const inches = Number(m[2] ?? 0);
  if (!Number.isFinite(feet) || !Number.isFinite(inches)) return null;
  return Math.round((feet + inches / 12) * 1000) / 1000;
}

async function rtfToText(filePath: string): Promise<string> {
  // Uses Windows RichTextBox via PowerShell to convert RTF to plain text.
  const ps = [
    "Add-Type -AssemblyName System.Windows.Forms;",
    "$rtb = New-Object System.Windows.Forms.RichTextBox;",
    `$rtb.LoadFile('${filePath.replace(/'/g, "''")}');`,
    "$rtb.Text",
  ].join(" ");

  const { stdout } = await execFileAsync(
    "powershell",
    ["-NoProfile", "-Command", ps],
    { windowsHide: true, maxBuffer: 20 * 1024 * 1024 }
  );
  return String(stdout || "").replace(/\r\n/g, "\n").trim();
}

function findLineValue(text: string, label: string): string | null {
  const re = new RegExp(`^${label}\\s*[:\\-]\\s*(.+)$`, "im");
  const m = text.match(re);
  return m ? String(m[1]).trim() : null;
}

function findSqft(text: string, label: string): number | null {
  // Require a sqft indicator so we don't accidentally parse ceiling heights (e.g. "Second Floor: 9'").
  const re = new RegExp(`${label}\\s*[:\\-]\\s*([0-9,.]+)\\s*(?:sq\\.?\\s*ft\\.?|sf)`, "i");
  const m = text.match(re);
  if (!m) return null;
  return toNumber(m[1]);
}

function extractSection(text: string, heading: string, endHeadings: string[]): string {
  const lines = String(text || "").replace(/\r\n/g, "\n").split("\n");
  const startIdx = lines.findIndex((l) => l.trim().toLowerCase() === heading.toLowerCase());
  if (startIdx < 0) return "";

  let endIdx = lines.length;
  for (let i = startIdx + 1; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!t) continue;
    if (endHeadings.some((h) => t.toLowerCase() === h.toLowerCase())) {
      endIdx = i;
      break;
    }
  }

  return lines.slice(startIdx + 1, endIdx).join("\n").trim();
}

function extractDescription(text: string): string | null {
  const markers = [
    "PRODUCT DESCRIPTION:",
    "PRODUCT DESCRIPTION",
    "DESCRIPTION:",
    "DESCRIPTOIN:",
    "DESCRIPTOIN",
    "DESCRIPTION",
  ];
  const lower = text.toLowerCase();
  for (const mk of markers) {
    const i = lower.indexOf(mk.toLowerCase());
    if (i >= 0) {
      const after = text.slice(i + mk.length).trim();
      // Strip common trailing marketing boilerplate if present.
      const cut = after.split(/\n\s*Last word\s*:/i)[0] ?? after;
      return cut.trim() || null;
    }
  }
  // Some docs are narrative without a label (Oak Ridge). Use entire text after the initial "Key Features" block if possible.
  const k = lower.indexOf("a home engineered");
  if (k >= 0) return text.slice(k).trim() || null;
  return null;
}

function parsePlanFromText(nameFromFile: string, text: string): Omit<PlanInsertRow, "slug"> {
  const out: Omit<PlanInsertRow, "slug"> = {
    name: nameFromFile,
    status: "published",
    description: null,
    total_sqft: null,
    main_level_sqft: null,
    upper_level_sqft: null,
    back_patio_sqft: null,
    front_porch_sqft: null,
    balcony_sqft: null,
    beds: null,
    baths: null,
    stories: null,
    garage_bays: null,
    garage_type: null,
    width_ft: null,
    depth_ft: null,
    building_height_ft: null,
    ceiling_height_ft: 0,
    main_level_ceiling_height_ft: 0,
    upper_level_ceiling_height_ft: 0,
    roof_primary_slope: null,
    roof_secondary_slope: null,
    tags: [],
    images: {},
    filters: {},
    meta_description: null,
    old_slugs: [],
  };

  // Sqft
  out.total_sqft = findSqft(text, "Total Heated Area") ?? findSqft(text, "Total Heated") ?? findSqft(text, "Total Area");
  out.main_level_sqft = findSqft(text, "1st Floor") ?? findSqft(text, "First Floor") ?? findSqft(text, "Main Level");
  out.upper_level_sqft = findSqft(text, "2nd Floor") ?? findSqft(text, "Second Floor") ?? findSqft(text, "Upper Level");
  out.back_patio_sqft = findSqft(text, "Covered Patio") ?? findSqft(text, "Back Patio") ?? findSqft(text, "Patio");
  out.front_porch_sqft = findSqft(text, "Porch, Front") ?? findSqft(text, "Front Porch") ?? findSqft(text, "Porch Front");
  out.balcony_sqft = findSqft(text, "Balcony");

  // Beds/Baths
  out.beds = toNumber(findLineValue(text, "Bedrooms"));
  const fullBathsLine = findLineValue(text, "Full bathrooms");
  const parsedFullBaths = parseFullBathsLine(fullBathsLine);
  const fullBaths = parsedFullBaths.full;
  const halfBaths = parsedFullBaths.half ?? toNumber(findLineValue(text, "Half bathrooms"));
  const bathsTotalLine = findLineValue(text, "Bathrooms");
  const bathsTotal = bathsTotalLine ? parseBathsValue(bathsTotalLine) : null;
  if (bathsTotal != null) out.baths = bathsTotal;
  else if (fullBaths != null || halfBaths != null) out.baths = (fullBaths ?? 0) + (halfBaths ?? 0) * 0.5;

  // Dimensions
  out.width_ft = parseFeetInches(findLineValue(text, "Width"));
  out.depth_ft = parseFeetInches(findLineValue(text, "Depth"));
  out.building_height_ft = parseFeetInches(findLineValue(text, "Max Ridge Height"));

  // Garage
  const garageSection = extractSection(text, "Garage", ["Ceiling Heights", "Roof Details", "Roof", "Exterior Walls", "Dimensions"]);
  out.garage_type = garageSection ? findLineValue(garageSection, "Type") : null;
  const garageCount = garageSection ? toNumber(findLineValue(garageSection, "Count")) : null;
  if (garageCount != null) out.garage_bays = garageCount;
  else {
    const m = nameFromFile.match(/(\d+)\s*-?\s*car/i);
    if (m) out.garage_bays = toNumber(m[1]);
  }

  // Stories
  const storiesLine = toNumber(findLineValue(text, "Stories"));
  if (storiesLine != null) out.stories = storiesLine;
  else {
    const lt = text.toLowerCase();
    if (/(two\s*-?story|2\s*-?story)/.test(lt)) out.stories = 2;
    else if (/(one\s*-?story|1\s*-?story)/.test(lt)) out.stories = 1;
    else if (out.upper_level_sqft != null && out.upper_level_sqft > 0) out.stories = 2;
    else if (out.total_sqft != null) out.stories = 1;
  }

  // Ceiling heights
  const ceilingSection = extractSection(text, "Ceiling Heights", ["Roof Details", "Roof", "Garage", "Dimensions"]);
  out.main_level_ceiling_height_ft =
    ceilingSection ? parseFeetInches(findLineValue(ceilingSection, "First Floor")) ?? 0 : 0;
  out.upper_level_ceiling_height_ft =
    ceilingSection ? parseFeetInches(findLineValue(ceilingSection, "Second Floor")) ?? 0 : 0;
  out.ceiling_height_ft = out.main_level_ceiling_height_ft || 0;

  // Roof
  out.roof_primary_slope = findLineValue(text, "Primary Pitch");
  out.roof_secondary_slope = findLineValue(text, "Secondary Pitch");

  // Description
  out.description = extractDescription(text);

  // If still missing beds/baths in some narrative docs, infer from the "Key Features" section.
  if (out.beds == null) {
    const m = text.match(/\b(\d+)\s+Bedrooms?\b/i);
    if (m) out.beds = toNumber(m[1]);
  }
  if (out.baths == null) {
    const m = text.match(/\b(\d+(?:\.\d+)?)\s+bathrooms?\b/i);
    if (m) out.baths = toNumber(m[1]);
  }

  // Sanity bounds cleanup
  if (out.baths != null && (out.baths <= 0 || out.baths > 10)) out.baths = null;
  if (out.stories != null && (out.stories <= 0 || out.stories > 5)) out.stories = null;
  if (out.upper_level_sqft != null && out.stories === 1) out.upper_level_sqft = null;

  return out;
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const commit = args.has("--commit");
  const full = args.has("--full");

  const dir = path.resolve(process.cwd(), "assets", "New House Plan Products");
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".rtf"))
    .map((e) => e.name)
    .sort();

  if (files.length === 0) throw new Error(`No .rtf files found in ${dir}`);

  const supabase = getSupabaseAdmin() as any;

  // Existing slugs + names for uniqueness rules.
  const { data: existing, error: existingErr }: any = await supabase.from("plans").select("slug,name").limit(5000);
  if (existingErr) throw existingErr;

  const existingSlugs = new Set<string>((existing ?? []).map((r: any) => String(r.slug || "").trim()).filter(Boolean));
  const existingNames = new Set<string>((existing ?? []).map((r: any) => String(r.name || "").trim()).filter(Boolean));

  const rows: PlanInsertRow[] = [];

  for (const filename of files) {
    const filePath = path.join(dir, filename);
    let name = path.basename(filename, ".rtf").trim();
    if (name === "Oak Ridge Side Garage") name = "Oak Ridge Front Garage";
    if (!name) throw new Error(`Invalid filename: ${filename}`);

    if (existingNames.has(name)) {
      throw new Error(`Name already exists in plans table: ${name}`);
    }

    const text = await rtfToText(filePath);
    const parsed = parsePlanFromText(name, text);

    // Slug rule: option B => append "-house-plan".
    const base = `${slugify(name)}-house-plan`;
    let slug = base;
    if (existingSlugs.has(slug)) {
      // If slug exists, append the house plan name at the end (as requested).
      slug = `${base}-${slugify(name)}`;
    }
    let n = 2;
    while (existingSlugs.has(slug)) {
      slug = `${base}-${slugify(name)}-${n}`;
      n++;
    }

    existingSlugs.add(slug);
    existingNames.add(name);

    rows.push({ slug, ...parsed });
  }

  if (!commit) {
    if (full) {
      process.stdout.write(JSON.stringify({ commit: false, count: rows.length, rows }, null, 2));
      return;
    }

    const summary = rows.map((r) => ({
      name: r.name,
      slug: r.slug,
      status: r.status,
      total_sqft: r.total_sqft ?? null,
      main_level_sqft: r.main_level_sqft ?? null,
      upper_level_sqft: r.upper_level_sqft ?? null,
      beds: r.beds ?? null,
      baths: r.baths ?? null,
      stories: r.stories ?? null,
      garage_bays: r.garage_bays ?? null,
      width_ft: r.width_ft ?? null,
      depth_ft: r.depth_ft ?? null,
      building_height_ft: r.building_height_ft ?? null,
    }));
    process.stdout.write(JSON.stringify({ commit: false, count: rows.length, summary }, null, 2));
    return;
  }

  const { data, error }: any = await supabase
    .from("plans")
    .insert(rows as any)
    .select("id, slug, name, status");

  if (error) throw error;
  process.stdout.write(JSON.stringify({ commit: true, inserted: data ?? [] }, null, 2));
}

main().catch((err) => {
  console.error(String(err?.message || err));
  process.exit(1);
});
