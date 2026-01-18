export type TextStyleKey =
  | "Title/Main"
  | "Title/56"
  | "Title/40"
  | "Title/28"
  | "Title/20"
  | "Title/18"
  | "Title/18 Big"
  | "Title/16"
  | "Title/15 Medium"
  | "Title/14"
  | "Title/13 Medium"
  | "Title/13"
  | "Body/18"
  | "Body/15"
  | "Body/13";

export type TextStyleDefinition = {
  key: TextStyleKey;
  fontFamily: string;
  fontSizePx: number;
  lineHeightPx: number;
  fontWeight: number;
  letterSpacingPx: number;
};

export const TEXT_STYLES: Record<TextStyleKey, TextStyleDefinition> = {
  "Title/Main": {
    key: "Title/Main",
    fontFamily: "Gilroy",
    fontSizePx: 79,
    lineHeightPx: 86,
    fontWeight: 600,
    letterSpacingPx: 0,
  },
  "Title/56": {
    key: "Title/56",
    fontFamily: "Gilroy",
    fontSizePx: 56,
    lineHeightPx: 64,
    fontWeight: 600,
    letterSpacingPx: 0,
  },
  "Title/40": {
    key: "Title/40",
    fontFamily: "Gilroy",
    fontSizePx: 40,
    lineHeightPx: 48,
    fontWeight: 600,
    letterSpacingPx: 0,
  },
  "Title/28": {
    key: "Title/28",
    fontFamily: "Gilroy",
    fontSizePx: 28,
    lineHeightPx: 40,
    fontWeight: 600,
    letterSpacingPx: 0,
  },
  "Title/20": {
    key: "Title/20",
    fontFamily: "Gilroy",
    fontSizePx: 20,
    lineHeightPx: 30,
    fontWeight: 600,
    letterSpacingPx: 0,
  },
  "Title/18": {
    key: "Title/18",
    fontFamily: "Gilroy",
    fontSizePx: 18,
    lineHeightPx: 24,
    fontWeight: 600,
    letterSpacingPx: 0,
  },
  "Title/18 Big": {
    key: "Title/18 Big",
    fontFamily: "Gilroy",
    fontSizePx: 18,
    lineHeightPx: 28,
    fontWeight: 600,
    letterSpacingPx: 0,
  },
  "Title/16": {
    key: "Title/16",
    fontFamily: "Gilroy",
    fontSizePx: 16,
    lineHeightPx: 24,
    fontWeight: 600,
    letterSpacingPx: 0,
  },
  "Title/15 Medium": {
    key: "Title/15 Medium",
    fontFamily: "Gilroy",
    fontSizePx: 15,
    lineHeightPx: 22,
    fontWeight: 500,
    letterSpacingPx: 0,
  },
  "Title/14": {
    key: "Title/14",
    fontFamily: "Gilroy",
    fontSizePx: 14,
    lineHeightPx: 19,
    fontWeight: 600,
    letterSpacingPx: 0,
  },
  "Title/13 Medium": {
    key: "Title/13 Medium",
    fontFamily: "Gilroy",
    fontSizePx: 13,
    lineHeightPx: 20,
    fontWeight: 500,
    letterSpacingPx: 0,
  },
  "Title/13": {
    key: "Title/13",
    fontFamily: "Gilroy",
    fontSizePx: 13,
    lineHeightPx: 24,
    fontWeight: 600,
    letterSpacingPx: 0,
  },
  "Body/18": {
    key: "Body/18",
    fontFamily: "Gilroy",
    fontSizePx: 18,
    lineHeightPx: 28,
    fontWeight: 400,
    letterSpacingPx: 0,
  },
  "Body/15": {
    key: "Body/15",
    fontFamily: "Gilroy",
    fontSizePx: 15,
    lineHeightPx: 22,
    fontWeight: 400,
    letterSpacingPx: 0,
  },
  "Body/13": {
    key: "Body/13",
    fontFamily: "Gilroy",
    fontSizePx: 13,
    lineHeightPx: 19,
    fontWeight: 400,
    letterSpacingPx: 0,
  },
};

export const DEFAULT_BODY_STYLE: TextStyleKey = "Body/15";

export function getTextStyleDefinition(key: TextStyleKey | null | undefined): TextStyleDefinition {
  if (!key) return TEXT_STYLES[DEFAULT_BODY_STYLE];
  return TEXT_STYLES[key] ?? TEXT_STYLES[DEFAULT_BODY_STYLE];
}

export function getTextStyleCss(key: TextStyleKey | null | undefined): {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
  letterSpacing: string;
} {
  const def = getTextStyleDefinition(key);
  return {
    fontFamily: def.fontFamily,
    fontSize: `${def.fontSizePx}px`,
    lineHeight: `${def.lineHeightPx}px`,
    fontWeight: def.fontWeight,
    letterSpacing: `${def.letterSpacingPx}px`,
  };
}
