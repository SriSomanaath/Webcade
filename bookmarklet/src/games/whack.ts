import type { GameModule, Rect } from "../runtime";

type Pop = { rect: Rect; expires: number; bornAt: number };

export const whack: GameModule = {
  slug: "whack-the-page",
  name: "Whack the Page",
  hud: [
    { key: "score", label: "Score", initial: "0" },
    { key: "combo", label: "Combo", initial: "0" },
    { key: "time", label: "Time", initial: "60" },
  ],
  init(api) {
    const { ctx } = api;
    const ROUND = 60;
    let words: Rect[] = [];
    let pops: Pop[] = [];
    let score = 0;
    let combo = 0;
    let elapsed = 0;
    let spawnAcc = 0;
    const mouse = { x: -1000, y: -1000 };
    let hitFlash = 0;
    let smashAt = -1000;
    let alive = true;

    function rebuildWords() {
      words = api.buildPageRects({ capture: "words", minW: 24, minH: 12 });
    }

    function spawnPop() {
      if (words.length === 0) return;
      let tries = 0;
      while (tries++ < 8) {
        const w = words[Math.floor(Math.random() * words.length)];
        if (pops.some((p) => p.rect === w)) continue;
        pops.push({ rect: w, expires: elapsed + 1.4, bornAt: elapsed });
        return;
      }
    }

    function reset() {
      rebuildWords();
      pops = [];
      score = 0;
      combo = 0;
      elapsed = 0;
      spawnAcc = 0;
      alive = true;
      api.setStat("score", 0);
      api.setStat("combo", 0);
      api.setStat("time", ROUND);
    }

    reset();
    api.toast("Click highlighted words before they vanish · Esc to exit");

    api.on("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    api.on("mousedown", (e) => {
      if (!alive) return;
      smashAt = performance.now();
      for (let i = 0; i < pops.length; i++) {
        const p = pops[i];
        if (
          e.clientX >= p.rect.x &&
          e.clientX <= p.rect.x + p.rect.w &&
          e.clientY >= p.rect.y &&
          e.clientY <= p.rect.y + p.rect.h
        ) {
          combo += 1;
          score += 10 + combo * 2;
          pops.splice(i, 1);
          hitFlash = 0.3;
          api.setStat("score", score);
          api.setStat("combo", combo);
          return;
        }
      }
      combo = 0;
      api.setStat("combo", 0);
    });

    api.on("keydown", (e) => {
      if (e.key === " " && !alive) reset();
    });

    api.onResize(() => {
      rebuildWords();
      pops = [];
    });

    function drawHammer(x: number, y: number, swinging: boolean) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(swinging ? -0.55 : -0.25);
      ctx.fillStyle = "#7a4520";
      ctx.fillRect(-3, 0, 6, 36);
      ctx.strokeStyle = "rgba(0,0,0,0.7)";
      ctx.lineWidth = 1;
      ctx.strokeRect(-3, 0, 6, 36);
      ctx.fillStyle = "#a8a8b8";
      ctx.fillRect(-14, -6, 28, 12);
      ctx.strokeStyle = "rgba(0,0,0,0.7)";
      ctx.strokeRect(-14, -6, 28, 12);
      ctx.fillStyle = "#dadaee";
      ctx.fillRect(-12, -5, 6, 4);
      ctx.restore();
    }

    function step(dt: number) {
      const W = api.W();
      const H = api.H();

      if (alive) {
        elapsed += dt;
        const timeLeft = Math.max(0, ROUND - elapsed);
        api.setStat("time", Math.ceil(timeLeft));
        if (timeLeft <= 0) alive = false;

        const spawnInterval = Math.max(0.25, 0.7 - elapsed * 0.008);
        spawnAcc += dt;
        while (spawnAcc >= spawnInterval) {
          spawnAcc -= spawnInterval;
          spawnPop();
        }
        pops = pops.filter((p) => p.expires > elapsed);
      }

      if (hitFlash > 0) hitFlash = Math.max(0, hitFlash - dt);

      ctx.clearRect(0, 0, W, H);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const p of pops) {
        const remain = p.expires - elapsed;
        const t = 1 - Math.max(0, remain) / 1.4;
        const alpha = remain > 0.3 ? 1 : Math.max(0, remain / 0.3);
        const scale = 1 + Math.sin(t * Math.PI) * 0.2;
        const cx = p.rect.x + p.rect.w / 2;
        const cy = p.rect.y + p.rect.h / 2;
        const hw = (p.rect.w * scale) / 2 + 4;
        const hh = (p.rect.h * scale) / 2 + 6;
        ctx.fillStyle = `hsla(50, 95%, 55%, ${0.85 * alpha})`;
        ctx.fillRect(cx - hw, cy - hh, hw * 2, hh * 2);
        ctx.strokeStyle = `hsla(45, 100%, 78%, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - hw, cy - hh, hw * 2, hh * 2);
        if (p.rect.text) {
          ctx.fillStyle = `rgba(20,12,0,${alpha})`;
          ctx.font = `700 ${Math.max(
            12,
            Math.floor(p.rect.h * 0.85)
          )}px ui-sans-serif, system-ui, sans-serif`;
          ctx.fillText(p.rect.text, cx, cy);
        }
      }

      if (hitFlash > 0) {
        ctx.fillStyle = `rgba(255,235,140,${hitFlash})`;
        ctx.fillRect(0, 0, W, H);
      }

      drawHammer(mouse.x, mouse.y, performance.now() - smashAt < 120);

      if (!alive) {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.font = "600 48px ui-sans-serif, system-ui, sans-serif";
        ctx.fillText("Time's up", W / 2, H / 2 - 8);
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
