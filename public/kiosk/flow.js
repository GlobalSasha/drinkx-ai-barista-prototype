const flowCategories = [
  { id: "popular", label: "Популярное" },
  { id: "coffee", label: "Кофе" },
  { id: "milk", label: "Молочные" },
  { id: "tea", label: "Чай" },
  { id: "cold", label: "Холодные" },
  { id: "all", label: "Все" },
];

const flowDrinks = [
  {
    id: "cappuccino",
    name: "Капучино",
    categories: ["popular", "coffee", "milk"],
    recipe: "Эспрессо · молоко · пена",
    volume: "350",
    milk: "Обычное",
    syrup: "Нет",
    stock: "ok",
  },
  {
    id: "americano",
    name: "Американо",
    categories: ["popular", "coffee"],
    recipe: "Эспрессо · горячая вода",
    volume: "350",
    milk: "Нет",
    syrup: "Нет",
    stock: "ok",
  },
  {
    id: "latte",
    name: "Латте",
    categories: ["popular", "coffee", "milk"],
    recipe: "Эспрессо · молоко",
    volume: "350",
    milk: "Обычное",
    syrup: "Нет",
    stock: "ok",
  },
  {
    id: "raf",
    name: "Раф",
    categories: ["popular", "coffee", "milk"],
    recipe: "Эспрессо · сливки · ваниль",
    volume: "350",
    milk: "Сливки",
    syrup: "Ваниль",
    stock: "low",
    stockText: "4 порции",
  },
  {
    id: "flat",
    name: "Флэт уайт",
    categories: ["popular", "coffee", "milk"],
    recipe: "Двойной эспрессо · молоко",
    volume: "250",
    milk: "Обычное",
    syrup: "Нет",
    stock: "ok",
  },
  {
    id: "banoffee",
    name: "Баноффи",
    categories: ["popular", "coffee", "milk"],
    recipe: "Эспрессо · молоко · банан",
    volume: "350",
    milk: "Обычное",
    syrup: "Банан",
    stock: "low",
    stockText: "1 сироп",
  },
  {
    id: "matcha",
    name: "Матча латте",
    categories: ["tea", "milk"],
    recipe: "Матча · овсяное молоко",
    volume: "350",
    milk: "Овсяное",
    syrup: "Нет",
    stock: "off",
    stockText: "Нет овсяного",
  },
  {
    id: "ice-latte",
    name: "Айс латте",
    categories: ["cold", "coffee", "milk"],
    recipe: "Лёд · эспрессо · молоко",
    volume: "450",
    milk: "Обычное",
    syrup: "Нет",
    stock: "ok",
  },
  {
    id: "lemonade",
    name: "Цитрус тоник",
    categories: ["cold"],
    recipe: "Тоник · цитрус · лёд",
    volume: "450",
    milk: "Нет",
    syrup: "Цитрус",
    stock: "ok",
  },
  {
    id: "lungo",
    name: "Лунго",
    categories: ["coffee"],
    recipe: "Длинный эспрессо · вода",
    volume: "250",
    milk: "Нет",
    syrup: "Нет",
    stock: "ok",
  },
];

const flowOptions = {
  volume: ["250", "350", "450"],
  milk: ["Нет", "Обычное", "Безлакт.", "Овсяное", "Сливки", "Кокос"],
  syrup: ["Нет", "Ваниль", "Карамель", "Банан", "Фундук", "Цитрус"],
  portions: ["1", "2", "3"],
};

const flowState = {
  category: "popular",
  query: "",
  selected: null,
  config: {
    volume: "350",
    milk: "Нет",
    syrup: "Нет",
    portions: "1",
  },
  orderNumber: 48,
  queue: 3,
  sound: true,
  process: null,
  timer: null,
  toastTimer: null,
};

