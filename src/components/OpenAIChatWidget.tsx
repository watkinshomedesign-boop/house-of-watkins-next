"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

import { CHAT_CONFIG } from "@/config/chat";

type OpenAIChatKitElement = HTMLElement & {
  setOptions: (options: unknown) => void;
};

export function OpenAIChatWidget() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mountedRef = useRef(false);
  const scriptReadyRef = useRef(false);

  function tryMount() {
    if (!CHAT_CONFIG.openai.enabled) return;
    if (!scriptReadyRef.current) return;
    if (mountedRef.current) return;

    const container = containerRef.current;
    if (!container) return;

    const el = document.createElement("openai-chatkit") as OpenAIChatKitElement;

    el.setOptions({
      api: {
        async getClientSecret(currentClientSecret: string | null) {
          const res = await fetch("/api/chatkit/secret", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              currentClientSecret,
              domainKey: CHAT_CONFIG.openai.domainKey,
              systemPrompt: CHAT_CONFIG.openai.systemPrompt,
            }),
          });

          const json = (await res.json()) as any;
          if (!res.ok) throw new Error(String(json?.error ?? "Failed to create chat session"));
          return String(json?.client_secret ?? "");
        },
      },
      frameTitle: "House of Watkins AI Assistant",
    });

    el.classList.add(
      "h-[560px]",
      "w-[360px]",
      "rounded-xl",
      "border",
      "border-neutral-200",
      "bg-white",
      "shadow-xl",
    );

    container.appendChild(el);
    mountedRef.current = true;
  }

  useEffect(() => {
    tryMount();
    return () => {};
  }, []);

  if (!CHAT_CONFIG.openai.enabled) return null;

  return (
    <>
      <Script
        id="openai-chatkit"
        src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
        strategy="afterInteractive"
        async
        onLoad={() => {
          scriptReadyRef.current = true;
          tryMount();
        }}
      />
      <div className="fixed bottom-4 right-4 z-[60]" ref={containerRef} />
    </>
  );
}
