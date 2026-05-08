import { Newspaper, BookOpen, Code2, MessageSquare, GraduationCap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";

const pages = [
  { Icon: Newspaper, label: "News Sites", note: "Headlines become bricks." },
  { Icon: BookOpen, label: "Wikipedia", note: "Long articles are the perfect maze." },
  { Icon: Code2, label: "Developer Docs", note: "Stuck on docs? Smash them." },
  { Icon: MessageSquare, label: "Social Feeds", note: "Endless scroll, endless level." },
  { Icon: GraduationCap, label: "Online Learning", note: "Procrastinate, productively." },
];

export function BestPages() {
  return (
    <section id="pages" className="mx-auto max-w-6xl px-6 py-20">
      <p className="retro text-[10px] tracking-wider uppercase text-muted-foreground">
        Best Pages to Play On
      </p>
      <h2 className="retro mt-3 text-2xl leading-snug sm:text-3xl">
        Anywhere there&rsquo;s text, there&rsquo;s a level.
      </h2>

      <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
        {pages.map(({ Icon, label, note }) => (
          <li key={label}>
            <Card font="normal" className="h-full">
              <CardHeader>
                <Icon className="h-4 w-4 text-foreground" aria-hidden />
                <CardTitle className="retro mt-3 text-xs leading-relaxed">
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-muted-foreground">
                  {note}
                </CardDescription>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
