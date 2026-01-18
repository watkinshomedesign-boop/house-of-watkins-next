export const COMMERCE = {
  currency: "usd",
  shippingFlatRateCents: 5000, // $50, applied only when paper plans selected
  rushRate: 0.15, // +15% on subtotal pre-shipping
  paperHandlingCents: 15000, // $150 includes first set
  paperExtraSetCents: 2500, // $25 per extra set
  pricing: {
    baseCents: 125000, // $1,250
    heatedSqFtRateCents: 65, // $0.65 per sf -> 65 cents
    licenseMultipliers: {
      single: 1,
      builder: 3,
    },
    addOnsCents: {
      readableReverse: 29500,
      cad: 75000,
      minorChanges: 37500,
      sitePlan: 55000,
      smallAdjustments: 22500,
      additions: 47500,
    },
  },
} as const;
