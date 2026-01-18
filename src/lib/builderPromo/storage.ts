"use client";

export const BUILDER_CODE_STORAGE_KEY = "moss_builder_code_v1";

export function normalizeBuilderCode(code: string) {
  return code.trim().toUpperCase();
}

export function getStoredBuilderCode(): string {
  try {
    return normalizeBuilderCode(localStorage.getItem(BUILDER_CODE_STORAGE_KEY) ?? "");
  } catch {
    return "";
  }
}

export function setStoredBuilderCode(code: string) {
  const normalized = normalizeBuilderCode(code);
  try {
    if (!normalized) {
      localStorage.removeItem(BUILDER_CODE_STORAGE_KEY);
    } else {
      localStorage.setItem(BUILDER_CODE_STORAGE_KEY, normalized);
    }
    window.dispatchEvent(new Event("moss_builder_code_changed"));
  } catch {
    // ignore
  }
}
