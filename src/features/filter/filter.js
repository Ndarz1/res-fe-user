import { loadDestinations } from "../destinations/destinations.js";
import { fetchData } from "../../js/api.js";

const iconMap = {
  grid: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>`,
  beach: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`,
  mountain: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>`,
  temple: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>`,
  waterfall: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>`,
  food: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>`,
  history: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
};

let activeCategory = "all";
let categoriesData = [];

export async function loadCategories() {
  try {
    const result = await fetchData("/categories");

    categoriesData = [
      { id: "all", name: "Semua", icon: "grid" },
      ...(result || []),
    ];

    renderDropdown();
    setupEventListeners();
  } catch (error) {
    console.error("Gagal load kategori:", error);
    categoriesData = [{ id: "all", name: "Semua", icon: "grid" }];
    renderDropdown();
  }
}

function setupEventListeners() {
  window.addEventListener("click", (e) => {
    const container = document.getElementById("categories-container");
    const dropdown = document.getElementById("cat-menu");
    const trigger = document.getElementById("cat-trigger");

    if (container && dropdown && trigger) {
      if (!container.contains(e.target)) {
        dropdown.classList.add("hidden");
        dropdown.classList.remove("opacity-100", "scale-100");
        dropdown.classList.add("opacity-0", "scale-95");

        trigger.classList.remove("ring-2", "ring-blue-100", "border-blue-500");
        trigger.classList.add("border-gray-200");
      }
    }
  });
}

function renderDropdown() {
  const container = document.getElementById("categories-container");
  if (!container) return;

  const activeItem =
    categoriesData.find((c) => c.id == activeCategory) || categoriesData[0];

  const currentIcon = iconMap[activeItem.icon] || iconMap.grid;

  container.innerHTML = `
        <button id="cat-trigger" class="w-full bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all duration-300 active:scale-[0.98] group">
            <div class="flex items-center gap-3 overflow-hidden">
                <div class="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-blue-50 flex items-center justify-center text-gray-500 group-hover:text-blue-600 transition-colors flex-shrink-0">
                    ${currentIcon}
                </div>
                <span class="font-semibold text-gray-700 group-hover:text-gray-900 truncate tracking-tight">${
                  activeItem.name
                }</span>
            </div>
            <div class="bg-gray-50 group-hover:bg-blue-50 rounded-full p-1.5 transition-colors">
                <svg id="cat-chevron" class="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-transform duration-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>
        </button>

        <div id="cat-menu" class="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden hidden transform transition-all duration-200 origin-top z-50">
            <div class="max-h-72 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
                ${categoriesData
                  .map(
                    (cat) => `
                    <div class="cat-item w-full text-left px-4 py-3 flex items-center gap-3 rounded-xl transition-all cursor-pointer group ${
                      cat.id == activeCategory
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                    }" data-id="${cat.id}">
                        <span class="${
                          cat.id == activeCategory
                            ? "text-blue-600"
                            : "text-gray-400 group-hover:text-gray-600"
                        }">${iconMap[cat.icon] || iconMap.grid}</span>
                        <span>${cat.name}</span>
                        ${
                          cat.id == activeCategory
                            ? `
                        <svg class="w-4 h-4 ml-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        `
                            : ""
                        }
                    </div>
                `
                  )
                  .join("")}
            </div>
        </div>
    `;

  const trigger = document.getElementById("cat-trigger");
  const menu = document.getElementById("cat-menu");
  const chevron = document.getElementById("cat-chevron");

  trigger.onclick = () => {
    const isHidden = menu.classList.contains("hidden");
    if (isHidden) {
      // Open
      menu.classList.remove("hidden");
      setTimeout(() => {
        menu.classList.remove("opacity-0", "scale-95");
        menu.classList.add("opacity-100", "scale-100");
      }, 10);

      chevron.classList.add("rotate-180");
      trigger.classList.remove("border-gray-200");
      trigger.classList.add("border-blue-500", "ring-2", "ring-blue-100");
    } else {
      // Close
      menu.classList.remove("opacity-100", "scale-100");
      menu.classList.add("opacity-0", "scale-95");
      setTimeout(() => {
        menu.classList.add("hidden");
      }, 200);

      chevron.classList.remove("rotate-180");
      trigger.classList.remove("border-blue-500", "ring-2", "ring-blue-100");
      trigger.classList.add("border-gray-200");
    }
  };

  document.querySelectorAll(".cat-item").forEach((item) => {
    item.onclick = () => {
      const id = item.getAttribute("data-id");
      handleCategoryClick(id);
    };
  });
}

function handleCategoryClick(id) {
  if (activeCategory == id) return;

  activeCategory = id;
  renderDropdown();

  const filterId = id === "all" ? null : id;
  loadDestinations(filterId);
}
