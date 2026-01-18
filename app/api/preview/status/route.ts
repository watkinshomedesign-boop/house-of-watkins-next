import { NextResponse } from "next/server";

export async function GET() {
  const previewSecretConfigured = Boolean(String(process.env.PREVIEW_SECRET || "").trim());
  const sanityReadTokenConfigured = Boolean(String(process.env.SANITY_API_READ_TOKEN || "").trim());
  const publicPreviewSecretConfigured = Boolean(String(process.env.NEXT_PUBLIC_PREVIEW_SECRET || "").trim());
  const publicSiteUrlConfigured = Boolean(String(process.env.NEXT_PUBLIC_SITE_URL || "").trim());

  return NextResponse.json({
    server: {
      PREVIEW_SECRET: previewSecretConfigured,
      SANITY_API_READ_TOKEN: sanityReadTokenConfigured,
    },
    client: {
      NEXT_PUBLIC_PREVIEW_SECRET: publicPreviewSecretConfigured,
      NEXT_PUBLIC_SITE_URL: publicSiteUrlConfigured,
    },
  });
}
