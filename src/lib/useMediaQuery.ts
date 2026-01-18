import { useSyncExternalStore } from "react";

export const MD_UP_MEDIA_QUERY = "(min-width: 768px)";

export function useMediaQuery(query: string, options?: { serverFallback?: boolean }) {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mql = window.matchMedia(query);
      const handler = () => onStoreChange();
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    },
    () => window.matchMedia(query).matches,
    () => options?.serverFallback ?? false
  );
}