const flowRefs = {
  clock: document.querySelector("#flow-clock"),
  sound: document.querySelector("#flow-sound"),
  materials: document.querySelector("#flow-materials"),
  categories: document.querySelector("#flow-categories"),
  title: document.querySelector("#flow-title"),
  search: document.querySelector("#flow-search"),
  resultCount: document.querySelector("#result-count"),
  drinks: document.querySelector("#flow-drinks"),
  orderEmpty: document.querySelector("#flow-order-empty"),
  orderForm: document.querySelector("#flow-order-form"),
  orderId: document.querySelector("#flow-order-id"),
  orderName: document.querySelector("#flow-order-name"),
  clear: document.querySelector("#flow-clear"),
  repeat: document.querySelector("#repeat-last"),
  volume: document.querySelector("#flow-volume"),
  milk: document.querySelector("#flow-milk"),
  syrup: document.querySelector("#flow-syrup"),
  portions: document.querySelector("#flow-portions"),
  summary: document.querySelector("#flow-summary"),
  duration: document.querySelector("#flow-duration"),
  start: document.querySelector("#flow-start"),
  queueCount: document.querySelector("#queue-count"),
  queueList: document.querySelector("#flow-queue"),
  process: document.querySelector("#flow-process"),
  processOrderId: document.querySelector("#process-order-id"),
  processDrink: document.querySelector("#process-drink"),
  processStep: document.querySelector("#process-step"),
  processTitle: document.querySelector("#process-title"),
  processHint: document.querySelector("#process-hint"),
  processTime: document.querySelector("#process-time"),
  processPercent: document.querySelector("#process-percent"),
  progressRing: document.querySelector("#flow-progress-ring"),
  timeline: [...document.querySelectorAll("[data-flow-step]")],
  stop: document.querySelector("#flow-stop"),
  dialog: document.querySelector("#flow-dialog"),
  confirmStop: document.querySelector("#flow-confirm-stop"),
  finish: document.querySelector("#flow-finish"),
  finishCode: document.querySelector(".finish-code"),
  finishSummary: document.querySelector("#flow-finish-summary"),
  next: document.querySelector("#flow-next"),
  toast: document.querySelector("#flow-toast"),
  audio: document.querySelector("#flow-ready-audio"),
};

function updateFlowClock() {
  const now = new Date();
  const value = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  flowRefs.clock.textContent = value;
  flowRefs.clock.dateTime = now.toISOString();
}

function pluralizeDrinks(count) {
  if (count % 10 === 1 && count % 100 !== 11) return `${count} напиток`;
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
    return `${count} напитка`;
  }
  return `${count} напитков`;
}

function visibleFlowDrinks() {
  const query = flowState.query.trim().toLocaleLowerCase("ru-RU");
  return flowDrinks.filter((drink) => {
    const inCategory = flowState.category === "all" || drink.categories.includes(flowState.category);
    const inSearch =
      !query ||
      drink.name.toLocaleLowerCase("ru-RU").includes(query) ||
      drink.recipe.toLocaleLowerCase("ru-RU").includes(query);
    return inCategory && inSearch;
  });
}

function renderFlowCategories() {
  flowRefs.categories.innerHTML = flowCategories
    .map(
      (category, index) => `
        <button class="nav-button ${flowState.category === category.id ? "is-active" : ""}"
          type="button" data-flow-category="${category.id}"
          aria-current="${flowState.category === category.id ? "page" : "false"}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong>${category.label}</strong>
        </button>`,
    )
    .join("");
}

function stockLabel(drink) {
  if (drink.stock === "low") {
    return `<span class="stock-tag stock-tag--low">${drink.stockText}</span>`;
  }
  if (drink.stock === "off") {
    return `<span class="stock-tag stock-tag--off">${drink.stockText}</span>`;
  }
  return '<span class="stock-tag">ГОТОВО</span>';
}

