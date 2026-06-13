/* DrinkX Expressive Premium Concept — data layer.
   Adding a drink = one DrinkRecipe object. Stages drive the assembly scene. */

export const INGREDIENT_COLORS = {
  coffee: "#7A4A26",
  coffee_dark: "#5E3318",
  water: "#BFD9E2",
  milk: "#F2E9DC",
  oat_milk: "#E0C9A4",
  coconut_milk: "#EFE6D8",
  foam: "#FAF3E7",
  syrup: "#D69A4E",
  ice: "#9FD4E8"
};

export const MODULES = {
  coffee_module: { label: "Кофе", icon: "bean", color: INGREDIENT_COLORS.coffee },
  water_module: { label: "Вода", icon: "water", color: INGREDIENT_COLORS.water },
  milk_module: { label: "Молоко", icon: "milk", color: INGREDIENT_COLORS.milk },
  syrup_module: { label: "Сироп", icon: "syrup", color: INGREDIENT_COLORS.syrup },
  foam_module: { label: "Пена", icon: "foam", color: INGREDIENT_COLORS.foam },
  cooling_module: { label: "Лёд", icon: "ice", color: INGREDIENT_COLORS.ice },
  heating_module: { label: "Нагрев", icon: "heat", color: "#FF7A45" }
};

/* ---------- custom line + soft-fill icons (24px grid) ---------- */
export const ICONS = {
  bolt: `<svg viewBox="0 0 24 24"><path d="M13 2 5 14h5l-1 8 8-12h-5l1-8z" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  focus: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3.2" fill="currentColor" fill-opacity=".25" stroke="currentColor" stroke-width="1.8"/><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  wave: `<svg viewBox="0 0 24 24"><path d="M2 9c3-3 5 3 8 0s5 3 8 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M2 15c3-3 5 3 8 0s5 3 8 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".55"/></svg>`,
  cloud: `<svg viewBox="0 0 24 24"><path d="M7 17a4 4 0 0 1 0-8 5 5 0 0 1 9.6 1.4A3.5 3.5 0 0 1 16.5 17H7z" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  drop: `<svg viewBox="0 0 24 24"><path d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9.5 14a2.5 2.5 0 0 0 2.5 2.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" fill="none"/></svg>`,
  moon: `<svg viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  road: `<svg viewBox="0 0 24 24"><path d="M4 21 9 3h6l5 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 6v2.5M12 12v2.5M12 18v2.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="0 5"/></svg>`,
  spark: `<svg viewBox="0 0 24 24"><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="19" cy="18" r="2" fill="currentColor" fill-opacity=".4"/></svg>`,
  heart: `<svg viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-9.3-9A5 5 0 0 1 12 7a5 5 0 0 1 9.3 4c-1.8 4.4-9.3 9-9.3 9z" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  bean: `<svg viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="7" ry="9" transform="rotate(35 12 12)" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 6.5c3 3 4 8 2.5 11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  milk: `<svg viewBox="0 0 24 24"><path d="M8 3h8v3l2 4v11H6V10l2-4V3z" fill="currentColor" fill-opacity=".15" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M6 14c2-1.5 4 1.5 6 0s4 1.5 6 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  syrup: `<svg viewBox="0 0 24 24"><path d="M9 3h6v4l2 3v10a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V10l2-3V3z" fill="currentColor" fill-opacity=".15" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 12s2 2.2 2 3.6a2 2 0 0 1-4 0c0-1.4 2-3.6 2-3.6z" fill="currentColor" fill-opacity=".4"/></svg>`,
  water: `<svg viewBox="0 0 24 24"><path d="M12 3s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z" fill="currentColor" fill-opacity=".15" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  foam: `<svg viewBox="0 0 24 24"><circle cx="8" cy="10" r="4" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.7"/><circle cx="15.5" cy="8.5" r="3" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.7"/><circle cx="13" cy="14.5" r="3.6" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.7"/></svg>`,
  ice: `<svg viewBox="0 0 24 24"><path d="M12 2v20M4 6.5l16 11M20 6.5l-16 11" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M12 5.5l2 2-2 2-2-2 2-2z" fill="currentColor" fill-opacity=".3"/></svg>`,
  heat: `<svg viewBox="0 0 24 24"><path d="M12 21a6 6 0 0 0 6-6c0-4-4-6-4-9 0 0-8 4-8 9a6 6 0 0 0 6 6z" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`
};

/* ---------- intents ---------- */
export const INTENTS = [
  { id: "wake", label: "Разбуди меня", icon: "bolt", hint: "Настоящая энергия, быстро", boost: { morning: 2 } },
  { id: "focus", label: "Фокус", icon: "focus", hint: "Ясная голова, ровный вкус", boost: { office: 2 } },
  { id: "refresh", label: "Освежи", icon: "wave", hint: "Холодно и ярко", boost: { hot_weather: 2 } },
  { id: "soft", label: "Мягкий вкус", icon: "cloud", hint: "Мягко и молочно" },
  { id: "sweet", label: "Что-то сладкое", icon: "drop", hint: "Немного десерта" },
  { id: "nocaf", label: "Без кофеина", icon: "moon", hint: "Спокойная чашка", boost: { evening: 2 } },
  { id: "road", label: "В дорогу", icon: "road", hint: "Быстро, с собой" },
  { id: "surprise", label: "Удиви меня", icon: "spark", hint: "Я выберу сам" }
];

