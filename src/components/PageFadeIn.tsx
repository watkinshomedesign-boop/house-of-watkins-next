"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export default function PageFadeIn(props: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return <div className={`page-fade${visible ? " page-fade--visible" : ""}`}>{props.children}</div>;
}
