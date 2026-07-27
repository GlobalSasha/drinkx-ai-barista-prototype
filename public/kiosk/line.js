const DESIGN_WIDTH = 800;
const DESIGN_HEIGHT = 1280;

const drinkTemplates = [
  {
    id: "latte",
    code: "01",
    name: "Латте",
    recipe: "Эспрессо / молоко",
    duration: 14,
    defaults: { volume: "350 мл", milk: "Обычное", syrup: "Нет" },
  },
  {
    id: "americano",
    code: "02",
    name: "Американо",
    recipe: "Эспрессо / горячая вода",
    duration: 12,
    defaults: { volume: "350 мл", milk: "Нет", syrup: "Нет" },
  },
  {
    id: "raf",
    code: "03",
    name: "Раф",
    recipe: "Эспрессо / сливки / ваниль",
    duration: 16,
    defaults: { volume: "350 мл", milk: "Сливки", syrup: "Ваниль" },
  },
  {
    id: "cappuccino",
    code: "04",
    name: "Капучино",
    recipe: "Эспрессо / молоко / пена",
    duration: 15,
    defaults: { volume: "350 мл", milk: "Обычное", syrup: "Нет" },
  },
  {
    id: "flat-white",
    code: "05",
    name: "Флэт уайт",
    recipe: "Двойной эспрессо / молоко",
    duration: 13,
    defaults: { volume: "250 мл", milk: "Обычное", syrup: "Нет" },
  },
  {
    id: "citrus-tonic",
    code: "06",
    name: "Цитрус тоник",
    recipe: "Тоник / цитрус / лёд",
    duration: 11,
    defaults: { volume: "450 мл", milk: "Нет", syrup: "Цитрус" },
  },
];

const editOptions = {
  volume: ["250 мл", "350 мл", "450 мл"],
  milk: ["Нет", "Обычное", "Безлакт.", "Овсяное", "Сливки", "Кокос"],
  syrup: ["Нет", "Ваниль", "Карамель", "Фундук", "Банан", "Цитрус"],
};

const processStages = [
  {
    label: "ПОДГОТОВКА",
    title: "ПРОВЕРКА<br />КОНТУРА",
    hint: "Стакан распознан. Рецепт загружен в станцию.",
  },
  {
    label: "ОСНОВА",
    title: "ЭКСТРАКЦИЯ<br />КОФЕ",
    hint: "Станция удерживает давление и время пролива.",
  },
  {
    label: "ТЕКСТУРА",
    title: "МОЛОКО<br />И ДОБАВКИ",
    hint: "Температура и дозировка контролируются автоматически.",
  },
  {
    label: "ФИНИШ",
    title: "КОНТРОЛЬ<br />ВЫДАЧИ",
    hint: "Последняя проверка рецепта и короткая промывка.",
  },
];

const lineState = {
  screen: "queue",
  selectedNumber: 48,
  nextNumber: 51,
  sound: true,
  commandOpen: false,
  commandQuery: "",
  commandActiveIndex: 0,
  process: null,
  processTimer: null,
  toastTimer: null,
  queue: [
    {
      number: 48,
      drinkId: "latte",
      table: "07",
      placedAt: "08:40",
      config: { volume: "450 мл", milk: "Овсяное", syrup: "Карамель" },
    },
    {
      number: 49,
      drinkId: "americano",
      table: "12",
      placedAt: "08:41",
      config: { volume: "350 мл", milk: "Нет", syrup: "Нет" },
    },
    {
      number: 50,
      drinkId: "raf",
      table: "05",
      placedAt: "08:42",
      config: { volume: "350 мл", milk: "Сливки", syrup: "Ваниль" },
    },
  ],
};

const lineRefs = {
  shell: document.querySelector("#line-shell"),
  app: document.querySelector("#line-app"),
  clock: document.querySelector("#line-clock"),
  sound: document.querySelector("#line-sound"),
  machineStatus: document.querySelector("#machine-status"),
  phaseStrip: document.querySelector("#phase-strip"),
  view: document.querySelector("#line-view"),
  queueDock: document.querySelector("#queue-dock"),
  queueMeta: document.querySelector("#queue-meta"),
  queueList: document.querySelector("#queue-list"),
  openCommand: document.querySelector("#open-command"),
  commandLayer: document.querySelector("#command-layer"),
  closeCommand: document.querySelector("#close-command"),
  commandInput: document.querySelector("#command-input"),
  commandResultCount: document.querySelector("#command-result-count"),
  commandResults: document.querySelector("#command-results"),
  editDialog: document.querySelector("#edit-dialog"),
  editForm: document.querySelector("#edit-form"),
  editFields: document.querySelector("#edit-fields"),
  machineDialog: document.querySelector("#machine-dialog"),
  stopDialog: document.querySelector("#stop-dialog"),
  confirmStop: document.querySelector("#confirm-stop"),
  toast: document.querySelector("#line-toast"),
  audio: document.querySelector("#line-ready-audio"),
};