/* ---------- quick questions per intent (max 2) ---------- */
export const QUESTIONS = {
  wake: [
    {
      id: "energy",
      title: "Какой нужен заряд?",
      options: [
        { id: "strong_clean", label: "Крепкий и чистый", tags: ["strong", "no_milk"] },
        { id: "milk_bold", label: "С молоком, но всё ещё бодрый", tags: ["strong", "milky"] },
        { id: "cold_fresh", label: "Холодный и освежающий", tags: ["iced", "strong"] },
        { id: "not_bitter", label: "Не горький, но бодрящий", tags: ["smooth", "strong"] }
      ]
    },
    {
      id: "prefs",
      title: "Есть предпочтения?",
      options: [
        { id: "no_sugar", label: "Без сахара", tags: ["no_sugar"] },
        { id: "reg_milk", label: "Обычное молоко", tags: ["milky"] },
        { id: "oat", label: "Овсяное молоко", tags: ["oat", "milky"] },
        { id: "no_milk", label: "Без молока", tags: ["no_milk"] },
        { id: "unsure", label: "Не знаю", tags: [] }
      ]
    }
  ],
  focus: [
    {
      id: "style",
      title: "Что держит в фокусе?",
      options: [
        { id: "bold_smooth", label: "Крепкий, но мягкий", tags: ["strong", "milky", "no_sugar"] },
        { id: "pure", label: "Чистый чёрный кофе", tags: ["strong", "no_milk"] },
        { id: "long", label: "Что-то пить не спеша", tags: ["mild", "milky"] }
      ]
    },
    {
      id: "prefs",
      title: "Есть предпочтения?",
      options: [
        { id: "no_sugar", label: "Без сахара", tags: ["no_sugar"] },
        { id: "oat", label: "Овсяное молоко", tags: ["oat", "milky"] },
        { id: "unsure", label: "Не знаю", tags: [] }
      ]
    }
  ],
  refresh: [
    {
      id: "cold_style",
      title: "Насколько холодным сделать?",
      options: [
        { id: "iced_coffee", label: "Айс-кофе с зарядом", tags: ["iced", "strong"] },
        { id: "iced_soft", label: "Холодный и сливочный", tags: ["iced", "milky", "sweetish"] },
        { id: "no_coffee", label: "Без кофе, просто свежесть", tags: ["iced", "no_caffeine"] }
      ]
    },
    {
      id: "sweetq",
      title: "Сладость?",
      options: [
        { id: "none", label: "Несладкий", tags: ["no_sugar"] },
        { id: "little", label: "Чуть-чуть", tags: ["sweetish"] },
        { id: "yes", label: "Сладкий, пожалуйста", tags: ["sweet"] }
      ]
    }
  ],
  soft: [
    {
      id: "milkq",
      title: "Какое молоко подойдёт?",
      options: [
        { id: "regular", label: "Обычное", tags: ["milky"] },
        { id: "oat", label: "Овсяное", tags: ["oat", "milky"] },
        { id: "coconut", label: "Кокосовое", tags: ["coconut", "milky"] },
        { id: "unsure", label: "Удиви меня", tags: ["milky"] }
      ]
    },
    {
      id: "tempq",
      title: "Горячий или со льдом?",
      options: [
        { id: "hot", label: "Горячий", tags: ["hot"] },
        { id: "iced", label: "Со льдом", tags: ["iced"] }
      ]
    }
  ],
  sweet: [
    {
      id: "sweet_style",
      title: "Какой сладости хочется?",
      options: [
        { id: "caramel", label: "Карамельное тепло", tags: ["sweet", "caramel"] },
        { id: "vanilla", label: "Ванильный аромат", tags: ["sweetish", "vanilla"] },
        { id: "dessert", label: "Десерт на полную", tags: ["sweet", "milky"] }
      ]
    }
  ],
  nocaf: [
    {
      id: "calm_style",
      title: "Что сейчас успокоит?",
      options: [
        { id: "warm_milk", label: "Тёплый и молочный", tags: ["no_caffeine", "milky", "hot"] },
        { id: "fruit_cold", label: "Холодный и фруктовый", tags: ["no_caffeine", "iced"] }
      ]
    }
  ],
  road: [
    {
      id: "road_style",
      title: "Быстрый вопрос — что берём?",
      options: [
        { id: "black_go", label: "Чёрный кофе с собой", tags: ["strong", "no_milk"] },
        { id: "milk_go", label: "Молочная классика с собой", tags: ["milky"] },
        { id: "cold_go", label: "Холодная энергия с собой", tags: ["iced", "strong"] }
      ]
    }
  ]
};

/* ---------- recipes ---------- */
/* Stage helper notes:
   - ratio shares should sum ≈ 1 per recipe (cup fill)
   - editableUntilStage: while this stage hasn't started, the recipe can still change */

