export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
  hue: number;
  text?: string;
  synthetic?: boolean;
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
  onPageChange: (fn: () => void) => void;
  onCleanup: (fn: () => void) => void;
  buildPageRects: (opts?: BuildRectsOpts) => Rect[];
};

export type GameModule = {
  slug: string;
  name: string;
  hue: number;
  hud: Array<{ key: string; label: string; initial: string }>;
  consumedKeys?: string[];
  init: (api: GameAPI) => { step: (dt: number) => void };
};

const HOST_ID = "__webcade_host__";

type HostEl = HTMLElement & { __cleanup?: () => void };

const SCROLL_KEYS = new Set([
  " ",
  "pageup",
  "pagedown",
  "home",
  "end",
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "tab",
]);

const SYNTH_WORDS = [
  "BOOM", "ZAP", "PIXEL", "RUN", "JUMP", "DASH", "STAR", "BLOCK",
  "BRICK", "GLOW", "RAY", "DOT", "LOOP", "BYTE", "WAVE", "FLUX",
  "CORE", "GLITCH", "ECHO", "SPARK", "BLITZ", "SPRITE", "WARP", "SCAN",
  "PULSE", "ORBIT", "VOID", "NEON", "QUARK", "SHIFT",
];

const SHADOW_STYLE = `
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
`;

function buildShadowTree(
  shadow: ShadowRoot,
  game: GameModule
): {
  canvas: HTMLCanvasElement;
  exitBtn: HTMLButtonElement;
  toastEl: HTMLDivElement;
  hudPills: Map<string, HTMLElement>;
} {
  const styleEl = document.createElement("style");
  styleEl.textContent = SHADOW_STYLE;
  shadow.appendChild(styleEl);

  const stage = document.createElement("div");
  stage.className = "stage";

  const canvas = document.createElement("canvas");
  stage.appendChild(canvas);

  const hud = document.createElement("div");
  hud.className = "hud";

  const gameName = document.createElement("span");
  gameName.className = "game-name";
  gameName.textContent = game.name;
  hud.appendChild(gameName);

  const hudPills = new Map<string, HTMLElement>();
  for (const h of game.hud) {
    const pill = document.createElement("span");
    pill.className = "pill";
    pill.appendChild(document.createTextNode(`${h.label} `));
    const stat = document.createElement("b");
    stat.dataset.stat = h.key;
    stat.textContent = h.initial;
    pill.appendChild(stat);
    hud.appendChild(pill);
    hudPills.set(h.key, stat);
  }

  const exitBtn = document.createElement("button");
  exitBtn.className = "exit";
  exitBtn.type = "button";
  exitBtn.textContent = "Exit (Esc)";
  hud.appendChild(exitBtn);
  stage.appendChild(hud);

  const toastEl = document.createElement("div");
  toastEl.className = "toast";
  stage.appendChild(toastEl);

  shadow.appendChild(stage);

  return { canvas, exitBtn, toastEl, hudPills };
}

function generateSyntheticRects(
  W: number,
  H: number,
  opts: BuildRectsOpts
): Rect[] {
  const cols = 12;
  const colW = Math.floor(W / cols);
  const rowH = 70;
  const rows = Math.max(2, Math.floor((H - 40) / rowH));
  const wantWords = opts.capture === "words";
  const out: Rect[] = [];
  let hue = 200;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.random() < 0.35) continue;
      const x = c * colW + 8 + Math.floor(Math.random() * 6);
      const y = r * rowH + 24 + Math.floor(Math.random() * 6);
      const w = Math.max(20, colW - 16 - Math.floor(Math.random() * 16));
      const h = 18 + Math.floor(Math.random() * 8);
      const rect: Rect = { x, y, w, h, hue: hue % 360, synthetic: true };
      if (wantWords) {
        rect.text = SYNTH_WORDS[out.length % SYNTH_WORDS.length];
      }
      out.push(rect);
      hue += 17;
    }
  }
  return out;
}

