/* DrinkX premium drink renderer — one parameterized visual system for every drink.
   Semi-realistic 2.5D product render in procedural SVG:
   cylindrical geometry (every liquid level is an ellipse, never a flat line),
   visible wall thickness, studio lighting, material gradients, crema/foam/ice
   textures, steam & condensation. Same cup, same camera, same light for all drinks.
   Consumes recipe data via drinkVisualModel(); the assembly engine animates
   reveal rects so the premium render itself is what gets "poured".
   Upgrade path to Three.js / Spline is documented in CONCEPT.md §15. */

/* ----------------------------------------------------------- geometry
   Master cup space: 300 × 420. Slightly tapered tall glass.
   Inner radius interpolates linearly between rim and base. */
const G = {
  W: 300, H: 420, cx: 150,
  rimY: 64, rimRx: 86, rimRy: 15, rimInRx: 77, rimInRy: 13.5,
  baseY: 374, baseRx: 61, baseRy: 11.5, baseInRx: 53, baseInRy: 9.5,
  liqTop: 96, liqBottom: 364
};

const tAt = (y) => (G.baseY - y) / (G.baseY - G.rimY);
const rIn = (y) => G.baseInRx + tAt(y) * (G.rimInRx - G.baseInRx);
const ryIn = (y) => G.baseInRy + tAt(y) * (G.rimInRy - G.baseInRy);
const rOut = (y) => G.baseRx + tAt(y) * (G.rimRx - G.baseRx);

function shade(hex, amt) {
  const n = hex.replace("#", "");
  const ch = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  const f = (c) => Math.max(0, Math.min(255, Math.round(amt > 0 ? c + (255 - c) * (amt / 100) : c + c * (amt / 100))));
  return `#${ch.map((c) => f(c).toString(16).padStart(2, "0")).join("")}`;
}

/* front-of-cylinder band: top edge = lower arc of ellipse(y1), bottom = lower arc at y2 */
function bandPath(y1, y2) {
  const r1 = rIn(y1), r2 = rIn(y2), ry1 = ryIn(y1), ry2 = ryIn(y2), c = G.cx;
  return `M ${c - r1},${y1} L ${c - r2},${y2} A ${r2},${ry2} 0 0 0 ${c + r2},${y2} L ${c + r1},${y1} A ${r1},${ry1} 0 0 1 ${c - r1},${y1} Z`;
}

function innerSilhouette() {
  const rT = rIn(G.liqTop), rB = rIn(G.liqBottom), c = G.cx;
  return `M ${c - rT},${G.liqTop} L ${c - rB},${G.liqBottom} A ${rB},${ryIn(G.liqBottom)} 0 0 0 ${c + rB},${G.liqBottom} L ${c + rT},${G.liqTop} A ${rT},${ryIn(G.liqTop)} 0 0 0 ${c - rT},${G.liqTop} Z`;
}

function outerSilhouette() {
  const c = G.cx;
  return `M ${c - G.rimRx},${G.rimY} L ${c - G.baseRx},${G.baseY} A ${G.baseRx},${G.baseRy} 0 0 0 ${c + G.baseRx},${G.baseY} L ${c + G.rimRx},${G.rimY}`;
}

/* ----------------------------------------------------------- visual model */

export function drinkVisualModel(recipe) {
  const total = recipe.ingredients.reduce((s, i) => s + i.ratio, 0) || 1;
  const span = G.liqBottom - G.liqTop;
  let cursor = G.liqBottom;
  const layers = recipe.ingredients.map((ing, idx) => {
    const h = (ing.ratio / total) * span;
    cursor -= h;
    const type = ing.id === "oat_milk" || ing.id === "coconut_milk" ? "milk" : ing.id;
    /* hot water poured over a coffee base reads as diluted coffee, not clear water */
    const dilutes = type === "water" && recipe.ingredients.slice(0, idx).some((i) => i.id === "coffee");
    return {
      id: ing.id, label: ing.label,
      color: dilutes ? "#9c6638" : ing.color,
      type, heightRatio: ing.ratio / total,
      y1: cursor, y2: cursor + h, h,
      texture: type === "foam" ? "microfoam" : ing.id === "coffee" ? "crema" : type === "ice" ? "ice" : "smooth"
    };
  });
  return {
    cupType: "clear_tall",
    temperature: recipe.temperature,
    layers,
    effects: {
      steam: recipe.temperature === "hot",
      condensation: recipe.temperature === "iced",
      foamBubbles: layers.some((l) => l.type === "foam"),
      syrupSwirl: layers.some((l) => l.type === "syrup"),
      iceCubes: layers.some((l) => l.type === "ice")
    }
  };
}

