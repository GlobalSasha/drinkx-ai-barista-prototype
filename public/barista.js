const drinks = [
  { name: "Капучино", categories: ["popular", "coffee"], milk: true, duration: 25 },
  { name: "Латте", categories: ["popular", "coffee"], milk: true, duration: 28 },
  { name: "Американо", categories: ["popular", "coffee"], duration: 18 },
  { name: "Флэт уайт", categories: ["popular", "coffee"], milk: true, duration: 24 },
  { name: "Раф", categories: ["popular", "coffee"], milk: true, duration: 30 },
  { name: "Эспрессо", categories: ["coffee"], duration: 14 },
  { name: "Лунго", categories: ["coffee"], duration: 18 },
  { name: "Мокка", categories: ["coffee"], milk: true, duration: 28 },
  { name: "Какао", categories: ["popular", "coffee"], milk: true, duration: 26 },

  { name: "Латте Баунти", categories: ["popular", "signature-coffee"], milk: true, signature: true, duration: 30 },
  { name: "Фудзи раф", categories: ["signature-coffee"], milk: true, signature: true, duration: 32 },
  { name: "Рафкранч", categories: ["signature-coffee"], milk: true, signature: true, duration: 32 },
  { name: "Баннофи", categories: ["signature-coffee"], milk: true, signature: true, duration: 30 },
  { name: "Солёный миндаль", categories: ["signature-coffee"], milk: true, signature: true, duration: 29 },
  { name: "Клубничный пломбир", categories: ["signature-coffee"], milk: true, signature: true, duration: 30 },
  { name: "Латте банан-кокос", categories: ["signature-coffee"], milk: true, signature: true, duration: 31 },
  { name: "Раф клубника-банан", categories: ["signature-coffee"], milk: true, signature: true, duration: 32 },

  { name: "Чёрный чай", categories: ["tea"], duration: 23 },
  { name: "Зелёный чай", categories: ["tea"], duration: 23 },
  { name: "Жасминовый чай", categories: ["tea"], duration: 23 },
  { name: "Каркаде", categories: ["tea"], duration: 24 },
  { name: "Матча латте", categories: ["popular", "tea"], milk: true, duration: 28 },

  { name: "Сезон Сакуры", categories: ["signature-tea"], signature: true, duration: 27 },
  { name: "Жасмин-земляника", categories: ["signature-tea"], signature: true, duration: 27 },
  { name: "Груша-жасмин", categories: ["signature-tea"], signature: true, duration: 27 },
  { name: "Райский остров", categories: ["signature-tea"], signature: true, duration: 28 },
  { name: "Сад лунного цветка", categories: ["signature-tea"], signature: true, duration: 28 },
  { name: "Изумрудный чай", categories: ["signature-tea"], signature: true, duration: 26 },

  { name: "Юдзу", categories: ["popular", "lemonade", "cold"], cold: true, duration: 20 },
  { name: "Кариб", categories: ["lemonade", "cold"], cold: true, duration: 20 },
  { name: "Манго-маракуйя", categories: ["lemonade", "cold"], cold: true, duration: 21 },
  { name: "Земляника-шисо", categories: ["lemonade", "cold"], cold: true, duration: 21 },

  { name: "Айс латте", categories: ["popular", "cold"], milk: true, cold: true, duration: 24 },
  { name: "Вьетнамский бамбл", categories: ["popular", "cold"], cold: true, signature: true, duration: 25 },
  { name: "Колдбрю вишня", categories: ["cold"], cold: true, duration: 21 },
  { name: "Айс матча", categories: ["cold"], milk: true, cold: true, duration: 25 },
  { name: "Айс-ти яблоко", categories: ["cold"], cold: true, duration: 22 },
  { name: "Айс-ти манго", categories: ["cold"], cold: true, duration: 22 }
];

const categories = [
  { id: "popular", label: "Популярное" },
  { id: "coffee", label: "Кофе" },
  { id: "signature-coffee", label: "Авторский кофе" },
  { id: "tea", label: "Чаи" },
  { id: "signature-tea", label: "Авторские чаи" },
  { id: "lemonade", label: "Лимонады" },
  { id: "cold", label: "Холодные" }
];

const modifierConfig = {
  size: {
    title: "Размер",
    options: ["S", "M", "L"]
  },
  milk: {
    title: "Молоко",
    options: ["Обычное", "Овсяное", "Миндальное", "Кокосовое", "Безлактозное"]
  },
  syrup: {
    title: "Сироп",
    options: [
      "Без сиропа",
      "Ваниль",
      "Карамель",
      "Лесной орех",
      "Шоколад",
      "Кокос",
      "Мята",
      "Клубника",
      "Банан",
      "Лаванда"
    ]
  },
  sugar: {
    title: "Сахар",
    options: ["Без сахара", "1 порция", "2 порции", "3 порции"]
  }
};

