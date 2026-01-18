import type { Quote } from "@/lib/pricing";

export type AppliedBuilderDiscounts = {
  planDiscountCents: number;
  cadDiscountCents: number;
};

export function applyBuilderPromoToQuote(
  quote: Quote,
  promo: { discountPercent: number; cadDiscountPercent: number }
): { quote: Quote; discounts: AppliedBuilderDiscounts } {
  const planRate = Math.max(0, Math.min(1, promo.discountPercent / 100));
  const cadRate = Math.max(0, Math.min(1, promo.cadDiscountPercent / 100));

  let planDiscountCents = 0;
  let cadDiscountCents = 0;

  const nextItems = quote.items.map((item) => {
    const qty = item.qty || 1;

    const cadLine = item.lineItems.find((li) => li.label === "CAD Files");
    const cadAmount = cadLine ? cadLine.amountCents : 0;

    const eligiblePlanBase = item.lineItems
      .filter((li) => li.label !== "CAD Files")
      .reduce((s, li) => s + li.amountCents, 0);

    const planDisc = planRate > 0 ? Math.round(eligiblePlanBase * planRate) * qty : 0;
    const cadDisc = cadRate > 0 ? Math.round(cadAmount * cadRate) * qty : 0;

    planDiscountCents += planDisc;
    cadDiscountCents += cadDisc;

    const nextLineItems = [...item.lineItems];
    if (planDisc > 0) {
      nextLineItems.push({ label: `Builder discount (${Math.round(planRate * 100)}%)`, amountCents: -planDisc / qty });
    }
    if (cadDisc > 0) {
      nextLineItems.push({ label: `CAD discount (${Math.round(cadRate * 100)}%)`, amountCents: -cadDisc / qty });
    }

    const lineTotalCents = nextLineItems.reduce((s, li) => s + li.amountCents, 0) * qty;

    return {
      ...item,
      lineItems: nextLineItems,
      lineTotalCents,
    };
  });

  const subtotalCents = nextItems.reduce((s, it) => s + it.lineTotalCents, 0);
  const totalCents = subtotalCents + quote.shippingCents;

  return {
    quote: {
      ...quote,
      items: nextItems,
      subtotalCents,
      totalCents,
    },
    discounts: {
      planDiscountCents,
      cadDiscountCents,
    },
  };
}
