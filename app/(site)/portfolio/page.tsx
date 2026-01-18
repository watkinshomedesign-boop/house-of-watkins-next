import { Footer } from "@/sections/Footer";
import { InteriorHeader } from "@/sections/InteriorHeader";
import { getPortfolioIndexPage } from "@/lib/contentPages/sanity";
import { urlForImage } from "@/lib/sanity/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { unstable_noStore as noStore } from "next/cache";

type PortfolioProjectCard = {
  title: string;
  body: ReactNode;
  author?: string;
  buttonText: string;
  imageSrc: string;
  imageAlt: string;
  href?: string;
};

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function PrimaryButton(props: { href?: string; children: ReactNode }) {
  const inner = (
    <span className="inline-flex items-center justify-center rounded-full border border-[#FF5C02] bg-[#FFEFEB] px-5 py-2.5 text-[13px] font-medium text-neutral-700 transition-colors duration-150 ease-out hover:bg-[#ffe1d7]">
      {props.children}
    </span>
  );

  return props.href ? (
    <Link href={props.href} className="inline-flex">
      {inner}
    </Link>
  ) : (
    <span className="inline-flex">{inner}</span>
  );
}

function sanityImageUrl(source: unknown, width: number) {
  if (!source) return undefined;
  if (typeof source === "string") {
    const lower = source.toLowerCase();
    if (lower.includes(".heif") || lower.includes(".heic")) return undefined;
    return source;
  }
  try {
    return urlForImage(source as any).width(width).fit("max").auto("format").url();
  } catch {
    return undefined;
  }
}

