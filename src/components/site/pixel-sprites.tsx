type Sprite = {
  width: number;
  height: number;
  rows: string[];
};

type Palette = Record<string, string>;

function renderSprite(sprite: Sprite, palette: Palette) {
  const cells: React.ReactElement[] = [];
  for (let y = 0; y < sprite.height; y++) {
    const row = sprite.rows[y] ?? "";
    for (let x = 0; x < sprite.width; x++) {
      const c = row[x];
      const fill = c && c !== "." ? palette[c] : undefined;
      if (fill) {
        cells.push(
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={1}
            height={1}
            fill={fill}
          />
        );
      }
    }
  }
  return cells;
}

const BRICKOUT: Sprite = {
  width: 12,
  height: 12,
  rows: [
    "............",
    ".....@@.....",
    "....@*@@....",
    "....@@@@....",
    ".....@@.....",
    "............",
    "############",
    "@@@#@@@#@@@@",
    "@@@#@@@#@@@@",
    "############",
    "@#@@@#@@@#@@",
    "@#@@@#@@@#@@",
  ],
};

const SNAKE: Sprite = {
  width: 12,
  height: 12,
  rows: [
    "............",
    ".@@@@@@@....",
    ".@@*..@@....",
    ".@@...@@....",
    ".@@@@@@@....",
    ".....@@.....",
    "....@@......",
    ".@@@@@@@....",
    ".@@.....@@..",
    ".@@.....@@..",
    ".@@@@@@@@@..",
    "............",
  ],
};

const WHACK: Sprite = {
  width: 12,
  height: 12,
  rows: [
    "............",
    "..########..",
    "..#@@@@@@#..",
    "..#@@*@@@#..",
    "..#@@@@@@#..",
    "..########..",
    ".....##.....",
    ".....##.....",
    ".....##.....",
    ".....##.....",
    "....####....",
    "............",
  ],
};

const RAIDERS: Sprite = {
  width: 12,
  height: 10,
  rows: [
    "............",
    ".....##.....",
    "....######..",
    "...########.",
    "..@@@##@@@@.",
    "..@*@##@*@@.",
    "..@@@##@@@@.",
    "..#.######.#",
    "..#........#",
    "............",
  ],
};

const TAXI: Sprite = {
  width: 12,
  height: 10,
  rows: [
    "............",
    "....#####...",
    "...#@@@@@#..",
    "..@@@@@@@@@.",
    "..@##@@##@@.",
    "..@##@@##@@.",
    "..@@@@@@@@@.",
    "..#@@@@@@#..",
    "...#....#...",
    "............",
  ],
};

const SPRITES: Record<string, Sprite> = {
  brickout: BRICKOUT,
  snake: SNAKE,
  "whack-the-page": WHACK,
  "page-raiders": RAIDERS,
  "page-taxi": TAXI,
};

export function GameSprite({
  slug,
  hue,
  size = 96,
  className,
}: {
  slug: string;
  hue: number;
  size?: number;
  className?: string;
}) {
  const sprite = SPRITES[slug];
  if (!sprite) return null;
  const palette: Palette = {
    "@": `hsl(${hue} 78% 55%)`,
    "#": "#0d0d12",
    "*": `hsl(${hue} 78% 80%)`,
  };
  return (
    <svg
      width={size}
      height={(size * sprite.height) / sprite.width}
      viewBox={`0 0 ${sprite.width} ${sprite.height}`}
      shapeRendering="crispEdges"
      aria-hidden
      className={className}
    >
      {renderSprite(sprite, palette)}
    </svg>
  );
}

const CHEST: Sprite = {
  width: 14,
  height: 11,
  rows: [
    "..............",
    "..WWWWWWWWWW..",
    ".WHHHHHHHHHHW.",
    "WHWWWWWWWWWWHW",
    "WHWGGGGGGGGWHW",
    "WHWGRGGGGBGWHW",
    "WHWGGGGGGGGWHW",
    "WHWHHKHHHHHWHW",
    "WHWWWWWWWWWWHW",
    "WHHHHHHHHHHHHW",
    "WWWWWWWWWWWWWW",
  ],
};

export function TreasureChest({
  size = 96,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const palette: Palette = {
    W: "#5a3416",
    H: "#a9743f",
    G: "hsl(45 90% 55%)",
    R: "hsl(350 78% 55%)",
    B: "hsl(220 78% 55%)",
    K: "#2a1a08",
  };
  return (
    <svg
      width={size}
      height={(size * CHEST.height) / CHEST.width}
      viewBox={`0 0 ${CHEST.width} ${CHEST.height}`}
      shapeRendering="crispEdges"
      aria-hidden
      className={className}
    >
      {renderSprite(CHEST, palette)}
    </svg>
  );
}
