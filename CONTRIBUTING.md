# Contributing to Webcade

Thanks for considering a contribution! Webcade is an indie web learning project, so issues and pull requests are welcome — but expect a friendly, unhurried turnaround.

## Ways to help

- **Bug reports** — open an issue with steps to reproduce and the page you tried it on. Note that CSP-blocked sites are a known limitation (see the README's *Caveats* section).
- **New games** — Brickout is the only one wired up so far. Page Snake, Whack the Page, Page Raiders, and Page Taxi are wide open.
- **Code improvements** — small fixes, refactors, accessibility, performance.
- **Docs** — README, CONTRIBUTING, inline comments where the *why* isn't obvious.
- **Ideas** — open an issue to discuss before sinking time into a big change.

## Getting set up

```bash
git clone https://github.com/SriSomanaath/Webcade.git
cd Webcade
pnpm install
pnpm dev          # site on http://localhost:3006
pnpm build:bm     # rebuild the bookmarklet bundle (public/bookmarklet.js)
pnpm build        # production build (build:bm + next build)
```

If you change `bookmarklet/src/index.ts`, run `pnpm build:bm` again to refresh `public/bookmarklet.js` — the site loads the bookmarklet from there.

## Code style

- **TypeScript** in strict mode — avoid `any` unless there's a real reason.
- **Tailwind v4** utility-first — match the surrounding pixel/dashed-border style.
- **8bitcn/ui** for new UI primitives — reach for `Card`, `Button`, `Badge` from `@/components/ui/8bit/...` first.
- **Server components by default** — opt into `"use client"` only when the component needs hooks or events.
- **Match what's already there** — there's no formal linter beyond `eslint-config-next`.

## Commit messages

We use a light Conventional Commits style:

| Prefix | When to use |
|---|---|
| `feat:` | a new feature |
| `fix:` | a bug fix |
| `chore:` | tooling, deps, configs |
| `docs:` | documentation only |
| `style:` | formatting / whitespace, no logic change |
| `refactor:` | code change that doesn't add features or fix bugs |

Subject line in **imperative mood** (`add`, not `added`), under ~70 chars. Use the body for context if the change isn't obvious from the diff.

## Pull request process

1. Fork and create a branch from `main`: `git checkout -b feat/page-snake`
2. Keep PRs focused — one feature or fix at a time.
3. Make sure `pnpm dev` runs without console errors.
4. Update the README if you're adding visible behavior (a new game, a new route).
5. Open the PR with a clear description and reference any related issue.

## Adding a new game

Each game lives in `bookmarklet/src/`. Use `index.ts` (Brickout) as the reference. A game should:

- Run inside the existing Shadow DOM host (or replace it cleanly when toggled).
- Use `TreeWalker` + `Range.getClientRects()` to extract level geometry from page text — that's what makes every page feel different.
- Add an `Esc` handler that fully cleans up listeners and removes the host.
- Stay vanilla TypeScript — no React, no extra deps, keep the bundle small (~6 KB target).

When the game is done, wire it into the bookmarklet entry so users can pick it (and add a flag/menu so users can choose between games).

## Licensing

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).

## Questions

Open an issue or reach out on [X / @SriNath693](https://x.com/SriNath693).
