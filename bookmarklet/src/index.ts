(function () {
  const HOST_ID = "__webcade_host__";

  // Toggle: if already running, close it.
  const existing = document.getElementById(HOST_ID);
  if (existing) {
    (existing as HTMLElement & { __cleanup?: () => void }).__cleanup?.();
    existing.remove();
    return;
  }

  type Brick = {
    x: number;
    y: number;
    w: number;
    h: number;
    alive: boolean;
    hue: number;
  };

  const host = document.createElement("div");
  host.id = HOST_ID;
  host.style.cssText =
    "all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: auto;";
  document.body.appendChild(host);
  const shadow = host.attachShadow({ mode: "open" });

  const root = document.createElement("div");
  root.innerHTML = `
    <style>
      :host { color-scheme: dark; }
      .stage { position: fixed; inset: 0; background: rgba(8, 8, 12, 0.55); backdrop-filter: blur(2px); }
      canvas { position: fixed; inset: 0; display: block; cursor: none; }
      .hud {
        position: fixed; top: 14px; left: 50%; transform: translateX(-50%);
        display: flex; gap: 10px; align-items: center;
        padding: 8px 10px 8px 14px; background: rgba(0,0,0,0.7);
        border: 1px solid rgba(255,255,255,0.12); border-radius: 999px;
        font: 600 13px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
        color: #fff; backdrop-filter: blur(8px);
      }
      .pill { font-variant-numeric: tabular-nums; opacity: 0.85; }
      .pill b { color: #fff; opacity: 1; margin-left: 2px; }
      .pill + .pill::before { content: "·"; margin-right: 10px; opacity: 0.4; }
      button.exit {
        all: unset; cursor: pointer; padding: 4px 12px; border-radius: 999px;
        background: rgba(255,255,255,0.14); color: #fff; font: 600 12px ui-sans-serif, system-ui, sans-serif;
      }
      button.exit:hover { background: rgba(255,255,255,0.22); }
      .toast {
        position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
        padding: 8px 14px; background: rgba(0,0,0,0.65); color: #fff;
        border-radius: 999px; font: 500 12px ui-sans-serif, system-ui, sans-serif;
        opacity: 0; transition: opacity 0.4s ease; pointer-events: none;
      }
      .toast.show { opacity: 1; }
    </style>
    <div class="stage">
      <canvas></canvas>
      <div class="hud">
        <span class="pill">Score <b id="score">0</b></span>
        <span class="pill">Bricks <b id="bricks">0</b></span>
        <span class="pill">Lives <b id="lives">3</b></span>
        <button class="exit" type="button">Exit (Esc)</button>
      </div>
      <div class="toast" id="toast">Move mouse to control · Esc to exit</div>
    </div>
  `;
  shadow.appendChild(root);

  const canvas = shadow.querySelector("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const exitBtn = shadow.querySelector("button.exit") as HTMLButtonElement;
  const scoreEl = shadow.getElementById("score") as HTMLElement;
  const bricksEl = shadow.getElementById("bricks") as HTMLElement;
  const livesEl = shadow.getElementById("lives") as HTMLElement;
  const toastEl = shadow.getElementById("toast") as HTMLElement;

  let W = 0;
  let H = 0;
  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();

  // Build bricks from visible text rects on the page.
  const bricks: Brick[] = [];
  function buildBricks() {
    bricks.length = 0;
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (host.contains(node)) return NodeFilter.FILTER_REJECT;
          const text = node.nodeValue;
          if (!text || !text.trim()) return NodeFilter.FILTER_REJECT;
          const parent = (node as Text).parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName;
          if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT")
            return NodeFilter.FILTER_REJECT;
          const cs = window.getComputedStyle(parent);
          if (
            cs.display === "none" ||
            cs.visibility === "hidden" ||
            cs.opacity === "0"
          )
            return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    let n: Node | null;
    let hue = 200;
    while ((n = walker.nextNode())) {
      const range = document.createRange();
      range.selectNodeContents(n);
      const rects = range.getClientRects();
      for (let i = 0; i < rects.length; i++) {
        const r = rects[i];
        if (r.width < 14 || r.height < 8) continue;
        if (r.bottom < 0 || r.top > H || r.right < 0 || r.left > W) continue;
        bricks.push({
          x: r.left,
          y: r.top,
          w: r.width,
          h: r.height,
          alive: true,
          hue: hue % 360,
        });
        hue += 13;
      }
    }
    bricksEl.textContent = String(bricks.length);
  }
  buildBricks();

  // Game state
  const paddle = { w: 140, h: 14, x: W / 2 - 70, y: H - 60, color: "#fff" };
  const ball = {
    x: W / 2,
    y: H - 100,
    vx: 4.5,
    vy: -5.5,
    r: 8,
  };
  let score = 0;
  let lives = 3;
  let alive = true;
  let won = false;
  let raf = 0;

  function resetBall() {
    paddle.x = Math.max(0, Math.min(W - paddle.w, paddle.x));
    ball.x = paddle.x + paddle.w / 2;
    ball.y = paddle.y - 20;
    ball.vx = (Math.random() < 0.5 ? -1 : 1) * 4.5;
    ball.vy = -5.5;
  }
  resetBall();

  // Show toast briefly
  toastEl.classList.add("show");
  const toastTimer = window.setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2400);

  function onMouseMove(e: MouseEvent) {
    paddle.x = Math.max(0, Math.min(W - paddle.w, e.clientX - paddle.w / 2));
  }
  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      cleanup();
    } else if (e.key === "ArrowLeft") {
      paddle.x = Math.max(0, paddle.x - 36);
    } else if (e.key === "ArrowRight") {
      paddle.x = Math.min(W - paddle.w, paddle.x + 36);
    } else if (e.key === " " && (!alive || won)) {
      score = 0;
      lives = 3;
      alive = true;
      won = false;
      buildBricks();
      resetBall();
    }
  }
  function onResize() {
    resize();
    buildBricks();
  }

  window.addEventListener("mousemove", onMouseMove, true);
  window.addEventListener("keydown", onKeyDown, true);
  window.addEventListener("resize", onResize);
  exitBtn.addEventListener("click", () => cleanup());

  function cleanup() {
    window.removeEventListener("mousemove", onMouseMove, true);
    window.removeEventListener("keydown", onKeyDown, true);
    window.removeEventListener("resize", onResize);
    cancelAnimationFrame(raf);
    window.clearTimeout(toastTimer);
    host.remove();
  }
  (host as HTMLElement & { __cleanup?: () => void }).__cleanup = cleanup;

  function step() {
    if (alive && !won) {
      ball.x += ball.vx;
      ball.y += ball.vy;
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
      // Paddle
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
        livesEl.textContent = String(lives);
        if (lives <= 0) alive = false;
        else resetBall();
      }
      // Bricks
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
      bricksEl.textContent = String(aliveCount);
      scoreEl.textContent = String(score);
      if (aliveCount === 0) won = true;
    }

    // Draw
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
    // Paddle
    ctx.fillStyle = paddle.color;
    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
    // Ball
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

    raf = requestAnimationFrame(step);
  }
  step();
})();
