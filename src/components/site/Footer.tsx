import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t-4 border-dashed border-foreground/20">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="retro text-[10px] tracking-wider uppercase text-muted-foreground">
              Created by
            </p>
            <p className="retro mt-3 text-2xl leading-snug">SriNath</p>

            <div className="retro mt-6 flex flex-wrap items-center gap-3 text-[10px] tracking-wider uppercase">
              <a
                href="https://srisomanaathdev.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border-2 border-foreground bg-foreground px-4 py-2 text-background transition active:translate-y-[2px] hover:opacity-90"
              >
                Portfolio
                <ArrowUpRight className="h-3 w-3" aria-hidden />
              </a>
              <a
                href="https://x.com/SriNath693"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border-2 border-foreground/40 bg-background px-4 py-2 transition active:translate-y-[2px] hover:border-foreground"
              >
                X / @SriNath693
                <ArrowUpRight className="h-3 w-3" aria-hidden />
              </a>
            </div>
          </div>

          <nav className="retro flex items-center gap-6 text-[10px] tracking-wider uppercase text-muted-foreground">
            <a href="#how" className="hover:text-foreground">
              How
            </a>
            <a href="#games" className="hover:text-foreground">
              Games
            </a>
            <a href="#faq" className="hover:text-foreground">
              FAQ
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
