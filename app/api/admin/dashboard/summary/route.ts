import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const PURCHASE_STATUSES = new Set(["paid", "pdf_sent", "print_queued", "shipped", "complete"]);

function sumStats(rows: any[]) {
  let views = 0;
  let favs = 0;
  let purchases = 0;
  for (const r of rows) {
    views += Number(r?.views_count ?? 0);
    favs += Number(r?.favorites_count ?? 0);
    purchases += Number(r?.purchases_count ?? 0);
  }
  return { views, favs, purchases };
}

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);
  const range = String(url.searchParams.get("range") || "30d");
  const view = range === "total" ? "plan_stats_total" : "plan_stats_30d";

  const supabase = getSupabaseAdmin() as any;

  const { data: statsRows, error: statsErr }: any = await supabase
    .from(view)
    .select("plan_slug, views_count, favorites_count, purchases_count");
  if (statsErr) return NextResponse.json({ error: statsErr.message }, { status: 500 });

  const totals = sumStats(statsRows ?? []);
  const conversionRate = totals.views > 0 ? totals.purchases / totals.views : 0;

  const topByViews = [...(statsRows ?? [])]
    .sort((a, b) => Number(b.views_count ?? 0) - Number(a.views_count ?? 0))
    .slice(0, 5);
  const topByFavorites = [...(statsRows ?? [])]
    .sort((a, b) => Number(b.favorites_count ?? 0) - Number(a.favorites_count ?? 0))
    .slice(0, 5);
  const topByPurchases = [...(statsRows ?? [])]
    .sort((a, b) => Number(b.purchases_count ?? 0) - Number(a.purchases_count ?? 0))
    .slice(0, 5);

  const { count: totalOrdersCount }: any = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .in("status", [...PURCHASE_STATUSES]);

  const { count: builderOrdersCount }: any = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .in("status", [...PURCHASE_STATUSES])
    .not("builder_code", "is", null);

  const builderShare =
    Number(totalOrdersCount ?? 0) > 0 ? Number(builderOrdersCount ?? 0) / Number(totalOrdersCount ?? 0) : 0;

  const { data: builderOrders }: any = await supabase
    .from("orders")
    .select("builder_code,total_cents,currency")
    .in("status", [...PURCHASE_STATUSES])
    .not("builder_code", "is", null)
    .limit(5000);

  const topBuilderCodes = (() => {
    const rows = (builderOrders ?? []) as any[];
    const map = new Map<string, { code: string; revenueCents: number; orders: number; currency: string }>();
    for (const r of rows) {
      const code = String(r?.builder_code ?? "");
      if (!code) continue;
      const currency = String(r?.currency ?? "usd");
      const key = `${currency}:${code}`;
      const cur = map.get(key) ?? { code, revenueCents: 0, orders: 0, currency };
      cur.revenueCents += Number(r?.total_cents ?? 0);
      cur.orders += 1;
      map.set(key, cur);
    }
    return [...map.values()].sort((a, b) => b.revenueCents - a.revenueCents).slice(0, 10);
  })();

  return NextResponse.json({
    range: range === "total" ? "total" : "30d",
    totals: {
      views: totals.views,
      favorites: totals.favs,
      purchases: totals.purchases,
      conversionRate,
    },
    top5: {
      byViews: topByViews,
      byFavorites: topByFavorites,
      byPurchases: topByPurchases,
    },
    builder: {
      ordersWithBuilderCode: Number(builderOrdersCount ?? 0),
      totalOrders: Number(totalOrdersCount ?? 0),
      share: builderShare,
      topCodesByRevenue: topBuilderCodes,
    },
  });
}
