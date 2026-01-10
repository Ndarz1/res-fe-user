export async function loadNavbar() {
  try {
    const response = await fetch("/src/features/navbar/navbar.html");
    const html = await response.text();
    document.getElementById("navbar-placeholder").innerHTML = html;

    checkAuthStatus();
    initScrollEffect();
  } catch (error) {
    console.error(error);
  }
}

function checkAuthStatus() {
  const userStr = localStorage.getItem("user_data");
  const container = document.getElementById("desktop-auth");

  if (!container) return;

  if (userStr) {
    const user = JSON.parse(userStr);
    container.innerHTML = `
        <div class="flex items-center gap-4">
            <span class="text-sm font-medium text-white/90">Halo, ${user.full_name}</span>
            <button id="btn-logout" class="px-5 py-2 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-all backdrop-blur-sm">
                Keluar
            </button>
        </div>
    `;

    document.getElementById("btn-logout").addEventListener("click", () => {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      window.location.reload();
    });
  }
}

function initScrollEffect() {
  const nav = document.getElementById("main-navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      nav.classList.remove("bg-transparent", "border-white/10");
      nav.classList.add(
        "bg-gray-900/90",
        "backdrop-blur-md",
        "shadow-lg",
        "border-gray-800"
      );
    } else {
      nav.classList.add("bg-transparent", "border-white/10");
      nav.classList.remove(
        "bg-gray-900/90",
        "backdrop-blur-md",
        "shadow-lg",
        "border-gray-800"
      );
    }
  });
}
