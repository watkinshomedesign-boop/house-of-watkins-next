import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

const SESSION_COOKIE = "moss_session_id";
const THROTTLE_MS = 1500;

type EventBody = {
  event_name?: string;
  plan_slug?: string;
  metadata?: any;
};

const lastSeen = new Map<string, number>();

function getOrCreateSessionId() {
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

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as EventBody;
  const eventName = String(body.event_name ?? "").trim();
  const planSlug = body.plan_slug ? String(body.plan_slug) : null;
  const metadata = body.metadata ?? {};

  if (!eventName) {
    return NextResponse.json({ error: "event_name is required" }, { status: 400 });
  }

  const sessionId = getOrCreateSessionId();

  const throttleKey = `${sessionId}:${eventName}:${planSlug ?? ""}`;
  const now = Date.now();
  const last = lastSeen.get(throttleKey) ?? 0;
  if (now - last < THROTTLE_MS) {
    return NextResponse.json({ ok: true, throttled: true });
  }
  lastSeen.set(throttleKey, now);

  const supabase = createSupabaseServerClient() as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error }: any = await supabase.from("events").insert({
    event_name: eventName,
    session_id: sessionId,
    user_id: user?.id ?? null,
    plan_slug: planSlug,
    metadata,
    path: metadata?.path ?? null,
    payload: metadata,
  });

  if (error) {
    return NextResponse.json({ error: error.message ?? "Failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
