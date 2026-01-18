import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { quoteFromSupabase } from "@/lib/serverQuote";
import { applyBuilderPromoToQuote } from "@/lib/builderPromo/applyToQuote";
import { validateBuilderPromoCode } from "@/lib/builderPromo/validateServer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const body = (await req.json()) as {
    email?: string;
    phone?: string;
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
    successUrl?: string;
    cancelUrl?: string;
    builderCode?: string;
  };

  const email = (body.email ?? "").trim();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const items = body.items ?? [];
  const planChangeDescription = String(body.planChangeDescription ?? "").trim();
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
        discountPercent: promo.discountPercent,
        cadDiscountPercent: promo.cadDiscountPercent,
        freeMirror: promo.freeMirror,
        prioritySupport: promo.prioritySupport,
        builderProfileId: promo.builderProfileId,
      };
    }
  } catch {
    // ignore promo errors; proceed without discount
  }

  const shippingRequired = quote.items.some((it) => it.shippingRequired);

  const successUrl = body.successUrl || `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/ordering?success=1`;
  const cancelUrl = body.cancelUrl || `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/ordering?canceled=1`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: quote.currency,
          product_data: { name: "House Plans Order" },
          unit_amount: quote.totalCents,
        },
        quantity: 1,
      },
    ],
    shipping_address_collection: shippingRequired ? { allowed_countries: ["US"] } : undefined,
    customer_email: email,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      cart: JSON.stringify(items),
      builder_code: appliedPromo?.code ?? "",
    },
  });

  const supabase = getSupabaseAdmin() as any;
  const { error: orderErr }: any = await supabase.from("orders").insert({
    stripe_checkout_session_id: session.id,
    email,
    phone: body.phone ?? null,
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

  return NextResponse.json({ url: session.url });
}
