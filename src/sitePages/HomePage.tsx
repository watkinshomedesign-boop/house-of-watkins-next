import { DesignSecrets } from "@/sections/DesignSecrets";
import { Footer } from "@/sections/Footer";
import { Hero } from "@/sections/Hero";
import { InteriorHeader } from "@/sections/InteriorHeader";
import { LeadCaptureSection } from "@/sections/LeadCaptureSection";
import { SearchSection } from "@/sections/SearchSection";
import { WelcomeSection } from "@/sections/WelcomeSection";
import type { HomePageSlots } from "@/lib/homePage/types";

export function HomePage(props: { cms?: HomePageSlots }) {
  const featuredEnabled = Boolean(props.cms?.featuredPlans?.enabled);
  const featuredTitle = props.cms?.featuredPlans?.title || "Featured Plans";
  const featuredSlugs = Array.isArray(props.cms?.featuredPlans?.planSlugs)
    ? props.cms?.featuredPlans?.planSlugs?.filter((s) => typeof s === "string" && s.trim())
    : [];

  const valuePropsEnabled = Boolean(props.cms?.valueProps?.enabled);
  const valuePropsTitle = props.cms?.valueProps?.title || "Why House of Watkins";
  const valuePropsBullets = Array.isArray(props.cms?.valueProps?.bullets)
    ? props.cms?.valueProps?.bullets?.filter((s) => typeof s === "string" && s.trim())
    : [];

  const consultEnabled = Boolean(props.cms?.consultationCta?.enabled);
  const consultText = props.cms?.consultationCta?.text || "Need help deciding? Talk to an expert.";
  const consultLabel = props.cms?.consultationCta?.buttonLabel || "Book a consultation";
  const consultUrl =
    props.cms?.consultationCta?.buttonUrl || "https://meetings.hubspot.com/watkinshomedesign";

  return (
    <div className="text-zinc-800 text-[15.2625px] not-italic normal-nums font-normal accent-auto bg-white box-border caret-transparent block tracking-[normal] leading-[22.8937px] list-outside list-disc outline-[oklab(0.708_0_0_/_0.5)] pointer-events-auto text-left indent-[0px] normal-case visible border-separate font-gilroy md:text-[14.208px] md:leading-[21.312px]">
      <div className="text-[15.2625px] box-border caret-transparent leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] md:overflow-x-visible md:text-[14.208px] md:leading-[21.312px]">
        <div className="text-[15.2625px] box-border caret-transparent leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] md:overflow-x-visible md:text-[14.208px] md:leading-[21.312px]">
          <div className="text-[15.2625px] box-border caret-transparent leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] md:overflow-x-visible md:text-[14.208px] md:leading-[21.312px]">
            <div className="relative text-[15.2625px] box-border caret-transparent basis-0 grow shrink-0 h-[1000px] leading-[22.8937px] min-h-px min-w-px outline-[oklab(0.708_0_0_/_0.5)] w-full md:overflow-x-visible md:text-[14.208px] md:leading-[21.312px]">
              <div className="text-[15.2625px] bg-[oklch(1_0_0)] box-border caret-transparent flex flex-col leading-[22.8937px] min-h-[1000px] outline-[oklab(0.708_0_0_/_0.5)] md:overflow-x-visible overflow-x-hidden md:text-[14.208px] md:leading-[21.312px]">
                <section
                  aria-label="Notifications alt+T"
                  className="text-[15.2625px] box-border caret-transparent leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] md:text-[14.208px] md:leading-[21.312px]"
                ></section>
                <div className="text-[15.2625px] box-border caret-transparent leading-[22.8937px] outline-[oklab(0.708_0_0_/_0.5)] w-full md:text-[14.208px] md:leading-[21.312px]">
                  <div className="text-base box-content caret-black gap-x-[normal] block flex-row leading-[normal] outline-black gap-y-[normal] w-auto md:text-[14.208px] md:aspect-auto md:box-border md:caret-transparent md:gap-x-[71.168px] md:flex md:flex-col md:leading-[21.312px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[71.168px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    <div className="relative z-50 md:[&_a[aria-label='Cart']]:hidden">
                      <InteriorHeader />
                    </div>
                    <div className="relative z-0 md:mt-[-71.168px]">
                      <Hero cms={props.cms?.hero} media={props.cms?.media} />
                    </div>
                    {featuredEnabled && featuredSlugs.length > 0 ? (
                      <div className="px-0 md:px-[56.832px]">
                        <div className="text-base normal-nums font-normal box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black md:text-[49.728px] md:font-semibold md:leading-[56.832px]">
                          <p className="box-content caret-black outline-black">{featuredTitle}</p>
                        </div>
                        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                          {featuredSlugs.map((slug) => (
                            <a
                              key={slug}
                              href={`/house/${slug}`}
                              className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900"
                            >
                              {slug}
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    <SearchSection />
                    {valuePropsEnabled && valuePropsBullets.length > 0 ? (
                      <div className="px-0 md:px-[56.832px]">
                        <div className="text-base normal-nums font-normal box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black md:text-[49.728px] md:font-semibold md:leading-[56.832px]">
                          <p className="box-content caret-black outline-black">{valuePropsTitle}</p>
                        </div>
                        <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-neutral-700">
                          {valuePropsBullets.map((b, idx) => (
                            <li key={idx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    <DesignSecrets cms={props.cms} />
                    <WelcomeSection media={props.cms?.media} />
                    {consultEnabled ? (
                      <div className="px-0 md:px-[56.832px]">
                        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                          <div className="text-sm font-semibold text-neutral-900">{consultText}</div>
                          <div className="mt-4">
                            <a
                              href={consultUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center rounded-full bg-orange-600 px-5 py-2 text-sm font-semibold text-white"
                            >
                              {consultLabel}
                            </a>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    <LeadCaptureSection
                      image={props.cms?.media?.leadCaptureImageUrl ?? props.cms?.media?.leadCaptureImage}
                      imageAlt={props.cms?.media?.leadCaptureImageAlt}
                    />
                    <Footer />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
