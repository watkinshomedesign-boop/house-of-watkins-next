"use client";

import { useEffect, useState } from "react";
import { quoteCartWithPricing } from "@/lib/pricing";
import { COMMERCE } from "@/config/commerce";

type PricingRow = {
  id?: number;
  base_price_cents: number;
  per_heated_sqft_cents: number;
  cad_addon_cents: number;
  mirrored_addon_cents: number;
  site_plan_addon_cents: number;
  small_adjustments_addon_cents: number;
  minor_changes_addon_cents: number;
  additions_addon_cents: number;
  rush_percent: number;
  paper_plan_shipping_cents: number;
  paper_set_price_cents: number;
  updated_at?: string;
};

export function PricingSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState<PricingRow>({
    base_price_cents: 125000,
    per_heated_sqft_cents: 65,
    cad_addon_cents: 75000,
    mirrored_addon_cents: 29500,
    site_plan_addon_cents: 55000,
    small_adjustments_addon_cents: 22500,
    minor_changes_addon_cents: 37500,
    additions_addon_cents: 47500,
    rush_percent: 15,
    paper_plan_shipping_cents: 5000,
    paper_set_price_cents: 2500,
  });

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/admin/pricing")
      .then(async (r) => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Failed to load");
        return j;
      })
      .then((j) => {
        if (!mounted) return;
        if (j.data) setForm(j.data);
      })
      .catch((e: any) => {
        if (!mounted) return;
        setError(e?.message || "Failed to load");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  async function save() {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Failed to save");
      setSuccess("Saved");
    } catch (e: any) {
      setError(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-sm text-neutral-600">Loading...</div>;

  const toUsd = (cents: number) => {
    const n = Number(cents ?? 0);
    return `$${(n / 100).toFixed(2)}`;
  };

  const pricingConfig = {
    baseCents: form.base_price_cents,
    heatedSqFtRateCents: form.per_heated_sqft_cents,
    rushRate: (Number(form.rush_percent ?? 0) || 0) / 100,
    shippingFlatRateCents: form.paper_plan_shipping_cents,
    // Keep paper handling logic consistent with the existing checkout math.
    paperHandlingCents: COMMERCE.paperHandlingCents,
    paperExtraSetCents: form.paper_set_price_cents,
    licenseMultipliers: COMMERCE.pricing.licenseMultipliers as any,
    addOnsCents: {
      ...((COMMERCE.pricing.addOnsCents as any) ?? {}),
      cad: form.cad_addon_cents,
      readableReverse: form.mirrored_addon_cents,
      sitePlan: form.site_plan_addon_cents,
      smallAdjustments: form.small_adjustments_addon_cents,
      minorChanges: form.minor_changes_addon_cents,
      additions: form.additions_addon_cents,
    },
  };

  const examples = [
    { key: "small", label: "Small ADU", heatedSqFt: 800 },
    { key: "mid", label: "Mid-size home", heatedSqFt: 1800 },
    { key: "large", label: "Large custom plan", heatedSqFt: 3500 },
  ] as const;

  const preview = (heatedSqFt: number) => {
    const q = quoteCartWithPricing(
      [
        {
          planId: "example",
          name: "Example",
          heatedSqFt,
          license: "single",
          addOns: { cad: true, readableReverse: true },
          rush: false,
          paperSets: 0,
          qty: 1,
        },
      ],
      pricingConfig as any
    );
    return q;
  };

  const input = (k: keyof PricingRow, label: string) => (
    <label className="block text-sm">
      <div className="text-xs text-neutral-500">{label}</div>
      <input
        value={String((form as any)[k] ?? "")}
        onChange={(e) => setForm((p) => ({ ...p, [k]: Number(e.target.value) }))}
        className="mt-1 w-full rounded border px-3 py-2"
        inputMode="numeric"
      />
    </label>
  );

  return (
    <div className="space-y-4">
      <div className="rounded border p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {input("base_price_cents", "Base price (cents)")}
        {input("per_heated_sqft_cents", "Per heated sqft (cents)")}
        {input("cad_addon_cents", "CAD add-on (cents)")}
        {input("mirrored_addon_cents", "Mirrored add-on (cents)")}
        {input("site_plan_addon_cents", "Site plan add-on (cents)")}
        {input("small_adjustments_addon_cents", "Small adjustments add-on (cents)")}
        {input("minor_changes_addon_cents", "Minor changes add-on (cents)")}
        {input("additions_addon_cents", "Additions add-on (cents)")}
        {input("rush_percent", "Rush percent")}
        {input("paper_plan_shipping_cents", "Paper plan shipping (cents)")}
        {input("paper_set_price_cents", "Additional paper set price (cents)")}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded bg-black px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          {success ? <div className="text-sm text-green-700">{success}</div> : null}
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
        </div>
      </div>

      <div className="rounded border p-4">
        <div className="text-sm font-semibold">Live preview</div>
        <div className="mt-1 text-xs text-neutral-500">
          Example totals assume: single license, digital-only (no paper), includes CAD + Mirrored add-ons.
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {examples.map((ex) => {
            const q = preview(ex.heatedSqFt);
            const baseLine = q.items[0]?.lineItems?.[0]?.amountCents ?? 0;
            return (
              <div key={ex.key} className="rounded border p-3">
                <div className="text-sm font-semibold">{ex.label}</div>
                <div className="mt-1 text-xs text-neutral-500">{ex.heatedSqFt} heated sf</div>
                <div className="mt-3 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-neutral-500">Base</div>
                    <div className="font-mono text-xs">{toUsd(baseLine)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-neutral-500">Subtotal</div>
                    <div className="font-mono text-xs">{toUsd(q.subtotalCents)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-neutral-500">Shipping</div>
                    <div className="font-mono text-xs">{toUsd(q.shippingCents)}</div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-xs text-neutral-500">Total</div>
                    <div className="font-mono text-sm font-semibold">{toUsd(q.totalCents)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
