const drinks = [
  { id: "americano", name: "АМЕРИКАНО", type: "coffee", volume: "350 МЛ", price: 190 },
  { id: "flat", name: "ФЛЭТ УАЙТ", type: "coffee", volume: "250 МЛ", price: 220 },
  { id: "latte", name: "ЛАТТЕ", type: "coffee", volume: "350 МЛ", price: 230 },
  { id: "raf", name: "РАФ", type: "coffee", volume: "350 МЛ", price: 260 },
  { id: "matcha", name: "МАТЧА", type: "other", volume: "350 МЛ", price: 250 },
  { id: "cacao", name: "КАКАО", type: "other", volume: "350 МЛ", price: 210 },
];

const state = {
  filter: "all",
  selectedId: "americano",
  orderCount: 0,
  options: {
    volume: "350 МЛ",
    milk: "БЕЗ МОЛОКА",
    sugar: "БЕЗ САХАРА",
  },
};

const drinkGrid = document.querySelector("#noir-drinks");
const filterButtons = document.querySelectorAll(".noir-filter");
const configTitle = document.querySelector("#noir-config-title");
const menuNote = document.querySelector("#noir-menu-note");
const addButton = document.querySelector("#noir-add");
const addLabel = document.querySelector("#noir-add-label");
const orderCount = document.querySelector("#noir-order-count");
const orderSummary = document.querySelector("#noir-order-summary");
const toast = document.querySelector("#noir-toast");
const optionButtons = document.querySelectorAll(".noir-option");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let toastTimer;

function selectedDrink() {
  return drinks.find((drink) => drink.id === state.selectedId) || drinks[0];
}

function visibleDrinks() {
  return state.filter === "all" ? drinks : drinks.filter((drink) => drink.type === state.filter);
}

function renderDrinks() {
  const visible = visibleDrinks();
  drinkGrid.innerHTML = drinks
    .map((drink, index) => {
      const isVisible = visible.some((visibleDrink) => visibleDrink.id === drink.id);
      const isSelected = drink.id === state.selectedId;
      return `
        <button
          class="noir-drink${isSelected ? " is-selected" : ""}"
          type="button"
          data-drink-id="${drink.id}"
          role="listitem"
          aria-pressed="${isSelected}"
          ${isVisible ? "" : "hidden"}
        >
          <span class="noir-drink__index">0${index + 1}</span>
          <h3>${drink.name}</h3>
          <span class="noir-drink__meta"><span>${drink.volume}</span><span>${drink.price} ₽</span></span>
        </button>
      `;
    })
    .join("");

  menuNote.textContent = `0${visible.length} ${visible.length === 1 ? "ПОЗИЦИЯ" : "ПОЗИЦИЙ"} / СЕЙЧАС`;
}

function renderSelection() {
  const drink = selectedDrink();
  configTitle.textContent = drink.name;
  addLabel.textContent = `ДОБАВИТЬ · ${drink.price} ₽`;
  orderSummary.textContent =
    state.orderCount > 0
      ? `${drink.name} · ${state.options.volume} · ${state.options.milk}`
      : `ВЫБРАНО: ${drink.name} · ${drink.price} ₽`;
  orderCount.textContent = String(state.orderCount).padStart(2, "0");
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), reducedMotion.matches ? 1200 : 2600);
}

function selectDrink(id) {
  state.selectedId = id;
  renderDrinks();
  renderSelection();
}

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

drinkGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-drink-id]");
  if (button) selectDrink(button.dataset.drinkId);
});

optionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const option = button.dataset.option;
    const values = {
      volume: ["250 МЛ", "350 МЛ", "450 МЛ"],
      milk: ["БЕЗ МОЛОКА", "ОВСЯНОЕ", "ОБЫЧНОЕ"],
      sugar: ["БЕЗ САХАРА", "1 ЛОЖКА", "2 ЛОЖКИ"],
    }[option];
    const nextIndex = (values.indexOf(state.options[option]) + 1) % values.length;
    state.options[option] = values[nextIndex];
    button.querySelector("span").textContent = state.options[option];
    renderSelection();
  });
});

addButton.addEventListener("click", () => {
  const drink = selectedDrink();
  state.orderCount += 1;
  renderSelection();
  showToast(`${drink.name} ДОБАВЛЕН В ЗАКАЗ`);
});

renderDrinks();
renderSelection();
