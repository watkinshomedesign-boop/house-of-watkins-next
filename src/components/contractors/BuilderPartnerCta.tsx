"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type BuilderCodeResponse = {
  builderProfile: {
    id: string;
    created_at: string;
    first_name: string;
    last_name: string;
    email: string;
    company: string;
    role: string;
    license_number: string | null;
    hubspot_sync_status: string | null;
  };
  code: {
    code: string;
    discountPercent: number;
    builderPack: {
      freeMirror: boolean;
      cadDiscountPercent: number;
      prioritySupport: boolean;
    };
  };
};

type Variant = "ghost" | "primary";

type Props = {
  variant?: Variant;
};

const STORAGE_KEY = "moss_builder_code_v1";

const ROLES = ["Builder", "GC", "Developer", "Realtor", "Designer", "Other"] as const;

type Role = (typeof ROLES)[number];

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: Role | "";
  licenseNumber: string;
  attested: boolean;
};

function buttonClass(variant: Variant) {
  if (variant === "primary") {
    return "inline-flex items-center justify-center rounded-full bg-orange-600 px-6 py-3.5 text-xs font-semibold tracking-widest text-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-px hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2";
  }
  return "inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-5 py-3 text-xs font-semibold tracking-widest text-neutral-900 transition-shadow duration-200 ease-out hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2";
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function BuilderPartnerCta(props: Props) {
  const variant = props.variant ?? "ghost";

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<BuilderCodeResponse | null>(null);

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    role: "",
    licenseNumber: "",
    attested: false,
  });

  const canSubmit = useMemo(() => {
    return (
      form.firstName.trim() &&
      form.lastName.trim() &&
      normalizeEmail(form.email).includes("@") &&
      form.company.trim() &&
      form.role &&
      form.attested
    );
  }, [form]);

  async function submit() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/builders/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: normalizeEmail(form.email),
          company: form.company.trim(),
          role: String(form.role),
          licenseNumber: form.licenseNumber.trim() || undefined,
          attestedBuilder: form.attested,
        }),
      });

      const json = (await res.json().catch(() => null)) as any;
      if (!res.ok) {
        setError(String(json?.error ?? "Failed to submit"));
        return;
      }

      setSuccess(json as BuilderCodeResponse);

      try {
        const code = String((json as any)?.code?.code ?? "").trim().toUpperCase();
        if (code) {
          localStorage.setItem(STORAGE_KEY, code);
        }
      } catch {
        // ignore
      }
    } catch (e: any) {
      setError(String(e?.message ?? "Failed to submit"));
    } finally {
      setLoading(false);
    }
  }

  async function copyCode() {
    const code = success?.code?.code;
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // ignore
    }
  }

  return (
    <>
      <button type="button" className={buttonClass(variant)} onClick={() => setOpen(true)}>
        GET MY BUILDER CODE
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setOpen(false);
              setError(null);
            }}
          />

          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold tracking-[0.24em] text-orange-600">BUILDER PARTNER PROGRAM</div>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">Get Your Builder Code</h3>
                <p className="mt-2 text-sm text-neutral-600">
                  15% off all plans + Builder Pack (free mirrored set, 50% off CAD files, priority support).
                </p>
              </div>
              <button
                type="button"
                className="rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold"
                onClick={() => {
                  setOpen(false);
                  setError(null);
                }}
              >
                Close
              </button>
            </div>

            {success ? (
              <div className="mt-6">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="text-sm font-semibold">Your code: {success.code.code}</div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={copyCode}
                      className="inline-flex items-center justify-center rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold"
                    >
                      Copy
                    </button>
                    <Link href="/contractors/dashboard" className="text-xs font-semibold text-orange-600 underline">
                      Go to Builder Dashboard
                    </Link>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4">
                  <div className="text-sm font-semibold">Builder Pack</div>
                  <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-neutral-700">
                    <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">Free mirrored set</div>
                    <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">50% off CAD files</div>
                    <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">Priority support</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-neutral-800">First name</label>
                    <input
                      value={form.firstName}
                      onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                      className="mt-1 w-full rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-600"
                      placeholder="First name"
                      autoComplete="given-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-800">Last name</label>
                    <input
                      value={form.lastName}
                      onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                      className="mt-1 w-full rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-600"
                      placeholder="Last name"
                      autoComplete="family-name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-800">Email</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="mt-1 w-full rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="you@example.com"
                    type="email"
                    autoComplete="email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-800">Company</label>
                  <input
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    className="mt-1 w-full rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-600"
                    placeholder="Company"
                    autoComplete="organization"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-neutral-800">Role</label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as any }))}
                      className="mt-1 w-full rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-600"
                    >
                      <option value="" disabled>
                        Select role
                      </option>
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-800">License # (optional)</label>
                    <input
                      value={form.licenseNumber}
                      onChange={(e) => setForm((f) => ({ ...f, licenseNumber: e.target.value }))}
                      className="mt-1 w-full rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-600"
                      placeholder="License #"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={form.attested}
                    onChange={(e) => setForm((f) => ({ ...f, attested: e.target.checked }))}
                    className="mt-1"
                  />
                  <span className="text-sm text-neutral-700">
                    I certify I’m a builder/GC (or work for one).
                  </span>
                </label>

                {error ? <div className="text-sm text-red-600">{error}</div> : null}

                <button
                  type="button"
                  onClick={submit}
                  disabled={!canSubmit || loading}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-orange-600 px-5 py-3 text-xs font-semibold tracking-widest text-white disabled:opacity-50"
                >
                  {loading ? "Submitting…" : "SUBMIT"}
                </button>

                <div className="text-xs text-neutral-500">
                  By submitting, you’ll receive your unique builder code and Builder Pack details.
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
