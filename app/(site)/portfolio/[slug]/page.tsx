import { notFound } from "next/navigation";
import { getPortfolioProvider } from "@/lib/portfolio/getProvider";
import { LocalPortfolioProvider } from "@/lib/portfolio/localProvider";
import { PortfolioProjectPage } from "@/sitePages/PortfolioProjectPage";
import { TypographyProvider } from "@/lib/typographyContext";
import { getTypographyTemplateContent } from "@/lib/typographyServer";
import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";

type PageProps = {
  params: { slug: string };
};

export default async function Page(props: PageProps) {
  try {
    const provider = getPortfolioProvider();
    const slug = props.params.slug;

    const providerType = (process.env.PORTFOLIO_PROVIDER ?? "local").toLowerCase();
    const siteUrl = String(process.env.NEXT_PUBLIC_SITE_URL ?? "").toLowerCase();
    const isLocalhost = siteUrl.includes("localhost") || siteUrl.includes("127.0.0.1");

    let project = await provider.getProjectBySlug(slug);
    if (!project && providerType === "sanity" && isLocalhost) {
      const fallbackProvider = new LocalPortfolioProvider();
      project = await fallbackProvider.getProjectBySlug(slug);
    }

    if (!project) notFound();

    const typographyContent = (await getTypographyTemplateContent("portfolio_project")) ?? {};

    return (
      <>
        <InteriorHeader />
        <TypographyProvider templateKey="portfolio_project" content={typographyContent as any}>
          <PortfolioProjectPage project={project} />
        </TypographyProvider>
        <Footer />
      </>
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Portfolio provider error";

    const providerType = (process.env.PORTFOLIO_PROVIDER ?? "local").toLowerCase();
    const siteUrl = String(process.env.NEXT_PUBLIC_SITE_URL ?? "").toLowerCase();
    const isLocalhost = siteUrl.includes("localhost") || siteUrl.includes("127.0.0.1");
    if (providerType === "sanity" && isLocalhost) {
      try {
        const fallbackProvider = new LocalPortfolioProvider();
        const project = await fallbackProvider.getProjectBySlug(props.params.slug);
        if (project) {
          return (
            <>
              <InteriorHeader />
              <PortfolioProjectPage project={project} />
              <Footer />
            </>
          );
        }
      } catch {
      }
    }

    return (
      <>
        <InteriorHeader />
        <main className="mx-auto w-full max-w-5xl px-4 py-12">
          <h1 className="text-3xl font-semibold tracking-tight">Portfolio</h1>
          <p className="mt-4 text-sm text-neutral-600">{message}</p>
        </main>
        <Footer />
      </>
    );
  }
}
