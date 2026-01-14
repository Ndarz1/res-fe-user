import { fetchData } from "../../js/api.js";

const NO_IMAGE_BASE64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

export async function loadSpotlight() {
  try {
    const responseHTML = await fetch("/src/features/spotlight/spotlight.html");
    if (!responseHTML.ok) throw new Error("Gagal load spotlight HTML");
    const template = await responseHTML.text();

    const container = document.getElementById("spotlight-placeholder");
    container.innerHTML = template;

    const result = await fetchData("/dashboard/popular-wisata");

    if (result && result.length > 0) {
      renderSlides(result);
      initSpotlightSlider();
    } else {
      container.innerHTML = `<div class="h-[600px] flex items-center justify-center text-slate-500 bg-slate-900 font-serif italic">Belum ada data populer.</div>`;
    }
  } catch (e) {
    console.error(e);
  }
}

function renderSlides(data) {
  const slider = document.getElementById("spotlight-slider");
  slider.innerHTML = "";

  data.forEach((item, index) => {
    const harga = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(item.harga_tiket);

    const imgUrl = item.image_url || NO_IMAGE_BASE64;
    const label = index === 0 ? "Paling Populer" : "Rekomendasi Editor";
    const deskripsi = item.deskripsi || "Jelajahi keindahan destinasi ini.";
    const rawRating =
      item.rating_total || item.rating || item.average_rating || 0;
    const ratingDisplay =
      parseFloat(rawRating) > 0 ? parseFloat(rawRating).toFixed(1) : "Baru";
    const reviewCount = item.total_reviews || item.reviews_count || 0;

    const slideHTML = `
        <div class="w-full flex-shrink-0 flex flex-col md:flex-row h-full relative group">
            <div class="relative w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 pt-12 pb-56 md:pb-32 z-10 bg-slate-900 border-r border-white/5">
                <span class="inline-block text-blue-200 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-4 opacity-60">
                    ${label}
                </span>
                <h2 class="text-4xl md:text-6xl font-serif text-white leading-[1.1] mb-6 tracking-tight">
                    ${item.nama_tempat}
                </h2>
                <p class="text-sm md:text-base text-slate-400 mb-8 max-w-md font-sans font-light leading-relaxed line-clamp-2 md:line-clamp-3">
                    ${deskripsi}
                </p>
                <div class="flex items-center gap-8 mb-10">
                     <div>
                        <p class="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Mulai Dari</p>
                        <p class="text-xl font-serif italic text-white">${harga}</p>
                     </div>
                     <div class="w-px h-10 bg-white/10"></div>
                     <div>
                        <p class="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Rating</p>
                        <p class="text-xl font-serif text-white flex items-center gap-1">
                            <span class="text-yellow-500">★</span> ${ratingDisplay}
                            <span class="text-xs text-slate-500 ml-1 font-sans">(${reviewCount})</span>
                        </p>
                     </div>
                </div>
                <a href="detail.html?id=${item.id}" class="inline-flex items-center gap-2 text-white border-b border-white/30 pb-1 w-fit hover:gap-4 hover:border-white transition-all duration-300">
                    <span class="text-sm font-medium tracking-wide">Jelajahi Sekarang</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </a>
            </div>
            <div class="relative w-full md:w-1/2 h-1/2 md:h-full overflow-hidden">
                <div class="absolute inset-0 bg-slate-900/20 z-10"></div>
                <img src="${imgUrl}" 
                     alt="${item.nama_tempat}" 
                     class="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105" 
                     onerror="this.onerror=null;this.src='${NO_IMAGE_BASE64}'"/>
            </div>
        </div>
        `;
    slider.innerHTML += slideHTML;
  });
}

function initSpotlightSlider() {
  const slider = document.getElementById("spotlight-slider");
  if (!slider) return;
  const slides = slider.children;
  const totalSlides = slides.length;
  if (totalSlides === 0) return;

  let currentSlideIndex = 0;
  const prevBtn = document.getElementById("prev-slide");
  const nextBtn = document.getElementById("next-slide");
  const currentSlideEl = document.getElementById("current-slide");
  const totalSlidesEl = document.getElementById("total-slides");
  const progressBar = document.getElementById("progress-bar");

  if (totalSlidesEl) {
    totalSlidesEl.textContent = String(totalSlides).padStart(2, "0");
  }

  function updateSlider() {
    slider.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    if (currentSlideEl) {
      currentSlideEl.textContent = String(currentSlideIndex + 1).padStart(
        2,
        "0"
      );
    }
    if (progressBar) {
      const progress = ((currentSlideIndex + 1) / totalSlides) * 100;
      progressBar.style.width = `${progress}%`;
    }
    if (prevBtn) prevBtn.disabled = currentSlideIndex === 0;
    if (nextBtn) nextBtn.disabled = currentSlideIndex === totalSlides - 1;
  }

  if (nextBtn) {
    const newNextBtn = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    newNextBtn.addEventListener("click", () => {
      if (currentSlideIndex < totalSlides - 1) {
        currentSlideIndex++;
        updateSlider();
      }
    });
  }

  if (prevBtn) {
    const newPrevBtn = prevBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    newPrevBtn.addEventListener("click", () => {
      if (currentSlideIndex > 0) {
        currentSlideIndex--;
        updateSlider();
      }
    });
  }
  updateSlider();
}
