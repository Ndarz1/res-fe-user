import { fetchData } from "../../js/api.js";
import { formatRupiah } from "../../js/utils/format.js";

const BASE_HOST =
  window.location.hostname === "127.0.0.1" ? "127.0.0.1" : "localhost";
const API_BASE_URL = `http://${BASE_HOST}:8080/api`;

let allBookings = [];
let currentUser = null;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/me`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (res.status === 401) {
      window.location.href = "/src/features/auth/login.html";
      return;
    }

    const json = await res.json();
    if (res.ok) {
      currentUser = json.data;
      renderProfileData(currentUser);
      setupEditForm(currentUser);
      initLogout();
      await loadHistory(currentUser.id);
    }
  } catch (e) {
    console.error("Session Check Error", e);
    window.location.href = "/src/features/auth/login.html";
  }
});

function renderProfileData(user) {
  document.getElementById("profile-name").textContent = user.full_name;
  document.getElementById("profile-email").textContent = user.email;
  document.getElementById("profile-phone").textContent = user.phone || "-";

  const imgDisplay = document.getElementById("profile-img-display");
  const initialDisplay = document.getElementById("profile-initial-display");

  if (user.profile_image) {
    const imgUrl = `http://localhost:8080${
      user.profile_image
    }?t=${new Date().getTime()}`;
    imgDisplay.src = imgUrl;
    imgDisplay.classList.remove("hidden");
    initialDisplay.classList.add("hidden");
    document.getElementById("preview-img").src = imgUrl;
  } else {
    imgDisplay.classList.add("hidden");
    initialDisplay.classList.remove("hidden");
    initialDisplay.querySelector("span").textContent = user.full_name
      .charAt(0)
      .toUpperCase();
    document.getElementById(
      "preview-img"
    ).src = `https://ui-avatars.com/api/?name=${user.full_name}&background=random`;
  }

  document.getElementById("input-fullname").value = user.full_name;
  document.getElementById("input-phone").value = user.phone || "";
}

