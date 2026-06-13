/* DrinkMotionAsset — vanilla implementation of the asset playback component.
   React mapping (CONCEPT.md §9): <DrinkMotionAsset drinkId mode autoplay muted
   playsInline loop reducedMotion onReady onError onEnded/>.

   Modes:
   - "card"        static render image; procedural drink-renderer fallback.
   - "assembly"    assembly video (WebM → MP4); fallback = the live procedural
                   scene that is already on stage (we simply don't cover it).
   - "preparation" preparation video; else assembly video; else procedural scene.
   - "ready"       ready render image; procedural fallback.

   A video failure NEVER breaks the order flow: the procedural scene, taste
   profile, timeline, AI comments and module states stay fully functional.
   Customer-facing fallback copy lives on the scene itself; only an internal
   console.warn is emitted here. */

import { resolveAssets, assetReady } from "/concept/drink-assets.js";
import { renderDrink } from "/concept/drink-renderer.js";

const REDUCED = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------- static visual (card / ready) ----------------
   Renders the premium procedural drink immediately, then upgrades to the
   pre-rendered image only if the asset is known-good (probed by preload). */
export function mountDrinkVisual(container, recipe, { mode = "card", width = 120, prefix, effects = false } = {}) {
  const set = resolveAssets(recipe.id);
  container.innerHTML = renderDrink(recipe, { width, prefix: prefix || `ma-${recipe.id}-${mode}`, effects });

  const kind = mode === "ready" ? "ready" : "static";
  const url = mode === "ready" ? set?.readyRender : set?.staticRender;
  if (!set || !url || !assetReady(recipe.id, kind)) return;

  const img = new Image();
  img.className = "asset-render";
  img.alt = "";
  img.style.width = `${width}px`;
  img.onload = () => { container.innerHTML = ""; container.appendChild(img); };
  img.onerror = () => { /* keep procedural */ };
  img.src = url;
}

/* ---------------- stage motion (assembly / preparation) ----------------
   Tries to mount a drink video over the cup area of the assembly stage.
   On success: stage gets `has-video`, the procedural cup hides, UI overlays
   (modules, flows, ring, timeline) keep running in sync around the video.
   On failure: nothing changes — the procedural scene IS the fallback. */
export function mountStageMotion(stageHost, recipe, {
  mode = "assembly",
  autoplay = true,
  loop = false,
  onReady,
  onError,
  onEnded
} = {}) {
  const controller = {
    video: null,
    destroy() {
      stageHost.classList.remove("has-video");
      this.video?.pause?.();
      this.video?.remove();
      this.video = null;
    }
  };

  if (REDUCED()) return controller;                      // static premium scene only

  const set = resolveAssets(recipe.id);
  if (!set) return controller;

  const sources = mode === "preparation"
    ? [set.preparationVideoWebm, set.preparationVideoMp4, set.assemblyVideoWebm, set.assemblyVideoMp4]
    : [set.assemblyVideoWebm, set.assemblyVideoMp4];

  const video = document.createElement("video");
  video.className = "stage-video";
  video.muted = true;
  video.playsInline = true;
  video.autoplay = autoplay;
  video.loop = loop;
  if (assetReady(recipe.id, "poster")) video.poster = set.posterImage;

  let failed = 0;
  let settled = false;
  const urls = sources.filter(Boolean);
  urls.forEach((url) => {
    const source = document.createElement("source");
    source.src = url;
    source.addEventListener("error", () => {
      failed += 1;
      if (failed >= urls.length && !settled) {
        settled = true;
        console.warn(`[DrinkMotionAsset] no ${mode} video for ${recipe.id} — premium procedural fallback stays active`);
        controller.destroy();
        onError?.(new Error("video sources failed"));
      }
    });
    video.appendChild(source);
  });

  video.addEventListener("canplay", () => {
    if (!controller.video) return;          // destroyed while loading — keep procedural scene
    stageHost.classList.add("has-video");
    onReady?.();
  }, { once: true });
  video.addEventListener("ended", () => onEnded?.());

  controller.video = video;
  stageHost.appendChild(video);
  return controller;
}
