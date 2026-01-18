"use client";

import { useEffect, useMemo, useState } from "react";
import { usePlan } from "@/lib/planContext";
import { usePdp, type PlanSetConfig, type PlanSetId } from "@/lib/pdpState";
import { useCart } from "@/lib/cart/CartContext";
import { PlanChangeDescriptionModal } from "@/components/PlanChangeDescriptionModal";

import iconArrowNoStemRight from "../../../../assets/Final small icon images black svg/Icon arrow no stem right-black.svg";

function imgSrc(mod: unknown): string {
  return (mod as any)?.src ?? (mod as any);
}

export const OrderForm = () => {
  const plan = usePlan();
  const { planSetOptions, selections, setPlanSetId, toggleAddOn, builderCode } = usePdp();
  const { planChangeDescription, setPlanChangeDescription } = useCart();

  const selected = useMemo<PlanSetConfig | null>(
    () => planSetOptions.find((o) => o.id === selections.planSetId) ?? null,
    [planSetOptions, selections.planSetId]
  );

  const [openPlanSet, setOpenPlanSet] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);

  const [planSetPrices, setPlanSetPrices] = useState<Record<string, number>>({});
  const [readableReverseDeltaCents, setReadableReverseDeltaCents] = useState<number | null>(null);
  const [minorChangesDeltaCents, setMinorChangesDeltaCents] = useState<number | null>(null);
  const [sitePlanDeltaCents, setSitePlanDeltaCents] = useState<number | null>(null);
  const [smallAdjustmentsDeltaCents, setSmallAdjustmentsDeltaCents] = useState<number | null>(null);
  const [additionsDeltaCents, setAdditionsDeltaCents] = useState<number | null>(null);

  const [planChangeModalOpen, setPlanChangeModalOpen] = useState(false);
  const [planChangeModalKey, setPlanChangeModalKey] = useState<
    "smallAdjustments" | "minorChanges" | "additions" | null
  >(null);
  const [planChangeModalLabel, setPlanChangeModalLabel] = useState<string>("");

  function formatUsdInt(cents: number) {
    const dollars = Math.round((Number(cents) || 0) / 100);
    return `$${dollars.toLocaleString()}`;
  }

  async function quoteSubtotalCents(input: { license: "single" | "builder"; paperSets: number; addOns: any }) {
    const res = await fetch("/api/quote", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        items: [{ slug: plan.slug, license: input.license, paperSets: input.paperSets, addOns: input.addOns, qty: 1 }],
        builderCode: builderCode || undefined,
      }),
    });
    const json = (await res.json().catch(() => null)) as any;
    if (!res.ok) throw new Error(String(json?.error ?? "Failed to quote"));
    return Number(json?.subtotalCents ?? 0);
  }

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!openPlanSet) return;
      try {
        const next: Record<string, number> = {};
        for (const o of planSetOptions) {
          const cents = await quoteSubtotalCents({
            license: o.license,
            paperSets: o.paperSets,
            addOns: { ...(o.addOns ?? {}) },
          });
          next[o.id] = cents;
        }
        if (!cancelled) setPlanSetPrices(next);
      } catch {
        if (!cancelled) setPlanSetPrices({});
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [openPlanSet, planSetOptions, builderCode, plan.slug]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!openOptions || !selected) {
        setReadableReverseDeltaCents(null);
        setMinorChangesDeltaCents(null);
        setSitePlanDeltaCents(null);
        setSmallAdjustmentsDeltaCents(null);
        setAdditionsDeltaCents(null);
        return;
      }
      try {
        const base = await quoteSubtotalCents({
          license: selected.license,
          paperSets: selected.paperSets,
          addOns: { ...(selected.addOns ?? {}), ...selections.addOns },
        });

        const withRR = await quoteSubtotalCents({
          license: selected.license,
          paperSets: selected.paperSets,
          addOns: { ...(selected.addOns ?? {}), ...selections.addOns, readableReverse: true },
        });

        const withMinor = await quoteSubtotalCents({
          license: selected.license,
          paperSets: selected.paperSets,
          addOns: { ...(selected.addOns ?? {}), ...selections.addOns, minorChanges: true },
        });

        const withSite = await quoteSubtotalCents({
          license: selected.license,
          paperSets: selected.paperSets,
          addOns: { ...(selected.addOns ?? {}), ...selections.addOns, sitePlan: true },
        });

        const withSmall = await quoteSubtotalCents({
          license: selected.license,
          paperSets: selected.paperSets,
          addOns: { ...(selected.addOns ?? {}), ...selections.addOns, smallAdjustments: true },
        });

        const withAdditions = await quoteSubtotalCents({
          license: selected.license,
          paperSets: selected.paperSets,
          addOns: { ...(selected.addOns ?? {}), ...selections.addOns, additions: true },
        });

        if (!cancelled) {
          setReadableReverseDeltaCents(withRR - base);
          setMinorChangesDeltaCents(withMinor - base);
          setSitePlanDeltaCents(withSite - base);
          setSmallAdjustmentsDeltaCents(withSmall - base);
          setAdditionsDeltaCents(withAdditions - base);
        }
      } catch {
        if (!cancelled) setReadableReverseDeltaCents(null);
        if (!cancelled) setMinorChangesDeltaCents(null);
        if (!cancelled) setSitePlanDeltaCents(null);
        if (!cancelled) setSmallAdjustmentsDeltaCents(null);
        if (!cancelled) setAdditionsDeltaCents(null);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [openOptions, selected, selections.addOns, builderCode]);

  const selectedPlanSetLabel = selected ? selected.label : "Select a plan";
  const selectedOptionsLabel = (() => {
    const on: string[] = [];
    if (selections.addOns.readableReverse) on.push("Readable Reverse");
    if (selections.addOns.sitePlan) on.push("Site Plan");
    if (selections.addOns.smallAdjustments) on.push("Small Adjustments");
    if (selections.addOns.minorChanges) on.push("Minor Changes");
    if (selections.addOns.additions) on.push("Additions");

    if (on.length === 0) return "Options add-on";
    if (on.length === 1) return on[0];
    return `${on[0]} +${on.length - 1}`;
  })();

  return (
    <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block h-auto min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[17.792px] md:flex md:h-full md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[17.792px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
      <div className="relative w-full">
        <div className="text-[11.52px] font-semibold text-zinc-900 md:text-[16px]">
          <p className="leading-[21.376px]">Plan Set</p>
        </div>
        <button
          type="button"
          className="mt-1 flex w-full items-center justify-between rounded-[31.104px] border border-stone-200 bg-white px-5 py-[12px] text-[18px] font-bold"
          onClick={() => {
            setOpenPlanSet((v) => !v);
            setOpenOptions(false);
          }}
          aria-expanded={openPlanSet}
        >
          <span className={selected ? "text-zinc-900" : "text-stone-400"}>{selectedPlanSetLabel}</span>
          <img
            src={imgSrc(iconArrowNoStemRight)}
            alt=""
            aria-hidden="true"
            className="h-[36px] w-[36px] shrink-0 rotate-90 opacity-70"
            draggable={false}
          />
        </button>
        {openPlanSet ? (
          <div className="absolute bottom-full left-0 right-0 z-[200] mb-2 max-h-[320px] overflow-auto rounded-xl border border-stone-200 bg-white shadow">
            {planSetOptions.map((o) => (
              <button
                key={o.id}
                type="button"
                className="flex w-full items-center justify-between px-5 py-3 text-left text-[16px] font-semibold text-zinc-900 hover:bg-stone-50"
                onClick={() => {
                  setPlanSetId(o.id as PlanSetId);
                  setOpenPlanSet(false);
                }}
              >
                <span>{o.label}</span>
                <span className="text-orange-600">{formatUsdInt(planSetPrices[o.id] ?? 0)}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="relative w-full">
        <div className="text-[11.52px] font-semibold text-zinc-900 md:text-[16px]">
          <p className="leading-[21.376px]">Options</p>
        </div>
        <button
          type="button"
          className="mt-1 flex w-full items-center justify-between rounded-[31.104px] border border-stone-200 bg-white px-5 py-[12px] text-[18px] font-bold"
          onClick={() => {
            setOpenOptions((v) => !v);
            setOpenPlanSet(false);
          }}
          aria-expanded={openOptions}
        >
          <span className={selected ? "text-zinc-900" : "text-stone-400"}>{selectedOptionsLabel}</span>
          <img
            src={imgSrc(iconArrowNoStemRight)}
            alt=""
            aria-hidden="true"
            className="h-[36px] w-[36px] shrink-0 rotate-90 opacity-70"
            draggable={false}
          />
        </button>
        {openOptions ? (
          <div className="absolute bottom-full left-0 right-0 z-[200] mb-2 max-h-[320px] overflow-auto rounded-xl border border-stone-200 bg-white shadow">
            {(
              [
                { key: "readableReverse" as const, label: "Readable Reverse", delta: readableReverseDeltaCents },
                { key: "sitePlan" as const, label: "Site Plan", delta: sitePlanDeltaCents },
                { key: "smallAdjustments" as const, label: "Small Adjustments", delta: smallAdjustmentsDeltaCents },
                { key: "minorChanges" as const, label: "Minor Changes", delta: minorChangesDeltaCents },
                { key: "additions" as const, label: "Additions", delta: additionsDeltaCents },
              ] as const
            ).map((a) => {
              const enabled = Boolean(selections.addOns[a.key]);
              return (
                <button
                  key={a.key}
                  type="button"
                  className="flex w-full items-center justify-between px-5 py-3 text-left text-[16px] font-semibold text-zinc-900 hover:bg-stone-50"
                  onClick={() => {
                    const isPlanChange =
                      a.key === "smallAdjustments" || a.key === "minorChanges" || a.key === "additions";

                    if (isPlanChange && !enabled && !planChangeDescription.trim()) {
                      setPlanChangeModalKey(a.key);
                      setPlanChangeModalLabel(a.label);
                      setPlanChangeModalOpen(true);
                      return;
                    }

                    toggleAddOn(a.key);
                    setOpenOptions(false);
                  }}
                >
                  <span className="flex items-center gap-1">
                    <span>{a.label}</span>
                    {a.key === "smallAdjustments" || a.key === "minorChanges" || a.key === "additions" ? (
                      <a
                        href="#plan-change-definitions"
                        className="text-orange-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        *
                      </a>
                    ) : null}
                  </span>
                  <span className={enabled ? "text-zinc-500" : "text-orange-600"}>
                    {enabled ? "Added" : a.delta === null ? "" : formatUsdInt(a.delta)}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <PlanChangeDescriptionModal
        open={planChangeModalOpen}
        optionLabel={planChangeModalLabel}
        initialValue={planChangeDescription}
        onClose={() => setPlanChangeModalOpen(false)}
        onSave={(value) => {
          if (!value) {
            window.alert("Please describe the request.");
            return;
          }
          if (!planChangeModalKey) return;
          setPlanChangeDescription(value);
          toggleAddOn(planChangeModalKey);
          setPlanChangeModalOpen(false);
          setOpenOptions(false);
        }}
      />
    </div>
  );
};
