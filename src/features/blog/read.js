import { formatRupiah } from "../../js/utils/format.js";

const BASE_HOST =
  window.location.hostname === "127.0.0.1" ? "127.0.0.1" : "localhost";
const API_BASE_URL = `http://${BASE_HOST}:8080/api`;

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    window.location.href = "blog.html";
    return;
  }

  fetchPostDetail(slug);
});

async function fetchPostDetail(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}/blog/detail?slug=${slug}`);

    if (res.status === 404) {
      document.body.innerHTML = `<div class="h-screen flex items-center justify-center text-2xl font-serif">Artikel tidak ditemukan</div>`;
      return;
    }

    const json = await res.json();
    if (res.ok) {
      renderContent(json.data);
      renderSoftSelling(json.data.related_wisata);
    }
  } catch (err) {
    console.error(err);
  }
}

function renderContent(post) {
  document.title = `${post.title} - Eksplora Journal`;

  const titleEl = document.getElementById("post-title");
  if (titleEl) {
    titleEl.textContent = post.title;
    titleEl.classList.remove("animate-pulse");
  }

  const metaContainer = document.getElementById("meta-container");
  if (metaContainer) {
    metaContainer.classList.remove("animate-pulse");
    metaContainer.innerHTML = `
      <span class="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wide">${post.category_name}</span>
      <span>&bull;</span>
      <span>${post.published_at}</span>
      <span>&bull;</span>
      <span>Oleh <span class="text-slate-900 font-medium">${post.author_name}</span></span>
    `;
  }

  const imgEl = document.getElementById("post-image");
  if (imgEl) {
    imgEl.src =
      post.thumbnail ||
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop";
    imgEl.style.display = "block";
  }

  const contentEl = document.getElementById("post-content");
  if (contentEl) {
    contentEl.innerHTML = post.content;
  }
}

function renderSoftSelling(wisataList) {
  const wrapper = document.getElementById("related-wisata-wrapper");
  const container = document.getElementById("related-wisata-container");

  if (!wisataList || wisataList.length === 0) {
    if (wrapper) wrapper.classList.add("hidden");
    return;
  }

  if (wrapper) wrapper.classList.remove("hidden");
  if (container) {
    container.innerHTML = "";
    wisataList.forEach((item) => {
      const imgUrl =
        item.image_url ||
        "https://images.unsplash.com/photo-1596423735746-888eb344275f?q=80&w=400&auto=format&fit=crop";

      const card = `
            <div class="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                <div class="flex gap-4">
                    <div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img src="${imgUrl}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                    </div>
                    <div class="flex-grow flex flex-col justify-between">
                        <div>
                            <h4 class="font-bold text-slate-900 text-sm leading-tight mb-1 line-clamp-2">${
                              item.nama_tempat
                            }</h4>
                            <div class="flex items-center gap-1 text-[10px] text-slate-500">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                ${item.lokasi}
                            </div>
                        </div>
                        <div class="flex items-end justify-between mt-2">
                            <span class="text-blue-600 font-bold text-sm">${formatRupiah(
                              item.harga_tiket
                            )}</span>
                            <a href="../../detail.html?id=${
                              item.id
                            }" class="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-blue-600 transition">
                                Pesan Tiket
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
      container.innerHTML += card;
    });
  }
}
