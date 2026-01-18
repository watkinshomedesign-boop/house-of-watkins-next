"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

import iconPhoneWhite from "../../assets/Final small icon images white svg/Icon phone-white.svg";

export type WhatsIncludedPageMediaProps = {
  includedInteriorImageSrc?: string;
  includedInteriorImageAlt?: string;
  includedWindowsImageSrc?: string;
  includedWindowsImageAlt?: string;
  includedHomeImageSrc?: string;
  includedHomeImageAlt?: string;
  ctaCarouselImageSrcs?: string[];
};

export type WhatsIncludedPageProps = {
  contentText: string;
  media?: WhatsIncludedPageMediaProps;
};

type ValueProp = { number: string; heading: string; body: string };

type IncludedBullet = { title: string; body: string };

type IncludedItem = {
  number: string;
  title: string;
  bullets?: IncludedBullet[];
  description?: string;
};

type PromiseItem = { heading: string; body: string };

type NotIncludedItem = { heading: string; body: string };

function imgSrc(mod: unknown): string {
  return (mod as any)?.src ?? (mod as any);
}

function cleanLines(raw: string) {
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => Boolean(l) && !l.startsWith("//"));
}

function indexOfLine(lines: string[], exact: string, fromIndex = 0) {
  for (let i = fromIndex; i < lines.length; i++) {
    if (lines[i] === exact) return i;
  }
  return -1;
}

function afterLabel(lines: string[], label: string, fromIndex = 0) {
  const i = indexOfLine(lines, label, fromIndex);
  if (i === -1) return { value: "", index: -1 };
  for (let j = i + 1; j < lines.length; j++) {
    const s = lines[j];
    if (!s) continue;
    if (s.endsWith(":")) continue;
    return { value: s, index: j };
  }
  return { value: "", index: -1 };
}

function sectionLines(lines: string[], startLabel: string, endLabel: string | null) {
  const start = indexOfLine(lines, startLabel);
  if (start === -1) return [] as string[];
  const end = endLabel ? indexOfLine(lines, endLabel, start + 1) : -1;
  return lines.slice(start + 1, end === -1 ? lines.length : end);
}

function parseSimpleBlock(block: string[]) {
  const heading = afterLabel(block, "Heading:").value;
  const body = afterLabel(block, "Body:").value || afterLabel(block, "Body Text:").value;
  return { heading, body };
}

function parseValueProp(block: string[], number: string): ValueProp {
  const heading = afterLabel(block, "Heading:").value;
  const body = afterLabel(block, "Body Text:").value;
  return { number, heading, body };
}

function parseIncluded01(block: string[]): IncludedItem {
  const title = afterLabel(block, "Title:").value;
  const bulletLines = block.filter((l) => l.startsWith("• ")).map((l) => l.replace(/^•\s*/, "").trim());
  const bullets: IncludedBullet[] = [];

  for (const line of bulletLines) {
    const last = bullets[bullets.length - 1];
    const looksLikeDescription =
      line.length >= 55 || /[.!?]$/.test(line) || line.includes("—") || line.toLowerCase().includes("builder");

    if (!last) {
      bullets.push({ title: line, body: "" });
      continue;
    }

    if (!last.body && looksLikeDescription) {
      last.body = line;
      continue;
    }

    bullets.push({ title: line, body: "" });
  }
  return { number: "01", title, bullets };
}

function parseIncludedSimple(block: string[], number: string): IncludedItem {
  const title = afterLabel(block, "Title:").value;
  const description = block
    .filter(
      (l) =>
        !l.startsWith("[") &&
        !l.endsWith(":") &&
        !l.startsWith("Number:") &&
        !l.startsWith("Title:") &&
        !l.startsWith("Details:")
    )
    .join(" ")
    .trim();
  return { number, title, description };
}

function placeholder(text: string) {
  const s = text.toLowerCase();
  if (s.includes("interior")) return "/placeholders/whats-included-interior.svg";
  if (s.includes("cta") || s.includes("carousel")) return "/placeholders/whats-included-house-cta.svg";
  return "/placeholders/plan-hero.svg";
}

