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

  if (userStr && userStr !== "undefined") {
    try {
      const user = JSON.parse(userStr);

      let avatarHTML;
      if (user.profile_image) {
        const imgUrl = `http://localhost:8080${
          user.profile_image
        }?t=${new Date().getTime()}`;
        avatarHTML = `
          <img src="${imgUrl}" alt="Profile" class="w-8 h-8 rounded-full object-cover shadow-md ring-2 ring-white/20 bg-gray-800" />
        `;
      } else {
        avatarHTML = `
          <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-white/20">
              ${user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
          </div>
        `;
      }

      container.innerHTML = `
          <div class="flex items-center gap-4">
              <a href="/profile.html" class="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded-full transition-all group border border-transparent hover:border-white/10">
                  ${avatarHTML}
                  <span class="text-sm font-medium text-white/90 group-hover:text-white">
                      Hai, ${user.username || "User"}
                  </span>
              </a>
          </div>
      `;
    } catch (error) {
      localStorage.removeItem("user_data");
    }
  }
}

function initScrollEffect() {
  const nav = document.getElementById("main-navbar");

  if (!nav) return;

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
