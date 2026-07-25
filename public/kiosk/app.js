const app = document.querySelector("#app");
const DESIGN_WIDTH = 800;
const DESIGN_HEIGHT = 1280;
let fitFrame = null;

const categories = [
  ["popular", "Популярное", "icon-star.svg", "icon-popular.svg"],
  ["coffee", "Кофе", "icon-coffee.svg", "icon-coffee.svg"],
  ["tea", "Чай", "icon-tea.svg", "icon-tea.svg"],
  ["cold", "Холодные", "icon-snow.svg", "icon-snow.svg"],
  ["lemonade", "Лимонад", "icon-glass.svg", "icon-glass.svg"],
  ["milk", "Молочные", "icon-milk.svg", "icon-milk.svg"],
  ["alternative", "Альтернатива", "icon-leaf.svg", "icon-leaf.svg"],
];

const drinks = [
  {
    id: "raf",
    name: "Раф",
    categories: ["popular", "coffee", "milk"],
    image: "drink-raf.png",
    tags: ["350 мл", "Кофе", "Карамель"],
    details: ["Молоко: Обычное", "Сироп: Карамельный", "Сахар: 1 ложка"],
    warning: "КОНЧАЕТСЯ СЫРЬЕ",
  },
  {
    id: "americano",
    name: "Американо",
    categories: ["popular", "coffee"],
    image: "drink-americano.png",
    tags: ["350 мл", "Кофе", "Вода"],
    details: ["Молоко: Безлактозное", "Сироп: Банановый", "Сахар: 2 ложки"],
  },
  {
    id: "latte",
    name: "Латте",
    categories: ["popular", "coffee", "milk"],
    image: "drink-latte.png",
    tags: ["350 мл", "Кофе", "Молоко"],
    details: ["Молоко: Обычное", "Без сиропа", "Без сахара"],
  },
  {
    id: "banoffee",
    name: "Баноффи",
    categories: ["popular", "coffee", "milk"],
    image: "drink-banoffee.png",
    tags: ["350 мл", "Кофе", "Банан"],
    details: ["Молоко: Обычное", "Сироп: Банановый", "Сахар: 1 ложка"],
  },
  {
    id: "flat",
    name: "Флэт уайт",
    categories: ["popular", "coffee", "milk"],
    image: "drink-flat-white.png",
    tags: ["250 мл", "Кофе", "Молоко"],
    details: ["Молоко: Обычное", "Без сиропа", "Без сахара"],
  },
  {
    id: "emerald",
    name: "Изумрудный",
    categories: ["popular", "tea", "milk", "alternative"],
    image: "drink-emerald.png",
    tags: ["350 мл", "Матча", "Молоко"],
    details: ["Молоко: Овсяное", "Сироп: Кокосовый", "Без сахара"],
    disabled: true,
  },
  {
    id: "crunch",
    name: "Кранч",
    categories: ["popular", "coffee", "milk"],
    image: "drink-crunch.png",
    tags: ["350 мл", "Кофе", "Орех"],
    details: ["Молоко: Миндальное", "Сироп: Фундук", "Сахар: 1 ложка"],
  },
  {
    id: "lungo",
    name: "Лунго",
    categories: ["popular", "coffee"],
    image: "drink-lungo.png",
    tags: ["250 мл", "Кофе", "Вода"],
    details: ["Без молока", "Без сиропа", "Без сахара"],
  },
  {
    id: "cappuccino",
    name: "Капучино",
    categories: ["popular", "coffee", "milk"],
    image: "hero-base.png",
    tags: ["350 мл", "Кофе", "Пена"],
    details: ["Молоко: Обычное", "Без сиропа", "Без сахара"],
  },
];

const configSections = [
  {
    key: "volume",
    label: "ОБЪЕМ",
    items: ["250 мл", "350 мл", "450 мл"],
  },
  {
    key: "portions",
    label: "ПОРЦИИ",
    items: ["1", "2", "3"],
  },
  {
    key: "milk",
    label: "МОЛОКО",
    items: [
      "Обычное",
      "Безлакт.",
      { value: "Овсяное", badge: "1 ПОРЦИЯ" },
      "Кокос",
      { value: "Миндаль", badge: "НЕТ", unavailable: true },
      "Соевое",
    ],
  },
  {
    key: "syrup",
    label: "СИРОП",
    items: [
      "Нет",
      { value: "Ваниль", badge: "1" },
      { value: "Карамель", badge: "НЕТ", unavailable: true },
      { value: "Кокос", badge: "НЕТ", unavailable: true },
      { value: "Миндаль", badge: "НЕТ", unavailable: true },
      "Фундук",
      { value: "Банан", badge: "1" },
      "Клубника",
      { value: "Лаванда", badge: "5" },
      "Шоколад",
    ],
  },
  {
    key: "sugar",
    label: "САХАР",
    items: ["Нет", "1 ложка", "2 ложки", "3 ложки"],
  },
];

const state = {
  screen: "menu",
  transition: "initial",
  transitioning: false,
  category: "popular",
  drink: drinks[1],
  config: {
    volume: "350 мл",
    portions: "2",
    milk: "Безлакт.",
    syrup: "Банан",
    sugar: "2 ложки",
  },
  lateSyrup: null,
  countdown: 0,
  countdownMax: 0,
  timer: null,
  recipe: "Американо",
  allRecipes: false,
};