export const RECIPES = [
  {
    id: "focus_flat",
    name: "Флэт уайт",
    displayName: "Фокус Флэт",
    shortDescription: "Крепкий · молочный · без сахара",
    tags: ["strong", "milky", "no_sugar", "hot", "office", "morning"],
    price: 420,
    estimatedPreparationTimeMs: 26000,
    temperature: "hot",
    ingredients: [
      { id: "coffee", label: "Кофейная база", color: INGREDIENT_COLORS.coffee, ratio: 0.34 },
      { id: "milk", label: "Молоко", color: INGREDIENT_COLORS.milk, ratio: 0.54 },
      { id: "foam", label: "Микропена", color: INGREDIENT_COLORS.foam, ratio: 0.12 }
    ],
    tasteProfile: { strength: 82, sweetness: 0, milkiness: 45, creaminess: 55, caffeine: "high", texture: "creamy", temperature: "hot" },
    why: "Выбрал его, потому что тебе нужна энергия без лишней сладости. Кофе здесь плотнее, чем в латте.",
    readyLine: "Крепкий, мягкий и создан для фокуса.",
    readyAi: "Попробуй сначала без сахара — рецепт и так крепкий, но мягкий.",
    assemblyStages: [
      { id: "lock", title: "Рецепт зафиксирован", description: "Проверяю стакан и рецепт", module: "heating_module", durationMs: 2200, animation: "module_glow", aiComment: "Фиксирую рецепт — плотная база, немного молока.", editableUntilStage: true },
      /* §31: молоко стартует, когда эспрессо налит на ~74% — overlapNextMs сдвигает старт следующей стадии */
      { id: "coffee", title: "Кофейная база", description: "Плотный кофейный профиль для энергии", ingredient: "coffee", module: "coffee_module", durationMs: 7000, overlapNextMs: 1800, telemetryEventStart: "coffee_dosing_started", telemetryEventEnd: "coffee_dosing_completed", animation: "flow", tasteImpact: { strength: 82, bitterness: 40 }, aiComment: "Начинаю с плотной кофейной базы — напиток останется бодрым." },
      { id: "milk", title: "Текстура молока", description: "Молоко входит, пока эспрессо ещё льётся", ingredient: "milk", module: "milk_module", durationMs: 8000, telemetryEventStart: "milk_started", telemetryEventEnd: "milk_completed", animation: "flow", tasteImpact: { milkiness: 45, creaminess: 55, bitterness: -15 }, aiComment: "Молоко стартует до конца эспрессо — так смешивание мягче." },
      { id: "foam", title: "Слой микропены", description: "Тонкий бархатный верх", ingredient: "foam", module: "foam_module", durationMs: 5000, telemetryEventStart: "foam_started", telemetryEventEnd: "foam_completed", animation: "foam_build", tasteImpact: { creaminess: 70 }, aiComment: "Этот слой пены сделает текстуру шелковистой." },
      { id: "balance", title: "Проверка баланса", description: "Крепкий, но не горький", module: "heating_module", durationMs: 2800, animation: "profile_highlight", aiComment: "Почти готово: крепкий, мягкий и совсем без сладости." },
      { id: "pour", title: "Финальная температура", description: "Готов к идеальному первому глотку", module: "heating_module", durationMs: 2000, animation: "module_glow", aiComment: "Финальная проверка — держу температуру первого глотка." }
    ]
  },
  {
    id: "morning_boost",
    name: "Капучино+",
    displayName: "Утренний буст",
    shortDescription: "Крепкий · пенный · классика",
    tags: ["strong", "milky", "hot", "morning"],
    price: 390,
    estimatedPreparationTimeMs: 24000,
    temperature: "hot",
    ingredients: [
      { id: "coffee", label: "Кофейная база", color: INGREDIENT_COLORS.coffee, ratio: 0.3 },
      { id: "milk", label: "Молоко", color: INGREDIENT_COLORS.milk, ratio: 0.42 },
      { id: "foam", label: "Пена", color: INGREDIENT_COLORS.foam, ratio: 0.28 }
    ],
    tasteProfile: { strength: 74, sweetness: 5, milkiness: 50, creaminess: 65, caffeine: "high", texture: "creamy", temperature: "hot" },
    why: "Правильный классический старт: характер эспрессо под высокой шапкой пены.",
    readyLine: "Классический способ начать настоящий день.",
    readyAi: "Пена держит тепло — сначала аккуратно перемешай.",
    assemblyStages: [
      { id: "lock", title: "Рецепт зафиксирован", description: "Проверяю стакан и рецепт", module: "heating_module", durationMs: 2000, animation: "module_glow", aiComment: "Классическая сборка: сначала эспрессо, в конце высокая пена.", editableUntilStage: true },
      { id: "coffee", title: "Кофейная база", description: "Характер эспрессо", ingredient: "coffee", module: "coffee_module", durationMs: 6500, overlapNextMs: 1500, telemetryEventStart: "coffee_dosing_started", telemetryEventEnd: "coffee_dosing_completed", animation: "flow", tasteImpact: { strength: 74, bitterness: 38 }, aiComment: "База эспрессо готова — здесь живёт утренний заряд." },
      { id: "milk_heat", title: "Нагрев молока", description: "Грею до сладкой точки", module: "heating_module", durationMs: 4000, overlapNextMs: 2200, animation: "module_glow", aiComment: "Грею молоко ровно настолько, чтобы раскрыть его сладость." },
      { id: "milk", title: "Молоко", description: "Мягкое тело под пеной", ingredient: "milk", module: "milk_module", durationMs: 5500, animation: "flow", tasteImpact: { milkiness: 50, bitterness: -12 }, aiComment: "Молоко смягчает базу, не пряча кофе." },
      { id: "foam", title: "Шапка пены", description: "Высокая классическая пена", ingredient: "foam", module: "foam_module", durationMs: 4500, animation: "foam_build", tasteImpact: { creaminess: 65 }, aiComment: "Хорошая пена — это текстура, а не просто объём." },
      { id: "pour", title: "Финальная подача", description: "Готово", module: "heating_module", durationMs: 1500, animation: "module_glow", aiComment: "Выравниваю слои — ещё мгновение." }
    ]
  },
  {
    id: "latte_soft",
    name: "Латте",
    displayName: "Мягкий латте",
    shortDescription: "Нежный · молочный · тёплый",
    tags: ["mild", "milky", "hot", "soft"],
    price: 390,
    estimatedPreparationTimeMs: 23000,
    temperature: "hot",
    ingredients: [
      { id: "coffee", label: "Кофейная база", color: INGREDIENT_COLORS.coffee, ratio: 0.2 },
      { id: "milk", label: "Молоко", color: INGREDIENT_COLORS.milk, ratio: 0.68 },
      { id: "foam", label: "Лёгкая пена", color: INGREDIENT_COLORS.foam, ratio: 0.12 }
    ],
    tasteProfile: { strength: 40, sweetness: 12, milkiness: 80, creaminess: 70, caffeine: "medium", texture: "smooth", temperature: "hot" },
    why: "Долгий, тёплый и нежный — больше молока, меньше резкости, пьётся легко.",
    readyLine: "Мягкий, тёплый — легко полюбить.",
    readyAi: "Захочется покрепче — в следующий раз попроси Фокус Флэт.",
    assemblyStages: [
      { id: "lock", title: "Рецепт зафиксирован", description: "Проверяю стакан и рецепт", module: "heating_module", durationMs: 2000, animation: "module_glow", aiComment: "Делаю нежно: немного кофе, много молока.", editableUntilStage: true },
      { id: "coffee", title: "Кофейная база", description: "Короткая и мягкая", ingredient: "coffee", module: "coffee_module", durationMs: 5000, overlapNextMs: 1200, animation: "flow", tasteImpact: { strength: 40 }, aiComment: "Уменьшенная доза кофе — напиток останется спокойным." },
      { id: "milk", title: "Молочное тело", description: "Долгая тёплая заливка", ingredient: "milk", module: "milk_module", durationMs: 9000, animation: "flow", tasteImpact: { milkiness: 80, creaminess: 60 }, aiComment: "Много тёплого молока — это и есть мягкость." },
      { id: "foam", title: "Лёгкая пена", description: "Совсем чуть-чуть сверху", ingredient: "foam", module: "foam_module", durationMs: 3500, animation: "foam_build", tasteImpact: { creaminess: 70 }, aiComment: "Тонкий слой пены — ничего тяжёлого." },
      { id: "pour", title: "Финальная подача", description: "Готово", module: "heating_module", durationMs: 1800, animation: "module_glow", aiComment: "Тёплый и ровный — почти готов." }
    ]
  },
  {
    id: "iced_balance",
    name: "Айс-латте",
    displayName: "Айс-баланс",
    shortDescription: "Холодный · сливочный · яркий",
    tags: ["iced", "milky", "refresh", "hot_weather"],
    price: 410,
    estimatedPreparationTimeMs: 21000,
    temperature: "iced",
    ingredients: [
      { id: "ice", label: "Лёд", color: INGREDIENT_COLORS.ice, ratio: 0.22 },
      { id: "coffee", label: "Кофейная база", color: INGREDIENT_COLORS.coffee, ratio: 0.3 },
      { id: "milk", label: "Холодное молоко", color: INGREDIENT_COLORS.milk, ratio: 0.48 }
    ],
    tasteProfile: { strength: 55, sweetness: 10, milkiness: 65, refreshing: 80, caffeine: "medium", texture: "smooth", temperature: "iced" },
    why: "Холодный, сливочный и яркий — освежает, но на вкус это настоящий кофе.",
    readyLine: "Холодный, яркий, в идеальном балансе.",
    readyAi: "Лучше всего первые десять минут, пока лёд держит форму.",
    assemblyStages: [
      { id: "lock", title: "Рецепт зафиксирован", description: "Проверяю стакан и рецепт", module: "cooling_module", durationMs: 2000, animation: "module_glow", aiComment: "Холодная сборка: сначала лёд, потом кофе сверху.", editableUntilStage: true },
      { id: "ice", title: "Лёд", description: "Холодная основа", ingredient: "ice", module: "cooling_module", durationMs: 3500, animation: "ice_drop", tasteImpact: { refreshing: 80 }, aiComment: "Лёд идёт первым — кофе останется ярким, не водянистым." },
      { id: "coffee", title: "Кофе на лёд", description: "Яркий и крепкий", ingredient: "coffee", module: "coffee_module", durationMs: 6000, animation: "flow", tasteImpact: { strength: 55 }, aiComment: "Лью кофе на лёд — так аромат запечатывается." },
      { id: "milk", title: "Холодное молоко", description: "Сливочный финал", ingredient: "milk", module: "milk_module", durationMs: 6500, animation: "flow", tasteImpact: { milkiness: 65, creaminess: 50 }, aiComment: "Холодное молоко в конце — смотри, как складываются слои." },
      { id: "balance", title: "Холодный баланс", description: "Готово", module: "cooling_module", durationMs: 2200, animation: "profile_highlight", aiComment: "Сбалансирован и по-настоящему холодный. Готово." }
    ]
  },
  {
    id: "oat_vanilla_calm",
    name: "Овсяный айс-латте с ванилью",
    displayName: "Овсяная ваниль",
    shortDescription: "Мягкий · овсяный · чуть сладкий",
    tags: ["iced", "milky", "oat", "sweetish", "vanilla", "soft"],
    price: 460,
    estimatedPreparationTimeMs: 25000,
    temperature: "iced",
    ingredients: [
      { id: "ice", label: "Лёд", color: INGREDIENT_COLORS.ice, ratio: 0.2 },
      { id: "coffee", label: "Кофейная база", color: INGREDIENT_COLORS.coffee, ratio: 0.26 },
      { id: "oat_milk", label: "Овсяное молоко", color: INGREDIENT_COLORS.oat_milk, ratio: 0.46 },
      { id: "syrup", label: "Ваниль", color: INGREDIENT_COLORS.syrup, ratio: 0.08 }
    ],
    tasteProfile: { strength: 48, sweetness: 35, milkiness: 78, refreshing: 70, caffeine: "medium", texture: "smooth", temperature: "iced" },
    why: "Овсяное молоко даёт естественную мягкость, а полдозы ванили — аромат без десерта.",
    readyLine: "Мягкий, естественно сладкий, очень спокойный.",
    readyAi: "Сладость здесь от овса и ванили — сахар не добавлял.",
    assemblyStages: [
      { id: "lock", title: "Рецепт зафиксирован", description: "Проверяю стакан и рецепт", module: "cooling_module", durationMs: 2000, animation: "module_glow", aiComment: "Мягкая холодная сборка: овсяное молоко и ванильный акцент.", editableUntilStage: true },
      { id: "ice", title: "Лёд", description: "Холодная основа", ingredient: "ice", module: "cooling_module", durationMs: 3200, animation: "ice_drop", tasteImpact: { refreshing: 70 }, aiComment: "Сначала лёд — чистая холодная база." },
      { id: "coffee", title: "Кофейная база", description: "Мягкая и округлая", ingredient: "coffee", module: "coffee_module", durationMs: 5500, animation: "flow", tasteImpact: { strength: 48 }, aiComment: "Спокойная доза кофе — этот напиток про текстуру." },
      { id: "oat", title: "Овсяное молоко", description: "Естественная мягкость", ingredient: "oat_milk", module: "milk_module", durationMs: 7000, animation: "flow", tasteImpact: { milkiness: 78, sweetness: 20 }, aiComment: "Овсяное молоко даёт мягкость без сиропа." },
      { id: "syrup", title: "Ванильный акцент", description: "Полдозы, только аромат", ingredient: "syrup", module: "syrup_module", durationMs: 3800, animation: "swirl", tasteImpact: { sweetness: 35 }, aiComment: "Полдозы ванили дают аромат, не превращая напиток в десерт." },
      { id: "balance", title: "Холодный баланс", description: "Готово", module: "cooling_module", durationMs: 2300, animation: "profile_highlight", aiComment: "Спокойный, мягкий, чуть сладкий — как и задумано." }
    ]
  },
  {
    id: "road_coffee",
    name: "Американо",
    displayName: "Кофе в дорогу",
    shortDescription: "Чёрный · чистый · с собой",
    tags: ["strong", "no_milk", "hot", "road", "no_sugar"],
    price: 320,
    estimatedPreparationTimeMs: 17000,
    temperature: "hot",
    ingredients: [
      { id: "coffee", label: "Кофейная база", color: INGREDIENT_COLORS.coffee, ratio: 0.32 },
      { id: "water", label: "Горячая вода", color: INGREDIENT_COLORS.water, ratio: 0.68 }
    ],
    tasteProfile: { strength: 78, sweetness: 0, milkiness: 0, bitterness: 50, caffeine: "high", texture: "clean", temperature: "hot" },
    why: "Чисто и быстро: полный кофейный характер, ничего лишнего, удобно взять с собой.",
    readyLine: "Чистый, крепкий, готов в дорогу.",
    readyAi: "Крышку — и вперёд. Дорогу он переносит отлично.",
    assemblyStages: [
      { id: "lock", title: "Рецепт зафиксирован", description: "Проверяю стакан и рецепт", module: "heating_module", durationMs: 1800, animation: "module_glow", aiComment: "Просто и честно: кофе и горячая вода.", editableUntilStage: true },
      { id: "coffee", title: "Кофейная база", description: "Полный характер концентрата", ingredient: "coffee", module: "coffee_module", durationMs: 6000, animation: "flow", tasteImpact: { strength: 78, bitterness: 50 }, aiComment: "Сначала весь концентрат — в нём весь характер." },
      { id: "water", title: "Горячая вода", description: "Раскрываю вкус", ingredient: "water", module: "water_module", durationMs: 6500, animation: "flow", tasteImpact: { bitterness: -10 }, aiComment: "Горячая вода раскрывает вкус и оставляет его чистым." },
      { id: "pour", title: "Финальная подача", description: "Готово", module: "heating_module", durationMs: 1700, animation: "module_glow", aiComment: "Готово. Чистый и крепкий, как обещал." }
    ]
  },
  {
    id: "cold_energy",
    name: "Айс-американо+",
    displayName: "Холодная энергия",
    shortDescription: "Ледяной · крепкий · ноль сладости",
    tags: ["iced", "strong", "no_milk", "no_sugar", "road", "hot_weather"],
    price: 360,
    estimatedPreparationTimeMs: 18000,
    temperature: "iced",
    ingredients: [
      { id: "ice", label: "Лёд", color: INGREDIENT_COLORS.ice, ratio: 0.26 },
      { id: "coffee", label: "Кофейная база", color: INGREDIENT_COLORS.coffee, ratio: 0.36 },
      { id: "water", label: "Холодная вода", color: INGREDIENT_COLORS.water, ratio: 0.38 }
    ],
    tasteProfile: { strength: 80, sweetness: 0, milkiness: 0, refreshing: 90, caffeine: "high", texture: "clean", temperature: "iced" },
    why: "Максимум свежести, максимум кофеина, ноль сладости. Холодная кнопка перезагрузки.",
    readyLine: "Холодный. Крепкий. Бодрый.",
    readyAi: "Первый глоток самый громкий — в этом и смысл.",
    assemblyStages: [
      { id: "lock", title: "Рецепт зафиксирован", description: "Проверяю стакан и рецепт", module: "cooling_module", durationMs: 1800, animation: "module_glow", aiComment: "Холодная перезагрузка: лёд, кофе и ничего больше.", editableUntilStage: true },
      { id: "ice", title: "Лёд", description: "Холодная основа", ingredient: "ice", module: "cooling_module", durationMs: 3500, animation: "ice_drop", tasteImpact: { refreshing: 90 }, aiComment: "Льда не жалею — этот должен быть по-настоящему холодным." },
      { id: "coffee", title: "Кофе на лёд", description: "Резкий и крепкий", ingredient: "coffee", module: "coffee_module", durationMs: 6000, animation: "flow", tasteImpact: { strength: 80 }, aiComment: "Крепкая доза на лёд — резко, ярко, ноль сладости." },
      { id: "water", title: "Холодная вода", description: "Делаю глоток длиннее", ingredient: "water", module: "water_module", durationMs: 4500, animation: "flow", aiComment: "Немного холодной воды — и напиток становится длиннее." },
      { id: "balance", title: "Холодный баланс", description: "Готово", module: "cooling_module", durationMs: 2000, animation: "profile_highlight", aiComment: "Холодный и громкий. Готов, когда скажешь." }
    ]
  },
  {
    id: "evening_decaf",
    name: "Латте декаф",
    displayName: "Вечерний декаф",
    shortDescription: "Спокойный · тёплый · без кофеина",
    tags: ["no_caffeine", "milky", "hot", "evening", "soft"],
    price: 390,
    estimatedPreparationTimeMs: 22000,
    temperature: "hot",
    ingredients: [
      { id: "coffee", label: "Декаф-база", color: "#8A6243", ratio: 0.22 },
      { id: "milk", label: "Молоко", color: INGREDIENT_COLORS.milk, ratio: 0.64 },
      { id: "foam", label: "Лёгкая пена", color: INGREDIENT_COLORS.foam, ratio: 0.14 }
    ],
    tasteProfile: { strength: 35, sweetness: 10, milkiness: 75, creaminess: 65, caffeine: "none", texture: "smooth", temperature: "hot" },
    why: "Весь тёплый кофейный ритуал — без кофеина. Создан для вечеров.",
    readyLine: "Вечерняя чашка, после которой спится.",
    readyAi: "Тот же ритуал, ноль кофеина — вечер в безопасности.",
    assemblyStages: [
      { id: "lock", title: "Рецепт зафиксирован", description: "Проверяю стакан и рецепт", module: "heating_module", durationMs: 2000, animation: "module_glow", aiComment: "Вечерний режим: декаф-база, тёплое молоко, без спешки.", editableUntilStage: true },
      { id: "coffee", title: "Декаф-база", description: "Полный вкус, без кофеина", ingredient: "coffee", module: "coffee_module", durationMs: 5200, overlapNextMs: 1200, animation: "flow", tasteImpact: { strength: 35 }, aiComment: "Декаф оставляет вкус и убирает кофеин." },
      { id: "milk", title: "Тёплое молоко", description: "Спокойная часть", ingredient: "milk", module: "milk_module", durationMs: 8000, animation: "flow", tasteImpact: { milkiness: 75, creaminess: 60 }, aiComment: "Расслабляет здесь именно тёплое молоко." },
      { id: "foam", title: "Лёгкая пена", description: "Мягкий финал", ingredient: "foam", module: "foam_module", durationMs: 3500, animation: "foam_build", tasteImpact: { creaminess: 65 }, aiComment: "Мягкая пена в финале — нежно до последнего глотка." },
      { id: "pour", title: "Финальная подача", description: "Готово", module: "heating_module", durationMs: 1800, animation: "module_glow", aiComment: "Спокойная чашка уже в пути." }
    ]
  },
  {
    id: "no_sugar_creamy",
    name: "Кортадо",
    displayName: "Кремовый без сахара",
    shortDescription: "Сливочный · сбалансированный · ноль сахара",
    tags: ["strong", "milky", "no_sugar", "hot", "office"],
    price: 400,
    estimatedPreparationTimeMs: 21000,
    temperature: "hot",
    ingredients: [
      { id: "coffee", label: "Кофейная база", color: INGREDIENT_COLORS.coffee, ratio: 0.42 },
      { id: "milk", label: "Молоко", color: INGREDIENT_COLORS.milk, ratio: 0.5 },
      { id: "foam", label: "Тонкая пена", color: INGREDIENT_COLORS.foam, ratio: 0.08 }
    ],
    tasteProfile: { strength: 70, sweetness: 0, milkiness: 50, creaminess: 60, caffeine: "high", texture: "velvet", temperature: "hot" },
    why: "Половина кофе, половина шелковистого молока — сливочно без грамма сахара.",
    readyLine: "Сливочный, честный, ноль сахара.",
    readyAi: "Вся сладость здесь от молока — попробуй, как этого хватает.",
    assemblyStages: [
      { id: "lock", title: "Рецепт зафиксирован", description: "Проверяю стакан и рецепт", module: "heating_module", durationMs: 1800, animation: "module_glow", aiComment: "Поровну кофе и шёлка — собираю.", editableUntilStage: true },
      { id: "coffee", title: "Кофейная база", description: "Половина стакана", ingredient: "coffee", module: "coffee_module", durationMs: 6000, overlapNextMs: 1500, animation: "flow", tasteImpact: { strength: 70 }, aiComment: "Щедрая база — это напиток в первую очередь про кофе." },
      { id: "milk", title: "Шелковистое молоко", description: "Вторая половина", ingredient: "milk", module: "milk_module", durationMs: 7000, animation: "flow", tasteImpact: { milkiness: 50, creaminess: 60 }, aiComment: "Держу сладость на нуле — как в твоём заказе." },
      { id: "foam", title: "Тонкая пена", description: "Бархатная шапка", ingredient: "foam", module: "foam_module", durationMs: 3000, animation: "foam_build", aiComment: "Тончайшая шапка пены — бархат, а не воздушность." },
      { id: "pour", title: "Финальная подача", description: "Готово", module: "heating_module", durationMs: 1600, animation: "module_glow", aiComment: "Сбалансирован и готов. Сахар не понадобился." }
    ]
  },
  {
    id: "after_lunch",
    name: "Эспрессо-тоник",
    displayName: "Афтер-ланч",
    shortDescription: "Яркий · игристый · резкий",
    tags: ["iced", "strong", "no_milk", "refresh", "office"],
    price: 430,
    estimatedPreparationTimeMs: 19000,
    temperature: "iced",
    ingredients: [
      { id: "ice", label: "Лёд", color: INGREDIENT_COLORS.ice, ratio: 0.24 },
      { id: "water", label: "Газировка", color: INGREDIENT_COLORS.water, ratio: 0.46 },
      { id: "coffee", label: "Кофейная база", color: INGREDIENT_COLORS.coffee, ratio: 0.3 }
    ],
    tasteProfile: { strength: 62, sweetness: 8, milkiness: 0, refreshing: 85, caffeine: "medium", texture: "clean", temperature: "iced" },
    why: "Перезагрузка после обеда: игристый, цитрусово-яркий, с чистым кофейным акцентом.",
    readyLine: "Достаточно яркий, чтобы перезапустить день.",
    readyAi: "Пей, не размешивай — слои здесь и есть шоу.",
    assemblyStages: [
      { id: "lock", title: "Рецепт зафиксирован", description: "Проверяю стакан и рецепт", module: "cooling_module", durationMs: 1800, animation: "module_glow", aiComment: "Дневная перезагрузка: игристая база, кофе сверху.", editableUntilStage: true },
      { id: "ice", title: "Лёд", description: "Холодная основа", ingredient: "ice", module: "cooling_module", durationMs: 3200, animation: "ice_drop", tasteImpact: { refreshing: 85 }, aiComment: "Сначала лёд — пузырькам нужен холод." },
      { id: "water", title: "Игристая заливка", description: "Яркая база", ingredient: "water", module: "water_module", durationMs: 5500, animation: "flow", aiComment: "Газировка пошла — смотри, как поднимаются пузырьки." },
      { id: "coffee", title: "Кофе сверху", description: "Слоем наверх", ingredient: "coffee", module: "coffee_module", durationMs: 6000, animation: "flow", tasteImpact: { strength: 62 }, aiComment: "Кладу кофе слоем сверху, чтобы не замутнить." },
      { id: "balance", title: "Холодный баланс", description: "Готово", module: "cooling_module", durationMs: 2000, animation: "profile_highlight", aiComment: "Резкий, игристый, слоёный. День спасён." }
    ]
  }
];