function renderFlowDrinks() {
  const list = visibleFlowDrinks();
  flowRefs.resultCount.textContent = pluralizeDrinks(list.length);
  flowRefs.title.textContent =
    flowState.query.trim() ||
    flowCategories.find((category) => category.id === flowState.category)?.label ||
    "Напитки";

  if (!list.length) {
    flowRefs.drinks.innerHTML = `
      <div class="empty-results">
        <div><strong>Ничего не найдено</strong>Измените запрос или выберите другую категорию.</div>
      </div>`;
    return;
  }

  flowRefs.drinks.innerHTML = list
    .map(
      (drink, index) => `
        <button class="drink-tile ${flowState.selected?.id === drink.id ? "is-selected" : ""} ${
          drink.stock === "off" ? "is-off" : ""
        }" type="button" data-flow-drink="${drink.id}"
          aria-label="${drink.name}. ${drink.recipe}. ${
            drink.stock === "off"
              ? `Недоступно: ${drink.stockText}`
              : drink.stock === "low"
                ? `Осталось ${drink.stockText}`
                : "Готов к приготовлению"
          }">
          <strong>${drink.name}</strong>
          <span class="drink-tile__key">${index < 8 ? index + 1 : "·"}</span>
          <p>${drink.recipe}</p>
          <small>${drink.volume} мл · ≈ 42 сек</small>
          ${stockLabel(drink)}
        </button>`,
    )
    .join("");
}

function optionButton(group, value) {
  const unavailable = group === "milk" && value === "Овсяное";
  const label = group === "volume" ? `${value} мл` : value;
  return `
    <button class="flow-option ${flowState.config[group] === value ? "is-active" : ""}"
      type="button" data-flow-option-group="${group}" data-flow-option-value="${value}"
      aria-pressed="${flowState.config[group] === value}"
      ${unavailable ? 'disabled aria-label="Овсяное молоко, недоступно"' : ""}>
      ${label}
    </button>`;
}

function renderFlowOptions() {
  flowRefs.volume.innerHTML = flowOptions.volume.map((value) => optionButton("volume", value)).join("");
  flowRefs.milk.innerHTML = flowOptions.milk.map((value) => optionButton("milk", value)).join("");
  flowRefs.syrup.innerHTML = flowOptions.syrup.map((value) => optionButton("syrup", value)).join("");
  flowRefs.portions.innerHTML = flowOptions.portions
    .map((value) => optionButton("portions", value))
    .join("");
}

function flowConfigSummary() {
  const parts = [`${flowState.config.volume} мл`, `${flowState.config.portions} порц.`];
  if (flowState.config.milk !== "Нет") parts.push(flowState.config.milk);
  if (flowState.config.syrup !== "Нет") parts.push(flowState.config.syrup);
  return parts.join(" · ");
}

function updateFlowSummary() {
  const seconds = 34 + Number(flowState.config.portions) * 8;
  flowRefs.summary.textContent = flowConfigSummary();
  flowRefs.duration.textContent = `00:${seconds}`;
}

function selectFlowDrink(id) {
  const drink = flowDrinks.find((item) => item.id === id);
  if (!drink) return;

  if (drink.stock === "off") {
    showFlowToast(`${drink.name} недоступен: ${drink.stockText.toLocaleLowerCase("ru-RU")}.`, true);
    return;
  }

  flowState.selected = drink;
  flowState.config = {
    volume: drink.volume,
    milk: drink.milk,
    syrup: drink.syrup,
    portions: "1",
  };
  flowRefs.orderEmpty.hidden = true;
  flowRefs.orderForm.hidden = false;
  flowRefs.orderId.textContent = `#${String(flowState.orderNumber).padStart(3, "0")}`;
  flowRefs.orderName.textContent = drink.name;
  renderFlowDrinks();
  renderFlowOptions();
  updateFlowSummary();
}

function clearFlowOrder() {
  flowState.selected = null;
  flowRefs.orderEmpty.hidden = false;
  flowRefs.orderForm.hidden = true;
  renderFlowDrinks();
}

