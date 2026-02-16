"use client";

import { useMemo, useState } from "react";
import type { HomePageSlots } from "@/lib/homePage/types";
import { urlForImage } from "@/lib/sanity/image";
import { DesignFeatureCard } from "@/sections/DesignSecrets/components/DesignFeatureCard";

import iconFallback from "../../../assets/Final small icon images black svg/Icon plans-black.svg";

function safeSanityImageUrl(source: unknown): string | null {
  if (!source) return null;
  try {
    return urlForImage(source as any).width(256).height(256).fit("max").url();
  } catch {
    return null;
  }
}

export const DesignSecretsExtraRow = (props: { cms?: HomePageSlots }) => {
  const extra = useMemo(() => {
    const icon1 = safeSanityImageUrl(props.cms?.secretExtraIcon1);
    const icon2 = safeSanityImageUrl(props.cms?.secretExtraIcon2);
    const icon3 = safeSanityImageUrl(props.cms?.secretExtraIcon3);

    const anyMissing = !icon1 || !icon2 || !icon3;
    if (anyMissing && process.env.NODE_ENV !== "production") {
      console.warn(
        "[home] DesignSecrets extra icons are not fully set in Sanity (homePage.secretExtraIcon1/2/3). Using placeholders.",
      );
    }

    return [
      {
        iconUrl: icon1,
        title: props.cms?.secretExtraTitle1,
        body: props.cms?.secretExtraBody1,
      },
      {
        iconUrl: icon2,
        title: props.cms?.secretExtraTitle2,
        body: props.cms?.secretExtraBody2,
      },
      {
        iconUrl: icon3,
        title: props.cms?.secretExtraTitle3,
        body: props.cms?.secretExtraBody3,
      },
    ];
  }, [
    props.cms?.secretExtraIcon1,
    props.cms?.secretExtraIcon2,
    props.cms?.secretExtraIcon3,
    props.cms?.secretExtraTitle1,
    props.cms?.secretExtraTitle2,
    props.cms?.secretExtraTitle3,
    props.cms?.secretExtraBody1,
    props.cms?.secretExtraBody2,
    props.cms?.secretExtraBody3,
  ]);

  const hasExtra = extra.some(
    (item) =>
      Boolean((item.title ?? "").trim()) ||
      Boolean((item.body ?? "").trim()) ||
      Boolean(item.iconUrl),
  );
  const [expanded, setExpanded] = useState(false);

  if (!hasExtra && !expanded) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-[35.584px]">
      {!expanded && hasExtra && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="font-gilroy inline-flex items-center justify-center self-start h-11 w-full max-w-[230px] rounded-[35px] bg-[#FF5C02] px-8 py-2 text-[14px] font-semibold leading-5 uppercase tracking-[0.01em] tabular-nums text-white sm:h-12 sm:w-[230px] sm:px-10 sm:py-2.5 sm:text-[15px] sm:leading-6"
          style={{ fontVariantNumeric: "tabular-nums lining-nums" }}
        >
          SEE ALL
        </button>
      )}
      {expanded && (
        <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[35.584px] md:flex md:shrink-0 md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[35.584px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
          {extra.map((item, idx) => (
            <DesignFeatureCard
              key={idx}
              title={String(item.title ?? " ")}
              description={String(item.body ?? " ")}
              iconVariant=""
              iconUrl={item.iconUrl ?? ((iconFallback as any).src ?? (iconFallback as any))}
            />
          ))}
        </div>
      )}
    </div>
  );
};
