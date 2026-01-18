import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { getSupabaseAdmin } from "../src/lib/supabaseAdmin";
import { TYPOGRAPHY_PAGES, TYPOGRAPHY_TEMPLATES } from "../src/lib/typographyRegistry";
import { PAGE_CONTENT_AREAS, TEMPLATE_CONTENT_AREAS } from "../src/lib/typographyContentAreas";

function isEmptyContent(v: unknown): boolean {
  if (!v) return true;
  if (typeof v !== "object") return true;
  return Object.keys(v as any).length === 0;
}

function buildDefaultContentFromAreas(areas: { key: string; type: string; defaultStyle: string; previewText: string }[]) {
  const content: Record<string, any> = {};
  for (const a of areas) {
    if (a.type === "rich_text") {
      content[a.key] = {
        runs: [{ text: a.previewText, style: a.defaultStyle }],
      };
    } else {
      content[a.key] = { style: a.defaultStyle };
    }
  }
  return content;
}

async function main() {
  const supabase = getSupabaseAdmin() as any;

  const { data: existingTemplates, error: existingTemplatesError }: any = await supabase
    .from("typography_templates")
    .select("template_key, content");
  if (existingTemplatesError) throw existingTemplatesError;

  const existingTemplateMap = new Map<string, any>();
  for (const row of existingTemplates ?? []) {
    existingTemplateMap.set(row.template_key, row.content);
  }

  const templateRows = TYPOGRAPHY_TEMPLATES.map((t) => {
    const existingContent = existingTemplateMap.get(t.templateKey);
    const defaultAreas = TEMPLATE_CONTENT_AREAS[t.templateKey] ?? [];
    const defaultContent = buildDefaultContentFromAreas(defaultAreas as any);

    return {
      template_key: t.templateKey,
      label: t.label,
      instances_count: t.instancesCount,
      content: isEmptyContent(existingContent) ? defaultContent : existingContent,
    };
  });

  const { data: upsertedTemplates, error: upsertTemplatesError }: any = await supabase
    .from("typography_templates")
    .upsert(templateRows, { onConflict: "template_key" })
    .select("template_key, label");
  if (upsertTemplatesError) throw upsertTemplatesError;

  const { data: existingPages, error: existingPagesError }: any = await supabase
    .from("typography_pages")
    .select("page_key, content");
  if (existingPagesError) throw existingPagesError;

  const existingPageMap = new Map<string, any>();
  for (const row of existingPages ?? []) {
    existingPageMap.set(row.page_key, row.content);
  }

  const pageRows = TYPOGRAPHY_PAGES.map((p) => {
    const existingContent = existingPageMap.get(p.pageKey);
    const defaultAreas = PAGE_CONTENT_AREAS[p.pageKey] ?? [];
    const defaultContent = buildDefaultContentFromAreas(defaultAreas as any);

    return {
      page_key: p.pageKey,
      label: p.label,
      content: isEmptyContent(existingContent) ? defaultContent : existingContent,
    };
  });

  const { data: upsertedPages, error: upsertPagesError }: any = await supabase
    .from("typography_pages")
    .upsert(pageRows, { onConflict: "page_key" })
    .select("page_key, label");
  if (upsertPagesError) throw upsertPagesError;

  console.log(`Upserted ${upsertedTemplates?.length ?? 0} typography templates`);
  for (const row of upsertedTemplates ?? []) {
    console.log(`- template: ${row.template_key} (${row.label})`);
  }

  console.log(`Upserted ${upsertedPages?.length ?? 0} typography pages`);
  for (const row of upsertedPages ?? []) {
    console.log(`- page: ${row.page_key} (${row.label})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
