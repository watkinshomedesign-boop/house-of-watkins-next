import React from "react";

function range(n: number) {
  return Array.from({ length: Math.max(0, n) }, (_, i) => i);
}

function SkeletonBlock(props: { className: string }) {
  return (
    <div className={`relative overflow-hidden rounded bg-stone-200/70 ${props.className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer motion-reduce:hidden"
      />
    </div>
  );
}

export function PlanGridSkeleton(props: { count?: number; desktopCols?: 2 | 3; className?: string }) {
  const count = props.count ?? 6;
  const desktopCols = props.desktopCols ?? 3;

  return (
    <div
      aria-hidden="true"
      className={`grid grid-cols-1 gap-y-6 gap-x-6 md:grid-cols-2 ${
        desktopCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
      } motion-reduce:animate-none ${props.className ?? ""}`}
    >
      {range(count).map((i) => (
        <div key={i} className="rounded-[35.584px] bg-stone-50 p-4 md:p-[17.792px]">
          <div className="animate-pulse motion-reduce:animate-none">
            <div className="overflow-hidden rounded-[28.416px]">
              <div className="relative overflow-hidden">
                <div className="aspect-[4/3] w-full bg-stone-200/70" />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer motion-reduce:hidden"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <SkeletonBlock className="h-4 w-3/4" />
              <SkeletonBlock className="h-3 w-1/3" />
            </div>

            <div className="mt-4 flex items-center gap-2">
              <SkeletonBlock className="h-4 w-14" />
              <SkeletonBlock className="h-5 w-20" />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <SkeletonBlock className="h-8 w-full rounded-full" />
              <SkeletonBlock className="h-8 w-full rounded-full" />
              <SkeletonBlock className="h-8 w-full rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PlanListSkeleton(props: { count?: number; className?: string }) {
  const count = props.count ?? 3;

  return (
    <div aria-hidden="true" className={`grid grid-cols-1 gap-6 ${props.className ?? ""}`}>
      {range(count).map((i) => (
        <div key={i} className="overflow-hidden rounded-2xl bg-stone-50">
          <div className="animate-pulse motion-reduce:animate-none">
            <div className="relative overflow-hidden">
              <div className="aspect-[4/3] w-full bg-stone-200/70" />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer motion-reduce:hidden"
              />
            </div>
            <div className="p-4">
              <SkeletonBlock className="h-4 w-3/4" />
              <div className="mt-2">
                <SkeletonBlock className="h-3 w-1/3" />
              </div>

              <div className="mt-4 flex items-center gap-2">
                <SkeletonBlock className="h-3 w-16" />
                <SkeletonBlock className="h-5 w-24" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <SkeletonBlock className="h-9 w-full rounded-full" />
                <SkeletonBlock className="h-9 w-full rounded-full" />
                <SkeletonBlock className="h-9 w-full rounded-full" />
                <SkeletonBlock className="h-9 w-full rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
