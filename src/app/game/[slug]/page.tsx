import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { BookmarkletLink } from "@/components/site/Bookmarklet";
import { Card, CardContent } from "@/components/ui/8bit/card";
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

  return (
    <>
      <Nav />
      <main className="flex-1">
        <section>
          <div className="mx-auto max-w-4xl px-6 pb-16 pt-12 sm:pt-20">
            <Link
              href="/#games"
              className="retro inline-flex items-center gap-2 text-[10px] tracking-wider uppercase text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" />
              All games
            </Link>

            <h1 className="retro mt-8 text-balance text-3xl leading-snug sm:text-4xl">
              {game.name}
            </h1>
            <p className="mt-6 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
              {game.tagline}
            </p>
            <p className="mt-3 max-w-2xl text-base text-foreground/80">
              {game.description}
            </p>

            <div className="mt-10 flex flex-col items-start gap-3">
              <BookmarkletLink>Play {game.name}</BookmarkletLink>
              <p className="text-xs text-muted-foreground">
                Drag to your bookmarks bar — or click to play this page.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-24">
          <Card font="normal">
            <CardContent className="p-8 text-center">
              <p className="retro text-[10px] tracking-wider uppercase text-muted-foreground">
                Game preview
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Currently only Brickout is wired up in Webcade. The other games
                are coming soon — the bookmarklet will run them on any page.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </>
  );
}
