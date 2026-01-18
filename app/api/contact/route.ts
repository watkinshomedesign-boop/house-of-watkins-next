import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { hubspotUpsertContact } from "@/lib/hubspot/client";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type Payload = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  message: string;
  page_path?: string | null;
};

function getSupabaseAnonServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is required");
  if (!anonKey) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required");

  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Partial<Payload> | null;
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const first_name = String(body.first_name ?? "").trim();
    const last_name = String(body.last_name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = body.phone ? String(body.phone).trim() : null;
    const message = String(body.message ?? "").trim();
    const page_path = body.page_path ? String(body.page_path).trim() : "/contact-us";

    if (!first_name) return NextResponse.json({ error: "First name is required" }, { status: 400 });
    if (!last_name) return NextResponse.json({ error: "Last name is required" }, { status: 400 });
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
    if (!isValidEmail(email)) return NextResponse.json({ error: "Email is invalid" }, { status: 400 });
    if (!message) return NextResponse.json({ error: "Message is required" }, { status: 400 });

    const ua = req.headers.get("user-agent") ?? null;
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

    const supabase = getSupabaseAnonServerClient();

    const { error } = await supabase.from("contact_messages").insert({
      first_name,
      last_name,
      email,
      phone,
      message,
      page_path,
      user_agent: ua,
      ip,
      source: "contact_page",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let hubspotWarning: string | null = null;
    try {
      if (process.env.HUBSPOT_PRIVATE_APP_TOKEN) {
        await hubspotUpsertContact({
          email,
          firstname: first_name,
          lastname: last_name,
          phone: phone ?? undefined,
          message,
          pageUrl: page_path,
        });
      }
    } catch (e) {
      hubspotWarning = e instanceof Error ? e.message : "HubSpot failed";
      console.warn("HubSpot contact sync failed", hubspotWarning);
    }

    return NextResponse.json({ ok: true, hubspotWarning });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
