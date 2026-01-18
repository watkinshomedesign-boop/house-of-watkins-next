import { NextResponse } from "next/server";
import { formatUsd, quoteFromSupabase } from "@/lib/serverQuote";
import { applyBuilderPromoToQuote } from "@/lib/builderPromo/applyToQuote";
import { validateBuilderPromoCode } from "@/lib/builderPromo/validateServer";

export async function POST(req: Request) {
  const body = (await req.json()) as {
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
  };

  const items = body.items ?? [];
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
      };
    }
  } catch {
    // ignore promo errors; return base quote
  }

  return NextResponse.json({
    ...quote,
    promo: appliedPromo,
    formatted: {
      subtotal: formatUsd(quote.subtotalCents),
      shipping: formatUsd(quote.shippingCents),
      total: formatUsd(quote.totalCents),
    },
  });
}