function selectFlowOption(group, value) {
  flowState.config[group] = value;
  renderFlowOptions();
  updateFlowSummary();
}

function showFlowToast(message, error = false) {
  window.clearTimeout(flowState.toastTimer);
  flowRefs.toast.textContent = message;
  flowRefs.toast.classList.toggle("is-error", error);
  flowRefs.toast.classList.add("is-visible");
  flowState.toastTimer = window.setTimeout(() => {
    flowRefs.toast.classList.remove("is-visible");
  }, 3600);
}

function setFlowProcessVisible(visible) {
  flowRefs.process.classList.toggle("is-visible", visible);
  flowRefs.process.setAttribute("aria-hidden", String(!visible));
  flowRefs.process.toggleAttribute("inert", !visible);
}

function setFlowFinishVisible(visible) {
  flowRefs.finish.classList.toggle("is-visible", visible);
  flowRefs.finish.setAttribute("aria-hidden", String(!visible));
  flowRefs.finish.toggleAttribute("inert", !visible);
}

const flowProcessSteps = [
  {
    title: "ПОДГОТОВКА<br />СИСТЕМЫ",
    hint: "Поставьте стакан в зону выдачи",
  },
  {
    title: "КОФЕЙНАЯ<br />ОСНОВА",
    hint: "Экстракция идёт по профилю рецепта",
  },
  {
    title: "МОЛОКО<br />И ТЕКСТУРА",
    hint: "Станция контролирует температуру и пену",
  },
  {
    title: "ФИНИШНАЯ<br />ПРОВЕРКА",
    hint: "Последняя калибровка и короткая промывка",
  },
];

function renderFlowProcess() {
  if (!flowState.process) return;
  const elapsed = (Date.now() - flowState.process.startedAt) / 1000;
  const duration = flowState.process.duration;
  const progress = Math.min(elapsed / duration, 1);
  const stepIndex = Math.min(Math.floor(progress * flowProcessSteps.length), 3);
  const remaining = Math.max(Math.ceil(duration - elapsed), 0);
  const percent = Math.round(progress * 100);
  const step = flowProcessSteps[stepIndex];

  flowRefs.processStep.textContent = `ЭТАП ${stepIndex + 1} / 4`;
  flowRefs.processTitle.innerHTML = step.title;
  flowRefs.processHint.textContent = step.hint;
  flowRefs.processTime.textContent = `00:${String(remaining).padStart(2, "0")}`;
  flowRefs.processPercent.textContent = `${percent}%`;
  flowRefs.progressRing.style.strokeDashoffset = String(603.19 * (1 - progress));

  flowRefs.timeline.forEach((item, index) => {
    item.classList.toggle("is-active", index === stepIndex);
    item.classList.toggle("is-done", index < stepIndex);
  });

  if (progress >= 1) finishFlowOrder();
}

function startFlowOrder() {
  if (!flowState.selected || flowState.process) return;
  const orderCode = `#${String(flowState.orderNumber).padStart(3, "0")}`;
  flowState.process = {
    startedAt: Date.now(),
    duration: 16,
    name: flowState.selected.name,
    summary: flowConfigSummary(),
    orderCode,
  };

  flowRefs.processOrderId.textContent = `ЗАКАЗ ${orderCode}`;
  flowRefs.processDrink.textContent = flowState.selected.name;
  flowRefs.progressRing.style.strokeDashoffset = "603.19";
  setFlowFinishVisible(false);
  setFlowProcessVisible(true);
  renderFlowProcess();
  flowState.timer = window.setInterval(renderFlowProcess, 200);
}

function finishFlowOrder() {
  if (!flowState.process) return;
  window.clearInterval(flowState.timer);
  const completed = flowState.process;
  flowState.process = null;
  flowState.queue = Math.max(0, flowState.queue - 1);
  flowRefs.queueCount.textContent = String(flowState.queue).padStart(2, "0");
  flowRefs.finishCode.textContent = completed.orderCode;
  flowRefs.finishSummary.textContent = `${completed.name} · ${completed.summary}`;
  setFlowProcessVisible(false);
  setFlowFinishVisible(true);

  if (flowState.sound) {
    flowRefs.audio.currentTime = 0;
    flowRefs.audio.play().catch(() => showFlowToast("Напиток готов.", false));
  }
}

