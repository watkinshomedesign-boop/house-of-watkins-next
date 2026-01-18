import Image from "next/image";
import type { ReactNode } from "react";

// All plan/product images must use PlanImage to enforce 3:2.

export type PlanImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  rounded?: boolean;
  aspect?: "3/2" | "auto";
  children?: ReactNode;
};

function safeEncodeUrlOrPath(src: string) {
  const raw = String(src || "").trim();
  if (!raw) return raw;

  const encodeSeg = (seg: string) => {
    try {
      return encodeURIComponent(decodeURIComponent(seg));
    } catch {
      return encodeURIComponent(seg);
    }
  };

  // Absolute URL
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    try {
      const u = new URL(raw);
      u.pathname = u.pathname
        .split("/")
        .map((seg) => (seg ? encodeSeg(seg) : seg))
        .join("/");
      return u.toString();
    } catch {
      return raw;
    }
  }

  // Relative/path (e.g. /plans/...)
  if (raw.startsWith("/")) {
    const [pathPart, rest] = raw.split(/(?=[?#])/);
    const encodedPath = pathPart
      .split("/")
      .map((seg) => (seg ? encodeSeg(seg) : seg))
      .join("/");
    return `${encodedPath}${rest ?? ""}`;
  }

  return raw;
}

export function PlanImage(props: PlanImageProps) {
  const rounded = props.rounded ?? true;
  const aspect = props.aspect ?? "3/2";
  const aspectClass = aspect === "auto" ? "h-full" : "aspect-[3/2]";
  const src = safeEncodeUrlOrPath(props.src);
  const unoptimized =
    src.startsWith("/") ||
    src.startsWith("http://localhost") ||
    src.startsWith("https://localhost") ||
    src.startsWith("http://127.0.0.1") ||
    src.startsWith("https://127.0.0.1") ||
    src.includes(".supabase.co/") ||
    src.includes("/storage/v1/object/public/");

  return (
    <div
      className={`relative w-full ${aspectClass} overflow-hidden${rounded ? " rounded-2xl" : ""}${
        props.className ? ` ${props.className}` : ""
      }`}
    >
      <Image
        src={src}
        alt={props.alt}
        fill
        priority={props.priority}
        unoptimized={unoptimized}
        sizes={props.sizes}
        className={`object-cover object-center${props.imgClassName ? ` ${props.imgClassName}` : ""}`}
      />
      {props.children}
    </div>
  );
}
