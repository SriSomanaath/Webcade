import Link from "next/link";
import { Badge } from "@/components/ui/8bit/badge";
import { BookmarkletLink } from "./Bookmarklet";
import { games } from "@/lib/games";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b-4 border-dashed border-foreground/20">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 pb-24 pt-24 text-center sm:pt-28">
        <Badge variant="outline" className="px-3 py-1.5 text-[10px] tracking-wider">
          Insert Coin
        </Badge>

        <h1 className="retro bg-gradient-to-r from-[hsl(350_85%_55%)] via-[hsl(45_85%_55%)] to-[hsl(270_85%_60%)] bg-clip-text text-balance text-3xl leading-snug text-transparent sm:text-5xl">
          Webcade
        </h1>

        <div aria-hidden className="-mt-2 flex items-center gap-1.5">
          {games.map((g) => (
            <span
              key={g.slug}
              className="h-2.5 w-2.5"
              style={{ background: `hsl(${g.hue} 78% 55%)` }}
            />
          ))}
        </div>

        <p className="retro text-[10px] tracking-wider uppercase text-muted-foreground">
          Web · Arcade · One bookmarklet
        </p>

        <p className="text-balance max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Webcade turns any webpage into a playable arcade game. Articles,
          documentation, social feeds, endless headlines — drop in the
          bookmarklet and they become Brickout, Snake, Page Raiders, Whack the
          Page, and Page Taxi. No install. No extension.
        </p>

        <div className="mt-2 flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <BookmarkletLink>Get Webcade</BookmarkletLink>
            <Link
              href="/play/demo"
              className="retro inline-flex items-center gap-2 border-2 border-dashed border-foreground/40 bg-background px-4 py-2.5 text-[10px] tracking-wider uppercase hover:border-foreground"
            >
              Try a sample page →
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            Drag the dark button to your bookmarks bar — or click it now to play
            this page.
          </p>
        </div>

        <div className="retro mt-6 inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border-2 border-dashed border-foreground/40 px-4 py-2 text-[9px] tracking-wider uppercase">
          <span className="text-muted-foreground">Made by</span>
          <a
            href="https://x.com/SriNath693"
            target="_blank"
            rel="noreferrer"
            className="text-foreground hover:opacity-70"
          >
            SriNath
          </a>
          <span aria-hidden className="text-muted-foreground">·</span>
          <a
            href="https://x.com/SriNath693"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            @SriNath693
          </a>
          <span aria-hidden className="text-muted-foreground">·</span>
          <a
            href="https://srisomanaathdev.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            Portfolio →
          </a>
        </div>

        <div className="retro mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[9px] tracking-wider uppercase text-muted-foreground">
          <span>5 games</span>
          <span aria-hidden>·</span>
          <span>No install</span>
          <span aria-hidden>·</span>
          <span>Client-side</span>
          <span aria-hidden>·</span>
          <span>Free forever</span>
        </div>
      </div>
    </section>
  );
}
