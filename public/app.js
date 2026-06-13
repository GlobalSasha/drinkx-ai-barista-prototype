const drinkCatalog = [
  { name: "Капучино", image: "cappuccino-salted-almond.png", profile: "coffee-milk", aliases: ["капучино", "классический капучино"] },
  { name: "Латте", image: "latte-d2d.png", profile: "coffee-milk", aliases: ["латте", "классический латте"] },
  { name: "Американо", image: "grog.png", profile: "coffee-black", aliases: ["американо", "черный кофе", "чёрный кофе"] },
  { name: "Райский остров", image: "paradise-island.png", profile: "tea-signature", aliases: ["райский", "остров"] },
  { name: "Жасмин кокос", image: "jasmine-coconut.png", profile: "tea-signature", aliases: ["жасмин кокос"] },
  { name: "Рафкранч", image: "raf-crunch.png", profile: "coffee-milk", aliases: ["раф кранч", "рафкранч"] },
  { name: "Сезон Сакуры", image: "sakura-season.png", profile: "tea-signature", aliases: ["сакура", "сезон сакуры"] },
  { name: "Фудзи раф", image: "fuji-raf.png", profile: "coffee-milk", aliases: ["фудзи", "фудзи раф"] },
  { name: "Жасмин-земляника", image: "jasmine-strawberry.png", profile: "tea-signature", aliases: ["жасмин земляника"] },
  { name: "Сад лунного цветка", image: "moonflower-garden.png", profile: "tea-signature", aliases: ["лунный цветок", "сад лунного цветка"] },
  { name: "Колдбрю манго-маракуйя", image: "coldbrew-mango-passionfruit.png", profile: "cold-coffee", aliases: ["колдбрю манго", "манго маракуйя"] },
  { name: "Латте банан-кокос", image: "latte-banana-coconut.png", profile: "coffee-milk", aliases: ["банан кокос", "латте банан"] },
  { name: "Латте D2D", image: "latte-d2d.png", profile: "coffee-milk", aliases: ["латте д ту д", "латте d2d"] },
  { name: "Клубничный пломбир", image: "strawberry-plombir.png", profile: "coffee-milk", aliases: ["клубничный пломбир", "пломбир"] },
  { name: "Морс", image: "mors.jpeg", profile: "mors", aliases: ["морс"] },
  { name: "Грог", image: "grog.png", profile: "tea-hot", aliases: ["грог"] },
  { name: "Юдзу Лимонад", image: "yuzu-lemonade.png", profile: "lemonade", aliases: ["юдзу", "лимонад"] },
  { name: "Груша-Жасмин", image: "pear-jasmine.png", profile: "tea-signature", aliases: ["груша жасмин"] },
  { name: "Матча Латте Дабл", image: "matcha-latte-double.png", profile: "matcha-milk", aliases: ["матча дабл", "матча латте"] },
  { name: "Земляника-шисо", image: "strawberry-shiso.png", profile: "tea-signature", aliases: ["земляника шисо", "шисо"] },
  { name: "Кариб", image: "carib.png", profile: "lemonade", aliases: ["кариб"] },
  { name: "Вьетнамский бамбл", image: "vietnamese-bumble.png", profile: "cold-coffee", aliases: ["вьетнамский", "бамбл"] },
  { name: "Чай Каркаде Яблоко D2D", image: "hibiscus-apple-tea.png", profile: "tea-hot", aliases: ["каркаде яблоко", "чай каркаде"] },
  { name: "Латте Баунти", image: "latte-bounty.png", profile: "coffee-milk", aliases: ["баунти", "латте баунти"] },
  { name: "Капучино соленый миндаль", image: "cappuccino-salted-almond.png", profile: "coffee-milk", aliases: ["соленый миндаль", "капучино миндаль"] },
  { name: "Изумрудный чай", image: "emerald-tea.png", profile: "tea-hot", aliases: ["изумрудный", "изумрудный чай"] },
  { name: "Ханами", image: "hanami.png", profile: "tea-signature", aliases: ["ханами"] },
  { name: "Айс матча", image: "ice-matcha.png", profile: "matcha-milk", aliases: ["айс матча", "холодная матча"] },
  { name: "Айс-ти Каркаде Яблоко", image: "ice-tea-hibiscus-apple.png", profile: "iced-tea", aliases: ["айс ти яблоко", "каркаде яблоко"] },
  { name: "Айс-ти Каркаде Манго-Маракуйя", image: "ice-tea-hibiscus-mango-passionfruit.png", profile: "iced-tea", aliases: ["айс ти манго", "каркаде манго"] },
  { name: "Баннофи", image: "banoffee.png", profile: "coffee-milk", aliases: ["баннофи"] },
  { name: "Колдбрю вишня", image: "coldbrew-cherry.png", profile: "cold-coffee", aliases: ["колдбрю вишня", "вишня"] },
  { name: "Раф клубника-банан", image: "raf-strawberry-banana.png", profile: "coffee-milk", aliases: ["раф клубника банан", "клубника банан"] }
];

const menu = {
  drinks: drinkCatalog.map((drink) => drink.name),
  sizes: ["S", "M", "L"],
  milks: ["Обычное", "Овсяное", "Миндальное", "Кокосовое", "Без молока"],
  syrups: [
    "Ваниль",
    "Карамель",
    "Лесной орех",
    "Шоколад",
    "Кокос",
    "Мята",
    "Клубника",
    "Банан",
    "Лаванда",
    "Соленая карамель"
  ]
};

const basePrices = Object.fromEntries(drinkCatalog.map((drink) => [drink.name, 0]));

