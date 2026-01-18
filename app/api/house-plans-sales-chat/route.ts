import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const MODEL = "gpt-4o-mini";

type ClientMessage = {
  role: "assistant" | "user";
  content: string;
};

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

type SemanticPlanRow = {
  plan_id: string;
  title: string;
  description: string;
  specs: any;
  url: string;
  similarity: number;
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

function coerceJson<T>(value: unknown): T | null {
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function normalizeString(value: unknown, max = 500): string {
  const s = typeof value === "string" ? value : "";
  return s.trim().slice(0, max);
}

function getErrorStatus(err: unknown): number | null {
  const anyErr = err as any;
  const s1 = typeof anyErr?.status === "number" ? anyErr.status : null;
  const s2 = typeof anyErr?.response?.status === "number" ? anyErr.response.status : null;
  return s1 ?? s2;
}

function storagePublicUrl(pathOrUrl: string | null | undefined) {
  const s = String(pathOrUrl || "").trim();
  if (!s) return null;
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
  if (s.startsWith("/")) return s;
  if (s.startsWith("http://") || s.startsWith("https://")) {
    if (!base) return null;
    try {
      const u = new URL(s);
      const b = new URL(base);
      if (u.origin !== b.origin) return null;
      return s;
    } catch {
      return null;
    }
  }
  if (!base) return null;
  return `${base}/storage/v1/object/public/${s.replace(/^\/+/, "")}`;
}

function startingPriceUsd(heatedSqft: number) {
  const price = 1250 + 0.65 * heatedSqft;
  return Math.round(price);
}

async function embedQuery(openai: OpenAI, input: string): Promise<number[]> {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input,
  });
  const embedding = res.data?.[0]?.embedding;
  if (!Array.isArray(embedding) || embedding.length !== 1536) {
    throw new Error(`Unexpected embedding shape (len=${Array.isArray(embedding) ? embedding.length : "n/a"})`);
  }
  return embedding;
}

