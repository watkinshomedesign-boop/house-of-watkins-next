import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { safeInternalRedirectPath } from "@/lib/preview/safeRedirect";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectParam = url.searchParams.get("redirect");
  const redirectTo = safeInternalRedirectPath(redirectParam) || "/";

  draftMode().disable();
  return NextResponse.redirect(new URL(redirectTo, request.url));
}
