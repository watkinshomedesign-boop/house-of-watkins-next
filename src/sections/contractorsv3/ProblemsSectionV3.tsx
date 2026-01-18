"use client";

const problems = [
  {
    title: "High interest rates compress timelines",
    description:
      "When buyers hesitate, speed matters. Delays in design or revisions can cost the deal.",
  },
  {
    title: "Custom architectural fees eat margin",
    description:
      "Avoid $5,000–$15,000+ design costs per home when you just need proven inventory.",
  },
  {
    title: "Design delays create lost buyers",
    description:
      "Weeks of back-and-forth gives competitors time to close with finished options.",
  },
  {
    title: "Labor & material volatility",
    description:
      "You need permit-ready drawings quickly so you can quote and schedule with confidence.",
  },
  {
    title: "Every lot needs the right plan",
    description:
      "Fit-to-lot designs are critical—wasted time on mismatched concepts kills velocity.",
  },
  {
    title: "Small changes shouldn't take weeks",
    description:
      "Fast revision support helps you keep projects moving from selection to permit.",
  },
];

export default function ProblemsSectionV3() {
  return (
    <section className="bg-neutral-50 py-12 md:py-14">
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="text-center">
          <div className="text-xs font-semibold tracking-[0.24em] text-orange-600">BUILDER REALITIES</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">What slows builders down</h2>
          <p className="mt-3 text-sm text-neutral-600">Common bottlenecks we designed this program to remove.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {problems.map((p, idx) => (
            <div key={idx} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="text-xs font-semibold tracking-[0.2em] text-neutral-500">{String(idx + 1).padStart(2, "0")}</div>
              <div className="mt-3 text-sm font-semibold text-neutral-900">{p.title}</div>
              <div className="mt-2 text-sm text-neutral-600">{p.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