export function WhatsIncludedPageDesktop(props: WhatsIncludedPageProps) {
  const [activeSlide, setActiveSlide] = useState(1);
  const interiorImageSrc = props.media?.includedInteriorImageSrc || placeholder("Interior");
  const interiorImageAlt = props.media?.includedInteriorImageAlt || "Interior placeholder";
  const windowsImageSrc = props.media?.includedWindowsImageSrc || placeholder("Windows");
  const windowsImageAlt = props.media?.includedWindowsImageAlt || "Windows and doors placeholder";
  const homeImageSrc = props.media?.includedHomeImageSrc || placeholder("Home");
  const homeImageAlt = props.media?.includedHomeImageAlt || "Home exterior placeholder";
  const ctaCarouselSrcs = Array.isArray(props.media?.ctaCarouselImageSrcs) ? props.media?.ctaCarouselImageSrcs : undefined;
  const ctaImageSrc = (ctaCarouselSrcs && ctaCarouselSrcs[activeSlide - 1]) || placeholder(`CTA ${activeSlide}`);

  const data = useMemo(() => {
    const lines = cleanLines(props.contentText || "");

    const breadcrumb = afterLabel(lines, "BREADCRUMB:").value || "Main / What's included page";
    const pageTitle = afterLabel(lines, "PAGE TITLE:").value || "More Than a Plan. You're Buying a Service";

    const vp1 = parseValueProp(sectionLines(lines, "VALUE PROP 1:", "VALUE PROP 2:"), "01");
    const vp2 = parseValueProp(sectionLines(lines, "VALUE PROP 2:", "VALUE PROP 3:"), "02");
    const vp3 = parseValueProp(sectionLines(lines, "VALUE PROP 3:", "// ============================================================"), "03");

    const includedTitleRes = afterLabel(lines, "SECTION TITLE:");
    const includedTitle = includedTitleRes.value || "What's Included When You Choose House of Watkins";

    const promiseTitleRes = afterLabel(lines, "SECTION TITLE:", includedTitleRes.index + 1);
    const promiseTitle = promiseTitleRes.value || "Our Promise to You";

    const item01 = parseIncluded01(sectionLines(lines, "INCLUDED ITEM 01:", "INCLUDED ITEM 02:"));
    const item02 = parseIncludedSimple(sectionLines(lines, "INCLUDED ITEM 02:", "INCLUDED ITEM 03:"), "02");
    const item03 = parseIncludedSimple(sectionLines(lines, "INCLUDED ITEM 03:", "INCLUDED ITEM 04:"), "03");
    const item04 = parseIncludedSimple(sectionLines(lines, "INCLUDED ITEM 04:", "INCLUDED ITEM 05:"), "04");
    const item05 = parseIncludedSimple(sectionLines(lines, "INCLUDED ITEM 05:", "INCLUDED ITEM 06:"), "05");
    const item06 = parseIncludedSimple(sectionLines(lines, "INCLUDED ITEM 06:", "// ============================================================"), "06");

    const p1 = parseSimpleBlock(sectionLines(lines, "PROMISE 1:", "PROMISE 2:"));
    const p2 = parseSimpleBlock(sectionLines(lines, "PROMISE 2:", "PROMISE 3:"));
    const p3 = parseSimpleBlock(sectionLines(lines, "PROMISE 3:", "HEADING:"));

    const ctaHeading = afterLabel(lines, "HEADING:").value || "Want to See How It Works?";
    const ctaBody = afterLabel(lines, "BODY TEXT:").value;
    const ctaBtnText = afterLabel(lines, "Text:").value || "BOOK A CALL";

    const n1 = parseSimpleBlock(sectionLines(lines, "REASON 1:", "REASON 2:"));
    const n2 = parseSimpleBlock(sectionLines(lines, "REASON 2:", "REASON 3:"));
    const n3 = parseSimpleBlock(sectionLines(lines, "REASON 3:", null));

    const notIncludedTitleRes = afterLabel(lines, "SECTION TITLE:", promiseTitleRes.index + 1);
    const notIncludedTitle = notIncludedTitleRes.value || "What's Not Included—And Why";

    return {
      breadcrumb,
      pageTitle,
      valueProps: [vp1, vp2, vp3] as ValueProp[],
      includedTitle,
      includedItems: [item01, item02, item03, item04, item05, item06] as IncludedItem[],
      promiseTitle,
      promises: [p1, p2, p3] as PromiseItem[],
      ctaHeading,
      ctaBody,
      ctaBtnText,
      notIncludedTitle,
      notIncludedItems: [
        { heading: n1.heading, body: n1.body },
        { heading: n2.heading, body: n2.body },
        { heading: n3.heading, body: n3.body },
      ] as NotIncludedItem[],
    };
  }, [props.contentText]);

  const breadcrumbParts = useMemo(() => {
    const s = String(data.breadcrumb || "");
    const parts = s.split("/").map((p) => p.trim());
    return {
      left: parts[0] || "Main",
      right: parts.slice(1).join(" / ") || "What's included page",
    };
  }, [data.breadcrumb]);

  const promiseTitleParts = useMemo(() => {
    const t = String(data.promiseTitle || "");
    const idx = t.toLowerCase().indexOf("to you");
    if (idx === -1) return { left: t, right: "" };
    return {
      left: t.slice(0, idx).trimEnd(),
      right: t.slice(idx).trimStart(),
    };
  }, [data.promiseTitle]);

  const includedByNumber = useMemo(() => {
    const m = new Map<string, IncludedItem>();
    for (const it of data.includedItems) m.set(it.number, it);
    return m;
  }, [data.includedItems]);

  const included01 = includedByNumber.get("01");
  const included02 = includedByNumber.get("02");
  const included03 = includedByNumber.get("03");
  const included04 = includedByNumber.get("04");
  const included05 = includedByNumber.get("05");
  const included06 = includedByNumber.get("06");

  const ctaHeadingParts = useMemo(() => {
    const t = String(data.ctaHeading || "").trim();
    const marker = "How It ";
    const idx = t.indexOf(marker);
    if (idx === -1) return { left: t, right: "" };
    return {
      left: t.slice(0, idx + marker.length).trimEnd(),
      right: t.slice(idx + marker.length).trimStart(),
    };
  }, [data.ctaHeading]);

  return (
    <main className="bg-[#FAF9F7] font-gilroy text-[#1A1A1A]">
      <div className="mx-auto w-full max-w-[1200px] px-[56px] pb-[90px]">
        <div className="pt-8 text-[18px] font-semibold leading-[22px] md:pt-4">
          <Link href="/" className="text-orange-600">
            {breadcrumbParts.left}
          </Link>
          <span className="px-2 text-neutral-400">/</span>
          <Link href="/whats-included" className="text-neutral-700">
            {breadcrumbParts.right}
          </Link>
        </div>

        <h1 className="mt-6 text-[40px] font-semibold leading-[48px]">{data.pageTitle}</h1>

        <div className="mt-8 grid grid-cols-3 gap-10">
          {data.valueProps.map((p) => (
            <div key={p.number} className="flex gap-3">
              <div className="mt-[2px] flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FF5C02] text-[12px] font-semibold leading-none text-white">
                {p.number}
              </div>
              <div>
                <div className="text-[14px] font-semibold leading-[18px]">{p.heading}</div>
                <div className="mt-2 text-[13px] leading-[19px] text-[#7A7A7A]">{p.body}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-[22px] font-semibold leading-[28px]">{data.includedTitle}</h2>

        <div className="mt-6 grid grid-cols-[520px_1fr] gap-10 items-start">
          <img
            src={interiorImageSrc}
            alt={interiorImageAlt}
            className="h-[420px] w-full rounded-[24px] object-cover"
            loading="lazy"
          />

          <div className="pt-2">
            <div className="text-[16px] font-semibold text-[#C8C8C8]">01</div>
            <div className="mt-2 text-[18px] font-semibold leading-[24px]">{included01?.title}</div>

            <div className="mt-4 space-y-4">
              {included01?.bullets?.map((b) => (
                <div key={b.title}>
                  <div className="text-[13px] font-semibold leading-[19px]">• {b.title}</div>
                  {b.body ? <div className="mt-1 text-[13px] leading-[19px] text-[#7A7A7A]">{b.body}</div> : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-6">
          {included02 ? (
            <div className="rounded-[24px] bg-white p-6">
              <div className="text-[16px] font-semibold text-[#C8C8C8]">{included02.number}</div>
              <div className="mt-2 text-[16px] font-semibold leading-[22px]">{included02.title}</div>
              <div className="mt-2 text-[13px] leading-[19px] text-[#7A7A7A]">{included02.description}</div>
            </div>
          ) : null}

          {included03 ? (
            <div className="rounded-[24px] bg-white p-6">
              <div className="text-[16px] font-semibold text-[#C8C8C8]">{included03.number}</div>
              <div className="mt-2 text-[16px] font-semibold leading-[22px]">{included03.title}</div>
              <div className="mt-2 text-[13px] leading-[19px] text-[#7A7A7A]">{included03.description}</div>
            </div>
          ) : null}

          {included04 ? (
            <div className="rounded-[24px] bg-white p-6">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="text-[16px] font-semibold text-[#C8C8C8]">{included04.number}</div>
                  <div className="mt-2 text-[16px] font-semibold leading-[22px]">{included04.title}</div>
                  <div className="mt-2 text-[13px] leading-[19px] text-[#7A7A7A]">{included04.description}</div>
                </div>
                <img
                  src={windowsImageSrc}
                  alt={windowsImageAlt}
                  className="mt-1 h-[92px] w-[150px] shrink-0 rounded-[16px] object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          ) : null}

          {included05 ? (
            <div className="rounded-[24px] bg-white p-6">
              <div className="text-[16px] font-semibold text-[#C8C8C8]">{included05.number}</div>
              <div className="mt-2 text-[16px] font-semibold leading-[22px]">{included05.title}</div>
              <div className="mt-2 text-[13px] leading-[19px] text-[#7A7A7A]">{included05.description}</div>
            </div>
          ) : null}

          {included06 ? (
            <div className="col-span-2 rounded-[24px] bg-white p-6">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="text-[16px] font-semibold text-[#C8C8C8]">{included06.number}</div>
                  <div className="mt-2 text-[16px] font-semibold leading-[22px]">{included06.title}</div>
                  <div className="mt-2 text-[13px] leading-[19px] text-[#7A7A7A]">{included06.description}</div>
                </div>
                <img
                  src={homeImageSrc}
                  alt={homeImageAlt}
                  className="mt-1 h-[92px] w-[220px] shrink-0 rounded-[16px] object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          ) : null}
        </div>

        <h2 className="mt-14 text-[22px] font-semibold leading-[28px]">
          {promiseTitleParts.left ? <span>{promiseTitleParts.left} </span> : null}
          {promiseTitleParts.right ? <span className="text-[#FF5C02]">{promiseTitleParts.right}</span> : null}
        </h2>

        <div className="mt-8 grid grid-cols-3 gap-10">
          {data.promises.map((p) => (
            <div key={p.heading}>
              <div className="text-[14px] font-semibold leading-[18px]">{p.heading}</div>
              <div className="mt-2 text-[13px] leading-[19px] text-[#7A7A7A]">{p.body}</div>
              <div className="mt-4 h-2 w-2 rounded-full bg-[#FF5C02]" />
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-[28px] bg-[#F2EFEB] p-8">
          <div className="grid grid-cols-[360px_1fr] gap-10 items-center">
            <div>
              <h3 className="text-[22px] font-semibold leading-[28px]">
                {ctaHeadingParts.left || data.ctaHeading}
                <br />
                {ctaHeadingParts.right}
              </h3>
              <p className="mt-3 text-[13px] leading-[19px] text-[#7A7A7A]">{data.ctaBody}</p>

              <a
                href="#"
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-[#FF5C02] px-5 text-[12px] font-semibold uppercase tracking-[0.15px] text-white"
              >
                <img
                  src={imgSrc(iconPhoneWhite)}
                  alt=""
                  aria-hidden="true"
                  className="h-[14px] w-[14px]"
                  draggable={false}
                />
                <span>{data.ctaBtnText}</span>
              </a>
            </div>

            <div>
              <img
                src={ctaImageSrc}
                alt="Home photo placeholder"
                className="h-[260px] w-full rounded-[22px] object-cover"
                loading="lazy"
              />

              <div className="mt-3 flex items-center justify-center gap-4">
                {Array.from({ length: 8 }).map((_, idx) => {
                  const n = idx + 1;
                  const active = n === activeSlide;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setActiveSlide(n)}
                      aria-label={`Slide ${n}`}
                      className={
                        "relative text-[12px] font-semibold leading-none " +
                        (active ? "text-[#1A1A1A]" : "text-[#B8B8B8]")
                      }
                    >
                      {n}
                      {active ? <span className="absolute left-1/2 top-[16px] h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-[#1A1A1A]" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <h2 className="mt-14 text-[22px] font-semibold leading-[28px]">{data.notIncludedTitle}</h2>

        <div className="mt-8 grid grid-cols-3 gap-10">
          {data.notIncludedItems.map((r) => (
            <div key={r.heading}>
              <div className="text-[14px] font-semibold leading-[18px] text-[#FF5C02]">{r.heading}</div>
              <div className="mt-2 text-[13px] leading-[19px] text-[#7A7A7A]">{r.body}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default WhatsIncludedPageDesktop;
