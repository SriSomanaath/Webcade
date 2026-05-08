import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { BookmarkletLink } from "@/components/site/Bookmarklet";
import { Progress } from "@/components/ui/8bit/progress";
import { games, gameBySlug } from "@/lib/games";
import type { Metadata } from "next";

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = gameBySlug[slug];
  if (!game) return {};
  return {
    title: `${game.name} — Webcade`,
    description: game.tagline,
  };
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = gameBySlug[slug];
  if (!game) notFound();

  const accent = `hsl(${game.hue} 78% 55%)`;
  const accentSoft = `hsl(${game.hue} 78% 55% / 0.12)`;

  return (
    <>
      <Nav />
      <main className="flex-1">
        <span
          aria-hidden
          className="block h-1.5 w-full"
          style={{ background: accent }}
        />
        <section className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-72"
            style={{
              background: `radial-gradient(60% 60% at 50% 0%, ${accentSoft}, transparent 70%)`,
            }}
          />
          <div className="relative mx-auto max-w-4xl px-6 pb-16 pt-12 sm:pt-20">
            <Link
              href="/#games"
              className="retro inline-flex items-center gap-2 text-[10px] tracking-wider uppercase text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" />
              All games
            </Link>

            <p
              className="retro mt-8 inline-flex items-center gap-2 text-[10px] tracking-wider uppercase"
              style={{ color: accent }}
            >
              <span
                aria-hidden
                className="inline-block h-2.5 w-2.5"
                style={{ background: accent, boxShadow: `0 0 12px ${accent}` }}
              />
              Cabinet · {game.slug}
            </p>

            <h1 className="retro mt-3 text-balance text-3xl leading-snug sm:text-4xl">
              {game.name}
            </h1>
            <p className="mt-6 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
              {game.tagline}
            </p>
            <p className="mt-3 max-w-2xl text-base text-foreground/80">
              {game.description}
            </p>

            <div className="mt-10 flex flex-col items-start gap-3">
              <span
                className="relative inline-block"
                style={{ filter: `drop-shadow(4px 4px 0 ${accent})` }}
              >
                <BookmarkletLink slug={game.slug}>
                  Play {game.name}
                </BookmarkletLink>
              </span>
              <p className="text-xs text-muted-foreground">
                Drag to your bookmarks bar — or click to play this page.
              </p>
            </div>

            <div
              className="mt-16 max-w-2xl border-4 border-dashed border-foreground/20 p-6"
              style={{ ["--prog" as string]: accent }}
            >
              <p
                className="retro mb-6 text-[10px] tracking-wider uppercase"
                style={{ color: accent }}
              >
                Cabinet specs
              </p>
              <ul className="flex flex-col gap-5">
                {(
                  [
                    ["Pace", game.stats.pace],
                    ["Skill", game.stats.skill],
                    ["Chaos", game.stats.chaos],
                    ["Replay", game.stats.replay],
                  ] as const
                ).map(([label, value]) => (
                  <li key={label} className="flex items-center gap-4">
                    <span className="retro w-20 shrink-0 text-[9px] tracking-wider uppercase text-muted-foreground">
                      {label}
                    </span>
                    <div className="flex-1">
                      <Progress
                        variant="retro"
                        value={value}
                        progressBg="bg-[var(--prog)]"
                        className="h-3"
                      />
                    </div>
                    <span
                      className="retro w-12 shrink-0 text-right text-[9px] tracking-wider tabular-nums text-muted-foreground"
                    >
                      {String(value).padStart(3, "0")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
