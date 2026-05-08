import Link from "next/link";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { BookmarkletLink } from "@/components/site/Bookmarklet";

function PixelGhost() {
  const px = 10;
  type Cell = [number, number];
  const body: Cell[] = [
    [2, 0], [3, 0], [4, 0], [5, 0],
    [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
    [0, 3], [1, 3], [3, 3], [4, 3], [6, 3], [7, 3],
    [0, 4], [1, 4], [3, 4], [4, 4], [6, 4], [7, 4],
    [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5],
    [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6],
    [0, 7], [2, 7], [4, 7], [5, 7], [7, 7],
  ];
  const eyes: Cell[] = [
    [2, 3], [5, 3],
  ];
  return (
    <svg
      width={8 * px}
      height={8 * px}
      viewBox="0 0 8 8"
      shapeRendering="crispEdges"
      aria-hidden
      className="mx-auto"
    >
      <g fill="hsl(350 85% 55%)">
        {body.map(([x, y]) => (
          <rect key={`b${x}-${y}`} x={x} y={y} width={1} height={1} />
        ))}
      </g>
      <g fill="#0d0d12">
        {eyes.map(([x, y]) => (
          <rect key={`e${x}-${y}`} x={x} y={y} width={1} height={1} />
        ))}
      </g>
    </svg>
  );
}

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-6 py-24 text-center sm:py-32">
          <p className="retro text-[10px] tracking-wider uppercase text-muted-foreground">
            Insert Coin to Continue
          </p>

          <h1 className="retro bg-gradient-to-r from-[hsl(350_85%_55%)] via-[hsl(45_85%_55%)] to-[hsl(270_85%_60%)] bg-clip-text text-7xl leading-none text-transparent sm:text-9xl">
            404
          </h1>

          <PixelGhost />

          <h2 className="retro text-balance text-xl leading-snug sm:text-2xl">
            Game Over.
          </h2>

          <p className="max-w-md text-balance text-muted-foreground">
            This room doesn&rsquo;t exist on the cabinet. The page you&rsquo;re
            looking for has wandered into a different arcade.
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
            <BookmarkletLink>Get Webcade</BookmarkletLink>
            <Link
              href="/"
              className="retro inline-flex items-center gap-2 border-2 border-dashed border-foreground/40 bg-background px-4 py-2.5 text-[10px] tracking-wider uppercase hover:border-foreground"
            >
              ← Back to lobby
            </Link>
          </div>

          <p className="retro mt-4 text-[9px] tracking-wider uppercase text-muted-foreground">
            Press any key to retry
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
