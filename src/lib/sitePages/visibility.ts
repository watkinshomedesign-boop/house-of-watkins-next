import { draftMode } from "next/headers";
import type { SitePage } from "@/lib/sitePages/types";

export function isSitePageVisibleToRequest(page: SitePage): boolean {
  const dm = draftMode();
  if (dm.isEnabled) return true;
  return page.status === "published";
}