const defaults = {
  size: "M",
  milk: "Обычное",
  syrup: "Без сиропа",
  sugar: "Без сахара"
};

const recipeParameterConfig = {
  extractVolume: {
    label: "Порция кофейного экстракта",
    hint: "Количество экстракта на одну порцию",
    min: 10,
    max: 80,
    step: 1,
    unit: "мл"
  },
  extractAeration: {
    label: "Аэрация кофейного экстракта",
    hint: "Насыщение экстракта воздухом",
    min: 0,
    max: 40,
    step: 1,
    unit: "%"
  },
  beverageVolume: {
    label: "Объём чёрного кофе",
    hint: "Итоговый объём напитка",
    min: 30,
    max: 350,
    step: 5,
    unit: "мл"
  },
  hotWaterTemperature: {
    label: "Температура горячей воды",
    hint: "Температура воды для американо",
    min: 70,
    max: 96,
    step: 1,
    unit: "°C"
  },
  milkTemperature: {
    label: "Температура молока",
    hint: "Допустимый диапазон от 4 до 75 градусов",
    min: 4,
    max: 75,
    step: 1,
    unit: "°C"
  },
  foamDensity: {
    label: "Плотность молочной пены",
    hint: "Чем выше значение, тем плотнее пена",
    min: 0,
    max: 100,
    step: 1,
    unit: "%"
  },
  foamTexture: {
    label: "Текстура молочной пены",
    hint: "От лёгкой текстуры к более кремовой",
    min: 0,
    max: 100,
    step: 1,
    unit: "%"
  },
  milkAeration: {
    label: "Аэрация молока",
    hint: "Процент воздуха в молочной пене",
    min: 0,
    max: 100,
    step: 1,
    unit: "%"
  },
  teaVolume: {
    label: "Порция чайного экстракта",
    hint: "Количество чайной основы в напитке",
    min: 20,
    max: 300,
    step: 5,
    unit: "мл"
  },
  syrupVolume: {
    label: "Порция сиропа",
    hint: "Количество сиропа на одну порцию",
    min: 0,
    max: 60,
    step: 1,
    unit: "мл"
  },
  coldWaterTemperature: {
    label: "Температура холодной воды",
    hint: "Температура воды для холодного напитка",
    min: 4,
    max: 25,
    step: 1,
    unit: "°C"
  }
};

const recipeStorageKey = "drinkx-barista-recipes-v1";

const cleaningInstructionSteps = [
  {
    title: "Помойте ёмкости",
    instruction: "Достаньте все ёмкости из холодильника и помойте их.",
    hint: "Убедитесь, что внутри не осталось продукта.",
    animation: "is-containers"
  },
  {
    title: "Подключите коннекторы",
    instruction: "Возьмите промывочную ёмкость и подключите к ней все коннекторы.",
    hint: "Проверьте, что каждый коннектор установлен плотно.",
    animation: "is-connectors"
  },
  {
    title: "Добавьте химию",
    instruction: "Добавьте химию в промывочную ёмкость.",
    hint: "Используйте установленную дозировку моющего средства.",
    animation: "is-chemistry"
  },
  {
    title: "Всё готово",
    instruction: "Комплекс подготовлен к автоматической мойке.",
    hint: "Не отключайте коннекторы до завершения 20-минутного цикла.",
    animation: "is-ready"
  }
];

const state = {
  category: "popular",
  modifiers: { ...defaults },
  openModifier: null,
  activeDrink: null,
  prepTimer: null,
  readyTimer: null,
  compatibilityTimer: null,
  cleaningTimer: null,
  cleaningStep: 0,
  recipeCategory: "coffee",
  activeRecipeDrink: "Капучино",
  recipeSettings: {},
  dirtyRecipes: new Set()
};

const visualStyle = document.body.dataset.visualStyle || "control";