function resetFlowForNext() {
  setFlowFinishVisible(false);
  flowState.orderNumber += 1;
  clearFlowOrder();
}

function stopFlowConfirmed() {
  window.clearInterval(flowState.timer);
  flowState.process = null;
  setFlowProcessVisible(false);
  clearFlowOrder();
  showFlowToast("Цикл остановлен. Запущена обязательная промывка.", true);
}

flowRefs.categories.addEventListener("click", (event) => {
  const button = event.target.closest("[data-flow-category]");
  if (!button) return;
  flowState.category = button.dataset.flowCategory;
  flowState.query = "";
  flowRefs.search.value = "";
  renderFlowCategories();
  renderFlowDrinks();
});

flowRefs.drinks.addEventListener("click", (event) => {
  const button = event.target.closest("[data-flow-drink]");
  if (button) selectFlowDrink(button.dataset.flowDrink);
});

flowRefs.orderForm.addEventListener("click", (event) => {
  const button = event.target.closest("[data-flow-option-group]");
  if (!button || button.disabled) return;
  selectFlowOption(button.dataset.flowOptionGroup, button.dataset.flowOptionValue);
});

flowRefs.orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  startFlowOrder();
});

flowRefs.search.addEventListener("input", () => {
  flowState.query = flowRefs.search.value;
  renderFlowDrinks();
});

flowRefs.search.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    flowRefs.search.value = "";
    flowState.query = "";
    renderFlowDrinks();
    flowRefs.search.blur();
  }
});

flowRefs.clear.addEventListener("click", clearFlowOrder);
flowRefs.repeat.addEventListener("click", () => selectFlowDrink("cappuccino"));
flowRefs.materials.addEventListener("click", () => {
  showFlowToast("Низкий остаток: банановый сироп — 1 порция.", true);
});

flowRefs.sound.addEventListener("click", () => {
  flowState.sound = !flowState.sound;
  flowRefs.sound.setAttribute("aria-pressed", String(flowState.sound));
  flowRefs.sound.textContent = flowState.sound ? "ЗВУК" : "ТИХО";
  showFlowToast(flowState.sound ? "Звуковые подтверждения включены." : "Звук выключен.");
});

flowRefs.stop.addEventListener("click", () => flowRefs.dialog.showModal());
flowRefs.confirmStop.addEventListener("click", stopFlowConfirmed);
flowRefs.next.addEventListener("click", resetFlowForNext);

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== flowRefs.search) {
    event.preventDefault();
    flowRefs.search.focus();
    return;
  }

  if (document.activeElement === flowRefs.search) return;

  if (/^[1-8]$/.test(event.key) && !flowState.process) {
    const drink = visibleFlowDrinks()[Number(event.key) - 1];
    if (drink) selectFlowDrink(drink.id);
    return;
  }

  if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
    const currentIndex = flowCategories.findIndex((category) => category.id === flowState.category);
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (currentIndex + delta + flowCategories.length) % flowCategories.length;
    flowState.category = flowCategories[nextIndex].id;
    flowState.query = "";
    flowRefs.search.value = "";
    renderFlowCategories();
    renderFlowDrinks();
    return;
  }

  if (event.key === "Enter") {
    if (!flowRefs.finish.hasAttribute("inert")) resetFlowForNext();
    else if (flowState.selected && !flowState.process) startFlowOrder();
  }

  if (event.key === "Escape" && flowState.selected && !flowState.process) clearFlowOrder();
});

updateFlowClock();
window.setInterval(updateFlowClock, 30000);
renderFlowCategories();
renderFlowDrinks();