/* Secret menu = branded displayNames above; surfaced via strip + surprise */
export const SECRET_MENU_IDS = [
  "focus_flat", "morning_boost", "latte_soft", "iced_balance", "oat_vanilla_calm",
  "road_coffee", "after_lunch", "no_sugar_creamy", "cold_energy", "evening_decaf"
];

/* Fast order = classic names, no AI */
export const FAST_ORDER_IDS = [
  "road_coffee", "morning_boost", "latte_soft", "focus_flat", "iced_balance", "cold_energy", "no_sugar_creamy", "evening_decaf"
];

/* ---------- customization meta ---------- */
export const CUSTOMIZATION = [
  {
    id: "strength", label: "Крепость",
    options: [
      { id: "light", label: "Лёгкая" }, { id: "balanced", label: "Сбалансированная" }, { id: "strong", label: "Крепкая" }
    ],
    explain: {
      light: "Лёгкая доза — мягче вкус, легче пьётся.",
      balanced: "Сбалансированная доза — рецепт такой, каким его задумал бариста.",
      strong: "Меньше молока — вкус кофе станет интенсивнее."
    }
  },
  {
    id: "sweetness", label: "Сладость",
    options: [
      { id: "none", label: "Нет" }, { id: "low", label: "Чуть-чуть" }, { id: "medium", label: "Средняя" }, { id: "sweet", label: "Сладко" }
    ],
    explain: {
      none: "Ноль сахара — вкус держат сами ингредиенты.",
      low: "Лёгкий намёк — сглаживает края, но сладким не делает.",
      medium: "Заметно сладкий, но всё ещё в первую очередь кофе.",
      sweet: "Полный режим десерта. Сбалансирую, чтобы вкус не стал плоским."
    }
  },
  {
    id: "milk", label: "Молоко",
    options: [
      { id: "regular", label: "Обычное" }, { id: "oat", label: "Овсяное" }, { id: "coconut", label: "Кокосовое" }, { id: "none", label: "Без молока" }
    ],
    explain: {
      regular: "Классическое молоко — чистое, привычное тело напитка.",
      oat: "Овсяное молоко сделает напиток мягче и естественно слаще.",
      coconut: "Кокос добавит лёгкую тропическую ноту и шелковистость.",
      none: "Без молока — вкус кофе станет интенсивнее."
    }
  },
  {
    id: "temperature", label: "Температура",
    options: [{ id: "hot", label: "Горячий" }, { id: "iced", label: "Со льдом" }],
    explain: {
      hot: "Подаю горячим — ровно при температуре первого глотка.",
      iced: "Собираю на льду — ярче, чище, освежает сильнее."
    }
  },
  {
    id: "syrup", label: "Сироп",
    options: [
      { id: "none", label: "Без сиропа" }, { id: "vanilla", label: "Ваниль" }, { id: "caramel", label: "Карамель" }, { id: "hazelnut", label: "Фундук" }
    ],
    explain: {
      none: "Без сиропа — чистый рецепт.",
      vanilla: "Полдозы ванили дают аромат, не превращая напиток в десерт.",
      caramel: "Карамель добавляет тёплую глубину ириски.",
      hazelnut: "Фундук даёт мягкий финал обжаренного ореха."
    }
  },
  {
    id: "size", label: "Размер",
    options: [{ id: "s", label: "Малый" }, { id: "m", label: "Средний" }, { id: "l", label: "Большой" }],
    explain: {
      s: "Маленький и концентрированный.",
      m: "Родной размер рецепта.",
      l: "Больше объёма — пересчитаю рецепт, чтобы не стал водянистым."
    }
  }
];

export const RATING_OPTIONS = [
  { id: "perfect", label: "Идеально", delta: {} },
  { id: "too_strong", label: "Слишком крепкий", delta: { strength: -8 } },
  { id: "too_sweet", label: "Слишком сладкий", delta: { sweetness: -10 } },
  { id: "too_milky", label: "Слишком молочный", delta: { milkiness: -8 } },
  { id: "not_cold_enough", label: "Недостаточно холодный", delta: { iced: 6 } }
];
