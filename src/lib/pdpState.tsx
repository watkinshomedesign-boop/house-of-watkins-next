"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Quote } from "@/lib/pricing";
import { getStoredBuilderCode } from "@/lib/builderPromo/storage";

export type PdpTab = "overview" | "description" | "plans" | "build" | "gallery" | "order";

export type PlanSetId =
  | "pdf_single"
  | "cad_single"
  | "paper5_pdf_single"
  | "pdf_builder"
  | "cad_builder";

export type PlanSetConfig = {
  id: PlanSetId;
  label: string;
  license: "single" | "builder";
  paperSets: number;
  addOns: {
    cad?: boolean;
  };
};

export type PdpSelections = {
  planSetId: PlanSetId | null;
  addOns: {
    readableReverse?: boolean;
    minorChanges?: boolean;
    sitePlan?: boolean;
    smallAdjustments?: boolean;
    additions?: boolean;
  };
};

type PdpState = {
  tab: PdpTab;
  setTab: (t: PdpTab) => void;

  planSetOptions: PlanSetConfig[];
  selections: PdpSelections;
  setPlanSetId: (id: PlanSetId | null) => void;
  toggleAddOn: (k: "readableReverse" | "sitePlan" | "smallAdjustments" | "minorChanges" | "additions") => void;

  builderCode: string;
  quote: Quote | null;
  quoteLoading: boolean;
  quoteError: string | null;

  canAddToCart: boolean;
};

const PdpContext = createContext<PdpState | null>(null);

function parseTab(raw: string | null | undefined): PdpTab {
  const s = String(raw || "").trim().toLowerCase();
  if (s === "description" || s === "plans" || s === "build" || s === "gallery" || s === "order") return s as PdpTab;
  return "overview";
}

export function PdpProvider(props: { slug: string; children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tab = useMemo(() => parseTab(searchParams.get("tab")), [searchParams]);

  const setTab = useCallback(
    (t: PdpTab) => {
      const next = new URLSearchParams(searchParams.toString());
      if (t === "overview") {
        next.delete("tab");
      } else {
        next.set("tab", t);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const planSetOptions: PlanSetConfig[] = useMemo(
    () => [
      { id: "pdf_single", label: "PDF – Single-Build", license: "single", paperSets: 0, addOns: {} },
      { id: "cad_single", label: "CAD File", license: "single", paperSets: 0, addOns: { cad: true } },
      { id: "paper5_pdf_single", label: "5 Sets + PDF", license: "single", paperSets: 5, addOns: {} },
      { id: "pdf_builder", label: "PDF – Unlimited Build", license: "builder", paperSets: 0, addOns: {} },
      { id: "cad_builder", label: "CAD Unlimited + PDF", license: "builder", paperSets: 0, addOns: { cad: true } },
    ],
    []
  );

  const [selections, setSelections] = useState<PdpSelections>({
    planSetId: null,
    addOns: {},
  });

  const setPlanSetId = useCallback((id: PlanSetId | null) => {
    setSelections((s) => ({ ...s, planSetId: id }));
  }, []);

  const toggleAddOn = useCallback(
    (k: "readableReverse" | "sitePlan" | "smallAdjustments" | "minorChanges" | "additions") => {
    setSelections((s) => ({ ...s, addOns: { ...s.addOns, [k]: !s.addOns[k] } }));
    },
    []
  );

  const [builderCode, setBuilderCode] = useState("");
  useEffect(() => {
    setBuilderCode(getStoredBuilderCode());

    const onChanged = () => setBuilderCode(getStoredBuilderCode());
    window.addEventListener("moss_builder_code_changed", onChanged);
    return () => window.removeEventListener("moss_builder_code_changed", onChanged);
  }, []);

  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const planSet = useMemo(
    () => planSetOptions.find((o) => o.id === selections.planSetId) ?? null,
    [planSetOptions, selections.planSetId]
  );

  const canAddToCart = Boolean(selections.planSetId);

  // Always fetch a quote so the pricing card can show "Starting at".
  useEffect(() => {
    let cancelled = false;

    const license = planSet?.license ?? "single";
    const paperSets = planSet?.paperSets ?? 0;
    const addOns = {
      ...selections.addOns,
      ...(planSet?.addOns ?? {}),
    };

    async function run() {
      setQuoteLoading(true);
      setQuoteError(null);
      try {
        const res = await fetch("/api/quote", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            items: [{ slug: props.slug, license, addOns, paperSets, qty: 1 }],
            builderCode: builderCode || undefined,
          }),
        });

        const json = (await res.json().catch(() => null)) as any;
        if (!res.ok) {
          throw new Error(String(json?.error ?? "Failed to quote"));
        }

        if (cancelled) return;
        setQuote(json as Quote);
      } catch (e: any) {
        if (cancelled) return;
        setQuote(null);
        setQuoteError(String(e?.message ?? "Failed to quote"));
      } finally {
        if (!cancelled) setQuoteLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [builderCode, planSet?.license, planSet?.paperSets, planSet?.addOns, props.slug, selections.addOns]);

  const value: PdpState = {
    tab,
    setTab,
    planSetOptions,
    selections,
    setPlanSetId,
    toggleAddOn,
    builderCode,
    quote,
    quoteLoading,
    quoteError,
    canAddToCart,
  };

  return <PdpContext.Provider value={value}>{props.children}</PdpContext.Provider>;
}

export function usePdp() {
  const ctx = useContext(PdpContext);
  if (!ctx) throw new Error("usePdp must be used within PdpProvider");
  return ctx;
}
