import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request, ctx: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);
  const range = String(url.searchParams.get("range") || "30d");
  const view = range === "total" ? "plan_stats_total" : "plan_stats_30d";

  const supabase = getSupabaseAdmin() as any;

  const { data: plan, error: planErr }: any = await supabase
    .from("plans")
    .select("id, slug")
    .eq("id", ctx.params.id)
    .maybeSingle();

  if (planErr) return NextResponse.json({ error: planErr.message }, { status: 500 });
  if (!plan?.slug) return NextResponse.json({ error: "Plan not found" }, { status: 404 });

  const { data, error }: any = await supabase
    .from(view)
    .select("plan_slug, views_count, favorites_count, purchases_count")
    .eq("plan_slug", plan.slug)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const views = Number(data?.views_count ?? 0);
  const favorites = Number(data?.favorites_count ?? 0);
  const purchases = Number(data?.purchases_count ?? 0);
  const conversionRate = views > 0 ? purchases / views : 0;

  return NextResponse.json({
    range: range === "total" ? "total" : "30d",
    plan: { id: String(plan.id), slug: String(plan.slug) },
    stats: { views, favorites, purchases, conversionRate },
  });
}
