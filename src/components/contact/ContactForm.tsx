"use client";

import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function ContactForm() {
  const pathname = usePathname();

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return Boolean(
      form.firstName.trim() &&
        form.lastName.trim() &&
        form.email.trim() &&
        isValidEmail(form.email.trim()) &&
        form.message.trim()
    );
  }, [form]);

  async function submit() {
    setError(null);
    setSuccess(null);

    const payload = {
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      message: form.message.trim(),
      page_path: pathname || "/contact-us",
    };

    if (!payload.first_name) return setError("First Name is required");
    if (!payload.last_name) return setError("Last Name is required");
    if (!payload.email) return setError("Email is required");
    if (!isValidEmail(payload.email)) return setError("Enter a valid email");
    if (!payload.message) return setError("Message is required");

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.error || "Failed to submit");
      }

      setSuccess("Thanks — your message has been sent.");
      setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" });

      if (json?.hubspotWarning) {
        // still show success; warning is handled server-side
      }
    } catch (e: any) {
      setError(e?.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[28.125rem] md:max-w-none md:w-[28.125rem]">
      <h2 className="text-[1.8125rem] font-semibold tracking-tight text-neutral-900">Fill the form to get support</h2>

      <div className="mt-5">
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <label className="block text-[18px] font-semibold text-neutral-700">First Name</label>
            <input
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              className="mt-2 h-[3.125rem] w-full rounded-full border border-neutral-200 bg-white px-4 text-[21px] outline-none focus:ring-2 focus:ring-orange-600"
              placeholder="First name"
              autoComplete="given-name"
            />
          </div>
          <div className="w-full">
            <label className="block text-[18px] font-semibold text-neutral-700">Last Name</label>
            <input
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              className="mt-2 h-[3.125rem] w-full rounded-full border border-neutral-200 bg-white px-4 text-[21px] outline-none focus:ring-2 focus:ring-orange-600"
              placeholder="Last name"
              autoComplete="family-name"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-[18px] font-semibold text-neutral-700">Email</label>
          <input
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="mt-2 h-[3.125rem] w-full rounded-full border border-neutral-200 bg-white px-4 text-[21px] outline-none focus:ring-2 focus:ring-orange-600"
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
          />
        </div>

        <div className="mt-4">
          <label className="block text-[18px] font-semibold text-neutral-700">Phone Number</label>
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="mt-2 h-[3.125rem] w-full rounded-full border border-neutral-200 bg-white px-4 text-[21px] outline-none focus:ring-2 focus:ring-orange-600"
            placeholder="Optional"
            type="tel"
            autoComplete="tel"
          />
        </div>

        <div className="mt-4">
          <label className="block text-[18px] font-semibold text-neutral-700">Message</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className="mt-2 h-[8.1875rem] w-full resize-none rounded-[20px] border border-neutral-200 bg-white px-4 py-3 text-[21px] outline-none focus:ring-2 focus:ring-orange-600"
            placeholder="Tell us what you’re looking for"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={submit}
        disabled={loading || !canSubmit}
        className="mt-6 inline-flex h-[3.125rem] w-full items-center justify-center rounded-full bg-orange-600 px-4 text-[18px] font-semibold tracking-widest text-white disabled:opacity-50"
      >
        {loading ? "SENDING..." : "SUBMIT"}
      </button>

      {success ? <p className="mt-4 text-sm text-green-700">{success}</p> : null}
      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
