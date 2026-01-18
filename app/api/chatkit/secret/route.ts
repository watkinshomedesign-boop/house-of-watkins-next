import { NextResponse } from "next/server";
import crypto from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const apiKey = String(process.env.OPENAI_API_KEY || process.env.OPEN_AI_SECRET_KEY || "").trim();
  const workflowId = String(process.env.CHATKIT_WORKFLOW_ID || "").trim();
  const apiBase = String(process.env.CHATKIT_API_BASE || "https://api.openai.com").trim();
  const cookieName = "chatkit_user_id";

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OpenAI key missing. Set OPENAI_API_KEY (preferred) or OPEN_AI_SECRET_KEY on the server. Do not expose this key in NEXT_PUBLIC_* env vars.",
      },
      { status: 500 },
    );
  }

  if (!workflowId) {
    return NextResponse.json(
      {
        error: "ChatKit workflow id missing. Set CHATKIT_WORKFLOW_ID on the server.",
      },
      { status: 500 },
    );
  }

  let userId: string | null = null;
  const rawCookie = req.headers.get("cookie") || "";
  const existingCookie = rawCookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${cookieName}=`));
  if (existingCookie) {
    const value = existingCookie.slice(cookieName.length + 1);
    userId = value ? decodeURIComponent(value) : null;
  }

  if (!userId) {
    userId = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : String(Date.now());
  }

  const upstreamRes = await fetch(`${apiBase.replace(/\/$/, "")}/v1/chatkit/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "OpenAI-Beta": "chatkit_beta=v1",
    },
    body: JSON.stringify({
      workflow: { id: workflowId },
      user: userId,
    }),
  });

  const upstreamJson = (await upstreamRes.json().catch(() => ({}))) as any;

  if (!upstreamRes.ok) {
    return NextResponse.json(
      {
        error:
          String(upstreamJson?.error?.message || upstreamJson?.error || upstreamRes.statusText || "Failed to create ChatKit session"),
        details: upstreamJson,
      },
      { status: upstreamRes.status || 502 },
    );
  }

  const res = NextResponse.json(
    {
      client_secret: upstreamJson?.client_secret,
      expires_after: upstreamJson?.expires_after,
    },
    { status: 200 },
  );

  res.cookies.set(cookieName, encodeURIComponent(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}
