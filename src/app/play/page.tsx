import Link from "next/link";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Card, CardContent } from "@/components/ui/8bit/card";

export const metadata = {
  title: "Webcade — Play",
  description:
    "Mobile-friendly entry point for Webcade. Bookmarklets don't run in mobile browsers; play the demo here instead.",
};

type PlaySearchParams = {
  title?: string;
  text?: string;
  url?: string;
  game?: string;
};

export default async function PlayPage({
  searchParams,
}: {
  searchParams: Promise<PlaySearchParams>;
}) {
  const sp = await searchParams;
  const sharedUrl = sp.url || sp.text || "";
  const sharedTitle = sp.title || "";
  const fromShare = Boolean(sharedUrl || sharedTitle);

  return (
    <>
      <Nav />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 pb-24 pt-12">
          <Card font="normal">
            <CardContent className="space-y-5 p-6">
              <p className="retro text-[10px] tracking-wider uppercase text-muted-foreground">
                {fromShare ? "Shared with Webcade" : "Mobile entry"}
              </p>
              <h1 className="retro text-balance text-xl leading-snug">
                {fromShare ? "Thanks for sharing — there's a catch." : "Heads up."}
              </h1>

              {fromShare && (
                <div className="rounded border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
                  {sharedTitle && (
                    <p className="font-medium text-foreground/90">{sharedTitle}</p>
                  )}
                  {sharedUrl && (
                    <p className="mt-1 break-all font-mono text-[11px]">{sharedUrl}</p>
                  )}
                </div>
              )}

              <p className="text-sm leading-6 text-foreground/85">
                Webcade is a bookmarklet — it only runs from a desktop browser&rsquo;s
                bookmarks bar. Mobile browsers don&rsquo;t expose that surface, so we
                can&rsquo;t turn the page you shared into a level on this device.
              </p>
              <p className="text-sm leading-6 text-foreground/85">
                You can still try a sample game here. On a desktop, drag the
                <span className="font-medium"> Webcade </span>button to your
                bookmarks bar and play any page from there.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/play/demo"
                  className="retro inline-flex select-none items-center gap-2 bg-foreground px-5 py-3 text-[10px] tracking-wider uppercase text-background"
                >
                  Try the sample
                </Link>
                <Link
                  href="/"
                  className="retro inline-flex select-none items-center gap-2 border border-border bg-background px-5 py-3 text-[10px] tracking-wider uppercase text-foreground"
                >
                  Back to landing
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
