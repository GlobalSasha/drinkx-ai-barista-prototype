const app = document.querySelector("#staff-app");
const DESIGN_WIDTH = 800;
const DESIGN_HEIGHT = 1280;

function fitStaffApp() {
  const viewportWidth = window.visualViewport?.width || window.innerWidth;
  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  const safeGap = Math.min(12, Math.min(viewportWidth, viewportHeight) * 0.012);
  const scale = Math.max(
    0.1,
    Math.min(
      1,
      (viewportWidth - safeGap * 2) / DESIGN_WIDTH,
      (viewportHeight - safeGap * 2) / DESIGN_HEIGHT,
    ),
  );

  app.style.setProperty("--staff-scale", scale.toFixed(5));
  app.dataset.fit = scale < 0.999 ? "scaled" : "native";
}

const categories = [
  { id: "popular", label: "Популярное" },
  { id: "coffee", label: "Кофе" },
  { id: "milk", label: "Молочные" },
  { id: "tea", label: "Чай" },
  { id: "cold", label: "Холодные" },
  { id: "all", label: "Все" },
];

const drinks = [
  {
    id: "americano",
    name: "Американо",
    categories: ["popular", "coffee"],
    recipe: "Кофе · вода",
    defaultVolume: "350",
    defaultMilk: "Нет",
    defaultSyrup: "Нет",
    stock: "ok",
  },
  {
    id: "cappuccino",
    name: "Капучино",
    categories: ["popular", "coffee", "milk"],
    recipe: "Кофе · молоко · пена",
    defaultVolume: "350",
    defaultMilk: "Обычное",
    defaultSyrup: "Нет",
    stock: "ok",
  },
  {
    id: "latte",
    name: "Латте",
    categories: ["popular", "coffee", "milk"],
    recipe: "Кофе · молоко",
    defaultVolume: "350",
    defaultMilk: "Обычное",
    defaultSyrup: "Нет",
    stock: "ok",
  },
  {
    id: "raf",
    name: "Раф",
    categories: ["popular", "coffee", "milk"],
    recipe: "Кофе · сливки · карамель",
    defaultVolume: "350",
    defaultMilk: "Сливки",
    defaultSyrup: "Карамель",
    stock: "low",
    stockText: "4 порции",
  },
  {
    id: "flat",
    name: "Флэт уайт",
    categories: ["popular", "coffee", "milk"],
    recipe: "Двойной кофе · молоко",
    defaultVolume: "250",
    defaultMilk: "Обычное",
    defaultSyrup: "Нет",
    stock: "ok",
  },
  {
    id: "banoffee",
    name: "Баноффи",
    categories: ["popular", "coffee", "milk"],
    recipe: "Кофе · молоко · банан",
    defaultVolume: "350",
    defaultMilk: "Обычное",
    defaultSyrup: "Банан",
    stock: "low",
    stockText: "1 сироп",
  },
  {
    id: "emerald",
    name: "Изумрудный",
    categories: ["tea", "milk"],
    recipe: "Матча · овсяное молоко",
    defaultVolume: "350",
    defaultMilk: "Овсяное",
    defaultSyrup: "Кокос",
    stock: "off",
    stockText: "Нет овсяного",
    unavailableReason: "Изумрудный недоступен: закончилось овсяное молоко.",
  },
  {
    id: "cold-latte",
    name: "Айс латте",
    categories: ["cold", "coffee", "milk"],
    recipe: "Лёд · кофе · молоко",
    defaultVolume: "450",
    defaultMilk: "Обычное",
    defaultSyrup: "Нет",
    stock: "ok",
  },
  {
    id: "lemonade",
    name: "Лимонад",
    categories: ["cold"],
    recipe: "Вода · цитрус · лёд",
    defaultVolume: "450",
    defaultMilk: "Нет",
    defaultSyrup: "Цитрус",
    stock: "ok",
  },
  {
    id: "lungo",
    name: "Лунго",
    categories: ["coffee"],
    recipe: "Кофе · вода",
    defaultVolume: "250",
    defaultMilk: "Нет",
    defaultSyrup: "Нет",
    stock: "ok",
  },
];

