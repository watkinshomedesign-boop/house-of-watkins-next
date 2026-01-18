"use client";

interface HeroSectionProps {
  onCTAClick: () => void;
}

export default function HeroSection({ onCTAClick }: HeroSectionProps) {
  const scrollToOffer = () => {
    const element = document.getElementById("offer-section");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-gradient-to-br from-[#FF5C02] to-[#e54a00] text-white px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="font-gilroy text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Professional Floor Plans Designed for Builders Who Build More
        </h1>

        <p className="text-lg md:text-xl mb-8 opacity-95 font-light">
          License pre-designed floor plans, customize quickly, and build immediately. No delays. No architectural fees.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={onCTAClick}
            className="inline-flex items-center justify-center rounded-full bg-orange-600 px-6 py-3.5 text-xs font-semibold tracking-widest text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-px hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
          >
            Get 30% Off Your First 5 Plans
          </button>
          <button
            onClick={scrollToOffer}
            className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-5 py-3 text-xs font-semibold tracking-widest text-neutral-900 transition-shadow duration-200 ease-out hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
          >
            Learn More
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8 border-t border-white border-opacity-20 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📦</span>
            <span>500+ Plans in Stock</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span>48-Hour Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">✓</span>
            <span>Commercial License Included</span>
          </div>
        </div>
      </div>
    </section>
  );
}
