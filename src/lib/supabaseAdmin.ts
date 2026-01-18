import { createClient } from "@supabase/supabase-js";

type AdminSupabaseClient = ReturnType<typeof createClient>;

let cached: AdminSupabaseClient | null = null;
let loggedHost = false;

export function getSupabaseAdmin(): AdminSupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!loggedHost) {
    loggedHost = true;
    try {
      const host = url ? new URL(url).host : "";
      console.log(`[supabase] NEXT_PUBLIC_SUPABASE_URL host=${host || "(missing)"}`);
    } catch {
      console.log("[supabase] NEXT_PUBLIC_SUPABASE_URL host=(invalid)");
    }
  }

  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");
  }
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
  }

  cached = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}