const sizePrices = { S: 0, M: 40, L: 80 };
const milkPrices = { Обычное: 0, Овсяное: 60, Миндальное: 70, Кокосовое: 70 };
const syrupPrice = 45;
const prepDurationSeconds = 120;
const sizeVolumes = { S: 250, M: 350, L: 500 };

/* Segment colors follow the neo-brutalist palette:
   coffee=#FF4E00, milk=#FFFFFF, tea=#32CD32, fruit/berry=#FF1493,
   ice/water=#00CED1, sweet/aroma=#FFD700, foam=#F5F5F5, cocoa=#0A0A0A */
const drinkProfiles = {
  "coffee-milk": {
    type: "Авторский кофе",
    thesis: "Кофейная база, молочная текстура и вкусовой слой DrinkX.",
    hasMilk: true,
    segments: [
      { label: "Кофейная база", percent: 22, color: "#FF4E00" },
      { label: "Молочная текстура", percent: 58, color: "#FFFFFF" },
      { label: "Авторский вкус", percent: 20, color: "#FFD700" }
    ]
  },
  "cold-coffee": {
    type: "Холодный кофе",
    thesis: "Колдбрю или кофейная база с ярким фруктовым профилем.",
    hasMilk: false,
    segments: [
      { label: "Кофейная база", percent: 36, color: "#FF4E00" },
      { label: "Фруктовый слой", percent: 44, color: "#FF1493" },
      { label: "Ледяная база", percent: 20, color: "#00CED1" }
    ]
  },
  "tea-signature": {
    type: "Авторский чай",
    thesis: "Чайная основа, цветочный профиль и фруктовая нота.",
    hasMilk: false,
    segments: [
      { label: "Чайная база", percent: 48, color: "#32CD32" },
      { label: "Фруктовый слой", percent: 34, color: "#FF1493" },
      { label: "Ароматический профиль", percent: 18, color: "#FFD700" }
    ]
  },
  "tea-hot": {
    type: "Горячий чай",
    thesis: "Пряная или ягодная чайная база для теплого профиля.",
    hasMilk: false,
    segments: [
      { label: "Чайная база", percent: 58, color: "#32CD32" },
      { label: "Ягодный слой", percent: 26, color: "#FF1493" },
      { label: "Пряная нота", percent: 16, color: "#FFD700" }
    ]
  },
  "iced-tea": {
    type: "Холодный чай",
    thesis: "Освежающий чайный напиток с фруктовой кислотностью.",
    hasMilk: false,
    segments: [
      { label: "Чайная база", percent: 44, color: "#32CD32" },
      { label: "Фруктовая база", percent: 38, color: "#FF1493" },
      { label: "Лед", percent: 18, color: "#00CED1" }
    ]
  },
  lemonade: {
    type: "Лимонад",
    thesis: "Газированная свежая база с ярким фруктовым вкусом.",
    hasMilk: false,
    segments: [
      { label: "Фруктовая база", percent: 42, color: "#FF1493" },
      { label: "Цитрус", percent: 24, color: "#FFD700" },
      { label: "Газированная вода", percent: 34, color: "#00CED1" }
    ]
  },
  mors: {
    type: "Ягодный морс",
    thesis: "Ягодная основа, мягкая сладость и освежающий объем.",
    hasMilk: false,
    segments: [
      { label: "Ягодная база", percent: 54, color: "#FF1493" },
      { label: "Вода", percent: 36, color: "#00CED1" },
      { label: "Сладость", percent: 10, color: "#FFD700" }
    ]
  },
  "matcha-milk": {
    type: "Матча",
    thesis: "Матча база и мягкая молочная текстура.",
    hasMilk: true,
    segments: [
      { label: "Матча база", percent: 34, color: "#32CD32" },
      { label: "Молочная текстура", percent: 56, color: "#FFFFFF" },
      { label: "Финишный слой", percent: 10, color: "#FFD700" }
    ]
  }
};

const drinkRecipes = {
  "Эспрессо": {
    type: "Кофейный концентрат",
    thesis: "Короткий плотный импульс без молока и сиропной базы.",
    hasMilk: false,
    segments: [{ label: "Кофейный концентрат", percent: 100, color: "#FF4E00" }]
  },
  "Американо": {
    type: "Кофе + вода",
    thesis: "Концентрат раскрывается горячей водой, вкус остаётся чистым.",
    hasMilk: false,
    segments: [
      { label: "Кофейный концентрат", percent: 28, color: "#FF4E00" },
      { label: "Горячая вода", percent: 72, color: "#00CED1" }
    ]
  },
  "Капучино": {
    type: "Классический молочный",
    thesis: "Кофейная база, плотная молочная текстура и высокая пена.",
    hasMilk: true,
    segments: [
      { label: "Кофейный концентрат", percent: 22, color: "#FF4E00" },
      { label: "Молочная текстура", percent: 50, color: "#FFFFFF" },
      { label: "Пена", percent: 28, color: "#F5F5F5" }
    ]
  },
  "Латте": {
    type: "Мягкий молочный",
    thesis: "Больше молока, меньше пены, спокойный кофейный профиль.",
    hasMilk: true,
    segments: [
      { label: "Кофейный концентрат", percent: 18, color: "#FF4E00" },
      { label: "Молочная база", percent: 72, color: "#FFFFFF" },
      { label: "Лёгкая пена", percent: 10, color: "#F5F5F5" }
    ]
  },
  "Раф": {
    type: "Сливочный авторский",
    thesis: "Кофе смешивается со сливочной молочной базой и мягкой сладостью.",
    hasMilk: true,
    segments: [
      { label: "Кофейный концентрат", percent: 16, color: "#FF4E00" },
      { label: "Сливочная база", percent: 74, color: "#FFFFFF" },
      { label: "Сладкий слой", percent: 10, color: "#FFD700" }
    ]
  },
  "Матча латте": {
    type: "Матча + молоко",
    thesis: "Зелёная база матча и мягкое вспененное молоко.",
    hasMilk: true,
    segments: [
      { label: "Матча база", percent: 30, color: "#32CD32" },
      { label: "Молочная текстура", percent: 70, color: "#FFFFFF" }
    ]
  },
  "Какао": {
    type: "Какао + молоко",
    thesis: "Шоколадная база, молочная текстура и мягкий тёплый профиль.",
    hasMilk: true,
    segments: [
      { label: "Какао база", percent: 32, color: "#0A0A0A" },
      { label: "Молочная текстура", percent: 68, color: "#FFFFFF" }
    ]
  }
};

