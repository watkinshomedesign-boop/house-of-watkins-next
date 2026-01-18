import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const MODEL = "gpt-4o-mini";

type SemanticPlanRow = {
  plan_id: string;
  title: string;
  description: string;
  specs: any;
  url: string;
  similarity: number;
};

function coerceJson<T>(value: unknown): T | null {
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function normalizeQuery(value: unknown): string {
  const q = typeof value === "string" ? value : "";
  return q.trim().slice(0, 500);
}

function getErrorStatus(err: unknown): number | null {
  const anyErr = err as any;
  const s1 = typeof anyErr?.status === "number" ? anyErr.status : null;
  const s2 = typeof anyErr?.response?.status === "number" ? anyErr.response.status : null;
  return s1 ?? s2;
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

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY ?? process.env.OPEN_AI_SECRET_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing OPENAI_API_KEY (or OPEN_AI_SECRET_KEY)." },
      {
        status: 500,
      },
    );
  }

  let body: any = {};
  try {
    body = (await req.json()) as any;
  } catch {
    body = {};
  }

  const query = normalizeQuery(body?.query);
  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const openai = new OpenAI({ apiKey });

  try {
    const queryEmbedding = await embedQuery(openai, query);
    const queryEmbeddingVector = `[${queryEmbedding.join(",")}]`;

    const supabase = getSupabaseAdmin() as any;
    const { data, error } = await supabase.rpc("search_plans_by_vector", {
      query_embedding: queryEmbeddingVector,
      match_count: 10,
    });

    if (error) {
      return NextResponse.json({ error: "Supabase RPC failed", details: String(error.message ?? error) }, { status: 500 });
    }

    const rows = (Array.isArray(data) ? data : []) as SemanticPlanRow[];
    if (rows.length === 0) {
      return NextResponse.json({ no_results: true, message: "No relevant plans found." }, { status: 200 });
    }

    const allowedUrls = new Set(rows.map((r) => String(r.url || "")).filter(Boolean));

    const systemPrompt = `You are a house-plan search assistant for House of Watkins.
Only use the plans provided in the context.
Do not mention or recommend external websites, designers, or products.
Return STRICT JSON only.

If plans are relevant, return:
{
  "items": [
    {
      "title": string,
      "shortDescription": string,
      "url": string,
      "specs": object,
      "whyItMatches": string
    }
  ]
}

Include 3–5 items.

If no plans are relevant, return:
{ "no_results": true, "message": "brief helpful message" }.`;

    const context = rows
      .map((r, i) => {
        return [
          `#${i + 1}`,
          `title: ${String(r.title ?? "")}`,
          `url: ${String(r.url ?? "")}`,
          `specs: ${JSON.stringify(r.specs ?? {})}`,
          `description: ${String(r.description ?? "")}`,
          `similarity: ${typeof r.similarity === "number" ? r.similarity : ""}`,
        ].join("\n");
      })
      .join("\n\n");

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `User query: ${query}\n\nPlans context:\n${context}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const content = completion.choices?.[0]?.message?.content;
    const parsed = coerceJson<any>(content);

    if (!parsed || typeof parsed !== "object") {
      return NextResponse.json(
        {
          error: "Model returned invalid JSON",
        },
        { status: 500 },
      );
    }

    if (parsed.no_results) {
      return NextResponse.json(
        {
          no_results: true,
          message: typeof parsed.message === "string" ? parsed.message : "No relevant plans found.",
        },
        { status: 200 },
      );
    }

    const items = Array.isArray(parsed.items) ? parsed.items : null;
    if (!items) {
      return NextResponse.json(
        {
          error: "Model response missing items array",
        },
        { status: 500 },
      );
    }

    const filtered = items.filter((it: any) => {
      const url = String(it?.url ?? "");
      return allowedUrls.has(url);
    });

    if (filtered.length === 0) {
      return NextResponse.json(
        { no_results: true, message: "No relevant plans found." },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        items: filtered.slice(0, 5),
      },
      { status: 200 },
    );
  } catch (err) {
    const status = getErrorStatus(err);
    const message = err instanceof Error ? err.message : String(err);

    if (status === 429) {
      return NextResponse.json(
        { error: "Rate limited by OpenAI. Please retry." },
        { status: 429 },
      );
    }

    return NextResponse.json(
      {
        error: "Plan search failed",
        details: message,
      },
      { status: 500 },
    );
  }
}
