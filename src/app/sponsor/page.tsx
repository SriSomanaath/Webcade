import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Heart } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sponsor Webcade — Insert Coin",
  description:
    "Webcade is free forever. Tip once or sponsor monthly to keep new arcade games shipping.",
};

type Tier = {
  slug: string;
  name: string;
  amountLabel: string;
  blurb: string;
  perks: string[];
  url: string;
  hue: number;
};

const tip = {
  url: "https://dodo.pe/webcade-tip",
  hue: 45,
};

const tiers: Tier[] = [
  {
    slug: "coin",
    name: "Coin",
    amountLabel: "$3 / month",
    blurb: "Keeps the cabinet running.",
    perks: ["Sponsor badge in repo README", "Priority issue triage"],
    url: "https://dodo.pe/webcade-coin",
    hue: 140,
  },
  {
    slug: "token",
    name: "Token",
    amountLabel: "$5 / month",
    blurb: "Fuels new game cabinets.",
    perks: [
      "Everything in Coin",
      "Vote on the next game added",
      "Name listed on the sponsor wall",
    ],
    url: "https://dodo.pe/webcade-token",
    hue: 220,
  },
  {
    slug: "champion",
    name: "Champion",
    amountLabel: "$10 / month",
    blurb: "Gets a permanent shout-out.",
    perks: [
      "Everything in Token",
      "Logo + link in the README",
      "Direct line for feature requests",
    ],
    url: "https://dodo.pe/webcade-champion",
    hue: 350,
  },
];

export default function SponsorPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="relative">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-72"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 0%, hsl(45 85% 55% / 0.14), transparent 70%)",
            }}
          />
          <div className="relative mx-auto max-w-4xl px-6 pt-12 pb-12 sm:pt-20">
            <Link
              href="/"
              className="retro inline-flex items-center gap-2 text-[10px] tracking-wider uppercase text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to lobby
            </Link>

            <p
              className="retro mt-8 inline-flex items-center gap-2 text-[10px] tracking-wider uppercase"
              style={{ color: "hsl(45 85% 55%)" }}
            >
              <Heart
                className="h-3.5 w-3.5"
                fill="hsl(350 78% 55%)"
                style={{ color: "hsl(350 78% 55%)" }}
                aria-hidden
              />
              Insert Coin
            </p>

            <h1 className="retro mt-3 bg-gradient-to-r from-[hsl(350_85%_55%)] via-[hsl(45_85%_55%)] to-[hsl(270_85%_60%)] bg-clip-text text-balance text-3xl leading-snug text-transparent sm:text-5xl">
              Sponsor Webcade
            </h1>
            <p className="mt-6 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
              Webcade is free forever — five arcade games inside any webpage,
              one bookmarklet, no install. If it made you smile, drop a coin in
              the cabinet.
            </p>

            <p className="mt-3 max-w-2xl text-base text-foreground/80">
              Sponsorships are processed by Dodo Payments. Tax handled,
              receipts sent automatically, cancel anytime from your sponsor
              email.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 pb-12">
          <div
            className="relative border-4 border-dashed border-foreground/30 p-8"
            style={{
              background: "hsl(45 85% 55% / 0.06)",
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-1.5"
              style={{ background: "hsl(45 85% 55%)" }}
            />
            <p
              className="retro text-[10px] tracking-wider uppercase"
              style={{ color: "hsl(45 85% 55%)" }}
            >
              Tip Jar · One-time
            </p>
            <h2 className="retro mt-3 text-2xl leading-snug sm:text-3xl">
              Pay what you want
            </h2>
            <p className="mt-4 max-w-xl text-foreground/80">
              Drop any amount you like — $1 or $50, your call. Single charge,
              no recurring billing.
            </p>
            <div className="mt-8">
              <a
                href={tip.url}
                target="_blank"
                rel="noreferrer"
                className="retro inline-flex items-center gap-2 border-2 border-foreground bg-foreground px-5 py-3 text-[10px] tracking-wider uppercase text-background transition active:translate-y-[2px] hover:opacity-90"
                style={{
                  filter: "drop-shadow(4px 4px 0 hsl(45 85% 55%))",
                }}
              >
                Drop a coin
                <ArrowUpRight className="h-3 w-3" aria-hidden />
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="mb-10 flex flex-col items-start gap-3">
            <p className="retro text-[10px] tracking-wider uppercase text-muted-foreground">
              Recurring
            </p>
            <h2 className="retro text-2xl leading-snug sm:text-3xl">
              Sponsor monthly
            </h2>
            <p className="max-w-2xl text-muted-foreground">
              Pick a tier. Cancel anytime. Tiers compound — each unlocks
              everything below.
            </p>
          </div>

          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {tiers.map((t) => {
              const accent = `hsl(${t.hue} 78% 55%)`;
              const accentSoft = `hsl(${t.hue} 78% 55% / 0.18)`;
              return (
                <li key={t.slug}>
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                  >
                    <div className="relative h-full border-4 border-foreground/20 bg-card p-6 transition-transform group-hover:-translate-y-1">
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 top-0 h-1.5"
                        style={{ background: accent }}
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                        style={{
                          background: `radial-gradient(circle at 100% 0%, ${accentSoft}, transparent 60%)`,
                        }}
                      />
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p
                            className="retro text-[9px] tracking-wider uppercase"
                            style={{ color: accent }}
                          >
                            Tier
                          </p>
                          <h3 className="retro mt-2 text-base flex items-center gap-2">
                            <span
                              aria-hidden
                              className="pointer-events-none inline-block h-2.5 w-2.5"
                              style={{
                                background: accent,
                                boxShadow: `0 0 10px ${accent}`,
                              }}
                            />
                            {t.name}
                          </h3>
                        </div>
                        <span
                          aria-hidden
                          className="pointer-events-none retro grid place-items-center border-2 px-1.5 py-0.5 text-[9px] text-background"
                          style={{ background: accent, borderColor: accent }}
                        >
                          {t.amountLabel.split(" ")[0]}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                        {t.blurb}
                      </p>
                      <ul className="mt-5 flex flex-col gap-2">
                        {t.perks.map((p) => (
                          <li
                            key={p}
                            className="flex items-start gap-2 text-sm text-foreground/80"
                          >
                            <span
                              aria-hidden
                              className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0"
                              style={{ background: accent }}
                            />
                            {p}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 flex items-center justify-between">
                        <span className="retro text-[10px] tracking-wider uppercase text-muted-foreground transition-colors group-hover:text-foreground">
                          {t.amountLabel}
                        </span>
                        <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>

          <p className="retro mt-12 text-center text-[9px] tracking-wider uppercase text-muted-foreground">
            Payments processed securely by Dodo Payments
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
