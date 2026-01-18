import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

function paypalBaseUrl() {
  const env = String(process.env.PAYPAL_ENV || process.env.NEXT_PUBLIC_PAYPAL_ENV || "").toLowerCase();
  const mode = env || (process.env.NODE_ENV === "production" ? "live" : "sandbox");
  return mode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

async function getAccessToken() {
  const readFirst = (keys: string[]) => {
    for (const k of keys) {
      const v = String(process.env[k] ?? "").trim();
      if (v) return v;
    }
    return "";
  };

  const clientId = readFirst([
    "PAYPAL_CLIENT_ID",
    "NEXT_PUBLIC_PAYPAL_CLIENT_ID",
    "PAYPAL_PUBLIC_CLIENT_ID",
    "PAYPAL_CLIENTID",
  ]);
  const secret = readFirst(["PAYPAL_CLIENT_SECRET", "PAYPAL_SECRET", "PAYPAL_SECRET_KEY"]);

  if (!clientId || !secret) {
    throw new Error("PayPal not configured");
  }

  const res = await fetch(`${paypalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  const json = (await res.json()) as any;
  if (!res.ok) {
    throw new Error(String(json?.error_description || json?.error || "Failed to authenticate with PayPal"));
  }

  const token = String(json?.access_token || "");
  if (!token) throw new Error("Failed to authenticate with PayPal");
  return token;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { orderID?: string };
    const orderID = String(body.orderID || "").trim();
    if (!orderID) {
      return NextResponse.json({ error: "orderID is required" }, { status: 400 });
    }

    const token = await getAccessToken();
    const res = await fetch(`${paypalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(orderID)}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const json = (await res.json()) as any;
    if (!res.ok) {
      return NextResponse.json(
        { error: String(json?.message || json?.name || "PayPal capture failed") },
        { status: 500 },
      );
    }

    const captureId =
      String(json?.purchase_units?.[0]?.payments?.captures?.[0]?.id || "").trim() || null;

    const supabase = getSupabaseAdmin() as any;
    const { error: updErr }: any = await supabase
      .from("orders")
      .update({
        status: "paid",
        stripe_payment_intent_id: captureId ? `paypal:${captureId}` : null,
      } as any)
      .eq("stripe_checkout_session_id", `paypal:${orderID}`);

    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, captureId });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? "PayPal capture failed") }, { status: 500 });
  }
}
