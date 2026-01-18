// src/sections/contractors/FeaturesSection.tsx
"use client";

const features = [
  { icon: "⚡", title: "Lightning-Fast Delivery", description: "48-hour turnaround from order to CAD files. Move faster than your competition and capture buyers before they look elsewhere." },
  { icon: "🎯", title: "Customization Included", description: "Unlimited revision rounds to match your brand, lot sizes, and market demands. No hidden fees. No \"you'll need to pay for changes.\"" },
  { icon: "💼", title: "Commercial License", description: "Build, sell, and market as your own. No attribution required. Your designs. Your brand. Your competitive advantage." },
  { icon: "📐", title: "CAD-Ready Files", description: "All files delivered in industry-standard formats. Compatible with your existing CAD workflow. No conversion needed." },
  { icon: "📊", title: "Market-Tested Designs", description: "Every plan is based on real market data and builder feedback. No trendy ideas that won't sell. Designs that move homes." },
  { icon: "🔄", title: "Scalable Licensing", description: "Start with 5 plans. Scale to 100+. Pay only for what you use. Perfect for growing builders who want flexibility." },
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
            <div key={idx} className="bg-white p-6 rounded-lg border-t-4 border-[#FF5C02] shadow-sm hover:shadow-md transition">
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

---

// src/sections/contractors/TestimonialsSection.tsx
"use client";

const testimonials = [
  {
    stars: 5,
    text: "We needed 10 designs in 2 weeks. No architect could do it. House of Watkins delivered all 10, customized for our lots, in 10 days. We've already sold 8 homes using these plans.",
    author: "Mark T.",
    role: "General Contractor, Colorado",
  },
  {
    stars: 5,
    text: "At $1,200 per plan vs $10,000 for custom design, the ROI was obvious. But what surprised us was the quality. These plans are legitimately better than what we were paying architects.",
    author: "Jennifer M.",
    role: "Home Builder, Texas",
  },
  {
    stars: 5,
    text: "The commercial license was a game-changer. We can now market these as our proprietary designs. Buyers don't know they're licensed, and we save $9,000 per home.",
    author: "David K.",
    role: "Developer, Arizona",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-white px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-gilroy text-3xl md:text-4xl font-bold text-center mb-12 text-black">
          What Builders Say
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-[#FFEFEB] p-6 rounded-lg border-l-4 border-[#FF5C02]">
              <div className="text-[#FF5C02] mb-3">{"★".repeat(testimonial.stars)}</div>
              <p className="text-[#8F8E8C] italic mb-4 leading-relaxed">\"{testimonial.text}\"</p>
              <p className="font-bold text-black">{testimonial.author}</p>
              <p className="text-sm text-[#8F8E8C]">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

---

// src/sections/contractors/BuilderPartnerSection.tsx
"use client";

interface BuilderPartnerProps {
  onCTAClick: () => void;
}

export default function BuilderPartnerSection({ onCTAClick }: BuilderPartnerProps) {
  return (
    <section className="px-4 py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto border border-[#e0e0e0] rounded-lg p-8 md:p-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
          <div>
            <p className="text-[#FF5C02] text-xs font-bold tracking-widest uppercase mb-2">Builder Partner Program</p>
            <h2 className="font-gilroy text-3xl font-bold text-black mb-3">
              Builder Partner Program: 15% Off + Builder Pack
            </h2>
            <p className="text-[#8F8E8C] text-lg">
              15% off all plans with your unique code, plus free mirrored set, 50% off CAD files, and priority support.
            </p>
          </div>
          <button
            onClick={onCTAClick}
            className="bg-[#FF5C02] hover:bg-[#e54a00] text-white font-bold py-3 px-8 rounded-full whitespace-nowrap transition transform hover:-translate-y-1"
          >
            Get My Builder Code
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#FFEFEB] p-6 rounded-lg">
            <h3 className="font-bold text-black mb-2">15% off all plans</h3>
            <p className="text-[#8F8E8C]">Unique code you can share with clients.</p>
          </div>
          <div className="bg-[#FFEFEB] p-6 rounded-lg">
            <h3 className="font-bold text-black mb-2">Builder Pack</h3>
            <p className="text-[#8F8E8C]">Free mirrored set + 50% off CAD files + priority support.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 bg-[#FFEFEB] p-6 rounded-lg">
          <div className="text-center">
            <p className="text-[#FF5C02] text-xs font-bold tracking-widest uppercase mb-1">Step 1</p>
            <h3 className="font-bold text-black mb-1">Create a builder account</h3>
            <p className="text-sm text-[#8F8E8C]">Name + email + company</p>
          </div>
          <div className="text-center">
            <p className="text-[#FF5C02] text-xs font-bold tracking-widest uppercase mb-1">Step 2</p>
            <h3 className="font-bold text-black mb-1">Get your unique code</h3>
            <p className="text-sm text-[#8F8E8C]">BUILDER-XXXX</p>
          </div>
          <div className="text-center">
            <p className="text-[#FF5C02] text-xs font-bold tracking-widest uppercase mb-1">Step 3</p>
            <h3 className="font-bold text-black mb-1">Share with clients</h3>
            <p className="text-sm text-[#8F8E8C]">Or use it at checkout</p>
          </div>
        </div>
      </div>
    </section>
  );
}