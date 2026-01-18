"use client";

interface CTASectionProps {
  onCTAClick: () => void;
}

export default function CTASection({ onCTAClick }: CTASectionProps) {
  return (
    <section className="bg-gradient-to-br from-[#FF5C02] to-[#e54a00] text-white px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-gilroy text-3xl md:text-4xl font-bold mb-4">Ready to Build Faster & Cheaper?</h2>
        <p className="text-lg mb-8 opacity-95">Join 200+ builders who&apos;ve eliminated architectural delays and design costs.</p>
        <button
          onClick={onCTAClick}
          className="inline-flex items-center justify-center rounded-full bg-orange-600 px-6 py-3.5 text-xs font-semibold tracking-widest text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-px hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
        >
          Get 30% Off Your First 5 Plans
        </button>
        <p className="mt-6 text-sm opacity-85">No credit card required. See a sample plan in your inbox in 24 hours.</p>
      </div>
    </section>
  );
}
