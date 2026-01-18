import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { collectSupabaseDiagnosticsReport } from "@/lib/supabaseDiagnostics";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const report = await collectSupabaseDiagnosticsReport();
    return NextResponse.json({ ok: true, report });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Failed" }, { status: 500 });
  }
}
