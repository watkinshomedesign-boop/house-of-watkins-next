import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const SESSION_COOKIE = "moss_session_id";
const VISITED_COOKIE = "moss_visited";

function getSupabaseAnonServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");
  if (!anonKey) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required");
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function getOrCreateSessionId(): string {
  const store = cookies();
  const existing = store.get(SESSION_COOKIE)?.value;
  if (existing) return existing;

  const sid = crypto.randomUUID();
  store.set(SESSION_COOKIE, sid, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return sid;
}

function checkIsNewVisitor(): boolean {
  const store = cookies();
  const visited = store.get(VISITED_COOKIE)?.value;
  if (visited) return false;

  store.set(VISITED_COOKIE, "1", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return true;
}

type Body = {
  path?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as Body;
    const path = String(body.path ?? "/").trim();
    const referrer = body.referrer ? String(body.referrer).trim() : null;
    const utm_source = body.utm_source ? String(body.utm_source).trim() : null;
    const utm_medium = body.utm_medium ? String(body.utm_medium).trim() : null;
    const utm_campaign = body.utm_campaign ? String(body.utm_campaign).trim() : null;

    const sessionId = getOrCreateSessionId();
    const isNewVisitor = checkIsNewVisitor();

    const ua = req.headers.get("user-agent") ?? null;
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

    const supabase = getSupabaseAnonServerClient();

    const { error } = await supabase.from("page_visits").insert({
      session_id: sessionId,
      path,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
      is_new_visitor: isNewVisitor,
      user_agent: ua,
      ip,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
