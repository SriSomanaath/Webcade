export type Game = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  hue: number;
  stats: {
    pace: number;
    skill: number;
    chaos: number;
    replay: number;
  };
};

export const games: Game[] = [
  {
    slug: "brickout",
    name: "Brickout",
    tagline: "Smash boring webpage text as bricks. Break them all.",
    description:
      "Every paragraph, heading and link becomes a brick. Bounce a ball, shatter the page, and clear the level.",
    hue: 350,
    stats: { pace: 65, skill: 55, chaos: 75, replay: 80 },
  },
  {
    slug: "snake",
    name: "Page Snake",
    tagline: "Ignore what the page says. Feast inside the text maze.",
    description:
      "The page's layout becomes your maze. Slither between blocks of text and grow without crashing.",
    hue: 140,
    stats: { pace: 60, skill: 70, chaos: 30, replay: 75 },
  },
  {
    slug: "whack-the-page",
    name: "Whack the Page",
    tagline: "Some text just won't sit still. Teach it a lesson with your hammer.",
    description:
      "Words pop out of the page at random. Whack them in time before they slip back in.",
    hue: 45,
    stats: { pace: 90, skill: 50, chaos: 60, replay: 60 },
  },
  {
    slug: "page-raiders",
    name: "Page Raiders",
    tagline: "The words on the page are attacking you. Open fire.",
    description:
      "A wall of words descends from the top of the page. Move, dodge, shoot, survive.",
    hue: 270,
    stats: { pace: 85, skill: 75, chaos: 90, replay: 70 },
  },
  {
    slug: "page-taxi",
    name: "Page Taxi",
    tagline: "Text in the way? Drift past it. Oh, and pick up that passenger.",
    description:
      "Drive through the page, weave around obstacles, and ferry passengers between sections.",
    hue: 30,
    stats: { pace: 50, skill: 45, chaos: 55, replay: 65 },
  },
];

export const gameBySlug = Object.fromEntries(games.map((g) => [g.slug, g]));
