import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { readFile } from "fs/promises";
import { resolve } from "path";
import { getSupabaseAdmin } from "../src/lib/supabaseAdmin";

type SeedPlan = {
  slug: string;
  name: string;
  description?: string | null;
  heated_sqft: number;
  beds?: number | null;
  baths?: number | null;
  stories?: number | null;
  garage_bays?: number | null;
  width_ft?: number | null;
  depth_ft?: number | null;
  images?: unknown;
  tags?: string[] | null;
  status?: string | null;
};

async function main() {
  const filePath = resolve(process.cwd(), "src", "data", "plans.seed.json");
  const raw = await readFile(filePath, "utf8");

  const parsed = JSON.parse(raw) as SeedPlan[];
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("plans.seed.json must be a non-empty JSON array");
  }

  for (const p of parsed) {
    if (!p.slug || !p.name || typeof p.heated_sqft !== "number") {
      throw new Error(`Invalid seed plan: missing slug/name/heated_sqft: ${JSON.stringify(p)}`);
    }
  }

  const supabase = getSupabaseAdmin() as any;

  const { data, error }: any = await supabase
    .from("plans")
    .upsert(parsed as any, { onConflict: "slug" })
    .select("id, slug, status");

  if (error) throw error;

  console.log(`Upserted ${data?.length ?? 0} plans`);
  for (const row of data ?? []) {
    console.log(`- ${row.slug} (${row.status})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
