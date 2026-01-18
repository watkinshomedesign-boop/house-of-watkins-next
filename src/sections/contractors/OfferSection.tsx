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

        <h2 className="font-gilroy text-3xl md:text-4xl font-bold mb-8">The Builder Advantage Package</h2>

        <div className="grid md:grid-cols-3 gap-4 mb-8 bg-black bg-opacity-10 p-6 rounded-3xl">
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
          <strong>Here&apos;s what you get:</strong> Lock in 30% savings on your first 5 plans, 48-hour design delivery guaranteed, and unlimited revisions until you&apos;re 100% happy. Perfect for builders testing our quality before scaling.
        </p>

        <p className="text-base opacity-90 mb-4">
          <strong>Plus:</strong> A one-on-one consultation with our design expert to identify the 5 best plans for your market and lot inventory.
        </p>

        <p className="text-sm opacity-85 mb-6">Offer expires February 28, 2026. Limited to 50 builder accounts.</p>

        <button
          onClick={onCTAClick}
          className="inline-flex items-center justify-center rounded-full bg-orange-600 px-6 py-3.5 text-xs font-semibold tracking-widest text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-px hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
        >
          Claim Your 30% Discount Now
        </button>
      </div>
    </section>
  );
}
