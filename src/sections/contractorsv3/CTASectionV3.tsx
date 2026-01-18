"use client";

interface CTASectionV3Props {
  onCTAClick: () => void;
}

const primaryButtonClass =
  "inline-flex items-center justify-center rounded-full bg-orange-600 px-6 py-3.5 text-xs font-semibold tracking-widest text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-px hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2";

export default function CTASectionV3({ onCTAClick }: CTASectionV3Props) {
  return (
    <section className="bg-white py-12 md:py-14">
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs font-semibold tracking-[0.24em] text-orange-600">NEXT STEP</div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">Ready to build faster?</h2>
              <p className="mt-3 text-sm text-neutral-600 max-w-[720px]">
                Tell us what you’re building and we’ll recommend plans that match your lots, scope, and timeline.
              </p>
            </div>
            <div className="shrink-0">
              <button type="button" onClick={onCTAClick} className={primaryButtonClass}>
                REQUEST DETAILS
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
