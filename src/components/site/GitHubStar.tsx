import { cn } from "@/lib/utils";
import "@/components/ui/8bit/styles/retro.css";

function GithubMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.18c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.19-1.48 3.15-1.17 3.15-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.37-5.25 5.65.41.36.78 1.06.78 2.13v3.16c0 .31.21.66.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

const REPO_URL = "https://github.com/SriSomanaath/Webcade";
const REPO_API = "https://api.github.com/repos/SriSomanaath/Webcade";

async function getStarCount(): Promise<number | null> {
  try {
    const res = await fetch(REPO_API, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : null;
  } catch {
    return null;
  }
}

function formatCount(n: number) {
  if (n < 1000) return String(n);
  if (n < 10000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return Math.round(n / 1000) + "k";
}

export async function GitHubStar({
  className,
  variant = "outline",
}: {
  className?: string;
  variant?: "outline" | "solid";
}) {
  const stars = await getStarCount();
  const surface =
    variant === "solid"
      ? "bg-foreground text-background border-foreground"
      : "bg-background text-foreground border-foreground/40 hover:border-foreground";
  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "retro inline-flex items-center gap-2 border-2 px-3 py-2 text-[9px] tracking-wider uppercase transition active:translate-y-[2px]",
        surface,
        className
      )}
      aria-label={`Star Webcade on GitHub${
        stars != null ? ` (${stars} stars)` : ""
      }`}
      title="Star this repo on GitHub"
    >
      <GithubMark className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">Star</span>
      {stars != null && (
        <span
          className={cn(
            "border-l pl-2 font-bold",
            variant === "solid"
              ? "border-background/40"
              : "border-foreground/30"
          )}
        >
          {formatCount(stars)}
        </span>
      )}
    </a>
  );
}