const elements = {
  app: document.querySelector("#baristaApp"),
  categoryNav: document.querySelector("#categoryNav"),
  sectionTitle: document.querySelector("#sectionTitle"),
  sectionCount: document.querySelector("#sectionCount"),
  drinkGrid: document.querySelector("#drinkGrid"),
  changesPanel: document.querySelector("#changesPanel"),
  changesSummary: document.querySelector("#changesSummary"),
  resetButton: document.querySelector("#resetButton"),
  modifierButtons: [...document.querySelectorAll(".modifier-button")],
  values: {
    size: document.querySelector("#sizeValue"),
    milk: document.querySelector("#milkValue"),
    syrup: document.querySelector("#syrupValue"),
    sugar: document.querySelector("#sugarValue")
  },
  sheetBackdrop: document.querySelector("#sheetBackdrop"),
  optionSheet: document.querySelector("#optionSheet"),
  optionSheetTitle: document.querySelector("#optionSheetTitle"),
  optionGrid: document.querySelector("#optionGrid"),
  closeSheetButton: document.querySelector("#closeSheetButton"),
  preparationScreen: document.querySelector("#preparationScreen"),
  prepDrinkName: document.querySelector("#prepDrinkName"),
  prepTags: document.querySelector("#prepTags"),
  prepStage: document.querySelector("#prepStage"),
  prepTime: document.querySelector("#prepTime"),
  prepProgress: document.querySelector("#prepProgress"),
  demoFinishButton: document.querySelector("#demoFinishButton"),
  readyOverlay: document.querySelector("#readyOverlay"),
  readyDrinkName: document.querySelector("#readyDrinkName"),
  serviceButton: document.querySelector("#serviceButton"),
  serviceScreen: document.querySelector("#serviceScreen"),
  serviceCloseButton: document.querySelector("#serviceCloseButton"),
  openCleaningButton: document.querySelector("#openCleaningButton"),
  openRecipesButton: document.querySelector("#openRecipesButton"),
  cleaningScreen: document.querySelector("#cleaningScreen"),
  cleaningStatus: document.querySelector("#cleaningStatus"),
  cleaningSetup: document.querySelector("#cleaningSetup"),
  cleaningProcess: document.querySelector("#cleaningProcess"),
  cleaningComplete: document.querySelector("#cleaningComplete"),
  cleaningCancelButton: document.querySelector("#cleaningCancelButton"),
  cleaningBackButton: document.querySelector("#cleaningBackButton"),
  cleaningNextButton: document.querySelector("#cleaningNextButton"),
  cleaningStepTitle: document.querySelector("#cleaningStepTitle"),
  cleaningStepCount: document.querySelector("#cleaningStepCount"),
  cleaningStepLabel: document.querySelector("#cleaningStepLabel"),
  cleaningStepInstruction: document.querySelector("#cleaningStepInstruction"),
  cleaningStepHint: document.querySelector("#cleaningStepHint"),
  cleaningAnimation: document.querySelector("#cleaningAnimation"),
  cleaningStepProgress: [...document.querySelectorAll(".cleaning-step-progress span")],
  cleaningDemoFinishButton: document.querySelector("#cleaningDemoFinishButton"),
  cleaningCloseButton: document.querySelector("#cleaningCloseButton"),
  cleaningStage: document.querySelector("#cleaningStage"),
  cleaningTime: document.querySelector("#cleaningTime"),
  cleaningProgress: document.querySelector("#cleaningProgress"),
  recipeScreen: document.querySelector("#recipeScreen"),
  recipeStatus: document.querySelector("#recipeStatus"),
  recipeBackButton: document.querySelector("#recipeBackButton"),
  recipeCategoryNav: document.querySelector("#recipeCategoryNav"),
  recipeDrinkList: document.querySelector("#recipeDrinkList"),
  recipeEditorTitle: document.querySelector("#recipeEditorTitle"),
  recipeEditorMeta: document.querySelector("#recipeEditorMeta"),
  recipeDirtyMark: document.querySelector("#recipeDirtyMark"),
  recipeControls: document.querySelector("#recipeControls"),
  recipeResetButton: document.querySelector("#recipeResetButton"),
  recipeSaveButton: document.querySelector("#recipeSaveButton")
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isCoffeeDrink(drink) {
  return drink.categories.includes("coffee") || drink.categories.includes("signature-coffee");
}

function isTeaDrink(drink) {
  return drink.categories.includes("tea") || drink.categories.includes("signature-tea");
}

function getRecipeParameterKeys(drink) {
  const keys = [];
  const coffee = isCoffeeDrink(drink);
  const tea = isTeaDrink(drink);

  if (coffee) {
    keys.push("extractVolume", "extractAeration");
    if (!drink.milk) keys.push("beverageVolume");
    if (drink.name === "Американо") keys.push("hotWaterTemperature");
  }

  if (drink.milk) {
    keys.push("milkTemperature", "foamDensity", "foamTexture", "milkAeration");
  }

  if (tea) keys.push("teaVolume");
  if (drink.signature || drink.categories.includes("lemonade")) keys.push("syrupVolume");
  if (drink.cold) keys.push("coldWaterTemperature");

  return keys;
}

function getDefaultRecipe(drink) {
  const recipe = {};
  getRecipeParameterKeys(drink).forEach((key) => {
    const values = {
      extractVolume: drink.name === "Лунго" ? 45 : 30,
      extractAeration: 8,
      beverageVolume:
        drink.name === "Эспрессо" ? 30 : drink.name === "Лунго" ? 90 : drink.name === "Американо" ? 250 : 180,
      hotWaterTemperature: 92,
      milkTemperature: drink.cold ? 4 : 65,
      foamDensity: drink.name.includes("Латте") ? 35 : 58,
      foamTexture: 72,
      milkAeration: drink.name.includes("Латте") ? 28 : 42,
      teaVolume: 120,
      syrupVolume: 20,
      coldWaterTemperature: 8
    };
    recipe[key] = values[key];
  });
  return recipe;
}

function loadRecipeSettings() {
  let savedRecipes = {};
  try {
    savedRecipes = JSON.parse(window.localStorage.getItem(recipeStorageKey) || "{}");
  } catch {
    savedRecipes = {};
  }

  drinks.forEach((drink) => {
    state.recipeSettings[drink.name] = {
      ...getDefaultRecipe(drink),
      ...(savedRecipes[drink.name] || {})
    };
  });
}

function getRecipeTypeLabel(drink) {
  const parts = [];
  if (drink.milk) parts.push("Молочный");
  else if (isCoffeeDrink(drink)) parts.push("Чёрный кофе");
  else if (isTeaDrink(drink)) parts.push("Чай");
  else if (drink.categories.includes("lemonade")) parts.push("Лимонад");
  else parts.push("Холодный напиток");
  if (drink.signature) parts.push("авторский рецепт");
  if (drink.cold) parts.push("холодная подача");
  return parts.join(" · ");
}

function getRecipeDrinks() {
  return drinks.filter((drink) => drink.categories.includes(state.recipeCategory));
}

function renderRecipeCategories() {
  elements.recipeCategoryNav.innerHTML = categories
    .filter((category) => category.id !== "popular")
    .map(
      (category) => `
        <button
          type="button"
          class="${category.id === state.recipeCategory ? "is-active" : ""}"
          data-recipe-category="${category.id}"
          aria-pressed="${category.id === state.recipeCategory}"
        >
          ${escapeHtml(category.label)}
        </button>
      `
    )
    .join("");
}

function renderRecipeDrinkList() {
  const recipeDrinks = getRecipeDrinks();
  if (!recipeDrinks.some((drink) => drink.name === state.activeRecipeDrink)) {
    state.activeRecipeDrink = recipeDrinks[0]?.name || drinks[0].name;
  }

  elements.recipeDrinkList.innerHTML = recipeDrinks
    .map(
      (drink, index) => `
        <button
          type="button"
          class="${drink.name === state.activeRecipeDrink ? "is-active" : ""}"
          data-recipe-drink="${escapeHtml(drink.name)}"
        >
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong>${escapeHtml(drink.name)}</strong>
          ${state.dirtyRecipes.has(drink.name) ? '<small aria-label="Есть несохранённые изменения">●</small>' : ""}
        </button>
      `
    )
    .join("");
}

function renderRecipeEditor() {
  const drink = drinks.find((item) => item.name === state.activeRecipeDrink) || drinks[0];
  const recipe = state.recipeSettings[drink.name] || getDefaultRecipe(drink);
  const parameterKeys = getRecipeParameterKeys(drink);

  elements.recipeEditorTitle.textContent = drink.name;
  elements.recipeEditorMeta.textContent = getRecipeTypeLabel(drink);
  elements.recipeDirtyMark.hidden = !state.dirtyRecipes.has(drink.name);
  elements.recipeStatus.textContent = state.dirtyRecipes.has(drink.name) ? "Не сохранено" : "Настройка";
  elements.recipeControls.innerHTML = parameterKeys
    .map((key) => {
      const parameter = recipeParameterConfig[key];
      const value = recipe[key];
      return `
        <label class="recipe-control">
          <span class="recipe-control-copy">
            <strong>${escapeHtml(parameter.label)}</strong>
            <small>${escapeHtml(parameter.hint)}</small>
          </span>
          <span class="recipe-control-value">
            <output data-recipe-output="${key}">${value}</output>
            <small>${escapeHtml(parameter.unit)}</small>
          </span>
          <input
            type="range"
            min="${parameter.min}"
            max="${parameter.max}"
            step="${parameter.step}"
            value="${value}"
            data-recipe-parameter="${key}"
            aria-label="${escapeHtml(parameter.label)}"
          />
          <span class="recipe-range">
            <small>${parameter.min} ${escapeHtml(parameter.unit)}</small>
            <small>${parameter.max} ${escapeHtml(parameter.unit)}</small>
          </span>
        </label>
      `;
    })
    .join("");
}

function renderRecipeSettings() {
  renderRecipeCategories();
  renderRecipeDrinkList();
  renderRecipeEditor();
}

function selectRecipeCategory(categoryId) {
  state.recipeCategory = categoryId;
  renderRecipeSettings();
}

function selectRecipeDrink(drinkName) {
  state.activeRecipeDrink = drinkName;
  renderRecipeDrinkList();
  renderRecipeEditor();
}

function updateRecipeParameter(parameterKey, value) {
  const drinkName = state.activeRecipeDrink;
  if (!state.recipeSettings[drinkName] || !recipeParameterConfig[parameterKey]) return;

  state.recipeSettings[drinkName][parameterKey] = Number(value);
  state.dirtyRecipes.add(drinkName);
  const output = elements.recipeControls.querySelector(`[data-recipe-output="${parameterKey}"]`);
  if (output) output.textContent = value;
  elements.recipeDirtyMark.hidden = false;
  elements.recipeStatus.textContent = "Не сохранено";
  renderRecipeDrinkList();
}

function saveActiveRecipe() {
  const drinkName = state.activeRecipeDrink;
  try {
    window.localStorage.setItem(recipeStorageKey, JSON.stringify(state.recipeSettings));
  } catch {
    elements.recipeStatus.textContent = "Ошибка сохранения";
    return;
  }

  state.dirtyRecipes.delete(drinkName);
  elements.recipeStatus.textContent = "Сохранено";
  renderRecipeDrinkList();
  elements.recipeDirtyMark.hidden = true;
  window.setTimeout(() => {
    if (!state.dirtyRecipes.has(drinkName) && state.activeRecipeDrink === drinkName) {
      elements.recipeStatus.textContent = "Настройка";
    }
  }, 1600);
}

function resetActiveRecipe() {
  const drink = drinks.find((item) => item.name === state.activeRecipeDrink);
  if (!drink) return;
  state.recipeSettings[drink.name] = getDefaultRecipe(drink);
  state.dirtyRecipes.add(drink.name);
  renderRecipeDrinkList();
  renderRecipeEditor();
}

function getCategory() {
  return categories.find((category) => category.id === state.category) || categories[0];
}

function getVisibleDrinks() {
  return drinks.filter((drink) => drink.categories.includes(state.category)).slice(0, 12);
}

function renderCategories() {
  elements.categoryNav.innerHTML = categories
    .map(
      (category, index) => `
        <button
          class="category-button ${category.id === state.category ? "is-active" : ""}"
          type="button"
          data-category="${category.id}"
          aria-pressed="${category.id === state.category}"
        >
          ${
            visualStyle === "retro"
              ? `<span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(category.label)}`
              : visualStyle === "blueprint"
                ? `<span>SEC-${String(index + 1).padStart(2, "0")}</span>${escapeHtml(category.label)}`
                : escapeHtml(category.label)
          }
        </button>
      `
    )
    .join("");
}

