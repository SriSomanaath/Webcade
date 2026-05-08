import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import { BookmarkletLink } from "./Bookmarklet";

const steps = [
  {
    n: "01",
    title: "Drag the bookmarklet",
    body: "Drag the Webcade button to your browser's bookmark bar. One-time setup, takes a second.",
  },
  {
    n: "02",
    title: "Open any webpage",
    body: "Visit a news article, the docs you're stuck on, a Wikipedia rabbit hole, your social feed — anything.",
  },
  {
    n: "03",
    title: "Click the bookmark",
    body: "The page instantly turns into an arcade game. The text and layout become the level.",
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
              Play games on any webpage
            </h2>
          </div>
          <BookmarkletLink className="hidden sm:inline-flex">
            Get the bookmarklet
          </BookmarkletLink>
        </div>

        <ol className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n}>
              <Card font="normal" className="h-full">
                <CardHeader>
                  <CardTitle className="retro text-xs tracking-wider uppercase text-muted-foreground">
                    Step {s.n}
                  </CardTitle>
                  <CardDescription className="retro mt-3 text-base text-foreground">
                    {s.title}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
