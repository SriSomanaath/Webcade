import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { ThemeScript } from "@/components/site/ThemeScript";

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
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Webcade",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d12" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${pressStart.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
