import { NextResponse } from "next/server";

type ChatMessage = {
  role: "system" | "assistant" | "user";
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

const MODEL = "gpt-4o-mini";

function coerceJson<T>(value: unknown): T | null {
  if (typeof value !== "string") return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { reply: "Server is missing OPENAI_API_KEY.", done: false },
      {
        status: 500,
      }
    );
  }

  const body = (await req.json()) as {
    messages?: Array<{ role: "assistant" | "user"; content: string }>;
    session?: IntakeSession;
  };

  const messages = body.messages ?? [];
  const session = body.session ?? {};

  const systemPrompt = `You are a house-design intake expert helping a client define a custom home layout.

Rules:
- Ask exactly ONE question at a time.
- Keep questions concise and actionable.
- You must update a structured session object as you learn information.
- When you have enough info, set done=true and return recommendedRooms.

Session fields:
- familySize
- lotInfo
- bedrooms
- baths
- style
- specialRooms
- budgetLevel
- otherNotes

Return STRICT JSON only, with this schema:
{
  "reply": string,
  "sessionPatch": { ...partial session fields... },
  "done": boolean,
  "recommendedRooms"?: [{ "id": string, "name": string, "sizeCategory": "sm"|"md"|"lg", "importanceScore": number }]
}

Guidance:
- importanceScore is 0..1.
- Include recommendedRooms only when done=true.
- If the user answer is vague, ask a clarifying question.

Current session (for reference): ${JSON.stringify(session)}
`;

  const openAiMessages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: openAiMessages,
      response_format: { type: "json_object" },
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json(
      {
        reply: "OpenAI request failed.",
        done: false,
        error: text,
      },
      { status: 500 }
    );
  }

  const json = (await response.json()) as any;
  const content = json?.choices?.[0]?.message?.content;

  const parsed = coerceJson<{
    reply: string;
    sessionPatch?: Partial<IntakeSession>;
    done?: boolean;
    recommendedRooms?: RecommendedRoom[];
  }>(content);

  if (!parsed || typeof parsed.reply !== "string") {
    return NextResponse.json(
      {
        reply:
          "I had trouble understanding that response. Please try again (or simplify your last message).",
        done: false,
      },
      { status: 200 }
    );
  }

  return NextResponse.json({
    reply: parsed.reply,
    sessionPatch: parsed.sessionPatch ?? {},
    done: Boolean(parsed.done),
    recommendedRooms: parsed.recommendedRooms,
  });
}
