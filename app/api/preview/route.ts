import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { safeInternalRedirectPath } from "@/lib/preview/safeRedirect";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  const redirectParam = url.searchParams.get("redirect");

  const expected = String(process.env.PREVIEW_SECRET || "").trim();
  if (!expected) {
    return NextResponse.json(
      {
        ok: false,
        error: "Preview is not configured. Missing PREVIEW_SECRET env var on the server.",
      },
      { status: 500 },
    );
  }

  if (!secret || secret !== expected) {
    return NextResponse.json(
      { ok: false, error: "Invalid secret" },
      { status: 401 },
    );
  }

  const redirectTo = safeInternalRedirectPath(redirectParam);
  if (!redirectTo) {
    return NextResponse.json(
      { ok: false, error: "Missing or invalid redirect. Must be an internal path starting with '/'." },
      { status: 400 },
    );
  }

  draftMode().enable();
  return NextResponse.redirect(new URL(redirectTo, request.url));
}
