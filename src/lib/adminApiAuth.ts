import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function requireAdminApi() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const userEmail = (user?.email || "").trim().toLowerCase();

  if (!user || !adminEmail || userEmail !== adminEmail) {
    return { ok: false as const, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  return { ok: true as const, user };
}
