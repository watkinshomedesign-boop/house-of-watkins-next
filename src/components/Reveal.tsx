"use client";

import type { ElementType, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type Props<T extends ElementType> = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  once?: boolean;
  as?: T;
};

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function Reveal<T extends ElementType = "div">(props: Props<T>) {
  const {
    children,
    className,
    delayMs = 0,
    once = true,
    as,
  } = props;

  const Component = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);

  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(false);

  const style = useMemo(() => {
    return delayMs ? ({ ["--reveal-delay" as any]: `${delayMs}ms` } as any) : undefined;
  }, [delayMs]);

  useEffect(() => {
    const rm = prefersReducedMotion();
    setReducedMotion(rm);
    if (rm) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    let didReveal = false;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            didReveal = true;
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else {
            // Avoid re-triggering when scrolling up/down.
            if (!once && !didReveal) {
              setVisible(false);
            }
          }
        }
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Component
      ref={(node: any) => {
        ref.current = node;
      }}
      className={`reveal${visible ? " reveal--visible" : ""}${reducedMotion ? " reveal--reduced" : ""}${className ? ` ${className}` : ""}`}
      style={style}
      data-state={visible ? "visible" : "hidden"}
    >
      {children}
    </Component>
  );
}
