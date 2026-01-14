import { loadNavbar } from "../navbar/navbar.js";

const BASE_HOST =
  window.location.hostname === "127.0.0.1" ? "127.0.0.1" : "localhost";
const API_BASE_URL = `http://${BASE_HOST}:8080/api`;

document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
  fetchCategories();
  fetchPosts();

  document.getElementById("search-btn").addEventListener("click", () => {
    const query = document.getElementById("search-input").value;
    fetchPosts(null, query);
  });

  document.getElementById("search-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const query = e.target.value;
      fetchPosts(null, query);
    }
  });
});

async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/blog/categories`);
    const json = await res.json();
    if (res.ok) {
      renderCategories(json.data);
    }
  } catch (err) {
    console.error(err);
  }
}

function renderCategories(categories) {
  const container = document.getElementById("categories-container");

  const allBtn = document.createElement("button");
  allBtn.className =
    "px-5 py-2 rounded-full text-sm font-medium transition-all bg-slate-900 text-white shadow-lg shadow-slate-900/20 ring-2 ring-slate-900 ring-offset-2";
  allBtn.textContent = "Semua";
  allBtn.onclick = () => {
    resetActiveCategory();
    allBtn.classList.add(
      "bg-slate-900",
      "text-white",
      "shadow-lg",
      "shadow-slate-900/20",
      "ring-2",
      "ring-slate-900",
      "ring-offset-2"
    );
    allBtn.classList.remove(
      "bg-white",
      "text-slate-600",
      "border",
      "border-slate-200",
      "hover:border-slate-300"
    );
    fetchPosts();
  };
  container.appendChild(allBtn);

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className =
      "px-5 py-2 rounded-full text-sm font-medium transition-all bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50";
    btn.textContent = cat.name;
    btn.onclick = () => {
      resetActiveCategory();
      btn.classList.remove(
        "bg-white",
        "text-slate-600",
        "border",
        "border-slate-200",
        "hover:border-slate-300"
      );
      btn.classList.add(
        "bg-slate-900",
        "text-white",
        "shadow-lg",
        "shadow-slate-900/20",
        "ring-2",
        "ring-slate-900",
        "ring-offset-2"
      );
      fetchPosts(cat.slug);
    };
    container.appendChild(btn);
  });
}

function resetActiveCategory() {
  const btns = document
    .getElementById("categories-container")
    .querySelectorAll("button");
  btns.forEach((b) => {
    b.className =
      "px-5 py-2 rounded-full text-sm font-medium transition-all bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50";
  });
}

async function fetchPosts(categorySlug = null, searchQuery = null) {
  const container = document.getElementById("blog-grid");
  const emptyState = document.getElementById("empty-state");

  container.innerHTML = `<div class="col-span-3 text-center py-20"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div></div>`;
  emptyState.classList.add("hidden");

  try {
    let url = `${API_BASE_URL}/blog/posts?`;
    if (categorySlug) url += `category=${categorySlug}&`;
    if (searchQuery) url += `q=${searchQuery}&`;

    const res = await fetch(url);
    const json = await res.json();

    container.innerHTML = "";

    if (json.data && json.data.length > 0) {
      json.data.forEach((post) => {
        container.innerHTML += createPostCard(post);
      });
    } else {
      emptyState.classList.remove("hidden");
    }
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="col-span-3 text-center text-red-500">Gagal memuat artikel.</p>`;
  }
}

function createPostCard(post) {
  const imgUrl =
    post.thumbnail ||
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop";

  return `
    <article class="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div class="relative h-56 overflow-hidden">
        <img src="${imgUrl}" alt="${
    post.title
  }" class="w-full h-full object-cover transform group-hover:scale-105 transition duration-700">
        <div class="absolute top-4 left-4">
            <span class="px-3 py-1 bg-white/90 backdrop-blur-md text-xs font-bold text-slate-900 rounded-full border border-white/20 shadow-sm">
                ${post.category_name || "Artikel"}
            </span>
        </div>
      </div>
      <div class="p-6 flex flex-col flex-grow">
        <div class="flex items-center gap-3 text-xs text-slate-400 mb-3">
            <span class="flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                ${post.published_at}
            </span>
            <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span>Oleh ${post.author_name || "Admin"}</span>
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
            <a href="read.html?slug=${post.slug}">
                ${post.title}
            </a>
        </h3>
        <p class="text-slate-500 text-sm mb-6 line-clamp-3 flex-grow">
            ${post.excerpt || ""}
        </p>
        <div class="pt-4 border-t border-slate-100 flex justify-between items-center">
            <a href="read.html?slug=${
              post.slug
            }" class="text-blue-600 text-sm font-semibold group-hover:underline">
                Baca Selengkapnya
            </a>
            <svg class="w-5 h-5 text-blue-600 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </div>
      </div>
    </article>
  `;
}
