const DESIGN_WIDTH = 800;
const DESIGN_HEIGHT = 1280;

const folioRoot = document.documentElement;
const folioCards = [...document.querySelectorAll(".folio-card")];
const folioFilters = [...document.querySelectorAll(".folio-filter")];
const folioCount = document.querySelector("#folio-count");
const folioSelection = document.querySelector("#folio-selection");
const folioToast = document.querySelector("#folio-toast");
let folioToastTimer;

function fitFolioToViewport() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const safeGap = Math.min(12, Math.min(viewportWidth, viewportHeight) * 0.012);
  const scale = Math.max(0.05, Math.min(1, (viewportWidth - safeGap * 2) / DESIGN_WIDTH, (viewportHeight - safeGap * 2) / DESIGN_HEIGHT));

  folioRoot.style.setProperty("--folio-scale", String(scale));
  folioRoot.style.setProperty("--folio-fit-width", String(Math.round(DESIGN_WIDTH * scale)) + "px");
  folioRoot.style.setProperty("--folio-fit-height", String(Math.round(DESIGN_HEIGHT * scale)) + "px");
}

function showFolioToast(message) {
  window.clearTimeout(folioToastTimer);
  folioToast.textContent = message;
  folioToast.classList.add("is-visible");
  folioToastTimer = window.setTimeout(() => folioToast.classList.remove("is-visible"), 2200);
}

folioFilters.forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    const { filter } = filterButton.dataset;
    folioFilters.forEach((button) => button.classList.toggle("is-active", button === filterButton));
    let visibleCards = 0;
    folioCards.forEach((card) => {
      const visible = filter === "all" || card.dataset.category === filter;
      card.hidden = !visible;
      if (visible) visibleCards += 1;
    });
    folioCount.textContent = String(visibleCards).padStart(2, "0");
    folioSelection.textContent = filter === "all" ? "ВЫБЕРИТЕ КАРТОЧКУ" : "ФИЛЬТР: " + filterButton.textContent;
  });
});

folioCards.forEach((card) => {
  card.addEventListener("click", () => {
    folioCards.forEach((item) => item.classList.toggle("is-selected", item === card));
    folioSelection.textContent = "ВЫБРАНО: " + card.dataset.name;
    showFolioToast(card.dataset.name + " — карточка готова к сборке");
  });
});

document.querySelector("#folio-next").addEventListener("click", () => showFolioToast("Открыта сборка следующего заказа"));
window.addEventListener("resize", fitFolioToViewport);
fitFolioToViewport();