const options = {
  volume: ["250", "350", "450"],
  milk: ["Нет", "Обычное", "Безлакт.", "Овсяное", "Сливки", "Кокос"],
  syrup: ["Нет", "Ваниль", "Карамель", "Банан", "Фундук", "Цитрус"],
  portions: ["1", "2", "3"],
};

const state = {
  category: "popular",
  selectedDrink: null,
  config: {
    volume: "350",
    milk: "Нет",
    syrup: "Нет",
    portions: "1",
  },
  today: 47,
  sound: true,
  process: null,
  timer: null,
  toastTimer: null,
};

const refs = {
  categoryList: document.querySelector("#category-list"),
  catalogTitle: document.querySelector("#catalog-title"),
  drinkList: document.querySelector("#drink-list"),
  orderEmpty: document.querySelector("#order-empty"),
  orderForm: document.querySelector("#order-form"),
  orderName: document.querySelector("#order-name"),
  volumeOptions: document.querySelector("#volume-options"),
  milkOptions: document.querySelector("#milk-options"),
  syrupOptions: document.querySelector("#syrup-options"),
  portionOptions: document.querySelector("#portion-options"),
  orderSummary: document.querySelector("#order-summary"),
  orderDuration: document.querySelector("#order-duration"),
  todayCount: document.querySelector("#today-count"),
  clock: document.querySelector("#clock"),
  soundToggle: document.querySelector("#sound-toggle"),
  readyAudio: document.querySelector("#ready-audio"),
  processScreen: document.querySelector("#process-screen"),
  processDrink: document.querySelector("#process-drink"),
  processConfig: document.querySelector("#process-config"),
  processTimer: document.querySelector("#process-timer"),
  processStepIndex: document.querySelector("#process-step-index"),
  processKicker: document.querySelector("#process-kicker"),
  processTitle: document.querySelector("#process-title"),
  processHint: document.querySelector("#process-hint"),
  processPercent: document.querySelector("#process-percent"),
  orbitProgress: document.querySelector("#orbit-progress"),
  finishScreen: document.querySelector("#finish-screen"),
  finishSummary: document.querySelector("#finish-summary"),
  confirmDialog: document.querySelector("#confirm-dialog"),
  serviceDialog: document.querySelector("#service-dialog"),
  stockDetail: document.querySelector("#stock-detail"),
  toast: document.querySelector("#toast"),
};

function showToast(message, { error = false } = {}) {
  window.clearTimeout(state.toastTimer);
  refs.toast.textContent = message;
  refs.toast.classList.toggle("is-error", error);
  refs.toast.classList.add("is-visible");
  state.toastTimer = window.setTimeout(() => refs.toast.classList.remove("is-visible"), 3000);
}

