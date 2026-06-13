/* DrinkX Expressive Premium Concept — app core.
   Vanilla ES modules by design: zero build step, kiosk-fast, no runtime deps.
   The React production mapping for every block here is documented in CONCEPT.md §9. */

import {
  RECIPES, INTENTS, QUESTIONS, CUSTOMIZATION, RATING_OPTIONS,
  FAST_ORDER_IDS, SECRET_MENU_IDS, MODULES, ICONS, INGREDIENT_COLORS
} from "/concept/data.js";
import { renderDrink, drinkMarkup, drinkBands } from "/concept/drink-renderer.js";
import { initMind } from "/concept/mind.js";
import { preloadDrinkAssets } from "/concept/drink-assets.js";
import { mountDrinkVisual, mountStageMotion } from "/concept/motion-asset.js";

/* ============================================================ utilities */

const $ = (sel) => document.querySelector(sel);
const app = $(".app");
const recipeById = (id) => RECIPES.find((r) => r.id === id);

function track(event, props = {}) {
  (window.__events = window.__events || []).push({ event, props, ts: Date.now() });
}

let toastTimer = null;
function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 2200);
}

function icon(name, extra = "") {
  return (ICONS[name] || "").replace("<svg ", `<svg ${extra} `);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

/* ============================================================ state */

const state = {
  screen: "home",
  intent: null,
  qIndex: 0,
  answers: [],            // [{q, option}]
  recCards: [],           // recipe ids, [0] = hero
  baseRecipe: null,       // chosen recipe (catalog object)
  modifiers: null,        // user modifiers
  order: null,            // working recipe built from base + modifiers
  engine: null,
  motion: null,           // DrinkMotionAsset controller for the assembly stage
  phase: "",              // "" | preview | preparing | done
  locked: false,
  simplified: false
};

const profile = loadProfile();

function loadProfile() {
  try { return JSON.parse(localStorage.getItem("drinkx_profile")) || { savedDrinks: [], vector: {}, history: [] }; }
  catch { return { savedDrinks: [], vector: {}, history: [] }; }
}

function saveProfile() {
  localStorage.setItem("drinkx_profile", JSON.stringify(profile));
}

function setScreen(screen) {
  state.screen = screen;
  app.dataset.screen = screen;
  track("screen", { screen });
}

function setPhase(phase) {
  state.phase = phase;
  app.dataset.phase = phase;
}

/* ============================================================ context (adaptive menu) */

function getContext() {
  const h = new Date().getHours();
  const daypart = h < 11 ? "morning" : h < 17 ? "afternoon" : "evening";
  return { daypart, tempC: 24, locationType: "office" }; // tempC/location mocked; production: GET /api/context
}

function greeting() {
  const { daypart } = getContext();
  return daypart === "morning" ? "Доброе утро — нужен правильный старт?"
    : daypart === "afternoon" ? "Добрый день — время перезагрузки?"
    : "Добрый вечер — что-то спокойное?";
}

/* ============================================================ recommender (rule-based, AI-offline safe) */

const INTENT_TAGS = {
  wake: ["strong", "morning"], focus: ["office", "no_sugar", "strong"],
  refresh: ["iced", "refresh"], soft: ["soft", "milky", "mild"],
  sweet: ["sweetish", "sweet"], nocaf: ["no_caffeine"], road: ["road"], surprise: []
};

function recommend(intentId, answerTags) {
  const ctx = getContext();
  const wanted = [...(INTENT_TAGS[intentId] || []), ...answerTags];
  const scored = RECIPES.map((r) => {
    let score = 0;
    wanted.forEach((t) => { if (r.tags.includes(t)) score += 2; });
    if (r.tags.includes(ctx.daypart)) score += 1;
    if (ctx.tempC >= 24 && r.tags.includes("hot_weather")) score += 1;
    if (wanted.includes("no_caffeine") && r.tasteProfile.caffeine !== "none") score -= 6;
    if (wanted.includes("no_milk") && r.tasteProfile.milkiness > 0) score -= 4;
    if (wanted.includes("iced") && r.temperature !== "iced") score -= 3;
    score += (profile.vector.strength || 0) / 50 * (r.tasteProfile.strength - 60) / 40;
    return { r, score };
  }).sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((s) => s.r.id);
}

/* ============================================================ modifiers & working recipe */

function defaultModifiers(recipe) {
  const milkIng = recipe.ingredients.find((i) => ["milk", "oat_milk", "coconut_milk"].includes(i.id));
  return {
    strength: "balanced",
    sweetness: recipe.tasteProfile.sweetness === 0 ? "none" : recipe.tasteProfile.sweetness < 25 ? "low" : "medium",
    milk: !milkIng ? null : milkIng.id === "oat_milk" ? "oat" : milkIng.id === "coconut_milk" ? "coconut" : "regular",
    temperature: recipe.temperature,
    syrup: recipe.ingredients.some((i) => i.id === "syrup") ? "vanilla" : "none",
    size: "m"
  };
}

const SIZE_PRICE = { s: -40, m: 0, l: 60 };
const SWEETNESS_VALUE = { none: 0, low: 15, medium: 35, sweet: 60 };
const MILK_META = {
  regular: { id: "milk", label: "Молоко", color: INGREDIENT_COLORS.milk },
  oat: { id: "oat_milk", label: "Овсяное молоко", color: INGREDIENT_COLORS.oat_milk },
  coconut: { id: "coconut_milk", label: "Кокосовое молоко", color: INGREDIENT_COLORS.coconut_milk }
};
const TEXTURE_RU = { clean: "чистая", smooth: "мягкая", creamy: "кремовая", velvet: "бархатная" };
const CAFFEINE_RU = { none: "без кофеина", low: "лёгкий", medium: "средний", high: "высокий" };
const TEMP_RU = { hot: "горячий", iced: "айс" };
const SWEET_RU = { none: "без сахара", low: "лёгкая", medium: "средняя", sweet: "высокая" };
const SYRUP_RU = { vanilla: "Ваниль", caramel: "Карамель", hazelnut: "Фундук" };

/* Builds the order's working recipe: deep copy + modifier effects on
   ingredients, stages, taste profile and price. Data-driven — recipes never hardcode UI. */
function buildOrderRecipe(base, mods) {
  const r = structuredClone(base);
  r.price = r.price + SIZE_PRICE[mods.size] + (mods.syrup !== "none" && !base.ingredients.some(i => i.id === "syrup") ? 40 : 0);

  if (mods.milk && mods.milk !== "regular" || (mods.milk === "regular" && r.ingredients.some(i => i.id !== "milk" && MILK_META[mods.milk]?.id))) {
    const meta = MILK_META[mods.milk];
    r.ingredients.forEach((i) => {
      if (["milk", "oat_milk", "coconut_milk"].includes(i.id)) {
        i.id = meta.id; i.label = meta.label; i.color = meta.color;
      }
    });
    r.assemblyStages.forEach((s) => {
      if (["milk", "oat_milk", "coconut_milk"].includes(s.ingredient)) s.ingredient = meta.id;
    });
    if (mods.milk === "oat") r.tasteProfile.sweetness = Math.max(r.tasteProfile.sweetness, 20);
  }

  if (mods.strength === "strong") {
    r.tasteProfile.strength = Math.min(100, r.tasteProfile.strength + 12);
    shiftRatio(r, "coffee", 0.06);
  } else if (mods.strength === "light") {
    r.tasteProfile.strength = Math.max(10, r.tasteProfile.strength - 14);
    shiftRatio(r, "coffee", -0.06);
  }

  r.tasteProfile.sweetness = SWEETNESS_VALUE[mods.sweetness] ?? r.tasteProfile.sweetness;

  const hasSyrupStage = r.assemblyStages.some((s) => s.ingredient === "syrup");
  if (mods.syrup === "none" && hasSyrupStage) {
    r.assemblyStages = r.assemblyStages.filter((s) => s.ingredient !== "syrup");
    r.ingredients = r.ingredients.filter((i) => i.id !== "syrup");
  } else if (mods.syrup !== "none") {
    const label = SYRUP_RU[mods.syrup] || mods.syrup;
    if (!hasSyrupStage) {
      r.ingredients.push({ id: "syrup", label, color: INGREDIENT_COLORS.syrup, ratio: 0.07 });
      const before = r.assemblyStages.findIndex((s) => ["balance", "pour"].includes(s.id));
      r.assemblyStages.splice(before < 0 ? r.assemblyStages.length : before, 0, {
        id: "syrup", title: `Акцент: ${label}`, description: "Полдозы — только аромат",
        ingredient: "syrup", module: "syrup_module", durationMs: 3600, animation: "swirl",
        tasteImpact: { sweetness: Math.max(SWEETNESS_VALUE[mods.sweetness], 25) },
        aiComment: "Полдозы сиропа — аромат без десерта."
      });
    } else {
      const ing = r.ingredients.find((i) => i.id === "syrup");
      if (ing) ing.label = label;
      const st = r.assemblyStages.find((s) => s.ingredient === "syrup");
      if (st) { st.title = `Акцент: ${label}`; st.aiComment = "Полдозы сиропа — аромат без десерта."; }
    }
  }

  return r;
}

function shiftRatio(recipe, ingredientId, delta) {
  const target = recipe.ingredients.find((i) => i.id === ingredientId);
  const donor = [...recipe.ingredients].filter((i) => i.id !== ingredientId).sort((a, b) => b.ratio - a.ratio)[0];
  if (!target || !donor) return;
  target.ratio = Math.max(0.08, target.ratio + delta);
  donor.ratio = Math.max(0.08, donor.ratio - delta);
}

function modifierChips(mods, recipe) {
  const chips = [];
  if (mods.strength !== "balanced") chips.push(mods.strength === "strong" ? "Крепкий" : "Лёгкий");
  chips.push(mods.sweetness === "none" ? "Без сахара" : `Сладость: ${SWEET_RU[mods.sweetness]}`);
  if (mods.milk) chips.push(MILK_META[mods.milk].label);
  chips.push(TEMP_RU[recipe.temperature]);
  if (mods.syrup !== "none") chips.push(`Сироп: ${SYRUP_RU[mods.syrup]}`);
  chips.push({ s: "Малый", m: "Средний", l: "Большой" }[mods.size]);
  return chips;
}

/* ============================================================ drink visuals */
/* One premium renderer for every drink — see drink-renderer.js.
   Prefix keeps SVG defs unique per rendered instance. */

function cupMarkup(recipe, { width = 120, prefix, effects = false } = {}) {
  return renderDrink(recipe, { width, prefix: prefix || `c-${recipe.id}-${width}`, effects });
}

/* ============================================================ HOME */

function renderHome() {
  $("#greetingLine").textContent = greeting();
  const saved = profile.savedDrinks[0];
  $("#usualSub").textContent = saved
    ? `${recipeById(saved.recipeId)?.displayName || "Твой напиток"} — в один тап.`
    : "Сохрани напиток один раз — повторяй в один тап.";

  document.querySelectorAll(".mini-icon").forEach((el) => {
    el.innerHTML = icon(el.dataset.icon);
  });

  const ctx = getContext();
  const slots = [];
  const pop = ctx.daypart === "morning" ? "morning_boost" : ctx.daypart === "afternoon" ? "iced_balance" : "latte_soft";
  const daypartRu = { morning: "утром", afternoon: "днём", evening: "вечером" }[ctx.daypart];
  slots.push({ tag: "Популярно здесь", id: pop });
  slots.push({ tag: `Лучшее этим ${daypartRu}`, id: ctx.daypart === "morning" ? "focus_flat" : ctx.daypart === "afternoon" ? "after_lunch" : "evening_decaf" });
  if (ctx.tempC >= 22) slots.push({ tag: `За окном ${ctx.tempC}°`, id: "cold_energy" });
  slots.push({ tag: "Секретное меню", id: SECRET_MENU_IDS[Math.floor(Math.random() * SECRET_MENU_IDS.length)] });

  $("#recStrip").innerHTML = slots.map((s, i) => {
    const r = recipeById(s.id);
    return `<button class="strip-chip" data-action="strip-pick" data-recipe="${r.id}" style="animation-delay:${0.3 + i * 0.07}s" type="button">
      <span class="chip-tag">${escapeHtml(s.tag)}</span>
      <span class="chip-name">${escapeHtml(r.displayName)}</span>
    </button>`;
  }).join("");
}

/* ============================================================ FAST ORDER */

function renderFast() {
  $("#fastGrid").innerHTML = FAST_ORDER_IDS.map((id, i) => {
    const r = recipeById(id);
    return `<button class="card fast-card" data-action="fast-pick" data-recipe="${id}" style="animation:card-rise .45s var(--ease) ${i * 0.05}s backwards" type="button">
      <span class="temp-dot ${r.temperature}" aria-hidden="true"></span>
      <span class="fast-name">${escapeHtml(r.name)}</span>
      <span class="fast-desc">${escapeHtml(r.shortDescription)}</span>
      <span class="fast-price">${r.price} ₽</span>
      <span class="fast-cup" aria-hidden="true">${renderDrink(r, { width: 64, prefix: `f-${r.id}` })}</span>
    </button>`;
  }).join("");
  /* DrinkMotionAsset mode="card": upgrades to pre-rendered render.webp when available */
  document.querySelectorAll("#fastGrid .fast-card").forEach((card) => {
    const r = recipeById(card.dataset.recipe);
    mountDrinkVisual(card.querySelector(".fast-cup"), r, { mode: "card", width: 64, prefix: `f-${r.id}` });
  });
}

/* ============================================================ INTENT + QUESTIONS */

function renderIntents() {
  const ctx = getContext();
  const sorted = [...INTENTS].sort((a, b) => {
    const boost = (it) => (it.boost?.[ctx.daypart] || 0) + (ctx.tempC >= 24 ? it.boost?.hot_weather || 0 : 0) + (it.boost?.[ctx.locationType] || 0);
    return boost(b) - boost(a);
  });
  $("#intentGrid").innerHTML = sorted.map((it, i) => `
    <button class="card intent-card" data-action="pick-intent" data-intent="${it.id}" style="--i:${i}" type="button">
      <span class="intent-icon">${icon(it.icon)}</span>
      <span class="intent-label">${escapeHtml(it.label)}</span>
      <span class="intent-hint">${escapeHtml(it.hint)}</span>
    </button>`).join("");
}

function startQuestions(intentId) {
  state.intent = intentId;
  state.qIndex = 0;
  state.answers = [];
  track("intent_selected", { intent: intentId });
  if (intentId === "surprise" || !QUESTIONS[intentId]) { showRecommendations(); return; }
  setScreen("question");
  renderQuestion();
}

function renderQuestion() {
  const qs = QUESTIONS[state.intent];
  const q = qs[state.qIndex];
  const intentLabel = INTENTS.find((i) => i.id === state.intent)?.label || "";
  $("#qContext").textContent = [intentLabel, ...state.answers.map((a) => a.option.label)].join(" · ");
  $("#qTitle").textContent = q.title;
  $("#qDots").innerHTML = qs.map((_, i) =>
    `<span class="q-dot ${i <= state.qIndex ? "is-on" : ""}"></span>`).join("");
  $("#qOptions").innerHTML = q.options.map((o, i) =>
    `<button class="q-option" data-action="answer" data-option="${o.id}" style="--i:${i}" type="button">${escapeHtml(o.label)}</button>`).join("");
}

function answer(optionId) {
  const qs = QUESTIONS[state.intent];
  const q = qs[state.qIndex];
  const option = q.options.find((o) => o.id === optionId);
  state.answers.push({ q: q.id, option });
  track("question_answered", { q: q.id, a: optionId });
  if (state.qIndex < qs.length - 1) {
    state.qIndex += 1;
    renderQuestion();
  } else {
    showRecommendations();
  }
}

/* ============================================================ RECOMMENDATIONS */

function showRecommendations(preferredHero) {
  const tags = state.answers.flatMap((a) => a.option.tags);
  let cards = state.intent === "surprise"
    ? shuffled(SECRET_MENU_IDS).slice(0, 3)
    : recommend(state.intent, tags);
  if (preferredHero) cards = [preferredHero, ...cards.filter((id) => id !== preferredHero)].slice(0, 3);
  state.recCards = cards;
  setScreen("recommend");
  renderRecommend();
  track("recommendation_shown", { ids: cards });
}

function shuffled(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function renderRecommend() {
  const [heroId, ...altIds] = state.recCards;
  const hero = recipeById(heroId);
  const why = state.intent === "surprise" ? "Позиция из секретного меню — доверься мне." : hero.why;
  const p = hero.tasteProfile;

  $("#recLayout").innerHTML = `
    <article class="card rec-hero">
      <span class="rec-cup" aria-hidden="true">${renderDrink(hero, { width: 112, prefix: "rh" })}</span>
      <span class="rec-badge"><span class="ai-orb"></span> ВЫБОР AI</span>
      <h3 class="rec-name">${escapeHtml(hero.displayName)}</h3>
      <p class="rec-tagline">${escapeHtml(hero.shortDescription)}</p>
      <div class="taste-mini">
        ${[`Крепость ${p.strength}%`, p.milkiness ? `Молоко ${p.milkiness}%` : "Без молока", p.sweetness ? `Сладость ${p.sweetness}%` : "Без сахара", TEMP_RU[p.temperature]]
          .map((t) => `<span class="tag-chip">${escapeHtml(t)}</span>`).join("")}
      </div>
      <div class="rec-why"><span class="ai-orb"></span><span>${escapeHtml(why)}</span></div>
      <div class="rec-meta-row">
        <span class="rec-price">${hero.price} ₽</span>
        <button class="pill pill-primary rec-order-btn" data-action="order" data-recipe="${hero.id}" type="button">Заказать</button>
      </div>
    </article>
    <div class="rec-alts">
      ${altIds.map((id) => {
        const r = recipeById(id);
        return `<button class="card alt-card" data-action="promote" data-recipe="${id}" type="button">
          <span class="alt-cup" aria-hidden="true">${renderDrink(r, { width: 50, prefix: `al-${r.id}` })}</span>
          <span class="alt-name">${escapeHtml(r.displayName)}</span>
          <span class="alt-desc">${escapeHtml(r.shortDescription)}</span>
          <span class="alt-price">${r.price} ₽</span>
        </button>`;
      }).join("")}
    </div>`;

  const mutationLabels = { softer: "Помягче", colder: "Похолоднее", stronger: "Покрепче" };
  $("#recMutations").innerHTML = ["softer", "colder", "stronger"]
    .map((m) => `<button class="ghost-pill" data-action="mutate" data-mutation="${m}" type="button">${mutationLabels[m]}</button>`)
    .join("") + `<button class="ghost-pill" data-action="go-customize-hero" type="button">Настроить</button>`;

  /* DrinkMotionAsset mode="card" for hero + alternatives (upgrade to render.webp when available) */
  mountDrinkVisual(document.querySelector(".rec-cup"), hero, { mode: "card", width: 112, prefix: "rh" });
  document.querySelectorAll(".alt-card").forEach((card) => {
    const r = recipeById(card.dataset.recipe);
    mountDrinkVisual(card.querySelector(".alt-cup"), r, { mode: "card", width: 50, prefix: `al-${r.id}` });
  });
}

function mutate(direction) {
  const hero = recipeById(state.recCards[0]);
  const pool = RECIPES.filter((r) => r.id !== hero.id);
  let next = null;
  if (direction === "softer") next = pool.filter((r) => r.tasteProfile.strength < hero.tasteProfile.strength && r.tasteProfile.milkiness >= hero.tasteProfile.milkiness).sort((a, b) => b.tasteProfile.milkiness - a.tasteProfile.milkiness)[0];
  if (direction === "stronger") next = pool.filter((r) => r.tasteProfile.strength > hero.tasteProfile.strength).sort((a, b) => b.tasteProfile.strength - a.tasteProfile.strength)[0];
  if (direction === "colder") next = pool.filter((r) => r.temperature === "iced").sort((a, b) => (b.tasteProfile.refreshing || 0) - (a.tasteProfile.refreshing || 0))[0];
  track("recommendation_mutated", { direction, found: Boolean(next) });
  if (!next) {
    const superlative = { softer: "мягкий", colder: "холодный", stronger: "крепкий" }[direction];
    toast(`Это уже самый ${superlative} мой вариант`);
    return;
  }
  state.recCards = [next.id, hero.id, ...state.recCards.slice(1).filter((id) => id !== next.id)].slice(0, 3);
  renderRecommend();
}

/* ============================================================ SELECT → CUSTOMIZE → SUMMARY */

function selectRecipe(recipeId, { path }) {
  state.baseRecipe = recipeById(recipeId);
  state.modifiers = defaultModifiers(state.baseRecipe);
  state.order = buildOrderRecipe(state.baseRecipe, state.modifiers);
  preloadDrinkAssets(recipeId);   // warm assembly/preparation/ready assets before the show starts
  track("drink_selected", { recipeId, path });
}

function renderCustomize(lastChange) {
  const r = state.order;
  $("#customDrinkCard").innerHTML = `
    <div class="custom-cup">${cupMarkup(r, { width: 84 })}</div>
    <div class="custom-meta">
      <span class="custom-name">${escapeHtml(r.displayName)}</span>
      <span class="custom-line">${escapeHtml(r.shortDescription)}</span>
      <span class="custom-price">${r.price} ₽</span>
    </div>`;

  const milkBased = Boolean(state.modifiers.milk);
  $("#customControls").innerHTML = CUSTOMIZATION.filter((c) => {
    if (c.id === "milk" && !milkBased) return false;
    return true;
  }).map((c) => {
    const current = state.modifiers[c.id];
    const options = c.id === "temperature"
      ? c.options.filter((o) => o.id === state.baseRecipe.temperature)   // recipes are built for their temperature; iced variants are separate recipes
      : c.options;
    return `<div class="control-group">
      <span class="control-label">${escapeHtml(c.label)}</span>
      <div class="seg-row">${options.map((o) =>
        `<button class="seg-pill ${o.id === current ? "is-on" : ""}" data-action="set-mod" data-control="${c.id}" data-value="${o.id}" type="button">${escapeHtml(o.label)}</button>`).join("")}
      </div>
    </div>`;
  }).join("");

  if (lastChange) {
    const c = CUSTOMIZATION.find((x) => x.id === lastChange);
    const text = c?.explain?.[state.modifiers[lastChange]];
    if (text) {
      const p = $("#customExplainText");
      p.textContent = text;
      p.style.animation = "none"; void p.offsetWidth; p.style.animation = "";
    }
  } else {
    $("#customExplainText").textContent = "Меняй что угодно — я объясню, как это изменит вкус.";
  }
}

function setModifier(control, value) {
  state.modifiers[control] = value;
  state.order = buildOrderRecipe(state.baseRecipe, state.modifiers);
  renderCustomize(control);
  track("customization_change", { control, value });
}

function renderSummary() {
  const r = state.order;
  $("#summaryCard").innerHTML = `
    <div class="summary-row">
      <div>${cupMarkup(r, { width: 96 })}</div>
      <div>
        <span class="card-kicker">Твой напиток</span>
        <h3 class="summary-name">${escapeHtml(r.displayName)}</h3>
        <p class="card-sub">${escapeHtml(r.shortDescription)}</p>
      </div>
    </div>
    <div class="mod-chips">${modifierChips(state.modifiers, r).map((c) => `<span class="tag-chip">${escapeHtml(c)}</span>`).join("")}</div>
    <div class="summary-price-row">
      <span class="card-sub">Приготовлю за ~${Math.round(r.estimatedPreparationTimeMs / 1000)} сек.</span>
      <span class="summary-price">${r.price} ₽</span>
    </div>`;
}

/* ============================================================ ASSEMBLY SCENE (procedural SVG) */

/* Scene geometry (viewBox 600×470): cup centered, module nodes on the sides.
   Module slots alternate left/right. */
const SLOTS = [
  { x: 92, y: 160, side: "left" }, { x: 508, y: 160, side: "right" },
  { x: 70, y: 290, side: "left" }, { x: 530, y: 290, side: "right" },
  { x: 112, y: 400, side: "left" }, { x: 488, y: 400, side: "right" }
];

/* Premium cup is rendered by drink-renderer.js and nested into the scene at 0.8 scale.
   The engine animates per-layer reveal rects (cup-space coordinates), so the full
   material render — surfaces, crema, foam dome, ice — is what gets "poured". */
const SCENE = { cupX: 180, cupY: 44, cupW: 240, cupH: 336, cx: 300, rimY: 95 };
const CUP_SPACE = { liqBottom: 364, streamTop: 58 };

let scene = null; // { bands (cup-space), recipe }

function buildScene(recipe) {
  const bands = drinkBands(recipe);

  const usedModules = [...new Set(recipe.assemblyStages.map((s) => s.module).filter(Boolean))];
  const nodes = usedModules.map((m, i) => ({ module: m, ...SLOTS[i % SLOTS.length] }));

  const flowFor = (node) => {
    const x0 = node.x + (node.side === "left" ? 34 : -34);
    const rimX = SCENE.cx + (node.side === "left" ? -26 : 26);
    return `M ${x0},${node.y} C ${x0 + (node.side === "left" ? 70 : -70)},${node.y - 30} ${rimX + (node.side === "left" ? -50 : 50)},${SCENE.rimY - 34} ${rimX},${SCENE.rimY - 6}`;
  };

  $("#assemblyStage").innerHTML = `
  <svg viewBox="0 0 600 470" role="img" aria-label="Визуализация сборки напитка">
    <ellipse class="ready-glow" cx="${SCENE.cx}" cy="218" rx="150" ry="165" fill="#ff7a45" opacity="0" style="filter: blur(46px)"/>

    ${nodes.map((n) => `<path class="flow-path" id="flow-${n.module}" d="${flowFor(n)}" stroke="${MODULES[n.module].color}"/>`).join("")}

    <svg class="cup-nest" x="${SCENE.cupX}" y="${SCENE.cupY}" width="${SCENE.cupW}" height="${SCENE.cupH}" viewBox="0 0 300 420" overflow="visible">
      ${drinkMarkup(recipe, { prefix: "asm", animatable: true, effects: true, labels: true })}
    </svg>

    ${nodes.map((n) => {
      const m = MODULES[n.module];
      return `<g class="module-node" id="node-${n.module}">
        <circle class="node-bg" cx="${n.x}" cy="${n.y}" r="30"/>
        ${icon(m.icon, `x="${n.x - 13}" y="${n.y - 13}" width="26" height="26" class="node-icon"`)}
        <text x="${n.x}" y="${n.y + 48}">${escapeHtml(m.label)}</text>
      </g>`;
    }).join("")}

    <g id="progressRing" opacity="0" style="transition: opacity .5s">
      <circle class="ring-track" cx="62" cy="64" r="34"/>
      <circle class="ring-fill" cx="62" cy="64" r="34" stroke-dasharray="${2 * Math.PI * 34}" stroke-dashoffset="${2 * Math.PI * 34}" transform="rotate(-90 62 64)"/>
      <text class="ring-label" x="62" y="62">0%</text>
      <text class="ring-sub" x="62" y="78">ГОТОВЛЮ</text>
    </g>
  </svg>`;

  scene = { bands, recipe };
}

function fillLayer(ingredientId, durationMs) {
  const band = scene.bands.find((b) => b.id === ingredientId);
  const el = $(`#asm-reveal-${ingredientId}`);
  if (!band || !el) return;
  el.style.transition = `y ${durationMs}ms var(--ease), height ${durationMs}ms var(--ease)`;
  el.style.y = `${band.y1 - 36}px`;
  el.style.height = `${band.h + 40}px`;
}

function resetLayers() {
  scene.bands.forEach((b) => {
    const el = $(`#asm-reveal-${b.id}`);
    if (!el) return;
    el.style.transition = "y .5s var(--ease), height .5s var(--ease)";
    el.style.y = `${b.y2 + 2}px`;
    el.style.height = "0px";
    $(`#asm-label-${b.id}`)?.classList.remove("is-on");
    $(`#asm-tick-${b.id}`)?.classList.remove("is-on");
  });
  document.querySelectorAll(".ice-cube").forEach((c) => c.classList.remove("is-in"));
  $("#asm-swirl")?.classList.remove("is-in");
  activePours.clear();
}

function surfaceY() {
  let y = CUP_SPACE.liqBottom;
  scene.bands.forEach((b) => {
    const el = $(`#asm-reveal-${b.id}`);
    if (el && parseFloat(el.style.height || 0) > 0) y = Math.min(y, b.y1);
  });
  return y;
}

function setPour(on, color) {
  const el = $("#asm-stream");
  if (!el) return;
  if (on) {
    el.setAttribute("fill", color);
    el.style.height = `${Math.max(0, surfaceY() - CUP_SPACE.streamTop)}px`;
    el.classList.add("is-on");
  } else {
    el.classList.remove("is-on");
  }
}

/* ============================================================ taste panel & timeline */

function tasteMetrics(recipe) {
  const p = recipe.tasteProfile;
  const rows = [
    { id: "strength", label: "Крепость", value: p.strength },
    { id: "milkiness", label: "Молочность", value: p.milkiness },
    { id: "sweetness", label: "Сладость", value: p.sweetness }
  ];
  if (p.refreshing != null) rows.push({ id: "refreshing", label: "Свежесть", value: p.refreshing });
  else if (p.creaminess != null) rows.push({ id: "creaminess", label: "Сливочность", value: p.creaminess });
  return rows;
}

function renderTastePanel(recipe, { filled }) {
  const p = recipe.tasteProfile;
  $("#tastePanel").innerHTML = tasteMetrics(recipe).map((m) => `
    <div class="taste-row" data-metric="${m.id}">
      <div class="taste-head"><span class="t-label">${m.label}</span><span class="t-val" id="tv-${m.id}">${filled ? m.value : 0}%</span></div>
      <div class="taste-track"><span class="taste-fill" id="tf-${m.id}" style="width:${filled ? m.value : 0}%"></span></div>
    </div>`).join("") +
    `<div class="taste-chips-row">
      <span class="tag-chip">${TEXTURE_RU[p.texture] || p.texture}</span>
      <span class="tag-chip">${TEMP_RU[p.temperature] || p.temperature}</span>
      <span class="tag-chip">кофеин: ${CAFFEINE_RU[p.caffeine] || p.caffeine}</span>
    </div>`;
}

function setMetric(id, value, flash = true) {
  const fill = $(`#tf-${id}`), val = $(`#tv-${id}`), row = document.querySelector(`.taste-row[data-metric="${id}"]`);
  if (!fill || value == null) return;
  fill.style.width = `${Math.max(0, Math.min(100, value))}%`;
  val.textContent = `${Math.max(0, Math.min(100, Math.round(value)))}%`;
  if (flash && row) {
    row.classList.add("is-flash");
    setTimeout(() => row.classList.remove("is-flash"), 1400);
  }
}

function applyTasteImpact(stage) {
  if (!stage.tasteImpact) return;
  Object.entries(stage.tasteImpact).forEach(([k, v]) => {
    if (v > 0) setMetric(k, v);
  });
}

function renderTimeline(recipe) {
  $("#asmTimeline").innerHTML = recipe.assemblyStages.map((s, i) => `
    <div class="tl-step" data-step="${i}">
      <div class="tl-bar"></div>
      <span class="tl-name">${escapeHtml(s.title)}</span>
    </div>`).join("");
}

function markTimeline(index, status) {
  const step = document.querySelector(`.tl-step[data-step="${index}"]`);
  if (!step) return;
  step.classList.remove("is-current", "is-done");
  if (status) step.classList.add(`is-${status}`);
}

/* ============================================================ assembly engine
   Absolute-time stage scheduler with overlap support (§31): a stage with
   overlapNextMs lets the NEXT stage start before this one ends — e.g. milk
   begins pouring while espresso is at ~74%. Stages carry telemetryEventStart/
   telemetryEventEnd names; the simulated driver fires the same hook surface a
   real MachineTelemetrySource would (coffee_dosing_started → onStageStart,
   …_completed → onStageComplete), so swapping in real telemetry is a source
   change, not a UI change. */

class AssemblyEngine {
  constructor(recipe, hooks, { speed = 1 } = {}) {
    this.recipe = recipe;
    this.hooks = hooks;
    this.speed = speed;
    this.timers = [];
    this.ticker = null;
    let cursor = 0;
    let total = 0;
    this.schedule = recipe.assemblyStages.map((stage, index) => {
      const startMs = cursor;
      const endMs = startMs + stage.durationMs;
      cursor = endMs - (stage.overlapNextMs || 0);
      total = Math.max(total, endMs);
      return { stage, index, startMs, endMs };
    });
    this.totalMs = total / speed;
  }

  start() {
    this.startedAt = performance.now();
    this.ticker = setInterval(() => {
      const elapsed = performance.now() - this.startedAt;
      this.hooks.onProgress?.(Math.min(1, elapsed / this.totalMs), Math.max(0, this.totalMs - elapsed));
    }, 250);
    this.schedule.forEach((item) => {
      this.timers.push(setTimeout(() => {
        this.hooks.onStageStart?.(item.stage, item.index, (item.endMs - item.startMs) / this.speed);
      }, item.startMs / this.speed));
      this.timers.push(setTimeout(() => {
        this.hooks.onStageComplete?.(item.stage, item.index);
      }, item.endMs / this.speed));
    });
    this.timers.push(setTimeout(() => {
      this.stop();
      this.hooks.onDone?.();
    }, this.totalMs + 30));
  }

  stop() {
    this.timers.forEach(clearTimeout);
    this.timers = [];
    clearInterval(this.ticker);
  }
}

/* ============================================================ assembly orchestration */

const PREVIEW_TOTAL_MS = 5200;
let autoStartTimer = null;

function startAssembly() {
  state.locked = false;
  state.simplified = false;
  app.classList.remove("is-simplified");
  setScreen("assembly");
  setPhase("preview");
  track("assembly_started", { recipeId: state.order.id });

  $("#asmKicker").textContent = "Собираю твой";
  $("#asmTitle").textContent = state.order.displayName;
  $("#asmSub").textContent = state.order.shortDescription
    + (state.modifiers.sweetness !== "none" ? ` · сладость: ${SWEET_RU[state.modifiers.sweetness]}` : "");
  $("#lockChip").textContent = "Ещё можно изменить";

  buildScene(state.order);
  mountAssemblyMotion("assembly");
  renderTastePanel(state.order, { filled: false });
  renderTimeline(state.order);
  renderPreviewControls();
  runPreview();
}

/* video layer over the cup area; on any failure the procedural scene stays */
function mountAssemblyMotion(mode) {
  state.motion?.destroy();
  state.motion = mountStageMotion($("#assemblyStage"), state.order, {
    mode,
    onReady: () => track("motion_asset_ready", { recipeId: state.order.id, mode }),
    onError: () => track("motion_asset_fallback", { recipeId: state.order.id, mode })
  });
}

function runPreview() {
  state.engine?.stop();
  resetLayers();
  const total = state.order.assemblyStages.reduce((s, st) => s + st.durationMs, 0);
  const speed = total / PREVIEW_TOTAL_MS;
  state.engine = new AssemblyEngine(state.order, sceneHooks({ preview: true }), { speed });
  state.engine.start();
  scheduleAutoStart();
}

function scheduleAutoStart() {
  clearTimeout(autoStartTimer);
  const fill = document.querySelector(".countdown-pill .cd-fill");
  if (fill) {
    fill.style.transition = "none"; fill.style.transform = "scaleX(0)";
    void fill.offsetWidth;
    fill.style.transition = "transform 7s linear";
    fill.style.transform = "scaleX(1)";
  }
  autoStartTimer = setTimeout(() => startPreparation(), 7000);
}

function renderPreviewControls() {
  $("#asmControls").innerHTML = `
    <button class="ghost-pill" data-action="edit" data-edit="stronger" type="button">Покрепче</button>
    <button class="ghost-pill" data-action="edit" data-edit="softer" type="button">Помягче</button>
    <button class="ghost-pill" data-action="edit" data-edit="less-sweet" type="button">Менее сладкий</button>
    ${state.modifiers.milk ? `<button class="ghost-pill" data-action="edit" data-edit="milk" type="button">Сменить молоко</button>` : ""}
    <button class="pill pill-primary countdown-pill" data-action="lock-start" type="button"><span class="cd-fill"></span>Начать сейчас</button>`;
}

function renderLockedControls() {
  $("#asmControls").innerHTML = `
    <button class="ghost-pill" data-action="why-recipe" type="button">Почему этот рецепт?</button>
    <button class="ghost-pill" data-action="show-profile" type="button">Профиль вкуса</button>
    <button class="ghost-pill" data-action="save-drink" type="button">Сохранить как мой DrinkX</button>
    <button class="ghost-pill" data-action="skip-anim" type="button">Упростить анимацию</button>`;
}

function applyAssemblyEdit(edit) {
  if (state.locked) { toast("Приготовление уже началось — рецепт зафиксирован"); return; }
  if (edit === "stronger") state.modifiers.strength = state.modifiers.strength === "light" ? "balanced" : "strong";
  if (edit === "softer") state.modifiers.strength = state.modifiers.strength === "strong" ? "balanced" : "light";
  if (edit === "less-sweet") {
    const order = ["sweet", "medium", "low", "none"];
    const cur = order.indexOf(state.modifiers.sweetness);
    state.modifiers.sweetness = order[Math.min(order.length - 1, cur + 1)];
    if (state.modifiers.sweetness === "none") state.modifiers.syrup = "none";
  }
  if (edit === "milk") {
    const cycle = ["regular", "oat", "coconut"];
    state.modifiers.milk = cycle[(cycle.indexOf(state.modifiers.milk) + 1) % cycle.length];
    toast(`Теперь — ${MILK_META[state.modifiers.milk].label.toLowerCase()}`);
  }
  state.order = buildOrderRecipe(state.baseRecipe, state.modifiers);
  track("assembly_edit", { edit });
  $("#asmSub").textContent = state.order.shortDescription
    + (state.modifiers.sweetness !== "none" ? ` · сладость: ${SWEET_RU[state.modifiers.sweetness]}` : "");
  buildScene(state.order);
  mountAssemblyMotion("assembly");
  renderTastePanel(state.order, { filled: false });
  renderTimeline(state.order);
  renderPreviewControls();
  runPreview();
}

function startPreparation() {
  clearTimeout(autoStartTimer);
  state.engine?.stop();
  state.locked = true;
  setPhase("preparing");
  track("assembly_locked", {});

  $("#asmKicker").textContent = "Готовлю твой";
  $("#lockChip").textContent = "Готовится — рецепт зафиксирован";
  renderLockedControls();
  renderTastePanel(state.order, { filled: false });
  state.order.assemblyStages.forEach((_, i) => markTimeline(i, null));
  resetLayers();
  mountAssemblyMotion("preparation");
  $("#progressRing").style.opacity = "1";

  /* Simulated telemetry: same hook surface a real MachineTelemetrySource would drive. */
  state.engine = new AssemblyEngine(state.order, {
    ...sceneHooks({ preview: false }),
    onProgress(pct, etaMs) {
      const C = 2 * Math.PI * 34;
      const ring = $(".ring-fill");
      if (ring) ring.style.strokeDashoffset = `${C * (1 - pct)}`;
      const lbl = document.querySelector(".ring-label");
      if (lbl) lbl.textContent = `${Math.round(pct * 100)}%`;
      const sub = document.querySelector(".ring-sub");
      if (sub) sub.textContent = etaMs > 1500 ? `~${Math.ceil(etaMs / 1000)} СЕК` : "ФИНИШ";
    },
    onDone() {
      setPhase("done");
      track("drink_ready", {});
      setTimeout(showReady, 1600);
    }
  }, { speed: 1 });
  state.engine.start();
}

/* overlap-aware pour tracking: the stream keeps flowing while ANY pouring
   stage is active and re-tints to the most recent ingredient */
const activePours = new Map(); // stageId -> color

function sceneHooks({ preview }) {
  return {
    onStageStart(stage, index, ms) {
      markTimeline(index, "current");
      $("#aiCommentText").textContent = stage.aiComment;
      const p = $("#aiCommentText");
      p.style.animation = "none"; void p.offsetWidth; p.style.animation = "";

      if (stage.module) {
        const node = $(`#node-${stage.module}`);
        node?.classList.add("is-active");
        if (stage.ingredient) $(`#flow-${stage.module}`)?.classList.add("is-running");
      }

      if (stage.ingredient) {
        const ing = scene.recipe.ingredients.find((i) => i.id === stage.ingredient);
        if (stage.animation === "ice_drop") {
          fillLayer(stage.ingredient, ms * 0.5);
          document.querySelectorAll(".ice-cube").forEach((c, k) =>
            setTimeout(() => c.classList.add("is-in"), (k + 1) * (ms * 0.2)));
        } else if (stage.animation === "swirl") {
          fillLayer(stage.ingredient, ms * 0.8);
          setTimeout(() => $("#asm-swirl")?.classList.add("is-in"), ms * 0.2);
        } else {
          fillLayer(stage.ingredient, ms * 0.85);
          if (ing && !preview) {
            activePours.set(stage.id, ing.color);
            setPour(true, ing.color);
          }
        }
      }
      if (stage.animation === "profile_highlight") {
        tasteMetrics(scene.recipe).forEach((m) => setMetric(m.id, m.value));
      }
    },
    onStageComplete(stage, index) {
      markTimeline(index, "done");
      activePours.delete(stage.id);
      if (activePours.size === 0) {
        setPour(false);
      } else {
        setPour(true, [...activePours.values()].pop());   // another pour still running (overlap)
      }
      if (stage.module) {
        const node = $(`#node-${stage.module}`);
        node?.classList.remove("is-active");
        node?.classList.add("is-done");
        $(`#flow-${stage.module}`)?.classList.remove("is-running");
      }
      if (stage.ingredient) {
        $(`#asm-label-${stage.ingredient}`)?.classList.add("is-on");
        $(`#asm-tick-${stage.ingredient}`)?.classList.add("is-on");
      }
      applyTasteImpact(stage);
    },
    onDone() {
      if (preview) {
        $("#aiCommentText").textContent = "Это план. Подкрути — или я начну через мгновение.";
      }
    }
  };
}

/* ============================================================ READY + RATE */

function showReady() {
  state.engine?.stop();
  state.motion?.destroy();
  const r = state.order;
  setScreen("ready");
  $("#readyTitle").textContent = `${r.displayName} — готово!`;
  $("#readySub").textContent = r.readyLine || "Сделано точно под твой вкус.";
  mountDrinkVisual($("#readyCupWrap"), r, { mode: "ready", width: 190, prefix: "rdy", effects: true });
  $("#readyAiText").textContent = r.readyAi || "Пробуй — и скажи, как тебе баланс.";
  const p = r.tasteProfile;
  $("#readyChips").innerHTML = [
    p.strength >= 65 ? "крепкий" : p.strength >= 45 ? "сбалансированный" : "мягкий",
    TEXTURE_RU[p.texture] || p.texture,
    p.sweetness === 0 ? "без сахара" : "чуть сладкий",
    TEMP_RU[p.temperature] || p.temperature
  ].map((c) => `<span class="tag-chip">${escapeHtml(c)}</span>`).join("");

  profile.history.push({ recipeId: r.id, ts: Date.now() });
  saveProfile();
}

function renderRate() {
  $("#rateOptions").innerHTML = RATING_OPTIONS.map((o, i) =>
    `<button class="q-option" data-action="rate" data-rating="${o.id}" style="--i:${i}" type="button">${escapeHtml(o.label)}</button>`).join("");
  $("#rateNote").textContent = "";
}

function applyRating(ratingId) {
  const opt = RATING_OPTIONS.find((o) => o.id === ratingId);
  Object.entries(opt.delta).forEach(([k, v]) => {
    profile.vector[k] = (profile.vector[k] || 0) + v;
  });
  const last = profile.history[profile.history.length - 1];
  if (last) last.rating = ratingId;
  saveProfile();
  track("rating", { rating: ratingId });
  document.querySelectorAll('#rateOptions .q-option').forEach((b) => b.classList.toggle("is-picked", b.dataset.rating === ratingId));
  $("#rateNote").textContent = ratingId === "perfect"
    ? "Принято. Оставлю рецепт ровно таким."
    : "Понял — в следующий раз подстрою баланс.";
  setTimeout(() => { setScreen("home"); renderHome(); }, 1400);
}

function saveDrink() {
  if (!state.order) return;
  profile.savedDrinks = [{ recipeId: state.baseRecipe.id, modifiers: state.modifiers }];
  saveProfile();
  toast(`Сохранено — «${state.order.displayName}» теперь твой DrinkX`);
  renderHome();
  track("drink_saved", { recipeId: state.baseRecipe.id });
}

/* ============================================================ actions */

const actions = {
  "go-intent": () => { renderIntents(); setScreen("intent"); },
  "go-fast": () => { renderFast(); setScreen("fast"); },
  "go-surprise": () => { state.intent = "surprise"; state.answers = []; showRecommendations(); },
  "go-usual": () => {
    const saved = profile.savedDrinks[0];
    if (!saved || !recipeById(saved.recipeId)) {
      toast("Сохранённого напитка пока нет — давай найдём твой");
      renderIntents(); setScreen("intent");
      return;
    }
    state.baseRecipe = recipeById(saved.recipeId);
    state.modifiers = { ...defaultModifiers(state.baseRecipe), ...saved.modifiers };
    state.order = buildOrderRecipe(state.baseRecipe, state.modifiers);
    renderSummary(); setScreen("summary");
  },
  "strip-pick": (el) => { selectRecipe(el.dataset.recipe, { path: "strip" }); renderSummary(); setScreen("summary"); },
  "fast-pick": (el) => { selectRecipe(el.dataset.recipe, { path: "fast" }); renderSummary(); setScreen("summary"); },
  "back-home": () => { state.engine?.stop(); state.motion?.destroy(); clearTimeout(autoStartTimer); setPhase(""); renderHome(); setScreen("home"); },
  "back-question": () => {
    if (state.screen === "question" && state.qIndex > 0) { state.qIndex -= 1; state.answers.pop(); renderQuestion(); }
    else { renderIntents(); setScreen("intent"); }
  },
  "pick-intent": (el) => startQuestions(el.dataset.intent),
  "answer": (el) => answer(el.dataset.option),
  "promote": (el) => {
    const id = el.dataset.recipe;
    state.recCards = [id, ...state.recCards.filter((x) => x !== id)].slice(0, 3);
    renderRecommend();
    track("alt_promoted", { recipeId: id });
  },
  "mutate": (el) => mutate(el.dataset.mutation),
  "order": (el) => { selectRecipe(el.dataset.recipe, { path: "ai" }); renderSummary(); setScreen("summary"); },
  "go-customize-hero": () => { selectRecipe(state.recCards[0], { path: "ai" }); renderCustomize(); setScreen("customize"); },
  "go-customize": () => { renderCustomize(); setScreen("customize"); },
  "back-recommend": () => {
    if (state.recCards.length) { renderRecommend(); setScreen("recommend"); }
    else { renderHome(); setScreen("home"); }
  },
  "set-mod": (el) => setModifier(el.dataset.control, el.dataset.value),
  "go-summary": () => { renderSummary(); setScreen("summary"); },
  "start-assembly": () => startAssembly(),
  "edit": (el) => applyAssemblyEdit(el.dataset.edit),
  "lock-start": () => startPreparation(),
  "why-recipe": () => {
    $("#aiCommentText").textContent = state.baseRecipe.why;
    const p = $("#aiCommentText"); p.style.animation = "none"; void p.offsetWidth; p.style.animation = "";
  },
  "show-profile": () => {
    tasteMetrics(state.order).forEach((m) => setMetric(m.id, parseFloat($(`#tf-${m.id}`)?.style.width) || 0, true));
    $("#tastePanel").scrollIntoView({ behavior: "smooth", block: "center" });
  },
  "skip-anim": () => {
    state.simplified = true;
    app.classList.add("is-simplified");
    track("skip_animation", {});
    toast("Упрощённый вид — напиток уже готовится");
  },
  "save-drink": () => saveDrink(),
  "go-rate": () => { renderRate(); setScreen("rate"); },
  "rate": (el) => applyRating(el.dataset.rating),
  "order-again": () => { renderSummary(); setScreen("summary"); },
  "softer-next": () => {
    state.intent = "soft"; state.answers = [];
    const softer = RECIPES.filter((r) => r.tasteProfile.strength < (state.order?.tasteProfile.strength ?? 60))
      .sort((a, b) => b.tasteProfile.milkiness - a.tasteProfile.milkiness)[0];
    showRecommendations(softer?.id);
  }
};

document.addEventListener("click", (event) => {
  const el = event.target.closest("[data-action]");
  if (!el) return;
  const handler = actions[el.dataset.action];
  if (handler) handler(el);
});

/* ============================================================ init */

renderHome();
initMind($("#mindCanvas"), document.querySelector(".hero-card"));
track("session_start", {});
