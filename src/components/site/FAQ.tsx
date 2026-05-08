import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import "@/components/ui/8bit/styles/retro.css";

const faqs = [
  {
    q: "How can I play games on any webpage without downloading an extension or app?",
    a: "Webcade operates exclusively via a lightweight JavaScript bookmarklet. When clicked, it runs game logic directly on the current page — no Chrome, Firefox, or Edge extension required. Zero installation.",
  },
  {
    q: "Is the Webcade bookmarklet safe to use on private work or school websites?",
    a: "Yes. Webcade uses a 100% client-side rendering engine. All gameplay executes locally within your browser — no webpage content is ever read or transmitted during play. The only data that leaves your browser is when you explicitly choose to share a score: the site hostname and your game stats are included so others can see where you played. No page text, full URLs, or browsing history is ever shared.",
  },
  {
    q: "Which web browsers support the Webcade game bookmarklet?",
    a: "Webcade is optimized for modern desktop browsers featuring a visible bookmarks bar and physical keyboard controls. Mobile browsers are not officially supported due to bookmarklet execution limits and touch-control constraints.",
  },
  {
    q: "Who built Webcade?",
    a: "Webcade is built by SriNath as an indie web project — find me on X at @SriNath693 or at srisomanaathdev.vercel.app. Open to feedback, ideas, and game requests.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
      <p className="retro text-[10px] tracking-wider uppercase text-muted-foreground">
        FAQ
      </p>
      <h2 className="retro mt-3 text-2xl leading-snug sm:text-3xl">
        Frequently Asked Questions
      </h2>

      <Accordion className="mt-10">
        {faqs.map((f, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="border-b-4 border-dashed border-foreground/30"
          >
            <AccordionTrigger className="retro text-left text-xs leading-relaxed tracking-wide">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
