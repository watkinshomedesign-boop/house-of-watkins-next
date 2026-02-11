"use client";

import { useEffect, useRef, useState } from "react";

const CARD_WIDTH = 424;
const GAP = 24;

/**
 * Returns how many cards of CARD_WIDTH fit in the first row when using
 * dynamic spacing (justify-between). Second row will show 2 cards at fixed width.
 */
export function useContainerCardsPerRow<T>(items: T[]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardsInFirstRow, setCardsInFirstRow] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || items.length === 0) return;

    const update = () => {
      const width = el.offsetWidth;
      const perRow = Math.max(
        1,
        Math.floor((width + GAP) / (CARD_WIDTH + GAP))
      );
      setCardsInFirstRow(Math.min(perRow, items.length));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [items.length]);

  const row1 = items.slice(0, cardsInFirstRow);
  const row2 = items.slice(cardsInFirstRow);

  return { containerRef, cardsInFirstRow, row1, row2 };
}
