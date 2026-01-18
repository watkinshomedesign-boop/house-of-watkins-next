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
  const q = (url.searchParams.get("q") || "").trim();
  const includeDisabled = String(url.searchParams.get("includeDisabled") || "false") === "true";

  const limit = Math.min(parseIntParam(url.searchParams.get("limit"), 200), 500);
  const offset = Math.max(0, parseIntParam(url.searchParams.get("offset"), 0));

  const supabase = getSupabaseAdmin() as any;

  let query = supabase
    .from("redirects")
    .select("id, from_path, to_path, status_code, disabled, is_auto, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (!includeDisabled) query = query.eq("disabled", false);
  if (q) query = query.or(`from_path.ilike.%${q}%,to_path.ilike.%${q}%`);

  const { data, error, count }: any = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data: data ?? [], count: Number(count ?? 0), limit, offset });
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const body = (await req.json().catch(() => ({}))) as any;
  const fromPath = String(body.from_path || body.fromPath || "").trim();
  const toPath = String(body.to_path || body.toPath || "").trim();
  const statusCode = body.status_code == null ? 301 : Math.floor(Number(body.status_code));

  if (!fromPath.startsWith("/")) return NextResponse.json({ error: "from_path must start with /" }, { status: 400 });
  if (!toPath.startsWith("/")) return NextResponse.json({ error: "to_path must start with /" }, { status: 400 });
  if (![301, 302, 307, 308].includes(statusCode)) {
    return NextResponse.json({ error: "status_code must be 301/302/307/308" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin() as any;
  const { data, error }: any = await supabase
    .from("redirects")
    .insert({
      from_path: fromPath,
      to_path: toPath,
      status_code: statusCode,
      disabled: Boolean(body.disabled ?? false),
      is_auto: false,
    })
    .select("id")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: data?.id ?? null });
}
