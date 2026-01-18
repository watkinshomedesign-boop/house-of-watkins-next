"use client";

const features = [
  {
    key: "01",
    title: "Fast delivery",
    description: "Keep projects moving with predictable turnaround and clear scope.",
  },
  {
    key: "02",
    title: "Revision support",
    description: "Tight feedback loops so permitting and field changes don’t stall schedules.",
  },
  {
    key: "03",
    title: "Commercial licensing",
    description: "Use licensed plans for real projects with terms that work for builders.",
  },
  {
    key: "04",
    title: "CAD-ready files",
    description: "Builder-friendly deliverables that fit into your existing workflow.",
  },
  {
    key: "05",
    title: "Proven inventory",
    description: "Select from a library of layouts designed to sell and build efficiently.",
  },
  {
    key: "06",
    title: "Scalable",
    description: "Start small and scale up as your production needs grow.",
  },
];

export default function FeaturesSectionV3() {
  return (
    <section className="bg-neutral-50 py-12 md:py-14">
      <div className="mx-auto w-full max-w-5xl px-4">
        <div>
          <div className="text-xs font-semibold tracking-[0.24em] text-orange-600">BUILDER FEATURES</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Built for builders</h2>
          <p className="mt-3 max-w-[720px] text-sm text-neutral-600">
            A streamlined experience designed to reduce RFIs, speed up decisions, and keep projects moving.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.key} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="text-xs font-semibold tracking-[0.2em] text-neutral-500">{f.key}</div>
              <div className="mt-3 text-sm font-semibold text-neutral-900">{f.title}</div>
              <div className="mt-2 text-sm text-neutral-600">{f.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
