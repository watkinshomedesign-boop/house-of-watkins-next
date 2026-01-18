"use client";

import React, { createContext, useContext } from "react";
import type { TextStyleKey } from "@/lib/typography";
import { DEFAULT_BODY_STYLE } from "@/lib/typography";
import type { StyledTextRun } from "@/lib/styledText";

export type TypographyStoredBlockValue =
  | { style: TextStyleKey }
  | { runs: StyledTextRun[] };

export type TypographyStoredContent = Record<string, TypographyStoredBlockValue>;

type TypographyContextValue = {
  templateKey: string | null;
  content: TypographyStoredContent;
};

const TypographyContext = createContext<TypographyContextValue | null>(null);

export function TypographyProvider(props: {
  templateKey?: string | null;
  content?: TypographyStoredContent | null;
  children: React.ReactNode;
}) {
  return (
    <TypographyContext.Provider value={{ templateKey: props.templateKey ?? null, content: (props.content ?? {}) as any }}>
      {props.children}
    </TypographyContext.Provider>
  );
}

export function useTypography() {
  return useContext(TypographyContext);
}

export function useTypographyStyle(areaKey: string, defaultStyle: TextStyleKey): TextStyleKey {
  const ctx = useTypography();
  const raw = ctx?.content?.[areaKey] as any;
  const style = raw?.style;
  if (typeof style === "string") return style as TextStyleKey;
  return defaultStyle;
}

export function useTypographyRuns(areaKey: string, defaultRuns: StyledTextRun[]): StyledTextRun[] {
  const ctx = useTypography();
  const raw = ctx?.content?.[areaKey] as any;
  const runs = raw?.runs;
  if (Array.isArray(runs)) return runs as StyledTextRun[];
  return defaultRuns;
}

export function typographyDefaultRuns(text: string, style?: TextStyleKey): StyledTextRun[] {
  const s = String(text || "");
  if (!s) return [];
  return [{ text: s, style: style ?? DEFAULT_BODY_STYLE }];
}