export function drinkBands(recipe) {
  return drinkVisualModel(recipe).layers.map((l) => ({ id: l.id, label: l.label, color: l.color, y1: l.y1, y2: l.y2, h: l.h }));
}

/* ----------------------------------------------------------- layer pieces */

function layerDefs(l, p) {
  const op = l.type === "water" ? ".82" : l.type === "ice" ? ".5" : ".96";
  return `
    <linearGradient id="${p}-g-${l.id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${shade(l.color, 16)}" stop-opacity="${op}"/>
      <stop offset="55%" stop-color="${l.color}" stop-opacity="${op}"/>
      <stop offset="100%" stop-color="${shade(l.color, -24)}" stop-opacity="${op}"/>
    </linearGradient>
    <radialGradient id="${p}-s-${l.id}" cx="38%" cy="40%" r="75%">
      <stop offset="0%" stop-color="${shade(l.color, 30)}"/>
      <stop offset="70%" stop-color="${shade(l.color, 10)}"/>
      <stop offset="100%" stop-color="${shade(l.color, -8)}"/>
    </radialGradient>`;
}

function surfaceMarkup(l, p, animatable) {
  const r = rIn(l.y1), ry = ryIn(l.y1), c = G.cx;
  if (l.texture === "microfoam") {
    /* domed microfoam cap + bubble texture */
    const bubbles = [-0.72, -0.5, -0.26, 0, 0.22, 0.46, 0.68].map((k, i) => {
      const bx = c + k * r * 0.86;
      const by = l.y1 - ry * 0.4 - (1 - Math.abs(k)) * 4 + (i % 2) * 2.4;
      return `<circle class="${animatable ? "bubble" : ""}" cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="${(1.6 + ((i * 1.7) % 2.2)).toFixed(1)}" fill="rgba(255,252,244,${0.5 + (i % 3) * 0.14})" ${animatable ? `style="animation-delay:${i * 0.4}s"` : ""}/>`;
    }).join("");
    return `
      <path d="M ${c - r},${l.y1} A ${r},${ry * 2.1} 0 0 1 ${c + r},${l.y1} A ${r},${ry} 0 0 1 ${c - r},${l.y1} Z" fill="url(#${p}-s-${l.id})"/>
      <path d="M ${c - r * 0.62},${l.y1 - ry * 1.25} A ${r * 0.7},${ry} 0 0 1 ${c + r * 0.4},${l.y1 - ry * 1.3}" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>
      ${bubbles}`;
  }
  if (l.texture === "crema") {
    const speckles = [-0.6, -0.34, -0.05, 0.3, 0.55].map((k, i) =>
      `<ellipse cx="${(c + k * r * 0.8).toFixed(1)}" cy="${(l.y1 + (i % 2 ? 1.5 : -1.2)).toFixed(1)}" rx="${1.8 + (i % 2)}" ry="${0.9 + (i % 2) * 0.4}" fill="${shade(l.color, -32)}" opacity=".45"/>`).join("");
    return `
      <ellipse cx="${c}" cy="${l.y1}" rx="${r}" ry="${ry}" fill="url(#${p}-s-${l.id})"/>
      <ellipse cx="${c}" cy="${l.y1}" rx="${r * 0.97}" ry="${ry * 0.85}" fill="none" stroke="${shade("#c98b4e", 8)}" stroke-width="2.2" opacity=".55"/>
      ${speckles}`;
  }
  return `
    <ellipse cx="${c}" cy="${l.y1}" rx="${r}" ry="${ry}" fill="url(#${p}-s-${l.id})"/>
    <path d="M ${c - r * 0.7},${l.y1 - ry * 0.34} A ${r * 0.74},${ry * 0.8} 0 0 1 ${c + r * 0.34},${l.y1 - ry * 0.38}" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="1.6" stroke-linecap="round" opacity=".5"/>`;
}

function iceCubes(l, p, animatable) {
  const c = G.cx;
  /* during assembly the cubes drop into their pour band; in a finished static
     render ice floats near the surface, like in a real iced drink */
  const yBase = animatable ? l.y1 : G.liqTop + 10;
  const cubes = [
    { x: c - 34, y: yBase + 8, s: 30, rot: -14 },
    { x: c + 6, y: yBase + 16, s: 26, rot: 9 },
    { x: c - 12, y: yBase + 34, s: 28, rot: -4 }
  ];
  return cubes.map((q) => `
    <g class="${animatable ? "ice-cube" : ""}" ${animatable ? "" : 'opacity=".92"'}>
      <g transform="rotate(${q.rot} ${q.x + q.s / 2} ${q.y + q.s / 2})">
        <rect x="${q.x}" y="${q.y}" width="${q.s}" height="${q.s}" rx="7" fill="url(#${p}-ice)"/>
        <rect x="${q.x}" y="${q.y}" width="${q.s}" height="${q.s}" rx="7" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="1.4"/>
        <path d="M ${q.x + 5},${q.y + q.s * 0.32} L ${q.x + q.s * 0.45},${q.y + 5}" stroke="rgba(255,255,255,.65)" stroke-width="2" stroke-linecap="round"/>
      </g>
    </g>`).join("");
}

