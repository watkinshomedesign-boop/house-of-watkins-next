"use client";

import type { HomePageSlots } from "@/lib/homePage/types";
import { urlForImage } from "@/lib/sanity/image";
import { useMemo, useState } from "react";

type MobileSecret = {
  iconUrl?: string | null;
  title: string;
  description: string;
};

function safeSanityImageUrl(source: unknown): string | null {
  if (!source) return null;
  try {
    return urlForImage(source as any).width(256).height(256).fit("max").url();
  } catch {
    return null;
  }
}

function SecretCard(props: MobileSecret) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-50">
          {props.iconUrl ? (
            <img src={props.iconUrl} alt="" className="h-full w-full object-cover" draggable={false} />
          ) : null}
        </div>
        <div className="min-w-0">
          <div className="text-[18px] leading-[22px] font-semibold text-neutral-900">{props.title}</div>
          <div className="mt-2 text-[14px] leading-[20px] text-neutral-700">{props.description}</div>
        </div>
      </div>
    </div>
  );
}

export function MobileDesignSecrets(props: { cms?: HomePageSlots }) {
  const [expanded, setExpanded] = useState(false);

  const base: MobileSecret[] = useMemo(
    () => [
      {
        iconUrl: "https://moss-nix-41841216.figma.site/_assets/v11/01223538f912e7d8fcb5b1616d09dc9db29d0a9e.png",
        title: "Sunlight",
        description:
          "Place the right amount of sunlight in the right places at the right times. In the US, sunlight generally comes from the South. We can help make sure your home places the right amount of sunlight in the right places at the right times.",
      },
      {
        iconUrl: "https://moss-nix-41841216.figma.site/_assets/v11/a42fc11823e004e9109fa0400f993ea576df8883.png",
        title: "Your Style",
        description:
          "Your home's personality should match your style. in other words, your home needs you. In a sense, we’re designing your future (and dare we say, who you want to be).",
      },
      {
        iconUrl: "https://moss-nix-41841216.figma.site/_assets/v11/d64ac08d1895665d66f978a77c4f2c8a563d5e3c.png",
        title: "Positive Space",
        description: "Primal instinct is still with us. If we can see every corner in the room, we feel safe.",
      },
    ],
    [],
  );

  const extra: MobileSecret[] = useMemo(() => {
    const items: MobileSecret[] = [];

    const icon1 = safeSanityImageUrl(props.cms?.secretExtraIcon1);
    const icon2 = safeSanityImageUrl(props.cms?.secretExtraIcon2);
    const icon3 = safeSanityImageUrl(props.cms?.secretExtraIcon3);

    if (icon1 || props.cms?.secretExtraTitle1 || props.cms?.secretExtraBody1) {
      items.push({
        iconUrl: icon1,
        title: String(props.cms?.secretExtraTitle1 ?? ""),
        description: String(props.cms?.secretExtraBody1 ?? ""),
      });
    }

    if (icon2 || props.cms?.secretExtraTitle2 || props.cms?.secretExtraBody2) {
      items.push({
        iconUrl: icon2,
        title: String(props.cms?.secretExtraTitle2 ?? ""),
        description: String(props.cms?.secretExtraBody2 ?? ""),
      });
    }

    if (icon3 || props.cms?.secretExtraTitle3 || props.cms?.secretExtraBody3) {
      items.push({
        iconUrl: icon3,
        title: String(props.cms?.secretExtraTitle3 ?? ""),
        description: String(props.cms?.secretExtraBody3 ?? ""),
      });
    }

    return items.filter((i) => Boolean(i.title.trim()) || Boolean(i.description.trim()) || Boolean(i.iconUrl));
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

  const visible = expanded ? [...base, ...extra] : base;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-[24px] leading-[30px] font-semibold">Design That Works: What&apos;s the Secret?</div>
        {extra.length > 0 ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-[14px] font-semibold text-orange-600"
          >
            {expanded ? "See Less" : "See All"}
          </button>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4">
        {visible.map((item, idx) => (
          <SecretCard key={`${item.title}-${idx}`} {...item} />
        ))}
      </div>
    </div>
  );
}
