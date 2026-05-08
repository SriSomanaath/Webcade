<div align="center">

# Webcade

**Web. Arcade. One bookmarklet.**

A tiny browser bookmarklet that turns any webpage into a playable Brickout level. Drag, click, the page is a level.

[![Stars](https://img.shields.io/github/stars/SriSomanaath/Webcade?style=for-the-badge&logo=github&color=000)](https://github.com/SriSomanaath/Webcade/stargazers)
[![Next.js](https://img.shields.io/badge/Next.js-16-000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Made by SriNath](https://img.shields.io/badge/made_by-SriNath-000?style=for-the-badge)](https://srisomanaathdev.vercel.app/)

</div>

---

## What it does

Click the bookmarklet on any webpage. The text on the page becomes bricks, a paddle and ball appear, and you're playing **Brickout**. Press `Esc` to exit, the page is exactly as you left it.

That's the whole thing.

## Try it

1. **Run the site locally** (see below) or deploy to Vercel
2. **Drag** the dark `Webcade` button to your browser's bookmarks bar
3. **Click** the bookmark on any page — articles, docs, Wikipedia, social feeds — to play

Or open `/play/demo` for a same-origin sandbox where the bookmarklet is guaranteed to work without fighting third-party CSP.

## Controls

| Action | Key |
|---|---|
| Move paddle | Mouse, or `←` `→` |
| Exit game | `Esc` |
| Restart after game over | `Space` |

## How it's built

The Next.js site is the marketing page that hosts and serves the bookmarklet. The actual game is a separate ~6 KB IIFE bundled by **esbuild** from `bookmarklet/src/index.ts` to `public/bookmarklet.js`.

When the bookmarklet runs on a page, it:

1. **Mounts a Shadow DOM host** on `<body>` (style-isolated, max z-index) so the host page's CSS can't bleed in.
2. **Walks visible text nodes** via `TreeWalker`, getting each line's bounding rectangle from `Range.getClientRects()`.
3. **Treats each rect as a brick** with collision boxes.
4. **Runs the game loop** on a fixed-position canvas overlay — paddle, ball, lives, score.
5. On `Esc` or a second click, **cleans up** all listeners and removes the host.

The on-page `Webcade` button is an `<a>` whose `href` is set imperatively after mount with `useRef` + `setAttribute` — that's how it bypasses **React 19's `javascript:` URL sanitization** (which would otherwise replace the href with a thrown error).

## Tech stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (`base-nova` preset, Base UI primitives)
- **8bitcn/ui** (retro pixel components, Press Start 2P font)
- **esbuild** (bookmarklet sidecar bundle)
- **pnpm**

## Local development

```bash
git clone https://github.com/SriSomanaath/Webcade.git
cd Webcade
pnpm install
pnpm dev          # Next.js on http://localhost:3006
pnpm build:bm     # Rebuild the bookmarklet (public/bookmarklet.js)
pnpm build        # Production: build:bm + next build
```

The `build` script chains `pnpm build:bm && next build` so production builds always include a fresh bookmarklet bundle.

## Project structure

```
src/
  app/
    layout.tsx              # Press Start 2P + SEO metadata
    page.tsx                # Landing composition
    globals.css             # Tailwind tokens + theme
    game/[slug]/page.tsx    # Per-game pages
    play/demo/page.tsx      # Same-origin sandbox
  components/
    site/                   # Hero, Nav, Footer, FAQ, Bookmarklet, GitHubStar...
    ui/                     # shadcn/ui primitives
    ui/8bit/                # 8bitcn/ui retro wrappers
  lib/
    games.ts                # Game metadata
    utils.ts                # cn() helper
bookmarklet/
  src/index.ts              # The actual game (vanilla TS)
  tsconfig.json
public/
  bookmarklet.js            # Built IIFE (committed for clone-and-run)
```

## Roadmap

- [x] **Brickout** — turn page text into destructible bricks
- [ ] **Page Snake** — slither through the text maze
- [ ] **Whack the Page** — pop-up word whacking
- [ ] **Page Raiders** — words descend, you shoot
- [ ] **Page Taxi** — drive around obstacles
- [ ] OG image / share card
- [ ] Live deployment on Vercel

## Caveats worth knowing

- **CSP**: many sites (GitHub, Google, banks) ship a Content Security Policy that blocks injected scripts. The bookmarklet works on Wikipedia, blogs, news, most docs, and `/play/demo`. It silently fails on strictly-CSP'd sites.
- **Mobile**: not supported. Bookmarklet bars + touch controls don't mix.
- **First load**: the GitHub star count is fetched server-side and cached for 1 hour, so the first uncached render of the homepage may take ~500 ms.

## Built by

[**SriNath**](https://srisomanaathdev.vercel.app/) — say hi on [X (@SriNath693)](https://x.com/SriNath693) or browse the [portfolio](https://srisomanaathdev.vercel.app/).

> Webcade is an indie web learning project — a study clone of [playanypage.com](https://playanypage.com), built to practice Next.js 16, Tailwind v4, 8bitcn/ui, and bookmarklet engineering.

---

<div align="center">

**If Webcade made you smile, star this repo — it genuinely helps.**

[⭐ Star on GitHub](https://github.com/SriSomanaath/Webcade)

</div>
