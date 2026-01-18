"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { MD_UP_MEDIA_QUERY, useMediaQuery } from "@/lib/useMediaQuery";

type SalesSession = {
  bedrooms?: string;
  bathrooms?: string;
  sqftRange?: string;
  stories?: string;
  garage?: string;
  style?: string;
  orientation?: string;
  otherNotes?: string;
};

type PlanCard = {
  slug: string;
  title: string;
  description: string;
  url: string;
  image: string;
  priceUsd: number;
  specs: {
    beds: number | null;
    baths: number | null;
    sqft: number | null;
    stories: number | null;
    garage: number | null;
  };
  whyItMatches: string;
};

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
  recommendations?: PlanCard[];
};

const STORAGE_KEY = "how_houseplans_sales_chat_v1";

function safeParseJson<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function formatPrice(n: number) {
  if (!Number.isFinite(n) || n <= 0) return "";
  return `$${Math.round(n).toLocaleString()}`;
}

function formatSpecLine(specs: PlanCard["specs"]) {
  const parts: string[] = [];
  if (specs.beds != null) parts.push(`${specs.beds} bd`);
  if (specs.baths != null) parts.push(`${specs.baths} ba`);
  if (specs.sqft != null) parts.push(`${specs.sqft.toLocaleString()} sqft`);
  if (specs.stories != null) parts.push(`${specs.stories} story`);
  if (specs.garage != null) parts.push(`${specs.garage} car`);
  return parts.join(" · ");
}

function makeId() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function shouldReset(text: string) {
  const t = text.trim().toLowerCase();
  if (!t) return false;
  return t === "reset" || t === "start over" || t === "restart" || t === "/reset";
}