const elements = {
  appShell: document.querySelector(".app-shell"),
  confettiLayer: document.querySelector("#confettiLayer"),
  tickerTrack: document.querySelector("#tickerTrack"),
  enterTapButton: document.querySelector("#enterTapButton"),
  enterVoiceButton: document.querySelector("#enterVoiceButton"),
  welcomeHint: document.querySelector("#welcomeHint"),
  backButton: document.querySelector("#backButton"),
  resetButton: document.querySelector("#resetButton"),
  stateLabel: document.querySelector("#stateLabel"),
  voiceOrb: document.querySelector("#voiceOrb"),
  assistantLine: document.querySelector("#assistantLine"),
  userLine: document.querySelector("#userLine"),
  orderFlow: document.querySelector("#orderFlow"),
  menuZone: document.querySelector("#menuZone"),
  menuGrid: document.querySelector("#menuGrid"),
  menuCount: document.querySelector("#menuCount"),
  confirmButton: document.querySelector("#confirmButton"),
  detailSheet: document.querySelector("#detailSheet"),
  detailClose: document.querySelector("#detailClose"),
  detailSelectButton: document.querySelector("#detailSelectButton"),
  recipeBlueprint: document.querySelector("#recipeBlueprint"),
  prepRecipeBlueprint: document.querySelector("#prepRecipeBlueprint"),
  readyRecipeBlueprint: document.querySelector("#readyRecipeBlueprint"),
  prepOrderFlow: document.querySelector("#prepOrderFlow"),
  readyOrderFlow: document.querySelector("#readyOrderFlow"),
  prepTitle: document.querySelector("#prepTitle"),
  prepLine: document.querySelector("#prepLine"),
  prepTalkButton: document.querySelector("#prepTalkButton"),
  prepBackButton: document.querySelector("#prepBackButton"),
  newOrderButton: document.querySelector("#newOrderButton"),
  timerValue: document.querySelector("#timerValue"),
  timerProgress: document.querySelector("#timerProgress")
};

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const initialOrder = {
  drink: null,
  size: null,
  milk: null,
  syrup: null,
  sugar: null,
  temperature: "Горячий",
  status: "draft"
};

let appScreen = "welcome";
let recognition = null;
let peerConnection = null;
let dataChannel = null;
let remoteAudio = null;
let isLiveConnected = false;
let isLiveConnecting = false;
let liveFailed = false;
let voiceEntryArmed = false;
const handledToolCallIds = new Set();
let order = { ...initialOrder };
let preparationTimer = null;
let secondsLeft = prepDurationSeconds;
let previewDrink = null;

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replaceAll("ё", "е");
}

function getDrinkInfo(name) {
  return drinkCatalog.find((drink) => drink.name === name);
}

function resolveDrinkName(value) {
  return findMenuValue(value, menu.drinks);
}

function getDrinkRecipe(name) {
  const info = getDrinkInfo(name);
  return drinkRecipes[name] || drinkProfiles[info?.profile] || null;
}

function drinkNeedsMilk(name) {
  return Boolean(getDrinkRecipe(name)?.hasMilk);
}

function findMenuValue(text, values) {
  const clean = normalize(text);
  const direct = [...values]
    .sort((left, right) => normalize(right).length - normalize(left).length)
    .find((value) => clean.includes(normalize(value)));
  if (direct) return direct;

  const drink = drinkCatalog
    .flatMap((item) => (item.aliases || []).map((alias) => ({ item, alias })))
    .sort((left, right) => normalize(right.alias).length - normalize(left.alias).length)
    .find(({ alias }) => clean.includes(normalize(alias)))?.item;
  if (drink && values.includes(drink.name)) return drink.name;

  return undefined;
}

function calculatePrice() {
  if (!order.drink) return 0;
  const base = basePrices[order.drink] || 0;
  const size = sizePrices[order.size] || 0;
  const milk = milkPrices[order.milk] || 0;
  const syrup = order.syrup && order.syrup !== "Без сиропа" ? syrupPrice : 0;
  return base + size + milk + syrup;
}

function orderSummary() {
  const milkLabel = order.milk === "Без молока" ? "без молока" : order.milk && `${order.milk.toLowerCase()} молоко`;
  const parts = [order.size, order.drink, milkLabel]
    .filter(Boolean)
    .join(", ");
  const syrup = order.syrup ? `, ${order.syrup.toLowerCase()}` : "";
  const sugar = order.sugar ? `, ${order.sugar.toLowerCase()}` : "";
  return `${parts}${syrup}${sugar}`;
}

