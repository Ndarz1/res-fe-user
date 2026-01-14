import { fetchData } from "../../js/api.js";
import { formatRupiah, truncateText } from "../../js/utils/format.js";

const NO_IMAGE_BASE64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

let allDestinations = [];

export async function loadDestinations(categoryId = null) {
  const containerId = "destinations-placeholder";
  const gridId = "destinations-grid";

  try {
    let container = document.getElementById(gridId);

    if (!container) {
      const responseHTML = await fetch(
        "/src/features/destinations/destinations.html"
      );
      const html = await responseHTML.text();
      document.getElementById(containerId).innerHTML = html;
      container = document.getElementById(gridId);
    }

    if (allDestinations.length === 0) {
      const endpoint = "/wisata";
      const result = await fetchData(endpoint);
      if (result && result.length > 0) {
        allDestinations = result;
      }
    }

    if (allDestinations.length > 0) {
      container.innerHTML = "";

      const filteredData = categoryId
        ? allDestinations.filter((item) => item.category_id == categoryId)
        : allDestinations;

      if (filteredData.length > 0) {
        container.innerHTML = filteredData
          .map((item) => createCard(item))
          .join("");
      } else {
        showEmptyState(container);
      }
    } else {
      showEmptyState(container);
    }
  } catch (error) {
    console.error(error);
  }
}

function showEmptyState(container) {
  container.innerHTML = `
        <div class="col-span-full py-24 text-center">
            <p class="font-serif text-2xl text-slate-800 italic mb-2">Destinasi tidak ditemukan</p>
            <p class="text-slate-500 font-light text-sm font-sans">Silakan pilih kategori yang berbeda.</p>
        </div>`;
}

function createCard(item) {
  const imgUrl = item.image_url || NO_IMAGE_BASE64;
  const ratingScore = item.rating_total
    ? parseFloat(item.rating_total).toFixed(1)
    : "New";
  const reviewCount = item.total_reviews || 0;

  return `
        <a href="detail.html?id=${item.id}" 
           class="group block h-full bg-white transition-colors duration-300">
            
            <div class="relative overflow-hidden aspect-[4/5] mb-5 bg-gray-100">
                <img src="${imgUrl}" 
                     alt="${item.nama_tempat}" 
                     class="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                     loading="lazy"
                     onerror="this.onerror=null;this.src='${NO_IMAGE_BASE64}'">
                
                <div class="absolute top-0 right-0 bg-white/95 backdrop-blur-sm px-3 py-2 text-xs font-serif font-bold text-slate-900 z-10">
                    ★ ${ratingScore} <span class="font-sans font-normal text-slate-400 ml-1">(${reviewCount})</span>
                </div>
            </div>

            <div class="pr-2 pb-4">
                <p class="text-[10px] font-bold tracking-[0.2em] text-blue-900 uppercase mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                    ${item.category_name || "Wisata"}
                </p>
                
                <h3 class="text-2xl font-serif text-slate-900 group-hover:text-blue-900 transition-colors mb-2 leading-tight line-clamp-1">
                    ${item.nama_tempat}
                </h3>
                
                <div class="flex items-center gap-2 text-slate-500 text-sm font-light mb-6 font-sans">
                   <span class="truncate tracking-wide">${truncateText(
                     item.lokasi || "Lokasi tidak tersedia",
                     35
                   )}</span>
                </div>

                <div class="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                    <span class="text-xs text-slate-400 font-medium uppercase tracking-wider font-sans">Mulai dari</span>
                    <span class="text-lg font-medium text-slate-900 font-serif italic">${formatRupiah(
                      item.harga_tiket
                    )}</span>
                </div>
            </div>
        </a>
    `;
}
