import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { BookmarkletLink } from "@/components/site/Bookmarklet";
import { Card, CardContent } from "@/components/ui/8bit/card";
import { Kbd } from "@/components/ui/8bit/kbd";

export const metadata = {
  title: "Demo article — Webcade",
  description:
    "A sample text-heavy page so you can try the Webcade bookmarklet without leaving the site.",
};

export default function DemoPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 pb-24 pt-12">
          <Card font="normal" className="mb-12">
            <CardContent className="p-6">
              <p className="retro text-[10px] tracking-wider uppercase text-muted-foreground">
                Demo
              </p>
              <h2 className="retro mt-3 text-base">
                Try the bookmarklet on this page
              </h2>
              <p className="mt-4 text-sm text-muted-foreground">
                Click the button below to launch a game right here. Move the
                mouse to control the paddle. Press <Kbd>Esc</Kbd> to exit.
              </p>
              <div className="mt-6">
                <BookmarkletLink>Play this page</BookmarkletLink>
              </div>
            </CardContent>
          </Card>

          <article>
            <h1 className="retro text-balance text-2xl leading-snug sm:text-3xl">
              The unreasonable charm of breaking your own webpage
            </h1>
            <p className="retro mt-4 text-[10px] tracking-wider uppercase text-muted-foreground">
              Filed under internet curiosities · 6 minute read
            </p>

            <div className="mt-10 space-y-6 text-base leading-7 text-foreground/90">
              <p>
                The web is a strange and crowded place. Every day we wade
                through articles, documentation, social feeds, and endless
                blocks of small text — and most of the time, we are simply
                tourists in someone else&rsquo;s sentences.
              </p>
              <p>
                But sometimes, in the gap between meetings, what you really want
                is not another paragraph of insight. You want to break
                something. Something safe. Something that does not matter. The
                page in front of you, for example.
              </p>

              <h2 className="retro mt-12 text-xl leading-snug">
                A small thesis
              </h2>
              <p>
                Pages are made of rectangles. Headlines are rectangles.
                Paragraphs are stacks of rectangles. Links, captions, footnotes
                — rectangles all the way down. The browser already knows where
                each one of them is. It knows their width, their height, their
                position on the screen, and the text they contain.
              </p>
              <p>
                Once you accept that, the rest is small. If a page is a grid of
                rectangles, then a page is also a grid of bricks. And if a page
                is a grid of bricks, well, you know what to do.
              </p>

              <h2 className="retro mt-12 text-xl leading-snug">
                What you are about to do
              </h2>
              <p>
                In a moment, you will click a button. The button will run a
                small script. The script will scan this article for every line
                of text it can see, and turn each line into a brick. Then it
                will hand you a paddle and a ball. Your job is the obvious one.
              </p>
              <p>
                There are three lives. There is no save file. The bricks are
                not real. Neither, if you think about it long enough, is most
                of the rest of the internet. So aim for the headlines first.
                They were always the loudest.
              </p>

              <h2 className="retro mt-12 text-xl leading-snug">
                A short list of things this is not
              </h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>This is not a productivity tool.</li>
                <li>This is not an extension. Nothing is installed.</li>
                <li>This is not a comment on your reading habits.</li>
                <li>This is not, despite appearances, a metaphor.</li>
              </ul>

              <h2 className="retro mt-12 text-xl leading-snug">
                One more paragraph for ammunition
              </h2>
              <p>
                If you have read this far, the page now contains exactly enough
                bricks to make a satisfying level. Thank you for your patience.
                You have earned the right to demolish all of it. Go ahead and
                click the button. The text will still be here when you come
                back.
              </p>
            </div>
          </article>

          <Card font="normal" className="mt-16">
            <CardContent className="flex flex-col items-start gap-4 p-6">
              <p className="text-sm text-muted-foreground">
                Ready? Move the mouse to steer. Press <Kbd>Esc</Kbd> to exit.
                Press <Kbd>Space</Kbd> to restart after game over.
              </p>
              <BookmarkletLink>Play this page</BookmarkletLink>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
