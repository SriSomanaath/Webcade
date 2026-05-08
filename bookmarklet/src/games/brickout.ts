import type { GameModule, Rect } from "../runtime";

type Brick = Rect & { alive: boolean };

export const brickout: GameModule = {
  slug: "brickout",
  name: "Brickout",
  hue: 350,
  hud: [
    { key: "score", label: "Score", initial: "0" },
    { key: "bricks", label: "Bricks", initial: "0" },
    { key: "lives", label: "Lives", initial: "3" },
  ],
  init(api) {
    const { ctx } = api;
    const paddle = { w: 140, h: 14, x: 0, y: 0 };
    const ball = { x: 0, y: 0, vx: 0, vy: 0, r: 8 };
    let bricks: Brick[] = [];
    let score = 0;
    let lives = 3;
    let alive = true;
    let won = false;

    function rebuildBricks() {
      bricks = api.buildPageRects().map((r) => ({ ...r, alive: true }));
      api.setStat("bricks", bricks.length);
    }

    function resetBall() {
      const W = api.W();
      paddle.y = api.H() - 60;
      paddle.x = Math.max(0, Math.min(W - paddle.w, W / 2 - paddle.w / 2));
      ball.x = paddle.x + paddle.w / 2;
      ball.y = paddle.y - 20;
      ball.vx = (Math.random() < 0.5 ? -1 : 1) * 4.5;
      ball.vy = -5.5;
    }

    rebuildBricks();
    resetBall();
    api.toast("Move mouse to control · Esc to exit");

    api.on("mousemove", (e) => {
      const W = api.W();
      paddle.x = Math.max(0, Math.min(W - paddle.w, e.clientX - paddle.w / 2));
    }, true);

    api.on("keydown", (e) => {
      const W = api.W();
      if (e.key === "ArrowLeft") {
        paddle.x = Math.max(0, paddle.x - 36);
      } else if (e.key === "ArrowRight") {
        paddle.x = Math.min(W - paddle.w, paddle.x + 36);
      } else if (e.key === " " && (!alive || won)) {
        score = 0;
        lives = 3;
        alive = true;
        won = false;
        api.setStat("score", 0);
        api.setStat("lives", 3);
        rebuildBricks();
        resetBall();
      }
    });

    api.onResize(() => {
      rebuildBricks();
      paddle.y = api.H() - 60;
      paddle.x = Math.max(0, Math.min(api.W() - paddle.w, paddle.x));
    });

    function step(dt: number) {
      const W = api.W();
      const H = api.H();
      const f = dt * 60;

      if (alive && !won) {
        ball.x += ball.vx * f;
        ball.y += ball.vy * f;
        if (ball.x < ball.r) {
          ball.x = ball.r;
          ball.vx = Math.abs(ball.vx);
        }
        if (ball.x > W - ball.r) {
          ball.x = W - ball.r;
          ball.vx = -Math.abs(ball.vx);
        }
        if (ball.y < ball.r) {
          ball.y = ball.r;
          ball.vy = Math.abs(ball.vy);
        }

        if (
          ball.y + ball.r >= paddle.y &&
          ball.y - ball.r <= paddle.y + paddle.h &&
          ball.x >= paddle.x - 4 &&
          ball.x <= paddle.x + paddle.w + 4 &&
          ball.vy > 0
        ) {
          ball.y = paddle.y - ball.r - 0.1;
          const hit = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
          const speed = Math.min(11, Math.hypot(ball.vx, ball.vy) + 0.05);
          const angle = hit * 1.05;
          ball.vx = speed * Math.sin(angle);
          ball.vy = -Math.abs(speed * Math.cos(angle));
        }

        if (ball.y > H + 60) {
          lives -= 1;
          api.setStat("lives", lives);
          if (lives <= 0) alive = false;
          else resetBall();
        }

        let aliveCount = 0;
        for (let i = 0; i < bricks.length; i++) {
          const b = bricks[i];
          if (!b.alive) continue;
          aliveCount++;
          if (
            ball.x + ball.r > b.x &&
            ball.x - ball.r < b.x + b.w &&
            ball.y + ball.r > b.y &&
            ball.y - ball.r < b.y + b.h
          ) {
            b.alive = false;
            score += 10;
            const cx = b.x + b.w / 2;
            const cy = b.y + b.h / 2;
            const dx = (ball.x - cx) / (b.w / 2);
            const dy = (ball.y - cy) / (b.h / 2);
            if (Math.abs(dx) > Math.abs(dy)) ball.vx = -ball.vx;
            else ball.vy = -ball.vy;
            aliveCount--;
          }
        }
        api.setStat("bricks", aliveCount);
        api.setStat("score", score);
        if (aliveCount === 0) won = true;
      }

      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < bricks.length; i++) {
        const b = bricks[i];
        if (!b.alive) continue;
        ctx.fillStyle = `hsla(${b.hue}, 80%, 56%, 0.82)`;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = `hsla(${b.hue}, 100%, 78%, 0.9)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1);
      }

      ctx.fillStyle = "#fff";
      ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();

      if (!alive || won) {
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.font = "600 48px ui-sans-serif, system-ui, sans-serif";
        ctx.fillText(won ? "Page cleared." : "Game Over", W / 2, H / 2 - 8);
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
