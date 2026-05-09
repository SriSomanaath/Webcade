import type { GameModule } from "../runtime";

type Tag = "obstacle" | "passenger" | "dropoff";
type Obstacle = {
  x: number;
  y: number;
  w: number;
  h: number;
  hue: number;
  lane: number;
  tag: Tag;
};

export const taxi: GameModule = {
  slug: "page-taxi",
  name: "Page Taxi",
  hue: 30,
  hud: [
    { key: "score", label: "Score", initial: "0" },
    { key: "fares", label: "Fares", initial: "0" },
    { key: "lives", label: "Lives", initial: "3" },
  ],
  consumedKeys: ["arrowup", "arrowdown", "w", "s", " "],
  init(api) {
    const { ctx } = api;
    const SCROLL_SPEED = 220;
    const LANES = 5;
    const FARES_TO_WIN = 5;
    const car = { screenX: 0, y: 0, w: 60, h: 28 };

    // Procedural-spawn parameters. Values are world pixels.
    const SPAWN_STEP_MIN = 200;
    const SPAWN_STEP_MAX = 420;
    const INITIAL_OBSTACLES = 12;
    const SAFE_START_DIST = 1400;
    const RECYCLE_NO_REPEAT_LANES = 2;

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
    let spawnCursor = 0;
    const recentLanes: number[] = [];

    function laneHeight() {
      return api.H() / LANES;
    }

    function laneCenterY(lane: number) {
      const lh = laneHeight();
      return Math.floor(lane * lh + lh / 2 - car.h / 2);
    }

    // Pick a lane that isn't in the recent-spawn window and avoids `forbidden`.
    function pickLane(forbidden?: number): number {
      const choices: number[] = [];
      for (let l = 0; l < LANES; l++) {
        if (forbidden !== undefined && l === forbidden) continue;
        if (recentLanes.includes(l)) continue;
        choices.push(l);
      }
      if (choices.length === 0) {
        // recentLanes covers everything else — fall back to any non-forbidden lane.
        for (let l = 0; l < LANES; l++) {
          if (forbidden !== undefined && l === forbidden) continue;
          choices.push(l);
        }
      }
      if (choices.length === 0) {
        for (let l = 0; l < LANES; l++) choices.push(l);
      }
      return choices[Math.floor(Math.random() * choices.length)];
    }

    function rememberLane(lane: number) {
      recentLanes.push(lane);
      while (recentLanes.length > RECYCLE_NO_REPEAT_LANES) recentLanes.shift();
    }

    function fillObstacle(o: Obstacle, lane: number, x: number) {
      o.lane = lane;
      o.x = x;
      o.y = laneCenterY(lane);
      o.w = 70 + Math.random() * 90;
      o.h = Math.max(20, Math.floor(laneHeight() * 0.42));
      o.hue = Math.floor(Math.random() * 360);
    }

    function makeObstacle(lane: number, x: number): Obstacle {
      const o: Obstacle = {
        x: 0, y: 0, w: 0, h: 0, hue: 0, lane: 0, tag: "obstacle",
      };
      fillObstacle(o, lane, x);
      return o;
    }

    function recycle(o: Obstacle) {
      const W = api.W();
      // Always spawn beyond the right edge with a healthy gap.
      spawnCursor = Math.max(
        spawnCursor +
          SPAWN_STEP_MIN +
          Math.random() * (SPAWN_STEP_MAX - SPAWN_STEP_MIN),
        cameraX + W + 80
      );
      const lane = pickLane();
      rememberLane(lane);
      fillObstacle(o, lane, spawnCursor);
    }

    function pickNonSpecial(): Obstacle | null {
      // Bias toward obstacles that are still ahead of the car so a green/blue marker
      // never appears under the player.
      const W = api.W();
      const minWorldX = cameraX + W * 0.55;
      const ahead = obstacles.filter(
        (o) => o.tag === "obstacle" && o.x >= minWorldX
      );
      if (ahead.length > 0) {
        return ahead[Math.floor(Math.random() * ahead.length)];
      }
      const any = obstacles.filter((o) => o.tag === "obstacle");
      if (any.length === 0) return null;
      return any[Math.floor(Math.random() * any.length)];
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
      // Use page-rect count purely as difficulty signal; never as obstacle position.
      // Page text doesn't align to lanes and clusters at small x — using positions
      // directly makes the car spawn inside obstacles and creates impossible walls.
      const rects = api.buildPageRects({ minW: 30, minH: 14 });
      const target = Math.min(
        20,
        Math.max(INITIAL_OBSTACLES, 8 + Math.floor(rects.length / 6))
      );

      obstacles = [];
      recentLanes.length = 0;
      const W = api.W();
      let cursor = cameraX + Math.max(W * 0.55, 800);
      for (let i = 0; i < target; i++) {
        const withinSafeStart = cursor - cameraX < SAFE_START_DIST;
        const lane = pickLane(withinSafeStart ? targetLane : undefined);
        rememberLane(lane);
        obstacles.push(makeObstacle(lane, cursor));
        cursor +=
          SPAWN_STEP_MIN + Math.random() * (SPAWN_STEP_MAX - SPAWN_STEP_MIN);
      }
      spawnCursor = cursor;
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

    api.onPageChange(() => rebuild());
    api.onResize(() => {
      car.screenX = api.W() * 0.18;
      targetLane = Math.max(0, Math.min(LANES - 1, targetLane));
      car.y = laneCenterY(targetLane);
      // Re-align all obstacle y positions and heights to the new lane geometry.
      const newH = Math.max(20, Math.floor(laneHeight() * 0.42));
      for (const o of obstacles) {
        o.y = laneCenterY(o.lane);
        o.h = newH;
      }
    });

    function aabb(
      ax: number, ay: number, aw: number, ah: number,
      bx: number, by: number, bw: number, bh: number
    ) {
      return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
    }

    function drawLookahead(W: number, _H: number, now: number) {
      // Right-edge "NEXT" panel: green = clear, red = blocked, for the next ~2s of road.
      const previewWidth = 64;
      const previewX = W - previewWidth - 18;
      const lookahead = SCROLL_SPEED * 2.0;
      const startWorld = cameraX + W;
      const endWorld = startWorld + lookahead;

      const blocked: boolean[] = new Array(LANES).fill(false);
      for (const o of obstacles) {
        if (o.tag !== "obstacle") continue;
        if (o.x + o.w < startWorld || o.x > endWorld) continue;
        blocked[o.lane] = true;
      }

      const panelY = 16;
      const cellH = 12;
      const cellGap = 3;
      const panelH = LANES * (cellH + cellGap) + 20;
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(previewX - 6, panelY, previewWidth + 12, panelH);
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 1;
      ctx.strokeRect(previewX - 6, panelY, previewWidth + 12, panelH);

      ctx.font = "600 9px ui-sans-serif, system-ui, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.fillText("NEXT", previewX, panelY + 12);

      for (let i = 0; i < LANES; i++) {
        const cellY = panelY + 18 + i * (cellH + cellGap);
        if (blocked[i]) {
          ctx.fillStyle = "hsla(0, 80%, 55%, 0.75)";
        } else {
          const pulse = 0.55 + Math.sin(now / 280 + i * 0.4) * 0.25;
          ctx.fillStyle = `hsla(135, 70%, 55%, ${pulse})`;
        }
        ctx.fillRect(previewX, cellY, previewWidth, cellH);
        ctx.strokeStyle = "rgba(0,0,0,0.4)";
        ctx.strokeRect(previewX + 0.5, cellY + 0.5, previewWidth - 1, cellH - 1);
        if (i === targetLane) {
          ctx.strokeStyle = "rgba(255, 220, 80, 0.95)";
          ctx.lineWidth = 2;
          ctx.strokeRect(
            previewX - 1.5,
            cellY - 1.5,
            previewWidth + 3,
            cellH + 3
          );
          ctx.lineWidth = 1;
        }
      }
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

      // Alternating lane bands so players can see exactly where each lane is.
      const laneH = H / LANES;
      for (let i = 0; i < LANES; i++) {
        ctx.fillStyle =
          i % 2 === 0 ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.18)";
        ctx.fillRect(0, i * laneH, W, laneH);
      }

      // Solid lane edges.
      ctx.strokeStyle = "rgba(255,255,255,0.16)";
      ctx.lineWidth = 1;
      for (let i = 1; i < LANES; i++) {
        const ly = Math.floor(i * laneH) + 0.5;
        ctx.beginPath();
        ctx.moveTo(0, ly);
        ctx.lineTo(W, ly);
        ctx.stroke();
      }

      // Animated dashed centerlines scrolling at camera speed.
      const dashLen = 30;
      const gap = 30;
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.setLineDash([dashLen, gap]);
      ctx.lineDashOffset = -cameraX;
      for (let i = 1; i < LANES; i++) {
        const ly = Math.floor(i * laneH) + 0.5;
        ctx.beginPath();
        ctx.moveTo(0, ly);
        ctx.lineTo(W, ly);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;

      // Highlight the lane the car is in.
      const carLaneY = targetLane * laneH;
      ctx.fillStyle = "rgba(255, 216, 58, 0.06)";
      ctx.fillRect(0, carLaneY, W, laneH);

      // Obstacles
      for (const o of obstacles) {
        const screenX = o.x - cameraX;
        if (screenX > W + 40 || screenX + o.w < -40) continue;
        if (o.tag === "passenger") {
          const pulse = 0.55 + Math.sin(now / 220) * 0.3;
          ctx.fillStyle = `hsla(135, 80%, 55%, ${pulse})`;
        } else if (o.tag === "dropoff") {
          const pulse = 0.55 + Math.sin(now / 220) * 0.3;
          ctx.fillStyle = `hsla(210, 90%, 60%, ${pulse})`;
        } else {
          ctx.fillStyle = `hsla(${o.hue}, 55%, 50%, 0.78)`;
        }
        ctx.fillRect(screenX, o.y, o.w, o.h);
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.strokeRect(screenX + 0.5, o.y + 0.5, o.w - 1, o.h - 1);
      }

      // Look-ahead panel so the player can plan a lane change.
      drawLookahead(W, H, now);

      // Car
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