function buildDrinkBadge(drink) {
  if (drink.cold) return '<span class="drink-badge is-cold">Холодный</span>';
  if (drink.signature) return '<span class="drink-badge is-signature">Авторский</span>';
  return "<span></span>";
}

function renderDrinks() {
  const category = getCategory();
  const visibleDrinks = getVisibleDrinks();
  elements.sectionTitle.textContent = category.label;
  elements.sectionCount.textContent = `${visibleDrinks.length} позиций`;
  elements.drinkGrid.innerHTML = visibleDrinks
    .map(
      (drink, index) => {
        const lotNumber = String(drinks.indexOf(drink) + 1).padStart(3, "0");
        const inventoryLabel =
          visualStyle === "retro"
            ? `<span class="drink-index">[${String(index + 1).padStart(2, "0")}]</span>`
            : visualStyle === "blueprint"
              ? `<span class="drink-index">LOT-${lotNumber}</span>`
              : "";

        return `
        <button class="drink-button" type="button" data-drink="${escapeHtml(drink.name)}">
          ${inventoryLabel}
          <strong>${escapeHtml(drink.name)}</strong>
          <span class="drink-meta">
            ${buildDrinkBadge(drink)}
            <span class="drink-duration">~${drink.duration} сек</span>
          </span>
        </button>
      `;
      }
    )
    .join("");
}

