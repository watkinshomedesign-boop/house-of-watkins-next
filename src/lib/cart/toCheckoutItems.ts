import type { CartItem } from "@/lib/cart/CartContext";

export function cartToCheckoutItems(items: CartItem[]) {
  return items.map((it) => ({
    slug: it.slug,
    license: it.license_type,
    addOns: {
      sitePlan: Boolean(it.addons?.sitePlan),
      minorChanges: Boolean(it.addons?.minorChanges),
      smallAdjustments: Boolean(it.addons?.smallAdjustments),
      additions: Boolean(it.addons?.additions),
      readableReverse: Boolean(it.addons?.readableReverse),
      cad: Boolean(it.addons?.cad),
    },
    rush: it.rush,
    paperSets: it.paper_sets,
    qty: it.qty,
  }));
}
