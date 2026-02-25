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

  const { data: visits, error }: any = await supabase
    .from("page_visits")
    .select("created_at, session_id, referrer, is_new_visitor, utm_source")
    .gte("created_at", startIso)
    .order("created_at", { ascending: true })
    .limit(200000);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Daily stats: total visits, unique sessions, new visitors, returning visitors
  const dailyMap = new Map<string, { total: number; sessions: Set<string>; newVisitors: number; returning: number }>();
  for (const key of dayKeys) {
    dailyMap.set(key, { total: 0, sessions: new Set(), newVisitors: 0, returning: 0 });
  }

  // Referrer counts
  const referrerCounts = new Map<string, number>();

  // Source counts (utm_source or derived from referrer)
  const sourceCounts = new Map<string, number>();

  for (const v of visits ?? []) {
    const day = String(v.created_at).slice(0, 10);
    const entry = dailyMap.get(day);
    if (!entry) continue;

    entry.total++;
    entry.sessions.add(v.session_id);
    if (v.is_new_visitor) {
      entry.newVisitors++;
    } else {
      entry.returning++;
    }

    // Referrer
    const ref = parseReferrerDomain(v.referrer);
    if (ref) {
      referrerCounts.set(ref, (referrerCounts.get(ref) ?? 0) + 1);
    }

    // Source
    const source = v.utm_source || ref || "direct";
    sourceCounts.set(source, (sourceCounts.get(source) ?? 0) + 1);
  }

  const daily = dayKeys.map((day) => {
    const entry = dailyMap.get(day)!;
    return {
      date: day,
      total_visits: entry.total,
      unique_visitors: entry.sessions.size,
      new_visitors: entry.newVisitors,
      returning_visitors: entry.returning,
    };
  });

  // Top referrers sorted by count
  const topReferrers = Array.from(referrerCounts.entries())
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  // Top sources sorted by count
  const topSources = Array.from(sourceCounts.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  // Summary totals
  const totalVisits = daily.reduce((s, d) => s + d.total_visits, 0);
  const totalUnique = new Set((visits ?? []).map((v: any) => v.session_id)).size;
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

function parseReferrerDomain(referrer: string | null): string | null {
  if (!referrer) return null;
  const r = String(referrer).trim();
  if (!r || r === "" || r === "null") return null;
  try {
    const hostname = new URL(r).hostname;
    // Exclude own domain
    if (hostname === "houseofwatkins.com" || hostname === "www.houseofwatkins.com") return null;
    return hostname;
  } catch {
    return null;
  }
}
