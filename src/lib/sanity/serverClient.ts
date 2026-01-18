import { draftMode } from "next/headers";
import { getSanityClient, getSanityConfig } from "@/lib/sanity/client";

export function hasSanity(): boolean {
  return Boolean(getSanityConfig());
}

export function getServerSanityClientPreferDrafts() {
  const token = process.env.SANITY_API_READ_TOKEN ?? process.env.SANITY_API_TOKEN;
  const tokenConfigured = Boolean(String(token ?? "").trim());
  const perspective = tokenConfigured ? "drafts" : "published";

  return getSanityClient({
    token: tokenConfigured ? token : undefined,
    useCdn: false,
    perspective,
  });
}

export function getServerSanityClient() {
  const dm = draftMode();

  const token = process.env.SANITY_API_READ_TOKEN ?? process.env.SANITY_API_TOKEN;
  const tokenConfigured = Boolean(String(token ?? "").trim());
  const perspective = dm.isEnabled && tokenConfigured ? "drafts" : "published";

  return getSanityClient({
    token: tokenConfigured ? token : undefined,
    useCdn: tokenConfigured ? false : true,
    perspective,
  });
}
