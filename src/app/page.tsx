import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { HowItWorks } from "@/components/site/HowItWorks";
import { GameGrid } from "@/components/site/GameGrid";
import { WhySection } from "@/components/site/WhySection";
import { BestPages } from "@/components/site/BestPages";
import { FAQ } from "@/components/site/FAQ";
import { Footer } from "@/components/site/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <GameGrid />
        <WhySection />
        <BestPages />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