function icon(name) {
  return `./assets/${name}`;
}

function clearTimer() {
  if (state.timer) {
    window.clearInterval(state.timer);
    state.timer = null;
  }
}

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function fitAppToViewport() {
  const viewportWidth = window.visualViewport?.width || window.innerWidth;
  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  const safeGap = Math.min(12, Math.min(viewportWidth, viewportHeight) * 0.012);
  const scale = Math.max(
    0.05,
    Math.min(
      1,
      (viewportWidth - safeGap * 2) / DESIGN_WIDTH,
      (viewportHeight - safeGap * 2) / DESIGN_HEIGHT,
    ),
  );

  app.style.setProperty("--app-scale", scale.toFixed(5));
  app.style.setProperty("--app-fitted-width", `${(DESIGN_WIDTH * scale).toFixed(2)}px`);
  app.style.setProperty("--app-fitted-height", `${(DESIGN_HEIGHT * scale).toFixed(2)}px`);
  app.dataset.fit = scale < 0.999 ? "scaled" : "native";
}

function scheduleAppFit() {
  if (fitFrame) window.cancelAnimationFrame(fitFrame);
  fitFrame = window.requestAnimationFrame(() => {
    fitFrame = null;
    fitAppToViewport();
  });
}

function transitionFor(from, to) {
  if (to === "error" || to === "stock-insufficient") return "alert";
  if (to === "finished" || to === "cleaning-complete") return "success";
  if (to.includes("pour") || to.includes("rinse") || to === "cleaning-running") return "flow";
  if (to === "menu" || (to === "service" && from !== "menu")) return "back";
  return "forward";
}

