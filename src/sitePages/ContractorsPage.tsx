import Link from "next/link";

import type { Plan } from "@/lib/plans";
import { HouseGrid } from "@/sections/HouseGrid";
import { BuilderPartnerCta } from "@/components/contractors/BuilderPartnerCta";
import { ContractorsVideo } from "@/components/contractors/ContractorsVideo.client";
import { urlForImage } from "@/lib/sanity/image";

export type ContractorsPageMediaProps = {
  provideImage03Src?: string;
  provideImage03Alt?: string;
  provideImage06Src?: string;
  provideImage06Alt?: string;
  provideImage09Src?: string;
  provideImage09Alt?: string;
  featureIconSrc?: string;
  featureIconAlt?: string;
  videoPosterSrc?: string;
  videoPosterAlt?: string;
};

type ContractorsPageProps = {
  plans: Plan[];
  trendingPlans?: Plan[];
  media?: ContractorsPageMediaProps;
};

export function ContractorsPage(props: ContractorsPageProps) {
  const trending = (props.trendingPlans && props.trendingPlans.length > 0
    ? props.trendingPlans
    : props.plans
  ).slice(0, 6);

  const provideImage03Src = props.media?.provideImage03Src || "/build/residential-floor-plan-design.jpg";
  const provideImage03Alt = props.media?.provideImage03Alt || "";
  const provideImage06Src = props.media?.provideImage06Src || "/placeholders/product-1.jpg";
  const provideImage06Alt = props.media?.provideImage06Alt || "";
  const provideImage09Src = props.media?.provideImage09Src || "/build/Not-So-Big-House-Plans-Design-Principles.jpg";
  const provideImage09Alt = props.media?.provideImage09Alt || "";
  const featureIconSrc = props.media?.featureIconSrc || "/placeholders/icon-15.svg";
  const featureIconAlt = props.media?.featureIconAlt || "";
  const videoPosterSrc = props.media?.videoPosterSrc || "/placeholders/product-1.jpg";

  function imageUrl(source: unknown): string | undefined {
    if (!source) return undefined;
    if (typeof source === "string") return source;
    try {
      return urlForImage(source as any).width(1600).fit("max").url();
    } catch {
      return undefined;
    }
  }

  const whatWeProvideCards = [
    {
      key: "01",
      title: "All Homes Designed by David",
      description: "For consistency and quality control, every home on this site is designed by David.",
      className: "md:col-start-1 md:row-start-1 md:row-span-2",
    },
    {
      key: "02",
      title: "Stress-Free Revisions",
      description: "Clear revision process designed to reduce RFIs and keep projects moving.",
      className: "md:col-start-2 md:row-start-1 md:row-span-2",
    },
    {
      key: "03",
      title: "",
      description: "",
      image: provideImage03Src,
      imageAlt: provideImage03Alt,
      className: "md:col-start-3 md:row-start-1 md:row-span-4",
    },
    {
      key: "04",
      title: "Site Plan",
      description: "Right-sized documentation to support permitting and construction planning.",
      className: "md:col-start-1 md:row-start-3 md:row-span-2",
    },
    {
      key: "05",
      title: "HQA",
      description: "Premium presentation and documentation standards that elevate your client experience.",
      className: "md:col-start-2 md:row-start-3 md:row-span-2",
    },
    {
      key: "06",
      title: "",
      description: "",
      image: provideImage06Src,
      imageAlt: provideImage06Alt,
      className: "md:col-start-1 md:row-start-5 md:row-span-4",
    },
    {
      key: "07",
      title: "Design Support",
      description: "We support you through the entire design process—fast answers, clear next steps.",
      className: "md:col-start-2 md:row-start-5 md:row-span-2",
    },
    {
      key: "08",
      title: "Guarantee",
      description: "Revisions delivered quickly with consistent communication throughout.",
      className: "md:col-start-2 md:row-start-7 md:row-span-2",
    },
    {
      key: "09",
      title: "",
      description: "",
      image: provideImage09Src,
      imageAlt: provideImage09Alt,
      className: "md:col-start-3 md:row-start-5 md:row-span-4",
    },
  ] as const;

  const keyFeatures = [
    { key: "01", label: "Pinterest Designs" },
    { key: "02", label: "CAD-Ready Designs" },
    { key: "03", label: "Time-Saving Collaboration" },
    { key: "04", label: "Stress-Free Experience" },
  ] as const;

  const videoUrl: string | null = null;
  const videoPosterUrl: string | null = videoPosterSrc;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 md:py-14">
      <div className="text-xs tracking-[0.24em] text-neutral-500 md:text-[18px] md:font-semibold md:tracking-normal">
        <Link href="/" className="md:text-orange-600">
          MAIN
        </Link>
        <span className="mx-2 md:text-neutral-400">/</span>
        <Link href="/contractors" className="md:text-neutral-700">
          CONTRACTORS
        </Link>
      </div>

      <div className="mt-5 flex flex-col gap-6 md:mt-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Contractors</h1>
          <p className="mt-3 max-w-[640px] text-base text-neutral-600">
            For builders/GCs who want premium plans, fewer RFIs, and faster client decisions.
          </p>
        </div>
        <div className="shrink-0 md:pt-1">
          <BuilderPartnerCta />
        </div>
      </div>

      <div className="mt-14 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Ready to partner?</h2>
            <p className="mt-3 text-sm text-neutral-600">
              Get your builder code and start sharing it with clients today.
            </p>
          </div>
          <BuilderPartnerCta variant="primary" />
        </div>
      </div>

      <div className="mt-12 md:mt-14">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">What we provide</h2>
          <p className="mt-3 max-w-[680px] text-sm text-neutral-600">
            Built for builders/GCs who want fewer RFIs, clearer expectations, and faster decisions.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[132px]">
          {whatWeProvideCards.map((c) => {
            const img = imageUrl((c as any).image);

            return (
              <div
                key={c.key}
                className={`group relative overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50 shadow-sm ${
                  (c as any).className ?? ""
                }`}
              >
                {img ? (
                  <img
                    src={img}
                    alt={String((c as any).imageAlt || "")}
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                  />
                ) : null}

                <div
                  className={
                    img
                      ? "relative flex h-full flex-col justify-end bg-black/10 p-5"
                      : "relative flex h-full flex-col justify-between p-5"
                  }
                >
                  <div className="text-xs font-semibold tracking-[0.2em] text-neutral-500">{c.key}</div>
                  {c.title ? (
                    <div className="mt-2">
                      <div className={img ? "text-sm font-semibold text-white" : "text-sm font-semibold text-neutral-900"}>
                        {c.title}
                      </div>
                      {c.description ? (
                        <div className={img ? "mt-1 text-sm text-white/90" : "mt-1 text-sm text-neutral-600"}>
                          {c.description}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 md:mt-14">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {keyFeatures.map((f) => (
            <div key={f.key} className="flex flex-col items-center text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-[#FFEFEB] text-[#FF5C02]">
                <img src={featureIconSrc} alt={featureIconAlt} className="h-5 w-5" draggable={false} />
              </div>
              <div className="mt-3 text-sm font-semibold text-neutral-900">{f.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 md:mt-14">
        <ContractorsVideo url={videoUrl} posterUrl={videoPosterUrl} />
      </div>

      <div className="mt-12 md:mt-14">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Turning ideas into house plans</h2>
          <p className="mt-3 max-w-[720px] text-sm text-neutral-600">
            A streamlined process designed for builders: choose a design, tailor it to the project, and get build-ready plans.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="text-xs font-semibold tracking-[0.2em] text-neutral-500">01</div>
            <div className="mt-3 text-lg font-semibold tracking-tight">Choose your design</div>
            <div className="mt-2 text-sm text-neutral-600">Select a proven plan that aligns with your scope, budget, and timeline.</div>
          </div>
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="text-xs font-semibold tracking-[0.2em] text-neutral-500">02</div>
            <div className="mt-3 text-lg font-semibold tracking-tight">Customize with ease</div>
            <div className="mt-2 text-sm text-neutral-600">Request revisions with clear inputs and a predictable turnaround.</div>
          </div>
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="text-xs font-semibold tracking-[0.2em] text-neutral-500">03</div>
            <div className="mt-3 text-lg font-semibold tracking-tight">Receive your plans</div>
            <div className="mt-2 text-sm text-neutral-600">Get a build-ready set that supports permitting and field execution.</div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:mt-10 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-semibold tracking-[0.24em] text-orange-600">BUILDER PARTNER PROGRAM</div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Builder Partner Program: 15% Off + Builder Pack
            </h2>
            <p className="mt-3 text-sm text-neutral-600">
              15% off all plans with your unique code, plus free mirrored set, 50% off CAD files, and priority support.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <BuilderPartnerCta variant="primary" />
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="group rounded-2xl border border-neutral-200 bg-neutral-50 p-5 transition-shadow duration-200 ease-out hover:shadow-md">
            <div className="text-sm font-semibold">15% off all plans</div>
            <div className="mt-1 text-sm text-neutral-600">Unique code you can share with clients.</div>
          </div>
          <div className="group rounded-2xl border border-neutral-200 bg-neutral-50 p-5 transition-shadow duration-200 ease-out hover:shadow-md">
            <div className="text-sm font-semibold">Builder Pack</div>
            <div className="mt-1 text-sm text-neutral-600">Free mirrored set + 50% off CAD files + priority support.</div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3 text-sm text-neutral-700 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="text-xs font-semibold tracking-[0.2em] text-neutral-500">STEP 1</div>
            <div className="mt-2 font-medium">Create a builder account</div>
            <div className="mt-1 text-neutral-600">Name + email + company</div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="text-xs font-semibold tracking-[0.2em] text-neutral-500">STEP 2</div>
            <div className="mt-2 font-medium">Get your unique code</div>
            <div className="mt-1 text-neutral-600">BUILDER-XXXX</div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-4">
            <div className="text-xs font-semibold tracking-[0.2em] text-neutral-500">STEP 3</div>
            <div className="mt-2 font-medium">Share with clients</div>
            <div className="mt-1 text-neutral-600">Or use it at checkout</div>
          </div>
        </div>
      </div>

      <div className="mt-12 md:mt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Trending Now</h2>
            <p className="mt-3 text-sm text-neutral-600">Popular plans builders are looking at this week.</p>
          </div>
          <Link href="/catalog" className="text-sm font-semibold text-orange-600 underline">
            View all
          </Link>
        </div>

        <div className="mt-6">
          <HouseGrid plans={trending} desktopCols={3} />
        </div>
      </div>
    </main>
  );
}

function ContractorsPageRouteStub() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Contractors</h1>
      <p className="mt-4 text-sm text-neutral-600">This route is not configured.</p>
    </main>
  );
}

export default ContractorsPageRouteStub;
