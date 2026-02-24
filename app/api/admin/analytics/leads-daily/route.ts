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

  const { data: leads, error }: any = await supabase
    .from("lead_signups")
    .select("created_at, email, source")
    .gte("created_at", startIso)
    .order("created_at", { ascending: true })
    .limit(100000);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const dailyMap = new Map<string, number>();
  for (const key of dayKeys) {
    dailyMap.set(key, 0);
  }

  const sourceCounts = new Map<string, number>();

  for (const l of leads ?? []) {
    const day = String(l.created_at).slice(0, 10);
    if (dailyMap.has(day)) {
      dailyMap.set(day, dailyMap.get(day)! + 1);
    }
    const src = String(l.source || "unknown").trim();
    sourceCounts.set(src, (sourceCounts.get(src) ?? 0) + 1);
  }

  const daily = dayKeys.map((day) => ({
    date: day,
    leads: dailyMap.get(day) ?? 0,
  }));

  const totalLeads = daily.reduce((s, d) => s + d.leads, 0);

  const topSources = Array.from(sourceCounts.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return NextResponse.json({
    days,
    total_leads: totalLeads,
    daily,
    topSources,
  });
}
