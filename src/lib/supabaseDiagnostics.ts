import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { createClient } from "@supabase/supabase-js";

export type SupabaseDiagnosticsReport = {
  supabaseUrlMasked: string | null;
  supabaseServiceRolePresent: boolean;
  plans_total_count: number;
  plans_count_by_status: Record<string, number>;
  published_plans: Array<{ slug: string; name: string; status: string }>;
  expected_slugs: string[];
  missing_expected_slugs: string[];
  expected_not_published: Array<{ slug: string; status: string | null }>;
  suggested_sql_publish_missing: string | null;
  suggested_seed_command: string | null;
};

function maskSupabaseUrl(url: string | null | undefined) {
  const s = String(url || "").trim();
  if (!s) return null;
  try {
    const u = new URL(s);
    // https://<ref>.supabase.co
    const host = u.host;
    const ref = host.split(".")[0] || host;
    return `${ref}.supabase.co`;
  } catch {
    return null;
  }
}

// Canonical expected list for the catalog (2 originals + 10 uploaded batch).
// Keep this list in sync with the plans you expect to appear on /house-plans.
export const EXPECTED_CATALOG_SLUGS: string[] = [
  "1-mountain-retreat",
  "sample-plan-2",
  "2-bed-adu",
  "adu-under-750",
  "boardwalk-4-car",
  "classic-contemporary-farmhouse",
  "classic-midcentury",
  "desert-rain",
  "high-desert",
  "oak-ridge-side-garage",
  "the-metropolitan",
  "tiny-house-adu",
];

function loadExpectedSlugs(): string[] {
  return [...EXPECTED_CATALOG_SLUGS];
}

export function getSupabaseUrlMaskedFromEnv() {
  return maskSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function getSupabaseAnonClientForDiagnostics() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");
  if (!anonKey) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required");
  return createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function collectSupabaseDiagnosticsReport(): Promise<SupabaseDiagnosticsReport> {
  const supabaseUrlMasked = getSupabaseUrlMaskedFromEnv();
  const supabaseServiceRolePresent = Boolean((process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim());

  const expected_slugs = loadExpectedSlugs();

  const supabase = getSupabaseAdmin() as any;

  const { count: totalCount, error: totalErr }: any = await supabase
    .from("plans")
    .select("id", { count: "exact", head: true });
  if (totalErr) throw totalErr;

  const plans_total_count = Number(totalCount ?? 0);

  // Count by status
  const { data: statusRows, error: statusErr }: any = await supabase
    .from("plans")
    .select("status")
    .limit(5000);
  if (statusErr) throw statusErr;

  const plans_count_by_status: Record<string, number> = {};
  for (const r of statusRows ?? []) {
    const s = String(r.status ?? "unknown");
    plans_count_by_status[s] = (plans_count_by_status[s] ?? 0) + 1;
  }

  const { data: published, error: pubErr }: any = await supabase
    .from("plans")
    .select("slug, name, status")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(50);
  if (pubErr) throw pubErr;

  const published_plans = (published ?? []).map((p: any) => ({
    slug: String(p.slug),
    name: String(p.name),
    status: String(p.status),
  }));

  // Slug presence and statuses
  const { data: slugRows, error: slugErr }: any = await supabase
    .from("plans")
    .select("slug, status")
    .limit(5000);
  if (slugErr) throw slugErr;

  const statusBySlug = new Map<string, string>();
  for (const r of slugRows ?? []) {
    const slug = String(r.slug ?? "").trim();
    if (!slug) continue;
    statusBySlug.set(slug, r.status == null ? "" : String(r.status));
  }

  const missing_expected_slugs = expected_slugs.filter((s) => !statusBySlug.has(s));

  const expected_not_published = expected_slugs
    .filter((s) => statusBySlug.has(s))
    .map((s) => ({ slug: s, status: statusBySlug.get(s) || null }))
    .filter((x) => x.status !== "published");

  const slugsToPublish = expected_not_published.map((x) => x.slug);
  const suggested_sql_publish_missing =
    slugsToPublish.length > 0
      ? `update public.plans set status = 'published' where slug in (${slugsToPublish
          .map((s) => `'${s.replace(/'/g, "''")}'`)
          .join(", ")});`
      : null;

  const suggested_seed_command = missing_expected_slugs.length > 0 ? "npm run seed:plans" : null;

  return {
    supabaseUrlMasked,
    supabaseServiceRolePresent,
    plans_total_count,
    plans_count_by_status,
    published_plans,
    expected_slugs,
    missing_expected_slugs,
    expected_not_published,
    suggested_sql_publish_missing,
    suggested_seed_command,
  };
}
