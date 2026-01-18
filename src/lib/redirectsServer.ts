import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function lookupRedirectServer(fromPath: string): Promise<{ toPath: string; statusCode: number } | null> {
  const normalize = (p: string) => {
    const withSlash = p.startsWith("/") ? p : `/${p}`;
    if (withSlash === "/") return "/";
    return withSlash.replace(/\/+$/, "");
  };

  try {
    const supabase = getSupabaseAdmin() as any;
    const { data, error }: any = await supabase
      .from("redirects")
      .select("to_path, status_code")
      .eq("from_path", fromPath)
      .maybeSingle();

    if (error) throw error;
    if (!data?.to_path) return null;

    const normalizedFrom = normalize(fromPath);
    const normalizedTo = normalize(String(data.to_path));
    if (normalizedTo === normalizedFrom) return null;

    return {
      toPath: String(data.to_path),
      statusCode: Number(data.status_code ?? 301),
    };
  } catch {
    return null;
  }
}
