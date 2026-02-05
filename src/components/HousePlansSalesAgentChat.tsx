"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

export type ChatButtonProps = { 
  open: boolean; 
  toggle: () => void;
  renderChatDialog?: () => React.ReactNode;
};

type HousePlansSalesAgentChatProps = {
  children: React.ReactNode | ((buttonProps: ChatButtonProps) => React.ReactNode);
  renderButton?: (props: ChatButtonProps) => React.ReactNode;
};

export function HousePlansSalesAgentChat(props: HousePlansSalesAgentChatProps) {
  const isDesktop = useMediaQuery(MD_UP_MEDIA_QUERY, { serverFallback: true });

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [session, setSession] = useState<SalesSession>({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const feedRef = useRef<HTMLDivElement | null>(null);

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

  const toggle = () => setOpen((v) => !v);

  // Chat dialog render function passed to children
  const renderChatDialog = () => open ? (
    <>
      {/* Backdrop for mobile */}
      {!isDesktop && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setOpen(false)}
        />
      )}
      <div
        className={`z-50 ${
          isDesktop 
            ? "absolute top-full mt-2 right-0 w-[850px]" 
            : "fixed top-[140px] left-2 right-2"
        }`}
      >
      <div 
        className={`flex flex-col overflow-hidden border border-neutral-200 bg-white shadow-lg rounded-[16px] ${
          isDesktop ? "h-[460px]" : "h-[calc(100vh-160px)] max-h-[460px]"
        }`}
      >
        <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
          <div className="min-w-0">
            <div className="truncate text-[13px] font-semibold text-neutral-900">House of Watkins</div>
            <div className="truncate text-[12px] text-neutral-500">Sales Agent</div>
          </div>
          <button
            type="button"
            className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[12px] font-semibold"
            onClick={() => setOpen(false)}
            aria-label="Close chat"
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
    </>
  ) : null;

  return (
    <>
      {typeof props.children === "function"
        ? props.children({ open, toggle, renderChatDialog })
        : props.children}
    </>
  );
}

/** AI icon for the chat button */
function AIIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.0901 11.6306V5.31552C19.0901 4.73423 18.6189 4.26301 18.0376 4.26301H4.56552C3.98423 4.26301 3.51301 4.73423 3.51301 5.31552V17.9456C3.51301 18.5269 3.98423 18.9981 4.56552 18.9981H14.6696C15.0184 18.9981 15.3011 19.2809 15.3011 19.6296C15.3011 19.9784 15.0184 20.2611 14.6696 20.2611H4.56552C3.28669 20.2611 2.25 19.2244 2.25 17.9456V5.31552C2.25 4.03669 3.28669 3 4.56552 3H18.0376C19.3164 3 20.3531 4.03669 20.3531 5.31552V11.6306C20.3531 11.9793 20.0704 12.2621 19.7216 12.2621C19.3729 12.2621 19.0901 11.9793 19.0901 11.6306Z"
        fill="#2B2A28"
      />
      <path
        d="M13.2418 15.6133C13.2829 15.7234 13.2015 15.8406 13.084 15.8406H12.1942C12.1233 15.8406 12.0601 15.7962 12.0359 15.7296L11.3965 13.9686C11.3724 13.902 11.3091 13.8577 11.2382 13.8577H7.49579C7.42495 13.8577 7.36168 13.902 7.3375 13.9686L6.69814 15.7296C6.67396 15.7962 6.61069 15.8406 6.53984 15.8406H5.65C5.53255 15.8406 5.45118 15.7234 5.49221 15.6133L8.66308 7.10908C8.68765 7.0432 8.75056 6.99951 8.82087 6.99951H9.91316C9.98347 6.99951 10.0464 7.0432 10.0709 7.10908L13.2418 15.6133ZM9.51951 8.83629C9.46557 8.68859 9.25657 8.68885 9.203 8.8367L7.86374 12.5331C7.82396 12.6429 7.90529 12.7588 8.02207 12.7588H10.7113C10.8283 12.7588 10.9096 12.6425 10.8695 12.5327L9.51951 8.83629Z"
        fill="#2B2A28"
      />
      <path
        d="M14.5379 15.8406C14.4449 15.8406 14.3695 15.7652 14.3695 15.6722V7.16791C14.3695 7.07491 14.4449 6.99951 14.5379 6.99951H15.3757C15.4687 6.99951 15.5441 7.07491 15.5441 7.16791V15.6722C15.5441 15.7652 15.4687 15.8406 15.3757 15.8406H14.5379Z"
        fill="#2B2A28"
      />
      <path
        d="M19.384 14.7828C19.5251 14.3537 19.5956 14.1392 19.7181 14.1396C19.8405 14.1401 19.9094 14.3555 20.0472 14.7863C20.3158 15.6256 20.6762 16.686 20.8285 16.8383C20.98 16.9898 22.0297 17.3471 22.8668 17.6152C23.3025 17.7547 23.5203 17.8245 23.5205 17.9472C23.5207 18.0698 23.3032 18.1403 22.8683 18.2813C22.0245 18.5549 20.9644 18.9173 20.8285 19.0532C20.6921 19.1896 20.3273 20.2577 20.0534 21.1031C19.9136 21.5345 19.8437 21.7502 19.7212 21.7501C19.5987 21.7501 19.529 21.5344 19.3894 21.1029C19.1161 20.2583 18.752 19.1915 18.6136 19.0532C18.4746 18.9141 17.3969 18.5467 16.5502 18.273C16.1237 18.1351 15.9105 18.0662 15.9102 17.944C15.9099 17.8217 16.1226 17.7518 16.548 17.612C17.4036 17.3309 18.4959 16.9561 18.6136 16.8383C18.7309 16.721 19.1032 15.6369 19.384 14.7828Z"
        fill="#2B2A28"
      />
    </svg>
  );
}

/** Styled Chat AI button with dropdown dialog */
export function ChatAIButton({ open, toggle, renderChatDialog }: ChatButtonProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="relative items-center box-border gap-x-[0.2rem] flex shrink-0 h-[40px] justify-center px-4 bg-[rgba(255,239,235,1)] rounded-[50px] hover:bg-[rgba(255,225,215,1)] transition-colors"
        style={{ border: "1.5px solid rgba(255, 92, 2, 1)" }}
      >
        <AIIcon className="w-6 h-6" />
        <span
          className="text-[15px] font-medium text-[#2B2A28] whitespace-nowrap leading-[22px] align-middle"
          style={{ fontFamily: "Gilroy, sans-serif" }}
        >
          Chat AI
        </span>
      </button>
      {renderChatDialog?.()}
    </div>
  );
}