function getChangedModifiers() {
  return Object.entries(state.modifiers).filter(([key, value]) => value !== defaults[key]);
}

function renderModifiers() {
  Object.entries(state.modifiers).forEach(([key, value]) => {
    elements.values[key].textContent = value;
    const button = elements.modifierButtons.find((item) => item.dataset.modifier === key);
    button?.classList.toggle("is-changed", value !== defaults[key]);
  });

  const changed = getChangedModifiers();
  const hasChanges = changed.length > 0;
  elements.changesPanel.classList.toggle("has-changes", hasChanges);
  elements.resetButton.hidden = !hasChanges;
  elements.changesPanel.querySelector(".changes-label").textContent = hasChanges
    ? visualStyle === "retro"
      ? "> Заказ с изменениями"
      : visualStyle === "blueprint"
        ? "ORDER AMENDMENTS / ACTIVE"
        : "Заказ с изменениями"
    : visualStyle === "retro"
      ? "> Стандартный рецепт"
      : visualStyle === "blueprint"
        ? "ORDER AMENDMENTS / NONE"
        : "Стандартный рецепт";
  elements.changesSummary.textContent = hasChanges
    ? changed.map(([, value]) => value).join(" · ")
    : "Без изменений";
}

function renderAll() {
  renderCategories();
  renderDrinks();
  renderModifiers();
}

