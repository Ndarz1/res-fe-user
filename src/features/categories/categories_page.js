import { loadNavbar } from "../navbar/navbar.js";
import { loadFooter } from "../footer/footer.js";
import { fetchData, API_BASE_URL } from "../../js/api.js";
import { formatRupiah, truncateText } from "../../js/utils/format.js";

const SERVER_URL = API_BASE_URL.replace("/api", "");
const NO_IMAGE = "https://via.placeholder.com/400x500?text=No+Image";

const CATEGORY_CONTENT = {
  pantai: {
    image: "../../../assets/bg-2.jpg",
    title: "Bahari & Pesisir",
    desc: "Simfoni ombak dan pasir putih.",
  },
  gunung: {
    image: "../../../assets/bg-3.jpg",
    title: "Dataran Tinggi",
    desc: "Ketenangan di antara awan.",
  },
  candi: {
    image: "../../../assets/bg-4.jpg",
    title: "Spiritual & Budaya",
    desc: "Keagungan arsitektur kuno.",
  },
  kuliner: {
    image: "../../../assets/bg-5.jpg",
    title: "Cita Rasa Lokal",
    desc: "Petualangan rasa yang otentik.",
  },
  sejarah: {
    image: "../../../assets/bg-6.jpg",
    title: "Jejak Masa Lalu",
    desc: "Lorong waktu warisan leluhur.",
  },
  default: {
    image:
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80",
    title: "Wisata Umum",
    desc: "Jelajahi keindahan nusantara.",
  },
};

let allDestinations = [];

document.addEventListener("DOMContentLoaded", async () => {
  loadNavbar();
  loadFooter();
  await Promise.all([initCategories(), initDestinations()]);
});

async function initCategories() {
  const container = document.getElementById("categories-grid");
  try {
    const categories = await fetchData("/categories");

    if (!categories || categories.length === 0) {
      container.innerHTML = `<p class="text-center w-full text-slate-400">Gagal memuat kategori</p>`;
      return;
    }

    container.innerHTML = categories
      .map((cat) => {
        const content = CATEGORY_CONTENT[cat.slug] || CATEGORY_CONTENT.default;

        return `
          <div onclick="filterBy('${cat.id}', '${content.title}')" 
               class="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-1">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-20 opacity-90 transition-opacity duration-500"></div>
            <img src="${content.image}" 
                 class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                 alt="${cat.name}">
            <div class="absolute bottom-0 left-0 p-8 z-30 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
              <p class="text-slate-300 text-[10px] tracking-[0.3em] uppercase mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">Jelajahi</p>
              <h3 class="text-3xl font-serif text-white italic group-hover:not-italic transition-all duration-500 mb-1">${content.title}</h3>
              <p class="text-white/80 text-sm font-light font-sans opacity-80">${content.desc}</p>
            </div>
            <div class="absolute top-6 right-6 z-30 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
              <span class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </span>
            </div>
          </div>
        `;
      })
      .join("");
  } catch {
    container.innerHTML = `<p class="text-center text-red-400">Gagal terhubung ke server.</p>`;
  }
}

async function initDestinations() {
  try {
    const data = await fetchData("/wisata");
    allDestinations = data || [];
    const section = document.getElementById("result-section");
    section.classList.remove("hidden");
    setTimeout(() => section.classList.remove("opacity-0"), 100);
    renderDestinations(allDestinations);
  } catch {}
}

function renderDestinations(items) {
  const container = document.getElementById("destinations-container");

  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-24 text-center">
        <p class="font-serif text-3xl text-slate-300 italic mb-2">Belum ada destinasi.</p>
        <p class="text-slate-400 font-light text-sm">Cobalah memilih kategori lainnya.</p>
      </div>`;
    return;
  }

  container.innerHTML = items
    .map((item, index) => {
      const rating = item.rating_total
        ? parseFloat(item.rating_total).toFixed(1)
        : "Baru";
      const reviews = item.total_reviews || 0;
      const delay = index * 100;

      let displayImage = NO_IMAGE;
      if (item.image_url) {
        displayImage = item.image_url.startsWith("http")
          ? item.image_url
          : `${SERVER_URL}${item.image_url}`;
      }

      return `
        <a href="/detail.html?id=${item.id}" 
           class="group block fade-in opacity-0" 
           style="animation: fadeIn 0.8s ease-out forwards; animation-delay: ${delay}ms">
          <div class="relative overflow-hidden rounded-lg aspect-[4/5] mb-5 shadow-md bg-slate-100">
            <img src="${displayImage}" 
                 class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                 alt="${item.nama_tempat}"
                 onerror="this.src='${NO_IMAGE}'">
            <div class="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-serif font-bold text-slate-900 shadow-sm border border-white/50">
              ★ ${rating} <span class="font-sans font-normal text-slate-500 ml-1">(${reviews})</span>
            </div>
          </div>
          <div class="pr-2">
            <p class="text-[10px] font-bold tracking-[0.2em] text-blue-900 uppercase mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
              ${item.category_name || "Wisata"}
            </p>
            <h3 class="text-2xl font-serif text-slate-900 group-hover:text-blue-800 transition-colors mb-3 leading-tight">
              ${item.nama_tempat}
            </h3>
            <p class="text-slate-500 text-sm font-light leading-relaxed line-clamp-2 mb-4 font-sans">
              ${truncateText(item.deskripsi || item.lokasi, 90)}
            </p>
            <div class="flex items-center justify-between border-t border-slate-100 pt-4 mt-2 group-hover:border-blue-100 transition-colors">
              <span class="text-xs text-slate-400 font-light uppercase tracking-wider">Mulai dari</span>
              <span class="text-lg font-medium text-slate-900 font-serif italic">${formatRupiah(
                item.harga_tiket
              )}</span>
            </div>
          </div>
        </a>
      `;
    })
    .join("");
}

window.filterBy = (categoryId, categoryName) => {
  document.getElementById(
    "selected-category-title"
  ).innerHTML = `Koleksi: <span class="italic text-blue-900 font-serif">${categoryName}</span>`;
  document
    .getElementById("result-section")
    .scrollIntoView({ behavior: "smooth", block: "start" });
  renderDestinations(
    allDestinations.filter((d) => d.category_id == categoryId)
  );
};

window.resetFilter = () => {
  document.getElementById("selected-category-title").textContent =
    "Semua Koleksi";
  renderDestinations(allDestinations);
};
