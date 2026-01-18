"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type PolicyModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function PolicyModal(props: PolicyModalProps) {
  const [mounted, setMounted] = useState(false);
  const { open, onClose } = props;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-hidden={!open}
    >
      <div className="relative w-full max-w-3xl rounded-[24px] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div className="text-[14px] font-semibold text-neutral-900">{props.title}</div>
        </div>

        <div className="px-5 pb-5 pt-4">
          <div className="max-h-[70vh] overflow-auto rounded-[18px] border border-stone-200 bg-white p-4 text-[13px] leading-6 text-neutral-800">
            {props.children}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
