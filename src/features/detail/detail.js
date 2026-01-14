import { fetchData, API_BASE_URL } from "../../js/api.js";
import { formatRupiah } from "../../js/utils/format.js";

let currentItem = null;
let ticketQty = 1;

const NO_IMAGE_BASE64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

export async function initDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    window.location.href = "/";
    return;
  }

  const data = await fetchData(`/wisata/detail?id=${id}`);

  if (!data) {
    document.getElementById("loading-state").innerHTML =
      '<p class="text-slate-500 font-serif italic text-center">Destinasi tidak ditemukan.</p>';
    return;
  }

  currentItem = data;
  renderDetail(data);
  initReviewSystem(id);
}

function renderDetail(item) {
  document.getElementById("loading-state").classList.add("hidden");
  document.getElementById("detail-content").classList.remove("hidden");

  document.title = `${item.nama_tempat} - Eksplora`;

  document.getElementById("detail-category").textContent =
    item.category_name || "Eksklusif";
  document.getElementById("detail-title").textContent = item.nama_tempat;
  document.getElementById("detail-location").textContent =
    item.lokasi || "Indonesia";
  document.getElementById("detail-rating").textContent = item.rating_total
    ? parseFloat(item.rating_total).toFixed(1)
    : "Baru";
  document.getElementById("detail-price").textContent = formatRupiah(
    item.harga_tiket
  );
  document.getElementById("detail-desc").textContent =
    item.deskripsi || "Tidak ada deskripsi tersedia untuk saat ini.";

  const imgUrl = item.image_url || NO_IMAGE_BASE64;
  const mainImg = document.getElementById("detail-image-main");
  const secImg1 = document.getElementById("detail-image-sec1");
  const secImg2 = document.getElementById("detail-image-sec2");

  const setImage = (imgElement, url) => {
    if (imgElement) {
      imgElement.src = url;
      imgElement.onerror = () => {
        imgElement.src = NO_IMAGE_BASE64;
      };
    }
  };

  setImage(mainImg, imgUrl);
  setImage(secImg1, imgUrl);
  setImage(secImg2, imgUrl);

  const facilitiesContainer = document.getElementById("detail-facilities");
  if (facilitiesContainer) {
    if (item.fasilitas && item.fasilitas.trim() !== "") {
      const facilitiesHtml = item.fasilitas
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f.length > 0)
        .map(
          (f) => `
            <div class="flex items-center gap-3">
                <span class="w-1.5 h-1.5 rounded-full bg-blue-900"></span>
                <span class="text-slate-700 font-light text-base">${f}</span>
            </div>`
        )
        .join("");
      facilitiesContainer.innerHTML = facilitiesHtml;
    } else {
      facilitiesContainer.innerHTML =
        '<p class="text-slate-400 italic font-light col-span-full">Fasilitas tidak dispesifikasikan.</p>';
    }
  }

  initBookingLogic();
}

function initBookingLogic() {
  const dateInput = document.getElementById("booking-date");
  const decreaseBtn = document.getElementById("btn-decrease");
  const increaseBtn = document.getElementById("btn-increase");
  const countDisplay = document.getElementById("ticket-count");
  const bookBtn = document.getElementById("btn-book-now");

  if (dateInput) {
    dateInput.min = new Date().toISOString().split("T")[0];
    dateInput.valueAsDate = new Date();
  }

  if (decreaseBtn) {
    decreaseBtn.onclick = () => {
      if (ticketQty > 1) {
        ticketQty--;
        countDisplay.textContent = ticketQty;
      }
    };
  }

  if (increaseBtn) {
    increaseBtn.onclick = () => {
      ticketQty++;
      countDisplay.textContent = ticketQty;
    };
  }

  if (bookBtn) {
    bookBtn.onclick = () => {
      const date = dateInput.value;
      if (!date) {
        alert("Silakan pilih tanggal kunjungan terlebih dahulu.");
        return;
      }

      const userStr = localStorage.getItem("user_data");
      if (!userStr) {
        alert("Silakan login untuk memesan tiket.");
        window.location.href = "/src/features/auth/login.html";
        return;
      }

      window.location.href = `/booking.html?id=${currentItem.id}&date=${date}&qty=${ticketQty}`;
    };
  }
}

async function initReviewSystem(wisataId) {
  const userStr = localStorage.getItem("user_data");
  const reviewFormContainer = document.getElementById("review-form-container");
  const loginPrompt = document.getElementById("login-prompt");

  if (userStr) {
    const user = JSON.parse(userStr);
    setupReviewForm(wisataId, user.id);
    loginPrompt.classList.add("hidden");
  } else {
    reviewFormContainer.classList.add("hidden");
    loginPrompt.classList.remove("hidden");
  }

  await loadReviews(wisataId);
}