let fitFrame = null;

function templateFor(order) {
  return drinkTemplates.find((drink) => drink.id === order?.drinkId);
}

function selectedOrder() {
  return lineState.queue.find((order) => order.number === lineState.selectedNumber) ?? lineState.queue[0];
}

function orderCode(order) {
  return `#${String(order.number).padStart(3, "0")}`;
}

function currentTime() {
  return new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

function fitLineToViewport() {
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

  document.documentElement.style.setProperty("--scale", scale.toFixed(5));
  document.documentElement.style.setProperty("--fit-width", `${(DESIGN_WIDTH * scale).toFixed(2)}px`);
  document.documentElement.style.setProperty("--fit-height", `${(DESIGN_HEIGHT * scale).toFixed(2)}px`);
}

function scheduleFit() {
  if (fitFrame) window.cancelAnimationFrame(fitFrame);
  fitFrame = window.requestAnimationFrame(() => {
    fitFrame = null;
    fitLineToViewport();
  });
}

function updateClock() {
  const now = new Date();
  lineRefs.clock.textContent = now.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  lineRefs.clock.dateTime = now.toISOString();
}

function exceptionsFor(order) {
  const template = templateFor(order);
  if (!template) return [];

  const labels = {
    volume: (value) => `ОБЪЁМ ${value}`,
    milk: (value) => (value === "Нет" ? "БЕЗ МОЛОКА" : `${value.toLocaleUpperCase("ru-RU")} МОЛОКО`),
    syrup: (value) => (value === "Нет" ? "БЕЗ СИРОПА" : `СИРОП ${value.toLocaleUpperCase("ru-RU")}`),
  };

  return Object.keys(template.defaults)
    .filter((key) => order.config[key] !== template.defaults[key])
    .map((key) => ({ key, label: labels[key](order.config[key]) }));
}

function exceptionMarkup(order) {
  const exceptions = exceptionsFor(order);
  if (!exceptions.length) {
    return '<span class="exception-chip exception-chip--standard">СТАНДАРТНЫЙ РЕЦЕПТ</span>';
  }
  return exceptions.map((item) => `<span class="exception-chip">${item.label}</span>`).join("");
}

function queuePosition(order) {
  return lineState.queue.findIndex((item) => item.number === order.number) + 1;
}

function renderPhaseStrip() {
  const phases = ["queue", "review", "process", "handoff"];
  const current = phases.indexOf(lineState.screen);
  [...lineRefs.phaseStrip.children].forEach((item, index) => {
    item.classList.toggle("is-active", index === current);
    item.classList.toggle("is-done", index < current);
    if (index === current) item.setAttribute("aria-current", "step");
    else item.removeAttribute("aria-current");
  });
}

function renderQueueDock() {
  const count = lineState.queue.length;
  const totalSeconds = lineState.queue.reduce(
    (sum, order) => sum + (templateFor(order)?.duration ?? 12),
    0,
  );
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  lineRefs.queueMeta.textContent = `${count} ${
    count === 1 ? "заказ" : count < 5 ? "заказа" : "заказов"
  } · ≈ ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  lineRefs.queueList.innerHTML = lineState.queue
    .map((order) => {
      const drink = templateFor(order);
      const exceptions = exceptionsFor(order);
      const note = exceptions.length ? `${exceptions.length} изм.` : "стандарт";
      return `
        <li>
          <button class="queue-item" type="button" data-order="${order.number}"
            aria-current="${order.number === lineState.selectedNumber}"
            aria-label="${orderCode(order)}, ${drink.name}, стол ${order.table}, ${note}">
            <span class="queue-item__number">${String(order.number).padStart(3, "0")}</span>
            <span>
              <strong>${drink.name}</strong>
              <small>СТОЛ ${order.table} · ${note}</small>
            </span>
          </button>
        </li>`;
    })
    .join("");
}

function renderQueueScreen(order) {
  if (!order) {
    return `
      <article class="screen empty-queue">
        <span class="micro-label">ОЧЕРЕДЬ ЗАВЕРШЕНА</span>
        <h1>НЕТ АКТИВНЫХ ЗАКАЗОВ</h1>
        <p>Станция готова. Добавьте заказ вручную, чтобы продолжить тестирование сценария.</p>
        <button class="primary-action" type="button" data-action="new-order">ДОБАВИТЬ ЗАКАЗ</button>
      </article>`;
  }

  const drink = templateFor(order);
  return `
    <article class="screen queue-screen">
      <div class="task-line">
        <span>СЛЕДУЮЩЕЕ ДЕЙСТВИЕ / ВЗЯТЬ ЗАКАЗ</span>
        <span>ПОЗИЦИЯ ${queuePosition(order)} ИЗ ${lineState.queue.length}</span>
      </div>
      <div class="queue-hero">
        <p class="order-code">${orderCode(order)}</p>
        <h1 class="drink-title">${drink.name}</h1>
        <div class="order-route">
          <span>СТОЛ <strong>${order.table}</strong></span>
          <span>СОЗДАН <strong>${order.placedAt}</strong></span>
          <span>ГОТОВНОСТЬ <strong>≈ ${drink.duration} СЕК</strong></span>
        </div>
      </div>
      <div>
        <div class="exception-band">
          <span class="exception-band__label">ИСКЛЮЧЕНИЯ<br />ИЗ РЕЦЕПТА</span>
          ${exceptionMarkup(order)}
        </div>
        <div class="action-stack">
          <button class="primary-action hero-action" type="button" data-action="take">
            <span>ВЗЯТЬ ${orderCode(order)} В РАБОТУ</span>
            <span>ENTER →</span>
          </button>
        </div>
      </div>
    </article>`;
}

function reviewRow(label, value, isException = false) {
  return `
    <div class="${isException ? "is-exception" : ""}">
      <dt>${label}</dt>
      <dd>${value}</dd>
    </div>`;
}

function renderReviewScreen(order) {
  const drink = templateFor(order);
  const defaults = drink.defaults;
  return `
    <article class="screen review-screen">
      <header class="review-header">
        <div>
          <span class="micro-label">ПРОВЕРЬТЕ ТОЛЬКО ОТКЛОНЕНИЯ</span>
          <h1>${drink.name}</h1>
        </div>
        <span class="review-number">${orderCode(order)}</span>
      </header>
      <dl class="review-table">
        ${reviewRow("БАЗОВЫЙ РЕЦЕПТ", drink.recipe)}
        ${reviewRow("ОБЪЁМ", order.config.volume, order.config.volume !== defaults.volume)}
        ${reviewRow("МОЛОКО", order.config.milk, order.config.milk !== defaults.milk)}
        ${reviewRow("СИРОП", order.config.syrup, order.config.syrup !== defaults.syrup)}
        ${reviewRow("ТОЧКА ВЫДАЧИ", `СТОЛ ${order.table}`)}
      </dl>
      <div class="review-actions">
        <button class="secondary-action" type="button" data-action="back">НАЗАД</button>
        <button class="secondary-action" type="button" data-action="edit">ИЗМЕНИТЬ</button>
        <button class="primary-action" type="button" data-action="start">
          <span>ЗАПУСТИТЬ СТАНЦИЮ</span>
          <span>ENTER →</span>
        </button>
      </div>
    </article>`;
}

function renderProcessScreen(order) {
  const drink = templateFor(order);
  return `
    <article class="screen process-screen">
      <header class="process-meta">
        <span>АВТОМАТИЧЕСКИЙ ЦИКЛ / ${orderCode(order)}</span>
        <span>${drink.name.toLocaleUpperCase("ru-RU")} · СТОЛ ${order.table}</span>
      </header>
      <div class="process-core">
        <span id="process-stage-label" class="process-stage-label">ЭТАП 1 / 4 · ПОДГОТОВКА</span>
        <h1 id="process-stage-title" class="process-stage-title">ПРОВЕРКА<br />КОНТУРА</h1>
        <div class="process-readout">
          <strong id="process-time" class="process-time">00:${String(drink.duration).padStart(2, "0")}</strong>
          <span id="process-percent" class="process-percent">0%</span>
        </div>
        <div class="process-track" role="progressbar" aria-label="Прогресс приготовления"
          aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <span id="process-track-value"></span>
        </div>
        <p id="process-hint" class="process-hint">${processStages[0].hint}</p>
      </div>
      <div>
        <ol id="process-steps" class="process-steps">
          ${processStages
            .map(
              (stage, index) =>
                `<li class="${index === 0 ? "is-active" : ""}" data-process-step="${index}">
                  <span>0${index + 1}</span><strong>${stage.label}</strong>
                </li>`,
            )
            .join("")}
        </ol>
        <div class="process-actions">
          <div><span>СТАКАН НА МЕСТЕ</span><span>РЕЦЕПТ ЗАГРУЖЕН</span></div>
          <button class="danger-action" type="button" data-action="stop">ОСТАНОВИТЬ</button>
        </div>
      </div>
    </article>`;
}

function renderHandoffScreen(order) {
  const drink = templateFor(order);
  return `
    <article class="screen handoff-screen">
      <header class="handoff-header">
        <span>ЗАКАЗ ЗАВЕРШЁН</span>
        <span>${currentTime()}</span>
      </header>
      <div class="handoff-core">
        <p class="handoff-code">${orderCode(order)}</p>
        <h1 class="handoff-title">ГОТОВО<br />К ВЫДАЧЕ</h1>
        <p class="handoff-copy">
          ${drink.name} находится в зоне выдачи. Передайте напиток на стол ${order.table}
          и подтвердите завершение.
        </p>
      </div>
      <button class="primary-action handoff-action" type="button" data-action="handoff">
        <span>НАПИТОК ПЕРЕДАН</span>
        <span>ENTER →</span>
      </button>
    </article>`;
}

function renderMain() {
  const order = selectedOrder();
  lineRefs.app.dataset.screen = lineState.screen;
  renderPhaseStrip();
  renderQueueDock();

  if (lineState.screen === "queue") lineRefs.view.innerHTML = renderQueueScreen(order);
  if (lineState.screen === "review") lineRefs.view.innerHTML = renderReviewScreen(order);
  if (lineState.screen === "process") lineRefs.view.innerHTML = renderProcessScreen(order);
  if (lineState.screen === "handoff") lineRefs.view.innerHTML = renderHandoffScreen(order);
}

function changeScreen(screen, focus = true) {
  lineState.screen = screen;
  renderMain();
  if (focus) {
    window.requestAnimationFrame(() => lineRefs.view.focus({ preventScroll: true }));
  }
}

function visibleCommandResults() {
  const query = lineState.commandQuery.trim().toLocaleLowerCase("ru-RU");
  if (!query) return drinkTemplates;
  return drinkTemplates.filter(
    (drink) =>
      drink.name.toLocaleLowerCase("ru-RU").includes(query) ||
      drink.recipe.toLocaleLowerCase("ru-RU").includes(query) ||
      drink.code.includes(query),
  );
}

function renderCommandResults() {
  const results = visibleCommandResults();
  if (lineState.commandActiveIndex >= results.length) lineState.commandActiveIndex = 0;
  lineRefs.commandResultCount.textContent = `${results.length} ${
    results.length === 1 ? "вариант" : results.length < 5 ? "варианта" : "вариантов"
  }`;

  if (!results.length) {
    lineRefs.commandResults.innerHTML = `
      <li class="command-empty"><strong>НИЧЕГО НЕ НАЙДЕНО</strong>
      <span>Попробуйте название напитка или код 01–06.</span></li>`;
    return;
  }

  lineRefs.commandResults.innerHTML = results
    .map(
      (drink, index) => `
        <li>
          <button class="command-result ${index === lineState.commandActiveIndex ? "is-keyboard-active" : ""}"
            type="button" data-drink-id="${drink.id}">
            <span class="command-result__code">${drink.code}</span>
            <strong>${drink.name}</strong>
            <span>${drink.recipe}</span>
            <small>${drink.duration} СЕК</small>
          </button>
        </li>`,
    )
    .join("");
}

function openCommand() {
  if (lineState.screen === "process" || lineState.screen === "handoff") return;
  lineState.commandOpen = true;
  lineState.commandQuery = "";
  lineState.commandActiveIndex = 0;
  lineRefs.commandInput.value = "";
  lineRefs.commandLayer.classList.add("is-open");
  lineRefs.commandLayer.setAttribute("aria-hidden", "false");
  lineRefs.commandLayer.removeAttribute("inert");
  renderCommandResults();
  window.requestAnimationFrame(() => lineRefs.commandInput.focus());
}

function closeCommand() {
  lineState.commandOpen = false;
  lineRefs.commandLayer.classList.remove("is-open");
  lineRefs.commandLayer.setAttribute("aria-hidden", "true");
  lineRefs.commandLayer.setAttribute("inert", "");
  lineRefs.openCommand.focus();
}

function addOrder(drinkId) {
  const drink = drinkTemplates.find((item) => item.id === drinkId);
  if (!drink) return;

  const order = {
    number: lineState.nextNumber,
    drinkId,
    table: "—",
    placedAt: currentTime(),
    config: { ...drink.defaults },
  };
  lineState.nextNumber += 1;
  lineState.queue.push(order);
  lineState.selectedNumber = order.number;
  closeCommand();
  changeScreen("queue");
  showToast(`${orderCode(order)} · ${drink.name} добавлен в очередь.`);
}

function renderEditFields() {
  const order = selectedOrder();
  if (!order) return;
  const labels = { volume: "ОБЪЁМ", milk: "МОЛОКО", syrup: "СИРОП" };
  lineRefs.editFields.innerHTML = Object.entries(editOptions)
    .map(
      ([key, values]) => `
        <fieldset class="edit-group">
          <legend>${labels[key]}</legend>
          <div class="edit-options">
            ${values
              .map(
                (value) => `
                  <label class="edit-option">
                    <input type="radio" name="${key}" value="${value}"
                      ${order.config[key] === value ? "checked" : ""} />
                    <span>${value}</span>
                  </label>`,
              )
              .join("")}
          </div>
        </fieldset>`,
    )
    .join("");
}

function openEditDialog() {
  renderEditFields();
  lineRefs.editDialog.showModal();
}

function startProcess() {
  const order = selectedOrder();
  const drink = templateFor(order);
  if (!order || !drink || lineState.process) return;

  lineState.process = {
    orderNumber: order.number,
    startedAt: performance.now(),
    duration: drink.duration * 1000,
  };
  changeScreen("process");
  updateProcess();
  lineState.processTimer = window.setInterval(updateProcess, 100);
}

function updateProcess() {
  if (!lineState.process || lineState.screen !== "process") return;
  const elapsed = performance.now() - lineState.process.startedAt;
  const progress = Math.min(elapsed / lineState.process.duration, 1);
  const stageIndex = Math.min(Math.floor(progress * processStages.length), processStages.length - 1);
  const remaining = Math.max(Math.ceil((lineState.process.duration - elapsed) / 1000), 0);
  const percent = Math.round(progress * 100);
  const stage = processStages[stageIndex];
  const label = document.querySelector("#process-stage-label");
  const title = document.querySelector("#process-stage-title");
  const time = document.querySelector("#process-time");
  const percentNode = document.querySelector("#process-percent");
  const track = document.querySelector("#process-track-value");
  const progressbar = document.querySelector(".process-track");
  const hint = document.querySelector("#process-hint");
  const steps = [...document.querySelectorAll("[data-process-step]")];

  if (!label || !title || !time || !percentNode || !track || !progressbar || !hint) return;
  label.textContent = `ЭТАП ${stageIndex + 1} / 4 · ${stage.label}`;
  title.innerHTML = stage.title;
  time.textContent = `00:${String(remaining).padStart(2, "0")}`;
  percentNode.textContent = `${percent}%`;
  track.style.transform = `scaleX(${progress})`;
  progressbar.setAttribute("aria-valuenow", String(percent));
  hint.textContent = stage.hint;
  steps.forEach((item, index) => {
    item.classList.toggle("is-active", index === stageIndex);
    item.classList.toggle("is-done", index < stageIndex);
  });

  if (progress >= 1) finishProcess();
}

function finishProcess() {
  window.clearInterval(lineState.processTimer);
  lineState.processTimer = null;
  lineState.process = null;
  changeScreen("handoff");
  if (lineState.sound) {
    lineRefs.audio.currentTime = 0;
    lineRefs.audio.play().catch(() => showToast("Напиток готов к выдаче."));
  }
}

function stopProcess() {
  window.clearInterval(lineState.processTimer);
  lineState.processTimer = null;
  lineState.process = null;
  lineRefs.stopDialog.close();
  changeScreen("review");
  showToast("Цикл остановлен. Заказ сохранён для повторного запуска.", true);
}

function completeHandoff() {
  const order = selectedOrder();
  if (!order) return;
  lineState.queue = lineState.queue.filter((item) => item.number !== order.number);
  lineState.selectedNumber = lineState.queue[0]?.number ?? null;
  changeScreen("queue");
  showToast(`${orderCode(order)} передан. Очередь обновлена.`);
}

function showToast(message, isError = false) {
  window.clearTimeout(lineState.toastTimer);
  lineRefs.toast.textContent = message;
  lineRefs.toast.classList.toggle("is-error", isError);
  lineRefs.toast.classList.add("is-visible");
  lineState.toastTimer = window.setTimeout(() => {
    lineRefs.toast.classList.remove("is-visible");
  }, 3400);
}

function runPrimaryAction() {
  if (lineState.commandOpen) {
    const result = visibleCommandResults()[lineState.commandActiveIndex];
    if (result) addOrder(result.id);
    return;
  }
  if (lineState.screen === "queue" && selectedOrder()) changeScreen("review");
  else if (lineState.screen === "review") startProcess();
  else if (lineState.screen === "handoff") completeHandoff();
}

lineRefs.view.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  if (action === "take") changeScreen("review");
  if (action === "back") changeScreen("queue");
  if (action === "edit") openEditDialog();
  if (action === "start") startProcess();
  if (action === "stop") lineRefs.stopDialog.showModal();
  if (action === "handoff") completeHandoff();
  if (action === "new-order") openCommand();
});

lineRefs.queueList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-order]");
  if (!button || lineState.screen === "process" || lineState.screen === "handoff") return;
  lineState.selectedNumber = Number(button.dataset.order);
  changeScreen("queue", false);
});

lineRefs.openCommand.addEventListener("click", openCommand);
lineRefs.closeCommand.addEventListener("click", closeCommand);

lineRefs.commandInput.addEventListener("input", () => {
  lineState.commandQuery = lineRefs.commandInput.value;
  lineState.commandActiveIndex = 0;
  renderCommandResults();
});

lineRefs.commandResults.addEventListener("click", (event) => {
  const button = event.target.closest("[data-drink-id]");
  if (button) addOrder(button.dataset.drinkId);
});

lineRefs.editForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const order = selectedOrder();
  if (!order) return;
  const formData = new FormData(lineRefs.editForm);
  order.config = {
    volume: formData.get("volume"),
    milk: formData.get("milk"),
    syrup: formData.get("syrup"),
  };
  lineRefs.editDialog.close();
  renderMain();
  showToast("Изменения сохранены. Проверьте выделенные исключения.");
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-close-dialog]");
  if (!button) return;
  document.querySelector(`#${button.dataset.closeDialog}`)?.close();
});