function syrupSwirl(p, topY, animatable) {
  const c = G.cx, y = topY + 26;
  return `
    <path id="${p}-swirl" class="syrup-swirl ${animatable ? "" : "is-in"}"
      d="M ${c - 44},${y} q 34,16 66,2 q -56,10 -40,26 q 30,12 52,-2"
      stroke="url(#${p}-syr)" ${animatable ? "" : 'style="stroke-dashoffset:0;opacity:.85"'}/>`;
}

/* ----------------------------------------------------------- main markup */

export function drinkMarkup(recipe, { prefix = "d", animatable = false, effects = false, labels = false } = {}) {
  const p = prefix;
  const model = drinkVisualModel(recipe);
  const layers = model.layers;
  const c = G.cx;
  const topLiquidY = layers.length ? layers[layers.length - 1].y1 : G.liqBottom;

  const defs = `
    <defs>
      ${layers.map((l) => layerDefs(l, p)).join("")}
      <linearGradient id="${p}-cyl" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#000" stop-opacity=".34"/>
        <stop offset="14%" stop-color="#000" stop-opacity=".08"/>
        <stop offset="42%" stop-color="#fff" stop-opacity=".05"/>
        <stop offset="78%" stop-color="#000" stop-opacity=".05"/>
        <stop offset="100%" stop-color="#000" stop-opacity=".3"/>
      </linearGradient>
      <linearGradient id="${p}-spec" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#fff" stop-opacity="0"/>
        <stop offset="50%" stop-color="#fff" stop-opacity=".34"/>
        <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="${p}-glass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#fff" stop-opacity=".10"/>
        <stop offset="50%" stop-color="#fff" stop-opacity=".035"/>
        <stop offset="100%" stop-color="#fff" stop-opacity=".07"/>
      </linearGradient>
      <linearGradient id="${p}-ice" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#dff2fa" stop-opacity=".95"/>
        <stop offset="55%" stop-color="#9fd4e8" stop-opacity=".75"/>
        <stop offset="100%" stop-color="#7fb9d4" stop-opacity=".85"/>
      </linearGradient>
      <linearGradient id="${p}-syr" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#e8b063"/>
        <stop offset="100%" stop-color="#b8762e"/>
      </linearGradient>
      <filter id="${p}-soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
      <filter id="${p}-soft2" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4"/></filter>
      <clipPath id="${p}-liq"><path d="${innerSilhouette()}"/></clipPath>
      ${animatable ? layers.map((l) => `
        <clipPath id="${p}-revc-${l.id}">
          <rect id="${p}-reveal-${l.id}" x="40" y="${l.y2 + 2}" width="220" height="0"/>
        </clipPath>`).join("") : ""}
    </defs>`;

  const layerGroup = (l) => {
    /* static floating cubes are emitted after all layers so they sit on top */
    const inner = `
      <path d="${bandPath(l.y1, l.y2)}" fill="url(#${p}-g-${l.id})"/>
      ${l.type === "ice" ? (animatable ? iceCubes(l, p, true) : "") : surfaceMarkup(l, p, animatable)}`;
    return animatable
      ? `<g clip-path="url(#${p}-revc-${l.id})">${inner}</g>`
      : `<g>${inner}</g>`;
  };
  const floatingIce = !animatable
    ? layers.filter((l) => l.type === "ice").map((l) => `<g clip-path="url(#${p}-liq)">${iceCubes(l, p, false)}</g>`).join("")
    : "";

  const condensation = model.effects.condensation && (effects || !animatable) ? `
    <g clip-path="url(#${p}-liq)" opacity=".8">
      ${[[108, 250, 2.4], [196, 232, 2], [122, 296, 1.7], [180, 300, 2.6], [142, 268, 1.5], [205, 276, 1.8], [98, 322, 2], [168, 330, 1.6]]
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,.5)"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.4}" fill="rgba(255,255,255,.85)"/>`).join("")}
      <path d="M 112,258 q 2,16 -1,30" stroke="rgba(255,255,255,.35)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    </g>` : "";

  const steam = model.effects.steam && effects ? `
    <g filter="url(#${p}-soft2)">
      <path class="steam-path" d="M ${c - 22},${G.rimY - 12} q 9,-14 0,-26 q -9,-12 3,-24" stroke="rgba(255,248,238,.4)" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path class="steam-path s2" d="M ${c + 20},${G.rimY - 10} q -8,-12 0,-24 q 8,-12 -2,-22" stroke="rgba(255,248,238,.3)" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>` : "";

  return `
    ${defs}

    <!-- studio ground shadow -->
    <ellipse cx="${c}" cy="${G.baseY + 22}" rx="76" ry="12" fill="#000" opacity=".5" filter="url(#${p}-soft)"/>

    <!-- glass back wall -->
    <path d="${innerSilhouette()}" fill="url(#${p}-glass)"/>
    <ellipse cx="${c}" cy="${G.liqBottom}" rx="${rIn(G.liqBottom)}" ry="${ryIn(G.liqBottom)}" fill="rgba(255,255,255,.05)"/>

    <!-- liquid layers (bottom → top) -->
    ${layers.map(layerGroup).join("")}
    ${floatingIce}
    ${model.effects.syrupSwirl ? syrupSwirl(p, topLiquidY, animatable) : ""}

    <!-- cylindrical shading + specular streaks over the liquid -->
    <g clip-path="url(#${p}-liq)">
      <rect x="${c - 90}" y="${G.liqTop - 20}" width="180" height="${G.liqBottom - G.liqTop + 40}" fill="url(#${p}-cyl)"/>
      <rect x="${c - 56}" y="${G.liqTop}" width="17" height="${G.liqBottom - G.liqTop}" fill="url(#${p}-spec)" opacity=".5" filter="url(#${p}-soft2)"/>
      <rect x="${c + 40}" y="${G.liqTop}" width="8" height="${G.liqBottom - G.liqTop}" fill="url(#${p}-spec)" opacity=".25" filter="url(#${p}-soft2)"/>
    </g>
    ${condensation}

    ${animatable ? `<rect class="pour-stream" id="${p}-stream" x="${c - 4}" y="${G.rimY - 6}" width="8" height="0" rx="4" fill="#7A4A26" opacity="0"/>` : ""}

    <!-- glass front: walls, rim with thickness, base -->
    <path d="${outerSilhouette()}" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="2.4"/>
    <path d="M ${c - G.rimInRx},${G.rimY} L ${c - rIn(G.liqBottom) - 2},${G.liqBottom}" stroke="rgba(255,255,255,.1)" stroke-width="1.4"/>
    <path d="M ${c + G.rimInRx},${G.rimY} L ${c + rIn(G.liqBottom) + 2},${G.liqBottom}" stroke="rgba(255,255,255,.1)" stroke-width="1.4"/>
    <ellipse cx="${c}" cy="${G.rimY}" rx="${G.rimRx}" ry="${G.rimRy}" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2.2"/>
    <ellipse cx="${c}" cy="${G.rimY}" rx="${G.rimInRx}" ry="${G.rimInRy}" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="1.6"/>
    <path d="M ${c - G.rimRx},${G.rimY} A ${G.rimRx},${G.rimRy} 0 0 1 ${c + G.rimRx},${G.rimY}" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M ${c - G.baseRx},${G.baseY} A ${G.baseRx},${G.baseRy} 0 0 0 ${c + G.baseRx},${G.baseY}" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M ${c - G.baseRx + 6},${G.baseY + 5} A ${G.baseRx - 6},${G.baseRy - 2} 0 0 0 ${c + G.baseRx - 6},${G.baseY + 5}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="2"/>

    <!-- front glass highlights -->
    <path d="M ${c - 64},${G.rimY + 24} L ${c - 46},${G.baseY - 26}" stroke="rgba(255,255,255,.22)" stroke-width="7" stroke-linecap="round" filter="url(#${p}-soft2)"/>
    <path d="M ${c + 56},${G.rimY + 30} L ${c + 44},${G.baseY - 40}" stroke="rgba(255,255,255,.12)" stroke-width="3.5" stroke-linecap="round"/>

    ${steam}

    ${labels ? layers.map((l) => `
      <line class="layer-tick" id="${p}-tick-${l.id}" x1="${c + rIn(l.y1) + 14}" y1="${l.y1 + l.h / 2}" x2="${c + rIn(l.y1) + 34}" y2="${l.y1 + l.h / 2}"/>
      <text class="layer-label" id="${p}-label-${l.id}" x="${c + rIn(l.y1) + 40}" y="${l.y1 + l.h / 2 + 5}">${l.label}</text>`).join("") : ""}
  `;
}

/* standalone premium render for cards / summary / ready */
export function renderDrink(recipe, { width = 120, prefix, effects = false } = {}) {
  const p = prefix || `d${recipe.id}`;
  return `<svg viewBox="0 0 300 420" width="${width}" aria-hidden="true" overflow="visible">${drinkMarkup(recipe, { prefix: p, effects })}</svg>`;
}
