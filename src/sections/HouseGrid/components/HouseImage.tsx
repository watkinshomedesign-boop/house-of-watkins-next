"use client";

import { useEffect, useMemo, useState } from "react";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
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
      sizes="(min-width: 768px) 50vw, 100vw"
      className="rounded-none md:rounded-[28.416px]"
      rounded={false}
    >
      <div
        className="absolute inset-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      {show3d ? (
        <img
          src="/assets/Final%20small%20icon%20images%20black%20svg/3D%20Tour.svg"
          alt="3D Tour Available"
          className="pointer-events-none absolute inset-0 z-10 h-full w-full object-cover"
          draggable={false}
        />
      ) : null}
      {props.planSlug ? <FavoriteButton planSlug={props.planSlug} /> : null}
    </PlanImage>
  );
};
