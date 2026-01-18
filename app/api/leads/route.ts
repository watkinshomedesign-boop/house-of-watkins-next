import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { hubspotUpsertContact } from "@/lib/hubspot/client";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type LeadUserType = "homeowner" | "builder";

type Payload = {
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  user_type?: LeadUserType | null;
  source?: string | null;
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

function normalizeUserType(value: unknown): LeadUserType {
  const s = String(value ?? "").trim().toLowerCase();
  if (s === "builder") return "builder";
  return "homeowner";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Partial<Payload> | null;
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const first_name = body.first_name ? String(body.first_name).trim() : null;
    const last_name = body.last_name ? String(body.last_name).trim() : null;
    const email = String(body.email ?? "").trim();
    const user_type = normalizeUserType(body.user_type);
    const source = body.source ? String(body.source).trim() : "lead_capture";
    const page_path = body.page_path ? String(body.page_path).trim() : null;

    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
    if (!isValidEmail(email)) return NextResponse.json({ error: "Email is invalid" }, { status: 400 });

    const ua = req.headers.get("user-agent") ?? null;
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

    const supabase = getSupabaseAnonServerClient();

    const { error } = await supabase.from("lead_signups").insert({
      first_name,
      last_name,
      email,
      user_type,
      source,
      page_path,
      user_agent: ua,
      ip,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let hubspotWarning: string | null = null;
    try {
      if (process.env.HUBSPOT_PRIVATE_APP_TOKEN) {
        await hubspotUpsertContact({
          email,
          firstname: first_name ?? undefined,
          lastname: last_name ?? undefined,
          pageUrl: page_path ?? undefined,
          extraProperties: {
            contact_type: user_type,
            lead_source: source,
          },
        });
      }
    } catch (e) {
      hubspotWarning = e instanceof Error ? e.message : "HubSpot failed";
      console.warn("HubSpot lead sync failed", hubspotWarning);
    }

    return NextResponse.json({ ok: true, hubspotWarning });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
