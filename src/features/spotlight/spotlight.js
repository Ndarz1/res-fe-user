const dummyData = [
  {
    id: 1,
    nama_tempat: "Keajaiban Borobudur",
    deskripsi:
      "Candi Buddha terbesar di dunia yang berdiri megah di Jawa Tengah. Saksikan matahari terbit yang magis dari puncaknya.",
    image_url:
      "https://images.unsplash.com/photo-1528497378648-533b01416244?q=80&w=2070",
    lokasi: "Magelang, Jawa Tengah",
    harga_tiket: 50000,
    label: "Warisan Dunia",
  },
  {
    id: 2,
    nama_tempat: "Gerbang Komodo",
    deskripsi:
      "Surga kepulauan di Flores. Temukan naga purba, pantai pink, dan pemandangan laut dari puncak bukit.",
    image_url:
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070",
    lokasi: "Labuan Bajo, NTT",
    harga_tiket: 150000,
    label: "Spotlight",
  },
  {
    id: 3,
    nama_tempat: "Eksotisme Raja Ampat",
    deskripsi:
      "Surga penyelam dunia dengan keanekaragaman hayati laut terkaya. Gugusan pulau karang yang memanjakan mata.",
    image_url:
      "https://images.unsplash.com/photo-1516690561799-46d8f74f9dab?q=80&w=2070",
    lokasi: "Papua Barat",
    harga_tiket: 200000,
    label: "Trending",
  },
];

export async function loadSpotlight() {
  try {
    const response = await fetch("/src/features/spotlight/spotlight.html");
    if (!response.ok) throw new Error("Gagal load spotlight HTML");
    const template = await response.text();

    const container = document.getElementById("spotlight-placeholder");
    container.innerHTML = template;

    renderSlides(dummyData);
    initSpotlightSlider();
  } catch (e) {
    console.error(e);
  }
}

function renderSlides(data) {
  const slider = document.getElementById("spotlight-slider");
  slider.innerHTML = "";

  data.forEach((item) => {
    const harga = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(item.harga_tiket);

    const slideHTML = `
        <div class="w-full flex-shrink-0 flex flex-col md:flex-row h-full">
            <div class="relative w-full md:w-5/12 flex flex-col justify-center p-8 md:p-16 z-10 bg-gray-900">
                <div class="absolute inset-0 opacity-10 bg-[url('${item.image_url}')] bg-cover bg-center mix-blend-overlay pointer-events-none"></div>
                
                <span class="inline-block text-teal-400 text-sm font-bold tracking-widest uppercase mb-4 animate-fade-in-up">
                    ${item.label}
                </span>
                
                <h2 class="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 tracking-tighter animate-fade-in-up delay-100">
                    ${item.nama_tempat}
                </h2>
                
                <p class="text-lg text-gray-300 mb-10 max-w-md font-light leading-relaxed animate-fade-in-up delay-200 line-clamp-3">
                    ${item.deskripsi}
                </p>
                
                <a href="#" class="group inline-flex items-center gap-3 px-8 py-4 border-2 border-white/30 text-white rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 w-fit animate-fade-in-up delay-300">
                    <span class="font-medium">Jelajahi Sekarang</span>
                    <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                    </svg>
                </a>
            </div>

            <div class="relative w-full md:w-7/12 h-full overflow-hidden group">
                <img src="${item.image_url}" alt="${item.nama_tempat}" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                
                <div class="absolute bottom-0 right-0 p-8 md:p-12 w-full md:w-2/3 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-right">
                    <h3 class="text-3xl font-bold text-white mb-2">${item.lokasi}</h3>
                    <p class="text-gray-300 text-sm leading-relaxed">Mulai dari ${harga}</p>
                </div>
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
