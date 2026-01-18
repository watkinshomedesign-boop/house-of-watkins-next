import { draftMode } from "next/headers";
import type { ContentPage } from "@/lib/contentPages/types";

export function isContentPageVisibleToRequest(page: ContentPage | null): boolean {
  if (!page) return false;

  const dm = draftMode();
  if (dm.isEnabled) return true;

  if (typeof page.id === "string" && page.id.length > 0 && !page.id.startsWith("drafts.")) {
    return true;
  }

  return page.status === "published";
}
