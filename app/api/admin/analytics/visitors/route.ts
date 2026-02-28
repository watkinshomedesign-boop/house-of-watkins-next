import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

function lastNDays(n: number): string[] {
  const days: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);
  const days = Math.max(7, Math.min(90, Number(url.searchParams.get("days") ?? 30) || 30));
  const dayKeys = lastNDays(days);
  const startIso = `${dayKeys[0]}T00:00:00.000Z`;

  const supabase = getSupabaseAdmin() as any;

  // Use server-side aggregation via RPC to avoid Supabase row limits
  const [dailyRes, referrerRes, sourceRes, uniqueRes] = await Promise.all([
    supabase.rpc("get_daily_visitor_stats", { start_date: startIso }),
    supabase.rpc("get_top_referrers", { start_date: startIso, max_rows: 20 }),
    supabase.rpc("get_top_sources", { start_date: startIso, max_rows: 20 }),
    supabase.rpc("get_total_unique_visitors", { start_date: startIso }),
  ]);

  if (dailyRes.error) return NextResponse.json({ error: dailyRes.error.message }, { status: 500 });

  // Build daily map from RPC results
  const dailyMap = new Map<string, { total: number; unique: number; newV: number; returning: number }>();
  for (const row of dailyRes.data ?? []) {
    dailyMap.set(row.day, {
      total: Number(row.total_visits),
      unique: Number(row.unique_sessions),
      newV: Number(row.new_visitors),
      returning: Number(row.returning_visitors),
    });
  }

  const daily = dayKeys.map((day) => {
    const entry = dailyMap.get(day);
    return {
      date: day,
      total_visits: entry?.total ?? 0,
      unique_visitors: entry?.unique ?? 0,
      new_visitors: entry?.newV ?? 0,
      returning_visitors: entry?.returning ?? 0,
    };
  });

  const topReferrers = (referrerRes.data ?? []).map((r: any) => ({
    domain: r.domain,
    count: Number(r.visit_count),
  }));

  const topSources = (sourceRes.data ?? []).map((s: any) => ({
    source: s.source,
    count: Number(s.visit_count),
  }));

  const totalVisits = daily.reduce((s, d) => s + d.total_visits, 0);
  const totalUnique = typeof uniqueRes.data === "number" ? uniqueRes.data : Number(uniqueRes.data ?? 0);
  const totalNew = daily.reduce((s, d) => s + d.new_visitors, 0);
  const totalReturning = daily.reduce((s, d) => s + d.returning_visitors, 0);

  return NextResponse.json({
    days,
    summary: {
      total_visits: totalVisits,
      unique_visitors: totalUnique,
      new_visitors: totalNew,
      returning_visitors: totalReturning,
    },
    daily,
    topReferrers,
    topSources,
  });
}
