"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import { MobileFooter } from "@/sitePages/home/mobile/MobileFooter";

import iconCart from "../../assets/Final small icon images black svg/Icon shopping cart-black.svg";

export type WhatsIncludedPageMobileProps = {
  contentText: string;
  media?: {
    includedInteriorImageSrc?: string;
    includedInteriorImageAlt?: string;
    ctaCarouselImageSrcs?: string[];
  };
};

type ValueProp = { heading: string; body: string };

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

function parseValueProp(block: string[]): ValueProp {
  const heading = afterLabel(block, "Heading:").value;
  const body = afterLabel(block, "Body Text:").value;
  return { heading, body };
}

function parseIncluded01(block: string[]): IncludedItem {
  const title = afterLabel(block, "Title:").value;
  const bulletLines = block.filter((l) => l.startsWith("• ")).map((l) => l.replace(/^•\s*/, "").trim());
  const bullets: IncludedBullet[] = [];
  for (const line of bulletLines) {
    const last = bullets[bullets.length - 1];
    if (!last || last.body) bullets.push({ title: line, body: "" });
    else last.body = line;
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

function parseSimpleBlock(block: string[]) {
  const heading = afterLabel(block, "Heading:").value;
  const body = afterLabel(block, "Body:").value || afterLabel(block, "Body Text:").value;
  return { heading, body };
}

function MobileWhatsIncludedHeader() {
  return (
    <header className="w-full bg-white">
      <div className="flex h-[58px] items-center justify-between px-4">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/brand/Logo%20Images/House-of-Watkins-Logo-black.png"
            alt="House of Watkins"
            width={180}
            height={22}
            className="h-[22px] w-auto"
            priority
          />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-600"
            aria-label="Cart"
          >
            <Image
              src={imgSrc(iconCart)}
              alt=""
              aria-hidden="true"
              width={18}
              height={18}
              className="h-[18px] w-[18px]"
              draggable={false}
            />
          </Link>

          <button
            type="button"
            aria-label="Menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-600"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-[18px] w-[18px] text-zinc-900"
              aria-hidden="true"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export function WhatsIncludedPageMobile(props: WhatsIncludedPageMobileProps) {
  const [activeSlide, setActiveSlide] = useState(1);
  const interiorImageSrc = props.media?.includedInteriorImageSrc || "/placeholders/whats-included-interior.svg";
  const interiorImageAlt = props.media?.includedInteriorImageAlt || "Interior space placeholder";
  const ctaCarouselSrcs = Array.isArray(props.media?.ctaCarouselImageSrcs) ? props.media?.ctaCarouselImageSrcs : undefined;
  const ctaImageSrc = (ctaCarouselSrcs && ctaCarouselSrcs[activeSlide - 1]) || `/placeholders/whats-included-house-cta.svg?v=${activeSlide}`;

  const data = useMemo(() => {
    const lines = cleanLines(props.contentText || "");

    const breadcrumb = afterLabel(lines, "BREADCRUMB:").value || "Main / What's included page";
    const pageTitle = afterLabel(lines, "PAGE TITLE:").value || "More Than a Plan. You're Buying a Service";

    const vp1 = parseValueProp(sectionLines(lines, "VALUE PROP 1:", "VALUE PROP 2:"));
    const vp2 = parseValueProp(sectionLines(lines, "VALUE PROP 2:", "VALUE PROP 3:"));
    const vp3 = parseValueProp(sectionLines(lines, "VALUE PROP 3:", "// ============================================================"));

    const sectionTitle = afterLabel(lines, "SECTION TITLE:").value || "What's Included When You Choose House of Watkins";

    const item01 = parseIncluded01(sectionLines(lines, "INCLUDED ITEM 01:", "INCLUDED ITEM 02:"));
    const item02 = parseIncludedSimple(sectionLines(lines, "INCLUDED ITEM 02:", "INCLUDED ITEM 03:"), "02");
    const item03 = parseIncludedSimple(sectionLines(lines, "INCLUDED ITEM 03:", "INCLUDED ITEM 04:"), "03");
    const item04 = parseIncludedSimple(sectionLines(lines, "INCLUDED ITEM 04:", "INCLUDED ITEM 05:"), "04");
    const item05 = parseIncludedSimple(sectionLines(lines, "INCLUDED ITEM 05:", "INCLUDED ITEM 06:"), "05");
    const item06 = parseIncludedSimple(sectionLines(lines, "INCLUDED ITEM 06:", "// ============================================================"), "06");

    const promiseTitle = "Our Promise to You";
    const p1 = parseSimpleBlock(sectionLines(lines, "PROMISE 1:", "PROMISE 2:"));
    const p2 = parseSimpleBlock(sectionLines(lines, "PROMISE 2:", "PROMISE 3:"));
    const p3 = parseSimpleBlock(sectionLines(lines, "PROMISE 3:", "HEADING:"));

    const ctaHeading = afterLabel(lines, "HEADING:").value || "Want to See How It Works?";
    const ctaBody = afterLabel(lines, "BODY TEXT:").value;
    const ctaBtnText = afterLabel(lines, "Text:").value || "BOOK A CALL";

    const notIncludedTitle = "What's Not Included—And Why";
    const n1 = parseSimpleBlock(sectionLines(lines, "REASON 1:", "REASON 2:"));
    const n2 = parseSimpleBlock(sectionLines(lines, "REASON 2:", "REASON 3:"));
    const n3 = parseSimpleBlock(sectionLines(lines, "REASON 3:", null));

    return {
      breadcrumb,
      pageTitle,
      valueProps: [vp1, vp2, vp3] as ValueProp[],
      sectionTitle,
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

  return (
    <div className="bg-[#FAF9F7] text-zinc-800 font-gilroy">
      <MobileWhatsIncludedHeader />

      <div className="px-4 pb-10">
        <div className="pt-2 text-[12px] text-neutral-500">
          <Link href="/" className="text-orange-600">
            Main
          </Link>
          <span className="px-2 text-neutral-400">/</span>
          <Link href="/whats-included" className="text-neutral-700">
            What&apos;s included page
          </Link>
        </div>

        <h1 className="mt-4 text-[32px] font-semibold leading-[1.15] text-zinc-900">{data.pageTitle}</h1>

        <div className="mt-6 space-y-4">
          {data.valueProps.map((vp) => (
            <div key={vp.heading} className="flex gap-3">
              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF5C02] text-white">
                <span className="text-[14px] font-semibold" aria-hidden="true">
                  ✓
                </span>
              </div>
              <div>
                <div className="text-[14px] font-semibold text-zinc-900">{vp.heading}</div>
                <div className="mt-1 text-[13px] leading-[1.6] text-neutral-600">{vp.body}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="text-[22px] font-semibold leading-[1.25] text-zinc-900">{data.sectionTitle}</h2>

          <div className="mt-5 overflow-hidden rounded-3xl bg-neutral-100">
            <img
              src={interiorImageSrc}
              alt={interiorImageAlt}
              className="h-[210px] w-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="mt-5 rounded-3xl border border-neutral-200 bg-white p-5">
            <div className="text-[14px] font-semibold text-neutral-400">01</div>
            <div className="mt-1 text-[18px] font-semibold text-zinc-900">{data.includedItems[0]?.title}</div>

            <div className="mt-4 space-y-4">
              {data.includedItems[0]?.bullets?.map((b) => (
                <div key={b.title}>
                  <div className="flex gap-2 text-[13px] leading-[1.6]">
                    <span className="mt-[2px] text-[#FF5C02]" aria-hidden="true">
                      •
                    </span>
                    <span className="font-medium text-zinc-900">{b.title}</span>
                  </div>
                  {b.body ? <div className="mt-1 text-[13px] leading-[1.7] text-neutral-600">{b.body}</div> : null}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {data.includedItems.slice(1).map((it) => (
              <div key={it.number} className="rounded-3xl border border-neutral-200 bg-white p-5">
                <div className="text-[14px] font-semibold text-neutral-400">{it.number}</div>
                <div className="mt-1 text-[16px] font-semibold text-zinc-900">{it.title}</div>
                <div className="mt-2 text-[13px] leading-[1.7] text-neutral-600">{it.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-[22px] font-semibold text-zinc-900">{data.promiseTitle}</h2>

          <div className="mt-5 space-y-5">
            {data.promises.map((p) => (
              <div key={p.heading} className="flex gap-3">
                <div className="mt-[6px] h-3 w-3 shrink-0 rounded-full bg-[#FF5C02]" aria-hidden="true" />
                <div>
                  <div className="text-[14px] font-semibold text-zinc-900">{p.heading}</div>
                  <div className="mt-1 text-[13px] leading-[1.7] text-neutral-600">{p.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-[22px] font-semibold text-zinc-900">{data.ctaHeading}</h2>
          <p className="mt-3 text-[13px] leading-[1.7] text-neutral-600">{data.ctaBody}</p>

          <a
            href="#"
            className="mt-5 inline-flex h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#FF5C02] text-[13px] font-semibold text-white"
          >
            <span aria-hidden="true">☎</span>
            <span>{data.ctaBtnText}</span>
          </a>

          <div className="mt-6 overflow-hidden rounded-3xl bg-neutral-100">
            <img
              src={ctaImageSrc}
              alt="Home exterior placeholder"
              className="h-[230px] w-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="mt-3 flex items-center justify-center gap-2">
            {Array.from({ length: 8 }).map((_, idx) => {
              const n = idx + 1;
              const active = n === activeSlide;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setActiveSlide(n)}
                  aria-label={`Slide ${n}`}
                  className={"h-2 w-2 rounded-full " + (active ? "bg-zinc-900" : "bg-neutral-300")}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-[22px] font-semibold text-zinc-900">{data.notIncludedTitle}</h2>

          <div className="mt-5 space-y-5">
            {data.notIncludedItems.map((r) => (
              <div key={r.heading}>
                <div className="text-[14px] font-semibold text-[#FF5C02]">{r.heading}</div>
                <div className="mt-2 text-[13px] leading-[1.7] text-neutral-600">{r.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MobileFooter />
    </div>
  );
}

export default WhatsIncludedPageMobile;
