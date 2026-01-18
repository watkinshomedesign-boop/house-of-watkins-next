import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

function csvEscape(value: unknown) {
  const s = String(value ?? "");
  if (/[\n\r,\"]/g.test(s)) {
    return `"${s.replace(/\"/g, '""')}"`;
  }
  return s;
}

export async function GET(req: Request) {
  await requireAdmin();
  const url = new URL(req.url);
  const q = String(url.searchParams.get("q") ?? "").trim();

  const supabase = getSupabaseAdmin();

  let query = supabase
    .from("contact_messages")
    .select("created_at,first_name,last_name,email,phone,message,page_path,source")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (q) {
    const like = `%${q}%`;
    query = query.or(`email.ilike.${like},first_name.ilike.${like},last_name.ilike.${like}`);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const header = [
    "created_at",
    "first_name",
    "last_name",
    "email",
    "phone",
    "message",
    "page_path",
    "source",
  ].join(",");

  const lines = (data ?? []).map((r: any) =>
    [
      r.created_at,
      r.first_name,
      r.last_name,
      r.email,
      r.phone,
      r.message,
      r.page_path,
      r.source,
    ]
      .map(csvEscape)
      .join(",")
  );

  const csv = [header, ...lines].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename=contact-messages.csv`,
      "cache-control": "no-store",
    },
  });
}
