import { Bookmark, Globe, MousePointerClick } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import { BookmarkletLink } from "./Bookmarklet";
import { DemoVideo } from "./DemoVideo";

const steps = [
  {
    n: "01",
    hue: 350,
    icon: Bookmark,
    title: "Drag the bookmarklet",
    body: "Drag the Get Webcade button to your browser's bookmarks bar. One-time setup. If your bookmarks bar isn't visible, press Cmd+Shift+B (Mac) or Ctrl+Shift+B (Windows / Linux) to show it first.",
  },
  {
    n: "02",
    hue: 140,
    icon: Globe,
    title: "Open any webpage",
    body: "Visit a news article, the docs you're stuck on, a Wikipedia rabbit hole, your social feed — anything with text and layout.",
  },
  {
    n: "03",
    hue: 270,
    icon: MousePointerClick,
    title: "Click the bookmark",
    body: "The page instantly turns into an arcade game. The text and layout become the level. Press Esc anytime to exit and return to the original page.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-muted/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="retro text-[10px] tracking-wider uppercase text-muted-foreground">
              How it works
            </p>
            <h2 className="retro mt-3 text-2xl leading-snug sm:text-3xl">
              Three steps. No install. No extension.
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Webcade is a bookmarklet — a tiny piece of JavaScript that lives
              in your browser&rsquo;s bookmarks bar. Drag it once, then click
              it on any webpage to launch a game.
            </p>
          </div>
          <BookmarkletLink className="hidden sm:inline-flex">
            Get the bookmarklet
          </BookmarkletLink>
        </div>

        <figure className="mt-12">
          <div className="relative overflow-hidden p-6 sm:p-12">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: [
                  "radial-gradient(45% 55% at 0% 0%, hsl(350 80% 60% / 0.45), transparent 70%)",
                  "radial-gradient(45% 55% at 100% 0%, hsl(45 90% 60% / 0.40), transparent 70%)",
                  "radial-gradient(55% 65% at 0% 100%, hsl(270 80% 60% / 0.40), transparent 70%)",
                  "radial-gradient(55% 65% at 100% 100%, hsl(30 85% 60% / 0.35), transparent 70%)",
                ].join(", "),
              }}
            />
            <div className="relative aspect-video w-full overflow-hidden border-4 border-foreground/40 bg-card shadow-2xl">
              <DemoVideo
                className="absolute inset-0 h-full w-full object-cover"
                src="/demos/bricksout-demo.mp4"
                ariaLabel="Webcade demo: dragging the bookmarklet and turning a webpage into Brickout"
              />
            </div>
          </div>
          <figcaption className="retro mt-3 text-center text-[9px] tracking-wider uppercase text-muted-foreground">
            Webcade demo · Brickout in action
          </figcaption>
        </figure>

        <ol className="mt-16 grid gap-8 sm:grid-cols-3">
          {steps.map((s) => {
            const Icon = s.icon;
            const accent = `hsl(${s.hue} 78% 55%)`;
            return (
              <li key={s.n}>
                <Card font="normal" className="h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className="grid h-10 w-10 place-items-center border-2 text-background"
                        style={{ background: accent, borderColor: accent }}
                      >
                        <Icon className="h-5 w-5" aria-hidden />
                      </div>
                      <span
                        aria-hidden
                        className="retro grid place-items-center border-2 px-1.5 py-0.5 text-[9px] text-background"
                        style={{ background: accent, borderColor: accent }}
                      >
                        Step {s.n}
                      </span>
                    </div>
                    <CardTitle className="retro mt-4 text-base">
                      {s.title}
                    </CardTitle>
                    <CardDescription className="mt-3 text-sm leading-relaxed text-foreground/80">
                      {s.body}
                    </CardDescription>
                  </CardHeader>
                  <CardContent />
                </Card>
              </li>
            );
          })}
        </ol>

        <div className="mt-12 flex flex-col items-start gap-4 border-2 border-dashed border-foreground/20 bg-background p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="retro text-[10px] tracking-wider uppercase text-muted-foreground">
              Quick controls
            </p>
            <p className="retro mt-2 text-sm">
              Esc <span className="text-muted-foreground">to exit</span> ·
              Space <span className="text-muted-foreground">to restart</span> ·
              Mouse / arrow keys <span className="text-muted-foreground">to play</span>
            </p>
          </div>
          <BookmarkletLink className="!px-4 !py-2.5 text-[10px]">
            Get Webcade
          </BookmarkletLink>
        </div>
      </div>
    </section>
  );
}
