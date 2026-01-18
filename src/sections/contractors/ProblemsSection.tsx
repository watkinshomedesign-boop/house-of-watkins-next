"use client";

const problems = [
  {
    icon: "⏳",
    title: "High Interest Rates Are Killing Deals",
    description:
      "78% of builders cite rising rates as their #1 challenge. Every day of delay costs you buyers. You need designs NOW, not in weeks.",
  },
  {
    icon: "💰",
    title: "Paying Full Architectural Fees",
    description:
      "Custom architectural design costs $5,000-$15,000+ per home. That's pure cost eating into your margins when you're already squeezed.",
  },
  {
    icon: "📅",
    title: "Architectural Delays = Lost Buyers",
    description:
      "Waiting weeks for design changes while your buyers look at competitors' finished homes. The longer it takes, the more deals you lose.",
  },
  {
    icon: "👥",
    title: "Labor & Material Cost Volatility",
    description:
      "64% of builders struggle with cost uncertainty. You need designs locked in FAST so you can quote accurately and move to permit.",
  },
  {
    icon: "🏢",
    title: "Limited Lot Availability",
    description:
      "Finding the RIGHT design for each lot is critical. You can't waste time on designs that don't fit your inventory.",
  },
  {
    icon: "📋",
    title: "Design Customization Takes Forever",
    description:
      "Small modifications request? That's weeks of back-and-forth with architects. You need changes in DAYS, not weeks.",
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
              className="bg-white p-6 rounded-3xl border-l-4 border-neutral-200 shadow-sm hover:shadow-md transition"
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
