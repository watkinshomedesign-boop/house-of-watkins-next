import { COMMERCE } from "@/config/commerce";

export type LicenseType = "single" | "builder";

export type AddOns = {
  readableReverse?: boolean;
  cad?: boolean;
  minorChanges?: boolean;
  sitePlan?: boolean;
  smallAdjustments?: boolean;
  additions?: boolean;
};

export type CartItem = {
  planId: string;
  name: string;
  heatedSqFt: number;
  license: LicenseType;
  addOns?: AddOns;
  rush?: boolean;
  paperSets?: number; // 0 = no paper; 1+ = paper plans
  qty?: number; // usually 1
};

export type Quote = {
  currency: string;
  items: Array<{
    planId: string;
    name: string;
    qty: number;
    lineItems: Array<{ label: string; amountCents: number }>;
    lineTotalCents: number;
    shippingRequired: boolean;
  }>;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
};

export type PricingConfig = {
  baseCents: number;
  heatedSqFtRateCents: number;
  rushRate: number;
  shippingFlatRateCents: number;
  paperHandlingCents: number;
  paperExtraSetCents: number;
  licenseMultipliers: Record<LicenseType, number>;
  addOnsCents: Record<string, number>;
};

const addOnLineItems = (addOns: AddOns | undefined) => {
  const out: Array<{ label: string; amountCents: number }> = [];
  if (!addOns) return out;
  for (const [k, v] of Object.entries(addOns)) {
    if (!v) continue;
    const cents = (COMMERCE.pricing.addOnsCents as any)[k];
    if (typeof cents === "number") {
      const label = ({
        readableReverse: "Readable Reverse (Mirrored)",
        cad: "CAD Files",
        minorChanges: "Minor Changes",
        sitePlan: "Site Plan",
        smallAdjustments: "Small Adjustments",
        additions: "Additions",
      } as any)[k] ?? k;
      out.push({ label, amountCents: cents });
    }
  }
  return out;
};

const addOnLineItemsWithConfig = (addOns: AddOns | undefined, pricing: PricingConfig) => {
  const out: Array<{ label: string; amountCents: number }> = [];
  if (!addOns) return out;
  for (const [k, v] of Object.entries(addOns)) {
    if (!v) continue;
    const cents = (pricing.addOnsCents as any)[k];
    if (typeof cents === "number") {
      const label = ({
        readableReverse: "Readable Reverse (Mirrored)",
        cad: "CAD Files",
        minorChanges: "Minor Changes",
        sitePlan: "Site Plan",
        smallAdjustments: "Small Adjustments",
        additions: "Additions",
      } as any)[k] ?? k;
      out.push({ label, amountCents: cents });
    }
  }
  return out;
};

export function quoteCartWithPricing(items: CartItem[], pricing: PricingConfig): Quote {
  let subtotal = 0;
  let shippingRequired = false;

  const qItems = items.map((it) => {
    const qty = it.qty ?? 1;
    const lineItems: Array<{ label: string; amountCents: number }> = [];

    const base = pricing.baseCents + pricing.heatedSqFtRateCents * it.heatedSqFt;
    lineItems.push({ label: `Base plan (${it.heatedSqFt} heated sf)`, amountCents: base });

    const mult = pricing.licenseMultipliers[it.license] ?? 1;
    if (mult !== 1) {
      const delta = base * (mult - 1);
      lineItems.push({ label: `Builder/Multi-build license (x${mult})`, amountCents: delta });
    }

    for (const li of addOnLineItemsWithConfig(it.addOns, pricing)) lineItems.push(li);

    const sets = it.paperSets ?? 0;
    if (sets > 0) {
      shippingRequired = true;
      lineItems.push({ label: "Paper plans handling (includes 1 set)", amountCents: pricing.paperHandlingCents });
      if (sets > 1) {
        lineItems.push({
          label: `Additional paper sets (${sets - 1})`,
          amountCents: (sets - 1) * pricing.paperExtraSetCents,
        });
      }
    }

    const preRush = lineItems.reduce((s, li) => s + li.amountCents, 0);
    if (it.rush) {
      const rushAmt = Math.round(preRush * pricing.rushRate);
      lineItems.push({ label: `Rush service (${Math.round(pricing.rushRate * 100)}%)`, amountCents: rushAmt });
    }

    const lineTotal = lineItems.reduce((s, li) => s + li.amountCents, 0) * qty;
    subtotal += lineTotal;

    return {
      planId: it.planId,
      name: it.name,
      qty,
      lineItems,
      lineTotalCents: lineTotal,
      shippingRequired: sets > 0,
    };
  });

  const shipping = shippingRequired ? pricing.shippingFlatRateCents : 0;
  return {
    currency: COMMERCE.currency,
    items: qItems,
    subtotalCents: subtotal,
    shippingCents: shipping,
    totalCents: subtotal + shipping,
  };
}

export function quoteCart(items: CartItem[]): Quote {
  return quoteCartWithPricing(items, {
    baseCents: COMMERCE.pricing.baseCents,
    heatedSqFtRateCents: COMMERCE.pricing.heatedSqFtRateCents,
    rushRate: COMMERCE.rushRate,
    shippingFlatRateCents: COMMERCE.shippingFlatRateCents,
    paperHandlingCents: COMMERCE.paperHandlingCents,
    paperExtraSetCents: COMMERCE.paperExtraSetCents,
    licenseMultipliers: COMMERCE.pricing.licenseMultipliers as any,
    addOnsCents: COMMERCE.pricing.addOnsCents as any,
  });
}
