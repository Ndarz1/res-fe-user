import { formatRupiah } from "../../js/utils/format.js";

const dummyData = [
  {
    id: 1,
    nama_tempat: "Pantai Kuta",
    harga_tiket: 0,
    image_url:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 2,
    nama_tempat: "Gunung Bromo",
    harga_tiket: 50000,
    image_url:
      "https://images.unsplash.com/photo-1605218457336-92744572228d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 3,
    nama_tempat: "Candi Borobudur",
    harga_tiket: 75000,
    image_url:
      "https://images.unsplash.com/photo-1528497378648-533b01416244?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 4,
    nama_tempat: "Pantai Pink",
    harga_tiket: 15000,
    image_url:
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 5,
    nama_tempat: "Nasi Gudeg Yu Djum",
    harga_tiket: 35000,
    image_url:
      "https://images.unsplash.com/photo-1626574943968-30122f8a1a38?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: 6,
    nama_tempat: "Hutan Pinus Mangunan",
    harga_tiket: 5000,
    image_url:
      "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=200&q=80",
  },
];

export function initBooking() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const date = params.get("date");
  const qty = parseInt(params.get("qty")) || 1;

  if (!id) {
    window.location.href = "/";
    return;
  }

  const item = dummyData.find((d) => d.id == id);
  if (!item) {
    alert("Data tidak valid");
    window.location.href = "/";
    return;
  }

  document.getElementById("summary-img").src = item.image_url;
  document.getElementById("summary-title").textContent = item.nama_tempat;

  const dateObj = new Date(date);
  document.getElementById("summary-date").textContent =
    dateObj.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  document.getElementById("summary-price").textContent = formatRupiah(
    item.harga_tiket
  );
  document.getElementById("summary-qty").textContent = `x${qty}`;

  const total = item.harga_tiket * qty;
  document.getElementById("summary-total").textContent = formatRupiah(total);

  const form = document.getElementById("booking-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = "Memproses...";
    btn.disabled = true;

    setTimeout(() => {
      window.location.href = "success.html";
    }, 1500);
  });
}
