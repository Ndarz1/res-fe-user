import { fetchData } from "../../js/api.js";
import { formatRupiah, truncateText } from "../../js/utils/format.js";

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

    const result = await getDummyData(categoryId);

    if (result && result.length > 0) {
      container.innerHTML = "";
      result.forEach((item) => {
        container.innerHTML += createCard(item);
      });
    } else {
      container.innerHTML = `
        <div class="col-span-full py-20 text-center">
            <p class="text-gray-500 text-lg">Belum ada destinasi untuk kategori ini.</p>
            <button onclick="window.location.reload()" class="mt-4 text-blue-600 font-medium hover:underline">Reset Filter</button>
        </div>`;
    }
  } catch (error) {
    console.error("Error loading destinations:", error);
  }
}

async function getDummyData(catId) {
  const data = [
    {
      id: 1,
      nama_tempat: "Pantai Kuta",
      category_id: 1,
      category_name: "Pantai",
      lokasi: "Bali",
      harga_tiket: 0,
      rating_total: 4.5,
      image_url:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      nama_tempat: "Gunung Bromo",
      category_id: 2,
      category_name: "Gunung",
      lokasi: "Jawa Timur",
      harga_tiket: 50000,
      rating_total: 4.8,
      image_url:
        "https://images.unsplash.com/photo-1605218457336-92744572228d?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 3,
      nama_tempat: "Candi Borobudur",
      category_id: 3,
      category_name: "Sejarah",
      lokasi: "Magelang",
      harga_tiket: 75000,
      rating_total: 4.9,
      image_url:
        "https://images.unsplash.com/photo-1528497378648-533b01416244?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 4,
      nama_tempat: "Pantai Pink",
      category_id: 1,
      category_name: "Pantai",
      lokasi: "NTT",
      harga_tiket: 15000,
      rating_total: 4.7,
      image_url:
        "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 5,
      nama_tempat: "Nasi Gudeg Yu Djum",
      category_id: 4,
      category_name: "Kuliner",
      lokasi: "Yogyakarta",
      harga_tiket: 35000,
      rating_total: 4.6,
      image_url:
        "https://images.unsplash.com/photo-1626574943968-30122f8a1a38?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 6,
      nama_tempat: "Hutan Pinus Mangunan",
      category_id: 5,
      category_name: "Hutan",
      lokasi: "Bantul, Yogyakarta",
      harga_tiket: 5000,
      rating_total: 4.5,
      image_url:
        "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80",
    },
  ];

  if (!catId) return data;
  return data.filter((item) => item.category_id == catId);
}

function createCard(item) {
  const imgUrl =
    item.image_url || "https://via.placeholder.com/600x400?text=No+Image";

  return `
        <a href="detail.html?id=${
          item.id
        }" class="group block h-full fade-in-up bg-white rounded-2xl hover:shadow-xl transition-shadow duration-300">
            <div class="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4">
                <img src="${imgUrl}" 
                     alt="${item.nama_tempat}" 
                     class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/600x400?text=Image+Error'">
                
                <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm flex items-center gap-1">
                    <svg class="w-3 h-3 text-yellow-500 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    ${item.rating_total}
                </div>
            </div>

            <div class="flex flex-col flex-grow px-1 pb-4">
                <p class="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wider">${
                  item.category_name
                }</p>
                <h3 class="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                    ${item.nama_tempat}
                </h3>
                
                <div class="flex items-center gap-1 text-gray-500 text-sm mb-4">
                    <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span class="truncate">${truncateText(
                      item.lokasi,
                      25
                    )}</span>
                </div>

                <div class="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                    <span class="text-xs text-gray-400">Harga Tiket</span>
                    <span class="text-lg font-bold text-gray-900">${formatRupiah(
                      item.harga_tiket
                    )}</span>
                </div>
            </div>
        </a>
    `;
}
