"use client";

import { useEffect, useMemo, useState } from "react";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { Tour3dIcon } from "@/components/icons/Tour3dIcon";
import { PlanImage } from "@/components/media/PlanImage";

export type HouseImageProps = {
  desktop: string;
  mobile?: string;
  hover?: string;
  planSlug?: string;
  tour3dUrl?: string | null;
};

function isValidHttpUrl(v: string | null | undefined) {
  const s = String(v || "").trim();
  if (!s) return false;
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export const HouseImage = (props: HouseImageProps) => {
  const mobileSrc = props.mobile ?? props.desktop;
  const desktopSrc = props.desktop;
  const [useDesktop, setUseDesktop] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const show3d = useMemo(() => isValidHttpUrl(props.tour3dUrl), [props.tour3dUrl]);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const onChange = () => setUseDesktop(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const variant = useMemo(() => {
    return useDesktop ? desktopSrc : mobileSrc;
  }, [desktopSrc, mobileSrc, useDesktop]);

  const backgroundVariant = useMemo(() => {
    if (useDesktop && isHovered && props.hover) return props.hover;
    return variant;
  }, [isHovered, props.hover, useDesktop, variant]);

  return (
    <PlanImage
      src={backgroundVariant}
      alt=""
      sizes="(min-width: 768px) 384px, 100vw"
      className="rounded-none md:h-[268px] md:w-[384px] md:rounded-[28.416px] md:shrink-0"
      aspect="auto"
      rounded={false}
    >
      <div
        className="absolute inset-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      {show3d && props.tour3dUrl ? (
        <a
          href={props.tour3dUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute left-4 top-[19px] z-10 inline-flex h-[38px] min-w-0 max-w-[calc(100%-2rem)] shrink-0 items-center gap-1.5 rounded-[50px] border border-[#FF5C02] bg-white px-4 py-2 font-gilroy font-medium leading-[22px] text-[15px] text-black no-underline outline-none hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-[#FF5C02] md:left-[18px]"
          aria-label="Open 3D tour"
        >
          <Tour3dIcon className="h-5 w-5 shrink-0" />
          <span className="truncate">3D tour</span>
        </a>
      ) : null}
      {props.planSlug ? <FavoriteButton planSlug={props.planSlug} /> : null}
    </PlanImage>
  );
};