function setScreen(screen) {
  appScreen = screen;
  elements.appShell.dataset.screen = screen;
}

function idleLabel() {
  if (appScreen === "preparing") return "ГОТОВЛЮ";
  if (liveFailed && !isLiveConnected) return "ГОЛОС ОФЛАЙН";
  return "ГОТОВ";
}

function setAssistantState(state, label) {
  elements.appShell.dataset.voice = state;
  elements.stateLabel.textContent = label;
}

function setAssistantText(text) {
  elements.assistantLine.textContent = text;
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildRecipeSegments(recipe) {
  const segments = recipe.segments.map((segment) => ({ ...segment }));
  const hasSyrup = order.syrup && order.syrup !== "Без сиропа";
  if (!hasSyrup) return segments;

  const syrupPercent = 8;
  const largestIndex = segments.reduce(
    (largest, segment, index) => (segment.percent > segments[largest].percent ? index : largest),
    0
  );
  segments[largestIndex].percent = Math.max(1, segments[largestIndex].percent - syrupPercent);
  segments.splice(Math.min(segments.length, 1), 0, {
    label: `${order.syrup} сироп`,
    percent: syrupPercent,
    color: "#FF1493"
  });
  return segments;
}

function buildRecipeBlueprint(drinkName = order.drink) {
  if (!drinkName) return "";

  const drinkInfo = getDrinkInfo(drinkName);
  const recipe = getDrinkRecipe(drinkName);
  if (!recipe) return "";

  const usesActiveOrder = drinkName === order.drink;
  const volume = sizeVolumes[order.size] || sizeVolumes.M;
  const price = usesActiveOrder ? calculatePrice() : 0;
  const segments = buildRecipeSegments(recipe);
  const milk = recipe.hasMilk ? `${usesActiveOrder ? order.milk || "Обычное" : "на выбор"} молоко` : "Без молока";
  const syrup = usesActiveOrder ? order.syrup || "Без сиропа" : "на выбор";
  const temperature = usesActiveOrder ? order.temperature || "Горячий" : "по рецепту";
  const size = usesActiveOrder ? order.size || "M" : "M";
  const meta = `${size} / ${volume} мл${price ? ` / ${price} ₽` : ""}`;
  const summaryItems = [
    ["Размер", size],
    ["Молоко", milk],
    ["Сироп", syrup],
    ["Темп.", temperature],
    ["Цена", price ? `${price} ₽` : "уточняется"]
  ];

  const bar = segments
    .map(
      (segment) => `
        <span
          class="recipe-segment"
          style="--segment-width: ${segment.percent}%; --segment-color: ${segment.color};"
          title="${escapeHtml(segment.label)}"
        ></span>
      `
    )
    .join("");

  const rows = segments
    .map((segment) => {
      const ml = Math.round((volume * segment.percent) / 100);
      return `
        <div class="recipe-row">
          <span class="recipe-swatch" style="--segment-color: ${segment.color};"></span>
          <span>${escapeHtml(segment.label)}</span>
          <strong>${segment.percent}%</strong>
          <span>${ml} мл</span>
        </div>
      `;
    })
    .join("");

  return `
    <article class="recipe-card">
      ${drinkInfo ? `
        <section class="drink-confirmation">
          <div class="drink-photo">
            <img src="assets/drinks/${escapeHtml(drinkInfo.image)}" alt="${escapeHtml(drinkName)}" />
          </div>
          <div class="drink-confirmation-copy">
            <span class="recipe-kicker">Визуальное подтверждение</span>
            <strong>${escapeHtml(drinkName)}</strong>
            <span>${escapeHtml(recipe.type)}</span>
          </div>
        </section>
      ` : ""}
      <section class="drink-summary" aria-label="Параметры заказа">
        ${summaryItems
          .map(
            ([label, value]) => `
              <span>
                ${escapeHtml(label)}
                <strong>${escapeHtml(value)}</strong>
              </span>
            `
          )
          .join("")}
      </section>
      <header class="recipe-head">
        <span>
          <span class="recipe-kicker">X-Ray состав</span>
          <strong>${escapeHtml(recipe.type)}</strong>
        </span>
        <span>${escapeHtml(meta)}</span>
      </header>
      <p class="recipe-thesis">${escapeHtml(recipe.thesis)}</p>
      <div class="recipe-bar">${bar}</div>
      <div class="recipe-rows">${rows}</div>
      <footer class="recipe-meta">
        <span>Молоко <strong>${escapeHtml(milk)}</strong></span>
        <span>Сироп <strong>${escapeHtml(syrup)}</strong></span>
        <span>Темп. <strong>${escapeHtml(order.temperature || "Горячий")}</strong></span>
      </footer>
    </article>
  `;
}

function renderRecipeBlueprints() {
  const sheetDrink = previewDrink || order.drink;
  if (elements.recipeBlueprint) {
    elements.recipeBlueprint.innerHTML = sheetDrink ? buildRecipeBlueprint(sheetDrink) : "";
  }

  const activeOrderHtml = buildRecipeBlueprint(order.drink);
  [elements.prepRecipeBlueprint, elements.readyRecipeBlueprint].forEach((element) => {
    if (!element) return;
    element.hidden = !activeOrderHtml;
    element.innerHTML = activeOrderHtml;
  });
}

/* ============================ Menu (always visible) ============================ */

function renderMenuGrid() {
  elements.menuCount.textContent = `${drinkCatalog.length} ПОЗИЦИИ`;
  elements.menuGrid.innerHTML = drinkCatalog
    .map((drink, index) => {
      const recipe = getDrinkRecipe(drink.name);
      return `
        <button class="menu-card" type="button" data-drink="${escapeHtml(drink.name)}" style="--i: ${index}">
          <span class="menu-card-image">
            <img src="assets/drinks/${escapeHtml(drink.image)}" alt="${escapeHtml(drink.name)}" loading="lazy" />
          </span>
          <span class="menu-card-copy">
            <strong>${escapeHtml(drink.name)}</strong>
            <span class="menu-card-tag">${escapeHtml(recipe?.type || "Напиток DrinkX")}</span>
          </span>
        </button>
      `;
    })
    .join("");
}

function syncActiveMenuCard() {
  elements.menuGrid.querySelectorAll(".menu-card").forEach((card) => {
    card.classList.toggle("is-active", card.dataset.drink === order.drink);
  });
}

function highlightMenu() {
  closeDetailSheet();
  elements.menuZone.classList.remove("is-highlight");
  void elements.menuZone.offsetWidth;
  elements.menuZone.classList.add("is-highlight");
  elements.menuGrid.scrollTo({ top: 0, behavior: "smooth" });
}

function openDetailSheet(drinkName) {
  const resolved = resolveDrinkName(drinkName) || previewDrink || order.drink;
  if (!resolved) {
    highlightMenu();
    return null;
  }

  previewDrink = resolved;
  renderRecipeBlueprints();
  elements.detailSelectButton.textContent = resolved === order.drink ? "ОК, ДАЛЬШЕ →" : "ВЗЯТЬ ЭТОТ →";
  elements.detailSheet.hidden = false;
  return resolved;
}

function closeDetailSheet() {
  if (elements.detailSheet.hidden) return;
  elements.detailSheet.hidden = true;
  previewDrink = null;
  renderRecipeBlueprints();
}

/* ============================ Order state ============================ */

function buildChips() {
  const chips = [
    { key: "size", label: "Размер", value: order.size, icon: "SZ" },
    { key: "drink", label: "Напиток", value: order.drink, icon: "DR" },
    { key: "milk", label: "Молоко", value: order.milk, icon: "ML" },
    { key: "syrup", label: "Сироп", value: order.syrup, icon: "SY" },
    { key: "sugar", label: "Сахар", value: order.sugar, icon: "SG" },
    { key: "temperature", label: "Темп.", value: order.drink ? order.temperature : null, icon: "TP" }
  ];

  return chips
    .filter((chip) => chip.value)
    .map(
      (chip) => `
        <article class="order-chip" data-chip="${chip.key}">
          <span class="chip-icon">${chip.icon}</span>
          <span>
            <span class="chip-label">${chip.label}</span>
            <span class="chip-value">${chip.value}</span>
          </span>
        </article>
      `
    )
    .join("");
}

function renderOrder() {
  const chips = buildChips();
  elements.orderFlow.innerHTML = chips;
  elements.prepOrderFlow.innerHTML = chips;
  elements.readyOrderFlow.innerHTML = chips;
  elements.confirmButton.disabled = !order.drink;
  syncActiveMenuCard();
  renderRecipeBlueprints();
}

function updateOrder(patch = {}) {
  const cleanedPatch = Object.fromEntries(
    Object.entries(patch).filter(([, value]) => value !== undefined && value !== "")
  );
  order = { ...order, ...cleanedPatch };
  if (cleanedPatch.drink) previewDrink = null;
  renderOrder();

  if (order.status === "confirmed" && appScreen !== "preparing" && appScreen !== "ready") {
    startPreparation();
  }
}

/* Parallel interaction: a tap never blocks the voice dialog — it feeds it. */
function notifyAgentDrinkTapped(drinkName) {
  if (isLiveConnected) {
    sendRealtimeEvent({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text: `[Событие интерфейса: пользователь выбрал тапом напиток «${drinkName}». Коротко подтверди выбор голосом и задай следующий уточняющий вопрос.]`
          }
        ]
      }
    });
    sendRealtimeEvent({ type: "response.create" });
  } else {
    speakDemo(nextQuestion());
  }
}

