/* DrinkX drink motion assets — data-driven asset resolution & preload.
   The UI never hardcodes one video into one screen: every screen resolves
   assets by drinkId through this module. Missing files are a normal state —
   the premium procedural renderer (drink-renderer.js) is the always-available
   fallback, so dropping real renders/videos into /assets/drinks/<slug>/
   upgrades the experience without touching UI code.
   Expected files per drink — see /assets/drinks/MOTION-ASSETS.md. */

/* DrinkAssetSet (per spec):
   { drinkId, staticRender, assemblyVideoWebm?, assemblyVideoMp4?,
     preparationVideoWebm?, preparationVideoMp4?, readyRender?,
     fallbackImage, posterImage? } */

const SLUGS = {
  focus_flat: "focus-flat",
  morning_boost: "morning-boost",
  latte_soft: "latte-soft",
  iced_balance: "iced-balance",
  oat_vanilla_calm: "oat-vanilla-calm",
  road_coffee: "road-coffee",
  cold_energy: "cold-energy",
  evening_decaf: "evening-decaf",
  no_sugar_creamy: "no-sugar-creamy",
  after_lunch: "after-lunch"
};

export const DRINK_ASSETS = Object.fromEntries(
  Object.entries(SLUGS).map(([drinkId, slug]) => {
    const base = `../assets/drinks/${slug}`;
    return [drinkId, {
      drinkId,
      staticRender: `${base}/render.webp`,
      assemblyVideoWebm: `${base}/assembly.webm`,
      assemblyVideoMp4: `${base}/assembly.mp4`,
      preparationVideoWebm: `${base}/preparation.webm`,
      preparationVideoMp4: `${base}/preparation.mp4`,
      readyRender: `${base}/ready.webp`,
      fallbackImage: `${base}/fallback.webp`,
      posterImage: `${base}/poster.webp`
    }];
  })
);

export function resolveAssets(drinkId) {
  return DRINK_ASSETS[drinkId] || null;
}

/* ---------------- preload with cache ----------------
   preloadDrinkAssets(drinkId) -> { assemblyReady, preparationReady, staticReady }
   Called the moment a drink is selected/confirmed, so the assembly screen
   never waits: if a video isn't ready in time, the procedural scene plays
   and the video can take over on a later order. Results are cached —
   repeated calls don't re-download. */

const preloadCache = new Map();          // drinkId -> Promise<result>
const readiness = new Map();             // `${drinkId}:${kind}` -> boolean

function probeImage(url, timeoutMs = 3000) {
  return new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => resolve(false), timeoutMs);
    img.onload = () => { clearTimeout(timer); resolve(true); };
    img.onerror = () => { clearTimeout(timer); resolve(false); };
    img.src = url;
  });
}

function probeVideo(urls, timeoutMs = 4000) {
  return new Promise((resolve) => {
    const sources = urls.filter(Boolean);
    if (!sources.length) { resolve(false); return; }
    const video = document.createElement("video");
    video.muted = true;
    video.preload = "auto";
    const timer = setTimeout(() => { cleanup(); resolve(false); }, timeoutMs);
    const cleanup = () => { clearTimeout(timer); video.removeAttribute("src"); video.querySelectorAll("source").forEach((s) => s.remove()); };
    video.addEventListener("canplaythrough", () => { cleanup(); resolve(true); }, { once: true });
    video.addEventListener("error", () => { cleanup(); resolve(false); }, { once: true });
    sources.forEach((url) => {
      const source = document.createElement("source");
      source.src = url;
      video.appendChild(source);
    });
    video.load();
  });
}

export function preloadDrinkAssets(drinkId) {
  if (preloadCache.has(drinkId)) return preloadCache.get(drinkId);
  const set = resolveAssets(drinkId);
  if (!set) return Promise.resolve({ assemblyReady: false, preparationReady: false, staticReady: false });

  const job = Promise.all([
    probeVideo([set.assemblyVideoWebm, set.assemblyVideoMp4]),
    probeVideo([set.preparationVideoWebm, set.preparationVideoMp4]),
    probeImage(set.staticRender),
    probeImage(set.readyRender),
    probeImage(set.posterImage, 2000),
    probeImage(set.fallbackImage, 2000)
  ]).then(([assemblyReady, preparationReady, staticReady, readyReady, posterReady, fallbackReady]) => {
    readiness.set(`${drinkId}:assembly`, assemblyReady);
    readiness.set(`${drinkId}:preparation`, preparationReady);
    readiness.set(`${drinkId}:static`, staticReady);
    readiness.set(`${drinkId}:ready`, readyReady);
    readiness.set(`${drinkId}:poster`, posterReady);
    readiness.set(`${drinkId}:fallback`, fallbackReady);
    return { assemblyReady, preparationReady, staticReady };
  });

  preloadCache.set(drinkId, job);
  return job;
}

/* Synchronous readiness lookup — true only after a successful probe.
   Screens use this to decide procedural vs asset without async flicker. */
export function assetReady(drinkId, kind) {
  return readiness.get(`${drinkId}:${kind}`) === true;
}
