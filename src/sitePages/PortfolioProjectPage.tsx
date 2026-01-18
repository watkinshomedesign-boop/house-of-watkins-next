"use client";

import Link from "next/link";
import type { PortfolioImage, PortfolioProject } from "@/lib/portfolio/types";
import { urlForImage } from "@/lib/sanity/image";
import { Reveal } from "@/components/Reveal";
import { useTypographyStyle } from "@/lib/typographyContext";
import { getTextStyleCss } from "@/lib/typography";
import styles from "@/sitePages/PortfolioProjectTemplates.module.css";

type PortfolioProjectPageProps = {
  project: PortfolioProject;
};

type PortfolioTemplateId = "A" | "B" | "C";

const EMPTY_IMAGE: PortfolioImage = { image: null, alt: "" };

function getImageUrl(source: unknown): string {
  if (!source) return "/placeholders/plan-hero.svg";
  if (typeof source === "string") return source;
  try {
    return urlForImage(source as any).width(1600).fit("max").url();
  } catch {
    return "/placeholders/plan-hero.svg";
  }
}

function GalleryTile(props: { item: PortfolioImage }) {
  const src = getImageUrl(props.item.image);
  const alt = props.item.alt ?? "";

  return (
    <div className={styles.tile}>
      <img src={src} alt={alt} className={styles.image} />
    </div>
  );
}

function getTemplateForProject(project: PortfolioProject): PortfolioTemplateId {
  const slug = String(project.slug || "").toLowerCase();
  const title = String(project.title || "").toLowerCase();
  const key = `${slug} ${title}`.trim();

  if (key.includes("high desert contemporary")) {
    return "A";
  }

  if (key.includes("narrow")) {
    return "A";
  }

  return "B";
}

function renderTemplateA(items: PortfolioImage[]) {
  const a = items.slice(0, 5);
  return (
    <div className={styles.galleryA} data-template="A">
      <div className={styles.galleryATile1}>{a[0] ? <GalleryTile item={a[0]} /> : null}</div>
      <div className={styles.galleryATile2}>{a[1] ? <GalleryTile item={a[1]} /> : null}</div>
      <div className={styles.galleryATile3}>{a[2] ? <GalleryTile item={a[2]} /> : null}</div>
      <div className={styles.galleryATile4}>{a[3] ? <GalleryTile item={a[3]} /> : null}</div>
      <div className={styles.galleryATile5}>{a[4] ? <GalleryTile item={a[4]} /> : null}</div>
    </div>
  );
}

function renderTemplateB(items: PortfolioImage[]) {
  const b = Array.from({ length: 6 }, (_, idx) => items[idx] ?? EMPTY_IMAGE);
  return (
    <div className={styles.galleryB} data-template="B">
      <div className={styles.galleryBTile1}>{<GalleryTile item={b[0]} />}</div>
      <div className={styles.galleryBTile2}>{<GalleryTile item={b[1]} />}</div>
      <div className={styles.galleryBTile3}>{<GalleryTile item={b[2]} />}</div>
      <div className={styles.galleryBTile4}>{<GalleryTile item={b[3]} />}</div>
      <div className={styles.galleryBTile5}>{<GalleryTile item={b[4]} />}</div>
      <div className={styles.galleryBTile6}>{<GalleryTile item={b[5]} />}</div>
    </div>
  );
}

function renderTemplateC(items: PortfolioImage[]) {
  const c = items.slice(0, 6);
  return (
    <div className={styles.galleryC} data-template="C">
      <div className={styles.galleryCTile1}>{c[0] ? <GalleryTile item={c[0]} /> : null}</div>
      <div className={styles.galleryCTile2}>{c[1] ? <GalleryTile item={c[1]} /> : null}</div>
      <div className={styles.galleryCTile3}>{c[2] ? <GalleryTile item={c[2]} /> : null}</div>
      <div className={styles.galleryCTile4}>{c[3] ? <GalleryTile item={c[3]} /> : null}</div>
      <div className={styles.galleryCTile5}>{c[4] ? <GalleryTile item={c[4]} /> : null}</div>
      <div className={styles.galleryCTile6}>{c[5] ? <GalleryTile item={c[5]} /> : null}</div>
    </div>
  );
}

export function PortfolioProjectPage(props: PortfolioProjectPageProps) {
  const project = props.project;
  const template = getTemplateForProject(project);
  const titleStyle = useTypographyStyle("portfolio.title", "Title/40");

  return (
    <main className={styles.page} data-page="portfolio-project">
      <section className={styles.breadcrumbSection}>
        <div className={styles.container}>
          <div className={styles.breadcrumb} data-role="breadcrumb">
            <Link href="/" className={styles.breadcrumbLink}>
              Main
            </Link>
            <span className={styles.breadcrumbSep}>/</span>
            <Link href="/portfolio" className={styles.breadcrumbLink}>
              Portfolio
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.titleSection}>
        <div className={styles.container}>
          <Reveal>
            <h1 className={styles.title} data-role="page-title">
              <span style={getTextStyleCss(titleStyle)}>{project.title}</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className={styles.gallerySection}>
        <div className={styles.container}>
          <div className={styles.galleryWrap}>
            <div className={styles.desktopOnly} data-template={template}>
              {template === "A" ? renderTemplateA(project.gallery) : null}
              {template === "B" ? renderTemplateB(project.gallery) : null}
              {template === "C" ? renderTemplateC(project.gallery) : null}
            </div>

            <div className={styles.mobileFallback}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {project.gallery.map((img, idx) => (
                  <Reveal key={idx} delayMs={(idx % 6) * 60}>
                    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                      <img
                        src={getImageUrl(img.image)}
                        alt={img.alt ?? ""}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          {project.planDetailsUrl ? (
            <div className={styles.planDetails}>
              <Link href={project.planDetailsUrl} className={styles.planDetailsLink}>
                Click here for plan details
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function PortfolioProjectPageRouteStub() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Portfolio Project</h1>
      <p className="mt-4 text-sm text-neutral-600">This route is not configured.</p>
    </main>
  );
}

export default PortfolioProjectPageRouteStub;
