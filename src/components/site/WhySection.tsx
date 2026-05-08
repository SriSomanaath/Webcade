import { Layers, Gamepad2, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";

const items = [
  {
    Icon: Layers,
    title: "Every Page Is a Unique Level",
    body: "The text, links, and layout of the page you're on become the level. A Wikipedia article plays nothing like a Twitter feed.",
  },
  {
    Icon: Gamepad2,
    title: "5 Arcade Games, Free Forever",
    body: "Webcade ships with Brickout, Snake, Whack the Page, Page Raiders and Page Taxi. No subscriptions. No accounts. No ads.",
  },
  {
    Icon: Zap,
    title: "One Click, Zero Interruption",
    body: "It's just a bookmarklet. Nothing to install, nothing to sign up for. Click to play, close to leave.",
  },
];

export function WhySection() {
  return (
    <section id="why" className="bg-muted/40">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="retro text-[10px] tracking-wider uppercase text-muted-foreground">
          Why Webcade
        </p>
        <h2 className="retro mt-3 text-2xl leading-snug sm:text-3xl">
          The internet, but playable.
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {items.map(({ Icon, title, body }) => (
            <Card font="normal" key={title} className="h-full">
              <CardHeader>
                <Icon className="h-5 w-5 text-foreground" aria-hidden />
                <CardTitle className="retro mt-4 text-sm leading-relaxed">
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                  {body}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
