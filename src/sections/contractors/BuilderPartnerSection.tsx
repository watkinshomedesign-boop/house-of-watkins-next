"use client";

interface BuilderPartnerProps {
  onCTAClick: () => void;
}

export default function BuilderPartnerSection({ onCTAClick }: BuilderPartnerProps) {
  return (
    <section className="px-4 py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto border border-neutral-200 rounded-3xl p-8 md:p-10">
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
            className="inline-flex items-center justify-center rounded-full bg-orange-600 px-6 py-3.5 text-xs font-semibold tracking-widest text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-px hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
          >
            Get My Builder Code
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#FFEFEB] p-6 rounded-3xl">
            <h3 className="font-bold text-black mb-2">15% off all plans</h3>
            <p className="text-[#8F8E8C]">Unique code you can share with clients.</p>
          </div>
          <div className="bg-[#FFEFEB] p-6 rounded-3xl">
            <h3 className="font-bold text-black mb-2">Builder Pack</h3>
            <p className="text-[#8F8E8C]">Free mirrored set + 50% off CAD files + priority support.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 bg-[#FFEFEB] p-6 rounded-3xl">
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
