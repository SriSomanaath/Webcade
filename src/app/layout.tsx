import type { Metadata } from "next";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Webcade — Turn any webpage into an arcade game",
  description:
    "Webcade is a free browser bookmarklet that turns any webpage into a playable arcade game — Brickout, Snake, Whack the Page, Page Raiders, Page Taxi. No install, no extension. Built by SriNath.",
  keywords: [
    "webcade",
    "web arcade",
    "browser bookmarklet game",
    "play any webpage",
    "arcade bookmarklet",
    "brickout bookmarklet",
    "javascript arcade",
    "retro web games",
  ],
  authors: [
    { name: "SriNath", url: "https://srisomanaathdev.vercel.app/" },
  ],
  creator: "SriNath",
  openGraph: {
    title: "Webcade — by SriNath",
    description:
      "Web. Arcade. One bookmarklet. Turn any webpage into an arcade game.",
    type: "website",
    url: "https://srisomanaathdev.vercel.app/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Webcade — by SriNath",
    description:
      "Web. Arcade. One bookmarklet. Turn any webpage into an arcade game.",
    creator: "@SriNath693",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${pressStart.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
