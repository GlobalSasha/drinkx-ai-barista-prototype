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
const drinkProfiles = {
  "coffee-milk": {
    type: "Авторский кофейный напиток",
    thesis: "Кофейная база, молочная текстура и вкусовой слой DrinkX.",
    hasMilk: true,
    segments: [
      { label: "Кофейная база", percent: 22, color: "#ff8800" },
      { label: "Молочная текстура", percent: 58, color: "#fff6ea" },
      { label: "Авторский вкус", percent: 20, color: "#f4b35f" }
    ]
  },
  "cold-coffee": {
    type: "Холодный кофейный напиток",
    thesis: "Колдбрю или кофейная база с ярким фруктовым профилем.",
    hasMilk: false,
    segments: [
      { label: "Кофейная база", percent: 36, color: "#ff8800" },
      { label: "Фруктовый слой", percent: 44, color: "#ff4f00" },
      { label: "Ледяная база", percent: 20, color: "#4ea3ff" }
    ]
  },
  "tea-signature": {
    type: "Авторский чайный напиток",
    thesis: "Чайная основа, цветочный профиль и фруктовая нота.",
    hasMilk: false,
    segments: [
      { label: "Чайная база", percent: 48, color: "#8fcf5f" },
      { label: "Фруктовый слой", percent: 34, color: "#ff7a1a" },
      { label: "Ароматический профиль", percent: 18, color: "#f5a85c" }
    ]
  },
  "tea-hot": {
    type: "Горячий чайный напиток",
    thesis: "Пряная или ягодная чайная база для теплого профиля.",
    hasMilk: false,
    segments: [
      { label: "Чайная база", percent: 58, color: "#8fcf5f" },
      { label: "Ягодный слой", percent: 26, color: "#d84a4a" },
      { label: "Пряная нота", percent: 16, color: "#f5a85c" }
    ]
  },
  "iced-tea": {
    type: "Холодный чай",
    thesis: "Освежающий чайный напиток с фруктовой кислотностью.",
    hasMilk: false,
    segments: [
      { label: "Чайная база", percent: 44, color: "#8fcf5f" },
      { label: "Фруктовая база", percent: 38, color: "#ff4f00" },
      { label: "Лед", percent: 18, color: "#4ea3ff" }
    ]
  },
  lemonade: {
    type: "Авторский лимонад",
    thesis: "Газированная свежая база с ярким фруктовым вкусом.",
    hasMilk: false,
    segments: [
      { label: "Фруктовая база", percent: 42, color: "#ff7a1a" },
      { label: "Цитрус", percent: 24, color: "#f5d05c" },
      { label: "Газированная вода", percent: 34, color: "#4ea3ff" }
    ]
  },
  mors: {
    type: "Ягодный морс",
    thesis: "Ягодная основа, мягкая сладость и освежающий объем.",
    hasMilk: false,
    segments: [
      { label: "Ягодная база", percent: 54, color: "#d84a4a" },
      { label: "Вода", percent: 36, color: "#4ea3ff" },
      { label: "Сладость", percent: 10, color: "#f5a85c" }
    ]
  },
  "matcha-milk": {
    type: "Матча напиток",
    thesis: "Матча база и мягкая молочная текстура.",
    hasMilk: true,
    segments: [
      { label: "Матча база", percent: 34, color: "#8fcf5f" },
      { label: "Молочная текстура", percent: 56, color: "#fff6ea" },
      { label: "Финишный слой", percent: 10, color: "#f4b35f" }
    ]
  }
};

