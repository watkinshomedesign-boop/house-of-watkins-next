// src/sections/contractors/HeroSection.tsx
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
            className="bg-[#FF5C02] hover:bg-[#e54a00] text-white font-bold py-4 px-8 rounded-lg transition transform hover:-translate-y-1 shadow-lg text-lg"
          >
            Get 30% Off Your First 5 Plans
          </button>
          <button
            onClick={scrollToOffer}
            className="bg-white text-[#FF5C02] hover:bg-gray-100 font-bold py-4 px-8 rounded-lg transition transform hover:-translate-y-1 border-2 border-white text-lg"
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