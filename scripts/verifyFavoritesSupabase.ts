import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

function maskEmail(email: string) {
  const s = String(email || "");
  const at = s.indexOf("@");
  if (at <= 0) return "(invalid)";
  const name = s.slice(0, at);
  const domain = s.slice(at + 1);
  const prefix = name.slice(0, 2);
  return `${prefix}${name.length > 2 ? "***" : ""}@${domain}`;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing");
  if (!serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { count: profilesCount, error: profilesErr } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });
  if (profilesErr) throw profilesErr;

  const { count: favoritesCount, error: favErr } = await supabase
    .from("favorites")
    .select("id", { count: "exact", head: true });
  if (favErr) throw favErr;

  const { data: topFavPlans, error: topFavErr } = await supabase
    .from("favorite_counts_by_plan")
    .select("plan_slug,favorites_count")
    .order("favorites_count", { ascending: false })
    .limit(5);

  const viewOk = !topFavErr;

  const { data: lastFavorites, error: lastFavErr } = await supabase
    .from("favorites")
    .select("user_id, plan_slug, created_at")
    .order("created_at", { ascending: false })
    .limit(5);
  if (lastFavErr) throw lastFavErr;

  const authSample: Array<{ id: string; emailMasked: string; hasName: boolean }> = [];
  let authAdminOk = true;
  try {
    const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 5 });
    if (error) throw error;
    for (const u of data.users ?? []) {
      const meta: any = (u as any).user_metadata ?? {};
      authSample.push({
        id: String(u.id),
        emailMasked: maskEmail(String(u.email || "")),
        hasName: typeof meta?.name === "string" && meta.name.trim().length > 0,
      });
    }
  } catch {
    authAdminOk = false;
  }

  const host = (() => {
    try {
      return new URL(url).host;
    } catch {
      return "(invalid url)";
    }
  })();

  console.log(
    JSON.stringify(
      {
        ok: true,
        supabaseHost: host,
        tables: {
          profiles: { count: Number(profilesCount ?? 0) },
          favorites: { count: Number(favoritesCount ?? 0) },
        },
        views: {
          favorite_counts_by_plan: viewOk
            ? { ok: true, top5: (topFavPlans ?? []).map((r: any) => ({ plan_slug: String(r.plan_slug), favorites_count: Number(r.favorites_count) })) }
            : { ok: false },
        },
        recentFavorites: (lastFavorites ?? []).map((r: any) => ({
          user_id: String(r.user_id),
          plan_slug: String(r.plan_slug),
          created_at: String(r.created_at),
        })),
        authAdmin: authAdminOk ? { ok: true, sampleUsers: authSample } : { ok: false },
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(JSON.stringify({ ok: false, error: String(err?.message || err) }, null, 2));
  process.exitCode = 1;
});