function selectCategory(categoryId) {
  state.category = categoryId;
  renderCategories();
  renderDrinks();
  elements.categoryNav
    .querySelector(`[data-category="${categoryId}"]`)
    ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
}

function openOptionSheet(modifierKey) {
  const config = modifierConfig[modifierKey];
  if (!config) return;

  state.openModifier = modifierKey;
  elements.optionSheetTitle.textContent = config.title;
  elements.optionGrid.innerHTML = config.options
    .map(
      (option) => `
        <button
          class="option-button ${state.modifiers[modifierKey] === option ? "is-selected" : ""}"
          type="button"
          data-option="${escapeHtml(option)}"
        >
          ${escapeHtml(option)}
        </button>
      `
    )
    .join("");
  elements.sheetBackdrop.hidden = false;
  elements.optionSheet.hidden = false;
  elements.optionGrid.querySelector(".is-selected")?.focus();
}

function closeOptionSheet() {
  state.openModifier = null;
  elements.sheetBackdrop.hidden = true;
  elements.optionSheet.hidden = true;
}

function selectOption(option) {
  if (!state.openModifier) return;
  state.modifiers[state.openModifier] = option;
  renderModifiers();
  closeOptionSheet();
}

function resetModifiers() {
  if (state.compatibilityTimer) {
    window.clearTimeout(state.compatibilityTimer);
    state.compatibilityTimer = null;
  }
  state.modifiers = { ...defaults };
  elements.changesPanel.classList.remove("has-error");
  renderModifiers();
}

function formatTime(seconds) {
  return `00:${String(Math.max(0, seconds)).padStart(2, "0")}`;
}

