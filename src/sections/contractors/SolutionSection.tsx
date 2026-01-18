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
          <div className="bg-gradient-to-br from-[#FF5C02] to-[#e54a00] rounded-3xl p-8 md:p-10 text-white min-h-96 flex flex-col justify-center">
            <h3 className="font-gilroy text-2xl font-bold mb-6">The House of Watkins Advantage</h3>
            <div className="space-y-4">
              <p className="text-lg">✓ 500+ move-in-ready plans</p>
              <p className="text-lg">✓ 48-hour delivery & revisions</p>
              <p className="text-lg">✓ Unlimited customizations</p>
              <p className="text-lg">✓ CAD-ready for permits</p>
              <p className="text-lg">✓ Commercial licensing built-in</p>
            </div>
          </div>

          <div>
            <h2 className="font-gilroy text-3xl font-bold text-black mb-6">License Proven Designs, Not Unproven Ideas</h2>
            <p className="text-[#8F8E8C] text-lg leading-relaxed mb-6">
              Our floor plans aren&apos;t theoretical. They&apos;re designed by a residential design expert with 20+ years of experience. Every plan has been tested with real builders in real markets.
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