function selectDrinkByTap(drinkName) {
  updateOrder({ drink: drinkName, status: "draft" });
  openDetailSheet(drinkName);
  notifyAgentDrinkTapped(drinkName);
}

/* ============================ Demo fallback (Web Speech) ============================ */

function speakDemo(text, nextLabel) {
  if (appScreen === "select" || appScreen === "welcome") setAssistantText(text);
  if (appScreen === "preparing") elements.prepLine.textContent = text;
  setAssistantState("speaking", "ГОВОРЮ");
  const doneLabel = nextLabel || idleLabel();

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ru-RU";
    utterance.rate = 1;
    utterance.onend = () => setAssistantState("idle", doneLabel);
    window.speechSynthesis.speak(utterance);
  } else {
    setTimeout(() => setAssistantState("idle", doneLabel), 1200);
  }
}

function nextQuestion() {
  if (!order.drink) return "Что приготовим сегодня?";
  if (!order.size) return "Какой размер выбрать: маленький, средний или большой?";
  if (!order.milk && drinkNeedsMilk(order.drink)) return "Какое молоко добавить: обычное, овсяное, миндальное или кокосовое?";
  if (!order.milk) order.milk = "Без молока";
  if (!order.syrup) return "Добавить сироп или сделать без сиропа?";
  order.status = "ready_to_confirm";
  renderOrder();
  return `Проверяю заказ: ${orderSummary()}. Подтверждаем?`;
}

