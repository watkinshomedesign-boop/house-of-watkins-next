import Link from "next/link";
import { urlForImage } from "@/lib/sanity/image";
import { Reveal } from "@/components/Reveal";

type PortfolioIndexPageProps = {
  tiles?: {
    key: string;
    href?: string;
    image: unknown;
    alt: string;
  }[];
};

type PortfolioTile = NonNullable<PortfolioIndexPageProps["tiles"]>[number];

type SvgRect = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

const SVG_VIEWBOX = { width: 1728, height: 2592 };
const TARGET_WIDTH_PX = 1440;
const TARGET_SCALE = TARGET_WIDTH_PX / SVG_VIEWBOX.width;

function rectToBox(rect: SvgRect) {
  const left = (1728 - 0.12 * rect.yMax) * TARGET_SCALE;
  const top = (2592 - 0.12 * rect.xMax) * TARGET_SCALE;
  const width = (0.12 * (rect.yMax - rect.yMin)) * TARGET_SCALE;
  const height = (0.12 * (rect.xMax - rect.xMin)) * TARGET_SCALE;
  return { left, top, width, height };
}

// Derived from assets/PortfolioLayout_filled.svg path rectangles (pre-transform coords).
// Order is top-to-bottom, left-to-right visually after transform.
const SVG_SLOTS: SvgRect[] = [
  // Top row: wide (right 2 columns)
  { xMin: 16891.992187, xMax: 20747.005208, yMin: 1126.985677, yMax: 8990.00651 },
  // Row 2: left
  { xMin: 12883.984375, xMax: 16737.988281, yMin: 9144.010417, yMax: 12998.014323 },
  // Row 2: middle
  { xMin: 12883.984375, xMax: 16737.988281, yMin: 5134.99349, yMax: 8990.00651 },
  // Row 2-3: tall right
  { xMin: 8875, xMax: 16737.988281, yMin: 1126.985677, yMax: 4980.989583 },
  // Row 3: wide left 2 columns
  { xMin: 8875, xMax: 12730.013021, yMin: 5134.99349, yMax: 12998.014323 },
  // Row 4: left-ish (upper)
  { xMin: 4866.992188, xMax: 8720.996094, yMin: 1126.985677, yMax: 6984.99349 },
  // Row 4: left-ish (lower)
  { xMin: 4866.992188, xMax: 8720.996094, yMin: 7140.00651, yMax: 12998.014323 },
  // Bottom row: full width
  { xMin: 858.007812, xMax: 4712.011719, yMin: 1126.985677, yMax: 12998.014323 },
];

function getImageUrl(source: unknown): string | null {
  if (!source) return null;
  if (typeof source === "string") return source;
  try {
    return urlForImage(source as any).width(1600).height(1200).fit("crop").url();
  } catch {
    return null;
  }
}

export function PortfolioIndexPage(props: PortfolioIndexPageProps) {
  const items = Array.isArray(props.tiles) ? props.tiles.slice(0, 8) : [];
  const padded: (PortfolioTile | null)[] = Array.from({ length: 8 }, (_, i) => items[i] ?? null);

  const boxes = SVG_SLOTS.map(rectToBox);
  const bounds = boxes.reduce(
    (acc, b) => {
      const right = b.left + b.width;
      const bottom = b.top + b.height;
      return {
        minLeft: Math.min(acc.minLeft, b.left),
        minTop: Math.min(acc.minTop, b.top),
        maxRight: Math.max(acc.maxRight, right),
        maxBottom: Math.max(acc.maxBottom, bottom),
      };
    },
    {
      minLeft: Number.POSITIVE_INFINITY,
      minTop: Number.POSITIVE_INFINITY,
      maxRight: 0,
      maxBottom: 0,
    },
  );
  const layoutWidth = bounds.maxRight - bounds.minLeft;
  const layoutHeight = bounds.maxBottom - bounds.minTop;

  const TAGLINE_LEFT_PX = 72;
  const TAGLINE_TOP_PX = 72;
  const TAGLINE_WIDTH_PX = 380;
  const contentWidth = Math.max(layoutWidth, TAGLINE_LEFT_PX + TAGLINE_WIDTH_PX);

  return (
    <main className="mx-auto flex w-full max-w-none items-center justify-center px-4 py-12 min-h-[calc(100vh-240px)]">
      <div className="mx-auto relative max-w-full" style={{ width: `${contentWidth}px` }}>
        <Reveal>
          <div
            className="absolute z-10 pt-1 text-left"
            style={{ left: TAGLINE_LEFT_PX, top: TAGLINE_TOP_PX, width: TAGLINE_WIDTH_PX }}
          >
            <div className="text-[25px] leading-[35px] tracking-[0.24em] text-neutral-500">EACH HOME</div>
            <div className="mt-1 text-[25px] leading-[35px] tracking-[0.24em] text-neutral-500">IS UNIQUE</div>
            <div className="mt-1 text-[25px] leading-[35px] tracking-[0.24em] text-neutral-500">BECAUSE</div>
            <div className="mt-1 text-[25px] leading-[35px] tracking-[0.24em] text-neutral-500">EACH CLIENT</div>
            <div className="mt-1 text-[25px] leading-[35px] tracking-[0.24em] text-neutral-500">IS UNIQUE</div>
          </div>
        </Reveal>

        <div className="relative z-0" style={{ width: `${layoutWidth}px`, height: `${layoutHeight}px` }}>
          {padded.map((item, index) => {
            const b = boxes[index];
            const tileStyle: React.CSSProperties = {
              position: "absolute",
              left: b.left - bounds.minLeft,
              top: b.top - bounds.minTop,
              width: b.width,
              height: b.height,
            };

            if (!item) {
              return (
                <div
                  key={`placeholder-${index}`}
                  className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50"
                  style={tileStyle}
                />
              );
            }

            const src = getImageUrl(item.image);
            if (!src) {
              return (
                <div
                  key={item.key}
                  className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50"
                  style={tileStyle}
                />
              );
            }

            const inner = (
              <div className="h-full w-full overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow duration-200 ease-out transition-transform group-hover:shadow-lg hover:shadow-lg group-hover:scale-[0.98] hover:scale-[0.98] group-focus-visible:ring-2 group-focus-visible:ring-orange-600 group-focus-visible:ring-offset-2">
                <div className="relative h-full w-full">
                  <img
                    src={src}
                    alt={item.alt}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100" />
                </div>
              </div>
            );

            return (
              <Reveal key={item.key} delayMs={(index % 6) * 60}>
                {item.href ? (
                  <Link href={item.href} className="group block cursor-pointer focus:outline-none" style={tileStyle}>
                    {inner}
                  </Link>
                ) : (
                  <div className="group" style={tileStyle}>
                    {inner}
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function PortfolioIndexPageRouteStub() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Portfolio</h1>
      <p className="mt-4 text-sm text-neutral-600">This route is not configured.</p>
    </main>
  );
}

export default PortfolioIndexPageRouteStub;
