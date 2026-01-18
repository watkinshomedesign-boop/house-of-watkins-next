import React from "react";
import { DEFAULT_BODY_STYLE, type TextStyleKey, getTextStyleCss } from "@/lib/typography";

export type StyledTextRun = {
  text: string;
  style?: TextStyleKey;
};

export type StyledTextValue = string | StyledTextRun[];

export function normalizeStyledText(value: StyledTextValue | null | undefined): StyledTextRun[] {
  if (value == null) return [];
  if (typeof value === "string") {
    const s = String(value);
    return s ? [{ text: s, style: DEFAULT_BODY_STYLE }] : [];
  }

  if (!Array.isArray(value)) return [];

  const out: StyledTextRun[] = [];
  for (const r of value) {
    const text = String((r as any)?.text ?? "");
    if (!text) continue;
    const style = ((r as any)?.style as TextStyleKey | undefined) ?? DEFAULT_BODY_STYLE;

    const last = out[out.length - 1];
    if (last && last.style === style) {
      last.text += text;
    } else {
      out.push({ text, style });
    }
  }
  return out;
}

export function styledTextToPlainText(value: StyledTextValue | null | undefined): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return "";
  return value.map((r) => String((r as any)?.text ?? "")).join("");
}

export function StyledText(props: {
  value: StyledTextValue | null | undefined;
  defaultStyle?: TextStyleKey;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}) {
  const Tag = (props.as ?? "span") as any;
  const runs = normalizeStyledText(props.value);
  const fallbackStyle = props.defaultStyle ?? DEFAULT_BODY_STYLE;

  if (runs.length === 0) {
    return <Tag className={props.className} />;
  }

  return (
    <Tag className={props.className}>
      {runs.map((r, idx) => {
        const css = getTextStyleCss(r.style ?? fallbackStyle);
        return (
          <span key={idx} style={css}>
            {r.text}
          </span>
        );
      })}
    </Tag>
  );
}