async function loadHistory(userId) {
  const container = document.getElementById("history-container");
  try {
    const res = await fetch(
      `${API_BASE_URL}/booking/history?user_id=${userId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const json = await res.json();
    const bookings = json.data;

    if (!bookings || bookings.length === 0) {
      container.innerHTML = `
        <div class="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <svg class="w-16 h-16 text-slate-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            <p class="text-slate-500 font-medium">Belum ada riwayat perjalanan.</p>
            <a href="/" class="text-blue-900 font-bold text-sm mt-2 inline-block border-b border-blue-900 pb-0.5">Mulai Petualangan</a>
        </div>`;
      return;
    }

    allBookings = bookings;
    renderHistoryList(allBookings);
  } catch (error) {
    console.error(error);
    container.innerHTML = `<p class="text-center text-red-400 py-10">Gagal memuat riwayat.</p>`;
  }
}

window.filterHistory = (status) => {
  const tabs = ["all", "pending", "paid", "cancelled"];
  tabs.forEach((t) => {
    const el = document.getElementById(`tab-${t}`);
    if (t === status) {
      el.classList.remove("tab-inactive");
      el.classList.add("tab-active");
    } else {
      el.classList.remove("tab-active");
      el.classList.add("tab-inactive");
    }
  });

  if (status === "all") {
    renderHistoryList(allBookings);
  } else {
    renderHistoryList(allBookings.filter((b) => b.status === status));
  }
};

function renderHistoryList(data) {
  const container = document.getElementById("history-container");

  if (data.length === 0) {
    container.innerHTML = `<p class="text-center text-slate-400 py-12 italic">Tidak ada tiket dengan status ini.</p>`;
    return;
  }

  container.innerHTML = data.map(createBookingCard).join("");
}

function createBookingCard(item) {
  let statusBadge = "";
  let actionButtons = "";

  if (item.status === "pending") {
    statusBadge = `<span class="px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-[10px] font-bold uppercase tracking-widest border border-yellow-100">Menunggu Pembayaran</span>`;
    actionButtons = `
        <div class="mt-4 flex gap-3">
             <button data-code="${item.booking_code}" class="btn-pay-history flex-1 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-900/10">Bayar Sekarang</button>
             <button data-code="${item.booking_code}" class="btn-cancel-history px-4 py-2.5 bg-white border border-slate-200 text-slate-500 text-sm font-bold rounded-xl hover:text-red-600 hover:border-red-100 transition">Batal</button>
        </div>`;
  } else if (item.status === "paid") {
    statusBadge = `<span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest border border-emerald-100">Pembayaran Berhasil</span>`;
    actionButtons = `
        <div class="mt-4">
             <button disabled class="w-full py-2.5 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-xl border border-emerald-100 cursor-default">E-Tiket Aktif</button>
        </div>`;
  } else {
    statusBadge = `<span class="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest">Dibatalkan</span>`;
  }

  const imgUrl =
    item.wisata_image ||
    "https://images.unsplash.com/photo-1596423735746-888eb344275f?q=80&w=400&auto=format&fit=crop";

  return `
    <div class="bg-white p-5 rounded-3xl border border-slate-100 hover:shadow-lg transition-all duration-300 group">
        <div class="flex flex-col md:flex-row gap-6">
            <div class="w-full md:w-48 h-32 flex-shrink-0 rounded-2xl overflow-hidden relative">
                 <img src="${imgUrl}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div class="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition"></div>
            </div>
            <div class="flex-grow">
                <div class="flex justify-between items-start mb-2">
                    <div>
                        ${statusBadge}
                        <p class="text-xs text-slate-400 font-mono mt-2 tracking-wide">#${
                          item.booking_code
                        }</p>
                    </div>
                    <div class="text-right">
                        <p class="text-xs text-slate-400 mb-0.5">Total</p>
                        <p class="text-lg font-serif font-bold text-slate-900">${formatRupiah(
                          item.final_price
                        )}</p>
                    </div>
                </div>
                <h3 class="text-xl font-serif font-bold text-slate-900 mb-1">${
                  item.wisata_nama
                }</h3>
                <div class="flex items-center gap-4 text-sm text-slate-500 mb-2">
                    <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        ${new Date(item.visit_date).toLocaleDateString(
                          "id-ID",
                          { day: "numeric", month: "long", year: "numeric" }
                        )}
                    </span>
                    <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span class="flex items-center gap-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        ${item.quantity} Orang
                    </span>
                </div>
                ${actionButtons}
            </div>
        </div>
    </div>`;
}

function setupEditForm(user) {
  const editForm = document.getElementById("edit-profile-form");
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = editForm.querySelector("button[type='submit']");
    const originalText = btn.textContent;
    btn.textContent = "Menyimpan...";
    btn.disabled = true;

    try {
      const formData = new FormData(editForm);
      formData.append("user_id", user.id);

      const res = await fetch(`${API_BASE_URL}/profile/update`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const json = await res.json();

      if (res.ok) {
        alert("Profil berhasil diperbarui!");
        window.location.reload();
      } else {
        alert("Gagal update profil: " + json.message);
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi server.");
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}

function initLogout() {
  const btnLogout = document.getElementById("btn-logout-profile");
  btnLogout.addEventListener("click", async () => {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
      try {
        await fetch(`${API_BASE_URL}/logout`, {
          method: "POST",
          credentials: "include",
        });
        window.location.href = "/src/features/auth/login.html";
      } catch (e) {
        alert("Logout gagal");
      }
    }
  });
}

document.addEventListener("click", async (e) => {
  const btnPay = e.target.closest(".btn-pay-history");
  const btnCancel = e.target.closest(".btn-cancel-history");

  if (btnPay) {
    window.location.href = `/src/features/payment/payment.html?code=${btnPay.dataset.code}`;
  }

  if (btnCancel) {
    if (confirm("Yakin ingin membatalkan pesanan ini?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/booking/cancel`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ booking_code: btnCancel.dataset.code }),
          credentials: "include",
        });
        if (res.ok) {
          alert("Pesanan dibatalkan.");
          location.reload();
        } else {
          alert("Gagal membatalkan.");
        }
      } catch (e) {
        alert("Error koneksi");
      }
    }
  }
});
