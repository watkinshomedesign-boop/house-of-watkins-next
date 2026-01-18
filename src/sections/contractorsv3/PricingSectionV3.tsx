"use client";

interface PricingSectionV3Props {
  onCTAClick: () => void;
}

const tiers = [
  {
    name: "Starter",
    price: "$1,200",
    period: "/plan",
    description: "Great for trying the workflow",
    features: ["Full CAD files", "5 revision rounds", "48-hour delivery", "Commercial license"],
    featured: false,
  },
  {
    name: "Builder Pack",
    price: "$900",
    period: "/plan",
    description: "Best for scaling builders",
    features: [
      "Full CAD files",
      "Unlimited revisions",
      "24-hour delivery",
      "Commercial license",
      "Priority support",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For production teams",
    features: ["Dedicated designer", "Annual licensing", "Custom scope"],
    featured: false,
  },
];

const primaryButtonClass =
  "inline-flex w-full items-center justify-center rounded-full bg-orange-600 px-6 py-3.5 text-xs font-semibold tracking-widest text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-px hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2";

const secondaryButtonClass =
  "inline-flex w-full items-center justify-center rounded-full border border-neutral-200 bg-white px-6 py-3.5 text-xs font-semibold tracking-widest text-neutral-900 transition-shadow duration-200 ease-out hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2";

export default function PricingSectionV3({ onCTAClick }: PricingSectionV3Props) {
  return (
    <section className="bg-neutral-50 py-12 md:py-14">
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="text-center">
          <div className="text-xs font-semibold tracking-[0.24em] text-orange-600">PRICING</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Builder-friendly pricing</h2>
          <p className="mt-3 text-sm text-neutral-600">Choose a tier that matches your pace and volume.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={
                "rounded-3xl border bg-white p-6 shadow-sm md:p-7 " +
                (t.featured ? "border-orange-600" : "border-neutral-200")
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-neutral-900">{t.name}</div>
                  <div className="mt-2 flex items-end gap-2">
                    <div className="text-3xl font-semibold tracking-tight text-neutral-900">{t.price}</div>
                    {t.period ? <div className="text-sm text-neutral-500">{t.period}</div> : null}
                  </div>
                  <div className="mt-2 text-sm text-neutral-600">{t.description}</div>
                </div>
                {t.featured ? (
                  <div className="rounded-full bg-[#FFEFEB] px-3 py-1 text-xs font-semibold tracking-widest text-orange-600">
                    FEATURED
                  </div>
                ) : null}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-2 text-sm text-neutral-700">
                {t.features.map((f) => (
                  <div key={f} className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                    <div className="mt-0.5 grid h-6 w-6 place-items-center rounded-full bg-white text-orange-600 text-xs font-semibold border border-neutral-200">
                      ✓
                    </div>
                    <div className="font-medium">{f}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={onCTAClick}
                  className={t.featured ? primaryButtonClass : secondaryButtonClass}
                >
                  {t.name === "Enterprise" ? "SCHEDULE A CALL" : "GET STARTED"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
