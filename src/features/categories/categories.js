import { loadDestinations } from "../destinations/destinations.js";

const categoriesData = [
  { id: "all", name: "Semua", icon: "grid" },
  { id: 1, name: "Pantai", icon: "beach" },
  { id: 2, name: "Gunung", icon: "mountain" },
  { id: 3, name: "Sejarah", icon: "temple" },
  { id: 4, name: "Kuliner", icon: "food" },
];

const iconMap = {
  grid: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>`,
  beach: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`,
  mountain: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>`,
  temple: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>`,
  food: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>`,
};

let activeCategory = "all";

export function loadCategories() {
  renderCategoryButtons();
}

function renderCategoryButtons() {
  const container = document.getElementById("categories-container");
  if (!container) return;

  container.innerHTML = "";

  categoriesData.forEach((cat) => {
    const isActive = cat.id === activeCategory;
    const btn = document.createElement("button");

    btn.className = `
            flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300 text-sm font-medium whitespace-nowrap
            ${
              isActive
                ? "bg-gray-900 border-gray-900 text-white shadow-md"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
            }
        `;

    btn.innerHTML = `
            <span>${iconMap[cat.icon] || iconMap.grid}</span>
            <span>${cat.name}</span>
        `;

    btn.onclick = () => handleCategoryClick(cat.id);
    container.appendChild(btn);
  });
}

function handleCategoryClick(id) {
  if (activeCategory === id) return;
  activeCategory = id;
  renderCategoryButtons();

  const filterId = id === "all" ? null : id;
  loadDestinations(filterId);
}
