import type { GameModule } from "../runtime";

const CELL = 16;

type Cell = { c: number; r: number };

export const snake: GameModule = {
  slug: "snake",
  name: "Page Snake",
  hue: 140,
  hud: [
    { key: "score", label: "Score", initial: "0" },
    { key: "length", label: "Length", initial: "4" },
  ],
  init(api) {
    const { ctx } = api;
    const walls = new Set<string>();
    let body: Cell[] = [];
    let dir: Cell = { c: 1, r: 0 };
    let nextDir: Cell = { c: 1, r: 0 };
    let food: Cell | null = null;
    let alive = true;
    let won = false;
    let score = 0;
    let tickAcc = 0;
    let tickInterval = 0.11;

    const cols = () => Math.floor(api.W() / CELL);
    const rows = () => Math.floor(api.H() / CELL);
    const key = (c: number, r: number) => `${c},${r}`;

    function rebuildWalls() {
      walls.clear();
      const rects = api.buildPageRects();
      const C = cols();
      const R = rows();
      for (const rect of rects) {
        const c0 = Math.max(0, Math.floor(rect.x / CELL));
        const c1 = Math.min(C - 1, Math.floor((rect.x + rect.w) / CELL));
        const r0 = Math.max(0, Math.floor(rect.y / CELL));
        const r1 = Math.min(R - 1, Math.floor((rect.y + rect.h) / CELL));
        for (let cc = c0; cc <= c1; cc++) {
          for (let rr = r0; rr <= r1; rr++) {
            walls.add(key(cc, rr));
          }
        }
      }
    }

    function findOpenCell(): Cell | null {
      const C = cols();
      const R = rows();
      for (let i = 0; i < 300; i++) {
        const c = Math.floor(Math.random() * C);
        const r = Math.floor(Math.random() * R);
        if (walls.has(key(c, r))) continue;
        if (body.some((s) => s.c === c && s.r === r)) continue;
        return { c, r };
      }
      return null;
    }

    function findStartingRun(): Cell[] | null {
      const C = cols();
      const R = rows();
      const cx = Math.floor(C / 2);
      const cy = Math.floor(R / 2);
      for (let radius = 0; radius < Math.max(C, R); radius++) {
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;
            const hc = cx + dx;
            const hr = cy + dy;
            if (
              hc < 3 || hc >= C ||
              hr < 0 || hr >= R
            ) continue;
            const run: Cell[] = [];
            let ok = true;
            for (let i = 0; i < 4; i++) {
              const c = hc - i;
              const r = hr;
              if (walls.has(key(c, r)) || c < 0) { ok = false; break; }
              run.push({ c, r });
            }
            if (ok) return run;
          }
        }
      }
      return null;
    }

    function reset() {
      rebuildWalls();
      const start = findStartingRun();
      if (!start) {
        alive = false;
        won = false;
        body = [];
        api.toast("Page too dense to spawn snake. Esc to exit.", 4000);
        return;
      }
      body = start;
      dir = { c: 1, r: 0 };
      nextDir = { c: 1, r: 0 };
      food = findOpenCell();
      alive = true;
      won = false;
      score = 0;
      tickAcc = 0;
      tickInterval = 0.11;
      api.setStat("score", 0);
      api.setStat("length", body.length);
    }

    reset();
    api.toast("Arrow keys / WASD to slither · Esc to exit");

    api.on("keydown", (e) => {
      const k = e.key.toLowerCase();
      const setDir = (c: number, r: number) => {
        if (body.length > 1 && c === -dir.c && r === -dir.r) return;
        nextDir = { c, r };
      };
      if (k === "arrowup" || k === "w") setDir(0, -1);
      else if (k === "arrowdown" || k === "s") setDir(0, 1);
      else if (k === "arrowleft" || k === "a") setDir(-1, 0);
      else if (k === "arrowright" || k === "d") setDir(1, 0);
      else if (e.key === " " && (!alive || won)) reset();
    });

    api.onResize(() => {
      rebuildWalls();
    });

    function step(dt: number) {
      const W = api.W();
      const H = api.H();
      const C = cols();
      const R = rows();

      if (alive && !won) {
        tickAcc += dt;
        while (tickAcc >= tickInterval) {
          tickAcc -= tickInterval;
          dir = nextDir;
          const head = body[0];
          const newHead: Cell = { c: head.c + dir.c, r: head.r + dir.r };
          const hitWall =
            newHead.c < 0 ||
            newHead.c >= C ||
            newHead.r < 0 ||
            newHead.r >= R ||
            walls.has(key(newHead.c, newHead.r));
          const hitSelf = body.some((s) => s.c === newHead.c && s.r === newHead.r);
          if (hitWall || hitSelf) {
            alive = false;
            break;
          }
          body.unshift(newHead);
          if (food && newHead.c === food.c && newHead.r === food.r) {
            score += 10;
            api.setStat("score", score);
            api.setStat("length", body.length);
            food = findOpenCell();
            if (!food) won = true;
            tickInterval = Math.max(0.055, tickInterval * 0.97);
          } else {
            body.pop();
          }
        }
      }

      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = "rgba(120, 140, 200, 0.35)";
      for (const k of walls) {
        const [c, r] = k.split(",").map(Number);
        ctx.fillRect(c * CELL, r * CELL, CELL, CELL);
      }

      if (food) {
        const pulse = 1 + Math.sin(performance.now() / 220) * 0.15;
        const cx = food.c * CELL + CELL / 2;
        const cy = food.r * CELL + CELL / 2;
        ctx.fillStyle = "hsla(0, 90%, 60%, 0.9)";
        ctx.beginPath();
        ctx.arc(cx, cy, (CELL / 2 - 2) * pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = body.length - 1; i >= 0; i--) {
        const seg = body[i];
        const t = i / Math.max(1, body.length - 1);
        const lightness = 70 - t * 30;
        ctx.fillStyle = `hsl(140, 80%, ${lightness}%)`;
        ctx.fillRect(seg.c * CELL + 1, seg.r * CELL + 1, CELL - 2, CELL - 2);
      }

      if (!alive || won) {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.font = "600 48px ui-sans-serif, system-ui, sans-serif";
        ctx.fillText(won ? "Maze solved." : "Game Over", W / 2, H / 2 - 8);
        ctx.font = "16px ui-sans-serif, system-ui, sans-serif";
        ctx.fillText(
          `Score ${score} · Length ${body.length}`,
          W / 2,
          H / 2 + 20
        );
        ctx.fillText(
          "Press Space to play again · Esc to close",
          W / 2,
          H / 2 + 46
        );
      }
    }

    return { step };
  },
};