const drinkRecipes = {
  "Эспрессо": {
    type: "Кофейный концентрат",
    thesis: "Короткий плотный импульс без молока и сиропной базы.",
    hasMilk: false,
    segments: [{ label: "Кофейный концентрат", percent: 100, color: "#ff8800" }]
  },
  "Американо": {
    type: "Кофе + вода",
    thesis: "Концентрат раскрывается горячей водой, вкус остаётся чистым.",
    hasMilk: false,
    segments: [
      { label: "Кофейный концентрат", percent: 28, color: "#ff8800" },
      { label: "Горячая вода", percent: 72, color: "#4ea3ff" }
    ]
  },
  "Капучино": {
    type: "Классический молочный",
    thesis: "Кофейная база, плотная молочная текстура и высокая пена.",
    hasMilk: true,
    segments: [
      { label: "Кофейный концентрат", percent: 22, color: "#ff8800" },
      { label: "Молочная текстура", percent: 50, color: "#fff6ea" },
      { label: "Пена", percent: 28, color: "#d9c7b2" }
    ]
  },
  "Латте": {
    type: "Мягкий молочный",
    thesis: "Больше молока, меньше пены, спокойный кофейный профиль.",
    hasMilk: true,
    segments: [
      { label: "Кофейный концентрат", percent: 18, color: "#ff8800" },
      { label: "Молочная база", percent: 72, color: "#fff6ea" },
      { label: "Лёгкая пена", percent: 10, color: "#d9c7b2" }
    ]
  },
  "Раф": {
    type: "Сливочный авторский",
    thesis: "Кофе смешивается со сливочной молочной базой и мягкой сладостью.",
    hasMilk: true,
    segments: [
      { label: "Кофейный концентрат", percent: 16, color: "#ff8800" },
      { label: "Сливочная база", percent: 74, color: "#fff6ea" },
      { label: "Сладкий слой", percent: 10, color: "#f4b35f" }
    ]
  },
  "Матча латте": {
    type: "Матча + молоко",
    thesis: "Зелёная база матча и мягкое вспененное молоко.",
    hasMilk: true,
    segments: [
      { label: "Матча база", percent: 30, color: "#8fcf5f" },
      { label: "Молочная текстура", percent: 70, color: "#fff6ea" }
    ]
  },
  "Какао": {
    type: "Какао + молоко",
    thesis: "Шоколадная база, молочная текстура и мягкий тёплый профиль.",
    hasMilk: true,
    segments: [
      { label: "Какао база", percent: 32, color: "#7a5134" },
      { label: "Молочная текстура", percent: 68, color: "#fff6ea" }
    ]
  }
};

