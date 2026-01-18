"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

interface ContactModalV3Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModalV3({ isOpen, onClose }: ContactModalV3Props) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-[0.24em] text-orange-600">BUILDER INQUIRY</div>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">Get 30% Off Your First 5 Plans</h2>
            <p className="mt-2 text-sm text-neutral-600">Share your needs and we’ll follow up with recommendations.</p>
          </div>
          <button
            type="button"
            className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-neutral-800">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-800">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-800">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-600"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-neutral-800">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-800">Homes per year</label>
              <input
                type="number"
                min="1"
                name="homesPerYear"
                value={formData.homesPerYear}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-800">What are you building?</label>
            <textarea
              name="needs"
              value={formData.needs}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1 w-full rounded-3xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-600"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-orange-600 px-6 py-3.5 text-xs font-semibold tracking-widest text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-px hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
          >
            SUBMIT
          </button>

          <div className="text-xs text-neutral-500">We’ll reply within 1 business day.</div>
        </form>
      </div>
    </div>
  );
}
