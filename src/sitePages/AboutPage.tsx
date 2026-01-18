import React from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { StatItem } from "@/sitePages/AboutPage/components/StatItem";
import { TeamCard } from "@/sitePages/AboutPage/components/TeamCard";
import { WhatWeDoItem } from "@/sitePages/AboutPage/components/WhatWeDoItem";

const IconHouse = (props: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    aria-hidden="true"
  >
    <path d="M3 11.5L12 4l9 7.5" />
    <path d="M5 10.5V20h14v-9.5" />
    <path d="M9 20v-6h6v6" />
  </svg>
);

const IconPencil = (props: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    aria-hidden="true"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const IconCard = (props: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    aria-hidden="true"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
    <path d="M3 10h18" />
    <path d="M7 15h4" />
  </svg>
);

const IconPhone = (props: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.3 1.7.54 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.06a2 2 0 0 1 2.11-.45c.8.24 1.64.42 2.5.54A2 2 0 0 1 22 16.92Z" />
  </svg>
);

const IconTrophy = (props: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    aria-hidden="true"
  >
    <path d="M8 21h8" />
    <path d="M12 17v4" />
    <path d="M7 4h10v3a5 5 0 0 1-10 0V4Z" />
    <path d="M5 6H4a2 2 0 0 0 0 4h2" />
    <path d="M19 6h1a2 2 0 0 1 0 4h-2" />
  </svg>
);

export type AboutPageMediaProps = {
  heroImageSrc?: string;
  heroImageAlt?: string;
  houseWideImageSrc?: string;
  houseWideImageAlt?: string;
  teamImage1Src?: string;
  teamImage2Src?: string;
  teamImage3Src?: string;
  ctaHouseImageSrc?: string;
  ctaHouseImageAlt?: string;
};

export function AboutPage(props?: { media?: AboutPageMediaProps }) {
  const heroImageSrc = props?.media?.heroImageSrc || "/placeholders/about/hero.svg";
  const heroImageAlt = props?.media?.heroImageAlt || "About hero";
  const houseWideImageSrc = props?.media?.houseWideImageSrc || "/placeholders/about/house-wide.svg";
  const houseWideImageAlt = props?.media?.houseWideImageAlt || "Modern house";
  const teamImage1Src = props?.media?.teamImage1Src || "/placeholders/about/team-1.svg";
  const teamImage2Src = props?.media?.teamImage2Src || "/placeholders/about/team-2.svg";
  const teamImage3Src = props?.media?.teamImage3Src || "/placeholders/about/team-3.svg";
  const ctaHouseImageSrc = props?.media?.ctaHouseImageSrc || "/placeholders/about/cta-house.svg";
  const ctaHouseImageAlt = props?.media?.ctaHouseImageAlt || "Exterior";
  const valueEngineeredHousePlansSrc =
    "https://cdn.sanity.io/images/oz82ztaw/production/1bb8ec7881e1c2e251b21797f43d6a4ed777de51-1920x1920.heif?auto=format";

  return (
    <main className="w-full px-2 pt-4 pb-12 md:px-[62px]">
      <div className="mx-auto w-full max-w-[1600px]">
        <Reveal>
          <div className="text-[18px] font-semibold">
            <Link href="/" className="text-orange-600">
              Main
            </Link>
            <span className="px-2 text-neutral-400">/</span>
            <Link href="/about" className="text-neutral-700">
              About Us
            </Link>
          </div>
          <h1 className="mt-[50px] text-[46px] font-semibold leading-[54px] tracking-tight text-neutral-900">About Us</h1>
        </Reveal>

        <div className="mt-[50px] grid grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1fr] lg:items-start lg:gap-[40px]">
          <Reveal>
            <div className="relative w-[95%] overflow-hidden rounded-[32px] border border-neutral-200 bg-neutral-100 aspect-[5/4]">
              <img src={heroImageSrc} alt={heroImageAlt} className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </Reveal>

          <div className="space-y-0 lg:max-w-[720px]">
            <Reveal delayMs={20}>
              <div>
                <h2 className="text-[28px] font-semibold leading-[36px] tracking-tight text-neutral-900">
                  Turning Ideas into House Plans
                </h2>
                <p className="mt-4 max-w-[620px] text-[20px] leading-[30px] text-neutral-600">
                  We deliver designs crafted to the highest standards, with every detail carefully considered. From site plans
                  to custom layouts, we ensure your home is both functional and beautiful. We also make certain that every
                  project meets HOA requirements, so your vision comes to life seamlessly.
                </p>
              </div>
            </Reveal>

            <Reveal delayMs={60}>
              <div className="mt-12">
                <h3 className="text-[28px] font-semibold leading-[36px] tracking-tight">What we do</h3>
                <div className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-12">
                  <WhatWeDoItem index="01" title="Choose your design" lines={["Browse our collection", "of house plans"]} />
                  <WhatWeDoItem index="02" title="Customize with Ease" lines={["Collaborate directly", "with David"]} />
                  <WhatWeDoItem
                    index="03"
                    title="Receive Your Plans"
                    lines={["Receive your new set", "of personalized house plans"]}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-10">
          <div className="mx-auto max-w-[1200px] py-[72px]">
            <div className="grid grid-cols-1 gap-24 md:grid-cols-3 md:gap-[120px]">
              <Reveal>
                <StatItem value="30+" lines={["Years", "of experience"]} />
              </Reveal>
              <Reveal delayMs={40}>
                <StatItem value="5x" lines={["Cheaper than", "custom design"]} />
              </Reveal>
              <Reveal delayMs={80}>
                <StatItem value="10x" lines={["Faster than starting", "from scratch"]} />
              </Reveal>
            </div>
          </div>

          <Reveal delayMs={60}>
            <div className="mt-6 overflow-hidden rounded-[28px] border border-neutral-200 bg-neutral-100">
              <div className="relative">
                <img
                  src={houseWideImageSrc}
                  alt={houseWideImageAlt}
                  className="h-[260px] w-full object-cover md:h-[420px]"
                />

                <div className="absolute bottom-6 right-6">
                  <div className="origin-bottom-right scale-[1.5] rounded-[24px] border border-neutral-200 bg-white px-6 py-4 shadow-sm">
                    <div className="text-[18px] font-semibold leading-[22px] text-neutral-900">98% of clients rate</div>
                    <div className="text-[18px] font-semibold leading-[22px] text-neutral-900">their experience</div>
                    <div className="mt-3 flex items-center gap-1 text-orange-600">
                      <span className="text-[18px] leading-none">★</span>
                      <span className="text-[18px] leading-none">★</span>
                      <span className="text-[18px] leading-none">★</span>
                      <span className="text-[18px] leading-none">★</span>
                      <span className="text-[18px] leading-none">★</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-5">
            {[
              {
                icon: <IconHouse className="h-7 w-7 text-white" />,
                title: "All Homes\nDesigned by David",
                body: "For quality control, every home on this site is designed by David to meet these and other high standards.",
              },
              {
                icon: <IconPencil className="h-7 w-7 text-white" />,
                title: "Fast Turn-Around\nfor Modifications",
                body: "We guarantee that revisions to your plans will be completed in 10 days or less or your plans are free.",
              },
              {
                icon: <IconCard className="h-7 w-7 text-white" />,
                title: "Affordable\nHouse Plans",
                body: "It costs up to five times less than a fully custom design and giving you a way to get high-quality home plan for a lower price.",
              },
              {
                icon: <IconPhone className="h-7 w-7 text-white" />,
                title: "Reliable Support\nfrom Start to Finish",
                body: "We support you through the entire design process. Call or write anytime — we're always here for you.",
              },
              {
                icon: <IconTrophy className="h-7 w-7 text-white" />,
                title: "Award Winning\nHouse Plans",
                body: "David Watkins is an award-winning designer, and every home on this site is personally designed by him",
              },
            ].map((item, idx) => (
              <Reveal key={item.title} delayMs={idx * 40}>
                <div className="flex flex-col items-center text-center">
                  <div className="isolate flex h-14 w-14 items-center justify-center rounded-full bg-orange-600">
                    {item.icon}
                  </div>
                  <div className="mt-4 whitespace-pre-line text-[21px] font-semibold leading-[26px] text-neutral-900">
                    {item.title}
                  </div>
                  <div className="mt-3 text-[18px] leading-[26px] text-neutral-500">{item.body}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal>
          <section className="pt-[68px] pb-[20px]">
            <div className="w-full">
              <h2 className="text-[46px] font-semibold leading-[54px] tracking-tight text-neutral-900 mb-[38px]">
                Our Team
              </h2>
              <div className="grid grid-cols-3 gap-x-[26px]">
                <TeamCard imageSrc={teamImage1Src} name="Nino Gogichaishvili" role="Drafting" />
                <TeamCard imageSrc={teamImage2Src} name="David Watkins" role="Residential Designer" />
                <TeamCard imageSrc={teamImage3Src} name="Anastasia Shkarubo" role="Office Manager" />
              </div>
            </div>
          </section>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-[760px_605px] lg:items-start lg:justify-between">
          <div className="lg:pl-[68px]">
            <Reveal>
              <div>
                <h2 className="whitespace-nowrap text-[60px] font-bold leading-none text-neutral-900">
                  Eco-Friendly Floor Plans
                </h2>
                <div className="mt-2 text-[60px] font-light leading-none text-[#D0D0D0]">Designed for Sustainable Homes</div>
                <div className="mt-8 max-w-[685px] text-[19px] leading-[30px] font-normal text-neutral-700">
                  <p>The ratio of exterior wall to interior sq. ft. determines construction costs and energy efficiency.</p>
                  <p className="mt-6">
                    <span className="font-semibold">Exterior walls are expensive.</span> More linear ft of exterior walls =
                    more concrete, more siding, more insulation... It all adds up. Exterior walls also transfer heat and
                    cold. All of the floor plans on this site are designed to have the right balance between curb-appeal
                    and efficiency.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delayMs={80}>
            <div className="relative w-[605px] overflow-visible">
              <div className="aspect-square w-[605px] overflow-hidden rounded-[32px] border-[3px] border-orange-600 bg-white">
                <img
                  src={valueEngineeredHousePlansSrc}
                  alt="Value engineered house plans"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>

        <div id="eco-cta-spacer" className="h-10" aria-hidden="true" />

        <Reveal delayMs={60}>
          <div className="rounded-[32px] bg-neutral-100 p-6 md:p-[32px]">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[755px_1fr] lg:gap-[48px]">
              <div className="overflow-hidden rounded-[32px]">
                <img src={ctaHouseImageSrc} alt={ctaHouseImageAlt} className="h-[255px] w-full object-cover lg:w-[755px]" />
              </div>

              <div className="flex flex-col justify-center">
                <div className="text-[50px] font-bold leading-[56px] text-neutral-900">
                  Haven&apos;t found what you&apos;re looking for?
                </div>
                <div className="mt-4 text-[21px] leading-[30px] text-neutral-700">
                  No worries - David can design your home from scratch.{" "}
                  <Link href="/contact-us" className="text-orange-600">
                    Click Here
                  </Link>{" "}
                  to request a free estimate for custom design.
                </div>

                <div className="mt-8">
                  <Link
                    href="/contact-us"
                    className="inline-flex h-[50px] w-[215px] items-center justify-center gap-3 rounded-[25px] bg-orange-600 text-[14px] font-semibold text-white"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-[18px] w-[18px]"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.5 3.5c.4-.9 1.5-1.3 2.4-.9l1.6.7c.8.3 1.2 1.2 1 2l-.6 2.1c-.2.6-.7 1.1-1.3 1.2l-1.2.2c.9 1.9 2.4 3.4 4.3 4.3l.2-1.2c.1-.6.6-1.1 1.2-1.3l2.1-.6c.8-.2 1.7.2 2 .9l.7 1.6c.4.9 0 2-.9 2.4l-1.5.7c-.6.3-1.2.4-1.8.3-6.1-1.1-10.9-5.9-12-12-.1-.6 0-1.2.3-1.8l.7-1.5Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                    </svg>
                    CONTACT US
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}

export default AboutPage;
