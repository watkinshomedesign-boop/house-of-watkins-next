"use client";

const testimonials = [
  {
    quote:
      "We needed design inventory fast. The plan set quality is solid and revisions were straightforward. It helped us move a buyer to contract quicker.",
    name: "Mark T.",
    role: "General Contractor",
  },
  {
    quote:
      "The cost difference versus custom architecture is huge. More importantly, the plans are clear—our subs had fewer questions in the field.",
    name: "Jennifer M.",
    role: "Home Builder",
  },
  {
    quote:
      "Licensing + CAD-ready files made it easy to integrate into our workflow. We can standardize and build consistently.",
    name: "David K.",
    role: "Developer",
  },
];

export default function TestimonialsSectionV3() {
  return (
    <section className="bg-white py-12 md:py-14">
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="text-center">
          <div className="text-xs font-semibold tracking-[0.24em] text-orange-600">TESTIMONIALS</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">What builders say</h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div key={idx} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
              <div className="text-orange-600 text-sm font-semibold">{"★".repeat(5)}</div>
              <div className="mt-3 text-sm text-neutral-700">“{t.quote}”</div>
              <div className="mt-5 text-sm font-semibold text-neutral-900">{t.name}</div>
              <div className="mt-1 text-xs font-semibold tracking-[0.2em] text-neutral-500">{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