function commitScreen(screen, transition) {
  state.screen = screen;
  state.transition = transition;
  render();
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function go(screen, options = {}) {
  if (!screen || state.transitioning || screen === state.screen) return;
  clearTimer();
  const transition = options.transition || transitionFor(state.screen, screen);
  const view = app.querySelector(".screen-view");

  if (reducedMotionQuery.matches || !view) {
    commitScreen(screen, transition);
    return;
  }

  state.transitioning = true;
  app.dataset.transition = transition;
  view.classList.add("is-leaving");

  window.setTimeout(() => {
    commitScreen(screen, transition);
    window.setTimeout(() => {
      state.transitioning = false;
    }, 420);
  }, 230);
}

function morphToConfigure(control) {
  if (state.transitioning || reducedMotionQuery.matches) {
    go("configure", { transition: "forward" });
    return;
  }

  const hero = control.querySelector(".drink-hero");
  const currentView = app.querySelector(".screen-view");
  if (!hero || !currentView || typeof hero.animate !== "function") {
    go("configure", { transition: "forward" });
    return;
  }

  clearTimer();
  state.transitioning = true;
  const heroRect = hero.getBoundingClientRect();
  const appRect = app.getBoundingClientRect();
  const clone = hero.cloneNode(true);
  const targetHeight = 126 * (appRect.height / 1280);

  clone.classList.add("drink-morph");
  Object.assign(clone.style, {
    left: `${heroRect.left}px`,
    top: `${heroRect.top}px`,
    width: `${heroRect.width}px`,
    height: `${heroRect.height}px`,
  });
  document.body.append(clone);

  clone.querySelectorAll("h2, .drink-image").forEach((element, index) => {
    element.animate(
      [
        { opacity: 1, filter: "blur(0px)", transform: "translateY(0) scale(1)" },
        {
          opacity: 0,
          filter: "blur(8px)",
          transform: `translateY(${-18 - index * 8}px) scale(.72)`,
        },
      ],
      {
        duration: 500,
        delay: index * 35,
        easing: "cubic-bezier(.4,0,.2,1)",
        fill: "forwards",
      },
    );
  });

  currentView.animate(
    [
      { opacity: 1, transform: "scale(1)", filter: "blur(0px)" },
      { opacity: 0.16, transform: "scale(0.965)", filter: "blur(12px)" },
    ],
    { duration: 470, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" },
  );

  const morphAnimation = clone.animate(
    [
      {
        left: `${heroRect.left}px`,
        top: `${heroRect.top}px`,
        width: `${heroRect.width}px`,
        height: `${heroRect.height}px`,
        borderRadius: `${32 * (appRect.width / 800)}px`,
        opacity: 1,
        filter: "brightness(1)",
      },
      {
        left: `${appRect.left}px`,
        top: `${appRect.top}px`,
        width: `${appRect.width}px`,
        height: `${targetHeight}px`,
        borderRadius: `0 0 ${34 * (appRect.width / 800)}px ${34 * (appRect.width / 800)}px`,
        opacity: 0.96,
        filter: "brightness(1.08)",
        offset: 0.7,
      },
      {
        left: `${appRect.left}px`,
        top: `${appRect.top}px`,
        width: `${appRect.width}px`,
        height: `${targetHeight}px`,
        borderRadius: `0 0 ${34 * (appRect.width / 800)}px ${34 * (appRect.width / 800)}px`,
        opacity: 0,
        filter: "brightness(1.12)",
      },
    ],
    { duration: 720, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" },
  );

  window.setTimeout(() => {
    commitScreen("configure", "morph");
  }, 340);

  morphAnimation.finished.finally(() => {
    clone.remove();
    state.transitioning = false;
  });
}

function switchCategory(control) {
  const nextCategory = control.dataset.category;
  if (!nextCategory || nextCategory === state.category || state.transitioning) return;

  const grid = app.querySelector(".drink-grid");
  state.transitioning = true;
  grid?.classList.add("is-filtering-out");

  window.setTimeout(
    () => {
      state.category = nextCategory;
      state.transition = "category";
      render();
      window.requestAnimationFrame(() => {
        document.querySelector(".category-button.is-active")?.scrollIntoView({
          behavior: reducedMotionQuery.matches ? "auto" : "smooth",
          block: "nearest",
          inline: "center",
        });
      });
      window.setTimeout(() => {
        state.transitioning = false;
      }, 360);
    },
    reducedMotionQuery.matches ? 0 : 150,
  );
}

function selectOption(control) {
  const group = control.closest(".option-list");
  const previous = group?.querySelector(".option-button.is-active");
  previous?.classList.remove("is-active");
  previous?.setAttribute("aria-pressed", "false");

  control.classList.add("is-active");
  control.setAttribute("aria-pressed", "true");
  state.config[control.dataset.key] = control.dataset.value;

  if (control.dataset.key === "portions") {
    const badge = app.querySelector(".portion-badge");
    if (badge) badge.textContent = control.dataset.value;
  }

  if (!reducedMotionQuery.matches && typeof control.animate === "function") {
    control.animate(
      [
        { transform: "scale(.92)", filter: "brightness(.85)" },
        { transform: "scale(1.07)", filter: "brightness(1.2)", offset: 0.56 },
        { transform: "scale(1)", filter: "brightness(1)" },
      ],
      { duration: 520, easing: "cubic-bezier(.16,1,.3,1)" },
    );
  }
}

function addTapRipple(event) {
  if (reducedMotionQuery.matches) return;
  const button = event.target.closest("button:not(.drink-card)");
  if (!button) return;

  const rect = button.getBoundingClientRect();
  const scaleX = button.offsetWidth / rect.width;
  const scaleY = button.offsetHeight / rect.height;
  const ripple = document.createElement("span");
  ripple.className = "tap-ripple";
  ripple.style.left = `${(event.clientX - rect.left) * scaleX}px`;
  ripple.style.top = `${(event.clientY - rect.top) * scaleY}px`;
  button.classList.add("motion-ripple-host");
  button.append(ripple);
  ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
}

function closeButton(target = "menu") {
  return `
    <button class="close-button" type="button" data-action="go" data-target="${target}" aria-label="Закрыть">
      <span aria-hidden="true"></span>
    </button>`;
}

function plainHeader(title, target = "service") {
  return `
    <header class="flow-header flow-header--plain">
      <h1>${title}</h1>
      ${closeButton(target)}
    </header>`;
}

const syrupDisplayNames = {
  Ваниль: "Ванильный",
  Карамель: "Карамельный",
  Кокос: "Кокосовый",
  Миндаль: "Миндальный",
  Фундук: "Фундучный",
  Банан: "Банановый",
  Клубника: "Клубничный",
  Лаванда: "Лавандовый",
  Шоколад: "Шоколадный",
};

function syrupDisplayName(value) {
  if (!value || value === "Нет") return "Нет";
  return syrupDisplayNames[value] || value;
}

function syrupSummary() {
  const configured = syrupDisplayName(state.config.syrup);
  const added = syrupDisplayName(state.lateSyrup);

  if (!state.lateSyrup) return configured;
  return configured === "Нет" ? added : `${configured} + ${added}`;
}

function drinkHeader({ compact = false } = {}) {
  const drink = state.drink;
  const milk = state.config.milk === "Безлакт." ? "Безлактозное" : state.config.milk;
  return `
    <header class="flow-header ${compact ? "flow-header--compact" : ""}">
      <div class="flow-title">
        <span class="portion-badge">${state.config.portions}</span>
        <h1>${drink.name}</h1>
      </div>
      ${closeButton("menu")}
      ${
        compact
          ? ""
          : `
        <div class="drink-summary">
          <img src="${icon(drink.image)}" alt="${drink.name}" />
          <div class="summary-copy">
            <div class="summary-tags">
              <strong>${state.config.volume}</strong><strong>Кофе</strong><strong>Вода</strong>
            </div>
            <p>Молоко: ${milk}</p>
            <p data-syrup-summary>Сироп: ${syrupSummary()}</p>
            <p>Сахар: ${state.config.sugar}</p>
          </div>
        </div>`
      }
    </header>`;
}

function actionBar(label, action, { danger = false, target = "" } = {}) {
  return `
    <button class="action-bar ${danger ? "action-bar--danger" : ""}" type="button"
      data-action="${action}" ${target ? `data-target="${target}"` : ""}>
      ${label}
    </button>`;
}

function renderMenu() {
  const selectedCategory = categories.find(([id]) => id === state.category) || categories[0];
  const visibleDrinks = drinks.filter((drink) => drink.categories.includes(state.category));
  return `
    <header class="screen-header">
      <div class="title-row">
        <div class="title-group">
          <img class="title-icon" src="${icon(selectedCategory[3])}" alt="" />
          <h1>${selectedCategory[1]}</h1>
        </div>
        <button class="service-button" type="button" data-action="go" data-target="service" aria-label="Открыть сервисное меню">
          <img src="${icon("icon-service.svg")}" alt="" />
        </button>
      </div>
      <nav class="category-list" aria-label="Категории напитков">
        ${categories
          .map(
            ([id, label, image]) => `
            <button class="category-button ${id === state.category ? "is-active" : ""}" type="button"
              data-action="category" data-category="${id}" ${id === state.category ? 'aria-current="page"' : ""}>
              <img src="${icon(image)}" alt="" />
              <span>${label}</span>
            </button>`,
          )
          .join("")}
      </nav>
    </header>
    <section class="drink-grid ${visibleDrinks.length ? "" : "drink-grid--empty"}" aria-label="Напитки">
      ${
        visibleDrinks.length
          ? visibleDrinks
              .map(
          (drink, index) => `
          <button class="drink-card ${drink.disabled ? "is-disabled" : ""}" type="button"
            data-action="${drink.disabled ? "unavailable-drink" : "choose-drink"}" data-drink="${drink.id}"
            style="--card-delay:${80 + index * 58}ms">
            ${drink.warning ? `<span class="stock-warning">${drink.warning}</span>` : ""}
            <div class="drink-hero">
              <h2 class="${drink.name.length > 9 ? "long-title" : ""}">${drink.name}</h2>
              <img class="drink-image" src="${icon(drink.image)}" alt="${drink.name}" />
            </div>
            <div class="drink-params">
              <div class="main-params">${drink.tags.map((tag) => `<strong>${tag}</strong>`).join("")}</div>
              <img class="add-icon" src="${icon("icon-add.svg")}" alt="" />
              <ul>
                ${drink.details
                  .map(
                    (detail, index) =>
                      `<li class="${detail.startsWith("Без") ? "muted" : ""}">${detail}${
                        drink.warning && index === 1 ? '<span class="count-badge">4</span>' : ""
                      }</li>`,
                  )
                  .join("")}
              </ul>
            </div>
          </button>`,
              )
              .join("")
          : `
            <div class="empty-category">
              <span aria-hidden="true">•••</span>
              <h2>В ЭТОЙ КАТЕГОРИИ<br />ПОКА НЕТ НАПИТКОВ</h2>
              <p>Выберите другую категорию</p>
            </div>`
      }
    </section>
    <img class="screen-corners" src="${icon("corners.svg")}" alt="" />`;
}

function renderConfigure() {
  return `
    ${drinkHeader({ compact: true })}
    <section class="config-panel" aria-label="Настройка напитка">
      ${configSections
        .map(
          (section, index) => `
          <fieldset class="option-group" style="--group-delay:${90 + index * 72}ms">
            <legend>${section.label}</legend>
            <div class="option-list">
              ${section.items
                .map((raw) => {
                  const item = typeof raw === "string" ? { value: raw } : raw;
                  const active = state.config[section.key] === item.value;
                  return `
                    <button class="option-button ${item.badge ? "has-badge" : ""} ${active ? "is-active" : ""} ${item.unavailable ? "is-unavailable" : ""}"
                      type="button" data-action="option" data-key="${section.key}" data-value="${item.value}"
                      ${item.unavailable ? `data-unavailable="${item.value}"` : ""}
                      aria-pressed="${active}" ${item.unavailable ? `aria-label="${item.value}, недоступно"` : ""}>
                      <span class="option-label">${item.value}</span>
                      ${item.badge ? `<span class="option-badge">${item.badge}</span>` : ""}
                    </button>`;
                })
                .join("")}
            </div>
          </fieldset>`,
        )
        .join("")}
    </section>
    ${actionBar("СТАРТ", "start-drink")}`;
}

function liquidStage({ label, hint, percent = 56, time = state.countdown, title = "" }) {
  const bubbles = Array.from(
    { length: 10 },
    (_, index) =>
      `<i style="--bubble-left:${5 + index * 9.2}%;--bubble-duration:${2500 + index * 90}ms;--bubble-delay:${index * -310}ms"></i>`,
  ).join("");
  return `
    <section class="liquid-stage" style="--liquid-level:${percent}%">
      <div class="liquid-copy">
        ${
          time !== ""
            ? `<div class="timer-chip">
                <strong class="timer-value">${time} СЕК</strong>
                <i aria-hidden="true"></i>
              </div>`
            : '<strong class="process-kicker">ПРОМЫВКА</strong>'
        }
        <span>${hint}</span>
      </div>
      <div class="liquid-fill liquid-fill--back" aria-hidden="true"></div>
      <div class="liquid-fill liquid-fill--middle" aria-hidden="true"></div>
      <div class="liquid-fill liquid-fill--front" aria-hidden="true"></div>
      <div class="liquid-bubbles" aria-hidden="true">${bubbles}</div>
      <div class="liquid-shine" aria-hidden="true"></div>
      <h2>${title || label}</h2>
    </section>`;
}

function renderLateSyrupControl() {
  const syrupSection = configSections.find((section) => section.key === "syrup");
  const availableSyrups = syrupSection.items
    .map((raw) => (typeof raw === "string" ? { value: raw } : raw))
    .filter((item) => item.value !== "Нет" && !item.unavailable);

  return `
    <button class="late-syrup-trigger ${state.lateSyrup ? "is-added" : ""}" type="button"
      data-action="toggle-late-syrup" aria-expanded="false" aria-controls="late-syrup-sheet">
      <span class="late-syrup-plus" aria-hidden="true">${state.lateSyrup ? "✓" : "+"}</span>
      <span class="late-syrup-trigger-copy">
        <small>${state.lateSyrup ? "СИРОП УЖЕ ДОБАВЛЕН" : "ЗАБЫЛИ ДОБАВИТЬ?"}</small>
        <strong>${state.lateSyrup ? state.lateSyrup : "ДОБАВИТЬ СИРОП"}</strong>
      </span>
      <span class="late-syrup-arrow" aria-hidden="true">↑</span>
    </button>
    <button class="late-syrup-backdrop" type="button" data-action="close-late-syrup"
      aria-label="Закрыть выбор сиропа" tabindex="-1"></button>
    <section class="late-syrup-sheet" id="late-syrup-sheet" aria-hidden="true"
      aria-label="Добавить сироп во время приготовления" inert>
      <header>
        <div>
          <p>ТАЙМЕР ПРОДОЛЖАЕТСЯ</p>
          <h2>ВЫБЕРИТЕ СИРОП</h2>
        </div>
        <button type="button" data-action="close-late-syrup" aria-label="Закрыть">
          <span aria-hidden="true">×</span>
        </button>
      </header>
      <div class="late-syrup-list">
        ${availableSyrups
          .map(
            (item) => `
              <button class="${state.lateSyrup === item.value ? "is-selected" : ""}" type="button"
                data-action="select-late-syrup" data-value="${item.value}"
                aria-label="Добавить сироп ${item.value}${item.badge ? `, осталось ${item.badge}` : ""}"
                aria-pressed="${state.lateSyrup === item.value}">
                <span>${item.value}</span>
                ${item.badge ? `<small>ОСТАЛОСЬ ${item.badge}</small>` : "<small>В НАЛИЧИИ</small>"}
                <b aria-hidden="true">+</b>
              </button>`,
          )
          .join("")}
      </div>
    </section>
    <div class="late-syrup-toast" role="status" aria-live="polite"></div>`;
}

function renderPour(kind) {
  const milk = kind === "milk";
  return `
    ${drinkHeader()}
    ${liquidStage({
      label: milk ? "НАЛИВАЕТСЯ МОЛОКО" : "НАЛИВАЕТСЯ КОФЕ",
      hint: milk ? "НАЛИВАЕТСЯ МОЛОКО" : "НАЛИВАЕТСЯ КОФЕ",
      percent: milk ? 38 : 66,
      time: state.countdown,
    })}
    ${renderLateSyrupControl()}
    ${actionBar("СТОП", "stop", { danger: true })}`;
}

function renderPause() {
  return `
    ${drinkHeader()}
    <section class="message-stage">
      <div class="ambient-orbit" aria-hidden="true"></div>
      <p class="eyebrow">1 ИЗ ${state.config.portions} НАПИТКОВ ГОТОВ</p>
      <h2>ПОСТАВЬТЕ<br />СЛЕДУЮЩИЙ<br />СТАКАН</h2>
      <div class="cup-pulse" aria-hidden="true"><span></span><i></i><b></b></div>
    </section>
    ${actionBar("ПРОДОЛЖИТЬ", "continue-pour")}`;
}

function renderRinseRequired() {
  return `
    ${plainHeader("ПРОМЫВКА", "menu")}
    <section class="rinse-required">
      <div class="notice-card">
        <p class="eyebrow">ТРЕБУЕТСЯ ПРОМЫВКА</p>
        <h2>НЕ СТАВЬТЕ<br />СТАКАН</h2>
      </div>
      <button class="outline-stop" type="button" data-action="stop">СТОП</button>
    </section>
    ${actionBar("НАЧАТЬ ПРОМЫВКУ", "rinse-start")}`;
}

function renderRinseProgress() {
  return `
    ${plainHeader("ПРОМЫВКА", "menu")}
    ${liquidStage({
      label: "ПРОМЫВКА ИДЁТ",
      hint: "НЕ СТАВЬТЕ СТАКАН",
      percent: 48,
      time: "",
      title: "ПРОМЫВКА ИДЁТ",
    })}
    ${actionBar("СТОП", "stop", { danger: true })}`;
}

function renderStockInsufficient() {
  return `
    ${drinkHeader()}
    <section class="message-stage message-stage--compact">
      <div class="notice-card">
        <p class="eyebrow">НЕДОСТАТОЧНО СЫРЬЯ</p>
        <h2>МИНДАЛЬНОЕ<br />МОЛОКО<br />НЕДОСТУПНО</h2>
      </div>
    </section>
    ${actionBar("В МЕНЮ", "go", { target: "menu" })}`;
}

function renderFinished() {
  return `
    ${drinkHeader()}
    <section class="result-stage">
      <div class="success-radiance" aria-hidden="true">
        <i></i><i></i><i></i>
        <span>✓</span>
      </div>
      <div class="notice-card">
        <p class="eyebrow">НАПИТОК ГОТОВ</p>
        <h2>ОСТАТКИ СЫРЬЯ<br />ОБНОВЛЕНЫ</h2>
      </div>
      <div class="stock-result">
        <p>ОСТАТКИ СЫРЬЯ</p>
        <strong>КОФЕ · — МЛ</strong>
        <strong>ВОДА · — МЛ</strong>
        <strong class="orange">ДОСТУПНО ПОРЦИЙ · —</strong>
      </div>
    </section>
    ${actionBar("ГОТОВО", "go", { target: "menu" })}`;
}

function renderError() {
  return `
    ${drinkHeader()}
    <section class="error-stage">
      <div class="error-scan" aria-hidden="true"></div>
      <div class="error-card">
        <p>ОШИБКА ОБОРУДОВАНИЯ</p>
        <h2 data-text="ПРИГОТОВЛЕНИЕ ОСТАНОВЛЕНО">ПРИГОТОВЛЕНИЕ<br />ОСТАНОВЛЕНО</h2>
      </div>
    </section>
    ${actionBar("В МЕНЮ", "go", { target: "menu" })}`;
}

function renderService() {
  const cards = [
    ["calibration", "КАЛИБРОВКИ"],
    ["stock", "ОСТАТКИ СЫРЬЯ"],
    ["recipes", "РЕЦЕПТЫ"],
    ["cleaning-setup", "МОЙКА"],
  ];
  return `
    ${plainHeader("СЕРВИС", "menu")}
    <section class="service-grid">
      ${cards
        .map(
          ([target, label], index) => `
          <button type="button" data-action="go" data-target="${target}" style="--service-delay:${90 + index * 80}ms">
            <span>${label}</span><i aria-hidden="true">↗</i>
          </button>`,
        )
        .join("")}
    </section>
    ${actionBar("В МЕНЮ", "go", { target: "menu" })}`;
}

function renderStock() {
  const rows = ["ОБЫЧНОЕ МОЛОКО", "БЕЗЛАКТОЗНОЕ МОЛОКО", "КОФЕ", "СИРОПЫ", "ВОДА"];
  return `
    ${plainHeader("ОСТАТКИ", "service")}
    <section class="service-list">
      ${rows
        .map(
          (row, index) =>
            `<div style="--service-delay:${90 + index * 80}ms"><strong>${row}</strong><span>· — МЛ</span></div>`,
        )
        .join("")}
    </section>
    ${actionBar("НАЗАД", "go", { target: "service" })}`;
}

function sliderPanel(label, value = 50, index = 0) {
  return `
    <label class="slider-panel" style="--service-delay:${90 + index * 80}ms">
      <span>${label}</span>
      <input type="range" min="0" max="100" value="${value}" aria-label="${label}" />
    </label>`;
}

function renderCalibration() {
  return `
    ${plainHeader("КАЛИБРОВКИ", "service")}
    <section class="service-controls">
      ${sliderPanel("ТЕМПЕРАТУРА МОЛОКА", 58, 0)}
      ${sliderPanel("ТЕМПЕРАТУРА КОФЕ", 56, 1)}
      ${sliderPanel("ТЕМПЕРАТУРА ВОДЫ", 53, 2)}
      ${sliderPanel("АЭРАЦИЯ МОЛОКА", 60, 3)}
      ${sliderPanel("АЭРАЦИЯ КОФЕ", 48, 4)}
      <label class="check-row">
        <input type="checkbox" data-action="toggle-recipes" ${state.allRecipes ? "checked" : ""} />
        <span>ПРИМЕНИТЬ КО ВСЕМ РЕЦЕПТАМ</span>
      </label>
    </section>
    ${actionBar("НАЗАД", "go", { target: "service" })}`;
}

function renderRecipes() {
  const recipes = ["Американо", "Капучино", "Латте"];
  return `
    ${plainHeader("РЕЦЕПТЫ", "service")}
    <section class="service-controls">
      <div class="recipe-tabs">
        ${recipes
          .map(
            (recipe) => `
            <button type="button" class="${state.recipe === recipe ? "is-active" : ""}"
              data-action="recipe" data-recipe="${recipe}">${recipe}</button>`,
          )
          .join("")}
      </div>
      ${sliderPanel("КОЛИЧЕСТВО КОФЕЙНОГО ЭКСТРАКТА", 52, 0)}
      ${sliderPanel("КОЛИЧЕСТВО ВОДЫ", 48, 1)}
      ${sliderPanel("ТЕМПЕРАТУРА ГОРЯЧЕЙ ВОДЫ", 56, 2)}
    </section>
    ${actionBar("НАЗАД", "go", { target: "service" })}`;
}

const cleaningPreparation = [
  "ДОСТАНЬТЕ ВСЕ ЕМКОСТИ ИЗ ХОЛОДИЛЬНИКА И ПОМОЙТЕ ИХ.",
  "ВОЗЬМИТЕ ПРОМЫВОЧНУЮ ЕМКОСТЬ И ПОДКЛЮЧИТЕ К НЕЙ ВСЕ КОННЕКТОРЫ.",
  "ДОБАВЬТЕ ХИМИЮ В ПРОМЫВОЧНУЮ ЕМКОСТЬ.",
  "ПОДТВЕРДИТЕ, ЧТО ВСЁ ГОТОВО.",
];

function instructionList(items) {
  return `
    <div class="instruction-list">
      ${items
        .map(
          (item, index) =>
            `<div style="--service-delay:${90 + index * 80}ms"><b>${index + 1}.</b><span>${item}</span></div>`,
        )
        .join("")}
    </div>`;
}

function renderCleaningSetup() {
  return `
    ${plainHeader("МОЙКА", "service")}
    <section class="cleaning-stage">
      <p class="eyebrow">ПОДГОТОВКА</p>
      ${instructionList(cleaningPreparation)}
    </section>
    ${actionBar("ВСЁ ГОТОВО", "go", { target: "cleaning-start" })}`;
}

function renderCleaningStart() {
  return `
    ${plainHeader("МОЙКА", "service")}
    <section class="cleaning-stage">
      <div class="cleaning-launch">
        <div class="cleaning-orbit" aria-hidden="true"><i></i><i></i><i></i></div>
        <p class="eyebrow">МОЙКА · ГОТОВА</p>
        <h2>ЗАПУСТИТЬ<br />МОЙКУ</h2>
        <span>20 МИНУТ</span>
      </div>
    </section>
    ${actionBar("ЗАПУСТИТЬ", "cleaning-run")}`;
}

function renderCleaningRunning() {
  return `
    ${plainHeader("МОЙКА", "service")}
    <section class="cleaning-progress">
      <div class="cleaning-time">
        <strong class="timer-value">${formatTime(state.countdown)}</strong>
        <span>ДО ОКОНЧАНИЯ</span>
      </div>
      <div class="cleaning-wave cleaning-wave--back" aria-hidden="true"></div>
      <div class="cleaning-wave cleaning-wave--middle" aria-hidden="true"></div>
      <div class="cleaning-wave cleaning-wave--front" aria-hidden="true"></div>
      <div class="cleaning-beam" aria-hidden="true"></div>
      <h2>МОЙКА ИДЁТ</h2>
    </section>
    ${actionBar("СТОП", "go", { danger: true, target: "service" })}`;
}

function renderCleaningComplete() {
  return `
    ${plainHeader("МОЙКА", "service")}
    <section class="cleaning-stage">
      <p class="eyebrow">МОЙКА ЗАКОНЧЕНА</p>
      ${instructionList([
        "ДОСТАНЬТЕ ПРОМЫВОЧНУЮ ЕМКОСТЬ.",
        "ОТКЛЮЧИТЕ КОННЕКТОРЫ.",
        "ВЕРНИТЕ РАБОЧИЕ ЕМКОСТИ НА МЕСТО.",
      ])}
    </section>
    ${actionBar("ГОТОВО", "go", { target: "service" })}`;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function startCountdown(seconds, nextScreen, delay = 500) {
  state.countdown = seconds;
  state.countdownMax = seconds;
  updateTimers();
  state.timer = window.setInterval(() => {
    state.countdown -= 1;
    updateTimers();
    if (state.countdown <= 0) {
      clearTimer();
      go(typeof nextScreen === "function" ? nextScreen() : nextScreen);
    }
  }, delay);
}

function updateTimers() {
  const progress = state.countdownMax ? Math.max(0, state.countdown / state.countdownMax) : 0;
  document.querySelectorAll(".timer-value").forEach((element) => {
    element.textContent =
      state.screen === "cleaning-running" ? formatTime(state.countdown) : `${Math.max(0, state.countdown)} СЕК`;

    const timerSurface = element.closest(".timer-chip, .cleaning-time");
    timerSurface?.style.setProperty("--timer-progress", `${progress * 360}deg`);

    if (
      state.screen !== "cleaning-running" &&
      !reducedMotionQuery.matches &&
      typeof element.animate === "function"
    ) {
      element.animate(
        [
          { transform: "translateY(-3px) scale(1.06)", filter: "brightness(1.3)" },
          { transform: "translateY(0) scale(1)", filter: "brightness(1)" },
        ],
        { duration: 360, easing: "cubic-bezier(.16,1,.3,1)" },
      );
    }
  });
}

function setLateSyrupPanel(open) {
  const trigger = app.querySelector(".late-syrup-trigger");
  const sheet = app.querySelector(".late-syrup-sheet");
  const backdrop = app.querySelector(".late-syrup-backdrop");
  if (!trigger || !sheet || !backdrop) return;

  trigger.setAttribute("aria-expanded", String(open));
  sheet.setAttribute("aria-hidden", String(!open));
  sheet.toggleAttribute("inert", !open);
  sheet.classList.toggle("is-open", open);
  backdrop.classList.toggle("is-open", open);

  if (open && !reducedMotionQuery.matches) {
    window.setTimeout(() => sheet.querySelector('[data-action="select-late-syrup"]')?.focus(), 260);
  }
}

function selectLateSyrup(control) {
  const value = control.dataset.value;
  if (!value) return;

  state.lateSyrup = value;
  app.querySelectorAll('[data-action="select-late-syrup"]').forEach((button) => {
    const selected = button === control;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  const summary = app.querySelector("[data-syrup-summary]");
  if (summary) summary.textContent = `Сироп: ${syrupSummary()}`;

  const trigger = app.querySelector(".late-syrup-trigger");
  if (trigger) {
    trigger.classList.add("is-added");
    trigger.querySelector(".late-syrup-plus").textContent = "✓";
    trigger.querySelector("small").textContent = "СИРОП ДОБАВЛЕН";
    trigger.querySelector("strong").textContent = value;
  }

  setLateSyrupPanel(false);

  const toast = app.querySelector(".late-syrup-toast");
  if (toast) {
    toast.textContent = `${value.toUpperCase()} · ДОБАВЛЕН`;
    toast.classList.remove("is-visible");
    window.requestAnimationFrame(() => toast.classList.add("is-visible"));
    window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }
}

function render() {
  const screens = {
    menu: renderMenu,
    configure: renderConfigure,
    "pour-coffee": () => renderPour("coffee"),
    pause: renderPause,
    "pour-milk": () => renderPour("milk"),
    "rinse-required": renderRinseRequired,
    "rinse-progress": renderRinseProgress,
    "stock-insufficient": renderStockInsufficient,
    finished: renderFinished,
    error: renderError,
    service: renderService,
    stock: renderStock,
    calibration: renderCalibration,
    recipes: renderRecipes,
    "cleaning-setup": renderCleaningSetup,
    "cleaning-start": renderCleaningStart,
    "cleaning-running": renderCleaningRunning,
    "cleaning-complete": renderCleaningComplete,
  };

  app.dataset.screen = state.screen;
  app.dataset.transition = state.transition;
  app.setAttribute("aria-label", `DrinkX Barista — ${state.screen}`);
  app.innerHTML = `
    <div class="screen-viewport">
      <div class="screen-view screen-view--${state.transition}">${screens[state.screen]()}</div>
    </div>
  `;
  app.querySelectorAll('input[type="range"]').forEach((input) => {
    input.style.setProperty("--range-progress", `${input.value}%`);
  });

  if (state.screen === "pour-coffee") {
    startCountdown(30, () => (Number(state.config.portions) > 1 ? "pause" : "rinse-required"), 1000);
  } else if (state.screen === "pour-milk") {
    startCountdown(30, "rinse-required", 1000);
  } else if (state.screen === "rinse-progress") {
    startCountdown(7, "finished", 450);
  } else if (state.screen === "cleaning-running") {
    startCountdown(20 * 60, "cleaning-complete", 5);
  }
}

app.addEventListener("click", (event) => {
  const control = event.target.closest("[data-action]");
  if (!control) return;

  const action = control.dataset.action;

  if (action === "go") {
    go(control.dataset.target);
  }

  if (action === "category") {
    switchCategory(control);
  }

  if (action === "choose-drink") {
    state.drink = drinks.find((drink) => drink.id === control.dataset.drink) || drinks[1];
    state.lateSyrup = null;
    morphToConfigure(control);
  }

  if (action === "unavailable-drink") {
    state.drink = drinks.find((drink) => drink.id === control.dataset.drink) || drinks[1];
    go("stock-insufficient");
  }

  if (action === "option") {
    if (control.dataset.unavailable) {
      go("stock-insufficient");
      return;
    }
    selectOption(control);
  }

  if (action === "start-drink") {
    state.lateSyrup = null;
    go("pour-coffee");
  }
  if (action === "continue-pour") go("pour-milk");
  if (action === "stop") go("error");
  if (action === "rinse-start") go("rinse-progress");
  if (action === "toggle-late-syrup") {
    setLateSyrupPanel(control.getAttribute("aria-expanded") !== "true");
  }
  if (action === "close-late-syrup") setLateSyrupPanel(false);
  if (action === "select-late-syrup") selectLateSyrup(control);

  if (action === "recipe") {
    state.recipe = control.dataset.recipe;
    const tabs = control.closest(".recipe-tabs");
    tabs?.querySelector(".is-active")?.classList.remove("is-active");
    control.classList.add("is-active");
    if (!reducedMotionQuery.matches) {
      control.animate?.(
        [{ transform: "scale(.92)" }, { transform: "scale(1.06)" }, { transform: "scale(1)" }],
        { duration: 440, easing: "cubic-bezier(.16,1,.3,1)" },
      );
    }
  }

  if (action === "cleaning-run") go("cleaning-running");
});

app.addEventListener("pointerdown", addTapRipple);

app.addEventListener("input", (event) => {
  if (event.target.matches('input[type="range"]')) {
    event.target.style.setProperty("--range-progress", `${event.target.value}%`);
    event.target.closest(".slider-panel")?.classList.add("is-adjusting");
  }
});

app.addEventListener("pointerup", (event) => {
  if (event.target.matches('input[type="range"]')) {
    window.setTimeout(() => event.target.closest(".slider-panel")?.classList.remove("is-adjusting"), 260);
  }
});

app.addEventListener("change", (event) => {
  if (event.target.matches('[data-action="toggle-recipes"]')) {
    state.allRecipes = event.target.checked;
  }
});

window.addEventListener("resize", scheduleAppFit);
window.visualViewport?.addEventListener("resize", scheduleAppFit);
document.addEventListener("fullscreenchange", scheduleAppFit);

fitAppToViewport();
render();
