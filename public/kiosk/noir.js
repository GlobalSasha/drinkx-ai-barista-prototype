const DESIGN_WIDTH = 800;
const DESIGN_HEIGHT = 1280;
const drinks = [
  {
    id: "americano",
    name: "АМЕРИКАНО",
    category: "coffee",
    volume: "350 МЛ",
    price: 190,
    defaults: { volume: "350 МЛ", milk: "БЕЗ МОЛОКА", syrup: "БЕЗ СИРОПА", sugar: "БЕЗ САХАРА" },
  },
  {
    id: "flat",
    name: "ФЛЭТ УАЙТ",
    category: "coffee",
    volume: "250 МЛ",
    price: 220,
    defaults: { volume: "250 МЛ", milk: "ОБЫЧНОЕ", syrup: "БЕЗ СИРОПА", sugar: "БЕЗ САХАРА" },
  },
  {
    id: "latte",
    name: "ЛАТТЕ",
    category: "coffee",
    volume: "350 МЛ",
    price: 230,
    defaults: { volume: "350 МЛ", milk: "ОБЫЧНОЕ", syrup: "БЕЗ СИРОПА", sugar: "БЕЗ САХАРА" },
  },
  {
    id: "raf",
    name: "РАФ",
    category: "coffee",
    volume: "350 МЛ",
    price: 260,
    defaults: { volume: "350 МЛ", milk: "ОБЫЧНОЕ", syrup: "ВАНИЛЬ", sugar: "БЕЗ САХАРА" },
  },
  {
    id: "matcha",
    name: "МАТЧА",
    category: "other",
    volume: "350 МЛ",
    price: 250,
    defaults: { volume: "350 МЛ", milk: "ОВСЯНОЕ", syrup: "БЕЗ СИРОПА", sugar: "БЕЗ САХАРА" },
  },
  {
    id: "cacao",
    name: "КАКАО",
    category: "other",
    volume: "350 МЛ",
    price: 210,
    defaults: { volume: "350 МЛ", milk: "ОБЫЧНОЕ", syrup: "ШОКОЛАД", sugar: "БЕЗ САХАРА" },
  },
];

const optionValues = {
  volume: ["250 МЛ", "350 МЛ", "450 МЛ"],
  milk: ["БЕЗ МОЛОКА", "ОВСЯНОЕ", "ОБЫЧНОЕ"],
  syrup: ["БЕЗ СИРОПА", "ВАНИЛЬ", "КАРАМЕЛЬ", "ФУНДУК", "ШОКОЛАД"],
  sugar: ["БЕЗ САХАРА", "1 ЛОЖКА", "2 ЛОЖКИ"],
};

const optionLabels = { volume: "РАЗМЕР", milk: "МОЛОКО", syrup: "СИРОП", sugar: "САХАР" };

const state = {
  filter: "all",
  selectedId: "americano",
  options: { ...drinks[0].defaults },
  orderCount: 0,
  orderTotal: 0,
  lastOrder: null,
};

const drinkGrid = document.querySelector("#noir-drinks");
const filterButtons = document.querySelectorAll(".noir-category");
const settings = document.querySelector("#noir-settings");
const configTitle = document.querySelector("#noir-config-title");
const configPrice = document.querySelector("#noir-config-price");
const customAddButton = document.querySelector("#noir-add-custom");
const customAddLabel = document.querySelector("#noir-add-custom-label");
const orderCount = document.querySelector("#noir-order-count");
const orderTotal = document.querySelector("#noir-order-total");
const orderSummary = document.querySelector("#noir-order-summary");
const resetButton = document.querySelector("#noir-reset");
const toast = document.querySelector("#noir-toast");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let toastTimer;
let fitFrame;

function fitNoirToViewport() {
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

  document.documentElement.style.setProperty("--noir-scale", scale.toFixed(5));
  document.documentElement.style.setProperty("--noir-fit-width", `${(DESIGN_WIDTH * scale).toFixed(2)}px`);
  document.documentElement.style.setProperty("--noir-fit-height", `${(DESIGN_HEIGHT * scale).toFixed(2)}px`);
}

function scheduleFit() {
  if (fitFrame) window.cancelAnimationFrame(fitFrame);
  fitFrame = window.requestAnimationFrame(() => {
    fitFrame = null;
    fitNoirToViewport();
  });
}

function selectedDrink() {
  return drinks.find((drink) => drink.id === state.selectedId) || drinks[0];
}

