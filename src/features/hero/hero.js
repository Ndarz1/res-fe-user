export async function loadHero() {
  try {
    const response = await fetch("/src/features/hero/hero.html");
    const html = await response.text();
    document.getElementById("hero-placeholder").innerHTML = html;
  } catch (e) {
    console.error(e);
  }
}