export default async function Page() {
  noStore();
  const cms = await getPortfolioIndexPage().catch(() => null);
  const media = cms?.portfolioIndexMedia;

  const projects: PortfolioProjectCard[] = [
    {
      title: "High Desert Contemporary",
      body: (
        <>
          <p>
            “David listened to us and worked tirelessly with us to make sure that we got what we wanted and needed. He was always
            receptive to our suggestions. He was patient and always ready and willing to make small updates. Subsequently, we ended
            up with an absolutely wonderful design that has translated into a home that is beyond our expectations! The man is
            OVERFLOWING with talent!” – T.W.
          </p>
        </>
      ),
      buttonText: "See More",
      imageSrc: "/plans/ADU%20under%20750/gallery/2-bedroom-adu-under-750-sq-ft-image-of-front-v1.jpg",
      imageAlt: "High Desert Contemporary",
      href: "/portfolio/3-bedroom-contemporary-house-plan-with-ofice-and-casita-and-3-car-garage-portfolio-images",
    },
    {
      title: "Transitional Farmhouse",
      body: (
        <>
          <p>
            “David was very pleasant and easy to work with and guided me through the process step by step. He listened to and worked
            with all my suggestions and made excellent suggestions of his own! The finished product has a lot of light and David did
            an excellent job of siting it on our property in order to take advantage of the best views. I would highly recommend
            him!” – J.M.
          </p>
        </>
      ),
      buttonText: "See More",
      imageSrc: "/build/residential-floor-plan-design.jpg",
      imageAlt: "Transitional Farmhouse",
      href: "/portfolio/4-bedroom-contemporary-house-plan-with-office-loft-and-3-car-side-load-garage-portfolio-images",
    },
    {
      title: "Farmhouse",
      body: (
        <>
          <p>
            “David is very engaged in the design process and gives consideration to things that other designers don’t, like the amount
            of natural sunlight, the way the house feels and the overall live-ability.” – H.M.
          </p>
        </>
      ),
      buttonText: "See More",
      imageSrc: "/plans/2-bed-adu/gallery/01.jpg",
      imageAlt: "Farmhouse",
      href: "/portfolio/4-bedroom-3-bath-2-story-contemporary-farmhouse-house-plan-with-loft-with-office-with-4-car-garage-portfolio-images",
    },
    {
      title: "Narrow Lot with Casita",
      body: (
        <>
          <p>
            David tackled the challenge of designing a two-bedroom home with a casita to fit on a really narrow lot. While I gave him
            a general layout idea, he brought it all together with a brilliant side-entry. It was the perfect solution.” – T.S.
          </p>
        </>
      ),
      buttonText: "See More",
      imageSrc: "/build/Not-So-Big-House-Plans-Design-Principles.jpg",
      imageAlt: "Narrow Lot with Casita",
      href: "/portfolio/3-bedroom-contemporary-house-plan-with-side-entrance-portfolio-images",
    },
    {
      title: "Contemporary Home",
      body: (
        <>
          <p>
            “Having been in construction for the last 8 years, I’ve seen the magic of David’s work. David’s blueprints have always
            flowed so perfectly to make the most sense down to the smallest measurements. He really puts the extra effort into the art
            he creates. I’ve learned a lot and being a part of David’s projects makes me proud of my work.” – C.G.
          </p>
        </>
      ),
      buttonText: "See More",
      imageSrc: "/placeholders/product-1.jpg",
      imageAlt: "Contemporary Home",
      href: "/portfolio/contemporary-2-story-4-bedroom-with-office-and-loft-house-plan-with-3-car-garage-portfolio-images",
    },
    {
      title: "Modern Home",
      body: (
        <>
          <p>
            “My wife and I knew from the very beginning that David was not your run of the mill home designer and that we were going
            to enjoy working with him.” – A.C.
          </p>
        </>
      ),
      buttonText: "See More",
      imageSrc: "/plans/ADU%20under%20750/gallery/2-bedroom-adu-under-750-sq-ft-interior-livingroom.jpg",
      imageAlt: "Modern Home",
      href: "/portfolio/3-bedroom-3-bath-modern-house-plan-with-3-car-garage-portfolio-images",
    },
    {
      title: "Classic Ranch",
      body: (
        <>
          <p>
            “David has been drawing plans for me for 20 years. As a builder, he provides great value from production to custom. His
            plans are value-engineered to reduce cost.” – J.L.
          </p>
        </>
      ),
      buttonText: "See More",
      imageSrc: "/plans/ADU%20under%20750/gallery/2-bedroom-adu-under-750-sq-ft-interior-kitchen-view-1.jpg",
      imageAlt: "Classic Ranch",
      href: "/portfolio/3-bedroom-3-bath-1-story-house-plan-with-office-with-3-car-garage-portfolio-images",
    },
  ];

  const heroSrc =
    media?.portfolioParentImage1Url ??
    sanityImageUrl(media?.portfolioParentImage1, 2600) ??
    "/plans/ADU%20under%20750/gallery/2-bedroom-adu-under-750-sq-ft-image-of-front-v1.jpg";

  const houseImageSrcOverrides = [
    media?.portfolioParentImage2Url ?? sanityImageUrl(media?.portfolioParentImage2, 2000) ?? null,
    media?.portfolioParentImage3Url ?? sanityImageUrl(media?.portfolioParentImage3, 2000) ?? null,
    media?.portfolioParentImage4Url ?? sanityImageUrl(media?.portfolioParentImage4, 2000) ?? null,
    media?.portfolioParentImage5Url ?? sanityImageUrl(media?.portfolioParentImage5, 2000) ?? null,
    media?.portfolioParentImage6Url ?? sanityImageUrl(media?.portfolioParentImage6, 2000) ?? null,
    media?.portfolioParentImage7Url ?? sanityImageUrl(media?.portfolioParentImage7, 2000) ?? null,
    media?.portfolioParentImage8Url ?? sanityImageUrl(media?.portfolioParentImage8, 2000) ?? null,
  ];

  const portraitSrc =
    media?.portfolioParentImage10Url ??
    sanityImageUrl(media?.portfolioParentImage10, 2000) ??
    "/placeholders/product-1.jpg";

  return (
    <div className="w-full" style={{ backgroundColor: "#FAF9F7", fontFamily: "Gilroy, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <InteriorHeader />
      <main className="w-full px-4 pb-20 pt-10 md:px-[56.832px]">
        <section className="overflow-hidden rounded-2xl">
          <div className="relative w-full aspect-[1920/623]">
            <img
              src={heroSrc}
              alt=""
              className="h-full w-full scale-[1.2] object-cover"
              draggable={false}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 md:px-10 md:py-6">
              <div className="text-[14px] tracking-[0.06em] text-white/90">David Watkins</div>
              <h1 className="mt-2 text-[32px] font-semibold leading-[1.2] tracking-tight text-white">
                Award Winning Architecture
                <br />
                Excellent Service
              </h1>
            </div>
          </div>
        </section>

        <section className="mt-[100px]">
          <div className="space-y-[80px]">
            {projects.map((p, idx) => {
              const reversed = idx % 2 === 1;
              const overrideImageSrc = houseImageSrcOverrides[idx] ?? p.imageSrc;
              const derivedHref = p.href ?? `/portfolio/${slugify(p.title)}`;

              return (
                <div
                  key={`${p.title}-${idx}`}
                  className="grid grid-cols-1 items-center gap-y-6 md:grid-cols-2 md:gap-x-0 md:gap-y-0"
                >
                  <div className={reversed ? "md:order-2" : "md:order-1"}>
                    <div className="w-full overflow-hidden rounded-xl aspect-[16/9]">
                      <img
                        src={overrideImageSrc}
                        alt={p.imageAlt}
                        className="h-full w-full scale-[1.2] object-cover"
                        draggable={false}
                      />
                    </div>
                  </div>

                  <div
                    className={
                      reversed
                        ? "md:order-1 md:flex md:justify-end md:pr-[100px]"
                        : "md:order-2 md:flex md:justify-start md:pl-[100px]"
                    }
                  >
                    <div
                      className={
                        reversed
                          ? "w-full md:w-[calc(66.666667%+100px)] text-left md:text-right"
                          : "w-full md:w-[calc(66.666667%+100px)] text-left"
                      }
                    >
                      <div className="text-[30px] font-semibold text-neutral-900">{p.title}</div>
                      <div className="mt-2 text-[21px] leading-[1.6] text-neutral-900">{p.body}</div>
                      <div className={reversed ? "mt-4 flex justify-start md:justify-end" : "mt-4 flex justify-start"}>
                        <PrimaryButton href={derivedHref}>{p.buttonText}</PrimaryButton>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-[80px] grid grid-cols-1 items-center gap-y-6 md:grid-cols-2 md:gap-x-[100px] md:gap-y-0">
            <div className="order-2 md:order-1 md:flex md:justify-end">
              <div className="w-full md:w-2/3 text-left">
                <div className="text-[30px] font-semibold text-neutral-900">I&apos;m David Watkins</div>
                <div className="mt-2 space-y-4 text-[21px] leading-[1.6] text-neutral-900">
                  <p>
                    I love to travel and discover new places around the world. I have a fascination with how other cultures live in
                    comparison.
                  </p>
                  <p>
                    As a child, I used to wonder what made a house feel like home. Today I listen carefully to each client so that I
                    can help create a special place that feels like home for each client.
                  </p>
                  <p>All of my homes are unique because all of my clients are unique.</p>
                </div>

                <div className="mt-6 flex justify-start">
                  <PrimaryButton href="/about">Our Team</PrimaryButton>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 md:flex md:justify-end">
              <div className="w-full overflow-hidden rounded-xl aspect-[2/3] md:w-[97.5%] md:origin-top-right md:scale-[0.85]">
                <img src={portraitSrc} alt="" className="h-full w-full scale-[1.2] object-cover" draggable={false} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