function parsePreparationPhrase(phrase) {
  const clean = normalize(phrase);
  elements.userLine.textContent = `Ты: ${phrase}`;

  if (clean.includes("ничего") || clean.includes("не надо") || clean.includes("ждать")) {
    speakDemo("Хорошо. Я просто покажу таймер и сообщу, когда напиток будет готов.", "ГОТОВЛЮ");
    return;
  }

  speakDemo("Могу рассказать про состав напитка или просто продолжить таймер. Пока готовлю.", "ГОТОВЛЮ");
}

function parseDemoPhrase(phrase) {
  if (appScreen === "preparing") {
    parsePreparationPhrase(phrase);
    return;
  }

  const clean = normalize(phrase);
  const patch = {};

  const wantsMenu =
    clean.includes("покажи меню") ||
    clean.includes("все меню") ||
    clean.includes("всё меню") ||
    clean.includes("какие есть") ||
    clean.includes("что есть") ||
    clean.includes("посмотреть меню");
  if (wantsMenu) {
    highlightMenu();
    speakDemo("Меню перед тобой. Скажи название напитка или нажми на карточку.");
    return;
  }

  const wantsDetails =
    clean.includes("подробнее") ||
    clean.includes("расскажи про") ||
    clean.includes("что за") ||
    clean.includes("состав");
  if (wantsDetails) {
    const drinkForDetails = resolveDrinkName(phrase) || previewDrink || order.drink;
    const shownDrink = openDetailSheet(drinkForDetails);
    if (shownDrink) {
      const recipe = getDrinkRecipe(shownDrink);
      speakDemo(`${shownDrink}. ${recipe?.thesis || "Открываю карточку напитка."}`);
    } else {
      speakDemo("Меню перед тобой. Выбери напиток, и я открою подробную карточку.");
    }
    return;
  }

  const drink = findMenuValue(phrase, menu.drinks);
  const milk = findMenuValue(phrase, menu.milks);
  const syrup = findMenuValue(phrase, menu.syrups);

  if (drink) patch.drink = drink;
  if (milk) patch.milk = milk;
  if (syrup) patch.syrup = syrup;
  if (clean.includes("без сироп")) patch.syrup = "Без сиропа";
  if (clean.includes("без сах")) patch.sugar = "Без сахара";
  if (clean.includes("один сахар") || clean.includes("1 сахар")) patch.sugar = "1 ложка";
  if (clean.includes("два сах") || clean.includes("2 сах")) patch.sugar = "2 ложки";
  if (clean.includes("маленьк") || clean.includes(" размер s") || clean.includes(" эска")) patch.size = "S";
  if (clean.includes("средн") || clean.includes(" размер m") || clean.includes(" эмка")) patch.size = "M";
  if (clean.includes("больш") || clean.includes(" размер l") || clean.includes(" элька")) patch.size = "L";
  if (clean.includes("холод")) patch.temperature = "Холодный";
  if (clean.includes("тепл")) patch.temperature = "Теплый";
  if (clean.includes("горяч")) patch.temperature = "Горячий";

  const wantsConfirm = clean.includes("да") || clean.includes("подтверж") || clean.includes("буду пить");
  const milkReady = order.milk || (order.drink && !drinkNeedsMilk(order.drink));
  if (wantsConfirm && order.drink && order.size && milkReady && order.syrup) {
    updateOrder({ ...patch, status: "confirmed" });
    return;
  }

  updateOrder({ ...patch, status: "needs_clarification" });
  speakDemo(nextQuestion());
}