function buildSearchText(messages: ClientMessage[], session: SalesSession) {
  const lastUser = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const parts = [
    lastUser,
    session.bedrooms ? `Bedrooms: ${session.bedrooms}` : "",
    session.bathrooms ? `Bathrooms: ${session.bathrooms}` : "",
    session.sqftRange ? `Sqft: ${session.sqftRange}` : "",
    session.stories ? `Stories: ${session.stories}` : "",
    session.garage ? `Garage: ${session.garage}` : "",
    session.style ? `Style: ${session.style}` : "",
    session.orientation ? `Orientation: ${session.orientation}` : "",
    session.otherNotes ? `Other: ${session.otherNotes}` : "",
  ]
    .map((s) => String(s || "").trim())
    .filter(Boolean);

  return parts.join("\n").slice(0, 1200);
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY ?? process.env.OPEN_AI_SECRET_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Server is missing OPENAI_API_KEY (or OPEN_AI_SECRET_KEY)." }, { status: 500 });
  }

  let body: any = {};
  try {
    body = (await req.json()) as any;
  } catch {
    body = {};
  }

  const messagesRaw = Array.isArray(body?.messages) ? (body.messages as any[]) : [];
  const messages: ClientMessage[] = messagesRaw
    .map((m): ClientMessage => {
      const role: ClientMessage["role"] = m?.role === "assistant" ? "assistant" : "user";
      return {
        role,
        content: normalizeString(m?.content, 2000),
      };
    })
    .filter((m) => m.content);

  const session = (body?.session && typeof body.session === "object" ? body.session : {}) as SalesSession;

  if (messages.length === 0) {
    return NextResponse.json({ error: "Missing messages" }, { status: 400 });
  }

  const openai = new OpenAI({ apiKey });

  try {
    const searchText = buildSearchText(messages, session);
    const queryEmbedding = await embedQuery(openai, searchText);
    const queryEmbeddingVector = `[${queryEmbedding.join(",")}]`;

    const supabase = getSupabaseAdmin() as any;
    const { data, error } = await supabase.rpc("search_plans_by_vector", {
      query_embedding: queryEmbeddingVector,
      match_count: 12,
    });

    if (error) {
      return NextResponse.json({ error: "Supabase RPC failed", details: String(error.message ?? error) }, { status: 500 });
    }

    const rows = (Array.isArray(data) ? data : []) as SemanticPlanRow[];
    const allowedUrls = new Set(rows.map((r) => String(r.url || "").trim()).filter(Boolean));
    const slugs = Array.from(
      new Set(
        rows
          .map((r) => String(r.plan_id || "").trim())
          .filter(Boolean)
          .slice(0, 30)
      )
    );

    const planRowsBySlug: Record<string, any> = {};
    if (slugs.length > 0) {
      const publishedStatuses = ["published", "active", "Published", "ACTIVE"];
      const { data: planRows, error: planErr } = await supabase
        .from("plans")
        .select("slug, name, description, total_sqft, beds, baths, stories, garage_bays, images, status")
        .in("slug", slugs)
        .in("status", publishedStatuses)
        .limit(30);

      if (!planErr) {
        for (const p of planRows ?? []) {
          const slug = String(p?.slug || "").trim();
          if (slug) planRowsBySlug[slug] = p;
        }
      }
    }

    const candidates = rows
      .map((r) => {
        const slug = String(r.plan_id || "").trim();
        const plan = planRowsBySlug[slug];
        const totalSqft = plan && typeof plan.total_sqft === "number" ? plan.total_sqft : null;
        const priceUsd = totalSqft != null ? startingPriceUsd(totalSqft) : 0;

        const hero =
          plan?.images?.hero_desktop || plan?.images?.hero_mobile || plan?.images?.hero || plan?.images?.gallery?.[0] || null;
        const resolved = storagePublicUrl(hero) || "/placeholders/plan-hero.svg";

        return {
          slug,
          title: String(plan?.name ?? r.title ?? "").trim(),
          url: String(r.url ?? "").trim(),
          description: String(plan?.description ?? r.description ?? "").trim(),
          specs: {
            beds: typeof plan?.beds === "number" ? plan.beds : null,
            baths: typeof plan?.baths === "number" ? plan.baths : null,
            sqft: totalSqft,
            stories: typeof plan?.stories === "number" ? plan.stories : null,
            garage: typeof plan?.garage_bays === "number" ? plan.garage_bays : null,
          },
          image: resolved,
          priceUsd,
          similarity: typeof r.similarity === "number" ? r.similarity : 0,
        };
      })
      .filter((c) => c.slug && c.url && allowedUrls.has(c.url));

    const systemPrompt = `You are an AI sales agent for House of Watkins house plans.

Rules:
- Only recommend plans from the provided catalog context. Never recommend external products or competitors.
- Ask concise follow-up questions to gather requirements progressively (beds, baths, sqft range, stories, garage, style, lot orientation).
- If you have enough info OR the user asks to see options, recommend 3-5 plans from the provided context.
- Keep the tone helpful and direct.
- Return STRICT JSON only with this schema:
{
  "reply": string,
  "sessionPatch": {
    "bedrooms"?: string,
    "bathrooms"?: string,
    "sqftRange"?: string,
    "stories"?: string,
    "garage"?: string,
    "style"?: string,
    "orientation"?: string,
    "otherNotes"?: string
  },
  "recommendations": [{ "url": string, "whyItMatches": string }],
  "reset": boolean
}

- recommendations may be an empty array when you are still gathering requirements.
- Ask exactly ONE question at a time when not recommending.

Current session (for reference): ${JSON.stringify(session)}`;

    const context = candidates
      .slice(0, 12)
      .map((c, i) => {
        return [
          `#${i + 1}`,
          `title: ${c.title}`,
          `url: ${c.url}`,
          `priceUsd: ${c.priceUsd}`,
          `image: ${c.image}`,
          `specs: ${JSON.stringify(c.specs)}`,
          `description: ${c.description}`,
          `similarity: ${c.similarity}`,
        ].join("\n");
      })
      .join("\n\n");

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Conversation:\n${messages
            .slice(-20)
            .map((m) => `${m.role}: ${m.content.replace(/\n+/g, " ")}`)
            .join("\n")}\n\nCatalog context (only these plans may be recommended):\n${context}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const content = completion.choices?.[0]?.message?.content;
    const parsed = coerceJson<{
      reply: string;
      sessionPatch?: Partial<SalesSession>;
      recommendations?: Array<{ url: string; whyItMatches: string }>;
      reset?: boolean;
    }>(content);

    if (!parsed || typeof parsed.reply !== "string") {
      return NextResponse.json(
        {
          reply: "I had trouble generating a response. Please try again.",
          sessionPatch: {},
          recommendations: [],
          reset: false,
        },
        { status: 200 }
      );
    }

    const recsRaw = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
    const filteredRecs = recsRaw
      .map((r) => ({
        url: normalizeString(r?.url, 500),
        whyItMatches: normalizeString(r?.whyItMatches, 800),
      }))
      .filter((r) => r.url && allowedUrls.has(r.url));

    const byUrl = new Map(candidates.map((c) => [c.url, c]));
    const cards: PlanCard[] = filteredRecs
      .map((r) => {
        const c = byUrl.get(r.url);
        if (!c) return null;
        return {
          slug: c.slug,
          title: c.title,
          description: c.description,
          url: c.url,
          image: c.image,
          priceUsd: c.priceUsd,
          specs: c.specs,
          whyItMatches: r.whyItMatches || "",
        };
      })
      .filter(Boolean)
      .slice(0, 5) as PlanCard[];

    return NextResponse.json({
      reply: parsed.reply,
      sessionPatch: parsed.sessionPatch ?? {},
      recommendations: cards,
      reset: Boolean(parsed.reset),
    });
  } catch (err) {
    const status = getErrorStatus(err);
    const message = err instanceof Error ? err.message : String(err);

    if (status === 429) {
      return NextResponse.json({ error: "Rate limited by OpenAI. Please retry." }, { status: 429 });
    }

    return NextResponse.json(
      {
        error: "Chat request failed",
        details: message,
      },
      { status: 500 }
    );
  }
}
