"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type StripeExpressModalProps = {
  open: boolean;
  builderCode: string;
  items: any[];
  onClose: () => void;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function StripeExpressModal(props: StripeExpressModalProps) {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!props.open) return;
    setError(null);
  }, [props.open]);

  async function onContinue() {
    const em = email.trim();
    if (!em || !isValidEmail(em)) {
      setError("Enter a valid email");
      return;
    }

    if (!props.items || props.items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: em,
          items: props.items,
          builderCode: props.builderCode,
          successUrl: `${window.location.origin}/ordering?success=1`,
          cancelUrl: `${window.location.origin}/cart`,
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) {
        setError(String(data?.error ?? "Checkout failed"));
        return;
      }

      if (data?.url) {
        window.location.href = String(data.url);
        return;
      }

      setError("Checkout failed");
    } catch (e: any) {
      setError(String(e?.message ?? "Checkout failed"));
    } finally {
      setLoading(false);
    }
  }

  if (!mounted || !props.open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) props.onClose();
      }}
      aria-hidden={!props.open}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div className="text-base font-semibold">Stripe Express Checkout</div>
          <button
            type="button"
            onClick={props.onClose}
            className="rounded-full p-2 text-neutral-600 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-5">
          <div className="text-sm text-neutral-600">Enter your email to continue to Stripe Checkout.</div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-neutral-800">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-600"
              placeholder="you@example.com"
            />
          </div>

          {error ? <div className="mt-3 text-sm text-red-600">{error}</div> : null}

          <button
            type="button"
            onClick={onContinue}
            disabled={loading}
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Redirecting..." : "Continue"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
