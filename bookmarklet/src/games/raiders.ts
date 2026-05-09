import type { GameModule, Rect } from "../runtime";

type Enemy = {
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  hue: number;
  vy: number;
  alive: boolean;
};

type Bullet = { x: number; y: number; vy: number };

export const raiders: GameModule = {
  slug: "page-raiders",
  name: "Page Raiders",
  hue: 270,
  hud: [
    { key: "score", label: "Score", initial: "0" },
    { key: "wave", label: "Wave", initial: "1" },
    { key: "lives", label: "Lives", initial: "3" },
  ],
  consumedKeys: [" ", "arrowleft", "arrowright"],
  init(api) {
    const { ctx } = api;
    const WAVES = 3;
    const waveSize = (w: number) => 8 + w * 3;
    const waveSpeed = (w: number) => 110 + (w - 1) * 55;

    let pageWords: Rect[] = [];
    let enemies: Enemy[] = [];
    let bullets: Bullet[] = [];
    let score = 0;
    let lives = 3;
    let wave = 1;
    let alive = true;
    let won = false;
    let firedAt = 0;
    let mouseX = 0;
    let arrowDir = 0;
    let hitFlash = 0;
    const ship = { x: 0, y: 0, w: 60, h: 22 };

    function rebuildWords() {
      pageWords = api.buildPageRects({ capture: "words", minW: 28, minH: 14 });
    }

    function spawnWave() {
      enemies = [];
      const n = waveSize(wave);
      const vy = waveSpeed(wave);
      const W = api.W();
      for (let i = 0; i < n; i++) {
        const word =
          pageWords.length > 0
            ? pageWords[Math.floor(Math.random() * pageWords.length)]
            : null;
        const text = word?.text ?? "WEBCADE";
        const w = Math.min(W - 40, word?.w ?? 80);
        const h = word?.h ?? 22;
        const x = 20 + Math.random() * Math.max(0, W - 40 - w);
        const y = -h - Math.random() * 180;
        enemies.push({
          x,
          y,
          w,
          h,
          text,
          hue: word?.hue ?? 200,
          vy,
          alive: true,
        });
      }
    }

    function reset() {
      rebuildWords();
      bullets = [];
      score = 0;
      lives = 3;
      wave = 1;
      alive = true;
      won = false;
      hitFlash = 0;
      api.setStat("score", 0);
      api.setStat("wave", 1);
      api.setStat("lives", 3);
      const W = api.W();
      const H = api.H();
      ship.x = W / 2 - ship.w / 2;
      ship.y = H - 60;
      mouseX = W / 2;
      spawnWave();
    }

    reset();
    api.toast("Mouse to move · Click or Space to fire · Esc to exit");

    api.on("mousemove", (e) => {
      mouseX = e.clientX;
    });

    function fire() {
      if (!alive || won) return;
      if (bullets.length > 30) return;
      const now = performance.now();
      if (now - firedAt < 130) return;
      firedAt = now;
      bullets.push({ x: ship.x + ship.w / 2, y: ship.y - 6, vy: -680 });
    }

    api.on("mousedown", () => fire());
    api.on("keydown", (e) => {
      if (e.key === " ") {
        if (!alive || won) reset();
        else fire();
      } else if (e.key === "ArrowLeft") arrowDir = -1;
      else if (e.key === "ArrowRight") arrowDir = 1;
    });
    api.on("keyup", (e) => {
      if (e.key === "ArrowLeft" && arrowDir === -1) arrowDir = 0;
      else if (e.key === "ArrowRight" && arrowDir === 1) arrowDir = 0;
    });

    api.onPageChange(() => rebuildWords());
    api.onResize(() => {
      const W = api.W();
      const H = api.H();
      ship.y = H - 60;
      ship.x = Math.max(0, Math.min(W - ship.w, ship.x));
    });

    function step(dt: number) {
      const W = api.W();
      const H = api.H();

      if (alive && !won) {
        if (arrowDir !== 0) {
          ship.x += arrowDir * 380 * dt;
        } else {
          ship.x += (mouseX - ship.w / 2 - ship.x) * Math.min(1, dt * 18);
        }
        ship.x = Math.max(0, Math.min(W - ship.w, ship.x));

        for (const b of bullets) b.y += b.vy * dt;
        bullets = bullets.filter((b) => b.y > -20);

        const dangerLine = ship.y + 6;
        for (const e of enemies) {
          if (!e.alive) continue;
          e.y += e.vy * dt;
          if (e.y + e.h >= dangerLine) {
            e.alive = false;
            lives -= 1;
            hitFlash = 0.35;
            api.setStat("lives", Math.max(0, lives));
            if (lives <= 0) alive = false;
          }
        }

        for (const b of bullets) {
          if (b.y < -10) continue;
          for (const e of enemies) {
            if (!e.alive) continue;
            if (
              b.x >= e.x &&
              b.x <= e.x + e.w &&
              b.y >= e.y &&
              b.y <= e.y + e.h
            ) {
              e.alive = false;
              score += 10 + (e.text?.length ?? 0);
              b.y = -100;
              api.setStat("score", score);
              break;
            }
          }
        }
        bullets = bullets.filter((b) => b.y > -20);

        if (alive && enemies.every((e) => !e.alive)) {
          if (wave >= WAVES) won = true;
          else {
            wave += 1;
            api.setStat("wave", wave);
            spawnWave();
          }
        }
      }

      if (hitFlash > 0) hitFlash = Math.max(0, hitFlash - dt * 3);

      ctx.clearRect(0, 0, W, H);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const e of enemies) {
        if (!e.alive) continue;
        ctx.fillStyle = `hsla(${e.hue}, 80%, 56%, 0.85)`;
        ctx.fillRect(e.x, e.y, e.w, e.h);
        ctx.strokeStyle = `hsla(${e.hue}, 100%, 78%, 0.9)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(e.x + 0.5, e.y + 0.5, e.w - 1, e.h - 1);
        ctx.fillStyle = "#0d0d12";
        ctx.font = `700 ${Math.max(
          11,
          Math.floor(e.h * 0.78)
        )}px ui-sans-serif, system-ui, sans-serif`;
        ctx.fillText(e.text, e.x + e.w / 2, e.y + e.h / 2);
      }

      ctx.fillStyle = "#fff";
      for (const b of bullets) {
        ctx.fillRect(b.x - 1.5, b.y - 8, 3, 14);
      }

      const sx = ship.x + ship.w / 2;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.moveTo(sx, ship.y - 4);
      ctx.lineTo(ship.x, ship.y + ship.h);
      ctx.lineTo(ship.x + ship.w, ship.y + ship.h);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#37b6c7";
      ctx.fillRect(sx - 4, ship.y + 2, 8, 8);

      if (hitFlash > 0) {
        ctx.fillStyle = `rgba(255, 60, 60, ${hitFlash})`;
        ctx.fillRect(0, 0, W, H);
      }

      if (!alive || won) {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.font = "600 48px ui-sans-serif, system-ui, sans-serif";
        ctx.fillText(won ? "Page secured." : "Overrun.", W / 2, H / 2 - 8);
        ctx.font = "16px ui-sans-serif, system-ui, sans-serif";
        ctx.fillText(`Score ${score}`, W / 2, H / 2 + 20);
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
