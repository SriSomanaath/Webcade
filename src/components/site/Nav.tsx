import Link from "next/link";
import { BookmarkletLink } from "./Bookmarklet";
import { GitHubStar } from "./GitHubStar";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b-4 border-dashed border-foreground/20 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="retro grid h-7 w-7 place-items-center bg-foreground text-[10px] text-background">
            W
          </span>
          <span className="retro text-xs tracking-wider">Webcade</span>
        </Link>

        <nav className="retro hidden items-center gap-6 text-[10px] tracking-wider uppercase text-muted-foreground md:flex">
          <a href="/#how" className="hover:text-foreground">
            How
          </a>
          <a href="/#games" className="hover:text-foreground">
            Games
          </a>
          <a href="/#faq" className="hover:text-foreground">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://srisomanaathdev.vercel.app/"
            target="_blank"
            rel="noreferrer"
            className="retro hidden text-[9px] tracking-wider uppercase text-muted-foreground hover:text-foreground lg:inline"
          >
            by SriNath →
          </a>
          <GitHubStar />
          <BookmarkletLink className="!px-3 !py-2 text-[9px]">
            Get it
          </BookmarkletLink>
        </div>
      </div>
    </header>
  );
}