function updateClock() {
  refs.clock.textContent = new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function visibleDrinks() {
  if (state.category === "all") return drinks;
  return drinks.filter((drink) => drink.categories.includes(state.category));
}

function renderCategories() {
  refs.categoryList.innerHTML = categories
    .map(
      (category, index) => `
        <button class="category-button ${category.id === state.category ? "is-active" : ""}"
          type="button" data-category="${category.id}"
          ${category.id === state.category ? 'aria-current="page"' : ""}>
          <span class="category-index">${String(index + 1).padStart(2, "0")}</span>
          <strong>${category.label}</strong>
        </button>`,
    )
    .join("");
}

function stockLabel(drink) {
  if (drink.stock === "off") {
    return `<span class="stock-label is-off">${drink.stockText || "НЕТ"}</span>`;
  }
  if (drink.stock === "low") {
    return `<span class="stock-label is-low">${drink.stockText || "МАЛО"}</span>`;
  }
  return '<span class="stock-label">ЕСТЬ</span>';
}

function renderDrinks() {
  const list = visibleDrinks();
  refs.catalogTitle.textContent =
    categories.find((category) => category.id === state.category)?.label || "Напитки";

  refs.drinkList.innerHTML = list
    .map(
      (drink, index) => `
        <button class="drink-button ${state.selectedDrink?.id === drink.id ? "is-selected" : ""} ${
          drink.stock === "off" ? "is-unavailable" : ""
        }" type="button" data-drink="${drink.id}"
          aria-label="${drink.name}. ${drink.recipe}. ${
            drink.stock === "off" ? drink.stockText : drink.stock === "low" ? `Осталось ${drink.stockText}` : "В наличии"
          }">
          <strong>${drink.name}</strong>
          <span class="drink-hotkey">${index < 9 ? index + 1 : "·"}</span>
          <p>${drink.recipe}</p>
          <small>${drink.defaultVolume} мл · ≈ 45 сек</small>
          ${stockLabel(drink)}
        </button>`,
    )
    .join("");
}

function optionButton(group, value) {
  const unavailable = group === "milk" && value === "Овсяное";
  return `
    <button class="option-button ${state.config[group] === value ? "is-active" : ""} ${
      unavailable ? "is-unavailable" : ""
    }" type="button" data-option-group="${group}" data-option-value="${value}"
      aria-pressed="${state.config[group] === value}"
      ${unavailable ? 'disabled aria-label="Овсяное молоко, недоступно"' : ""}>
      ${group === "volume" ? `${value} мл` : value}
    </button>`;
}

function renderOptions() {
  refs.volumeOptions.innerHTML = options.volume.map((value) => optionButton("volume", value)).join("");
  refs.milkOptions.innerHTML = options.milk.map((value) => optionButton("milk", value)).join("");
  refs.syrupOptions.innerHTML = options.syrup.map((value) => optionButton("syrup", value)).join("");
  refs.portionOptions.innerHTML = options.portions.map((value) => optionButton("portions", value)).join("");
}

function configSummary() {
  const parts = [`${state.config.volume} мл`, `${state.config.portions} порц.`];
  if (state.config.milk !== "Нет") parts.push(state.config.milk);
  if (state.config.syrup !== "Нет") parts.push(state.config.syrup);
  return parts.join(" · ");
}

function updateOrderSummary() {
  refs.orderSummary.textContent = configSummary();
  const duration = 36 + Number(state.config.portions) * 9;
  refs.orderDuration.textContent = `≈ 00:${duration}`;
}

function selectDrink(drinkId) {
  const drink = drinks.find((item) => item.id === drinkId);
  if (!drink) return;

  if (drink.stock === "off") {
    showToast(drink.unavailableReason || `${drink.name} недоступен.`, { error: true });
    refs.toast.focus?.();
    return;
  }

  state.selectedDrink = drink;
  state.config = {
    volume: drink.defaultVolume,
    milk: drink.defaultMilk,
    syrup: drink.defaultSyrup,
    portions: "1",
  };

  refs.orderEmpty.hidden = true;
  refs.orderForm.hidden = false;
  refs.orderName.textContent = drink.name;
  renderDrinks();
  renderOptions();
  updateOrderSummary();
}

function clearOrder() {
  state.selectedDrink = null;
  refs.orderEmpty.hidden = false;
  refs.orderForm.hidden = true;
  renderDrinks();
}

function selectOption(group, value) {
  if (group === "milk" && value === "Овсяное") {
    showToast("Овсяное молоко недоступно. Выберите замену.", { error: true });
    return;
  }
  state.config[group] = value;
  renderOptions();
  updateOrderSummary();
}

const processSteps = [
  {
    kicker: "ЭТАП 1 · 4 СЕК",
    title: "КОФЕЙНЫЙ<br />ЭКСТРАКТ",
    hint: "Не убирайте стакан",
  },
  {
    kicker: "ЭТАП 2 · 4 СЕК",
    title: "МОЛОКО<br />И ПЕНА",
    hint: "Проверьте положение стакана",
  },
  {
    kicker: "ЭТАП 3 · 4 СЕК",
    title: "БЫСТРАЯ<br />ПРОМЫВКА",
    hint: "Не ставьте новый стакан",
  },
];

function setProcessVisible(visible) {
  refs.processScreen.classList.toggle("is-visible", visible);
  refs.processScreen.setAttribute("aria-hidden", String(!visible));
  refs.processScreen.toggleAttribute("inert", !visible);
}

function setFinishVisible(visible) {
  refs.finishScreen.classList.toggle("is-visible", visible);
  refs.finishScreen.setAttribute("aria-hidden", String(!visible));
  refs.finishScreen.toggleAttribute("inert", !visible);
}

function startOrder() {
  if (!state.selectedDrink || state.process) return;

  const total = 12;
  state.process = {
    kind: "drink",
    total,
    remaining: total,
    selectedName: state.selectedDrink.name,
    summary: configSummary(),
  };

  refs.processDrink.textContent = state.process.selectedName;
  refs.processConfig.textContent = state.process.summary;
  setProcessVisible(true);
  updateProcess();
  refs.processScreen.focus?.();

  window.clearInterval(state.timer);
  state.timer = window.setInterval(() => {
    if (!state.process) return;
    state.process.remaining = Math.max(0, state.process.remaining - 0.1);
    updateProcess();
    if (state.process.remaining <= 0) finishOrder();
  }, 100);
}

function startRinse() {
  state.selectedDrink = {
    id: "rinse",
    name: "Промывка",
  };
  state.config = { volume: "—", milk: "Нет", syrup: "Нет", portions: "1" };
  state.process = {
    kind: "rinse",
    total: 6,
    remaining: 6,
    selectedName: "Промывка",
    summary: "Сервисный цикл · без стакана",
  };

  refs.processDrink.textContent = "ПРОМЫВКА";
  refs.processConfig.textContent = state.process.summary;
  setProcessVisible(true);
  updateProcess();

  window.clearInterval(state.timer);
  state.timer = window.setInterval(() => {
    if (!state.process) return;
    state.process.remaining = Math.max(0, state.process.remaining - 0.1);
    updateProcess();
    if (state.process.remaining <= 0) finishOrder();
  }, 100);
}

function updateProcess() {
  if (!state.process) return;

  const elapsed = state.process.total - state.process.remaining;
  const percent = Math.min(100, Math.round((elapsed / state.process.total) * 100));
  const stepDuration = state.process.total / 3;
  const stepIndex = Math.min(2, Math.floor(elapsed / stepDuration));
  const step = processSteps[stepIndex];

  refs.processTimer.textContent = `00:${String(Math.ceil(state.process.remaining)).padStart(2, "0")}`;
  refs.processPercent.textContent = `${percent}%`;
  refs.orbitProgress.style.strokeDashoffset = String(490 - (490 * percent) / 100);
  refs.processStepIndex.textContent = `${String(stepIndex + 1).padStart(2, "0")} / 03`;
  refs.processKicker.textContent = state.process.kind === "rinse" ? "СЕРВИСНЫЙ ЦИКЛ" : step.kicker;
  refs.processTitle.innerHTML =
    state.process.kind === "rinse" ? "ПРОМЫВКА<br />СИСТЕМЫ" : step.title;
  refs.processHint.textContent =
    state.process.kind === "rinse" ? "Не ставьте стакан" : step.hint;

  document.querySelectorAll(".process-steps li").forEach((item, index) => {
    item.classList.toggle("is-current", index === stepIndex);
    item.classList.toggle("is-done", index < stepIndex);
  });
}

function finishOrder() {
  if (!state.process) return;
  const completed = { ...state.process };
  window.clearInterval(state.timer);
  state.timer = null;
  state.process = null;
  setProcessVisible(false);

  if (completed.kind === "drink") {
    state.today += Number(state.config.portions);
    refs.todayCount.textContent = String(state.today);
    refs.finishSummary.textContent = `${completed.selectedName} · ${completed.summary}`;
    setFinishVisible(true);
    if (state.sound) {
      refs.readyAudio.currentTime = 0;
      refs.readyAudio.play().catch(() => showToast("Разрешите звук в браузере для голосовых уведомлений."));
    }
  } else {
    clearOrder();
    showToast("Промывка завершена. Машина готова к работе.");
  }
}

function stopOrderConfirmed() {
  window.clearInterval(state.timer);
  state.timer = null;
  state.process = null;
  setProcessVisible(false);
  clearOrder();
  showToast("Приготовление остановлено. Напиток списан. Запустите промывку.", { error: true });
}

function nextOrder() {
  setFinishVisible(false);
  clearOrder();
  refs.drinkList.focus();
}

function renderStockDetail() {
  refs.stockDetail.hidden = false;
  refs.stockDetail.innerHTML = `
    <div class="stock-row"><span>Карамельный сироп</span><strong>4 порции</strong></div>
    <div class="stock-row"><span>Банановый сироп</span><strong>1 порция</strong></div>
    <div class="stock-row"><span>Овсяное молоко</span><strong>Нет · заменить</strong></div>
    <div class="stock-row"><span>Кофе</span><span>78%</span></div>`;
}

function resetDemo() {
  state.today = 0;
  refs.todayCount.textContent = "0";
  refs.serviceDialog.close();
  clearOrder();
  showToast("Демо-счётчики сброшены.");
}

function moveCategory(direction) {
  const current = categories.findIndex((category) => category.id === state.category);
  const next = (current + direction + categories.length) % categories.length;
  state.category = categories[next].id;
  renderCategories();
  renderDrinks();
}

refs.categoryList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  renderCategories();
  renderDrinks();
});

