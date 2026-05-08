import Link from "next/link";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import "@/components/ui/8bit/styles/retro.css";

const SPONSOR_HREF = "/sponsor";
const ACCENT = "hsl(350 78% 55%)";

export function SponsorButton({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href={SPONSOR_HREF}
      className={cn(
        "retro inline-flex items-center gap-2 border-2 bg-background px-3 py-2 text-[9px] tracking-wider uppercase text-foreground transition active:translate-y-[2px] hover:bg-[hsl(350_78%_55%)] hover:text-background",
        className
      )}
      style={{ borderColor: ACCENT }}
      aria-label="Sponsor Webcade"
      title="Sponsor Webcade"
    >
      <Heart
        className="h-3.5 w-3.5 transition-colors group-hover:text-background"
        style={{ color: ACCENT }}
        fill={ACCENT}
        aria-hidden
      />
      <span className={cn(compact ? "hidden md:inline" : "inline")}>
        Sponsor
      </span>
    </Link>
  );
}
