import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { quoteFromSupabase } from "@/lib/serverQuote";
import { applyBuilderPromoToQuote } from "@/lib/builderPromo/applyToQuote";
import { validateBuilderPromoCode } from "@/lib/builderPromo/validateServer";

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

function formatAmount(cents: number) {
  return (Math.round(Number(cents) || 0) / 100).toFixed(2);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      email?: string;
      planChangeDescription?: string;
      items?: Array<{
        slug: string;
        license: "single" | "builder";
        addOns?: {
          readableReverse?: boolean;
          cad?: boolean;
          minorChanges?: boolean;
          sitePlan?: boolean;
          smallAdjustments?: boolean;
          additions?: boolean;
        };
        rush?: boolean;
        paperSets?: number;
        qty?: number;
      }>;
      builderCode?: string;
      returnUrl?: string;
      cancelUrl?: string;
    };

    const email = (body.email ?? "").trim();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const items = body.items ?? [];
    const planChangeDescription = String(body.planChangeDescription ?? "").trim();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
    }

    const { quote: baseQuote } = await quoteFromSupabase({ items });

    let quote = baseQuote;
    let appliedPromo: any = null;
    try {
      const promo = body.builderCode ? await validateBuilderPromoCode(body.builderCode) : null;
      if (promo) {
        const applied = applyBuilderPromoToQuote(baseQuote, {
          discountPercent: promo.discountPercent,
          cadDiscountPercent: promo.cadDiscountPercent,
        });
        quote = applied.quote;
        appliedPromo = {
          code: promo.code,
          builderProfileId: promo.builderProfileId,
        };
      }
    } catch {
      // ignore promo errors; proceed without discount
    }

    const shippingRequired = quote.items.some((it) => it.shippingRequired);

    const returnUrl = String(body.returnUrl ?? "").trim();
    const cancelUrl = String(body.cancelUrl ?? "").trim();

    const applicationContext: any = {};
    if (shippingRequired) applicationContext.shipping_preference = "GET_FROM_FILE";
    if (returnUrl) applicationContext.return_url = returnUrl;
    if (cancelUrl) applicationContext.cancel_url = cancelUrl;

    const token = await getAccessToken();
    const createRes = await fetch(`${paypalBaseUrl()}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        application_context: Object.keys(applicationContext).length > 0 ? applicationContext : undefined,
        purchase_units: [
          {
            description: "House Plans Order",
            amount: {
              currency_code: "USD",
              value: formatAmount(quote.totalCents),
            },
          },
        ],
      }),
      cache: "no-store",
    });

    const createJson = (await createRes.json()) as any;
    if (!createRes.ok) {
      return NextResponse.json(
        { error: String(createJson?.message || createJson?.name || "PayPal order creation failed") },
        { status: 500 },
      );
    }

    const id = String(createJson?.id || "");
    if (!id) {
      return NextResponse.json({ error: "PayPal order creation failed" }, { status: 500 });
    }

    const links = Array.isArray(createJson?.links) ? createJson.links : [];
    const approvalUrl =
      String(links.find((l: any) => l?.rel === "approve")?.href || "").trim() ||
      String(links.find((l: any) => l?.rel === "payer-action")?.href || "").trim() ||
      "";

    const supabase = getSupabaseAdmin() as any;
    const { error: orderErr }: any = await supabase.from("orders").insert({
      stripe_checkout_session_id: `paypal:${id}`,
      stripe_payment_intent_id: null,
      email,
      phone: null,
      cart_snapshot: items as any,
      plan_change_description: planChangeDescription || null,
      shipping_required: shippingRequired,
      status: "pending",
      subtotal_cents: quote.subtotalCents,
      shipping_cents: quote.shippingCents,
      total_cents: quote.totalCents,
      currency: quote.currency,
      builder_code: appliedPromo?.code ?? null,
      builder_profile_id: appliedPromo?.builderProfileId ?? null,
    } as any);

    if (orderErr) {
      return NextResponse.json({ error: orderErr.message }, { status: 500 });
    }

    return NextResponse.json({ id, approvalUrl: approvalUrl || undefined });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? "PayPal not configured") }, { status: 500 });
  }
}
