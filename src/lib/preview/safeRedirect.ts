export function safeInternalRedirectPath(input: string | null | undefined): string | null {
  const s = String(input ?? "").trim();
  if (!s) return null;
  if (!s.startsWith("/")) return null;

  const lowered = s.toLowerCase();
  if (lowered.startsWith("//")) return null;
  if (lowered.startsWith("/\\")) return null;
  if (lowered.includes("javascript:")) return null;
  if (lowered.includes("http:")) return null;
  if (lowered.includes("https:")) return null;

  return s;
}
