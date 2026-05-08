"use client";

import { useEffect, useRef } from "react";
import { Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";
import "@/components/ui/8bit/styles/retro.css";

function buildHref(origin: string, slug?: string) {
  const safe = slug && /^[a-z0-9-]+$/.test(slug) ? slug : "";
  const setGame = safe
    ? `window.__webcade_game='${safe}';`
    : "";
  const loader = `(function(){${setGame}var s=document.createElement('script');s.src='${origin}/bookmarklet.js?t='+Date.now();document.body.appendChild(s);})();`;
  return "javascript:" + loader;
}

type Variant = "solid" | "outline";

export function BookmarkletLink({
  className = "",
  children,
  variant = "solid",
  slug,
}: {
  className?: string;
  children?: React.ReactNode;
  variant?: Variant;
  slug?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.setAttribute("href", buildHref(window.location.origin, slug));
  }, [slug]);

  const solid = variant === "solid";
  const surface = solid
    ? "bg-foreground text-background"
    : "bg-background text-foreground";
  const pixelColor = "bg-foreground dark:bg-ring";

  return (
    <a
      ref={ref}
      draggable
      title="Drag me to your bookmarks bar — or click to try here"
      className={cn(
        "retro relative inline-flex select-none items-center justify-center gap-2 px-5 py-3 text-[10px] tracking-wider uppercase rounded-none cursor-grab active:translate-y-[3px] transition-transform",
        surface,
        className
      )}
    >
      <Gamepad2 className="h-3 w-3" aria-hidden />
      <span>{children ?? "Webcade"}</span>

      <span className={cn("absolute -top-1.5 w-1/2 left-1.5 h-1.5", pixelColor)} />
      <span className={cn("absolute -top-1.5 w-1/2 right-1.5 h-1.5", pixelColor)} />
      <span className={cn("absolute -bottom-1.5 w-1/2 left-1.5 h-1.5", pixelColor)} />
      <span className={cn("absolute -bottom-1.5 w-1/2 right-1.5 h-1.5", pixelColor)} />
      <span className={cn("absolute top-0 left-0 size-1.5", pixelColor)} />
      <span className={cn("absolute top-0 right-0 size-1.5", pixelColor)} />
      <span className={cn("absolute bottom-0 left-0 size-1.5", pixelColor)} />
      <span className={cn("absolute bottom-0 right-0 size-1.5", pixelColor)} />
      <span className={cn("absolute top-1.5 -left-1.5 h-[calc(100%-12px)] w-1.5", pixelColor)} />
      <span className={cn("absolute top-1.5 -right-1.5 h-[calc(100%-12px)] w-1.5", pixelColor)} />
    </a>
  );
}
