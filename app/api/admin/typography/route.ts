import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/adminApiAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { TYPOGRAPHY_PAGES, TYPOGRAPHY_TEMPLATES } from "@/lib/typographyRegistry";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  return NextResponse.json({ templates: TYPOGRAPHY_TEMPLATES, uniquePages: TYPOGRAPHY_PAGES });
}

export async function POST() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  const supabase = getSupabaseAdmin() as any;

  const templates = TYPOGRAPHY_TEMPLATES.map((t) => ({
    template_key: t.templateKey,
    label: t.label,
    instances_count: t.instancesCount,
  }));

  const pages = TYPOGRAPHY_PAGES.map((p) => ({
    page_key: p.pageKey,
    label: p.label,
  }));

  const { error: templatesError } = await supabase
    .from("typography_templates")
    .upsert(templates, { onConflict: "template_key" });
  if (templatesError) return NextResponse.json({ error: templatesError.message }, { status: 500 });

  const { error: pagesError } = await supabase.from("typography_pages").upsert(pages, { onConflict: "page_key" });
  if (pagesError) return NextResponse.json({ error: pagesError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
