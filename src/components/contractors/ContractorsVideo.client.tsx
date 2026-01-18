"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function getVideoEmbedUrl(url: string): string {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }

    return url;
  } catch {
    return url;
  }
}

type ContractorsVideoProps = {
  url?: string | null;
  posterUrl?: string | null;
};

export function ContractorsVideo(props: ContractorsVideoProps) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const embedUrl = useMemo(() => {
    const raw = String(props.url || "").trim();
    if (!raw) return null;
    const resolved = getVideoEmbedUrl(raw);
    if (!resolved) return null;

    try {
      const u = new URL(resolved);
      if (u.hostname.includes("youtube.com") || u.hostname.includes("player.vimeo.com")) {
        u.searchParams.set("autoplay", "1");
        u.searchParams.set("rel", "0");
        return u.toString();
      }
    } catch {
      // ignore
    }

    if (resolved.includes("youtube.com/embed/") || resolved.includes("player.vimeo.com/video/")) {
      return resolved.includes("?") ? `${resolved}&autoplay=1` : `${resolved}?autoplay=1`;
    }

    return null;
  }, [props.url]);

  const fileUrl = useMemo(() => {
    const raw = String(props.url || "").trim();
    if (!raw) return null;

    const lower = raw.toLowerCase();
    if (lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".ogg")) return raw;

    return null;
  }, [props.url]);

  const hasSource = Boolean(fileUrl || embedUrl);

  useEffect(() => {
    if (!playing) return;
    if (!fileUrl) return;

    const el = videoRef.current;
    if (!el) return;

    const t = window.setTimeout(() => {
      el.play().catch(() => {
        // ignore
      });
    }, 50);

    return () => window.clearTimeout(t);
  }, [playing, fileUrl]);

  const poster = String(props.posterUrl || "").trim() || "/placeholders/plan-hero.svg";

  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-black shadow-sm">
      {!playing ? (
        <button
          type="button"
          onClick={() => {
            if (!hasSource) return;
            setPlaying(true);
          }}
          className="relative block w-full focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
          aria-label="Play video"
        >
          <img src={poster} alt="" className="block h-[420px] w-full object-cover" draggable={false} />
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-white/90 shadow-md">
              <div
                className="ml-1 h-0 w-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-neutral-900"
                aria-hidden="true"
              />
            </div>
          </div>
        </button>
      ) : fileUrl ? (
        <video ref={videoRef} className="block h-[420px] w-full" controls preload="metadata" poster={poster} src={fileUrl} />
      ) : embedUrl ? (
        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          <iframe
            src={embedUrl}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Video"
          />
        </div>
      ) : (
        <div className="flex h-[420px] w-full items-center justify-center bg-neutral-950 text-sm text-white/80">
          Video unavailable
        </div>
      )}
    </div>
  );
}
