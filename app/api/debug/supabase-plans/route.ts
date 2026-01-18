import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

function supabaseHost() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

export async function GET() {
  const admin = getSupabaseAdmin() as any;

  const { count: totalCount, error: totalErr } = await admin
    .from("plans")
    .select("*", { count: "exact", head: true });

  if (totalErr) {
    return NextResponse.json({ error: totalErr.message, supabaseHost: supabaseHost() }, { status: 500 });
  }

  const { count: publishedCount, error: pubErr } = await admin
    .from("plans")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  if (pubErr) {
    return NextResponse.json({ error: pubErr.message, supabaseHost: supabaseHost(), totalCount }, { status: 500 });
  }

  const { data: slugs, error: slugsErr } = await admin
    .from("plans")
    .select("slug")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(20);

  if (slugsErr) {
    return NextResponse.json(
      { error: slugsErr.message, supabaseHost: supabaseHost(), totalCount, publishedCount },
      { status: 500 }
    );
  }

  return NextResponse.json({
    supabaseHost: supabaseHost(),
    totalCount,
    publishedCount,
    publishedSlugs: (slugs ?? []).map((r: any) => String(r.slug)),
  });
}
