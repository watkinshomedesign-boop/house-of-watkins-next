"use client";

import { DetailItem } from "@/sections/ContentSection/components/DetailItem";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePlan } from "@/lib/planContext";
import { ImageLightbox } from "@/components/ImageLightbox";
import { PlanImage } from "@/components/media/PlanImage";
import { usePdp } from "@/lib/pdpState";
import { faqSections } from "@/content/faq";
import { useTypographyStyle } from "@/lib/typographyContext";
import { getTextStyleCss } from "@/lib/typography";

export const DetailsSection = () => {
  const plan = usePlan();
  const { tab } = usePdp();
  const overviewDescriptionStyle = useTypographyStyle("house.overview.description", "Body/15");

  const descriptionFull = String(plan.description || "").trim() || "Description coming soon.";
  const descriptionShort =
    descriptionFull.length > 500 ? `${descriptionFull.slice(0, 500).trimEnd()}…` : descriptionFull;

  useEffect(() => {
    if (tab !== "order") return;
    const el = document.getElementById("pdp-order-box");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [tab]);

  function resolvePublicImageUrl(pathOrUrl: string | null | undefined) {
    const s = String(pathOrUrl || "").trim();
    if (!s) return null;
    if (s.startsWith("http://") || s.startsWith("https://")) return s;
    if (s.startsWith("/")) return s;
    const base = String(process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
    if (!base) return null;
    return `${base}/storage/v1/object/public/${s.replace(/^\/+/, "")}`;
  }

  const includedSection = faqSections.find((s) => s.title === "What’s Included (and What’s Not)");
  const included = includedSection?.items.find((i) => i.question.includes("included"));

  const galleryTabImages = useMemo(() => {
    const gResolved = Array.isArray((plan as any).galleryImages) ? (((plan as any).galleryImages ?? []) as any[]) : [];
    const fpResolved = Array.isArray((plan as any).floorplanImages) ? (((plan as any).floorplanImages ?? []) as any[]) : [];
    const gLegacy = Array.isArray(plan.images?.gallery) ? (plan.images?.gallery ?? []) : [];
    const fpLegacy = Array.isArray(plan.images?.floorplan) ? (plan.images?.floorplan ?? []) : [];

    const resolvedPrimary = [...gResolved, ...fpResolved].map(resolvePublicImageUrl).filter(Boolean) as string[];
    const resolvedFallback = [...gLegacy, ...fpLegacy].map(resolvePublicImageUrl).filter(Boolean) as string[];
    const base = resolvedPrimary.length > 0 ? resolvedPrimary : resolvedFallback;
    return Array.from(new Set(base));
  }, [(plan as any).galleryImages, (plan as any).floorplanImages, plan.images?.gallery, plan.images?.floorplan]);

  const buildExteriorImageSrc =
    (plan as any).buildFeatureExteriorUrl || (plan as any).buildFeatureExterior || "/build/build-feature-exterior.jpg";
  const buildFloorplanImageSrc =
    (plan as any).buildFeatureFloorplanUrl || (plan as any).buildFeatureFloorplan || "/build/build-feature-floorplan.jpg";

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIdx, setGalleryIdx] = useState(0);

  function OverviewDivider() {
    return <div className="w-full border-t border-stone-200" />;
  }

  function OverviewSection(props: { title: string; rows: Array<{ label: string; value: ReactNode }> }) {
    return (
      <div className="w-full">
        <div className="text-[15px] font-semibold leading-[22px] text-[#2D2D2D] md:text-[23px] md:leading-[33px]">{props.title}</div>
        <div className="mt-4 space-y-3">
          {props.rows.map((r) => (
            <div key={r.label} className="flex items-center text-[13px] leading-[19px] md:text-[20px] md:leading-[29px]">
              <div className="shrink-0 font-normal text-[#9A9A9A]">{r.label}</div>
              <div className="mx-3 h-0 flex-1 border-b border-dotted border-stone-300" />
              <div className="shrink-0 font-semibold text-[#2D2D2D]">{r.value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (tab === "overview") {
    return (
      <div className="w-full">
        <div className="w-full">
          <div className="md:hidden">
            <div className="text-[13px] font-normal leading-[19px] text-[#9A9A9A]">Name of Project</div>
            <div className="mt-2 text-xl font-semibold leading-[30px] text-[#2D2D2D]">{plan.name}</div>
          </div>

          <div className="mt-6 text-[13px] font-normal leading-[19px] text-[#9A9A9A] md:hidden">Description</div>
          <div className="mt-2 max-w-[640px] text-[15px] font-normal leading-[22px] text-[#2D2D2D]">
            <span style={getTextStyleCss(overviewDescriptionStyle)}>{descriptionShort}</span>
          </div>
        </div>

        <div className="mt-8">
          <OverviewDivider />
        </div>

        <div className="mt-8">
          <OverviewSection
            title="Square Footage Breakdown"
            rows={[
              { label: "Total Heated Area", value: `${plan.heated_sqft.toLocaleString()} Sq Ft` },
              { label: "1st Floor", value: "30 Sq Ft" },
              { label: "Covered Patio", value: "92 Sq Ft" },
              { label: "Porch, Front", value: "42 Sq Ft" },
            ]}
          />
        </div>

        <div className="mt-8">
          <OverviewSection
            title="Beds/Baths"
            rows={[
              { label: "Bedrooms", value: String(plan.beds ?? "-") },
              { label: "Full bathrooms", value: String(plan.baths ?? "-") },
            ]}
          />
        </div>

        <div className="mt-8">
          <OverviewSection title="Exterior Walls" rows={[{ label: "Standard Type(s)", value: "2x6" }]} />
        </div>

        <div className="mt-8">
          <OverviewSection
            title="Garage"
            rows={[
              { label: "Type", value: "Attached" },
              { label: "Area", value: "446 sq. ft." },
              { label: "Count", value: "1" },
              { label: "Entry Location", value: "Front" },
            ]}
          />
        </div>

        <div className="mt-8">
          <OverviewSection
            title="Ceiling Heights"
            rows={[
              { label: "First Floor", value: "9 ft." },
              { label: "Living Room", value: "10' Vaulted" },
            ]}
          />
        </div>

        <div className="mt-8">
          <OverviewSection
            title="Roof Details"
            rows={[
              { label: "Primary Pitch", value: "4:12" },
              { label: "Framing Type", value: "Truss" },
            ]}
          />
        </div>
      </div>
    );
  }

  if (tab === "description") {
    return (
      <div className="w-full">
        <div className="w-full">
          <div className="text-[13px] font-normal leading-[19px] text-[#9A9A9A]">Description</div>
          <div className="mt-2 max-w-[640px] text-[15px] font-normal leading-[22px] text-[#2D2D2D]">
            <span style={getTextStyleCss(overviewDescriptionStyle)}>{descriptionFull}</span>
          </div>
        </div>

        <div className="mt-8">
          <div className="text-xl font-semibold leading-[30px] text-[#2D2D2D]">Key Features That Make It Feel Like Home</div>
          <ul className="mt-4 list-disc space-y-3 pl-6 text-[15px] font-normal leading-[22px] text-[#2D2D2D] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">
            <li>
              Spacious Living Area: The open floor plan ensures a seamless flow between the living room, dining area, and kitchen. It&#39;s perfect for everything from quiet nights in to lively get-togethers.
            </li>
            <li>
              Dream Kitchen: The kitchen is the crown jewel of this home. Featuring ample counter space, refined cabinetry, and room for culinary creativity, it inspires you to whip up anything from family dinners to weekend baking adventures.
            </li>
            <li>
              Elegant Vaulted Ceilings: With 9-foot ceilings and a stunning vaulted design, the main living space feels open, airy, and bathed in natural light.
            </li>
            <li>
              Relaxing Owner&#39;s Suite: The owner&#39;s suite is a private oasis, complete with a luxurious bathroom for those moments when you simply need to relax and recharge.
            </li>
            <li>
              Charming Outdoor Spaces: Step outside to an inviting back patio, perfect for coffee in the morning or barbecues in the evening. Pair this with a cozy front porch to complete the outdoor experience.
            </li>
            <li>
              Functional Garage: The 2-car front-load garage isn&#39;t just for parking; it&#39;s a versatile space ideal for hobbies, crafts, or additional storage.
            </li>
          </ul>
        </div>

        <div className="mt-8">
          <div className="text-xl font-semibold leading-[30px] text-[#2D2D2D]">Designed For Family Living</div>
          <div className="mt-4 text-[15px] font-normal leading-[22px] text-[#2D2D2D] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">
            The Mountain Retreat offers a harmonious balance of coziness and elegance, designed for families who cherish connection and convenience. Whether it&#39;s morning light streaming through the windows or evenings spent gathered around the table, this home is built for life&#39;s beautiful moments.
          </div>
        </div>

        <div className="mt-8">
          <div className="text-xl font-semibold leading-[30px] text-[#2D2D2D]">Start Your Journey Today</div>
          <div className="mt-4 text-[15px] font-normal leading-[22px] text-[#2D2D2D] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">
            {
              "Make it yours by tailoring the Mountain Retreat to fit your family's unique needs. Schedule a free screen-sharing session with a professional designer and customize this house plan in real time. Your dream home awaits—don't wait to begin your next chapter!"
            }
          </div>
        </div>
      </div>
    );
  }

  if (tab === "plans") {
    return (
      <div className="[align-items:normal] box-content caret-black gap-x-[normal] block flex-row min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[28.416px] md:flex md:flex-col md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[28.416px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <div className="[align-items:normal] box-content caret-black gap-x-[normal] block flex-row min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:gap-y-[28.416px]">
          <div className="text-black font-semibold box-content caret-black leading-[normal] outline-black text-wrap md:text-[32px] md:leading-[39.936px] md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              Included in All House Plans
            </p>
          </div>

          <div className="text-black font-bold box-content caret-black leading-[normal] outline-black text-wrap md:text-[19.968px] md:leading-[29.376px] md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">
            <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              All Drawings are on 24&quot; x 36&quot; Sheets, Delivered as PDF files via email
            </p>
          </div>

          <div className="[align-items:normal] box-content caret-black gap-x-[normal] block flex-row min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:gap-y-[17.792px]">
            <div className="text-stone-400 font-semibold box-content caret-black leading-[normal] outline-black text-wrap md:text-[19.968px] md:leading-[29.376px] md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                Cover Sheet
              </p>
            </div>
            <ul className="list-disc pl-10 md:pl-6">
              <li className="text-black md:text-[19.968px] md:leading-[29.376px] font-bold md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">3D Rendering</li>
              <li className="text-black md:text-[19.968px] md:leading-[29.376px] font-bold md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">Page Index</li>
              <li className="text-black md:text-[19.968px] md:leading-[29.376px] font-bold md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">Sq. Ft. Calculations</li>
            </ul>
          </div>

          <div className="[align-items:normal] box-content caret-black gap-x-[normal] block flex-row min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:gap-y-[17.792px]">
            <div className="text-stone-400 font-semibold box-content caret-black leading-[normal] outline-black text-wrap md:text-[19.968px] md:leading-[29.376px] md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                Floor Plans
              </p>
            </div>
            <ul className="list-disc pl-10 md:pl-6">
              <li className="text-black md:text-[19.968px] md:leading-[29.376px] font-bold md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">Depiction and locations of walls, windows, doors, fixtures and appliances</li>
              <li className="text-black md:text-[19.968px] md:leading-[29.376px] font-bold md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">Labeled rooms, flooring &amp; shape of ceilings</li>
              <li className="text-black md:text-[19.968px] md:leading-[29.376px] font-bold md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">Floor elevations (not relating to topography)</li>
              <li className="text-black md:text-[19.968px] md:leading-[29.376px] font-bold md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">Dimensions &amp; other annotation</li>
              <li className="text-black md:text-[19.968px] md:leading-[29.376px] font-bold md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">Door &amp; Window Schedules w/ notes</li>
            </ul>
          </div>

          <div className="[align-items:normal] box-content caret-black gap-x-[normal] block flex-row min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:gap-y-[17.792px]">
            <div className="text-stone-400 font-semibold box-content caret-black leading-[normal] outline-black text-wrap md:text-[19.968px] md:leading-[29.376px] md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                Elevations
              </p>
            </div>
            <ul className="list-disc pl-10 md:pl-6">
              <li className="text-black md:text-[19.968px] md:leading-[29.376px] font-bold md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">General illustration of door &amp; window styles</li>
              <li className="text-black md:text-[19.968px] md:leading-[29.376px] font-bold md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">General height of walls, window and door headers</li>
              <li className="text-black md:text-[19.968px] md:leading-[29.376px] font-bold md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">Depiction &amp; location of siding and a general representation of grading</li>
            </ul>
          </div>

          <div className="[align-items:normal] box-content caret-black gap-x-[normal] block flex-row min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:gap-y-[17.792px]">
            <div className="text-stone-400 font-semibold box-content caret-black leading-[normal] outline-black text-wrap md:text-[19.968px] md:leading-[29.376px] md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                Roof Plan
              </p>
            </div>
            <ul className="list-disc pl-10 md:pl-6">
              <li className="text-black md:text-[19.968px] md:leading-[29.376px] font-bold md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">Depiction and locations of all ridges, valleys, dormers &amp; eaves</li>
              <li className="text-black md:text-[19.968px] md:leading-[29.376px] font-bold md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">Roof pitch, appropriate annotation, and the Locations and general heights of wall plates.</li>
            </ul>
          </div>

          <div className="static box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]" />

          <div className="text-black font-semibold box-content caret-black leading-[normal] outline-black text-wrap md:text-[32px] md:leading-[39.936px] md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              Added By Request
            </p>
          </div>

          <div className="[align-items:normal] box-content caret-black gap-x-[normal] block flex-row min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:gap-y-[17.792px]">
            <div className="text-stone-400 font-semibold box-content caret-black leading-[normal] outline-black text-wrap md:text-[19.968px] md:leading-[29.376px] md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                Site Plan
              </p>
            </div>
            <ul className="list-disc pl-10 md:pl-6">
              <li className="text-black md:text-[19.968px] md:leading-[29.376px] font-bold md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">Site description (legal description, property line bearings, north arrow)</li>
              <li className="text-black md:text-[19.968px] md:leading-[29.376px] font-bold md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">Drawing of Site with proposed house</li>
              <li className="text-black md:text-[19.968px] md:leading-[29.376px] font-bold md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">Proposed concrete work (driveways, walkways, patios etc.), Area calculation</li>
              <li className="text-black md:text-[19.968px] md:leading-[29.376px] font-bold md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">Setbacks and easements</li>
            </ul>
          </div>

          <div className="[align-items:normal] box-content caret-black gap-x-[normal] block flex-row min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:gap-y-[17.792px]">
            <div className="text-stone-400 font-semibold box-content caret-black leading-[normal] outline-black text-wrap md:text-[19.968px] md:leading-[29.376px] md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                Extra Drawing
              </p>
            </div>
            <ul className="list-disc pl-10 md:pl-6">
              <li className="text-black md:text-[19.968px] md:leading-[29.376px] font-bold md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">
                Every county is different and may require something not included
                in a standard set of plans. We will make an extra drawing if needed.
                $65 per hour, not to exceed $500.
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (tab === "build") {
    return (
      <div className="[align-items:normal] box-content caret-black gap-x-[normal] block flex-row min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[28.416px] md:flex md:flex-col md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[28.416px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <div className="text-black font-semibold box-content caret-black leading-[normal] outline-black text-wrap md:text-[32px] md:leading-[39.936px] md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            Key Features to Look For
          </p>
        </div>

        <div className="text-black font-normal box-content caret-black leading-[normal] outline-black text-wrap md:text-[19.968px] md:leading-[29.376px] md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-wrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">
          <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-wrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            The ratio of exterior wall to interior sq. ft. determines construction costs and energy efficiency. Exterior walls are expensive. More linear ft of exterior walls = more concrete, more siding, more insulation... It all adds up. Exterior walls also transfer heat and cold. All of the floor plans on this site are designed to have the right balance between curb-appeal and efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-[17.792px]">
          <div className="bg-white border border-stone-200 rounded-[24px] p-4">
            <PlanImage
              src={buildExteriorImageSrc}
              alt="Exterior upper level stacking over lower level"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="rounded-[16px]"
            />
            <p className="mt-3 text-black md:text-[16px] md:leading-[24px] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">© House of Watkins, LLC</p>
          </div>
          <div className="bg-white border border-stone-200 rounded-[24px] p-4">
            <PlanImage
              src={buildFloorplanImageSrc}
              alt="Annotated floor plan diagram"
              sizes="(min-width: 768px) 50vw, 100vw"
              className="rounded-[16px]"
            />
            <p className="mt-3 text-black md:text-[16px] md:leading-[24px] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">© House of Watkins, LLC</p>
          </div>
        </div>

        <div className="border border-orange-500 rounded-[24px] p-6">
          <div className="text-black font-semibold md:text-[19.968px] md:leading-[29.376px]">Pro Tip</div>
          <div className="mt-2 text-black font-bold md:text-[19.968px] md:leading-[29.376px] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">
            {"Choose Your Plan Based on the Layout. How Many Bedrooms, How Many Stories, Where the Views are. That's all for now. We Can Modify the Rest."}
          </div>
        </div>
      </div>
    );
  }

  if (tab === "gallery") {
    return (
      <div className="w-full space-y-6">
        <ImageLightbox
          open={galleryOpen}
          images={galleryTabImages}
          index={galleryIdx}
          onClose={() => setGalleryOpen(false)}
          onIndexChange={setGalleryIdx}
        />
        <div className="text-black font-semibold md:text-[32px] md:leading-[39.936px]">Gallery</div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-2 md:gap-2">
          {galleryTabImages.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              className="block w-full overflow-hidden rounded-xl"
              onClick={() => {
                setGalleryIdx(i);
                setGalleryOpen(true);
              }}
              aria-label="Open image"
            >
              <PlanImage src={src} alt="" sizes="(min-width: 768px) 33vw, 50vw" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (tab === "order") {
    return (
      <div className="[align-items:normal] box-content caret-black gap-x-[normal] block flex-row min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[28.416px] md:flex md:flex-col md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[28.416px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <div className="text-black font-semibold box-content caret-black leading-[normal] outline-black text-wrap md:text-[32px] md:leading-[39.936px] md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            Included in a Purchase
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:gap-x-[42px] md:gap-y-[24px]">
          <div>
            <div className="text-stone-400 font-semibold md:text-[16px] md:leading-[24px]">Consulting</div>
            <div className="text-black font-bold md:text-[16px] md:leading-[24px] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">1 hour</div>
          </div>
          <div>
            <div className="text-stone-400 font-semibold md:text-[16px] md:leading-[24px]">General Specifications</div>
            <div className="text-black font-bold md:text-[16px] md:leading-[24px] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">1 psc</div>
          </div>
        </div>

        <div className="[align-items:normal] box-content caret-black gap-x-[normal] block flex-row min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:items-start md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:gap-y-[24px]">
          <div>
            <div className="text-stone-400 font-semibold md:text-[16px] md:leading-[24px]">Floor Plan</div>
            <div className="text-black font-bold md:text-[16px] md:leading-[24px] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">
              Depiction and locations
              <br />
              of walls, windows, doors, fixtures and appliances, Labeled rooms, Dimensions, Door &amp; Window
              <br />
              Schedules w/ notes
            </div>
          </div>

          <div>
            <div className="text-stone-400 font-semibold md:text-[16px] md:leading-[24px]">Roof Plan</div>
            <div className="text-black font-bold md:text-[16px] md:leading-[24px] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">
              Dimensioned roof layout indicating slopes, roof areas and decorative elements
            </div>
          </div>

          <div>
            <div className="text-stone-400 font-semibold md:text-[16px] md:leading-[24px]">Typical Sections</div>
            <div className="text-black font-bold md:text-[16px] md:leading-[24px] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">
              Cut through the building showing detailed floor, wall, and roof construction elements with
              <br />
              specifications
            </div>
          </div>

          <div>
            <div className="text-stone-400 font-semibold md:text-[16px] md:leading-[24px]">Elevations</div>
            <div className="text-black font-bold md:text-[16px] md:leading-[24px] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">
              Shows all sides of the house indicating building elements, specifications and all decorative
              <br />
              elements
            </div>
          </div>

          <div>
            <div className="text-stone-400 font-semibold md:text-[16px] md:leading-[24px]">Door and Window Schedule</div>
            <div className="text-black font-bold md:text-[16px] md:leading-[24px] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">
              List of all doors and windows with indicated specifications for manufacturer
            </div>
          </div>
        </div>

        <div className="static box-content caret-black shrink h-auto min-h-0 min-w-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:shrink-0 md:h-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]" />

        <div className="text-black font-semibold box-content caret-black leading-[normal] outline-black text-wrap md:text-[32px] md:leading-[39.936px] md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            Additional Services
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-8 md:gap-x-[42px] md:gap-y-[24px]">
          <div>
            <div className="text-stone-400 font-semibold md:text-[16px] md:leading-[24px]">Consulting &amp; Meeting</div>
            <div className="text-black font-bold md:text-[16px] md:leading-[24px] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">
              $125 per hr
              <br />
              (beyond first hr)
            </div>
          </div>

          <div>
            <div className="text-stone-400 font-semibold md:text-[16px] md:leading-[24px]">Site Plan</div>
            <div className="text-black font-bold md:text-[16px] md:leading-[24px] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">$399</div>
          </div>

          <div>
            <div className="text-stone-400 font-semibold md:text-[16px] md:leading-[24px]">3D Renderings</div>
            <div className="text-black font-bold md:text-[16px] md:leading-[24px] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">
              Price varies
              <br />
              (free estimate)
            </div>
          </div>

          <div>
            <div className="text-stone-400 font-semibold md:text-[16px] md:leading-[24px]">Modify Plans</div>
            <a
              href="#plan-change-definitions"
              className="text-orange-500 font-bold md:text-[16px] md:leading-[24px]"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("plan-change-definitions");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Click Here for Pricing
            </a>
          </div>

          <div>
            <div className="text-stone-400 font-semibold md:text-[16px] md:leading-[24px]">Electrical Plan</div>
            <div className="text-black font-bold md:text-[16px] md:leading-[24px] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">15 cents per sq. ft.</div>
          </div>

          <div>
            <div className="text-stone-400 font-semibold md:text-[16px] md:leading-[24px]">Furniture Placement</div>
            <div className="text-black font-bold md:text-[16px] md:leading-[24px] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">15 cents per sq. ft.</div>
          </div>
        </div>

        <div>
          <div className="text-stone-400 font-semibold md:text-[16px] md:leading-[24px]">Special Requests</div>
          <div className="text-black font-bold md:text-[16px] md:leading-[24px] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">$65 per hour (not to exceed $500. (free estimate)</div>
          <div className="mt-2 text-black font-bold md:text-[16px] md:leading-[24px] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">
            For Example, if your local building department or HOA requires a special drawing
          </div>
        </div>

        <div>
          <button
            type="button"
            className="mt-4 inline-flex items-center justify-center rounded-full border border-orange-500 px-8 py-3 text-black font-semibold"
          >
            MEET WITH DAVID
          </button>
        </div>

        <div id="plan-change-definitions" className="mt-10">
          <div className="text-black font-semibold box-content caret-black leading-[normal] outline-black text-wrap md:text-[32px] md:leading-[39.936px] md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <p className="box-content caret-black leading-[normal] outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              Plan Change Definitions
            </p>
          </div>

          <div className="mt-6 space-y-4 rounded-[24px] border border-stone-200 bg-white p-6">
            <div>
              <div className="text-stone-400 font-semibold md:text-[16px] md:leading-[24px]">Small Adjustments</div>
              <div className="text-black font-bold md:text-[16px] md:leading-[24px] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">
                Minor edits to a plan without changing the overall footprint.
              </div>
            </div>
            <div>
              <div className="text-stone-400 font-semibold md:text-[16px] md:leading-[24px]">Minor Changes</div>
              <div className="text-black font-bold md:text-[16px] md:leading-[24px] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">
                Moderate modifications such as moving/adjusting interior elements.
              </div>
            </div>
            <div>
              <div className="text-stone-400 font-semibold md:text-[16px] md:leading-[24px]">Additions</div>
              <div className="text-black font-bold md:text-[16px] md:leading-[24px] md:text-[15px] md:leading-[22px] md:font-normal md:text-[#2D2D2D]">
                Adding new space or rooms that meaningfully changes the plan layout.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
