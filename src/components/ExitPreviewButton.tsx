"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export function ExitPreviewButton() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const redirect = useMemo(() => {
    const qs = searchParams?.toString();
    return `${pathname || "/"}${qs ? `?${qs}` : ""}`;
  }, [pathname, searchParams]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <a
        href={`/api/exit-preview?redirect=${encodeURIComponent(redirect)}`}
        className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-lg"
      >
        Exit preview
      </a>
    </div>
  );
}
