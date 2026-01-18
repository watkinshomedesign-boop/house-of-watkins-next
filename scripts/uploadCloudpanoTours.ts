import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

type CloudpanoEntry = { name: string; url: string };

type PlanRow = {
  id: string;
  slug: string;
  name: string;
  status: string;
  tour3d_url: string | null;
};

const ENTRIES: CloudpanoEntry[] = [
  { name: "Oak Ridge Side Garage", url: "https://app.cloudpano.com/tours/dKvORuJLM" },
  { name: "Oak Ridge Front Garage", url: "https://app.cloudpano.com/tours/dKvORuJLM" },
  { name: "ADU under 750", url: "https://app.cloudpano.com/tours/MuYttToq5" },
  { name: "Canyon View", url: "https://app.cloudpano.com/tours/VbvWfXQHc" },
  { name: "Misty Glen", url: "https://app.cloudpano.com/tours/YBvxf28PD" },
  { name: "Cottage Retreat", url: "https://app.cloudpano.com/tours/aEhIeOXzD" },
  { name: "Pine Ridge Craftsman", url: "https://app.cloudpano.com/tours/_GjYRcrHg" },
  { name: "Tuscan Vineyard", url: "https://app.cloudpano.com/tours/4CgLjZczj" },
  { name: "Smith Ranch", url: "https://app.cloudpano.com/tours/JgvA-ogiu" },
  { name: "Fox Meadow Farmhouse", url: "https://app.cloudpano.com/tours/RDTjap6K-" },
  { name: "Summer Breeze", url: "https://app.cloudpano.com/tours/yjC-JD8Qm" },
  { name: "Sandalwood Bay House Plan", url: "https://app.cloudpano.com/tours/FZp2UejPG" },
  { name: "Memory Lane", url: "https://app.cloudpano.com/tours/EuI1gm47A" },
  { name: "Park Place House Plan", url: "https://app.cloudpano.com/tours/EeyjmCbgDG" },
  { name: "New Castle", url: "https://app.cloudpano.com/tours/eL5cHXHF-" },
  { name: "Woodside", url: "https://app.cloudpano.com/tours/QVHikrO0l" },
  { name: "Cherry Creek House Plan", url: "https://app.cloudpano.com/tours/t5O77LHXH" },
  { name: "Rosebud House Plan", url: "https://app.cloudpano.com/tours/t5O77LHXH" },
  { name: "Hill Ave", url: "https://app.cloudpano.com/tours/8bsC5MAgs" },
  { name: "Boardwalk 4 Car Garage", url: "https://app.cloudpano.com/tours/DEG0WKgPJ" },
  { name: "Boardwalk 2 car Garage", url: "https://app.cloudpano.com/tours/DEG0WKgPJ" },
  { name: "High Desert", url: "https://app.cloudpano.com/tours/fbULlcAxv" },
  { name: "Hickory Hallow", url: "https://app.cloudpano.com/tours/oKV58dVQ0" },
  { name: "Woodsman 2-car", url: "https://app.cloudpano.com/tours/BC2h3Z4Qx" },
  { name: "Woodsman 3-car", url: "https://app.cloudpano.com/tours/BC2h3Z4Qx" },
];

