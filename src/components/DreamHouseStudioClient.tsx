"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

type RoomBubble = {
  id: string;
  label: string;
  radius: number;
  x: number;
  y: number;
  color: string;
};

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  content: string;
};

type IntakeSession = {
  familySize?: string;
  lotInfo?: string;
  bedrooms?: string;
  baths?: string;
  style?: string;
  specialRooms?: string;
  budgetLevel?: string;
  otherNotes?: string;
};

type RecommendedRoom = {
  id: string;
  name: string;
  sizeCategory: "sm" | "md" | "lg";
  importanceScore: number;
};

const DEFAULT_ROOMS: RoomBubble[] = [
  { id: "living", label: "Living", radius: 140, x: 290, y: 250, color: "#ffffff" },
  { id: "kitchen", label: "Kitchen", radius: 110, x: 520, y: 240, color: "#ffffff" },
  { id: "owners", label: "Owner’s Suite", radius: 120, x: 560, y: 420, color: "#ffffff" },
  { id: "entry", label: "Entry", radius: 70, x: 220, y: 420, color: "#ffffff" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getSvgPoint(svg: SVGSVGElement, clientX: number, clientY: number) {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const screenCTM = svg.getScreenCTM();
  if (!screenCTM) return { x: 0, y: 0 };
  const inverted = screenCTM.inverse();
  const svgPoint = pt.matrixTransform(inverted);
  return { x: svgPoint.x, y: svgPoint.y };
}

function bubbleRadiusFromRecommendation(rec: RecommendedRoom) {
  const base = rec.sizeCategory === "lg" ? 120 : rec.sizeCategory === "md" ? 95 : 70;
  const importance = Number.isFinite(rec.importanceScore) ? clamp(rec.importanceScore, 0, 1) : 0.6;
  return Math.round(base * (0.75 + importance * 0.45));
}

function gridLayout(count: number) {
  const cols = count <= 4 ? 2 : 3;
  const paddingX = 140;
  const paddingY = 140;
  const startX = 200;
  const startY = 180;
  const gapX = 240;
  const gapY = 200;

  return Array.from({ length: count }).map((_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      x: startX + col * gapX,
      y: startY + row * gapY,
      paddingX,
      paddingY,
    };
  });
}

export default function DreamHouseStudioClient() {
  const [rooms, setRooms] = useState<RoomBubble[]>(DEFAULT_ROOMS);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const draggingRef = useRef<{
    roomId: string;
    pointerId: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      role: "assistant",
      content: "Hi! Let’s start your layout. What rooms feel essential for your day-to-day life?",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [session, setSession] = useState<IntakeSession>({});
  const [interviewDone, setInterviewDone] = useState(false);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    location: "",
    budget: "",
    details: "",
  });
  const [submitState, setSubmitState] = useState<"idle" | "success">("idle");

  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;

  const roomById = useMemo(() => {
    const map = new Map<string, RoomBubble>();
    for (const room of rooms) map.set(room.id, room);
    return map;
  }, [rooms]);

  const handlePointerDown = useCallback(
    (roomId: string, evt: ReactPointerEvent) => {
      if (!svgRef.current) return;
      const svg = svgRef.current;
      const point = getSvgPoint(svg, evt.clientX, evt.clientY);
      const current = roomById.get(roomId);
      if (!current) return;

      draggingRef.current = {
        roomId,
        pointerId: evt.pointerId,
        offsetX: point.x - current.x,
        offsetY: point.y - current.y,
      };

      (evt.currentTarget as SVGGElement).setPointerCapture(evt.pointerId);
    },
    [roomById]
  );

  const handlePointerMove = useCallback((evt: ReactPointerEvent) => {
    if (!svgRef.current) return;
    const drag = draggingRef.current;
    if (!drag) return;
    if (evt.pointerId !== drag.pointerId) return;

    const svg = svgRef.current;
    const point = getSvgPoint(svg, evt.clientX, evt.clientY);

    setRooms((prev) =>
      prev.map((room) => {
        if (room.id !== drag.roomId) return room;
        const nextX = clamp(point.x - drag.offsetX, 0 + room.radius, 800 - room.radius);
        const nextY = clamp(point.y - drag.offsetY, 0 + room.radius, 600 - room.radius);
        return { ...room, x: nextX, y: nextY };
      })
    );
  }, []);

  const handlePointerUp = useCallback((evt: ReactPointerEvent) => {
    const drag = draggingRef.current;
    if (!drag) return;
    if (evt.pointerId !== drag.pointerId) return;
    draggingRef.current = null;
  }, []);

  const resetRooms = useCallback(() => {
    setRooms(DEFAULT_ROOMS);
  }, []);

  const applyRecommendedRooms = useCallback((recs: RecommendedRoom[]) => {
    const positions = gridLayout(recs.length);
    setRooms(
      recs.map((rec, i) => {
        const radius = bubbleRadiusFromRecommendation(rec);
        const pos = positions[i] ?? { x: 400, y: 300 };
        return {
          id: rec.id,
          label: rec.name,
          radius,
          x: clamp(pos.x, radius, 800 - radius),
          y: clamp(pos.y, radius, 600 - radius),
          color: "#ffffff",
        };
      })
    );
  }, []);

  const sendMessage = useCallback(async () => {
    const trimmed = draft.trim();
    if (!trimmed || sending) return;

    setSubmitState("idle");

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setDraft("");
    setSending(true);

    try {
      const res = await fetch("/api/dream-house-layout-studio/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })),
          session,
        }),
      });

      if (!res.ok) {
        throw new Error(`Chat request failed: ${res.status}`);
      }

      const data = (await res.json()) as {
        reply: string;
        sessionPatch?: Partial<IntakeSession>;
        done?: boolean;
        recommendedRooms?: RecommendedRoom[];
      };

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: data.reply,
        },
      ]);

      if (data.sessionPatch) {
        setSession((prev) => ({ ...prev, ...data.sessionPatch }));
      }

      if (data.done) {
        setInterviewDone(true);
      }

      if (data.recommendedRooms?.length) {
        applyRecommendedRooms(data.recommendedRooms);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: "Sorry—something went wrong sending that. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }, [applyRecommendedRooms, draft, messages, sending, session]);

  const handleSubmit = useCallback(async () => {
    const payload = {
      ...formState,
      layout: rooms,
      interview: {
        done: interviewDone,
        session,
        transcript: messages.map(({ role, content }) => ({ role, content })),
      },
    };

    // For now: log it and show success.
    // Later: you can POST this payload to an API route.
    // eslint-disable-next-line no-console
    console.log("Dream House Layout Studio submission:", payload);

    setSubmitState("success");
  }, [formState, interviewDone, messages, rooms, session]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <div className="max-w-3xl">
        <div className="text-xs font-semibold tracking-widest text-neutral-500">INTERACTIVE TOOL</div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Dream House Layout Studio</h1>
        <p className="mt-4 text-sm leading-6 text-neutral-600">
          A guided, conversational tool that turns your answers into a visual “bubble” layout of rooms—similar to the intake
          questions used in a real design consultation.
        </p>
      </div>

      <div className="mt-10 border-t border-neutral-200 pt-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="text-base font-semibold tracking-tight">Answer a guided intake</div>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Chat through key questions about family, site, style, and priorities.</p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="text-base font-semibold tracking-tight">See your room bubbles</div>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Get labeled circles sized by room importance and function.</p>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="text-base font-semibold tracking-tight">Share &amp; book a consult</div>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Submit your layout, send a message, and schedule time with David.</p>
          </div>
        </div>
      </div>

      <div className="mt-12 rounded-3xl border border-neutral-200 bg-orange-50/60 p-4 md:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold tracking-widest text-neutral-500">Step 1 of 3: Your needs</div>
                <div className="mt-2 text-lg font-semibold tracking-tight">House Design Interview</div>
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  Answer a few guided questions—just like a real intake meeting—to shape your ideal floor plan.
                </p>
              </div>
            </div>

            <div className="mt-6 flex h-[320px] flex-col rounded-2xl border border-neutral-200 bg-white">
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={
                        msg.role === "user"
                          ? "ml-auto max-w-[85%] rounded-2xl bg-orange-600 px-4 py-3 text-sm text-white"
                          : "max-w-[85%] rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700"
                      }
                    >
                      {msg.content}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-200 p-3">
                <div className="flex items-end gap-3">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={2}
                    placeholder="Type your answer…"
                    className="w-full resize-none rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-orange-600"
                    disabled={sending}
                  />
                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={sending || !draft.trim()}
                    className="inline-flex h-[40px] items-center justify-center rounded-xl bg-orange-600 px-4 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {sending ? "Sending…" : "Send"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="text-lg font-semibold tracking-tight">Your Room Bubbles</div>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Drag the circles to explore adjacency and flow. Positions are saved in memory on drag end.
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
              <div className="aspect-[4/3] w-full">
                <svg
                  ref={svgRef}
                  viewBox="0 0 800 600"
                  className="h-full w-full touch-none"
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                >
                  <rect x="0" y="0" width="800" height="600" fill="#fafafa" />

                  {rooms.map((room) => (
                    <g
                      key={room.id}
                      onPointerDown={(evt) => handlePointerDown(room.id, evt)}
                      style={{ cursor: "grab" }}
                    >
                      <circle cx={room.x} cy={room.y} r={room.radius} fill={room.color} stroke="#e5e5e5" strokeWidth={2} />
                      <text
                        x={room.x}
                        y={room.y}
                        textAnchor="middle"
                        fontSize={Math.max(18, Math.min(26, room.radius / 5.5))}
                        fontFamily="inherit"
                        fill="#111827"
                        dominantBaseline="middle"
                        style={{ userSelect: "none", pointerEvents: "none" }}
                      >
                        {room.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            <div className="mt-3 text-xs text-neutral-500">
              Legend: circle size ≈ room priority. When the interview completes, your bubbles will be regenerated from the AI
              recommendation.
            </div>

            <div className="mt-3 flex items-center justify-between">
              <button type="button" onClick={resetRooms} className="text-sm font-semibold text-orange-600 underline">
                Reset layout
              </button>
              {interviewDone ? (
                <div className="text-xs font-semibold tracking-widest text-neutral-500">INTAKE COMPLETE</div>
              ) : null}
            </div>
          </section>
        </div>
      </div>

      <div className="mt-12 max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight">What happens with your layout</h2>
        <p className="mt-4 text-sm leading-6 text-neutral-600">
          David will review your submitted layout, note cost-saving opportunities, check buildability, and come prepared to your
          consultation with clear next steps.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Share your project details</h2>
          <p className="mt-4 text-sm leading-6 text-neutral-600">
            Your form responses (and your saved layout) help us prepare a focused, productive meeting.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit();
            }}
          >
            <input type="hidden" name="roomLayout" value={JSON.stringify(rooms)} />

            <label className="block">
              <div className="text-sm font-semibold text-zinc-900">Name</div>
              <input
                className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
                value={formState.name}
                onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
              />
            </label>
            <label className="block">
              <div className="text-sm font-semibold text-zinc-900">Email</div>
              <input
                type="email"
                className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
                value={formState.email}
                onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
              />
            </label>
            <label className="block">
              <div className="text-sm font-semibold text-zinc-900">Project location (City, State/Region)</div>
              <input
                className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
                value={formState.location}
                onChange={(e) => setFormState((prev) => ({ ...prev, location: e.target.value }))}
              />
            </label>
            <label className="block">
              <div className="text-sm font-semibold text-zinc-900">Optional budget range</div>
              <select
                className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
                value={formState.budget}
                onChange={(e) => setFormState((prev) => ({ ...prev, budget: e.target.value }))}
              >
                <option value="">Select…</option>
                <option value="under-300">Under $300k</option>
                <option value="300-500">$300k–$500k</option>
                <option value="500-800">$500k–$800k</option>
                <option value="800-plus">$800k+</option>
              </select>
            </label>
            <label className="block">
              <div className="text-sm font-semibold text-zinc-900">Tell me more about your project</div>
              <textarea
                rows={5}
                className="mt-2 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm"
                value={formState.details}
                onChange={(e) => setFormState((prev) => ({ ...prev, details: e.target.value }))}
              />
            </label>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
              Your room layout JSON will be attached on submit. (For now it’s logged in the console.)
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Submit
            </button>

            {submitState === "success" ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                Success! We received your message (and your current room layout).
              </div>
            ) : null}
          </form>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="text-lg font-semibold tracking-tight">Book your design call</div>
          {calendlyUrl ? (
            <>
              <p className="mt-2 text-sm leading-6 text-neutral-600">Pick a time that works for you.</p>
              <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
                <iframe
                  title="Schedule a design call"
                  src={calendlyUrl}
                  className="h-[560px] w-full"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm leading-6 text-neutral-600">A scheduling embed will live here soon.</p>
              <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-sm text-neutral-600">
                Set <span className="font-mono">NEXT_PUBLIC_CALENDLY_URL</span> to your Calendly embed URL to enable scheduling.
              </div>
            </>
          )}
        </section>
      </div>

      <div className="mt-12 rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
        <h3 className="text-lg font-semibold tracking-tight">What you’ll walk away with</h3>
        <div className="mt-4 space-y-2 text-sm text-neutral-700">
          <div className="flex items-start gap-2">
            <span className="mt-[2px] text-orange-600">✓</span>
            <span>A clearer vision of how your rooms fit together.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-[2px] text-orange-600">✓</span>
            <span>Early feedback on buildability and cost drivers.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-[2px] text-orange-600">✓</span>
            <span>A concrete next step for turning your layout into a full set of plans.</span>
          </div>
        </div>
      </div>
    </main>
  );
}
