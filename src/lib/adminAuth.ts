import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function requireAdmin() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const userEmail = (user?.email || "").trim().toLowerCase();

  if (!user || !adminEmail || userEmail !== adminEmail) {
    redirect("/admin/login");
  }

  return { user };
}

export async function isAdminUser() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const userEmail = (user?.email || "").trim().toLowerCase();

  return Boolean(user && adminEmail && userEmail === adminEmail);
}
