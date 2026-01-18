import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

function parseIntParam(v: string | null, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.floor(n) : fallback;
}

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);
  const planId = (url.searchParams.get("plan_id") || url.searchParams.get("planId") || "").trim();
  const kind = (url.searchParams.get("kind") || "").trim();
  const q = (url.searchParams.get("q") || "").trim();

  const limit = Math.min(parseIntParam(url.searchParams.get("limit"), 200), 500);
  const offset = Math.max(0, parseIntParam(url.searchParams.get("offset"), 0));

  const supabase = getSupabaseAdmin() as any;

  let query = supabase
    .from("plan_media")
    .select("id, plan_id, kind, file_path, is_external, alt, caption, sort_order, created_at, plans:plans(id, slug, name)", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (planId) query = query.eq("plan_id", planId);
  if (kind) query = query.eq("kind", kind);
  if (q) query = query.ilike("file_path", `%${q}%`);

  const { data, error, count }: any = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: data ?? [], count: Number(count ?? 0), limit, offset });
}