export function startRuntime(game: GameModule) {
  if (!document.body) {
    document.addEventListener(
      "DOMContentLoaded",
      () => startRuntime(game),
      { once: true }
    );
    return;
  }

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

  const { canvas, exitBtn, toastEl, hudPills } = buildShadowTree(shadow, game);

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

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
  const pageChangeCallbacks: Array<() => void> = [];

  function on<K extends keyof WindowEventMap>(
    type: K,
    fn: (e: WindowEventMap[K]) => void,
    opts?: AddEventListenerOptions | boolean
  ) {
    let finalOpts: AddEventListenerOptions | boolean | undefined = opts;
    if (finalOpts === undefined) {
      if (type === "keydown" || type === "keyup") {
        finalOpts = { capture: true };
      }
    }
    window.addEventListener(type, fn as EventListener, finalOpts);
    cleanups.push(() =>
      window.removeEventListener(type, fn as EventListener, finalOpts)
    );
  }

  function setStat(key: string, value: string | number) {
    const el = hudPills.get(key);
    if (el) el.textContent = String(value);
  }

  let toastTimer = 0;
  function toast(msg: string, ms = 2400) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toastEl.classList.remove("show"), ms);
  }

  let lastRectCount = 0;
  let syntheticToastShown = false;
  let lastSynthetic = false;

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

    let totalArea = 0;
    for (let i = 0; i < out.length; i++) totalArea += out[i].w * out[i].h;
    const viewport = Math.max(1, W * H);
    if (totalArea / viewport < 0.04) {
      if (!syntheticToastShown) {
        toast("no readable text — playing in arcade mode", 3200);
        syntheticToastShown = true;
      }
      const synth = generateSyntheticRects(W, H, opts);
      lastRectCount = synth.length;
      lastSynthetic = true;
      return synth;
    }

    lastRectCount = out.length;
    lastSynthetic = false;
    return out;
  }

  const consumed = new Set((game.consumedKeys ?? []).map((k) => k.toLowerCase()));
  let rebuildCount = 0;
  const debugEnabled =
    typeof location !== "undefined" && /[?&]debug=1\b/.test(location.search);

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
    onPageChange: (fn) => pageChangeCallbacks.push(fn),
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
    for (const fn of pageChangeCallbacks) {
      try {
        fn();
      } catch {
        // ignore
      }
    }
  });

  // Scroll-blockers (page can't scroll out from under the game)
  const blockScroll = (e: Event) => e.preventDefault();
  on("wheel", blockScroll, { passive: false, capture: true });
  on("touchmove", blockScroll, { passive: false, capture: true });

  // MutationObserver re-snapshot
  let mutationCount = 0;
  let mutationWindowStart = 0;
  let rebuildScheduled: number | null = null;
  let rebuildHandle: { kind: "ric" | "to"; id: number } | null = null;

  function fireRebuild() {
    rebuildScheduled = null;
    rebuildHandle = null;
    if (stopped) return;
    rebuildCount++;
    toast("page changed — rebuilding", 1400);
    for (const fn of pageChangeCallbacks) {
      try {
        fn();
      } catch {
        // ignore
      }
    }
  }

  const mo = new MutationObserver((records) => {
    let relevantCount = 0;
    for (const r of records) {
      if (!host.contains(r.target)) relevantCount++;
    }
    if (relevantCount === 0) return;
    const now = performance.now();
    if (now - mutationWindowStart > 200) {
      mutationWindowStart = now;
      mutationCount = 0;
    }
    mutationCount += relevantCount;
    if (mutationCount > 5 && rebuildScheduled === null) {
      rebuildScheduled = now;
      const ric = (window as unknown as {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      }).requestIdleCallback;
      if (typeof ric === "function") {
        rebuildHandle = { kind: "ric", id: ric(fireRebuild, { timeout: 1500 }) };
      } else {
        rebuildHandle = { kind: "to", id: window.setTimeout(fireRebuild, 1500) };
      }
    }
  });
  try {
    mo.observe(document.body, { childList: true, subtree: true });
    cleanups.push(() => mo.disconnect());
  } catch {
    // ignore — page may not allow observation
  }
  cleanups.push(() => {
    if (!rebuildHandle) return;
    if (rebuildHandle.kind === "to") {
      window.clearTimeout(rebuildHandle.id);
    } else {
      const cic = (window as unknown as {
        cancelIdleCallback?: (id: number) => void;
      }).cancelIdleCallback;
      if (typeof cic === "function") cic(rebuildHandle.id);
    }
    rebuildHandle = null;
  });

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
    if (debugEnabled) {
      try {
        delete (window as unknown as { __webcade_debug?: unknown }).__webcade_debug;
      } catch {
        // ignore
      }
    }
    host.remove();
  }
  host.__cleanup = cleanup;

  // Run game init first so its keydown/keyup listeners register before the master.
  // Same target (window) + same phase (capture) → fire in registration order, so games run before master.
  const { step } = game.init(api);

  // Master keydown: handles Esc, scroll-key suppression, game-key propagation guard.
  on(
    "keydown",
    (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        cleanup();
        return;
      }
      const key = e.key.toLowerCase();
      if (SCROLL_KEYS.has(key)) e.preventDefault();
      if (consumed.has(key)) e.stopPropagation();
    },
    true
  );

  // Visibility self-check 500ms after mount.
  const visTimer = window.setTimeout(() => {
    if (stopped) return;
    const top = document.elementFromPoint(W / 2, H / 2);
    if (top && top !== host && !host.contains(top)) {
      toast("Another modal is on top — close it and re-open Webcade.", 5000);
    }
  }, 500);
  cleanups.push(() => window.clearTimeout(visTimer));

  if (debugEnabled) {
    Object.defineProperty(window, "__webcade_debug", {
      configurable: true,
      enumerable: false,
      writable: true,
      value: {
        get game() {
          return game.slug;
        },
        get rectCount() {
          return lastRectCount;
        },
        get rebuildCount() {
          return rebuildCount;
        },
        get synthetic() {
          return lastSynthetic;
        },
      },
    });
  }

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
