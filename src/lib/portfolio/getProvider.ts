import { getSanityConfig } from "@/lib/sanity/client";
import type { PortfolioProvider } from "@/lib/portfolio/provider";
import { LocalPortfolioProvider } from "@/lib/portfolio/localProvider";
import {
  MisconfiguredSanityPortfolioProvider,
  SanityPortfolioProvider,
} from "@/lib/portfolio/sanityProvider";

export function getPortfolioProvider(): PortfolioProvider {
  const provider = (process.env.PORTFOLIO_PROVIDER ?? "local").toLowerCase();
  if (provider === "sanity") {
    const cfg = getSanityConfig();
    if (!cfg) return new MisconfiguredSanityPortfolioProvider();
    return new SanityPortfolioProvider();
  }
  return new LocalPortfolioProvider();
}
