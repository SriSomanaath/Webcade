import type { GameModule, Rect } from "../runtime";

type Tag = "obstacle" | "passenger" | "dropoff";
type Obstacle = Rect & { tag: Tag };

export const taxi: GameModule = {
  slug: "page-taxi",
  name: "Page Taxi",
  hue: 30,
  hud: [
    { key: "score", label: "Score", initial: "0" },
    { key: "fares", label: "Fares", initial: "0" },
    { key: "lives", label: "Lives", initial: "3" },
  ],
  init(api) {
    const { ctx } = api;
    const SCROLL_SPEED = 220;
    const LANES = 5;
    const FARES_TO_WIN = 5;
    const car = { screenX: 0, y: 0, w: 60, h: 28 };

    let obstacles: Obstacle[] = [];
    let cameraX = 0;
    let alive = true;
    let won = false;
    let score = 0;
    let fares = 0;
    let lives = 3;
    let invincibleUntil = 0;
    let hasPassenger = false;
    let lastDistTick = 0;
    let targetLane = Math.floor(LANES / 2);

    function laneCenterY(lane: number) {
      const H = api.H();
      const laneH = H / LANES;
      return Math.floor(lane * laneH + laneH / 2 - car.h / 2);
    }

    function recycle(o: Obstacle) {
      const W = api.W();
      o.x = cameraX + W + Math.random() * 240;
      const lane = Math.floor(Math.random() * LANES);
      o.y = laneCenterY(lane) + (Math.random() * 18 - 9);
      o.w = 40 + Math.random() * 130;
      o.h = 18 + Math.random() * 12;
      o.hue = (Math.random() * 360) | 0;
    }

    function pickNonSpecial(): Obstacle | null {
      const cands = obstacles.filter((o) => o.tag === "obstacle");
      if (cands.length === 0) return null;
      return cands[Math.floor(Math.random() * cands.length)];
    }

    function assignPassenger() {
      const p = pickNonSpecial();
      if (p) p.tag = "passenger";
    }
    function assignDropoff() {
      const p = pickNonSpecial();
      if (p) p.tag = "dropoff";
    }

    function rebuild() {
      const rects = api.buildPageRects({ minW: 30, minH: 14 });
      obstacles = rects.map((r) => ({ ...r, tag: "obstacle" as Tag }));
      while (obstacles.length < 18) {
        const o: Obstacle = {
          x: 0, y: 0, w: 0, h: 0, hue: 0, tag: "obstacle",
        };
        recycle(o);
        obstacles.push(o);
      }
      assignPassenger();
    }

    function reset() {
      cameraX = 0;
      alive = true;
      won = false;
      score = 0;
      fares = 0;
      lives = 3;
      invincibleUntil = 0;
      hasPassenger = false;
      lastDistTick = 0;
      targetLane = Math.floor(LANES / 2);
      car.screenX = api.W() * 0.18;
      car.y = laneCenterY(targetLane);
      api.setStat("score", 0);
      api.setStat("fares", 0);
      api.setStat("lives", 3);
      rebuild();
    }

    reset();
    api.toast(
      "Up/Down or W/S to change lane · Pick up green · Drop at blue · Esc to exit"
    );

    function changeLane(dir: number) {
      if (!alive || won) return;
      targetLane = Math.max(0, Math.min(LANES - 1, targetLane + dir));
    }

    api.on("keydown", (e) => {
      const k = e.key.toLowerCase();
      if (k === "arrowup" || k === "w") {
        if (e.repeat) return;
        changeLane(-1);
      } else if (k === "arrowdown" || k === "s") {
        if (e.repeat) return;
        changeLane(1);
      } else if (e.key === " " && (!alive || won)) reset();
    });

    api.onResize(() => {
      rebuild();
      car.screenX = api.W() * 0.18;
      targetLane = Math.max(0, Math.min(LANES - 1, targetLane));
      car.y = laneCenterY(targetLane);
    });

    function aabb(
      ax: number, ay: number, aw: number, ah: number,
      bx: number, by: number, bw: number, bh: number
    ) {
      return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
    }

    function step(dt: number) {
      const W = api.W();
      const H = api.H();
      const now = performance.now();

      const targetY = laneCenterY(targetLane);
      car.y += (targetY - car.y) * (1 - Math.exp(-dt * 18));
      if (Math.abs(targetY - car.y) < 0.5) car.y = targetY;

      if (alive && !won) {
        cameraX += SCROLL_SPEED * dt;
        if (cameraX - lastDistTick > 100) {
          score += 1;
          lastDistTick += 100;
          api.setStat("score", score);
        }

        for (const o of obstacles) {
          if (o.x + o.w - cameraX < -20) {
            const oldTag = o.tag;
            recycle(o);
            o.tag = oldTag;
          }
        }

        for (const o of obstacles) {
          const screenX = o.x - cameraX;
          if (screenX > W) continue;
          if (screenX + o.w < 0) continue;
          if (aabb(car.screenX, car.y, car.w, car.h, screenX, o.y, o.w, o.h)) {
            if (o.tag === "passenger" && !hasPassenger) {
              hasPassenger = true;
              o.tag = "obstacle";
              recycle(o);
              assignDropoff();
              api.toast("Passenger aboard. Head to the blue marker.", 1800);
            } else if (o.tag === "dropoff" && hasPassenger) {
              hasPassenger = false;
              o.tag = "obstacle";
              recycle(o);
              fares += 1;
              score += 50;
              api.setStat("fares", fares);
              api.setStat("score", score);
              if (fares >= FARES_TO_WIN) {
                won = true;
              } else {
                assignPassenger();
                api.toast("Fare delivered. Find the next passenger.", 1500);
              }
            } else if (o.tag === "obstacle" && now > invincibleUntil) {
              lives -= 1;
              api.setStat("lives", Math.max(0, lives));
              invincibleUntil = now + 1000;
              if (lives <= 0) alive = false;
            }
          }
        }
      }

      ctx.clearRect(0, 0, W, H);

      const laneH = H / LANES;
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.setLineDash([12, 14]);
      for (let i = 1; i < LANES; i++) {
        const ly = i * laneH;
        ctx.beginPath();
        ctx.moveTo(0, ly);
        ctx.lineTo(W, ly);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      for (const o of obstacles) {
        const screenX = o.x - cameraX;
        if (screenX > W + 20 || screenX + o.w < -20) continue;
        if (o.tag === "passenger") {
          const pulse = 0.55 + Math.sin(now / 220) * 0.3;
          ctx.fillStyle = `hsla(135, 80%, 55%, ${pulse})`;
        } else if (o.tag === "dropoff") {
          const pulse = 0.55 + Math.sin(now / 220) * 0.3;
          ctx.fillStyle = `hsla(210, 90%, 60%, ${pulse})`;
        } else {
          ctx.fillStyle = `hsla(${o.hue}, 55%, 50%, 0.7)`;
        }
        ctx.fillRect(screenX, o.y, o.w, o.h);
        ctx.strokeStyle = "rgba(255,255,255,0.45)";
        ctx.strokeRect(screenX + 0.5, o.y + 0.5, o.w - 1, o.h - 1);
      }

      const flicker = now < invincibleUntil && Math.floor(now / 80) % 2 === 0;
      if (!flicker) {
        ctx.fillStyle = "#ffd83a";
        ctx.fillRect(car.screenX, car.y, car.w, car.h);
        ctx.fillStyle = "#222";
        ctx.fillRect(car.screenX + 8, car.y + 4, 14, car.h - 12);
        ctx.fillRect(car.screenX + car.w - 22, car.y + 4, 14, car.h - 12);
        ctx.fillStyle = "#111";
        ctx.fillRect(car.screenX + 4, car.y + car.h - 3, 12, 4);
        ctx.fillRect(car.screenX + car.w - 16, car.y + car.h - 3, 12, 4);
        if (hasPassenger) {
          ctx.fillStyle = "hsla(135, 80%, 55%, 0.95)";
          ctx.beginPath();
          ctx.arc(car.screenX + car.w / 2, car.y - 5, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!alive || won) {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        ctx.font = "600 48px ui-sans-serif, system-ui, sans-serif";
        ctx.fillText(won ? "Shift's done." : "Wreck.", W / 2, H / 2 - 8);
        ctx.font = "16px ui-sans-serif, system-ui, sans-serif";
        ctx.fillText(`Score ${score} · Fares ${fares}`, W / 2, H / 2 + 20);
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
