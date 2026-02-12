"use client";

import { usePdp, type PdpTab } from "@/lib/pdpState";

const TABS: Array<{ id: PdpTab; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "description", label: "Description" },
  { id: "plans", label: "Plans" },
  { id: "build", label: "Build" },
  { id: "gallery", label: "Gallery" },
  { id: "order", label: "Order" },
];

export const Tabs = () => {
  const { tab, setTab } = usePdp();

  return (
    <div className="flex w-full flex-wrap gap-x-[32px] pt-0 md:flex md:pt-[10.752px]">
      {TABS.map((t) => {
        const isActive = tab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className="relative inline-flex shrink-0 items-center justify-center py-0"
            aria-current={isActive ? "page" : undefined}
          >
            {isActive && t.id !== "overview" ? (
              <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-orange-600" />
            ) : null}
            <span
              className={`font-gilroy text-[18px] font-semibold leading-[24px] tracking-normal whitespace-nowrap [font-variant-numeric:lining-nums_tabular-nums] ${
                isActive ? "text-black md:text-orange-600" : "text-black"
              }`}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