const elements = {
  appShell: document.querySelector(".app-shell"),
  introButton: document.querySelector("#introButton"),
  backButton: document.querySelector("#backButton"),
  stateLabel: document.querySelector("#stateLabel"),
  assistantLine: document.querySelector("#assistantLine"),
  userLine: document.querySelector("#userLine"),
  talkButton: document.querySelector("#talkButton"),
  resetButton: document.querySelector("#resetButton"),
  confirmButton: document.querySelector("#confirmButton"),
  prepTalkButton: document.querySelector("#prepTalkButton"),
  prepBackButton: document.querySelector("#prepBackButton"),
  newOrderButton: document.querySelector("#newOrderButton"),
  orderFlow: document.querySelector("#orderFlow"),
  prepOrderFlow: document.querySelector("#prepOrderFlow"),
  readyOrderFlow: document.querySelector("#readyOrderFlow"),
  menuBrowser: document.querySelector("#menuBrowser"),
  recipeBlueprint: document.querySelector("#recipeBlueprint"),
  prepRecipeBlueprint: document.querySelector("#prepRecipeBlueprint"),
  readyRecipeBlueprint: document.querySelector("#readyRecipeBlueprint"),
  prepTitle: document.querySelector("#prepTitle"),
  prepLine: document.querySelector("#prepLine"),
  timerValue: document.querySelector("#timerValue"),
  timerProgress: document.querySelector("#timerProgress"),
  modeButtons: document.querySelectorAll(".mode-button")
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

let mode = "live";
let appScreen = "intro";
let recognition = null;
let peerConnection = null;
let dataChannel = null;
let remoteAudio = null;
let isLiveConnected = false;
const handledToolCallIds = new Set();
let order = { ...initialOrder };
let orderHistory = [];
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

function setAssistantState(state, label) {
  elements.appShell.classList.toggle("is-listening", state === "listening");
  elements.appShell.classList.toggle("is-speaking", state === "speaking");
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
    color: "#ff4f00"
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
            <img src="/assets/drinks/${escapeHtml(drinkInfo.image)}" alt="${escapeHtml(order.drink)}" />
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
          <span class="recipe-kicker">X-Ray blueprint</span>
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
  const dialogHtml = elements.menuBrowser?.hidden === false && !previewDrink ? "" : buildRecipeBlueprint(previewDrink || order.drink);
  const activeOrderHtml = buildRecipeBlueprint(order.drink);

  if (elements.recipeBlueprint) {
    elements.recipeBlueprint.hidden = !dialogHtml;
    elements.recipeBlueprint.innerHTML = dialogHtml;
  }

  [elements.prepRecipeBlueprint, elements.readyRecipeBlueprint].forEach((element) => {
    if (!element) return;
    element.hidden = !activeOrderHtml;
    element.innerHTML = activeOrderHtml;
  });
}

function buildMenuBrowser() {
  const tiles = drinkCatalog
    .map((drink) => {
      const recipe = getDrinkRecipe(drink.name);
      return `
        <button class="menu-tile" type="button" data-drink="${escapeHtml(drink.name)}">
          <span class="menu-tile-image">
            <img src="/assets/drinks/${escapeHtml(drink.image)}" alt="${escapeHtml(drink.name)}" />
          </span>
          <span class="menu-tile-copy">
            <strong>${escapeHtml(drink.name)}</strong>
            <span>${escapeHtml(recipe?.type || "Напиток DrinkX")}</span>
          </span>
        </button>
      `;
    })
    .join("");

  return `
    <section class="menu-panel">
      <header class="menu-panel-head">
        <span class="recipe-kicker">DrinkX menu visual</span>
        <strong>Меню напитков</strong>
        <span>${drinkCatalog.length} позиций</span>
      </header>
      <div class="menu-grid">${tiles}</div>
    </section>
  `;
}

function showMenuBrowser() {
  previewDrink = null;
  elements.menuBrowser.hidden = false;
  elements.menuBrowser.innerHTML = buildMenuBrowser();
  elements.appShell.classList.add("has-menu-browser");
  elements.appShell.classList.remove("has-drink-card");
  renderRecipeBlueprints();
}

function hideMenuBrowser() {
  if (!elements.menuBrowser) return;
  elements.menuBrowser.hidden = true;
  elements.menuBrowser.innerHTML = "";
  elements.appShell.classList.remove("has-menu-browser");
}

function showDrinkDetails(drinkName) {
  const resolvedDrink = resolveDrinkName(drinkName) || previewDrink || order.drink;
  if (!resolvedDrink) {
    showMenuBrowser();
    return null;
  }

  previewDrink = resolvedDrink;
  hideMenuBrowser();
  elements.appShell.classList.add("has-drink-card");
  renderRecipeBlueprints();
  return resolvedDrink;
}

function buildChips() {
  const chips = [
    { key: "size", label: "Размер", value: order.size, icon: "SZ" },
    { key: "drink", label: "Напиток", value: order.drink, icon: "DR" },
    { key: "milk", label: "Молоко", value: order.milk, icon: "ML" },
    { key: "syrup", label: "Сироп", value: order.syrup, icon: "SY" },
    { key: "sugar", label: "Сахар", value: order.sugar, icon: "SG" },
    { key: "temperature", label: "Темп.", value: order.temperature, icon: "TP" }
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
  elements.appShell.classList.toggle("has-drink-card", Boolean(previewDrink || order.drink));
  elements.orderFlow.innerHTML = chips;
  elements.prepOrderFlow.innerHTML = chips;
  elements.readyOrderFlow.innerHTML = chips;
  renderRecipeBlueprints();
}

function updateOrder(patch = {}, options = {}) {
  const cleanedPatch = Object.fromEntries(
    Object.entries(patch).filter(([, value]) => value !== undefined && value !== "")
  );
  if (options.history !== false) orderHistory.push({ ...order });
  order = { ...order, ...cleanedPatch };
  if (cleanedPatch.drink) {
    previewDrink = null;
    hideMenuBrowser();
  }
  renderOrder();

  if (order.status === "confirmed" && appScreen !== "preparing" && appScreen !== "ready") {
    startPreparation();
  }
}

function speakDemo(text, nextLabel = "Ожидаю голос") {
  if (appScreen === "dialog") setAssistantText(text);
  if (appScreen === "preparing") elements.prepLine.textContent = text;
  setAssistantState("speaking", "Говорю");

  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ru-RU";
    utterance.rate = 1;
    utterance.onend = () => setAssistantState("idle", nextLabel);
    window.speechSynthesis.speak(utterance);
  } else {
    setTimeout(() => setAssistantState("idle", nextLabel), 1200);
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
  elements.userLine.textContent = `Вы: ${phrase}`;

  if (clean.includes("ничего") || clean.includes("не надо") || clean.includes("ждать")) {
    speakDemo("Хорошо. Я просто покажу таймер и сообщу, когда напиток будет готов.", "Готовлю");
    return;
  }

  speakDemo("Могу рассказать про состав напитка или просто продолжить таймер. Пока готовлю.", "Готовлю");
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
    showMenuBrowser();
    speakDemo("Показываю меню DrinkX. Можешь сказать название напитка или попросить подробнее про любой из них.");
    return;
  }

  const wantsDetails =
    clean.includes("подробнее") ||
    clean.includes("расскажи про") ||
    clean.includes("что за") ||
    clean.includes("состав");
  if (wantsDetails) {
    const drinkForDetails = resolveDrinkName(phrase) || previewDrink || order.drink;
    const shownDrink = showDrinkDetails(drinkForDetails);
    if (shownDrink) {
      const recipe = getDrinkRecipe(shownDrink);
      speakDemo(`${shownDrink}. ${recipe?.thesis || "Открываю карточку напитка."}`);
    } else {
      speakDemo("Показываю меню. Выбери напиток, и я открою подробную карточку.");
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
    speakDemo("В этом браузере голосовое распознавание недоступно. Подключите Live AI или используйте браузер с Web Speech.", "Не расслышал");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "ru-RU";
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onstart = () => setAssistantState("listening", "Слушаю");
  recognition.onerror = () => setAssistantState("idle", "Не расслышал");
  recognition.onend = () => {
    if (!window.speechSynthesis.speaking) {
      setAssistantState("idle", appScreen === "preparing" ? "Готовлю" : "Ожидаю голос");
    }
  };
  recognition.onresult = (event) => {
    const transcript = event.results[0]?.[0]?.transcript || "";
    elements.userLine.textContent = transcript ? `Вы: ${transcript}` : "Не удалось распознать фразу";
    parseDemoPhrase(transcript);
  };

  recognition.start();
}

function startIntro() {
  elements.introButton.disabled = true;
  setAssistantState("thinking", "Инициализация");
  setTimeout(() => {
    setScreen("dialog");
    setAssistantText("Подключаю голосовой канал...");
    setAssistantState("thinking", "Подключаю Live AI");
    startLiveSession().finally(() => {
      elements.introButton.disabled = false;
    });
  }, 1200);
}

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
      showMenuBrowser();
      setAssistantText("Показываю меню DrinkX. Можешь попросить подробнее про любой напиток.");
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
      const shownDrink = showDrinkDetails(args.drink);
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
    if (args.assistant_message && appScreen === "dialog") setAssistantText(args.assistant_message);
    if (callId) sendToolResult(callId, { ok: true, order });
  } catch (error) {
    if (callId) sendToolResult(callId, { ok: false, error: error.message });
  }
}

function handleRealtimeEvent(event) {
  if (event.type === "input_audio_buffer.speech_started") {
    setAssistantState("listening", "Слушаю");
  }

  if (event.type === "input_audio_buffer.speech_stopped") {
    setAssistantState("thinking", "Думаю");
  }

  if (event.type === "conversation.item.input_audio_transcription.completed") {
    elements.userLine.textContent = `Вы: ${event.transcript}`;
  }

  if (event.type === "response.created" && appScreen === "dialog") {
    setAssistantText("");
  }

  if (event.type === "response.audio_transcript.delta" || event.type === "response.output_text.delta") {
    setAssistantState("speaking", "Говорю");
    if (appScreen === "dialog") elements.assistantLine.textContent += event.delta || "";
    if (appScreen === "preparing") elements.prepLine.textContent += event.delta || "";
  }

  if (event.type === "response.audio_transcript.done" && event.transcript) {
    if (appScreen === "dialog") setAssistantText(event.transcript);
    if (appScreen === "preparing") elements.prepLine.textContent = event.transcript;
  }

  if (event.type === "response.done") {
    setAssistantState("idle", appScreen === "preparing" ? "Готовлю" : "Ожидаю голос");
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

  setAssistantState("thinking", "Подключаю Live AI");
  setAssistantText("Подключаю голосовой канал...");
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
      setAssistantState("idle", "Live AI подключен");
      sendRealtimeEvent({
        type: "response.create",
        response: {
          instructions: "Поприветствуй пользователя как DrinkX AI Coffee System и спроси, что приготовить."
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
    setAssistantState("idle", "Live AI не подключен");
    setAssistantText("Live AI не запустился. Проверьте ключ OpenAI и доступ к микрофону.");
    elements.userLine.textContent = error.message;
  }
}

function stopLiveSession() {
  dataChannel?.close();
  peerConnection?.getSenders().forEach((sender) => sender.track?.stop());
  peerConnection?.close();
  peerConnection = null;
  dataChannel = null;
  isLiveConnected = false;
  handledToolCallIds.clear();
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
  setScreen("preparing");
  elements.prepTitle.textContent = order.drink ? `Готовлю ${order.drink}` : "Начинаю готовить";
  elements.prepLine.textContent = "Хочешь, расскажу что-нибудь про напиток, или просто подождёшь?";
  renderOrder();
  renderTimer();
  if (mode === "live" && isLiveConnected) {
    sendRealtimeEvent({
      type: "response.create",
      response: {
        instructions:
          "Скажи: Окей, начинаю готовить. Затем спроси, хочет ли пользователь что-нибудь узнать про напиток или просто подождать."
      }
    });
  } else {
    speakDemo("Окей, начинаю готовить. Хочешь, расскажу что-нибудь про напиток, или просто подождёшь?", "Готовлю");
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
  renderOrder();
  if (mode === "live" && isLiveConnected) {
    sendRealtimeEvent({
      type: "response.create",
      response: {
        instructions: "Скажи пользователю голосом: Твой напиток готов, можешь забрать."
      }
    });
  } else {
    speakDemo("Твой напиток готов. Можешь забрать.", "Готово");
  }
}

function resetOrder() {
  clearInterval(preparationTimer);
  order = { ...initialOrder };
  orderHistory = [];
  renderOrder();
  elements.userLine.textContent = "Скажите заказ свободным языком";
  setAssistantText("Привет. Что ты сегодня желаешь?");
  setAssistantState("idle", "Ожидаю голос");
  setScreen("dialog");
}

function goBack() {
  if (appScreen === "preparing") {
    clearInterval(preparationTimer);
    updateOrder({ status: "ready_to_confirm" }, { history: false });
    setScreen("dialog");
    setAssistantText(`Вернулись к заказу: ${orderSummary()}. Подтверждаем?`);
    return;
  }

  if (appScreen === "ready") {
    resetOrder();
    return;
  }

  const previous = orderHistory.pop();
  if (previous) {
    order = previous;
    renderOrder();
    setAssistantText(nextQuestion());
    return;
  }

  setScreen("intro");
}

function setMode(nextMode) {
  mode = nextMode;
  elements.modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });

  if (mode === "demo") {
    stopLiveSession();
    setAssistantText("Демо-линия активна. Нажмите “Говорить”.");
  } else {
    setAssistantText("Голосовой канал готов к подключению.");
  }
}

function confirmOrder() {
  if (!order.drink) {
    speakDemo("Сначала скажи, какой напиток приготовить.");
    return;
  }

  updateOrder({
    size: order.size || "M",
    milk: order.milk || (drinkNeedsMilk(order.drink) ? "Обычное" : "Без молока"),
    syrup: order.syrup || "Без сиропа",
    status: "confirmed"
  });
}

function initUplinkCanvas() {
  const canvas = document.querySelector("#uplinkCanvas");
  if (!canvas) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gl = canvas.getContext("webgl", { alpha: true, antialias: false });
  if (!gl) return;

  const vertexSource = `
    attribute vec2 a_position;

    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentSource = `
    precision highp float;

    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;

    void main() {
      vec2 st = gl_FragCoord.xy / u_resolution.xy;
      st.x *= u_resolution.x / u_resolution.y;
      vec2 mouseOffset = (u_mouse / u_resolution) - 0.5;
      st += mouseOffset * 0.025;
      float ratio = u_resolution.x / u_resolution.y;
      vec2 center = vec2(0.5 * ratio, 0.52);
      float centerDistance = distance(st, center);
      float edgeEnergy = smoothstep(0.18, 0.82, centerDistance);
      float softDepth = smoothstep(0.98, 0.10, centerDistance);
      float protectedCenter = 1.0 - smoothstep(0.18, 0.36, centerDistance);
      float grid = mix(48.0, 78.0, smoothstep(480.0, 1600.0, u_resolution.x));
      vec2 cell = fract(st * grid) - 0.5;
      float dot = 1.0 - smoothstep(0.025, 0.072, length(cell));
      float scan = 0.72 + 0.28 * sin((st.y * 120.0) + (u_time * 0.7));
      float pulse = 0.58 + 0.42 * sin(u_time * 0.65);
      vec3 color = mix(vec3(1.0, 0.533, 0.0), vec3(0.70, 1.0, 0.44), 0.16);
      float alpha = dot * softDepth * scan * (0.06 + 0.25 * pulse) * mix(0.22, 1.0, edgeEnergy);
      alpha *= (1.0 - protectedCenter * 0.82);
      gl_FragColor = vec4(color, alpha);
    }
  `;

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) return;

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );

  const positionLocation = gl.getAttribLocation(program, "a_position");
  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const timeLocation = gl.getUniformLocation(program, "u_time");
  const mouseLocation = gl.getUniformLocation(program, "u_mouse");
  const mouse = { x: canvas.clientWidth / 2, y: canvas.clientHeight / 2 };

  function resize() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width * pixelRatio));
    const height = Math.max(1, Math.floor(rect.height * pixelRatio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  function render(time = 0) {
    resize();
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(timeLocation, time * 0.001);
    gl.uniform2f(mouseLocation, mouse.x, canvas.clientHeight - mouse.y);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if (!reducedMotion) requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  });

  render();
}

elements.introButton.addEventListener("click", startIntro);
elements.backButton.addEventListener("click", goBack);
elements.prepBackButton.addEventListener("click", goBack);
elements.newOrderButton.addEventListener("click", resetOrder);
elements.resetButton.addEventListener("click", resetOrder);
elements.confirmButton.addEventListener("click", confirmOrder);
elements.talkButton.addEventListener("click", () => {
  startLiveSession();
});
elements.prepTalkButton.addEventListener("click", () => {
  startLiveSession();
});
elements.menuBrowser?.addEventListener("click", (event) => {
  const tile = event.target.closest("[data-drink]");
  if (!tile) return;
  const shownDrink = showDrinkDetails(tile.dataset.drink);
  if (!shownDrink) return;

  const recipe = getDrinkRecipe(shownDrink);
  setAssistantText(`${shownDrink}. ${recipe?.thesis || "Открываю карточку напитка."}`);
});

initUplinkCanvas();
renderOrder();