function formatCleaningTime(seconds) {
  const minutes = Math.floor(Math.max(0, seconds) / 60);
  const remainder = Math.max(0, seconds) % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function buildPreparationTags(drink) {
  const tags = [
    { label: `Размер ${state.modifiers.size}`, changed: state.modifiers.size !== defaults.size },
    {
      label: drink.milk ? state.modifiers.milk : "Без молока",
      changed: drink.milk && state.modifiers.milk !== defaults.milk
    },
    {
      label: state.modifiers.syrup,
      changed: state.modifiers.syrup !== defaults.syrup
    },
    {
      label: state.modifiers.sugar,
      changed: state.modifiers.sugar !== defaults.sugar
    }
  ];

  return tags
    .map(
      (tag) => `
        <span class="prep-tag ${tag.changed ? "is-changed" : ""}">
          ${escapeHtml(tag.label)}
        </span>
      `
    )
    .join("");
}

function showCompatibilityError(drink) {
  if (state.compatibilityTimer) window.clearTimeout(state.compatibilityTimer);

  elements.changesPanel.classList.add("has-error");
  elements.changesPanel.querySelector(".changes-label").textContent = "Несовместимая настройка";
  elements.changesSummary.textContent = `Для «${drink.name}» молоко не используется`;
  elements.resetButton.hidden = false;

  state.compatibilityTimer = window.setTimeout(() => {
    state.compatibilityTimer = null;
    elements.changesPanel.classList.remove("has-error");
    renderModifiers();
  }, 2800);
}

function startPreparation(drinkName) {
  const drink = drinks.find((item) => item.name === drinkName);
  if (!drink || state.prepTimer) return;

  if (!drink.milk && state.modifiers.milk !== defaults.milk) {
    showCompatibilityError(drink);
    return;
  }

  closeOptionSheet();
  state.activeDrink = {
    ...drink,
    modifiers: { ...state.modifiers }
  };

  elements.prepDrinkName.textContent = drink.name;
  elements.readyDrinkName.textContent = drink.name;
  elements.prepTags.innerHTML = buildPreparationTags(drink);
  elements.prepProgress.style.width = "0%";
  elements.prepTime.textContent = formatTime(drink.duration);
  elements.prepStage.textContent = "Подготовка ингредиентов";
  elements.preparationScreen.hidden = false;

  const total = drink.duration;
  let elapsed = 0;
  state.prepTimer = window.setInterval(() => {
    elapsed += 1;
    const remaining = total - elapsed;
    const progress = Math.min(100, (elapsed / total) * 100);
    elements.prepProgress.style.width = `${progress}%`;
    elements.prepTime.textContent = formatTime(remaining);

    if (progress < 30) elements.prepStage.textContent = "Подготовка ингредиентов";
    else if (progress < 78) elements.prepStage.textContent = "Смешивание напитка";
    else elements.prepStage.textContent = "Завершение";

    if (elapsed >= total) finishPreparation();
  }, 250);
}

function finishPreparation() {
  if (state.prepTimer) {
    window.clearInterval(state.prepTimer);
    state.prepTimer = null;
  }

  elements.prepProgress.style.width = "100%";
  elements.prepTime.textContent = "00:00";
  elements.prepStage.textContent = "Напиток готов";
  elements.readyOverlay.hidden = false;

  state.readyTimer = window.setTimeout(() => {
    elements.readyOverlay.hidden = true;
    elements.preparationScreen.hidden = true;
    state.activeDrink = null;
    state.readyTimer = null;
    resetModifiers();
    selectCategory("popular");
  }, 1700);
}

function openService() {
  if (state.prepTimer || state.activeDrink) return;
  closeOptionSheet();
  elements.cleaningScreen.hidden = true;
  elements.recipeScreen.hidden = true;
  elements.serviceScreen.hidden = false;
}

function closeService() {
  elements.serviceScreen.hidden = true;
  elements.recipeScreen.hidden = true;
}

function openRecipes() {
  elements.serviceScreen.hidden = true;
  elements.recipeScreen.hidden = false;
  renderRecipeSettings();
}

function closeRecipes() {
  elements.recipeScreen.hidden = true;
  elements.serviceScreen.hidden = false;
}

function setCleaningPhase(phase) {
  elements.cleaningSetup.hidden = phase !== "setup";
  elements.cleaningProcess.hidden = phase !== "process";
  elements.cleaningComplete.hidden = phase !== "complete";

  if (phase === "setup") elements.cleaningStatus.textContent = "Подготовка";
  if (phase === "process") elements.cleaningStatus.textContent = "Мойка 20 мин";
  if (phase === "complete") elements.cleaningStatus.textContent = "Завершено";
}

function renderCleaningStep() {
  const step = cleaningInstructionSteps[state.cleaningStep];
  const isLastStep = state.cleaningStep === cleaningInstructionSteps.length - 1;

  elements.cleaningStepTitle.textContent = step.title;
  elements.cleaningStepCount.textContent =
    `${String(state.cleaningStep + 1).padStart(2, "0")} / ${String(cleaningInstructionSteps.length).padStart(2, "0")}`;
  elements.cleaningStepLabel.textContent = isLastStep ? "Подготовка завершена" : `Шаг ${state.cleaningStep + 1}`;
  elements.cleaningStepInstruction.textContent = step.instruction;
  elements.cleaningStepHint.textContent = step.hint;
  elements.cleaningAnimation.className = `cleaning-animation ${step.animation}`;
  elements.cleaningBackButton.disabled = state.cleaningStep === 0;
  elements.cleaningNextButton.textContent = isLastStep ? "Запустить мойку" : "Готово, далее";
  elements.cleaningStepProgress.forEach((item, index) => {
    item.classList.toggle("is-active", index <= state.cleaningStep);
    item.classList.toggle("is-current", index === state.cleaningStep);
  });
}

function resetCleaningSetup() {
  state.cleaningStep = 0;
  renderCleaningStep();
  elements.cleaningProgress.style.width = "0%";
  elements.cleaningTime.textContent = "20:00";
  elements.cleaningStage.textContent = "Промывка системы";
}

function openCleaning() {
  if (state.prepTimer || state.activeDrink) return;
  closeOptionSheet();
  elements.serviceScreen.hidden = true;
  resetCleaningSetup();
  setCleaningPhase("setup");
  elements.cleaningScreen.hidden = false;
}

function closeCleaning(returnToService = true) {
  if (state.cleaningTimer) {
    window.clearInterval(state.cleaningTimer);
    state.cleaningTimer = null;
  }
  elements.cleaningScreen.hidden = true;
  resetCleaningSetup();
  setCleaningPhase("setup");
  elements.serviceScreen.hidden = !returnToService;
}

function previousCleaningStep() {
  if (state.cleaningStep === 0) return;
  state.cleaningStep -= 1;
  renderCleaningStep();
}

function nextCleaningStep() {
  if (state.cleaningStep < cleaningInstructionSteps.length - 1) {
    state.cleaningStep += 1;
    renderCleaningStep();
    return;
  }

  startCleaning();
}

function startCleaning() {
  if (state.cleaningStep !== cleaningInstructionSteps.length - 1 || state.cleaningTimer) return;
  setCleaningPhase("process");
  const totalSeconds = 20 * 60;
  let elapsedSeconds = 0;
  elements.cleaningProgress.style.width = "0%";
  elements.cleaningTime.textContent = formatCleaningTime(totalSeconds);

  state.cleaningTimer = window.setInterval(() => {
    elapsedSeconds += 60;
    const progress = Math.min(100, (elapsedSeconds / totalSeconds) * 100);
    const remaining = Math.max(0, totalSeconds - elapsedSeconds);
    elements.cleaningProgress.style.width = `${progress}%`;
    elements.cleaningTime.textContent = formatCleaningTime(remaining);

    if (progress < 35) elements.cleaningStage.textContent = "Промывка системы";
    else if (progress < 75) elements.cleaningStage.textContent = "Циркуляция моющего раствора";
    else elements.cleaningStage.textContent = "Финальное ополаскивание";

    if (elapsedSeconds >= totalSeconds) finishCleaning();
  }, 500);
}

function finishCleaning() {
  if (state.cleaningTimer) {
    window.clearInterval(state.cleaningTimer);
    state.cleaningTimer = null;
  }
  elements.cleaningProgress.style.width = "100%";
  elements.cleaningTime.textContent = "00:00";
  elements.cleaningStage.textContent = "Мойка завершена";
  setCleaningPhase("complete");
}

elements.categoryNav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (button) selectCategory(button.dataset.category);
});