function startDemoListening() {
  if (!SpeechRecognition) {
    speakDemo("В этом браузере голосовое распознавание недоступно. Выбирай напиток тапом по меню.", "ГОЛОС ОФЛАЙН");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "ru-RU";
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onstart = () => setAssistantState("listening", "СЛУШАЮ");
  recognition.onerror = () => setAssistantState("idle", "НЕ РАССЛЫШАЛ");
  recognition.onend = () => {
    if (!window.speechSynthesis.speaking) {
      setAssistantState("idle", idleLabel());
    }
  };
  recognition.onresult = (event) => {
    const transcript = event.results[0]?.[0]?.transcript || "";
    elements.userLine.textContent = transcript ? `Ты: ${transcript}` : "Не удалось распознать фразу";
    parseDemoPhrase(transcript);
  };

  recognition.start();
}

/* ============================ Live AI (OpenAI Realtime, WebRTC) ============================ */

function sendRealtimeEvent(event) {
  if (dataChannel?.readyState === "open") {
    dataChannel.send(JSON.stringify(event));
  }
}

function sendToolResult(callId, result) {
  sendRealtimeEvent({
    type: "conversation.item.create",
    item: {
      type: "function_call_output",
      call_id: callId,
      output: JSON.stringify(result)
    }
  });
  sendRealtimeEvent({ type: "response.create" });
}

function handleToolCall(name, argsJson, callId) {
  try {
    const args = JSON.parse(argsJson || "{}");
    if (callId && handledToolCallIds.has(callId)) return;
    if (callId) handledToolCallIds.add(callId);

    if (name === "show_menu") {
      highlightMenu();
      setAssistantText("Меню перед тобой. Назови напиток или нажми на карточку.");
      if (callId) {
        sendToolResult(callId, {
          ok: true,
          visible: "menu",
          drinks: drinkCatalog.map((drink) => drink.name)
        });
      }
      return;
    }

    if (name === "show_drink_details") {
      const shownDrink = openDetailSheet(args.drink);
      if (!shownDrink) {
        if (callId) sendToolResult(callId, { ok: false, error: "Не найден напиток для подробной карточки" });
        return;
      }

      const recipe = getDrinkRecipe(shownDrink);
      setAssistantText(`${shownDrink}. ${recipe?.thesis || "Открываю карточку напитка."}`);
      if (callId) {
        sendToolResult(callId, {
          ok: true,
          visible: "drink_details",
          drink: shownDrink,
          type: recipe?.type,
          thesis: recipe?.thesis
        });
      }
      return;
    }

    if (name !== "update_order") return;

    updateOrder(args);
    if (args.assistant_message && appScreen === "select") setAssistantText(args.assistant_message);
    if (callId) sendToolResult(callId, { ok: true, order });
  } catch (error) {
    if (callId) sendToolResult(callId, { ok: false, error: error.message });
  }
}

function handleRealtimeEvent(event) {
  if (event.type === "input_audio_buffer.speech_started") {
    // Seamless voice entry: the user spoke on the welcome screen — move in.
    if (appScreen === "welcome") setScreen("select");
    setAssistantState("listening", "СЛУШАЮ");
  }

  if (event.type === "input_audio_buffer.speech_stopped") {
    setAssistantState("thinking", "ДУМАЮ");
  }

  if (event.type === "conversation.item.input_audio_transcription.completed") {
    if (appScreen === "welcome") setScreen("select");
    elements.userLine.textContent = `Ты: ${event.transcript}`;
  }

  if (event.type === "response.created" && appScreen === "select") {
    setAssistantText("");
  }

  if (event.type === "response.audio_transcript.delta" || event.type === "response.output_text.delta") {
    setAssistantState("speaking", "ГОВОРЮ");
    if (appScreen === "select") elements.assistantLine.textContent += event.delta || "";
    if (appScreen === "preparing") elements.prepLine.textContent += event.delta || "";
  }

  if (event.type === "response.audio_transcript.done" && event.transcript) {
    if (appScreen === "select") setAssistantText(event.transcript);
    if (appScreen === "preparing") elements.prepLine.textContent = event.transcript;
  }

  if (event.type === "response.done") {
    setAssistantState("idle", idleLabel());
  }

  if (event.type === "response.function_call_arguments.done") {
    handleToolCall(event.name, event.arguments, event.call_id);
  }

  const item = event.item;
  if (event.type === "response.output_item.done" && item?.type === "function_call") {
    handleToolCall(item.name, item.arguments, item.call_id);
  }
}

async function startLiveSession() {
  if (isLiveConnected) {
    sendRealtimeEvent({
      type: "response.create",
      response: {
        instructions: appScreen === "preparing"
          ? "Спроси, хочет ли пользователь поговорить о напитке, пока он готовится."
          : "Поприветствуй пользователя и начни прием заказа."
      }
    });
    return;
  }

  if (isLiveConnecting) return;
  isLiveConnecting = true;

  setAssistantState("thinking", "ПОДКЛЮЧАЮ");
  if (appScreen === "welcome") {
    elements.welcomeHint.textContent = "подключаю голосовой канал…";
  } else {
    setAssistantText("Подключаю голосовой канал…");
  }
  handledToolCallIds.clear();

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    peerConnection = new RTCPeerConnection();
    remoteAudio = new Audio();
    remoteAudio.autoplay = true;

    peerConnection.ontrack = (event) => {
      remoteAudio.srcObject = event.streams[0];
    };

    stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

    dataChannel = peerConnection.createDataChannel("oai-events");
    dataChannel.onopen = () => {
      isLiveConnected = true;
      liveFailed = false;
      setAssistantState("idle", idleLabel());
      if (appScreen === "welcome" && voiceEntryArmed) {
        elements.welcomeHint.textContent = "говори — я слушаю";
      }
      sendRealtimeEvent({
        type: "response.create",
        response: {
          instructions: "Поприветствуй пользователя как AI Barista DrinkX и спроси, что приготовить."
        }
      });
    };
    dataChannel.onmessage = (message) => {
      try {
        handleRealtimeEvent(JSON.parse(message.data));
      } catch {
        // Low-level realtime events can be ignored in this prototype.
      }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    const response = await fetch("/session", {
      method: "POST",
      headers: { "Content-Type": "application/sdp" },
      body: offer.sdp
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || response.statusText);
    }

    const answerSdp = await response.text();
    await peerConnection.setRemoteDescription({ type: "answer", sdp: answerSdp });
  } catch (error) {
    liveFailed = true;
    voiceEntryArmed = false;
    setAssistantState("idle", "ГОЛОС ОФЛАЙН");
    elements.enterVoiceButton.classList.remove("is-armed");
    if (appScreen === "welcome") {
      elements.welcomeHint.textContent = "голос не подключился — выбери напиток тапом";
    } else {
      setAssistantText("Голос офлайн. Выбирай напиток тапом — всё работает.");
    }
    elements.userLine.textContent = error.message;
  } finally {
    isLiveConnecting = false;
  }
}

/* ============================ Entry points ============================ */

function enterByTap() {
  setScreen("select");
  setAssistantState("idle", idleLabel());
  if (!isLiveConnected && !liveFailed) startLiveSession();
}

function enterByVoice() {
  voiceEntryArmed = true;
  elements.enterVoiceButton.classList.add("is-armed");
  if (isLiveConnected) {
    elements.welcomeHint.textContent = "говори — я слушаю";
    return;
  }
  startLiveSession();
}

/* ============================ Preparation & finish ============================ */

function burstConfetti() {
  const colors = ["#FFD700", "#FF1493", "#00CED1", "#32CD32", "#FF4E00"];
  for (let i = 0; i < 36; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty("--fall", `${(0.8 + Math.random() * 0.9).toFixed(2)}s`);
    piece.style.setProperty("--rot", `${Math.round(360 + Math.random() * 540)}deg`);
    elements.confettiLayer.appendChild(piece);
  }
  setTimeout(() => {
    elements.confettiLayer.innerHTML = "";
  }, 2000);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function renderTimer() {
  elements.timerValue.textContent = formatTime(secondsLeft);
  const elapsed = prepDurationSeconds - secondsLeft;
  const progress = Math.min(100, Math.max(0, Math.round((elapsed / prepDurationSeconds) * 100)));
  elements.timerProgress.style.width = `${progress}%`;
  elements.timerProgress.parentElement?.setAttribute("aria-valuenow", String(progress));
}

function startPreparation() {
  clearInterval(preparationTimer);
  secondsLeft = prepDurationSeconds;
  closeDetailSheet();
  burstConfetti();
  setScreen("preparing");
  elements.prepTitle.textContent = order.drink || "Начинаю готовить";
  elements.prepLine.textContent = "Хочешь, расскажу что-нибудь про напиток, или просто подождёшь?";
  renderOrder();
  renderTimer();
  if (isLiveConnected) {
    sendRealtimeEvent({
      type: "response.create",
      response: {
        instructions:
          "Скажи: Окей, начинаю готовить. Затем спроси, хочет ли пользователь что-нибудь узнать про напиток или просто подождать."
      }
    });
  } else {
    speakDemo("Окей, начинаю готовить. Хочешь, расскажу что-нибудь про напиток, или просто подождёшь?", "ГОТОВЛЮ");
  }

  preparationTimer = setInterval(() => {
    secondsLeft -= 1;
    renderTimer();
    if (secondsLeft <= 0) finishPreparation();
  }, 1000);
}

function finishPreparation() {
  clearInterval(preparationTimer);
  setScreen("ready");
  burstConfetti();
  renderOrder();
  if (isLiveConnected) {
    sendRealtimeEvent({
      type: "response.create",
      response: {
        instructions: "Скажи пользователю голосом: Твой напиток готов, можешь забрать."
      }
    });
  } else {
    speakDemo("Твой напиток готов. Можешь забрать.", "ГОТОВО");
  }
}

function resetOrder() {
  clearInterval(preparationTimer);
  order = { ...initialOrder };
  closeDetailSheet();
  renderOrder();
  elements.userLine.textContent = "Говори вслух — или тапай по меню. Можно одновременно.";
  setAssistantText("Что приготовить?");
  setAssistantState("idle", idleLabel());
  setScreen("select");
  if (isLiveConnected) {
    sendRealtimeEvent({
      type: "response.create",
      response: {
        instructions: "Пользователь сбросил заказ кнопкой. Скажи коротко, что начинаем заново, и спроси, какой напиток приготовить."
      }
    });
  }
}

function goBack() {
  if (appScreen === "preparing") {
    clearInterval(preparationTimer);
    updateOrder({ status: "ready_to_confirm" });
    setScreen("select");
    setAssistantText(`Вернулись к заказу: ${orderSummary()}. Подтверждаем?`);
    return;
  }

  if (appScreen === "ready") {
    resetOrder();
    return;
  }

  closeDetailSheet();
  setScreen("welcome");
}

function confirmOrder() {
  if (!order.drink) {
    speakDemo("Сначала скажи или выбери, какой напиток приготовить.");
    return;
  }

  updateOrder({
    size: order.size || "M",
    milk: order.milk || (drinkNeedsMilk(order.drink) ? "Обычное" : "Без молока"),
    syrup: order.syrup || "Без сиропа",
    status: "confirmed"
  });
}

/* ============================ Init & events ============================ */

function initTicker() {
  const names = drinkCatalog.map((drink) => drink.name.toUpperCase()).join(" ★ ");
  elements.tickerTrack.innerHTML = `<span>${escapeHtml(names)} ★ </span><span>${escapeHtml(names)} ★ </span>`;
}

elements.enterTapButton.addEventListener("click", enterByTap);
elements.enterVoiceButton.addEventListener("click", enterByVoice);
elements.backButton.addEventListener("click", goBack);
elements.resetButton.addEventListener("click", resetOrder);
elements.confirmButton.addEventListener("click", confirmOrder);
elements.newOrderButton.addEventListener("click", resetOrder);
elements.prepBackButton.addEventListener("click", goBack);

elements.voiceOrb.addEventListener("click", () => {
  if (isLiveConnected) return;
  if (liveFailed) {
    startDemoListening();
    return;
  }
  startLiveSession();
});

elements.prepTalkButton.addEventListener("click", () => {
  if (liveFailed && !isLiveConnected) {
    startDemoListening();
    return;
  }
  startLiveSession();
});

elements.menuGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-drink]");
  if (!card) return;
  card.classList.remove("is-tapped");
  void card.offsetWidth;
  card.classList.add("is-tapped");
  selectDrinkByTap(card.dataset.drink);
});

elements.detailClose.addEventListener("click", closeDetailSheet);
elements.detailSheet.addEventListener("click", (event) => {
  if (event.target === elements.detailSheet) closeDetailSheet();
});
elements.detailSelectButton.addEventListener("click", () => {
  if (previewDrink && previewDrink !== order.drink) {
    const chosen = previewDrink;
    updateOrder({ drink: chosen, status: "draft" });
    notifyAgentDrinkTapped(chosen);
  }
  closeDetailSheet();
});

initTicker();
renderMenuGrid();
renderOrder();
