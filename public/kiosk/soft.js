const DESIGN_WIDTH = 800;
const DESIGN_HEIGHT = 1280;

const softRoot = document.documentElement;
const softOrderCount = document.querySelector("#soft-order-count");
const softProgressLabel = document.querySelector("#soft-progress-label");
const softModeDescription = document.querySelector("#soft-mode-description");
const softToast = document.querySelector("#soft-toast");

let toastTimer;

function fitSoftToViewport() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const safeGap = Math.min(12, Math.min(viewportWidth, viewportHeight) * 0.012);
  const scale = Math.max(0.05, Math.min(1, (viewportWidth - safeGap * 2) / DESIGN_WIDTH, (viewportHeight - safeGap * 2) / DESIGN_HEIGHT));

  softRoot.style.setProperty("--soft-scale", String(scale));
  softRoot.style.setProperty("--soft-fit-width", String(Math.round(DESIGN_WIDTH * scale)) + "px");
  softRoot.style.setProperty("--soft-fit-height", String(Math.round(DESIGN_HEIGHT * scale)) + "px");
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  softToast.textContent = message;
  softToast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => softToast.classList.remove("is-visible"), 2400);
}

document.querySelectorAll(".soft-scene").forEach((sceneButton) => {
  sceneButton.addEventListener("click", () => {
    document.querySelectorAll(".soft-scene").forEach((button) => button.classList.toggle("is-active", button === sceneButton));
    const isMorning = sceneButton.dataset.scene === "Утренний поток";
    softOrderCount.textContent = sceneButton.dataset.orders;
    softProgressLabel.textContent = String(sceneButton.dataset.progress) + "%";
    softModeDescription.textContent = isMorning ? "Следующий заказ — капучино 300 мл" : "Следующий заказ — эспрессо без сахара";
    document.querySelector("#status-title").textContent = sceneButton.dataset.scene.toUpperCase();
    showToast("Режим «" + sceneButton.dataset.scene + "» включён");
  });
});

document.querySelectorAll(".soft-resource").forEach((resourceButton) => {
  resourceButton.addEventListener("click", () => {
    document.querySelectorAll(".soft-resource").forEach((button) => button.classList.toggle("is-selected", button === resourceButton));
    const { resource, detail } = resourceButton.dataset;
    document.querySelector("#soft-resource-note").textContent = resource + ": " + detail;
  });
});

document.querySelector("#soft-recipe-button").addEventListener("click", () => showToast("Откроем карточку нового рецепта в следующем сценарии"));
document.querySelector("#soft-start-button").addEventListener("click", () => showToast("Открыта сборка следующего заказа"));
window.addEventListener("resize", fitSoftToViewport);
fitSoftToViewport();
