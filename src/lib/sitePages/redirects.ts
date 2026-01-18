import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function upsertRedirectServer(params: {
  fromPath: string;
  toPath: string;
  statusCode?: number;
  isAuto?: boolean;
}) {
  const fromPath = params.fromPath.startsWith("/") ? params.fromPath : `/${params.fromPath}`;
  const toPath = params.toPath.startsWith("/") ? params.toPath : `/${params.toPath}`;

  try {
    const supabase = getSupabaseAdmin() as any;
    await supabase
      .from("redirects")
      .upsert(
        {
          from_path: fromPath,
          to_path: toPath,
          status_code: params.statusCode ?? 301,
          disabled: false,
          is_auto: params.isAuto ?? true,
        },
        { onConflict: "from_path" },
      );
  } catch {
    // best-effort
  }
}