refs.drinkList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-drink]");
  if (button) selectDrink(button.dataset.drink);
});

refs.orderForm.addEventListener("click", (event) => {
  const button = event.target.closest("[data-option-group]");
  if (button) selectOption(button.dataset.optionGroup, button.dataset.optionValue);
});

refs.orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  startOrder();
});

document.querySelector("#clear-order").addEventListener("click", clearOrder);
document.querySelector("#sound-toggle").addEventListener("click", () => {
  state.sound = !state.sound;
  refs.soundToggle.setAttribute("aria-pressed", String(state.sound));
  refs.soundToggle.textContent = `ЗВУК · ${state.sound ? "ВКЛ" : "ВЫКЛ"}`;
  showToast(state.sound ? "Голосовые уведомления включены." : "Голосовые уведомления выключены.");
});

document.querySelector("#stop-order").addEventListener("click", () => refs.confirmDialog.showModal());
document.querySelector("#confirm-stop").addEventListener("click", stopOrderConfirmed);
document.querySelector("#finish-next").addEventListener("click", nextOrder);
document.querySelector("#quick-rinse").addEventListener("click", startRinse);
document.querySelector("#late-syrup").addEventListener("click", () => {
  if (state.process?.kind !== "drink") {
    showToast("Сироп нельзя добавить во время промывки.", { error: true });
    return;
  }
  state.config.syrup = state.config.syrup === "Нет" ? "Ваниль" : state.config.syrup;
  refs.processConfig.textContent = configSummary();
  showToast(`Сироп «${state.config.syrup}» добавлен в текущий заказ.`);
});

