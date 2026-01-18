import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { sendOrderEmail } from "@/lib/mail";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { formatUsd, quoteFromSupabase } from "@/lib/serverQuote";
import { applyBuilderPromoToQuote } from "@/lib/builderPromo/applyToQuote";
import { validateBuilderPromoCode } from "@/lib/builderPromo/validateServer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });

export async function POST(req: Request) {
  const sig = headers().get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret missing" }, { status: 400 });
  }
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const adminEmail = process.env.ADMIN_EMAIL || "";

    const checkoutSessionId = session.id;
    const customerEmail = session.customer_details?.email || session.customer_email || "unknown";
    const cartRaw = session.metadata?.cart || "[]";
    const builderCode = String(session.metadata?.builder_code ?? "").trim();

    let cartItems: any[] = [];
    try {
      cartItems = JSON.parse(cartRaw);
    } catch {
      cartItems = [];
    }

    const supabaseAny = getSupabaseAdmin() as any;

    const { data: order, error: orderLookupErr }: any = await supabaseAny
      .from("orders")
      .select("id, status")
      .eq("stripe_checkout_session_id", checkoutSessionId)
      .maybeSingle();

    if (orderLookupErr) {
      return NextResponse.json({ error: orderLookupErr.message }, { status: 500 });
    }
    if (!order) {
      return NextResponse.json({ error: "Order not found for checkout session" }, { status: 404 });
    }

    // Idempotency: if already paid (or beyond), don't re-insert items
    const alreadyPaid = order.status && order.status !== "pending";

    const shippingAddress = session.shipping_details?.address
      ? {
          name: session.shipping_details?.name ?? null,
          address: session.shipping_details.address,
        }
      : null;

    const billingAddress = session.customer_details?.address
      ? {
          name: session.customer_details?.name ?? null,
          address: session.customer_details.address,
        }
      : null;

    const paymentIntentId =
      typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

    const updatePayload: Record<string, unknown> = {
      status: "paid",
      stripe_payment_intent_id: paymentIntentId ?? null,
      billing_address: billingAddress,
      shipping_address: shippingAddress,
    };
    if (customerEmail !== "unknown") {
      updatePayload.email = customerEmail;
    }
    if (builderCode) {
      updatePayload.builder_code = builderCode;
    }

    const { error: updErr }: any = await supabaseAny
      .from("orders")
      .update(updatePayload as any)
      .eq("id", order.id);

    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }

    // Re-quote from metadata cart snapshot to generate order_items
    const { quote: baseQuote, plans } = await quoteFromSupabase({ items: cartItems as any });
    let quote = baseQuote;
    try {
      const promo = builderCode ? await validateBuilderPromoCode(builderCode) : null;
      if (promo) {
        quote = applyBuilderPromoToQuote(baseQuote, {
          discountPercent: promo.discountPercent,
          cadDiscountPercent: promo.cadDiscountPercent,
        }).quote;
      }
    } catch {
      // ignore promo errors
    }
    const planBySlug = new Map(plans.map((p) => [p.slug, p]));

    // Keep shipping_required aligned with authoritative quote
    const shippingRequired = quote.items.some((i) => i.shippingRequired);
    const { error: shipReqErr }: any = await supabaseAny
      .from("orders")
      .update({ shipping_required: shippingRequired } as any)
      .eq("id", order.id);
    if (shipReqErr) {
      return NextResponse.json({ error: shipReqErr.message }, { status: 500 });
    }

    if (!alreadyPaid) {
      const { error: delErr }: any = await supabaseAny.from("order_items").delete().eq("order_id", order.id);
      if (delErr) {
        return NextResponse.json({ error: delErr.message }, { status: 500 });
      }

      const rows = (cartItems as any[]).map((it) => {
        const plan = planBySlug.get(String(it.slug));
        return {
          order_id: order.id,
          plan_id: plan?.id ?? null,
          slug: String(it.slug),
          name: plan?.name ?? String(it.slug),
          heated_sqft_used: plan?.heated_sqft ?? 0,
          license_type: String(it.license),
          addons: it.addOns ?? {},
          rush: Boolean(it.rush),
          paper_sets: Number(it.paperSets ?? 0),
          unit_price_cents: 0,
          line_total_cents: 0,
        };
      });

      // Fill per-line totals from quote.items (by planId + name) when possible
      for (const row of rows) {
        const qItem = quote.items.find((qi) => qi.planId === row.plan_id);
        if (qItem) {
          const qty = qItem.qty || 1;
          row.line_total_cents = qItem.lineTotalCents;
          row.unit_price_cents = Math.round(qItem.lineTotalCents / qty);
        }
      }

      const { error: insErr }: any = await supabaseAny.from("order_items").insert(rows as any);
      if (insErr) {
        return NextResponse.json({ error: insErr.message }, { status: 500 });
      }
    }

    const paperSelected = quote.items.some((i) => i.shippingRequired);
    const checklist = [
      "NEW ORDER (Stripe Checkout)",
      "",
      `Checkout Session: ${checkoutSessionId}`,
      `Payment Intent: ${paymentIntentId ?? "unknown"}`,
      "",
      `Customer: ${session.customer_details?.name ?? ""}`.trim(),
      `Customer email: ${customerEmail}`,
      "",
      `Subtotal: ${formatUsd(quote.subtotalCents)}`,
      `Shipping: ${formatUsd(quote.shippingCents)}`,
      `Total: ${formatUsd(quote.totalCents)} ${quote.currency.toUpperCase()}`,
      "",
      "Fulfillment checklist:",
      `- Paper plans selected: ${paperSelected ? "YES" : "NO"}`,
      `- Rush: ${cartItems.some((it) => it?.rush) ? "YES" : "NO"}`,
      "",
      "Items:",
      ...cartItems.map((it) => {
        const slug = String(it.slug);
        const sets = Number(it.paperSets ?? 0);
        const addOns = it.addOns ?? {};
        return `- ${slug} | license=${it.license} | paper_sets=${sets} | rush=${it.rush ? "yes" : "no"} | addOns=${JSON.stringify(addOns)}`;
      }),
      "",
      "Shipping address (if any):",
      JSON.stringify(session.shipping_details ?? {}, null, 2),
    ]
      .filter(Boolean)
      .join("\n");

    if (adminEmail) {
      await sendOrderEmail({
        to: adminEmail,
        subject: "New House Plan Order",
        text: checklist,
      });
    }
  }

  return NextResponse.json({ received: true });
}
