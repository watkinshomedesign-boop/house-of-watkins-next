import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

let loggedHost = false;

export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!loggedHost) {
    loggedHost = true;
    try {
      const host = url ? new URL(url).host : "";
      console.log(`[supabase] NEXT_PUBLIC_SUPABASE_URL host=${host || "(missing)"}`);
    } catch {
      console.log("[supabase] NEXT_PUBLIC_SUPABASE_URL host=(invalid)");
    }
  }

  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");
  if (!anonKey) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required");

  const cookieStore = cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: unknown[]) {
        for (const c of cookiesToSet as Array<{ name: string; value: string; options?: any }>) {
          try {
            cookieStore.set(c.name, c.value, c.options);
          } catch {
            // cookies().set is only allowed in Route Handlers and Server Actions.
            // When this client is used in a Server Component render, ignore cookie writes.
          }
        }
      },
    },
  });
}
