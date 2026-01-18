"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

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

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
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
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-gilroy text-2xl font-bold text-[#FF5C02]">Get 30% Off Your First 5 Plans</h2>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 transition-shadow duration-200 ease-out hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <p className="text-gray-600 mb-6">Join our Builder Advantage Program and start building in 48 hours.</p>

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
              className="w-full px-4 py-2 border border-neutral-200 rounded-full focus:outline-none focus:border-[#FF5C02]"
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
              className="w-full px-4 py-2 border border-neutral-200 rounded-full focus:outline-none focus:border-[#FF5C02]"
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
              className="w-full px-4 py-2 border border-neutral-200 rounded-full focus:outline-none focus:border-[#FF5C02]"
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
              className="w-full px-4 py-2 border border-neutral-200 rounded-full focus:outline-none focus:border-[#FF5C02]"
            />
          </div>

          <div>
            <label className="block font-bold text-black mb-2">Number of homes you build per year</label>
            <input
              type="number"
              name="homesPerYear"
              value={formData.homesPerYear}
              onChange={handleChange}
              required
              placeholder="e.g., 15"
              min="1"
              className="w-full px-4 py-2 border border-neutral-200 rounded-full focus:outline-none focus:border-[#FF5C02]"
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
              className="w-full px-4 py-2 border border-neutral-200 rounded-3xl focus:outline-none focus:border-[#FF5C02]"
            />
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full bg-orange-600 px-6 py-3.5 text-xs font-semibold tracking-widest text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-px hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
          >
            Claim Your 30% Discount
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-500 text-center">We&apos;ll send you a sample plan in 24 hours. No commitment.</p>
      </div>
    </div>
  );
}