async function loadReviews(wisataId) {
  const container = document.getElementById("reviews-list");
  try {
    const result = await fetchData(`/reviews/list?wisata_id=${wisataId}`);
    const reviews = result || [];

    if (reviews.length === 0) {
      container.innerHTML = `<div class="p-8 bg-slate-50 rounded-xl text-center text-slate-500 font-light italic">Belum ada ulasan. Jadilah yang pertama bercerita!</div>`;
      return;
    }

    container.innerHTML = reviews
      .map(
        (r) => `
            <div class="flex gap-5 border-b border-slate-50 pb-8 last:border-0">
                <div class="flex-shrink-0">
                    <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-serif font-bold text-xl">
                        ${
                          r.user_name
                            ? r.user_name.charAt(0).toUpperCase()
                            : "U"
                        }
                    </div>
                </div>
                <div class="flex-1">
                    <div class="flex justify-between items-center mb-2">
                        <h5 class="font-bold font-serif text-slate-900 text-lg">${
                          r.user_name || "Pengunjung"
                        }</h5>
                        <span class="text-xs text-slate-400 font-sans tracking-wide uppercase">${new Date(
                          r.created_at
                        ).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}</span>
                    </div>
                    <div class="flex text-yellow-500 text-sm mb-3">
                        ${"★".repeat(
                          r.rating
                        )}${"<span class='text-slate-200'>★</span>".repeat(
          5 - r.rating
        )}
                    </div>
                    <p class="text-slate-600 font-light leading-relaxed">
                        "${r.comment}"
                    </p>
                </div>
            </div>
        `
      )
      .join("");
  } catch {
    container.innerHTML = `<p class="text-red-400 text-sm text-center">Gagal memuat ulasan.</p>`;
  }
}

function setupReviewForm(wisataId, userId) {
  const stars = document.querySelectorAll(".star-btn");
  const ratingInput = document.getElementById("rating-input");
  const ratingLabel = document.getElementById("rating-label");
  const form = document.getElementById("form-review");
  let currentRating = 0;

  stars.forEach((star) => {
    star.addEventListener("mouseenter", () => {
      highlightStars(parseInt(star.dataset.value));
    });

    star.addEventListener("mouseleave", () => {
      highlightStars(currentRating);
    });

    star.addEventListener("click", () => {
      currentRating = parseInt(star.dataset.value);
      ratingInput.value = currentRating;
      highlightStars(currentRating);

      const labels = ["Sangat Buruk", "Buruk", "Cukup", "Bagus", "Luar Biasa"];
      ratingLabel.textContent = labels[currentRating - 1];
      ratingLabel.className = "ml-3 text-sm font-bold text-blue-900";
    });
  });

  function highlightStars(count) {
    stars.forEach((s) => {
      const val = parseInt(s.dataset.value);
      if (val <= count) {
        s.classList.remove("text-slate-300");
        s.classList.add("text-yellow-500");
      } else {
        s.classList.remove("text-yellow-500");
        s.classList.add("text-slate-300");
      }
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!currentRating) {
      alert("Mohon pilih rating bintang terlebih dahulu.");
      return;
    }

    const comment = document.getElementById("review-comment").value;
    const btn = form.querySelector("button[type='submit']");
    const originalText = btn.textContent;

    btn.textContent = "Mengirim...";
    btn.disabled = true;
    btn.classList.add("opacity-70");

    try {
      const res = await fetch(`${API_BASE_URL}/reviews/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wisata_id: parseInt(wisataId),
          user_id: parseInt(userId),
          rating: currentRating,
          comment: comment,
        }),
      });

      let result;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await res.json();
      } else {
        const text = await res.text();
        result = { message: text || "Terjadi kesalahan server" };
      }

      if (res.ok) {
        alert("Terima kasih! Ulasan Anda berhasil dikirim.");
        form.reset();
        currentRating = 0;
        ratingInput.value = "";
        highlightStars(0);
        ratingLabel.textContent = "Pilih Rating";
        ratingLabel.className = "ml-3 text-sm font-medium text-slate-500";
        document
          .getElementById("review-form-container")
          .classList.add("hidden");
        await loadReviews(wisataId);
      } else {
        alert(result.message || "Gagal mengirim ulasan.");
      }
    } catch {
      alert("Terjadi kesalahan koneksi atau format data.");
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.classList.remove("opacity-70");
    }
  });
}
