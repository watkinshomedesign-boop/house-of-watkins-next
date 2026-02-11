"use client";

import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/lib/favorites/useFavorites";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const IconHeart = (props: { filled: boolean; className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={props.filled ? "#EA580C" : "none"}
    stroke="white"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    aria-hidden="true"
  >
    <path d="M12.62 20.8101C12.28 20.9301 11.72 20.9301 11.38 20.8101C8.48 19.8201 2 15.6901 2 8.6901C2 5.6001 4.49 3.1001 7.56 3.1001C9.38 3.1001 10.99 3.9801 12 5.3401C13.01 3.9801 14.63 3.1001 16.44 3.1001C19.51 3.1001 22 5.6001 22 8.6901C22 15.6901 15.52 19.8201 12.62 20.8101Z" />
  </svg>
);

function Modal(props: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!props.open) return;
    const onKeyDown = ((e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") props.onClose();
    }) as EventListener;
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [props.open, props]);

  if (!mounted || !props.open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        if (e.target === e.currentTarget) props.onClose();
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
      }}
      aria-hidden={!props.open}
    >
      <div 
        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div className="text-base font-semibold">{props.title}</div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              props.onClose();
            }}
            className="rounded-full p-2 text-neutral-600 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-5 py-5">{props.children}</div>
      </div>
    </div>,
    document.body
  );
}

export function FavoriteButton(props: { planSlug: string; className?: string; layout?: "absolute" | "inline" }) {
  const router = useRouter();
  const fav = useFavorites();

  const pressed = fav.isFavorited(props.planSlug);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const needsAuth = useMemo(() => {
    return !fav.user;
  }, [fav.user]);

  async function onToggle(e: ReactMouseEvent | ReactKeyboardEvent) {
    e.preventDefault();
    e.stopPropagation();

    setError(null);
    setSuccess(null);

    if (needsAuth) {
      setOpen(true);
      return;
    }

    const was = fav.isFavorited(props.planSlug);
    await fav.toggle(props.planSlug);

    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_name: was ? "favorite_remove" : "favorite_add", plan_slug: props.planSlug }),
    }).catch(() => {
      // ignore
    });
  }

  async function submit() {
    setError(null);
    setSuccess(null);

    const n = name.trim();
    const em = email.trim();

    if (!n) {
      setError("Name is required");
      return;
    }
    if (!em || !isValidEmail(em)) {
      setError("Enter a valid email");
      return;
    }

    setLoading(true);
    try {
      await fav.startLogin({ name: n, email: em });
      const was = fav.isFavorited(props.planSlug);
      await fav.toggle(props.planSlug);

      await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_name: was ? "favorite_remove" : "favorite_add", plan_slug: props.planSlug }),
      }).catch(() => {
        // ignore
      });

      setSuccess(
        fav.providerType === "supabase"
          ? "Check your inbox for a magic link. Your favorite is saved."
          : "Your favorite is saved.",
      );
      router.push("/favorites");
      setOpen(false);
    } catch (e: any) {
      setError(e?.message || "Failed to continue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        aria-pressed={pressed}
        onClick={onToggle}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onToggle(e);
        }}
        className={
          (props.layout === "inline"
            ? "relative z-20 pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900/30 text-white backdrop-blur-sm transition-colors hover:bg-neutral-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 "
            : "absolute right-4 top-4 z-20 pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900/30 text-white backdrop-blur-sm transition-colors hover:bg-neutral-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 ") +
          (props.className ?? "")
        }
      >
        <IconHeart filled={pressed} className="h-6 w-6" />
      </button>

      <Modal
        open={open}
        title="Save to Favorites"
        onClose={() => {
          setOpen(false);
          setError(null);
          setSuccess(null);
        }}
      >
        <p className="text-sm text-neutral-600">Enter your details to save favorites and view them later.</p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-neutral-800">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-600"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-800">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-600"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Continue"}
          </button>

          {success ? <p className="text-sm text-green-700">{success}</p> : null}
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
        </div>
      </Modal>
    </>
  );
}
