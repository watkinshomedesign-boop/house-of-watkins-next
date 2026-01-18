"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import styles from "./WhatsIncludedPageRebuild.module.css";

import iconClose from "../../assets/Final small icon images white svg/Icon X-white.svg";
import iconArrowLeft from "../../assets/Final small icon images white svg/Icon arrow no stem left-white.svg";
import iconArrowRight from "../../assets/Final small icon images white svg/Icon arrow no stem right-white.svg";

export type WhatsIncludedPageMediaProps = {
  includedInteriorImageSrc?: string;
  includedInteriorImageAlt?: string;
  includedWindowsImageSrc?: string;
  includedWindowsImageAlt?: string;
  includedHomeImageSrc?: string;
  includedHomeImageAlt?: string;
  includedPlanImageSrcs?: (string | undefined)[];
  includedPlanImageAlts?: (string | undefined)[];
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

type PlanImage = { src: string; alt: string; label: string };

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

function parseSimpleBlock(block: string[]) {
  const heading = afterLabel(block, "Heading:").value;
  const body = afterLabel(block, "Body:").value || afterLabel(block, "Body Text:").value;
  return { heading, body };
}

function getFocusableElements(container: HTMLElement | null) {
  if (!container) return [] as HTMLElement[];
  const nodes = container.querySelectorAll<HTMLElement>(
    "button,[href],input,select,textarea,[tabindex]:not([tabindex='-1'])"
  );
  return Array.from(nodes).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
}

const BOTTOM_PROMISES: PromiseItem[] = [
  {
    heading: "Clarity at Every Step",
    body: "You’ll always know what you’re getting—and what comes next. Everything is clear and predictable, so you can move forward with confidence and no surprises.",
  },
  {
    heading: "Pride in the Result",
    body: "No matter your lot, your budget, or your vision, you deserve a home that’s uniquely yours and a process that feels empowering, not exhausting.",
  },
  {
    heading: "Relief from Overwhelm",
    body: "We’ve helped thousands of clients just like you find a clear path through the building process. You’re not “missing something”—you’re just new to this, and we’ll guide you.",
  },
];

const BOTTOM_NOT_INCLUDED: NotIncludedItem[] = [
  {
    heading: "Site-specific engineering",
    body: "Beams, headers, seismic loads. Every region, and every lot, is different. Your local engineer will tweak these details for your safety and permitting. This is the industry gold standard, and protects your investment.",
  },
  {
    heading: "Cost-to-Build Estimates",
    body: "Construction costs change fast and depend on local labor, materials, and site conditions. We’ll guide you on where and how to get accurate numbers, and help you avoid common cost traps.",
  },
  {
    heading: "3D Walkthroughs for Custom Changes",
    body: "For clients who want a full 3D experience, we can recommend trusted partners.",
  },
];

export function WhatsIncludedPageRebuild(props: WhatsIncludedPageProps) {
  const [activePlan, setActivePlan] = useState<number | null>(null);
  const [lightboxMounted, setLightboxMounted] = useState(false);
  const [lightboxVisible, setLightboxVisible] = useState(false);

  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const planImages: PlanImage[] = useMemo(() => {
    const srcs = Array.isArray(props.media?.includedPlanImageSrcs) ? props.media?.includedPlanImageSrcs : [];
    const alts = Array.isArray(props.media?.includedPlanImageAlts) ? props.media?.includedPlanImageAlts : [];
    return Array.from({ length: 6 }).map((_, idx) => {
      const label = String(idx + 1).padStart(2, "0");
      const src = typeof srcs[idx] === "string" && srcs[idx].trim() ? srcs[idx].trim() : null;
      const alt = typeof alts[idx] === "string" && alts[idx].trim() ? alts[idx].trim() : `Technical drawing ${label}`;
      return {
        src: src ?? `/placeholders/plan-hero.svg?plan=${label}`,
        alt,
        label,
      };
    });
  }, [props.media?.includedPlanImageAlts, props.media?.includedPlanImageSrcs]);

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

    const notIncludedTitleRes = afterLabel(lines, "SECTION TITLE:", promiseTitleRes.index + 1);
    const notIncludedTitle = notIncludedTitleRes.value || "What's Not Included—And Why";

    const item01 = parseIncluded01(sectionLines(lines, "INCLUDED ITEM 01:", "INCLUDED ITEM 02:"));
    const item05 = parseIncludedSimple(sectionLines(lines, "INCLUDED ITEM 05:", "INCLUDED ITEM 06:"), "05");
    const item06 = parseIncludedSimple(sectionLines(lines, "INCLUDED ITEM 06:", "// ============================================================"), "06");

    const p1 = parseSimpleBlock(sectionLines(lines, "PROMISE 1:", "PROMISE 2:"));
    const p2 = parseSimpleBlock(sectionLines(lines, "PROMISE 2:", "PROMISE 3:"));
    const p3 = parseSimpleBlock(sectionLines(lines, "PROMISE 3:", "HEADING:"));

    const n1 = parseSimpleBlock(sectionLines(lines, "REASON 1:", "REASON 2:"));
    const n2 = parseSimpleBlock(sectionLines(lines, "REASON 2:", "REASON 3:"));
    const n3 = parseSimpleBlock(sectionLines(lines, "REASON 3:", null));

    return {
      breadcrumb,
      pageTitle,
      valueProps: [vp1, vp2, vp3] as ValueProp[],
      includedTitle,
      item01,
      item05,
      item06,
      promiseTitle,
      promises: [p1, p2, p3] as PromiseItem[],
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

  const interiorImageSrc = props.media?.includedInteriorImageSrc || "/placeholders/whats-included-interior.svg";
  const interiorImageAlt = props.media?.includedInteriorImageAlt || "Interior photo";

  const openLightbox = useCallback((idx: number) => {
    lastFocusRef.current = (document.activeElement as HTMLElement) || null;
    setActivePlan(idx);
    setLightboxMounted(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxVisible(false);
    if (closeTimerRef.current != null) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      setLightboxMounted(false);
      setActivePlan(null);
      if (lastFocusRef.current && lastFocusRef.current.isConnected) lastFocusRef.current.focus();
    }, 180);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current != null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const goPrev = useCallback(() => {
    setActivePlan((cur) => {
      if (cur == null) return cur;
      return (cur + planImages.length - 1) % planImages.length;
    });
  }, [planImages.length]);

  const goNext = useCallback(() => {
    setActivePlan((cur) => {
      if (cur == null) return cur;
      return (cur + 1) % planImages.length;
    });
  }, [planImages.length]);

  useEffect(() => {
    if (!lightboxMounted) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => setLightboxVisible(true), 10);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxMounted]);

  useEffect(() => {
    if (!lightboxMounted) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
        return;
      }
      if (e.key === "Tab") {
        const focusables = getFocusableElements(modalRef.current);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (e.shiftKey) {
          if (!active || active === first) {
            e.preventDefault();
            last.focus();
          }
          return;
        }

        if (!active || active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeLightbox, goNext, goPrev, lightboxMounted]);

  useEffect(() => {
    if (!lightboxMounted) return;
    closeBtnRef.current?.focus();
  }, [lightboxMounted]);

  const active = activePlan == null ? null : planImages[activePlan];

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Link href="/" className={styles.breadcrumbLink}>
            {breadcrumbParts.left}
          </Link>
          <span className={styles.breadcrumbSep}>/</span>
          <Link href="/whats-included" className={styles.breadcrumbLink}>
            {breadcrumbParts.right}
          </Link>
        </div>

        <h1 className={styles.title}>{data.pageTitle}</h1>

        <div className={styles.valueProps}>
          {data.valueProps.map((p) => (
            <div key={p.number} className={styles.valueProp}>
              <div style={{ width: 28, height: 28 }} aria-hidden="true" />
              <div>
                <div className={styles.valueHeading}>{p.heading}</div>
                <div className={styles.valueBody}>{p.body}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.includedHero}>
          <img className={styles.includedHeroImage} src={interiorImageSrc} alt={interiorImageAlt} loading="lazy" />

          <div className={styles.card}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardItem}>
                <div className={styles.heroCardHeading}>A collaborative design process</div>
                <div className={styles.heroCardBody}>
                  We listen. We ask questions you might not have thought of. We offer options, explain trade-offs, and let you
                  decide what feels right—for your budget, your family, and your future.
                </div>
              </div>

              <div className={styles.heroCardItem}>
                <div className={styles.heroCardHeading}>Direct access to your designer</div>
                <div className={styles.heroCardBody}>
                  {"You get real conversations, not just download links. We're here for your questions, big or small, before and after you buy."}
                </div>
              </div>

              <div className={styles.heroCardItem}>
                <div className={styles.heroCardHeading}>Upfront, transparent pricing</div>
                <div className={styles.heroCardBody}>
                  {
                    'No hidden "gotchas." If something requires extra engineering or customization, you\'ll know exactly what it costs (and why) before you commit.'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className={styles.title} style={{ textAlign: "center", marginTop: 144 }}>
          {"What's Included In All House Plans"}
        </h2>

        <div className={styles.plansSection}>
          <div className={styles.plansGrid}>
            {[
              {
                title: "Cover Sheet:",
                items: ["3D Rendering", "Page Index", "Sq. Ft. Calculations"],
              },
              {
                title: "Floor Plans:",
                items: [
                  "Depiction and locations of walls, windows, doors, fixtures and appliances",
                  "Labeled rooms, flooring & shape of ceilings",
                  "Floor elevations (not relating to topography)",
                  "Dimensions & other annotation",
                  "Door & Window Schedules w/ notes",
                ],
              },
              {
                title: "Elevations:",
                items: [
                  "General illustration of door & window styles",
                  "General height of walls, window and door headers",
                  "Depiction & location of siding and a general representation of grading",
                ],
              },
              {
                title: "Roof Plan",
                items: [
                  "1. Depiction and locations of all ridges, valleys, dormers & eaves",
                  "2. Roof pitch, appropriate annotation, and the Locations and general heights of wall plates.",
                ],
              },
            ].map((block, idx) => {
              const img = planImages[idx];
              if (!img) return null;

              return (
                <div key={block.title} className={styles.planRow}>
                  <div className={styles.planRowText}>
                    <div className={styles.planBlockTitle}>{block.title}</div>
                    <ul className={styles.planBlockBody} style={{ marginTop: 10, paddingLeft: 18 }}>
                      {block.items.map((t, i) => (
                        <li key={`${idx}-${i}`}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.planRowImage}>
                    <button
                      type="button"
                      className={styles.planThumbButton}
                      onClick={() => openLightbox(idx)}
                      aria-label={`Open technical drawing ${img.label}`}
                    >
                      <img className={styles.planThumb} src={img.src} alt={img.alt} loading="lazy" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <h2 className={styles.title} style={{ textAlign: "center", marginTop: 144 }}>
          Added by Request
        </h2>

        <div className={styles.siteSection}>
          <div className={styles.addedByRequestGrid}>
            {planImages.slice(4, 6).map((img, idx) => (
              <React.Fragment key={img.label}>
                <button
                  type="button"
                  className={styles.planThumbButton}
                  onClick={() => openLightbox(idx + 4)}
                  aria-label={`Open technical drawing ${img.label}`}
                >
                  <img className={styles.planThumb} src={img.src} alt={img.alt} loading="lazy" />
                </button>

                {idx === 0 ? (
                  <div className={styles.addedByRequestBlock}>
                    <div className={styles.planBlockTitle}>Site Plan</div>
                    <ul className={styles.planBlockBody} style={{ marginTop: 10, paddingLeft: 18 }}>
                      <li>Site description (legal description, property line bearings, north arrow)</li>
                      <li>Drawing of Site with proposed house</li>
                      <li>Proposed concrete work (driveways, walkways, patios etc.)</li>
                      <li>Area calculation</li>
                      <li>Setbacks and easements</li>
                    </ul>
                  </div>
                ) : (
                  <div className={styles.addedByRequestBlock}>
                    <div className={styles.planBlockTitle}>Additional Drawings:</div>
                    <ul className={styles.planBlockBody} style={{ marginTop: 10, paddingLeft: 18 }}>
                      <li>
                        Every county is different and may require something not included in a standard set of plans. We will make
                        an extra drawing if needed. $125 per hour, not to exceed $500.
                      </li>
                    </ul>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <h2 className={styles.promiseTitle}>
          {promiseTitleParts.left ? <span>{promiseTitleParts.left} </span> : null}
          {promiseTitleParts.right ? <span className={styles.promiseTitleAccent}>{promiseTitleParts.right}</span> : null}
        </h2>

        <div className={styles.promisesGrid}>
          {BOTTOM_PROMISES.map((p) => (
            <div key={p.heading}>
              <div className={styles.promiseHeading}>{p.heading}</div>
              <div className={styles.promiseBody}>{p.body}</div>
              <div className={styles.promiseDot} />
            </div>
          ))}
        </div>

        <h2 className={styles.notIncludedTitle}>{"What's Not Included, and Why"}</h2>

        <div className={styles.notIncludedGrid}>
          {BOTTOM_NOT_INCLUDED.map((r) => (
            <div key={r.heading}>
              <div className={styles.notIncludedHeading}>{r.heading}</div>
              <div className={styles.notIncludedBody}>{r.body}</div>
            </div>
          ))}
        </div>
      </div>

      {lightboxMounted && active ? (
        <div
          className={styles.lightboxOverlay + (lightboxVisible ? " " + styles.lightboxOverlayOpen : "")}
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <div
            ref={modalRef}
            className={styles.lightboxModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="wi-lightbox-title"
          >
            <div className={styles.lightboxHeader}>
              <div id="wi-lightbox-title" className={styles.lightboxTitle}>
                Technical drawing {active.label}
              </div>

              <button
                ref={closeBtnRef}
                type="button"
                className={styles.iconButton}
                onClick={closeLightbox}
                aria-label="Close"
              >
                <img className={styles.icon} src={imgSrc(iconClose)} alt="" aria-hidden="true" draggable={false} />
              </button>
            </div>

            <div className={styles.lightboxBody}>
              <div className={styles.lightboxImageWrap}>
                <img className={styles.lightboxImage} src={active.src} alt={active.alt} />
              </div>

              <div className={styles.lightboxNav}>
                <button type="button" className={styles.navButton} onClick={goPrev} aria-label="Previous">
                  <img className={styles.icon} src={imgSrc(iconArrowLeft)} alt="" aria-hidden="true" draggable={false} />
                  <span>Prev</span>
                </button>

                <div className={styles.navCenter}>
                  {activePlan == null ? "" : `${activePlan + 1} / ${planImages.length}`}
                </div>

                <button type="button" className={styles.navButton} onClick={goNext} aria-label="Next">
                  <span>Next</span>
                  <img className={styles.icon} src={imgSrc(iconArrowRight)} alt="" aria-hidden="true" draggable={false} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default WhatsIncludedPageRebuild;
