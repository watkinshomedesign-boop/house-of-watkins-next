import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);
  const range = String(url.searchParams.get("range") || "30d");
  const view = range === "total" ? "plan_stats_total" : "plan_stats_30d";

  const supabase = getSupabaseAdmin() as any;
  const { data, error }: any = await supabase.from(view).select("plan_slug, views_count, favorites_count, purchases_count");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [], range: range === "total" ? "total" : "30d" });
}
