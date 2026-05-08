"use client";

import { cn } from "@/lib/utils";
import "@/components/ui/8bit/styles/retro.css";

function PixelSun({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 9 9"
      shapeRendering="crispEdges"
      aria-hidden
      className={className}
    >
      <g fill="currentColor">
        <rect x="4" y="0" width="1" height="1" />
        <rect x="1" y="1" width="1" height="1" />
        <rect x="7" y="1" width="1" height="1" />
        <rect x="3" y="2" width="3" height="1" />
        <rect x="2" y="3" width="5" height="3" />
        <rect x="3" y="6" width="3" height="1" />
        <rect x="0" y="4" width="1" height="1" />
        <rect x="8" y="4" width="1" height="1" />
        <rect x="1" y="7" width="1" height="1" />
        <rect x="7" y="7" width="1" height="1" />
        <rect x="4" y="8" width="1" height="1" />
      </g>
    </svg>
  );
}

function PixelMoon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 9 9"
      shapeRendering="crispEdges"
      aria-hidden
      className={className}
    >
      <g fill="currentColor">
        <rect x="3" y="0" width="3" height="1" />
        <rect x="1" y="1" width="3" height="1" />
        <rect x="0" y="2" width="3" height="1" />
        <rect x="0" y="3" width="2" height="3" />
        <rect x="0" y="6" width="3" height="1" />
        <rect x="1" y="7" width="3" height="1" />
        <rect x="3" y="8" width="3" height="1" />
      </g>
    </svg>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = !root.classList.contains("dark");
    root.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      title="Toggle theme"
      className={cn(
        "retro relative inline-flex items-center justify-center border-2 border-foreground/40 hover:border-foreground bg-background text-foreground p-2 transition active:translate-y-[2px]",
        className
      )}
    >
      <PixelSun className="block dark:hidden h-3.5 w-3.5" />
      <PixelMoon className="hidden dark:block h-3.5 w-3.5" />
    </button>
  );
}
