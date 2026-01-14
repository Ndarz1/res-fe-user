const BASE_HOST =
  window.location.hostname === "127.0.0.1" ? "127.0.0.1" : "localhost";
const API_BASE_URL = `http://${BASE_HOST}:8080/api`;

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("email").value;
      const passwordInput = document.getElementById("password").value;

      const btn = loginForm.querySelector("button");
      const originalText = btn.textContent;
      btn.textContent = "Memproses...";
      btn.disabled = true;

      try {
        const loginResponse = await fetch(`${API_BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            username: emailInput,
            password: passwordInput,
          }),
        });

        const loginResult = await loginResponse.json();

        if (loginResponse.ok) {
          const meResponse = await fetch(`${API_BASE_URL}/me`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });

          if (meResponse.ok) {
            const meResult = await meResponse.json();
            localStorage.setItem("user_data", JSON.stringify(meResult.data));
            window.location.href = "/";
          } else {
            alert(
              "Login berhasil tapi gagal memuat profil. Silakan coba lagi."
            );
          }
        } else {
          alert(loginResult.message || "Login gagal.");
        }
      } catch (error) {
        console.error(error);
        alert("Gagal menghubungi server.");
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const fullName = document.getElementById("full_name").value;
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const password = document.getElementById("password").value;

      if (password.length < 6) {
        alert("Password minimal 6 karakter!");
        return;
      }

      const btn = registerForm.querySelector("button");
      const originalText = btn.textContent;
      btn.textContent = "Mendaftar...";
      btn.disabled = true;

      try {
        const response = await fetch(`${API_BASE_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: fullName,
            username: username,
            email: email,
            phone: phone,
            password: password,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Registrasi Berhasil! Silakan Masuk.");
          window.location.href = "login.html";
        } else {
          alert(`Gagal Mendaftar: ${result.message}`);
        }
      } catch (error) {
        console.error(error);
        alert("Terjadi kesalahan koneksi ke server.");
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  }
});
