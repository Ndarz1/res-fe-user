export async function loadHero() {
  try {
    const response = await fetch("/src/features/hero/hero.html");
    const html = await response.text();
    document.getElementById("hero-placeholder").innerHTML = html;

    initVideoBackground();
  } catch (e) {
    console.error(e);
  }
}

function initVideoBackground() {
  const btnWatch = document.getElementById("btn-watch-video");
  const imgBg = document.getElementById("hero-bg-image");
  const videoBg = document.getElementById("hero-bg-video");

  if (btnWatch && imgBg && videoBg) {
    btnWatch.addEventListener("click", () => {
      imgBg.classList.remove("opacity-90", "z-10");
      imgBg.classList.add("opacity-0", "z-0");

      videoBg.classList.remove("opacity-0", "z-0");
      videoBg.classList.add("opacity-100", "z-10");

      videoBg.play();

      btnWatch.innerHTML = `<span class="font-sans font-medium tracking-wide text-sm uppercase">Putar Video</span>`;
      btnWatch.classList.add("bg-white/10", "border-white");
    });
  }
}
