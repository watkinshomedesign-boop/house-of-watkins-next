import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const body = (await req.json().catch(() => ({}))) as any;

  const supabase = getSupabaseAdmin() as any;
  const { data: current, error: curErr }: any = await supabase
    .from("redirects")
    .select("id, is_auto")
    .eq("id", ctx.params.id)
    .maybeSingle();

  if (curErr) return NextResponse.json({ error: curErr.message }, { status: 500 });
  if (!current) return NextResponse.json({ error: "Redirect not found" }, { status: 404 });

  const patch: any = {
    disabled: body.disabled === undefined ? undefined : Boolean(body.disabled),
  };

  if (!current.is_auto) {
    if (body.to_path !== undefined || body.toPath !== undefined) {
      const toPath = String(body.to_path ?? body.toPath ?? "").trim();
      if (!toPath.startsWith("/")) return NextResponse.json({ error: "to_path must start with /" }, { status: 400 });
      patch.to_path = toPath;
    }
    if (body.status_code !== undefined || body.statusCode !== undefined) {
      const statusCode = Math.floor(Number(body.status_code ?? body.statusCode));
      if (![301, 302, 307, 308].includes(statusCode)) {
        return NextResponse.json({ error: "status_code must be 301/302/307/308" }, { status: 400 });
      }
      patch.status_code = statusCode;
    }
  }

  const { error }: any = await supabase.from("redirects").update(patch).eq("id", ctx.params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, locked: Boolean(current.is_auto) });
}
