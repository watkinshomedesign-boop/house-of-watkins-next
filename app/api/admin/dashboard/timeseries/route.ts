import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const PURCHASE_STATUSES = new Set(["paid", "pdf_sent", "print_queued", "shipped", "complete"]);

type Point = { day: string; count: number };

function lastNDays(n: number) {
  const out: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push(key);
  }
  return out;
}

function fillSeries(days: string[], map: Map<string, number>): Point[] {
  return days.map((day) => ({ day, count: map.get(day) ?? 0 }));
}

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);
  const days = Math.max(7, Math.min(60, Number(url.searchParams.get("days") ?? 30) || 30));
  const dayKeys = lastNDays(days);
  const startIso = `${dayKeys[0]}T00:00:00.000Z`;

  const supabase = getSupabaseAdmin() as any;

  const { data: viewEvents, error: viewErr }: any = await supabase
    .from("events")
    .select("created_at")
    .eq("event_name", "plan_view")
    .gte("created_at", startIso)
    .limit(100000);
  if (viewErr) return NextResponse.json({ error: viewErr.message }, { status: 500 });

  const { data: favEvents, error: favErr }: any = await supabase
    .from("events")
    .select("created_at")
    .eq("event_name", "favorite_add")
    .gte("created_at", startIso)
    .limit(100000);
  if (favErr) return NextResponse.json({ error: favErr.message }, { status: 500 });

  const { data: orders, error: ordErr }: any = await supabase
    .from("orders")
    .select("created_at,status")
    .gte("created_at", startIso)
    .limit(100000);
  if (ordErr) return NextResponse.json({ error: ordErr.message }, { status: 500 });

  const viewsMap = new Map<string, number>();
  for (const e of viewEvents ?? []) {
    const day = String(e.created_at).slice(0, 10);
    viewsMap.set(day, (viewsMap.get(day) ?? 0) + 1);
  }

  const favsMap = new Map<string, number>();
  for (const e of favEvents ?? []) {
    const day = String(e.created_at).slice(0, 10);
    favsMap.set(day, (favsMap.get(day) ?? 0) + 1);
  }

  const purchasesMap = new Map<string, number>();
  for (const o of orders ?? []) {
    const status = String(o.status ?? "");
    if (!PURCHASE_STATUSES.has(status)) continue;
    const day = String(o.created_at).slice(0, 10);
    purchasesMap.set(day, (purchasesMap.get(day) ?? 0) + 1);
  }

  return NextResponse.json({
    days,
    series: {
      views: fillSeries(dayKeys, viewsMap),
      favorites: fillSeries(dayKeys, favsMap),
      purchases: fillSeries(dayKeys, purchasesMap),
    },
  });
}