document.querySelector("#service-open").addEventListener("click", () => {
  refs.stockDetail.hidden = true;
  refs.serviceDialog.showModal();
});

refs.serviceDialog.addEventListener("click", (event) => {
  const action = event.target.closest("[data-service]")?.dataset.service;
  if (!action) return;
  if (action === "rinse") {
    refs.serviceDialog.close();
    startRinse();
  }
  if (action === "stock") renderStockDetail();
  if (action === "clean") showToast("Полная мойка займёт 20 минут. Сценарий доступен в клиентской версии.");
  if (action === "reset") resetDemo();
});

document.addEventListener("keydown", (event) => {
  if (refs.confirmDialog.open || refs.serviceDialog.open) return;

  if (event.key === "Escape") {
    if (state.process) refs.confirmDialog.showModal();
    else if (!refs.orderForm.hidden) clearOrder();
    return;
  }

  if (event.key === "Enter") {
    if (!refs.finishScreen.hasAttribute("inert")) nextOrder();
    else if (state.selectedDrink && !state.process) startOrder();
    return;
  }

  if (event.key === "ArrowLeft") moveCategory(-1);
  if (event.key === "ArrowRight") moveCategory(1);

  const number = Number(event.key);
  if (number >= 1 && number <= 9 && !state.process) {
    const drink = visibleDrinks()[number - 1];
    if (drink) selectDrink(drink.id);
  }
});

renderCategories();
renderDrinks();
renderOptions();
updateOrderSummary();
updateClock();
fitStaffApp();
window.addEventListener("resize", fitStaffApp);
window.visualViewport?.addEventListener("resize", fitStaffApp);
window.setInterval(updateClock, 30_000);
