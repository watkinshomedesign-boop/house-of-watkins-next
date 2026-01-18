import { createClient } from "@supabase/supabase-js";

export async function getTypographyTemplateContent(templateKey: string): Promise<any> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  const supabase = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase
    .from("typography_templates")
    .select("content")
    .eq("template_key", templateKey)
    .maybeSingle();

  if (error) return null;
  return (data as any)?.content ?? null;
}

export async function getTypographyPageContent(pageKey: string): Promise<any> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  const supabase = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await supabase.from("typography_pages").select("content").eq("page_key", pageKey).maybeSingle();

  if (error) return null;
  return (data as any)?.content ?? null;
}
