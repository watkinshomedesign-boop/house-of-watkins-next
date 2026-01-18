"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

declare global {
  interface Window {
    paypal?: any;
  }
}

type PayPalExpressModalProps = {
  open: boolean;
  builderCode: string;
  items: any[];
  onClose: () => void;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = Array.from(document.getElementsByTagName("script")).find((s) => s.src === src);
    if (existing) {
      if ((existing as any).dataset.loaded === "true") return resolve();
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load PayPal SDK")));
      return;
    }

    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    (s as any).dataset.loaded = "false";
    s.onload = () => {
      (s as any).dataset.loaded = "true";
      resolve();
    };
    s.onerror = () => reject(new Error("Failed to load PayPal SDK"));
    document.head.appendChild(s);
  });
}

export function PayPalExpressModal(props: PayPalExpressModalProps) {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sdkReady, setSdkReady] = useState(false);

  const buttonContainerId = useMemo(() => "paypal-buttons-" + Math.random().toString(36).slice(2), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!props.open) return;
    setError(null);
    setSdkReady(false);
  }, [props.open]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!props.open) return;

      try {
        const res = await fetch("/api/paypal/config", { method: "GET" });
        const cfg = (await res.json()) as any;
        if (!res.ok) throw new Error(String(cfg?.error ?? "PayPal not configured"));

        const clientId = String(cfg?.clientId ?? "").trim();
        if (!clientId) throw new Error("PayPal not configured");

        const currency = String(cfg?.currency ?? "USD");

        const src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${encodeURIComponent(currency)}&intent=capture`;
        await loadScript(src);

        if (cancelled) return;
        setSdkReady(true);
      } catch (e: any) {
        if (cancelled) return;
        setError(String(e?.message ?? "PayPal not configured"));
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [props.open]);

  useEffect(() => {
    if (!props.open) return;
    if (!sdkReady) return;
    if (!window.paypal) return;

    const el = document.getElementById(buttonContainerId);
    if (!el) return;
    el.innerHTML = "";

    const buttons = window.paypal.Buttons({
      createOrder: async () => {
        const em = email.trim();
        if (!em || !isValidEmail(em)) {
          setError("Enter a valid email");
          throw new Error("Invalid email");
        }

        if (!props.items || props.items.length === 0) {
          setError("Your cart is empty");
          throw new Error("Empty cart");
        }

        setLoading(true);
        setError(null);

        const res = await fetch("/api/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: em, items: props.items, builderCode: props.builderCode }),
        });

        const data = (await res.json()) as any;
        setLoading(false);

        if (!res.ok) {
          setError(String(data?.error ?? "PayPal checkout failed"));
          throw new Error("PayPal create-order failed");
        }

        const id = String(data?.id ?? "");
        if (!id) {
          setError("PayPal checkout failed");
          throw new Error("Missing PayPal order id");
        }

        return id;
      },
      onApprove: async (data: any) => {
        try {
          setLoading(true);
          setError(null);

          const orderID = String(data?.orderID ?? "");
          const res = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderID }),
          });

          const json = (await res.json()) as any;
          if (!res.ok) {
            setError(String(json?.error ?? "PayPal capture failed"));
            return;
          }

          window.location.href = `${window.location.origin}/ordering?success=1`;
        } finally {
          setLoading(false);
        }
      },
    });

    buttons.render(`#${buttonContainerId}`);
  }, [props.open, sdkReady, buttonContainerId, email, props.items, props.builderCode]);

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
          <div className="text-base font-semibold">PayPal Express Checkout</div>
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
          <div className="text-sm text-neutral-600">Enter your email to continue with PayPal.</div>

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

          <div className={"mt-5 " + (loading ? "opacity-50 pointer-events-none" : "")}
               aria-busy={loading}
          >
            <div id={buttonContainerId} />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
