import { notFound, permanentRedirect, redirect } from "next/navigation";
import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";
import { PageRenderer } from "@/components/PageRenderer";
import { getSitePageBySlug } from "@/lib/sitePages/sanity";
import { isSitePageVisibleToRequest } from "@/lib/sitePages/visibility";
import { upsertRedirectServer } from "@/lib/sitePages/redirects";
import { lookupRedirectServer } from "@/lib/redirectsServer";

type PageProps = {
  params: { slug: string[] };
};

export default async function Page(props: PageProps) {
  const slugPath = `/${(props.params.slug ?? []).join("/")}`.replace(/\/+$/, "") || "/";
  const slugKey = slugPath === "/" ? "" : slugPath.slice(1);

  if (slugPath.startsWith("/house/")) {
    return notFound();
  }

  const existing = await lookupRedirectServer(slugPath);
  if (existing?.toPath) {
    if (existing.statusCode === 301 || existing.statusCode === 308) {
      return permanentRedirect(existing.toPath);
    }
    return redirect(existing.toPath);
  }

  const page = await getSitePageBySlug(slugKey);
  if (!page) return notFound();

  if (!isSitePageVisibleToRequest(page)) {
    return notFound();
  }

  const canonicalPath = page.slug ? `/${page.slug}` : "/";
  if (canonicalPath !== slugPath) {
    await upsertRedirectServer({ fromPath: slugPath, toPath: canonicalPath, statusCode: 301, isAuto: true });
    return permanentRedirect(canonicalPath);
  }

  return (
    <>
      <InteriorHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight">{page.title}</h1>
        <div className="mt-8">
          <PageRenderer content={page.content ?? []} />
        </div>
      </main>
      <Footer />
    </>
  );
}
