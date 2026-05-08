import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import { games } from "@/lib/games";

export function GameGrid() {
  return (
    <section id="games" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 flex flex-col items-start gap-3">
        <p className="retro text-[10px] tracking-wider uppercase text-muted-foreground">
          The lineup
        </p>
        <h2 className="retro text-2xl leading-snug sm:text-3xl">
          5 Arcade Games — Free Forever
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          Each game uses the page&rsquo;s real text, links and layout to
          generate a one-of-a-kind level. No two playthroughs are the same.
        </p>
      </div>

      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((g, i) => (
          <li key={g.slug}>
            <Link
              href={`/game/${g.slug}`}
              className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
            >
              <Card font="normal" className="h-full transition-transform group-hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="retro text-base">
                      {g.name}
                    </CardTitle>
                    <span
                      aria-hidden
                      className="retro grid place-items-center border-2 border-foreground bg-foreground px-1.5 py-0.5 text-[9px] text-background"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <CardDescription className="mt-3 text-sm leading-relaxed text-foreground/80">
                    {g.tagline}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-end justify-between gap-4 pt-0">
                  <span className="retro text-[10px] tracking-wider uppercase text-muted-foreground">
                    Press start →
                  </span>
                  <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
