import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const body = (await req.json()) as { status?: string };
  const status = String(body.status || "");

  if (status !== "published" && status !== "draft" && status !== "archived") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin() as any;
  const { error }: any = await supabase
    .from("plans")
    .update({ status } as any)
    .eq("id", ctx.params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
