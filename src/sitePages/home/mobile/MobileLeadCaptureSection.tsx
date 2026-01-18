"use client";

import type { HomePageMediaSlots } from "@/lib/homePage/types";
import { urlForImage } from "@/lib/sanity/image";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";

function imageUrl(source: unknown): string | undefined {
  if (!source) return undefined;
  if (typeof source === "string") return source;
  try {
    return urlForImage(source as any).width(1600).height(1200).fit("crop").url();
  } catch {
    return undefined;
  }
}

export function MobileLeadCaptureSection(props: { media?: HomePageMediaSlots }) {
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [userType, setUserType] = useState<"homeowner" | "builder">("homeowner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    const em = email.trim();
    return Boolean(firstName.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em));
  }, [email, firstName]);

  const src = props.media?.leadCaptureImageUrl ?? imageUrl(props.media?.leadCaptureImage);
  const alt = props.media?.leadCaptureImageAlt ?? "";

  async function submit() {
    setError(null);
    setSuccess(null);

    const em = email.trim();
    const fn = firstName.trim();

    if (!fn) return setError("First name is required");
    if (!em) return setError("Email is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return setError("Enter a valid email");

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          first_name: fn,
          email: em,
          user_type: userType,
          source: "lead_capture_mobile",
          page_path: pathname,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(String((json as any)?.error ?? "Failed to submit"));

      setSuccess("Thanks — check your inbox shortly.");
      setEmail("");
      setFirstName("");
      setUserType("homeowner");
    } catch (e: any) {
      setError(String(e?.message ?? "Failed to submit"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-[#F7F5F3]">
      <div className="px-6 pb-7 pt-8">
        <div className="text-[22px] leading-[26px] font-semibold text-neutral-900">
          Get Your <span className="inline-block rounded-full bg-orange-600 px-3 py-1 text-white">Free Guide</span>
        </div>
        <div className="mt-2 text-[18px] font-semibold text-neutral-900">&quot;How to Choose the Perfect Plan&quot;</div>

        <div className="mt-6 grid grid-cols-1 gap-4">
          <label className="text-[12px] font-semibold text-neutral-900">
            First Name
            <div className="relative mt-2">
              <input
                type="text"
                placeholder="David"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-full border border-neutral-200 bg-white px-5 py-3.5 pr-12 text-[14px] text-neutral-900"
              />
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-700">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
          </label>

          <div>
            <div className="text-[12px] font-semibold text-neutral-900">I am a</div>
            <div className="mt-2 flex flex-col gap-2">
              <label className="flex items-start gap-2 text-[14px] text-neutral-900">
                <input
                  type="radio"
                  name="lead_user_type_mobile"
                  checked={userType === "homeowner"}
                  onChange={() => setUserType("homeowner")}
                  className="mt-[3px] h-4 w-4 accent-orange-600"
                />
                <span>Future Dream Homeowner (Living in the Home)</span>
              </label>
              <label className="flex items-start gap-2 text-[14px] text-neutral-900">
                <input
                  type="radio"
                  name="lead_user_type_mobile"
                  checked={userType === "builder"}
                  onChange={() => setUserType("builder")}
                  className="mt-[3px] h-4 w-4 accent-orange-600"
                />
                <span>Licensed Builder (Building the Home)</span>
              </label>
            </div>
          </div>

          <label className="text-[12px] font-semibold text-neutral-900">
            Email
            <div className="relative mt-2">
              <input
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-neutral-200 bg-white px-5 py-3.5 pr-12 text-[14px] text-neutral-900"
              />
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-700">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
          </label>

          <button
            type="button"
            onClick={submit}
            disabled={loading || !canSubmit}
            className="mt-1 w-full rounded-full border border-orange-600 bg-transparent px-6 py-4 text-[14px] font-semibold text-neutral-900"
          >
            {loading ? "SENDING..." : "GET GUIDE"}
          </button>

          {success ? <div className="text-sm text-green-700">{success}</div> : null}
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
        </div>
      </div>

      {src ? <img src={src} alt={alt} className="h-[240px] w-full object-cover" draggable={false} /> : null}
    </div>
  );
}

export default MobileLeadCaptureSection;
