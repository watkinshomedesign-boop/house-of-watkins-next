"use client";

interface HeroSectionV3Props {
  onCTAClick: () => void;
}

const primaryButtonClass =
  "inline-flex items-center justify-center rounded-full bg-orange-600 px-6 py-3.5 text-xs font-semibold tracking-widest text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-px hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2";

const secondaryButtonClass =
  "inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-6 py-3.5 text-xs font-semibold tracking-widest text-neutral-900 transition-shadow duration-200 ease-out hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2";

export default function HeroSectionV3({ onCTAClick }: HeroSectionV3Props) {
  const scrollToOffer = () => {
    const el = document.getElementById("offer-section-v3");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="mt-5 md:mt-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Builder-ready plans. Faster approvals. Fewer RFIs.
          </h1>
          <p className="mt-3 max-w-[720px] text-base text-neutral-600">
            License proven designs, tailor them to the project, and get build-ready files without the custom-architect timeline.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={onCTAClick} className={primaryButtonClass}>
              GET 30% OFF (FIRST 5 PLANS)
            </button>
            <button type="button" onClick={scrollToOffer} className={secondaryButtonClass}>
              LEARN MORE
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 text-sm text-neutral-700 sm:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
              <div className="text-xs font-semibold tracking-[0.2em] text-neutral-500">LIBRARY</div>
              <div className="mt-1 font-medium">500+ plans</div>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
              <div className="text-xs font-semibold tracking-[0.2em] text-neutral-500">TURNAROUND</div>
              <div className="mt-1 font-medium">48-hour delivery</div>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
              <div className="text-xs font-semibold tracking-[0.2em] text-neutral-500">LICENSE</div>
              <div className="mt-1 font-medium">Commercial use</div>
            </div>
          </div>
        </div>

        <div className="w-full md:max-w-[380px]">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="text-xs font-semibold tracking-[0.24em] text-orange-600">FOR BUILDERS</div>
            <div className="mt-3 text-lg font-semibold tracking-tight">What you get</div>
            <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-neutral-700">
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">CAD-ready files</div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">Revision support</div>
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">Plans designed for permitting</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
