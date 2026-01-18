"use client";

interface PricingSectionProps {
  onCTAClick: () => void;
}

const tiers = [
  {
    name: "Starter",
    price: "$1,200",
    period: "/plan",
    description: "Perfect for testing our quality",
    features: [
      "Full CAD files",
      "5 revision rounds",
      "48-hour delivery",
      "Commercial license",
      "Standard support",
    ],
    featured: false,
  },
  {
    name: "Builder Pack",
    price: "$900",
    period: "/plan",
    description: "Best value for scaling builders",
    features: [
      "Full CAD files",
      "Unlimited revisions",
      "24-hour delivery",
      "Commercial license",
      "Priority support",
      "Custom lot analysis",
      "Bulk discount (10+ plans)",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For builders building 50+ homes/year",
    features: [
      "Unlimited plans",
      "24-hour turnaround",
      "Unlimited revisions",
      "Dedicated designer",
      "Custom designs included",
      "Annual licensing agreement",
    ],
    featured: false,
  },
];

export default function PricingSection({ onCTAClick }: PricingSectionProps) {
  return (
    <section className="bg-gradient-to-br from-[#f5f6f7] to-[#e8eaed] px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-gilroy text-3xl md:text-4xl font-bold text-center mb-12 text-black">
          Builder-Friendly Pricing
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`bg-white p-8 rounded-3xl relative transition transform hover:shadow-lg ${
                tier.featured ? "border-4 border-neutral-200 md:scale-105 shadow-lg" : "shadow-sm"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#FF5C02] text-white px-4 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                  MOST POPULAR
                </div>
              )}

              <h3 className="font-gilroy text-2xl font-bold text-[#FF5C02] mb-2">{tier.name}</h3>
              <div className="mb-2">
                <span className="text-4xl font-bold text-black">{tier.price}</span>
                {tier.period && <span className="text-gray-500 ml-2">{tier.period}</span>}
              </div>
              <p className="text-[#8F8E8C] text-sm mb-6 h-10 flex items-center">{tier.description}</p>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-start gap-2 text-black">
                    <span className="text-[#FF5C02] font-bold mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={onCTAClick}
                className={
                  "inline-flex w-full items-center justify-center rounded-full px-6 py-3.5 text-xs font-semibold tracking-widest shadow-sm transition-all duration-200 ease-out hover:-translate-y-px hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 " +
                  (tier.featured
                    ? "bg-orange-600 text-white"
                    : "border border-neutral-200 bg-white text-neutral-900")
                }
              >
                {tier.name === "Enterprise" ? "Schedule Call" : "Get 30% Off Now"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
