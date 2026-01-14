import { API_BASE_URL } from "../../js/api.js";

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
      "bg-white border-l-4 border-emerald-500 rounded-r-xl shadow-2xl p-6 flex items-start gap-4 min-w-[320px]";
    toastIcon.innerHTML = `<svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
  } else {
    borderContainer.className =
      "bg-white border-l-4 border-rose-500 rounded-r-xl shadow-2xl p-6 flex items-start gap-4 min-w-[320px]";
    toastIcon.innerHTML = `<svg class="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
  }

  toast.classList.remove("translate-x-full", "opacity-0");
  toast.classList.add("translate-x-0", "opacity-100");

  setTimeout(() => {
    toast.classList.remove("translate-x-0", "opacity-100");
    toast.classList.add("translate-x-full", "opacity-0");
  }, 4000);
};

window.copyToClipboard = (elementId) => {
  const text = document.getElementById(elementId).textContent;
  navigator.clipboard.writeText(text).then(() => {
    showToast("Disalin!", "Teks berhasil disalin ke clipboard.", "success");
  });
};

function startTimer(duration, display) {
  let timer = duration;
  const interval = setInterval(() => {
    let minutes = parseInt(timer / 60, 10);
    let seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = "00:" + minutes + ":" + seconds;

    if (--timer < 0) {
      clearInterval(interval);
      display.textContent = "Waktu Habis";
      display.classList.add("text-red-500");
    }
  }, 1000);
}

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) {
    showToast("Error", "Kode booking tidak valid", "error");
    setTimeout(() => (window.location.href = "/"), 2000);
    return;
  }

  document.getElementById("booking-code").textContent = code;

  startTimer(3600, document.getElementById("countdown-timer"));

  try {
    const res = await fetch(`${API_BASE_URL}/booking/detail?code=${code}`);
    const json = await res.json();

    if (res.ok) {
      const data = json.data;

      const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });

      document.getElementById("pay-amount").textContent = formatter.format(
        data.final_price
      );
      document.getElementById("wisata-name").textContent = data.wisata_nama;
      document.getElementById("visit-date").textContent = new Date(
        data.visit_date
      ).toLocaleDateString("id-ID", { dateStyle: "long" });
      document.getElementById("qty").textContent = data.quantity + " Orang";

      if (data.status === "paid") {
        alert("Pembayaran Lunas! Terima kasih.");
        window.location.href = "/";
        return;
      } else if (data.status === "cancelled") {
        alert("Pesanan Dibatalkan.");
        window.location.href = "/";
        return;
      }

      const container = document.getElementById("payment-method-container");

      const method = data.payment_method || "transfer";

      if (method === "qris") {
        container.innerHTML = `
          <div class="bg-white border-2 border-slate-900 rounded-2xl p-6 text-center">
            <p class="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Scan QRIS</p>
            <div class="bg-white p-2 inline-block rounded-xl border border-slate-100 mb-4">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=EKSPLORA-${code}" class="w-48 h-48">
            </div>
            <p class="text-xs text-slate-400">Scan menggunakan GoPay, OVO, Dana, atau Mobile Banking.</p>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="font-bold text-slate-900 text-lg">Bank BCA</span>
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg" class="h-4 opacity-50">
            </div>
            <div class="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-3 mb-4">
              <span id="acc-number" class="font-mono text-xl text-slate-800 tracking-wider">8090 1234 5678</span>
              <button onclick="copyToClipboard('acc-number')" class="text-blue-600 text-sm font-bold hover:underline">Salin</button>
            </div>
            <p class="text-xs text-slate-500">a.n PT Eksplora Wisata Indonesia</p>
            <div class="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg flex gap-3 items-start">
              <svg class="w-5 h-5 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <p class="text-xs text-yellow-700 leading-relaxed">
                Penting: Masukkan <strong>Kode Booking (${code})</strong> pada berita acara transfer.
              </p>
            </div>
          </div>
        `;
      }
    } else {
      showToast("Error", "Data booking tidak ditemukan", "error");
    }
  } catch {
    showToast("Error", "Gagal terhubung ke server", "error");
  }

  const btnConfirm = document.getElementById("btn-confirm");
  btnConfirm.addEventListener("click", async () => {
    if (!confirm("Apakah Anda yakin sudah melakukan pembayaran?")) return;

    btnConfirm.textContent = "Memverifikasi...";
    btnConfirm.disabled = true;
    btnConfirm.classList.add("opacity-70", "cursor-not-allowed");

    try {
      const res = await fetch(`${API_BASE_URL}/booking/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_code: code }),
      });

      const json = await res.json();

      if (res.ok) {
        showToast("Berhasil", "Pembayaran Dikonfirmasi!", "success");
        setTimeout(() => (window.location.href = "/"), 2000);
      } else {
        showToast("Gagal", json.message || "Verifikasi gagal.", "error");
        btnConfirm.textContent = "Saya Sudah Transfer";
        btnConfirm.disabled = false;
        btnConfirm.classList.remove("opacity-70", "cursor-not-allowed");
      }
    } catch {
      showToast("Error", "Gagal menghubungi server", "error");
      btnConfirm.disabled = false;
    }
  });

  const btnCancel = document.getElementById("btn-cancel");
  btnCancel.addEventListener("click", async () => {
    if (!confirm("Yakin ingin membatalkan pesanan ini?")) return;

    btnCancel.textContent = "Membatalkan...";
    btnCancel.disabled = true;

    try {
      const res = await fetch(`${API_BASE_URL}/booking/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_code: code }),
      });

      if (res.ok) {
        showToast("Dibatalkan", "Pesanan berhasil dibatalkan.", "success");
        setTimeout(() => (window.location.href = "/"), 1500);
      } else {
        showToast("Gagal", "Gagal membatalkan pesanan.", "error");
        btnCancel.textContent = "Batalkan Pesanan";
        btnCancel.disabled = false;
      }
    } catch {
      showToast("Error", "Gagal menghubungi server", "error");
      btnCancel.disabled = false;
    }
  });
});
