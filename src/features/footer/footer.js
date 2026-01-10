export async function loadFooter() {
  try {
    const response = await fetch("/src/features/footer/footer.html");
    if (!response.ok) throw new Error("Gagal load footer");
    const html = await response.text();
    document.getElementById("footer-placeholder").innerHTML = html;
  } catch (e) {
    console.error(e);
  }
}
