import type { ReactNode } from "react";
import PageFadeIn from "@/components/PageFadeIn";

export default function Template(props: { children: ReactNode }) {
  return <PageFadeIn>{props.children}</PageFadeIn>;
}
