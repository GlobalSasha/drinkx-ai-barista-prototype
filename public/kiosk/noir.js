const drinks = [
  {
    id: "americano",
    name: "АМЕРИКАНО",
    volume: "350 МЛ",
    price: 190,
    defaults: { volume: "350 МЛ", milk: "БЕЗ МОЛОКА", sugar: "БЕЗ САХАРА" },
  },
  {
    id: "flat",
    name: "ФЛЭТ УАЙТ",
    volume: "250 МЛ",
    price: 220,
    defaults: { volume: "250 МЛ", milk: "ОБЫЧНОЕ", sugar: "БЕЗ САХАРА" },
  },
  {
    id: "latte",
    name: "ЛАТТЕ",
    volume: "350 МЛ",
    price: 230,
    defaults: { volume: "350 МЛ", milk: "ОБЫЧНОЕ", sugar: "БЕЗ САХАРА" },
  },
  {
    id: "raf",
    name: "РАФ",
    volume: "350 МЛ",
    price: 260,
    defaults: { volume: "350 МЛ", milk: "ОБЫЧНОЕ", sugar: "БЕЗ САХАРА" },
  },
  {
    id: "matcha",
    name: "МАТЧА",
    volume: "350 МЛ",
    price: 250,
    defaults: { volume: "350 МЛ", milk: "ОВСЯНОЕ", sugar: "БЕЗ САХАРА" },
  },
  {
    id: "cacao",
    name: "КАКАО",
    volume: "350 МЛ",
    price: 210,
    defaults: { volume: "350 МЛ", milk: "ОБЫЧНОЕ", sugar: "БЕЗ САХАРА" },
  },
];

const optionValues = {
  volume: ["250 МЛ", "350 МЛ", "450 МЛ"],
  milk: ["БЕЗ МОЛОКА", "ОВСЯНОЕ", "ОБЫЧНОЕ"],
  sugar: ["БЕЗ САХАРА", "1 ЛОЖКА", "2 ЛОЖКИ"],
};

const optionLabels = { volume: "ОБЪЁМ", milk: "МОЛОКО", sugar: "САХАР" };

const state = {
  selectedId: "americano",
  options: { ...drinks[0].defaults },
  orderCount: 0,
  orderTotal: 0,
  lastOrder: null,
};

const drinkGrid = document.querySelector("#noir-drinks");
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

function selectedDrink() {
  return drinks.find((drink) => drink.id === state.selectedId) || drinks[0];
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
  drinkGrid.innerHTML = drinks
    .map(
      (drink, index) => `
        <li class="noir-drink${drink.id === state.selectedId ? " is-selected" : ""}">
          <button class="noir-quick-add" type="button" data-quick-add="${drink.id}" aria-label="Быстро добавить ${drink.name} за ${price(drink.price)}">
            <span class="noir-drink__index">0${index + 1}</span>
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
        <button class="noir-setting" type="button" data-setting="${key}" aria-label="${label}: ${state.options[key]}. Нажмите, чтобы изменить.">
          <small>${label}</small>
          <span>${state.options[key]}</span>
          <b aria-hidden="true">↻</b>
        </button>
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
    ? `ПОСЛЕДНИЙ: ${state.lastOrder.name} · ${state.lastOrder.volume} · ${state.lastOrder.milk} · ${state.lastOrder.sugar}`
    : "ВЫБЕРИТЕ НАПИТОК";
}

function render() {
  renderDrinks();
  renderSettings();
  renderOrder();
}

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

settings.addEventListener("click", (event) => {
  const button = event.target.closest("[data-setting]");
  if (!button) return;

  const key = button.dataset.setting;
  const values = optionValues[key];
  const nextIndex = (values.indexOf(state.options[key]) + 1) % values.length;
  state.options[key] = values[nextIndex];
  renderSettings();
});

customAddButton.addEventListener("click", () => addSelectedDrink(true));

resetButton.addEventListener("click", () => {
  state.orderCount = 0;
  state.orderTotal = 0;
  state.lastOrder = null;
  renderOrder();
  showToast("НОВЫЙ ЗАКАЗ ГОТОВ");
});

render();
