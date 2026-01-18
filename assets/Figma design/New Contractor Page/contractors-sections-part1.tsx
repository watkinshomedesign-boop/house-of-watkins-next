// src/sections/contractors/ProblemsSection.tsx
"use client";

const problems = [
  {
    icon: "⏳",
    title: "High Interest Rates Are Killing Deals",
    description: "78% of builders cite rising rates as their #1 challenge. Every day of delay costs you buyers. You need designs NOW, not in weeks.",
  },
  {
    icon: "💰",
    title: "Paying Full Architectural Fees",
    description: "Custom architectural design costs $5,000-$15,000+ per home. That's pure cost eating into your margins when you're already squeezed.",
  },
  {
    icon: "📅",
    title: "Architectural Delays = Lost Buyers",
    description: "Waiting weeks for design changes while your buyers look at competitors' finished homes. The longer it takes, the more deals you lose.",
  },
  {
    icon: "👥",
    title: "Labor & Material Cost Volatility",
    description: "64% of builders struggle with cost uncertainty. You need designs locked in FAST so you can quote accurately and move to permit.",
  },
  {
    icon: "🏢",
    title: "Limited Lot Availability",
    description: "Finding the RIGHT design for each lot is critical. You can't waste time on designs that don't fit your inventory.",
  },
  {
    icon: "📋",
    title: "Design Customization Takes Forever",
    description: "Small modifications request? That's weeks of back-and-forth with architects. You need changes in DAYS, not weeks.",
  },
];

export default function ProblemsSection() {
  return (
    <section className="bg-[#FFEFEB] px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-gilroy text-3xl md:text-4xl font-bold text-center mb-12 text-black">
          The Challenges Builders Face Every Day
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg border-l-4 border-[#FF5C02] shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-gilroy text-lg font-bold text-[#FF5C02] mb-3">
                {problem.icon} {problem.title}
              </h3>
              <p className="text-[#8F8E8C] leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

---

// src/sections/contractors/SolutionSection.tsx
"use client";

const benefits = [
  "Access designs within 24 hours of order",
  "Get unlimited revision rounds—no cap",
  "Full CAD files ready for builder modifications",
  "Commercial license for your company—build & sell as your own",
  "Scale from 800 sq ft to 6,000+ sq ft",
  "Energy-efficient designs that buyers demand",
  "Cost: 80% less than custom architectural design",
];

export default function SolutionSection() {
  return (
    <section className="bg-white px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-gradient-to-br from-[#FF5C02] to-[#e54a00] rounded-lg p-8 md:p-10 text-white min-h-96 flex flex-col justify-center">
            <h3 className="font-gilroy text-2xl font-bold mb-6">
              The House of Watkins Advantage
            </h3>
            <div className="space-y-4">
              <p className="text-lg">✓ 500+ move-in-ready plans</p>
              <p className="text-lg">✓ 48-hour delivery & revisions</p>
              <p className="text-lg">✓ Unlimited customizations</p>
              <p className="text-lg">✓ CAD-ready for permits</p>
              <p className="text-lg">✓ Commercial licensing built-in</p>
            </div>
          </div>

          <div>
            <h2 className="font-gilroy text-3xl font-bold text-black mb-6">
              License Proven Designs, Not Unproven Ideas
            </h2>
            <p className="text-[#8F8E8C] text-lg leading-relaxed mb-6">
              Our floor plans aren't theoretical. They're designed by a residential design expert with 20+ years of experience. Every plan has been tested with real builders in real markets.
            </p>

            <ul className="space-y-3 mb-8">
              {benefits.map((benefit, idx) => (
                <li key={idx} className="flex gap-3 text-black">
                  <span className="text-[#FF5C02] font-bold text-xl">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <p className="font-gilroy font-bold text-[#FF5C02] text-lg">
              Stop paying $10,000+ per plan. Start building in 48 hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

---

// src/sections/contractors/OfferSection.tsx
"use client";

interface OfferSectionProps {
  onCTAClick: () => void;
}

export default function OfferSection({ onCTAClick }: OfferSectionProps) {
  return (
    <section
      id="offer-section"
      className="bg-gradient-to-br from-[#FF5C02] to-[#e54a00] text-white px-4 py-16 md:py-24"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block bg-white bg-opacity-20 text-white px-4 py-2 rounded-full mb-6 border-2 border-white border-opacity-50">
          <span className="font-bold text-sm tracking-widest">🎯 LIMITED TIME BUILDER OFFER</span>
        </div>

        <h2 className="font-gilroy text-3xl md:text-4xl font-bold mb-8">
          The Builder Advantage Package
        </h2>

        <div className="grid md:grid-cols-3 gap-4 mb-8 bg-black bg-opacity-10 p-6 rounded-lg">
          <div>
            <p className="text-4xl font-bold">30%</p>
            <p className="text-sm opacity-90">Off First 5 Plans</p>
          </div>
          <div>
            <p className="text-4xl font-bold">48h</p>
            <p className="text-sm opacity-90">Guaranteed Delivery</p>
          </div>
          <div>
            <p className="text-4xl font-bold">∞</p>
            <p className="text-sm opacity-90">Free Revisions</p>
          </div>
        </div>

        <p className="text-lg mb-4 opacity-95">
          <strong>Here's what you get:</strong> Lock in 30% savings on your first 5 plans, 48-hour design delivery guaranteed, and unlimited revisions until you're 100% happy. Perfect for builders testing our quality before scaling.
        </p>

        <p className="text-base opacity-90 mb-4">
          <strong>Plus:</strong> A one-on-one consultation with our design expert to identify the 5 best plans for your market and lot inventory.
        </p>

        <p className="text-sm opacity-85 mb-6">
          Offer expires February 28, 2026. Limited to 50 builder accounts.
        </p>

        <button
          onClick={onCTAClick}
          className="bg-[#FF5C02] hover:bg-white hover:text-[#FF5C02] text-white font-bold py-4 px-10 rounded-lg transition transform hover:-translate-y-1 shadow-lg text-lg"
        >
          Claim Your 30% Discount Now
        </button>
      </div>
    </section>
  );
}