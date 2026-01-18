import dotenv from "dotenv";
import OpenAI from "openai";
import { getSupabaseAdmin } from "../src/lib/supabaseAdmin";

dotenv.config({ path: ".env.local" });

type PlanRow = {
  id: string;
  slug: string;
  name: string | null;
  description: string | null;
  beds: number | null;
  baths: number | null;
  total_sqft: number | null;
  stories: number | null;
  garage_bays: number | null;
  width_ft: number | null;
  depth_ft: number | null;
  tags: string[] | null;
  filters: any;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toNumber(value: unknown): number | null {
  if (value == null) return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function buildPlanText(plan: PlanRow): string {
  const parts: string[] = [];

  if (plan.name) parts.push(`Title: ${plan.name}`);
  if (plan.description) parts.push(`Description: ${plan.description}`);

  const beds = toNumber(plan.beds);
  const baths = toNumber(plan.baths);
  const sqft = toNumber(plan.total_sqft);
  const stories = toNumber(plan.stories);
  const garage = toNumber(plan.garage_bays);
  const widthFt = toNumber(plan.width_ft);
  const depthFt = toNumber(plan.depth_ft);
  const orientation = typeof plan.filters?.orientation === "string" ? String(plan.filters.orientation).trim() : "";

  const specBits: string[] = [];
  if (beds != null) specBits.push(`${beds} bedrooms`);
  if (baths != null) specBits.push(`${baths} baths`);
  if (sqft != null) specBits.push(`${sqft} total sqft`);
  if (stories != null) specBits.push(`${stories} stories`);
  if (garage != null) specBits.push(`${garage} car garage`);
  if (widthFt != null) specBits.push(`${widthFt} ft wide`);
  if (depthFt != null) specBits.push(`${depthFt} ft deep`);
  if (orientation) specBits.push(`orientation: ${orientation}`);

  if (specBits.length) parts.push(`Specs: ${specBits.join(", ")}`);

  if (Array.isArray(plan.tags) && plan.tags.length > 0) {
    parts.push(`Tags: ${plan.tags.map((t) => String(t || "").trim()).filter(Boolean).join(", ")}`);
  }

  if (plan.filters && typeof plan.filters === "object") {
    const styles = Array.isArray(plan.filters.styles)
      ? plan.filters.styles.map((s: any) => String(s || "").trim()).filter(Boolean)
      : [];
    if (styles.length > 0) {
      parts.push(`Styles: ${styles.join(", ")}`);
    }
  }

  return parts.join("\n");
}

function getErrorStatus(err: unknown): number | null {
  const anyErr = err as any;
  const s1 = typeof anyErr?.status === "number" ? anyErr.status : null;
  const s2 = typeof anyErr?.response?.status === "number" ? anyErr.response.status : null;
  return s1 ?? s2;
}

async function embedWithRetries(openai: OpenAI, input: string): Promise<number[]> {
  const maxAttempts = 6;
  let delayMs = 400;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const res = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input,
      });

      const embedding = res.data?.[0]?.embedding;
      if (!Array.isArray(embedding) || embedding.length !== 1536) {
        throw new Error(`Unexpected embedding shape (len=${Array.isArray(embedding) ? embedding.length : "n/a"})`);
      }
      return embedding;
    } catch (err) {
      const anyErr = err as any;
      const code = anyErr?.code ?? anyErr?.error?.code;
      if (code === "insufficient_quota") {
        const hard = new Error("OpenAI request failed: insufficient_quota");
        (hard as any).code = "insufficient_quota";
        throw hard;
      }

      const status = getErrorStatus(err);
      const retryable = status === 429 || (status != null && status >= 500);

      if (!retryable || attempt === maxAttempts) {
        throw err;
      }

      await sleep(delayMs);
      delayMs = Math.min(4000, Math.floor(delayMs * 1.7));
    }
  }

  throw new Error("Failed to generate embedding after retries");
}

async function loadAllPlans(): Promise<PlanRow[]> {
  const supabase = getSupabaseAdmin() as any;

  const pageSize = 200;
  let offset = 0;
  const rows: PlanRow[] = [];

  while (true) {
    const { data, error } = await supabase
      .from("plans")
      .select(
        "id, slug, name, description, total_sqft, beds, baths, stories, garage_bays, width_ft, depth_ft, tags, filters",
      )
      .order("name", { ascending: true })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    const page = (data ?? []).map((r: any) => ({
      id: String(r.id),
      slug: String(r.slug ?? ""),
      name: r.name == null ? null : String(r.name),
      description: r.description == null ? null : String(r.description),
      beds: toNumber(r.beds),
      baths: toNumber(r.baths),
      total_sqft: toNumber(r.total_sqft),
      stories: toNumber(r.stories),
      garage_bays: toNumber(r.garage_bays),
      width_ft: toNumber(r.width_ft),
      depth_ft: toNumber(r.depth_ft),
      tags: Array.isArray(r.tags) ? r.tags.map((t: any) => String(t ?? "")).filter((t: any) => t) : null,
      filters: r.filters ?? null,
    }));

    rows.push(...page);

    if (!data || data.length < pageSize) break;
    offset += pageSize;
  }

  return rows.filter((p) => String(p.slug || "").trim().length > 0);
}

async function upsertPlanSemantic(plan: PlanRow, embedding: number[]) {
  const supabase = getSupabaseAdmin() as any;

  const specs = {
    beds: plan.beds,
    baths: plan.baths,
    sqft: plan.total_sqft,
    stories: plan.stories,
    garage_cars: plan.garage_bays,
    width_ft: plan.width_ft,
    depth_ft: plan.depth_ft,
    orientation: typeof plan.filters?.orientation === "string" ? String(plan.filters.orientation) : null,
  };

  const row = {
    plan_id: plan.slug,
    title: plan.name ?? "",
    description: plan.description ?? "",
    specs,
    url: `/house/${plan.slug}`,
    embedding: `[${embedding.join(",")}]`,
  };

  const { error } = await supabase.from("plans_semantic").upsert(row, { onConflict: "plan_id" });
  if (error) throw error;
}

async function run() {
  const apiKey = process.env.OPENAI_API_KEY ?? process.env.OPEN_AI_SECRET_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY (or OPEN_AI_SECRET_KEY) is required in .env.local");
  }

  const openai = new OpenAI({ apiKey });

  console.log("[semantic] Loading plans from Supabase...");
  const plans = await loadAllPlans();
  console.log(`[semantic] Loaded ${plans.length} plans`);

  let ok = 0;
  let failed = 0;

  for (let i = 0; i < plans.length; i += 1) {
    const p = plans[i];
    const label = `${p.slug}${p.name ? ` (${p.name})` : ""}`;

    try {
      const text = buildPlanText(p);
      const embedding = await embedWithRetries(openai, text);
      await upsertPlanSemantic(p, embedding);
      ok += 1;
      console.log(`[semantic] [${i + 1}/${plans.length}] ok: ${label}`);
    } catch (err) {
      failed += 1;
      console.error(`[semantic] [${i + 1}/${plans.length}] FAILED: ${label}`);
      console.error(err);

      const anyErr = err as any;
      const code = anyErr?.code ?? anyErr?.error?.code;
      if (code === "insufficient_quota") {
        console.error("[semantic] Aborting due to OpenAI insufficient quota/billing.");
        break;
      }
    }

    await sleep(50);
  }

  console.log(`[semantic] Done. ok=${ok} failed=${failed}`);
  if (failed > 0) process.exitCode = 1;
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
