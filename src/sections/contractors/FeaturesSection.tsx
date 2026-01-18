"use client";

const features = [
  {
    icon: "⚡",
    title: "Lightning-Fast Delivery",
    description:
      "48-hour turnaround from order to CAD files. Move faster than your competition and capture buyers before they look elsewhere.",
  },
  {
    icon: "🎯",
    title: "Customization Included",
    description:
      "Unlimited revision rounds to match your brand, lot sizes, and market demands. No hidden fees. No \"you'll need to pay for changes.\"",
  },
  {
    icon: "💼",
    title: "Commercial License",
    description:
      "Build, sell, and market as your own. No attribution required. Your designs. Your brand. Your competitive advantage.",
  },
  {
    icon: "📐",
    title: "CAD-Ready Files",
    description:
      "All files delivered in industry-standard formats. Compatible with your existing CAD workflow. No conversion needed.",
  },
  {
    icon: "📊",
    title: "Market-Tested Designs",
    description:
      "Every plan is based on real market data and builder feedback. No trendy ideas that won't sell. Designs that move homes.",
  },
  {
    icon: "🔄",
    title: "Scalable Licensing",
    description:
      "Start with 5 plans. Scale to 100+. Pay only for what you use. Perfect for growing builders who want flexibility.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-[#FFEFEB] px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-gilroy text-3xl md:text-4xl font-bold text-center mb-12 text-black">
          Why Builders Prefer House of Watkins
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border-t-4 border-neutral-200 shadow-sm hover:shadow-md transition"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-gilroy text-lg font-bold text-[#FF5C02] mb-2">{feature.title}</h3>
              <p className="text-[#8F8E8C]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
