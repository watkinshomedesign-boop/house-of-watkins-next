"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function PlanChangeDescriptionModal(props: {
  open: boolean;
  optionLabel: string;
  initialValue: string;
  onClose: () => void;
  onSave: (value: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [value, setValue] = useState(props.initialValue);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!props.open) return;
    setValue(props.initialValue);
  }, [props.open, props.initialValue]);

  useEffect(() => {
    if (!props.open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") props.onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [props.open, props.onClose]);

  if (!mounted || !props.open) return null;

  const title = `Describe the ${props.optionLabel} requested`;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) props.onClose();
      }}
      aria-hidden={!props.open}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div className="text-base font-semibold text-neutral-900">{title}</div>
          <button
            type="button"
            onClick={props.onClose}
            className="rounded-full p-2 text-neutral-600 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-5">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-600"
            placeholder="Type your request here..."
          />

          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={props.onClose}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => props.onSave(value.trim())}
              className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
