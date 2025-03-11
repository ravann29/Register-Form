/* filepath: c:\Matkul WEB 1 (semester 2)\Validasi JS pada Register Form (Challenge)\scripts.js */
document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const profilePage = document.getElementById("profile-page");

  const toRegisterLink = document.getElementById("to-register");
  const toLoginLink = document.getElementById("to-login");
  const navLogin = document.querySelector(".nav-login");
  const navRegister = document.querySelector(".nav-register");

  // Change button text
  navLogin.textContent = "Masuk";
  navRegister.textContent = "Daftar";

  // Toggle Password Visibility
  const loginTogglePassword = document.getElementById("login-toggle-password");
  const registerTogglePassword = document.getElementById(
    "register-toggle-password"
  );
  const loginPassword = document.getElementById("login-password");
  const registerPassword = document.getElementById("register-password");

  // Form Elements
  const registerName = document.getElementById("register-name");
  const registerUsername = document.getElementById("register-username");
  const registerWhatsapp = document.getElementById("register-whatsapp");
  const registerImage = document.getElementById("register-image");
  const imagePreview = document.getElementById("image-preview");
  const faceCanvas = document.getElementById("face-canvas");
  const faceDetectionResult = document.getElementById("face-detection-result");

  // Error Elements
  const nameError = document.getElementById("name-error");
  const usernameError = document.getElementById("username-error");
  const passwordError = document.getElementById("password-error");
  const whatsappError = document.getElementById("whatsapp-error");
  const imageError = document.getElementById("image-error");
  const loginError = document.getElementById("login-error");

  // Buttons
  const registerSubmit = document.getElementById("register-submit");
  const registerReset = document.getElementById("register-reset");
  const loginSubmit = document.getElementById("login-submit");
  const loginReset = document.getElementById("login-reset");
  const logoutBtn = document.getElementById("logout-btn");

  // Store user data
  let userData = null;
  let selectedImage = null;
  let faceDetected = false;

  // Load TensorFlow model
  let model;
  async function loadFaceDetectionModel() {
    try {
      model = await blazeface.load();
      console.log("Face detection model loaded");
    } catch (error) {
      console.error("Error loading face detection model:", error);
      faceDetectionResult.textContent =
        "Error loading face detection model. Please try again later.";
    }
  }

  loadFaceDetectionModel();

  // Load user data from cookies
  function loadUserDataFromCookies() {
    const name = getCookie("name");
    const username = getCookie("username");
    const password = getCookie("password");
    const whatsapp = getCookie("whatsapp");
    const image = getCookie("image");

    if (name && username && password && whatsapp && image) {
      userData = { name, username, password, whatsapp, image };
      showProfilePage();
    }
  }

  loadUserDataFromCookies();

  // Set cookie
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

  // Get cookie
  function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") {
        c = c.substring(1);
      }
      if (c.indexOf(cname) === 0) {
        return c.substring(cname.length, c.length);
      }
    }
    return "";
  }

  // Delete cookie
  function deleteCookie(name) {
    document.cookie =
      name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  // Navigation
  toRegisterLink.addEventListener("click", () => showRegisterForm());
  toLoginLink.addEventListener("click", () => showLoginForm());
  navLogin.addEventListener("click", () => showLoginForm());
  navRegister.addEventListener("click", () => showRegisterForm());
  logoutBtn.addEventListener("click", () => showLoginForm());

  function showLoginForm() {
    animateTransition(registerForm, loginForm);
    profilePage.style.display = "none";
  }

  function showRegisterForm() {
    animateTransition(loginForm, registerForm);
    profilePage.style.display = "none";
  }

  function showProfilePage() {
    loginForm.style.display = "none";
    registerForm.style.display = "none";
    profilePage.style.display = "block";

    // Fill profile data
    document.getElementById("profile-name").textContent = userData.name;
    document.getElementById("profile-username").textContent = userData.username;
    document.getElementById("profile-whatsapp").textContent = userData.whatsapp;
    document.getElementById("profile-image").src = userData.image;
  }

  function animateTransition(hideElement, showElement) {
    hideElement.style.opacity = 1;
    hideElement.style.transition = "opacity 0.5s";
    hideElement.style.opacity = 0;

    setTimeout(() => {
      hideElement.style.display = "none";
      showElement.style.display = "block";
      showElement.style.opacity = 0;
      showElement.style.transition = "opacity 0.5s";
      showElement.style.opacity = 1;
    }, 500);
  }

  // Toggle password visibility
  loginTogglePassword.addEventListener("click", () => {
    togglePasswordVisibility(loginPassword, loginTogglePassword);
  });

  registerTogglePassword.addEventListener("click", () => {
    togglePasswordVisibility(registerPassword, registerTogglePassword);
  });

  function togglePasswordVisibility(passwordField, toggleButton) {
    if (passwordField.type === "password") {
      passwordField.type = "text";
      toggleButton.textContent = "🔒";
    } else {
      passwordField.type = "password";
      toggleButton.textContent = "👁️";
    }
  }

  // Form validations

  // Name validation - Proper Case
  registerName.addEventListener("input", () => {
    const name = registerName.value;

    // Only allow letters and spaces
    if (!/^[a-zA-Z\s]*$/.test(name)) {
      nameError.textContent = "Nama hanya boleh berisi huruf dan spasi";
      return;
    }

    // Convert to Proper Case
    const properCase = name
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .replace(
        /\b[A-Z]+\b/g,
        (word) => word.charAt(0) + word.slice(1).toLowerCase()
      );

    if (name !== properCase) {
      registerName.value = properCase;
    }

    nameError.textContent = "";
  });

  // Username validation - lowercase and numbers only
  registerUsername.addEventListener("input", () => {
    const username = registerUsername.value;

    // Convert to lowercase
    if (username !== username.toLowerCase()) {
      registerUsername.value = username.toLowerCase();
    }

    // Check if contains only lowercase letters and numbers
    if (!/^[a-z0-9]*$/.test(username)) {
      usernameError.textContent =
        "Username hanya boleh berisi huruf kecil dan angka";
      return;
    }

    // Check length
    if (username.length < 3) {
      usernameError.textContent = "Username minimal 3 karakter";
    } else if (username.length > 20) {
      usernameError.textContent = "Username maksimal 20 karakter";
    } else {
      usernameError.textContent = "";
    }
  });

  // Password validation
  registerPassword.addEventListener("input", () => {
    const password = registerPassword.value;

    if (password.length < 6) {
      passwordError.textContent = "Password minimal 6 karakter";
      return;
    }

    if (password.length > 20) {
      passwordError.textContent = "Password maksimal 20 karakter";
      return;
    }

    // Check for lowercase, uppercase, number, and special character
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!hasLower || !hasUpper || !hasNumber || !hasSpecial) {
      passwordError.textContent =
        "Password harus mengandung minimal 1 huruf kecil, 1 huruf besar, 1 angka, dan 1 karakter khusus";
    } else {
      passwordError.textContent = "";
    }
  });

  // WhatsApp validation
  registerWhatsapp.addEventListener("input", () => {
    let number = registerWhatsapp.value.replace(/\D/g, "");

    // If starts with 0, replace with country code
    if (number.startsWith("0")) {
      number = "62" + number.substring(1);
    }

    // If it doesn't start with 62, add it
    if (!number.startsWith("62") && number.length > 0) {
      number = "62" + number;
    }

    // Format with +62 and space
    if (number.startsWith("62")) {
      registerWhatsapp.value =
        "+" + number.substring(0, 2) + " " + number.substring(2);
    } else if (number.length === 0) {
      registerWhatsapp.value = "";
    }

    // Validate length
    const digitsOnly = number.length;
    if (digitsOnly < 11) {
      whatsappError.textContent =
        "Nomor WhatsApp terlalu pendek (min. 11 digit)";
    } else if (digitsOnly > 14) {
      whatsappError.textContent =
        "Nomor WhatsApp terlalu panjang (max. 14 digit)";
    } else {
      whatsappError.textContent = "";
    }
  });

  // Image upload and validation
  registerImage.addEventListener("change", async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // Check file type
    if (!file.type.match("image/jpeg") && !file.type.match("image/jpg")) {
      imageError.textContent = "Hanya file JPG yang diperbolehkan!";
      registerImage.value = "";
      imagePreview.src = "";
      faceDetectionResult.textContent = "";
      registerSubmit.disabled = true;
      return;
    }

    // Check file size (50KB - 500KB)
    const fileSize = file.size / 1024; // Convert to KB
    if (fileSize < 50) {
      imageError.textContent = "Ukuran gambar terlalu kecil (min. 50KB)";
      registerImage.value = "";
      imagePreview.src = "";
      faceDetectionResult.textContent = "";
      registerSubmit.disabled = true;
      return;
    }

    if (fileSize > 500) {
      imageError.textContent = "Ukuran gambar terlalu besar (max. 500KB)";
      registerImage.value = "";
      imagePreview.src = "";
      faceDetectionResult.textContent = "";
      registerSubmit.disabled = true;
      return;
    }

    imageError.textContent = "";

    // Read and display image
    const reader = new FileReader();
    reader.onload = async (event) => {
      imagePreview.src = event.target.result;
      selectedImage = event.target.result;

      // Wait for image to load before cropping
      imagePreview.onload = async () => {
        await cropImage(imagePreview);
      };
    };
    reader.readAsDataURL(file);
  });

  // Crop the image before face detection
  async function cropImage(image) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size to the desired crop size (e.g., 300x300)
    const cropSize = 300;
    canvas.width = cropSize;
    canvas.height = cropSize;

    // Draw the cropped image on the canvas
    ctx.drawImage(image, 0, 0, cropSize, cropSize);

    // Convert the cropped image to a data URL
    const croppedImage = canvas.toDataURL("image/jpeg");
    imagePreview.src = croppedImage;

    // Wait for the cropped image to load before face detection
    imagePreview.onload = async () => {
      await detectFace(imagePreview);
    };
  }

  // Face detection with TensorFlow.js
  async function detectFace(image) {
    if (!model) {
      faceDetectionResult.textContent =
        "Face detection model not loaded yet. Please wait...";
      registerSubmit.disabled = true;
      faceDetected = false;
      return;
    }

    try {
      const predictions = await model.estimateFaces(image, false);

      // Draw canvas for face detection visualization
      const canvas = faceCanvas;
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (predictions.length > 0) {
        // Face detected
        faceDetected = true;
        registerSubmit.disabled = false;

        // Get highest confidence prediction
        const bestPrediction = predictions.reduce((prev, current) =>
          prev.probability > current.probability ? prev : current
        );

        const confidence = Math.round(bestPrediction.probability[0] * 100);
        faceDetectionResult.textContent = `Wajah terdeteksi! (${confidence}%)`;
        faceDetectionResult.style.color = "#4cd964";

        // Draw rectangle around face
        ctx.strokeStyle = "#4cd964";
        ctx.lineWidth = 2;

        const start = bestPrediction.topLeft;
        const end = bestPrediction.bottomRight;
        const size = [end[0] - start[0], end[1] - start[1]];

        ctx.strokeRect(start[0], start[1], size[0], size[1]);
      } else {
        // No face detected
        faceDetected = false;
        registerSubmit.disabled = true;
        faceDetectionResult.textContent =
          "Wajah tidak terdeteksi, silahkan pakai gambar JPG lainnya!";
        faceDetectionResult.style.color = "#ff5757";
      }
    } catch (error) {
      console.error("Error during face detection:", error);
      faceDetectionResult.textContent =
        "Error saat mendeteksi wajah. Silakan coba lagi.";
      registerSubmit.disabled = true;
      faceDetected = false;
    }
  }

  // Crop the face from the image
  function cropFace(image, start, size) {
    const canvas = document.createElement("canvas");
    canvas.width = size[0];
    canvas.height = size[1];
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      start[0],
      start[1],
      size[0],
      size[1],
      0,
      0,
      size[0],
      size[1]
    );

    const croppedImage = canvas.toDataURL("image/jpeg");
    document.getElementById("cropped-image").src = croppedImage;
  }

  // Form submission handlers
  document
    .getElementById("register-form-element")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      // Final validation
      if (!faceDetected) {
        faceDetectionResult.textContent =
          "Wajah tidak terdeteksi, silahkan pakai gambar JPG lainnya!";
        return;
      }

      // Create user data
      userData = {
        name: registerName.value,
        username: registerUsername.value,
        password: registerPassword.value,
        whatsapp: registerWhatsapp.value,
        image: selectedImage,
      };

      // Save user data to cookies
      setCookie("name", userData.name, 7);
      setCookie("username", userData.username, 7);
      setCookie("password", userData.password, 7);
      setCookie("whatsapp", userData.whatsapp, 7);
      setCookie("image", userData.image, 7);

      // Reset register form
      document.getElementById("register-form-element").reset();
      imagePreview.src = "";
      faceCanvas
        .getContext("2d")
        .clearRect(0, 0, faceCanvas.width, faceCanvas.height);
      registerSubmit.disabled = true;
      faceDetected = false;

      // Show login form
      showLoginForm();
      alert(
        "Registrasi berhasil! Silakan login dengan username dan password Anda."
      );
    });

  document
    .getElementById("login-form-element")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("login-username").value;
      const password = document.getElementById("login-password").value;

      if (!userData) {
        loginError.textContent = "Silakan register terlebih dahulu!";
        return;
      }

      if (username === userData.username && password === userData.password) {
        document.getElementById("login-form-element").reset();
        loginError.textContent = "";
        showProfilePage();
      } else {
        loginError.textContent = "Username atau password salah!";
      }
    });

  // Reset buttons
  registerReset.addEventListener("click", () => {
    document.getElementById("register-form-element").reset();
    nameError.textContent = "";
    usernameError.textContent = "";
    passwordError.textContent = "";
    whatsappError.textContent = "";
    imageError.textContent = "";
    faceDetectionResult.textContent = "";
    imagePreview.src = "";
    faceCanvas
      .getContext("2d")
      .clearRect(0, 0, faceCanvas.width, faceCanvas.height);
    registerSubmit.disabled = true;
    faceDetected = false;
  });

  loginReset.addEventListener("click", () => {
    document.getElementById("login-form-element").reset();
    loginError.textContent = "";
  });

  logoutBtn.addEventListener("click", () => {
    showLoginForm();
    // Clear user data and cookies on logout
    userData = null;
    deleteCookie("name");
    deleteCookie("username");
    deleteCookie("password");
    deleteCookie("whatsapp");
    deleteCookie("image");
  });
});
