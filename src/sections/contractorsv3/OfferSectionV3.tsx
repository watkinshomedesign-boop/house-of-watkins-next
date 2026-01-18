"use client";

interface OfferSectionV3Props {
  onCTAClick: () => void;
}

const primaryButtonClass =
  "inline-flex items-center justify-center rounded-full bg-orange-600 px-6 py-3.5 text-xs font-semibold tracking-widest text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-px hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2";

export default function OfferSectionV3({ onCTAClick }: OfferSectionV3Props) {
  return (
    <section id="offer-section-v3" className="bg-white py-12 md:py-14">
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="rounded-3xl border border-neutral-200 bg-[#FFEFEB] p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-xs font-semibold tracking-[0.24em] text-orange-600">LIMITED-TIME OFFER</div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">30% off your first 5 plans</h2>
              <p className="mt-3 text-sm text-neutral-700 max-w-[720px]">
                Lock in savings, get fast delivery, and keep revisions moving until your set matches the project.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                  <div className="text-xs font-semibold tracking-[0.2em] text-neutral-500">SAVINGS</div>
                  <div className="mt-1 text-sm font-semibold text-neutral-900">30% off</div>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                  <div className="text-xs font-semibold tracking-[0.2em] text-neutral-500">DELIVERY</div>
                  <div className="mt-1 text-sm font-semibold text-neutral-900">48 hours</div>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                  <div className="text-xs font-semibold tracking-[0.2em] text-neutral-500">SUPPORT</div>
                  <div className="mt-1 text-sm font-semibold text-neutral-900">Revision help</div>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <button type="button" onClick={onCTAClick} className={primaryButtonClass}>
                CLAIM OFFER
              </button>
              <div className="mt-3 text-xs text-neutral-600">No credit card required to start the conversation.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
