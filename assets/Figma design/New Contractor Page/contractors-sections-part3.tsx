// src/sections/contractors/PricingSection.tsx
"use client";

interface PricingSectionProps {
  onCTAClick: () => void;
}

const tiers = [
  {
    name: "Starter",
    price: "$1,200",
    period: "/plan",
    description: "Perfect for testing our quality",
    features: [
      "Full CAD files",
      "5 revision rounds",
      "48-hour delivery",
      "Commercial license",
      "Standard support",
    ],
    featured: false,
  },
  {
    name: "Builder Pack",
    price: "$900",
    period: "/plan",
    description: "Best value for scaling builders",
    features: [
      "Full CAD files",
      "Unlimited revisions",
      "24-hour delivery",
      "Commercial license",
      "Priority support",
      "Custom lot analysis",
      "Bulk discount (10+ plans)",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For builders building 50+ homes/year",
    features: [
      "Unlimited plans",
      "24-hour turnaround",
      "Unlimited revisions",
      "Dedicated designer",
      "Custom designs included",
      "Annual licensing agreement",
    ],
    featured: false,
  },
];

export default function PricingSection({ onCTAClick }: PricingSectionProps) {
  return (
    <section className="bg-gradient-to-br from-[#f5f6f7] to-[#e8eaed] px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-gilroy text-3xl md:text-4xl font-bold text-center mb-12 text-black">
          Builder-Friendly Pricing
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`bg-white p-8 rounded-lg relative transition transform hover:shadow-lg ${
                tier.featured
                  ? "border-4 border-[#FF5C02] md:scale-105 shadow-lg"
                  : "shadow-sm"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#FF5C02] text-white px-4 py-1 rounded-full text-sm font-bold whitespace-nowrap">
                  MOST POPULAR
                </div>
              )}

              <h3 className="font-gilroy text-2xl font-bold text-[#FF5C02] mb-2">
                {tier.name}
              </h3>
              <div className="mb-2">
                <span className="text-4xl font-bold text-black">{tier.price}</span>
                {tier.period && <span className="text-gray-500 ml-2">{tier.period}</span>}
              </div>
              <p className="text-[#8F8E8C] text-sm mb-6 h-10 flex items-center">
                {tier.description}
              </p>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-start gap-2 text-black">
                    <span className="text-[#FF5C02] font-bold mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={onCTAClick}
                className={`w-full font-bold py-3 px-6 rounded-lg transition transform hover:-translate-y-1 ${
                  tier.featured
                    ? "bg-[#FF5C02] text-white hover:bg-[#e54a00]"
                    : "bg-[#FF5C02] text-white hover:bg-[#e54a00]"
                }`}
              >
                {tier.name === "Enterprise" ? "Schedule Call" : "Get 30% Off Now"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

---

// src/sections/contractors/CTASection.tsx
"use client";

interface CTASectionProps {
  onCTAClick: () => void;
}

export default function CTASection({ onCTAClick }: CTASectionProps) {
  return (
    <section className="bg-gradient-to-br from-[#FF5C02] to-[#e54a00] text-white px-4 py-16 md:py-24">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-gilroy text-3xl md:text-4xl font-bold mb-4">
          Ready to Build Faster & Cheaper?
        </h2>
        <p className="text-lg mb-8 opacity-95">
          Join 200+ builders who've eliminated architectural delays and design costs.
        </p>
        <button
          onClick={onCTAClick}
          className="bg-white text-[#FF5C02] hover:bg-gray-100 font-bold py-4 px-10 rounded-lg transition transform hover:-translate-y-1 shadow-lg text-lg"
        >
          Get 30% Off Your First 5 Plans
        </button>
        <p className="mt-6 text-sm opacity-85">
          No credit card required. See a sample plan in your inbox in 24 hours.
        </p>
      </div>
    </section>
  );
}

---

// src/sections/contractors/ContactModal.tsx
"use client";

import { useState } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    homesPerYear: "",
    needs: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      "Thank you! Your discount code will be sent to your email within 24 hours, along with 3 sample floor plans matching your needs."
    );
    onClose();
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      homesPerYear: "",
      needs: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-xl w-full shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-gilroy text-2xl font-bold text-[#FF5C02]">
            Get 30% Off Your First 5 Plans
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Join our Builder Advantage Program and start building in 48 hours.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-bold text-black mb-2">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Smith"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF5C02]"
            />
          </div>

          <div>
            <label className="block font-bold text-black mb-2">Company Name</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              placeholder="Your Building Company"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF5C02]"
            />
          </div>

          <div>
            <label className="block font-bold text-black mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@company.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF5C02]"
            />
          </div>

          <div>
            <label className="block font-bold text-black mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+1 (555) 123-4567"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF5C02]"
            />
          </div>

          <div>
            <label className="block font-bold text-black mb-2">
              Number of homes you build per year
            </label>
            <input
              type="number"
              name="homesPerYear"
              value={formData.homesPerYear}
              onChange={handleChange}
              required
              placeholder="e.g., 15"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF5C02]"
            />
          </div>

          <div>
            <label className="block font-bold text-black mb-2">Tell us about your needs</label>
            <textarea
              name="needs"
              value={formData.needs}
              onChange={handleChange}
              required
              placeholder="What types of plans are you looking for?"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF5C02]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF5C02] hover:bg-[#e54a00] text-white font-bold py-3 px-6 rounded-lg transition transform hover:-translate-y-1"
          >
            Claim Your 30% Discount
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-500 text-center">
          We'll send you a sample plan in 24 hours. No commitment.
        </p>
      </div>
    </div>
  );
}