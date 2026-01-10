document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      console.log("Login Attempt:", { email, password });

      const dummyUser = {
        id: 1,
        username: "budi_santoso",
        full_name: "Budi Santoso",
        email: email,
        role: "user",
      };

      localStorage.setItem("auth_token", "dummy-jwt-token-12345");
      localStorage.setItem("user_data", JSON.stringify(dummyUser));

      alert("Login Berhasil!");
      window.location.href = "/";
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fullName = document.getElementById("full_name").value;
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const password = document.getElementById("password").value;

      const payload = {
        full_name: fullName,
        username: username,
        email: email,
        phone: phone,
        password: password,
      };

      console.log("Register Payload:", payload);

      alert("Pendaftaran Berhasil! Silakan Masuk.");
      window.location.href = "login.html";
    });
  }
});