lineRefs.machineStatus.addEventListener("click", () => lineRefs.machineDialog.showModal());
lineRefs.confirmStop.addEventListener("click", stopProcess);

lineRefs.sound.addEventListener("click", () => {
  lineState.sound = !lineState.sound;
  lineRefs.sound.setAttribute("aria-pressed", String(lineState.sound));
  lineRefs.sound.textContent = lineState.sound ? "ЗВУК" : "ТИХО";
  showToast(lineState.sound ? "Звуковые подтверждения включены." : "Звук выключен.");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !lineState.commandOpen && !event.metaKey && !event.ctrlKey) {
    event.preventDefault();
    openCommand();
    return;
  }

  if (lineState.commandOpen) {
    const results = visibleCommandResults();
    if (event.key === "Escape") {
      event.preventDefault();
      closeCommand();
      return;
    }
    if (event.key === "ArrowDown" && results.length) {
      event.preventDefault();
      lineState.commandActiveIndex = (lineState.commandActiveIndex + 1) % results.length;
      renderCommandResults();
      return;
    }
    if (event.key === "ArrowUp" && results.length) {
      event.preventDefault();
      lineState.commandActiveIndex =
        (lineState.commandActiveIndex - 1 + results.length) % results.length;
      renderCommandResults();
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      runPrimaryAction();
    }
    return;
  }

  if (document.querySelector("dialog[open]")) return;
  if (event.key === "Enter") {
    event.preventDefault();
    runPrimaryAction();
  }
  if (event.key === "Escape" && lineState.screen === "review") {
    event.preventDefault();
    changeScreen("queue");
  }
});

window.addEventListener("resize", scheduleFit, { passive: true });
window.visualViewport?.addEventListener("resize", scheduleFit, { passive: true });

fitLineToViewport();
updateClock();
window.setInterval(updateClock, 30000);
renderMain();