function visibleDrinks() {
  return state.filter === "all" ? drinks : drinks.filter((drink) => drink.category === state.filter);
}

function price(value) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

function setSelectedDrink(id) {
  const drink = drinks.find((item) => item.id === id);
  if (!drink) return;

  state.selectedId = id;
  state.options = { ...drink.defaults };
  render();
}

function renderDrinks() {
  drinkGrid.innerHTML = visibleDrinks()
    .map(
      (drink) => `
        <li class="noir-drink${drink.id === state.selectedId ? " is-selected" : ""}">
          <button class="noir-quick-add" type="button" data-quick-add="${drink.id}" aria-label="Быстро добавить ${drink.name} за ${price(drink.price)}">
            <span class="noir-drink__index">${String(drinks.indexOf(drink) + 1).padStart(2, "0")}</span>
            <h3>${drink.name}</h3>
            <span class="noir-drink__meta"><span>${drink.volume}</span><strong>+ ${price(drink.price)}</strong></span>
          </button>
          <button class="noir-customize" type="button" data-customize="${drink.id}" aria-label="Настроить ${drink.name}">НАСТРОИТЬ <span aria-hidden="true">→</span></button>
        </li>
      `,
    )
    .join("");
}

function renderSettings() {
  settings.innerHTML = Object.entries(optionLabels)
    .map(
      ([key, label]) => `
        <label class="noir-setting">
          <small>${label}</small>
          <select data-setting="${key}" aria-label="${label} для выбранного напитка">
            ${optionValues[key].map((value) => `<option value="${value}"${value === state.options[key] ? " selected" : ""}>${value}</option>`).join("")}
          </select>
        </label>
      `,
    )
    .join("");
}

function renderOrder() {
  const drink = selectedDrink();
  configTitle.textContent = drink.name;
  configPrice.textContent = price(drink.price);
  customAddLabel.textContent = `ДОБАВИТЬ ВАРИАНТ · ${price(drink.price)}`;
  orderCount.textContent = String(state.orderCount).padStart(2, "0");
  orderTotal.textContent = price(state.orderTotal);
  resetButton.disabled = state.orderCount === 0;
  orderSummary.textContent = state.lastOrder
    ? `ПОСЛЕДНИЙ: ${state.lastOrder.name} · ${state.lastOrder.volume} · ${state.lastOrder.milk} · ${state.lastOrder.syrup} · ${state.lastOrder.sugar}`
    : "ВЫБЕРИТЕ НАПИТОК";
}

function render() {
  renderDrinks();
  renderSettings();
  renderOrder();
}

window.addEventListener("resize", scheduleFit, { passive: true });
window.visualViewport?.addEventListener("resize", scheduleFit, { passive: true });

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), reducedMotion.matches ? 1200 : 2200);
}

function addSelectedDrink(isCustom = false) {
  const drink = selectedDrink();
  state.orderCount += 1;
  state.orderTotal += drink.price;
  state.lastOrder = { name: drink.name, ...state.options };
  renderOrder();
  showToast(isCustom ? `${drink.name} С ИЗМЕНЕНИЯМИ ДОБАВЛЕН` : `${drink.name} ДОБАВЛЕН В ЗАКАЗ`);
}

drinkGrid.addEventListener("click", (event) => {
  const quickAdd = event.target.closest("[data-quick-add]");
  const customize = event.target.closest("[data-customize]");

  if (quickAdd) {
    setSelectedDrink(quickAdd.dataset.quickAdd);
    addSelectedDrink();
  }

  if (customize) {
    setSelectedDrink(customize.dataset.customize);
    document.querySelector("#noir-config-title").focus({ preventScroll: true });
    showToast("НАСТРОЙТЕ РЕЦЕПТ И ДОБАВЬТЕ ВАРИАНТ");
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    renderDrinks();
  });
});

settings.addEventListener("change", (event) => {
  const select = event.target.closest("select[data-setting]");
  if (!select) return;

  state.options[select.dataset.setting] = select.value;
});

customAddButton.addEventListener("click", () => addSelectedDrink(true));

resetButton.addEventListener("click", () => {
  state.orderCount = 0;
  state.orderTotal = 0;
  state.lastOrder = null;
  renderOrder();
  showToast("НОВЫЙ ЗАКАЗ ГОТОВ");
});

fitNoirToViewport();
render();
