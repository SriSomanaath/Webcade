import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";

const TIP_URL = "https://dodo.pe/webcade-tip";

export function SponsorCTA() {
  return (
    <section
      id="sponsor"
      className="mx-auto max-w-6xl px-6 py-20"
    >
      <div
        className="relative overflow-hidden border-4 border-dashed border-foreground/30 p-10 sm:p-14"
        style={{
          background:
            "radial-gradient(80% 100% at 0% 0%, hsl(350 78% 55% / 0.12), transparent 60%), radial-gradient(80% 100% at 100% 100%, hsl(45 85% 55% / 0.10), transparent 60%)",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1.5"
          style={{ background: "hsl(350 78% 55%)" }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1.5"
          style={{ background: "hsl(45 85% 55%)" }}
        />

        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p
              className="retro inline-flex items-center gap-2 text-[10px] tracking-wider uppercase"
              style={{ color: "hsl(350 78% 55%)" }}
            >
              <Heart
                className="h-3.5 w-3.5"
                fill="hsl(350 78% 55%)"
                style={{ color: "hsl(350 78% 55%)" }}
                aria-hidden
              />
              Insert Coin
            </p>

            <h2 className="retro mt-4 bg-gradient-to-r from-[hsl(350_85%_55%)] via-[hsl(45_85%_55%)] to-[hsl(270_85%_60%)] bg-clip-text text-balance text-2xl leading-snug text-transparent sm:text-3xl">
              Keep Webcade running.
            </h2>

            <p className="mt-5 max-w-xl text-balance text-base text-foreground/80 sm:text-lg">
              Webcade is free forever — five arcade games, no ads, no install.
              Drop a coin if it made you smile, or sponsor monthly to fuel new
              cabinets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={TIP_URL}
              target="_blank"
              rel="noreferrer"
              className="retro inline-flex items-center gap-2 border-2 border-foreground bg-foreground px-5 py-3 text-[10px] tracking-wider uppercase text-background transition active:translate-y-[2px] hover:opacity-90"
              style={{
                filter: "drop-shadow(4px 4px 0 hsl(350 78% 55%))",
              }}
            >
              <Heart
                className="h-3 w-3"
                fill="hsl(350 78% 55%)"
                style={{ color: "hsl(350 78% 55%)" }}
                aria-hidden
              />
              Drop a coin
            </a>
            <Link
              href="/sponsor"
              className="retro inline-flex items-center gap-2 border-2 border-foreground/40 bg-background px-5 py-3 text-[10px] tracking-wider uppercase transition active:translate-y-[2px] hover:border-foreground"
            >
              Sponsor monthly
              <ArrowUpRight className="h-3 w-3" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
