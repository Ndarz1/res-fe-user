import { formatRupiah } from "../../js/utils/format.js";

const dummyData = [
  {
    id: 1,
    nama_tempat: "Pantai Kuta",
    category_name: "Pantai",
    lokasi: "Kuta, Badung, Bali",
    harga_tiket: 0,
    rating_total: 4.5,
    deskripsi:
      "Pantai Kuta adalah salah satu tempat wisata paling ikonik di Bali.",
    image_url:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    nama_tempat: "Gunung Bromo",
    category_name: "Gunung",
    lokasi: "Probolinggo, Jawa Timur",
    harga_tiket: 50000,
    rating_total: 4.8,
    deskripsi: "Gunung Bromo adalah gunung berapi aktif di Jawa Timur.",
    image_url:
      "https://images.unsplash.com/photo-1605218457336-92744572228d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    nama_tempat: "Candi Borobudur",
    category_name: "Sejarah",
    lokasi: "Magelang, Jawa Tengah",
    harga_tiket: 75000,
    rating_total: 4.9,
    deskripsi: "Candi Buddha terbesar di dunia yang dibangun pada abad ke-9.",
    image_url:
      "https://images.unsplash.com/photo-1528497378648-533b01416244?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    nama_tempat: "Pantai Pink",
    category_name: "Pantai",
    lokasi: "Labuan Bajo, NTT",
    harga_tiket: 15000,
    rating_total: 4.7,
    deskripsi: "Pantai unik dengan pasir berwarna merah muda.",
    image_url:
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    nama_tempat: "Nasi Gudeg Yu Djum",
    category_name: "Kuliner",
    lokasi: "Yogyakarta",
    harga_tiket: 35000,
    rating_total: 4.6,
    deskripsi: "Gudeg legendaris di Yogyakarta.",
    image_url:
      "https://images.unsplash.com/photo-1626574943968-30122f8a1a38?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    nama_tempat: "Hutan Pinus Mangunan",
    category_name: "Hutan",
    lokasi: "Bantul, Yogyakarta",
    harga_tiket: 5000,
    rating_total: 4.5,
    deskripsi: "Kawasan hutan pinus yang asri dan sejuk.",
    image_url:
      "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80",
  },
];

let currentItem = null;
let ticketQty = 1;

export function initDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    window.location.href = "/";
    return;
  }

  currentItem = dummyData.find((item) => item.id == id);

  if (!currentItem) {
    document.getElementById("loading-state").innerHTML =
      '<p class="text-red-500">Data tidak ditemukan</p>';
    return;
  }

  renderDetail(currentItem);
}

function renderDetail(item) {
  document.getElementById("loading-state").classList.add("hidden");
  document.getElementById("detail-content").classList.remove("hidden");

  document.getElementById("detail-category").textContent = item.category_name;
  document.getElementById("detail-title").textContent = item.nama_tempat;
  document.getElementById("detail-location").textContent = item.lokasi;
  document.getElementById("detail-rating").textContent = item.rating_total;
  document.getElementById("detail-price").textContent = formatRupiah(
    item.harga_tiket
  );
  document.getElementById("detail-desc").textContent = item.deskripsi;

  const imgUrl = item.image_url;
  document.getElementById("detail-image-main").src = imgUrl;
  document.getElementById("detail-image-sec1").src = imgUrl;
  document.getElementById("detail-image-sec2").src = imgUrl;

  document.title = `${item.nama_tempat} - Eksplora`;

  initBookingLogic();
}

function initBookingLogic() {
  const dateInput = document.getElementById("booking-date");
  const decreaseBtn = document.getElementById("btn-decrease");
  const increaseBtn = document.getElementById("btn-increase");
  const countDisplay = document.getElementById("ticket-count");
  const bookBtn = document.getElementById("btn-book-now");

  if (dateInput) dateInput.valueAsDate = new Date();

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
      window.location.href = `booking.html?id=${currentItem.id}&date=${date}&qty=${ticketQty}`;
    };
  }
}
