"use client";

interface BuilderPartnerSectionV3Props {
  onCTAClick: () => void;
}

const primaryButtonClass =
  "inline-flex items-center justify-center rounded-full bg-orange-600 px-6 py-3.5 text-xs font-semibold tracking-widest text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-px hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2";

export default function BuilderPartnerSectionV3({ onCTAClick }: BuilderPartnerSectionV3Props) {
  return (
    <section className="bg-white py-12 md:py-14">
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-xs font-semibold tracking-[0.24em] text-orange-600">BUILDER PARTNER PROGRAM</div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
                Builder Partner Program: 15% Off + Builder Pack
              </h2>
              <p className="mt-3 text-sm text-neutral-600 max-w-[720px]">
                15% off all plans with your unique code, plus free mirrored set, 50% off CAD files, and priority support.
              </p>
            </div>

            <div className="shrink-0">
              <button type="button" className={primaryButtonClass} onClick={onCTAClick}>
                GET MY BUILDER CODE
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              <div className="text-sm font-semibold text-neutral-900">15% off all plans</div>
              <div className="mt-1 text-sm text-neutral-600">Unique code you can share with clients.</div>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              <div className="text-sm font-semibold text-neutral-900">Builder Pack</div>
              <div className="mt-1 text-sm text-neutral-600">Free mirrored set + 50% off CAD files + priority support.</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="text-xs font-semibold tracking-[0.2em] text-neutral-500">STEP 1</div>
              <div className="mt-2 text-sm font-semibold text-neutral-900">Create a builder account</div>
              <div className="mt-1 text-sm text-neutral-600">Name + email + company</div>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="text-xs font-semibold tracking-[0.2em] text-neutral-500">STEP 2</div>
              <div className="mt-2 text-sm font-semibold text-neutral-900">Get your unique code</div>
              <div className="mt-1 text-sm text-neutral-600">BUILDER-XXXX</div>
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-white p-5">
              <div className="text-xs font-semibold tracking-[0.2em] text-neutral-500">STEP 3</div>
              <div className="mt-2 text-sm font-semibold text-neutral-900">Share with clients</div>
              <div className="mt-1 text-sm text-neutral-600">Or use it at checkout</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
