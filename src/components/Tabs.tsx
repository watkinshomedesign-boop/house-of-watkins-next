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
    <div className="[align-items:normal] box-content caret-black gap-x-[normal] block min-h-0 min-w-0 outline-black gap-y-[normal] w-auto pt-0 md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-0 md:flex md:justify-between md:pr-[30px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[42.624px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:pt-[10.752px] md:scroll-m-0 md:scroll-p-[auto]">
      {TABS.map((t) => {
        const isActive = tab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className="relative [align-items:normal] box-content caret-black gap-x-[normal] block min-h-0 min-w-0 outline-black gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[13.248px] md:flex md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[13.248px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]"
            aria-current={isActive ? "page" : undefined}
          >
            {isActive && t.id !== "overview" ? (
              <div className="static box-content caret-black outline-black pointer-events-auto border-b-0 inset-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:pointer-events-none md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:border-orange-600 md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:border-b md:border-solid md:inset-0"></div>
            ) : null}
            <div
              className={`text-base font-normal box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-wrap md:text-[15px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:leading-[22px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] ${
                isActive ? "text-black md:text-orange-600" : "text-black"
              }`}
            >
              <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:leading-[22px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:inline-block md:origin-left md:scale-150">
                {t.label}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
