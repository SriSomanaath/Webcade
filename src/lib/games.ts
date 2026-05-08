export type Game = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
};

export const games: Game[] = [
  {
    slug: "brickout",
    name: "Brickout",
    tagline: "Smash boring webpage text as bricks. Break them all.",
    description:
      "Every paragraph, heading and link becomes a brick. Bounce a ball, shatter the page, and clear the level.",
  },
  {
    slug: "snake",
    name: "Page Snake",
    tagline: "Ignore what the page says. Feast inside the text maze.",
    description:
      "The page's layout becomes your maze. Slither between blocks of text and grow without crashing.",
  },
  {
    slug: "whack-the-page",
    name: "Whack the Page",
    tagline: "Some text just won't sit still. Teach it a lesson with your hammer.",
    description:
      "Words pop out of the page at random. Whack them in time before they slip back in.",
  },
  {
    slug: "page-raiders",
    name: "Page Raiders",
    tagline: "The words on the page are attacking you. Open fire.",
    description:
      "A wall of words descends from the top of the page. Move, dodge, shoot, survive.",
  },
  {
    slug: "page-taxi",
    name: "Page Taxi",
    tagline: "Text in the way? Drift past it. Oh, and pick up that passenger.",
    description:
      "Drive through the page, weave around obstacles, and ferry passengers between sections.",
  },
];

export const gameBySlug = Object.fromEntries(games.map((g) => [g.slug, g]));
