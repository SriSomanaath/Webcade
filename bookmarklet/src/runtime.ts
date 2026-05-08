export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
  hue: number;
  text?: string;
};

export type BuildRectsOpts = {
  minW?: number;
  minH?: number;
  capture?: "rects" | "words";
};

export type GameAPI = {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  shadow: ShadowRoot;
  W: () => number;
  H: () => number;
  setStat: (key: string, value: string | number) => void;
  toast: (msg: string, ms?: number) => void;
  on: <K extends keyof WindowEventMap>(
    type: K,
    fn: (e: WindowEventMap[K]) => void,
    opts?: AddEventListenerOptions | boolean
  ) => void;
  onResize: (fn: () => void) => void;
  onCleanup: (fn: () => void) => void;
  buildPageRects: (opts?: BuildRectsOpts) => Rect[];
};

export type GameModule = {
  slug: string;
  name: string;
  hue: number;
  hud: Array<{ key: string; label: string; initial: string }>;
  init: (api: GameAPI) => { step: (dt: number) => void };
};

const HOST_ID = "__webcade_host__";

type HostEl = HTMLElement & { __cleanup?: () => void };

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c] as string
  );
}

export function startRuntime(game: GameModule) {
  const existing = document.getElementById(HOST_ID) as HostEl | null;
  if (existing) {
    const prevSlug = existing.dataset.game;
    existing.__cleanup?.();
    existing.remove();
    if (prevSlug === game.slug) return;
  }

  const host = document.createElement("div") as HostEl;
  host.id = HOST_ID;
  host.dataset.game = game.slug;
  host.style.cssText =
    "all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: auto;";
  document.body.appendChild(host);
  const shadow = host.attachShadow({ mode: "open" });

  const pillsHtml = game.hud
    .map(
      (h) =>
        `<span class="pill">${escapeHtml(
          h.label
        )} <b data-stat="${escapeHtml(h.key)}">${escapeHtml(h.initial)}</b></span>`
    )
    .join("");

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
        max-width: calc(100vw - 24px);
      }
      .game-name { opacity: 0.7; padding-right: 8px; margin-right: 2px; border-right: 1px solid rgba(255,255,255,0.18); }
      .pill { font-variant-numeric: tabular-nums; opacity: 0.85; white-space: nowrap; }
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
        opacity: 0; transition: opacity 0.4s ease; pointer-events: none; max-width: 80vw;
      }
      .toast.show { opacity: 1; }
    </style>
    <div class="stage">
      <canvas></canvas>
      <div class="hud">
        <span class="game-name">${escapeHtml(game.name)}</span>
        ${pillsHtml}
        <button class="exit" type="button">Exit (Esc)</button>
      </div>
      <div class="toast"></div>
    </div>
  `;
  shadow.appendChild(root);

  const canvas = shadow.querySelector("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const exitBtn = shadow.querySelector("button.exit") as HTMLButtonElement;
  const toastEl = shadow.querySelector(".toast") as HTMLElement;

  let W = 0;
  let H = 0;
  function resizeCanvas() {
    W = window.innerWidth;
    H = window.innerHeight;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resizeCanvas();

  const cleanups: Array<() => void> = [];
  const resizeCallbacks: Array<() => void> = [];

  function on<K extends keyof WindowEventMap>(
    type: K,
    fn: (e: WindowEventMap[K]) => void,
    opts?: AddEventListenerOptions | boolean
  ) {
    window.addEventListener(type, fn as EventListener, opts);
    cleanups.push(() =>
      window.removeEventListener(type, fn as EventListener, opts)
    );
  }

  function setStat(key: string, value: string | number) {
    const el = shadow.querySelector(`[data-stat="${CSS.escape(key)}"]`);
    if (el) el.textContent = String(value);
  }

  let toastTimer = 0;
  function toast(msg: string, ms = 2400) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toastEl.classList.remove("show"), ms);
  }

  function buildPageRects(opts: BuildRectsOpts = {}): Rect[] {
    const minW = opts.minW ?? 14;
    const minH = opts.minH ?? 8;
    const mode = opts.capture ?? "rects";
    const out: Rect[] = [];
    let hue = 200;

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
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
    });

    let n: Node | null;
    while ((n = walker.nextNode())) {
      const text = n.nodeValue ?? "";
      if (mode === "words") {
        const re = /\S+/g;
        let m: RegExpExecArray | null;
        while ((m = re.exec(text))) {
          const range = document.createRange();
          range.setStart(n, m.index);
          range.setEnd(n, m.index + m[0].length);
          const r = range.getBoundingClientRect();
          if (r.width < minW || r.height < minH) continue;
          if (r.bottom < 0 || r.top > H || r.right < 0 || r.left > W) continue;
          out.push({
            x: r.left,
            y: r.top,
            w: r.width,
            h: r.height,
            hue: hue % 360,
            text: m[0],
          });
          hue += 13;
        }
      } else {
        const range = document.createRange();
        range.selectNodeContents(n);
        const rects = range.getClientRects();
        for (let i = 0; i < rects.length; i++) {
          const r = rects[i];
          if (r.width < minW || r.height < minH) continue;
          if (r.bottom < 0 || r.top > H || r.right < 0 || r.left > W) continue;
          out.push({
            x: r.left,
            y: r.top,
            w: r.width,
            h: r.height,
            hue: hue % 360,
          });
          hue += 13;
        }
      }
    }
    return out;
  }

  const api: GameAPI = {
    ctx,
    canvas,
    shadow,
    W: () => W,
    H: () => H,
    setStat,
    toast,
    on,
    onResize: (fn) => resizeCallbacks.push(fn),
    onCleanup: (fn) => cleanups.push(fn),
    buildPageRects,
  };

  on("resize", () => {
    resizeCanvas();
    for (const fn of resizeCallbacks) {
      try {
        fn();
      } catch {
        // ignore
      }
    }
  });
  on(
    "keydown",
    (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cleanup();
      }
    },
    true
  );

  function onExit() {
    cleanup();
  }
  exitBtn.addEventListener("click", onExit);
  cleanups.push(() => exitBtn.removeEventListener("click", onExit));

  let raf = 0;
  let lastTime = performance.now();
  let stopped = false;

  function cleanup() {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(raf);
    window.clearTimeout(toastTimer);
    for (const fn of cleanups) {
      try {
        fn();
      } catch {
        // ignore
      }
    }
    host.remove();
  }
  host.__cleanup = cleanup;

  const { step } = game.init(api);

  const COUNTDOWN_TOTAL = 3.5;
  let countdownLeft = COUNTDOWN_TOTAL;
  const accent = `hsl(${game.hue} 78% 60%)`;

  function drawCountdown(remaining: number) {
    let text: string;
    let beatStart: number;
    let beatLen: number;
    let isGo = false;
    if (remaining > 2.5) {
      text = "3";
      beatStart = 0;
      beatLen = 1;
    } else if (remaining > 1.5) {
      text = "2";
      beatStart = 1;
      beatLen = 1;
    } else if (remaining > 0.5) {
      text = "1";
      beatStart = 2;
      beatLen = 1;
    } else {
      text = "GO!";
      beatStart = 3;
      beatLen = 0.5;
      isGo = true;
    }
    const elapsedInBeat = COUNTDOWN_TOTAL - remaining - beatStart;
    const beatProgress = Math.max(0, Math.min(1, elapsedInBeat / beatLen));

    const baseScale = 0.55 + Math.min(1, beatProgress * 3) * 0.45;
    const pulse = Math.sin(beatProgress * Math.PI) * 0.08;
    const scale = baseScale + pulse;
    const alpha = beatProgress < 0.7 ? 1 : Math.max(0, (1 - beatProgress) / 0.3);

    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, W, H);

    ctx.translate(W / 2, H / 2);
    ctx.scale(scale, scale);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = accent;
    ctx.shadowBlur = isGo ? 36 : 24;
    ctx.fillStyle = isGo ? accent : `rgba(255, 255, 255, ${alpha})`;
    if (isGo) ctx.globalAlpha = alpha;
    ctx.font = `900 ${isGo ? 120 : 160}px ui-sans-serif, system-ui, -apple-system, sans-serif`;
    ctx.fillText(text, 0, 0);
    ctx.restore();

    if (!isGo) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.55})`;
      ctx.font = "600 13px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText("READY", W / 2, H / 2 + 110);
      ctx.restore();
    }
  }

  function loop() {
    const now = performance.now();
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    try {
      if (countdownLeft > 0) {
        step(0);
        drawCountdown(countdownLeft);
        countdownLeft -= dt;
      } else {
        step(dt);
      }
    } catch (err) {
      console.error("[webcade]", err);
      cleanup();
      return;
    }
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);
}
