import { NextResponse } from "next/server";

export const revalidate = 60 * 60;

export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  return NextResponse.redirect(new URL("/api/pinterest-feed-xml", origin), 307);
}
