"use client";

import Link from "next/link";
import { useMemo } from "react";

import type { AboutPageMediaProps } from "@/sitePages/AboutPage";
import { MobileFooter } from "@/sitePages/home/mobile/MobileFooter";

import iconHouse from "../../assets/Final small icon images black svg/Icon house-black.svg";
import iconTools from "../../assets/Final small icon images black svg/Icon tools-black.svg";
import iconPlans from "../../assets/Final small icon images black svg/Icon plans-black.svg";
import iconTime from "../../assets/Final small icon images black svg/Icon time-black.svg";
import iconBuilder from "../../assets/Final small icon images black svg/Icon builder-black.svg";
import iconBox from "../../assets/Final small icon images black svg/Icon box-black.svg";
import iconPhone from "../../assets/Final small icon images black svg/Icon phone-black.svg";
import iconFilledStar from "../../assets/Final small icon images black svg/Icon filled star-black.svg";

function imgSrc(mod: unknown): string {
  return (mod as any)?.src ?? (mod as any);
}

export function AboutPageMobile(props?: { media?: AboutPageMediaProps }) {
  const heroImageSrc = props?.media?.heroImageSrc || "/placeholders/about/hero.svg";
  const heroImageAlt = props?.media?.heroImageAlt || "About hero";
  const houseWideImageSrc = props?.media?.houseWideImageSrc || "/placeholders/about/house-wide.svg";
  const houseWideImageAlt = props?.media?.houseWideImageAlt || "Modern house";
  const teamImage1Src = props?.media?.teamImage1Src || "/placeholders/about/team-1.svg";
  const teamImage2Src = props?.media?.teamImage2Src || "/placeholders/about/team-2.svg";
  const teamImage3Src = props?.media?.teamImage3Src || "/placeholders/about/team-3.svg";
  const ctaHouseImageSrc = props?.media?.ctaHouseImageSrc || "/placeholders/about/cta-house.svg";
  const ctaHouseImageAlt = props?.media?.ctaHouseImageAlt || "Exterior";

  const ecoImageSrc =
    "https://cdn.sanity.io/images/oz82ztaw/production/1bb8ec7881e1c2e251b21797f43d6a4ed777de51-1920x1920.heif?auto=format";

  const whatWeDo = useMemo(
    () => [
      {
        idx: "01",
        icon: imgSrc(iconHouse),
        title: "Choose your design",
        body: "Browse our collection of house plans",
      },
      {
        idx: "02",
        icon: imgSrc(iconTools),
        title: "Customize with ease",
        body: "Collaborate directly with David",
      },
      {
        idx: "03",
        icon: imgSrc(iconPlans),
        title: "Receive your plans",
        body: "Get your personalized set of plans",
      },
    ],
    [],
  );

  const valueProps = useMemo(
    () => [
      {
        icon: imgSrc(iconBuilder),
        title: "All homes designed by David",
        body: "Every home is personally designed by David to meet high standards.",
      },
      {
        icon: imgSrc(iconTime),
        title: "Fast turn-around for modifications",
        body: "Revisions are completed in 10 days or less or your plans are free.",
      },
      {
        icon: imgSrc(iconBox),
        title: "Affordable house plans",
        body: "Up to 5x cheaper than fully custom design.",
      },
      {
        icon: imgSrc(iconPhone),
        title: "Reliable support",
        body: "Call or write anytime — we’re here for you from start to finish.",
      },
      {
        icon: imgSrc(iconFilledStar),
        title: "Award winning house plans",
        body: "Award-winning designer and proven process.",
      },
    ],
    [],
  );

  const team = useMemo(
    () => [
      {
        imageSrc: teamImage1Src,
        name: "Nino Gogichaishvili",
        role: "Drafting",
      },
      {
        imageSrc: teamImage2Src,
        name: "David Watkins",
        role: "Residential Designer",
      },
      {
        imageSrc: teamImage3Src,
        name: "Anastasia Shkarubo",
        role: "Office Manager",
      },
    ],
    [teamImage1Src, teamImage2Src, teamImage3Src],
  );

  return (
    <main className="bg-white text-zinc-800">
      <div className="px-4 pt-4">
        <div className="text-[32px] leading-[36px] font-semibold">About Us</div>

        <div className="mt-4 overflow-hidden rounded-[20px] border border-neutral-200 bg-neutral-100">
          <img src={heroImageSrc} alt={heroImageAlt} className="h-[220px] w-full object-cover" draggable={false} />
        </div>

        <section className="mt-6">
          <div className="text-[20px] leading-[26px] font-semibold">Turning Ideas into House Plans</div>
          <div className="mt-3 text-[14px] leading-[20px] text-neutral-700">
            We deliver designs crafted to the highest standards, with every detail carefully considered. From site plans to
            custom layouts, we ensure your home is both functional and beautiful. We also make certain that every project
            meets HOA requirements, so your vision comes to life seamlessly.
          </div>
        </section>

        <section className="mt-8">
          <div className="text-[16px] tracking-[0.12em] text-neutral-500 font-semibold">WHAT WE DO</div>

          <div className="mt-4 flex flex-col gap-4">
            {whatWeDo.map((item) => (
              <div key={item.idx} className="rounded-[18px] border border-neutral-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-[2px] h-[22px] w-[22px] shrink-0">
                    <img src={item.icon} alt="" className="h-full w-full" aria-hidden="true" draggable={false} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <div className="text-[12px] font-semibold text-orange-600">{item.idx}</div>
                      <div className="text-[16px] leading-[20px] font-semibold text-neutral-900">{item.title}</div>
                    </div>
                    <div className="mt-2 text-[13px] leading-[18px] text-neutral-600">{item.body}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="flex flex-col gap-3">
            {[
              { value: "30+", label: "years experience" },
              { value: "5X", label: "cost savings" },
              { value: "10X", label: "faster turnaround" },
            ].map((s) => (
              <div key={s.value} className="rounded-[18px] border border-neutral-200 bg-white px-4 py-4">
                <div className="text-[28px] leading-[30px] font-semibold text-neutral-900">{s.value}</div>
                <div className="mt-1 text-[13px] leading-[18px] text-neutral-600">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="relative overflow-hidden rounded-[20px] border border-neutral-200 bg-neutral-100">
            <img src={houseWideImageSrc} alt={houseWideImageAlt} className="h-[220px] w-full object-cover" draggable={false} />

            <div className="absolute bottom-3 right-3">
              <div className="rounded-[16px] border border-neutral-200 bg-white px-4 py-3 shadow-sm">
                <div className="text-[12px] leading-[16px] font-semibold text-neutral-900">98% of clients rate</div>
                <div className="text-[12px] leading-[16px] font-semibold text-neutral-900">their experience</div>
                <div className="mt-2 flex items-center gap-1 text-orange-600">
                  <span className="text-[12px] leading-none">★</span>
                  <span className="text-[12px] leading-none">★</span>
                  <span className="text-[12px] leading-none">★</span>
                  <span className="text-[12px] leading-none">★</span>
                  <span className="text-[12px] leading-none">★</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex flex-col gap-4">
            {valueProps.map((item) => (
              <div key={item.title} className="rounded-[18px] border border-neutral-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-[2px] h-[22px] w-[22px] shrink-0">
                    <img src={item.icon} alt="" className="h-full w-full" aria-hidden="true" draggable={false} />
                  </div>

                  <div className="min-w-0">
                    <div className="text-[15px] leading-[20px] font-semibold text-neutral-900">{item.title}</div>
                    <div className="mt-2 text-[13px] leading-[18px] text-neutral-600">{item.body}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="text-[22px] leading-[28px] font-semibold text-neutral-900">Our Team</div>

          <div className="mt-4 flex flex-col gap-4">
            {team.map((person) => (
              <div key={person.name} className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white">
                <div className="h-[220px] w-full bg-neutral-100">
                  <img src={person.imageSrc} alt={person.name} className="h-full w-full object-cover object-top" draggable={false} />
                </div>
                <div className="px-4 py-4">
                  <div className="text-[16px] leading-[20px] font-semibold text-neutral-900">{person.name}</div>
                  <div className="mt-1 text-[13px] leading-[18px] text-neutral-600">{person.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="text-[22px] leading-[28px] font-semibold text-neutral-900">Eco-Friendly Floor Plans</div>
          <div className="mt-1 text-[14px] leading-[18px] text-neutral-400">Designed for Sustainable Homes</div>

          <div className="mt-4 text-[14px] leading-[20px] text-neutral-700">
            <p>The ratio of exterior wall to interior sq. ft. determines construction costs and energy efficiency.</p>
            <p className="mt-4">
              <span className="font-semibold">Exterior walls are expensive.</span> More exterior wall length means more
              concrete, siding, and insulation. Exterior walls also transfer heat and cold.
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <div className="w-[280px] overflow-hidden rounded-[20px] border-2 border-orange-600 bg-white aspect-square">
              <img src={ecoImageSrc} alt="Eco-friendly diagram" className="h-full w-full object-cover" draggable={false} />
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="rounded-[22px] bg-neutral-100 p-4">
            <div className="overflow-hidden rounded-[20px] bg-neutral-200">
              <img src={ctaHouseImageSrc} alt={ctaHouseImageAlt} className="h-[180px] w-full object-cover" draggable={false} />
            </div>

            <div className="mt-4 text-[20px] leading-[26px] font-semibold text-neutral-900">
              Haven&apos;t found what you&apos;re looking for?
            </div>
            <div className="mt-2 text-[14px] leading-[20px] text-neutral-700">
              No worries — David can design your home from scratch. Click below to request a free estimate for custom
              design.
            </div>

            <div className="mt-4">
              <Link
                href="/contact-us"
                className="inline-flex h-[48px] w-full items-center justify-center rounded-full bg-orange-600 text-[14px] font-semibold text-white"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

      </div>

      <div className="mt-10">
        <MobileFooter />
      </div>
    </main>
  );
}

export default AboutPageMobile;
