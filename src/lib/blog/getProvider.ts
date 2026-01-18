import { LocalBlogProvider } from "@/lib/blog/localProvider";
import {
  MisconfiguredSanityBlogProvider,
  SanityBlogProvider,
} from "@/lib/blog/sanityProvider";
import type { BlogProvider } from "@/lib/blog/provider";
import { getSanityConfig } from "@/lib/sanity/client";

export function getBlogProvider(): BlogProvider {
  const provider = (process.env.BLOG_PROVIDER ?? "local").toLowerCase();
  if (provider === "sanity") {
    const cfg = getSanityConfig();
    if (!cfg) return new MisconfiguredSanityBlogProvider();
    return new SanityBlogProvider();
  }
  return new LocalBlogProvider();
}
