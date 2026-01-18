"use client";

const benefits = [
  "Proven designs ready to license",
  "CAD-ready deliverables",
  "Revision support for field realities",
  "Commercial licensing for your company",
  "Options across multiple sizes and styles",
  "Clear scope and predictable timelines",
];

export default function SolutionSectionV3() {
  return (
    <section className="bg-white py-12 md:py-14">
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start">
          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm md:p-8">
            <div className="text-xs font-semibold tracking-[0.24em] text-orange-600">THE ADVANTAGE</div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">License proven designs, not unproven ideas</h2>
            <p className="mt-3 text-sm text-neutral-600">
              Plans designed for builders: clear documentation, practical layouts, and a workflow built for permits and schedules.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-2 text-sm text-neutral-700">
              {benefits.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                  <div className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-[#FFEFEB] text-orange-600 text-xs font-semibold">
                    ✓
                  </div>
                  <div className="font-medium">{b}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold tracking-[0.24em] text-neutral-500">OUTCOME</div>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">Move from selection to permit faster</h3>
            <p className="mt-3 text-sm text-neutral-600">
              The goal is simple: reduce back-and-forth, speed up decisions, and deliver a plan set that supports construction without surprises.
            </p>

            <div className="mt-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-neutral-900">Builder-ready deliverables</div>
              <div className="mt-2 text-sm text-neutral-600">
                Clear plan sets, revision support, and licensing terms that work for real production building.
              </div>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">48-hour delivery</div>
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">Commercial use</div>
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">CAD-ready</div>
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">Revision support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
