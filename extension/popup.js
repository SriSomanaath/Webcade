const GAMES = [
  { slug: "brickout", name: "Brickout" },
  { slug: "snake", name: "Snake" },
  { slug: "whack-the-page", name: "Whack" },
  { slug: "page-raiders", name: "Raiders" },
  { slug: "page-taxi", name: "Taxi" },
];

const list = document.getElementById("game-list");
for (const g of GAMES) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = g.name;
  btn.dataset.slug = g.slug;
  btn.addEventListener("click", () => launch(g.slug));
  list.appendChild(btn);
}

async function launch(slug) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  // Set the chosen game on window.__webcade_game in the page's MAIN world.
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    world: "MAIN",
    func: (s) => {
      window.__webcade_game = s;
    },
    args: [slug],
  });

  // Inject the bookmarklet IIFE in MAIN world. CSP `script-src` does not gate this path.
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    world: "MAIN",
    files: ["bookmarklet.js"],
  });

  window.close();
}
