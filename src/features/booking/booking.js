import { API_BASE_URL, fetchData } from "../../js/api.js";
import { formatRupiah } from "../../js/utils/format.js";

const showToast = (title, message, type = "success") => {
  const toast = document.getElementById("toast-notification");
  const toastTitle = document.getElementById("toast-title");
  const toastMessage = document.getElementById("toast-message");
  const toastIcon = document.getElementById("toast-icon");
  const borderContainer = document.getElementById("toast-border");

  toastTitle.textContent = title;
  toastMessage.textContent = message;

  if (type === "success") {
    borderContainer.className =
      "bg-white border-l-4 border-emerald-500 rounded-r-xl shadow-2xl p-6 flex items-start gap-4 min-w-[350px] max-w-md";
    toastIcon.innerHTML = `<div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center"><svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>`;
  } else {
    borderContainer.className =
      "bg-white border-l-4 border-rose-500 rounded-r-xl shadow-2xl p-6 flex items-start gap-4 min-w-[350px] max-w-md";
    toastIcon.innerHTML = `<div class="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center"><svg class="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></div>`;
  }

  toast.classList.remove(
    "translate-x-full",
    "opacity-0",
    "pointer-events-none"
  );
  toast.classList.add("translate-x-0", "opacity-100", "pointer-events-auto");

  setTimeout(() => {
    toast.classList.remove(
      "translate-x-0",
      "opacity-100",
      "pointer-events-auto"
    );
    toast.classList.add("translate-x-full", "opacity-0", "pointer-events-none");
  }, 4000);
};

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const wisataId = params.get("id");
  const dateParam = params.get("date");
  const qtyParam = params.get("qty");

  const userStr = localStorage.getItem("user_data");
  if (!userStr) {
    showToast("Akses Ditolak", "Silakan login terlebih dahulu.", "error");
    setTimeout(() => {
      window.location.href = "/src/features/auth/login.html";
    }, 2000);
    return;
  }
  const user = JSON.parse(userStr);

  if (!wisataId || !dateParam || !qtyParam) {
    showToast("Data Tidak Lengkap", "Parameter booking tidak valid.", "error");
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
    return;
  }

  const wisata = await fetchData(`/wisata/detail?id=${wisataId}`);
  if (!wisata) {
    showToast("Error", "Gagal memuat data wisata.", "error");
    return;
  }

  document.getElementById("summary-title").textContent = wisata.nama_tempat;
  document.getElementById("summary-location").textContent = wisata.lokasi;
  document.getElementById("summary-date").textContent = new Date(
    dateParam
  ).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  document.getElementById("summary-qty").textContent = `${qtyParam} Orang`;
  document.getElementById("summary-price").textContent = formatRupiah(
    wisata.harga_tiket
  );

  const imgUrl = wisata.image_url || "https://via.placeholder.com/150";
  document.getElementById("summary-img").src = imgUrl;

  const total = wisata.harga_tiket * parseInt(qtyParam);
  document.getElementById("summary-total").textContent = formatRupiah(total);

  document.getElementById("fullname").value = user.full_name;
  document.getElementById("email").value = user.email || user.username;
  if (user.phone) document.getElementById("phone").value = user.phone;

  const btnPay = document.getElementById("btn-pay-now");
  btnPay.addEventListener("click", async () => {
    const phone = document.getElementById("phone").value;
    const paymentMethod = document.querySelector(
      'input[name="payment"]:checked'
    ).value;

    if (!phone) {
      showToast(
        "Data Belum Lengkap",
        "Nomor WhatsApp wajib diisi untuk pengiriman tiket.",
        "error"
      );
      document.getElementById("phone").focus();
      return;
    }

    const originalText = btnPay.textContent;
    btnPay.textContent = "Memproses...";
    btnPay.disabled = true;
    btnPay.classList.add("opacity-70", "cursor-not-allowed");

    try {
      const response = await fetch(`${API_BASE_URL}/booking/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wisata_id: parseInt(wisataId),
          user_id: user.id,
          visit_date: dateParam,
          quantity: parseInt(qtyParam),
          payment_method: paymentMethod,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        showToast(
          "Booking Berhasil!",
          "Mengalihkan ke pembayaran...",
          "success"
        );
        setTimeout(() => {
          window.location.href = `/src/features/payment/payment.html?code=${result.data.booking_code}`;
        }, 1500);
      } else {
        showToast(
          "Gagal Booking",
          result.message || "Terjadi kesalahan server.",
          "error"
        );
        resetButton(btnPay, originalText);
      }
    } catch (error) {
      console.error(error);
      showToast("Koneksi Error", "Gagal menghubungi server.", "error");
      resetButton(btnPay, originalText);
    }
  });
});

function resetButton(btn, originalText) {
  btn.textContent = originalText;
  btn.disabled = false;
  btn.classList.remove("opacity-70", "cursor-not-allowed");
}
