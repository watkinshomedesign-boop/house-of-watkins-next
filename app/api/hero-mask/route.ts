import { getServerSanityClient, hasSanity } from "@/lib/sanity/serverClient";

function isAllowedSanityCdnUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.host === "cdn.sanity.io";
  } catch {
    return false;
  }
}

async function resolveMaskUrl(req: Request): Promise<string | null> {
  const { searchParams } = new URL(req.url);
  const paramUrl = searchParams.get("url");

  // Optional debug hook; still locked to the Sanity CDN.
  if (paramUrl) {
    return isAllowedSanityCdnUrl(paramUrl) ? paramUrl : null;
  }

  if (!hasSanity()) return null;

  const client = getServerSanityClient();
  const row = await client.fetch(`*[_type == "homePage"][0]{ heroMaskAsset { asset->{ url } } }`);
  const url = row?.heroMaskAsset?.asset?.url ? String(row.heroMaskAsset.asset.url) : null;
  if (!url) return null;
  return isAllowedSanityCdnUrl(url) ? url : null;
}

export async function GET(req: Request) {
  const url = await resolveMaskUrl(req);
  if (!url) {
    return new Response("Mask not configured", { status: 404 });
  }

  const upstream = await fetch(url, { cache: "no-store" });
  if (!upstream.ok) {
    return new Response("Upstream fetch failed", { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
  const body = await upstream.arrayBuffer();

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
    },
  });
}