export function HousePlansSalesAgentChat(props: { children: React.ReactNode }) {
  const isDesktop = useMediaQuery(MD_UP_MEDIA_QUERY, { serverFallback: true });

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [session, setSession] = useState<SalesSession>({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const feedRef = useRef<HTMLDivElement | null>(null);

  const targetHeight = useMemo(() => {
    if (typeof window === "undefined") return isDesktop ? 460 : 320;

    const maxVh = window.innerHeight * (isDesktop ? 0.6 : 0.5);
    const preferred = isDesktop ? 460 : 320;
    const min = isDesktop ? 400 : 300;
    const cap = isDesktop ? 500 : 350;

    const capped = Math.min(cap, maxVh);
    const withMin = capped < min ? capped : Math.max(min, Math.min(preferred, capped));
    return Math.max(0, Math.floor(withMin));
  }, [isDesktop]);

  const offsetPx = open ? targetHeight : 0;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setMessages([
        {
          id: makeId(),
          role: "assistant",
          content: "Hi — I’m the House of Watkins plan specialist. What kind of house plan are you looking for today?",
        },
      ]);
      return;
    }

    const parsed = safeParseJson<{ messages?: ChatMessage[]; session?: SalesSession }>(raw);
    if (!parsed || !Array.isArray(parsed.messages)) {
      setMessages([
        {
          id: makeId(),
          role: "assistant",
          content: "Hi — I’m the House of Watkins plan specialist. What kind of house plan are you looking for today?",
        },
      ]);
      return;
    }

    setMessages(parsed.messages);
    setSession(parsed.session && typeof parsed.session === "object" ? parsed.session : {});
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, session }));
  }, [messages, session]);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    const el = feedRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, open, loading]);

  function reset() {
    setSession({});
    setMessages([
      {
        id: makeId(),
        role: "assistant",
        content: "Got it — let’s start over. How can I help you find your ideal house plan?",
      },
    ]);
    setError(null);
    setLoading(false);
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    if (shouldReset(text)) {
      setInput("");
      reset();
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { id: makeId(), role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/house-plans-sales-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          session,
        }),
      });

      const json = (await res.json()) as any;
      if (!res.ok) {
        throw new Error(String(json?.error ?? "Request failed"));
      }

      if (json?.reset) {
        reset();
        return;
      }

      const reply = typeof json?.reply === "string" ? json.reply : "";
      const sessionPatch = json?.sessionPatch && typeof json.sessionPatch === "object" ? (json.sessionPatch as Partial<SalesSession>) : {};
      const recommendations = Array.isArray(json?.recommendations) ? (json.recommendations as PlanCard[]) : [];

      setSession((s) => ({ ...s, ...sessionPatch }));
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: reply || "What would you like to prioritize (beds, baths, sqft, stories, garage, or style)?",
          recommendations: recommendations.length ? recommendations : undefined,
        },
      ]);
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: "I ran into an issue. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <div className="mb-3 w-full lg:max-w-[850px] lg:ml-auto">
        <button
          type="button"
          className="inline-flex items-center justify-between gap-3 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[13px] font-semibold text-neutral-900 shadow-sm"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="min-w-0 truncate">Chat with an AI plan specialist</span>
          <span className="shrink-0 text-neutral-500">{open ? "Collapse" : "Expand"}</span>
        </button>
      </div>

      <div className="relative">
        <div
          className={`absolute left-0 right-0 top-0 z-10 w-full overflow-hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
          style={{
            height: offsetPx,
            transition: "height 350ms ease-out",
          }}
        >
          <div
            className="h-full w-full lg:max-w-[850px] lg:ml-auto"
            style={{
              maxHeight: isDesktop ? "60vh" : "50vh",
            }}
          >
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-semibold text-neutral-900">House of Watkins</div>
                  <div className="truncate text-[12px] text-neutral-500">Sales Agent</div>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[12px] font-semibold"
                  onClick={() => setOpen(false)}
                  aria-label="Collapse chat"
                >
                  Close
                </button>
              </div>

              <div ref={feedRef} className="flex-1 overflow-y-auto px-4 py-3">
                <div className="flex flex-col gap-3">
                  {messages.map((m) => {
                    const isUser = m.role === "user";
                    return (
                      <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                        <div
                          className={
                            isUser
                              ? "max-w-[85%] rounded-2xl bg-orange-600 px-3 py-2 text-[13px] text-white"
                              : "max-w-[85%] rounded-2xl bg-neutral-100 px-3 py-2 text-[13px] text-neutral-900"
                          }
                        >
                          <div className="whitespace-pre-wrap">{m.content}</div>
                          {m.recommendations && m.recommendations.length ? (
                            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                              {m.recommendations.map((p) => (
                                <div key={p.url} className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                                  <Link href={p.url} className="block">
                                    <div className="aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                                      <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                                    </div>
                                    <div className="p-3">
                                      <div className="text-[13px] font-semibold text-neutral-900">{p.title}</div>
                                      <div className="mt-1 text-[12px] text-neutral-600">{formatSpecLine(p.specs)}</div>
                                      {p.priceUsd ? (
                                        <div className="mt-1 text-[12px] font-semibold text-neutral-900">Starting at {formatPrice(p.priceUsd)}</div>
                                      ) : null}
                                      {p.whyItMatches ? (
                                        <div className="mt-2 text-[12px] text-neutral-600">{p.whyItMatches}</div>
                                      ) : null}
                                      <div className="mt-3 inline-flex rounded-full bg-orange-600 px-3 py-1.5 text-[12px] font-semibold text-white">
                                        View plan
                                      </div>
                                    </div>
                                  </Link>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}

                  {loading ? (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl bg-neutral-100 px-3 py-2 text-[13px] text-neutral-900">
                        Typing…
                      </div>
                    </div>
                  ) : null}

                  {error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
                      {error}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="border-t border-neutral-100 p-3">
                <div className="flex items-end gap-2">
                  <label className="sr-only" htmlFor="sales-chat-input">
                    Message
                  </label>
                  <textarea
                    id="sales-chat-input"
                    ref={inputRef}
                    rows={2}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        send();
                      }
                    }}
                    className="min-h-[40px] flex-1 resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2 text-[13px] text-neutral-900 outline-none"
                    placeholder="Tell me what you want (e.g. 4 beds, 3 baths, modern, 2 story)…"
                  />
                  <button
                    type="button"
                    onClick={send}
                    disabled={loading || !input.trim()}
                    className="h-[40px] shrink-0 rounded-xl bg-orange-600 px-4 text-[13px] font-semibold text-white disabled:opacity-50"
                  >
                    Send
                  </button>
                  <button
                    type="button"
                    onClick={reset}
                    className="h-[40px] shrink-0 rounded-xl border border-neutral-200 bg-white px-3 text-[13px] font-semibold text-neutral-900"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            transform: `translateY(${offsetPx}px)`,
            transition: "transform 350ms ease-out",
          }}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
}