elements.drinkGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-drink]");
  if (button) startPreparation(button.dataset.drink);
});

elements.modifierButtons.forEach((button) => {
  button.addEventListener("click", () => openOptionSheet(button.dataset.modifier));
});

elements.optionGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-option]");
  if (button) selectOption(button.dataset.option);
});

elements.resetButton.addEventListener("click", resetModifiers);
elements.closeSheetButton.addEventListener("click", closeOptionSheet);
elements.sheetBackdrop.addEventListener("click", closeOptionSheet);
elements.demoFinishButton.addEventListener("click", finishPreparation);
elements.serviceButton.addEventListener("click", openService);
elements.serviceCloseButton.addEventListener("click", closeService);
elements.openCleaningButton.addEventListener("click", openCleaning);
elements.openRecipesButton.addEventListener("click", openRecipes);
elements.cleaningCancelButton.addEventListener("click", () => closeCleaning(true));
elements.cleaningBackButton.addEventListener("click", previousCleaningStep);
elements.cleaningNextButton.addEventListener("click", nextCleaningStep);
elements.cleaningDemoFinishButton.addEventListener("click", finishCleaning);
elements.cleaningCloseButton.addEventListener("click", () => closeCleaning(false));
elements.recipeBackButton.addEventListener("click", closeRecipes);
elements.recipeCategoryNav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-recipe-category]");
  if (button) selectRecipeCategory(button.dataset.recipeCategory);
});
elements.recipeDrinkList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-recipe-drink]");
  if (button) selectRecipeDrink(button.dataset.recipeDrink);
});
elements.recipeControls.addEventListener("input", (event) => {
  const input = event.target.closest("[data-recipe-parameter]");
  if (input) updateRecipeParameter(input.dataset.recipeParameter, input.value);
});
elements.recipeSaveButton.addEventListener("click", saveActiveRecipe);
elements.recipeResetButton.addEventListener("click", resetActiveRecipe);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeOptionSheet();
});

loadRecipeSettings();
renderAll();