function normalizeText(s: string) {
  return String(s || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeName(s: string) {
  const n = normalizeText(s);
  const stop = new Set([
    "house",
    "plan",
    "plans",
    "the",
    "a",
    "an",
    "and",
    "of",
    "with",
    "for",
    "level",
    "floor",
    "main",
  ]);

  const synonyms: Record<string, string> = {
    ave: "avenue",
    hallow: "hollow",
  };

  const tokens = n
    .split(" ")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => synonyms[t] ?? t)
    .filter((t) => !stop.has(t));

  return tokens.join(" ");
}

function tokenSet(s: string) {
  const toks = normalizeName(s)
    .split(" ")
    .map((t) => t.trim())
    .filter(Boolean);
  return new Set(toks);
}

function levenshtein(a: string, b: string) {
  const s = a;
  const t = b;
  if (s === t) return 0;
  if (!s) return t.length;
  if (!t) return s.length;

  const m = s.length;
  const n = t.length;

  const v0 = new Array(n + 1).fill(0);
  const v1 = new Array(n + 1).fill(0);

  for (let i = 0; i <= n; i++) v0[i] = i;

  for (let i = 0; i < m; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < n; j++) {
      const cost = s[i] === t[j] ? 0 : 1;
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (let j = 0; j <= n; j++) v0[j] = v1[j];
  }

  return v1[n];
}

function similarityScore(a: string, b: string) {
  const na = normalizeName(a);
  const nb = normalizeName(b);

  if (!na || !nb) return 0;
  if (na === nb) return 1;

  const sa = tokenSet(a);
  const sb = tokenSet(b);
  const inter = [...sa].filter((x) => sb.has(x)).length;
  const union = new Set([...sa, ...sb]).size || 1;
  const tokenJaccard = inter / union;

  const dist = levenshtein(na, nb);
  const maxLen = Math.max(na.length, nb.length) || 1;
  const strSim = 1 - dist / maxLen;

  let bonus = 0;
  if (na.includes(nb) || nb.includes(na)) bonus += 0.1;
  if (inter > 0 && tokenJaccard >= 0.5) bonus += 0.05;

  return Math.max(0, Math.min(1, 0.55 * tokenJaccard + 0.45 * strSim + bonus));
}

function bestMatch(name: string, plans: PlanRow[]) {
  const scored = plans
    .map((p) => ({ plan: p, score: similarityScore(name, p.name) }))
    .sort((a, b) => b.score - a.score);
  return {
    best: scored[0] ?? null,
    second: scored[1] ?? null,
  };
}

async function fetchPlans(supabase: any): Promise<PlanRow[]> {
  const publishedStatuses = ["published", "active", "Published", "ACTIVE"];

  const pageSize = 1000;
  let offset = 0;
  const out: PlanRow[] = [];

  while (true) {
    const { data, error }: any = await supabase
      .from("plans")
      .select("id, slug, name, status, tour3d_url")
      .in("status", publishedStatuses)
      .order("name", { ascending: true })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;
    const batch = (data ?? []) as PlanRow[];
    out.push(...batch);

    if (!data || data.length < pageSize) break;
    offset += pageSize;
  }

  return out;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing");
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");

  const apply = process.argv.includes("--apply");

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const plans = await fetchPlans(supabase);

  const MIN_SCORE = 0.62;
  const AMBIGUOUS_DELTA = 0.04;

  const summary = {
    apply,
    total_entries: ENTRIES.length,
    updated: 0,
    skipped_already_set: 0,
    skipped_ambiguous: 0,
    skipped_unmatched: 0,
    errors: 0,
  };

  for (const e of ENTRIES) {
    const { best, second } = bestMatch(e.name, plans);

    const bestScore = best?.score ?? 0;
    const secondScore = second?.score ?? 0;

    const ambiguous = bestScore >= MIN_SCORE && secondScore >= MIN_SCORE && bestScore - secondScore < AMBIGUOUS_DELTA;
    const matched = best && bestScore >= MIN_SCORE && !ambiguous;

    if (!matched) {
      if (ambiguous) {
        summary.skipped_ambiguous += 1;
        console.log(
          JSON.stringify(
            {
              status: "ambiguous",
              input_name: e.name,
              url: e.url,
              best: best ? { name: best.plan.name, slug: best.plan.slug, score: Number(bestScore.toFixed(3)) } : null,
              second: second ? { name: second.plan.name, slug: second.plan.slug, score: Number(secondScore.toFixed(3)) } : null,
            },
            null,
            2
          )
        );
      } else {
        summary.skipped_unmatched += 1;
        console.log(
          JSON.stringify(
            {
              status: "unmatched",
              input_name: e.name,
              url: e.url,
              best: best ? { name: best.plan.name, slug: best.plan.slug, score: Number(bestScore.toFixed(3)) } : null,
            },
            null,
            2
          )
        );
      }
      continue;
    }

    const plan = best.plan;
    const current = String(plan.tour3d_url || "").trim() || null;

    if (current === e.url) {
      summary.skipped_already_set += 1;
      console.log(
        JSON.stringify(
          {
            status: "already_set",
            input_name: e.name,
            url: e.url,
            matched_plan: { id: plan.id, name: plan.name, slug: plan.slug, score: Number(bestScore.toFixed(3)) },
          },
          null,
          2
        )
      );
      continue;
    }

    if (!apply) {
      console.log(
        JSON.stringify(
          {
            status: "dry_run",
            input_name: e.name,
            url: e.url,
            matched_plan: {
              id: plan.id,
              name: plan.name,
              slug: plan.slug,
              score: Number(bestScore.toFixed(3)),
              current_tour3d_url: current,
            },
          },
          null,
          2
        )
      );
      continue;
    }

    try {
      const { error }: any = await supabase.from("plans").update({ tour3d_url: e.url }).eq("id", plan.id);
      if (error) throw error;
      summary.updated += 1;
      console.log(
        JSON.stringify(
          {
            status: "updated",
            input_name: e.name,
            url: e.url,
            matched_plan: { id: plan.id, name: plan.name, slug: plan.slug, score: Number(bestScore.toFixed(3)) },
          },
          null,
          2
        )
      );
    } catch (err: any) {
      summary.errors += 1;
      console.error(
        JSON.stringify(
          {
            status: "error",
            input_name: e.name,
            url: e.url,
            matched_plan: { id: plan.id, name: plan.name, slug: plan.slug, score: Number(bestScore.toFixed(3)) },
            error: String(err?.message || err),
          },
          null,
          2
        )
      );
    }
  }

  console.log(JSON.stringify({ summary }, null, 2));

  if (summary.errors > 0) process.exitCode = 2;
  if (!apply && (summary.skipped_ambiguous > 0 || summary.skipped_unmatched > 0)) process.exitCode = 2;
}

main().catch((err) => {
  console.error(String(err?.message || err));
  process.exitCode = 1;
});
