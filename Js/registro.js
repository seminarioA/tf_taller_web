document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("password");
    const minLengthCheck = document.getElementById("min-length");
    const uppercaseCheck = document.getElementById("uppercase");
    const lowercaseCheck = document.getElementById("lowercase");
    const numberCheck = document.getElementById("number");
  
    // Función para validar la contraseña
    passwordInput.addEventListener("input", function () {
      const password = passwordInput.value;
  
      // Validar longitud mínima
      if (password.length >= 8) {
        minLengthCheck.classList.remove("text-danger");
        minLengthCheck.classList.add("text-success");
        minLengthCheck.innerHTML = '<i class="fa-solid fa-circle-check"></i> Al menos 8 caracteres';
      } else {
        minLengthCheck.classList.remove("text-success");
        minLengthCheck.classList.add("text-danger");
        minLengthCheck.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Al menos 8 caracteres';
      }
  
      // Validar una letra mayúscula
      if (/[A-Z]/.test(password)) {
        uppercaseCheck.classList.remove("text-danger");
        uppercaseCheck.classList.add("text-success");
        uppercaseCheck.innerHTML = '<i class="fa-solid fa-circle-check"></i> Una letra mayúscula';
      } else {
        uppercaseCheck.classList.remove("text-success");
        uppercaseCheck.classList.add("text-danger");
        uppercaseCheck.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Una letra mayúscula';
      }
  
      // Validar una letra minúscula
      if (/[a-z]/.test(password)) {
        lowercaseCheck.classList.remove("text-danger");
        lowercaseCheck.classList.add("text-success");
        lowercaseCheck.innerHTML = '<i class="fa-solid fa-circle-check"></i> Una letra minúscula';
      } else {
        lowercaseCheck.classList.remove("text-success");
        lowercaseCheck.classList.add("text-danger");
        lowercaseCheck.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Una letra minúscula';
      }
  
      // Validar un número
      if (/\d/.test(password)) {
        numberCheck.classList.remove("text-danger");
        numberCheck.classList.add("text-success");
        numberCheck.innerHTML = '<i class="fa-solid fa-circle-check"></i> Un número';
      } else {
        numberCheck.classList.remove("text-success");
        numberCheck.classList.add("text-danger");
        numberCheck.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Un número';
      }
    });
  
    // Lógica de registro (igual que antes)
    const registroForm = document.getElementById("registroForm");
    registroForm.addEventListener("submit", function (e) {
      e.preventDefault();
  
      const nombre = document.getElementById("nombre").value;
      const dni = document.getElementById("dni").value;
      const celular = document.getElementById("celular").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      // Validar antes de enviar
      if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password) || password.length < 8) {
        alert("La contraseña no cumple con los requisitos.");
        return;
      }
  
      const hashedPassword = CryptoJS.SHA256(password).toString();
  
      // Enviar los datos al webhook de n8n
      fetch("https://n8n.ejesxyz.com/webhook/673ef3e4-cf73-49f8-8426-b80389f3276d", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          dni,
          celular,
          email,
          password: hashedPassword,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            alert("Registro exitoso. Ahora puedes iniciar sesión.");
            window.location.href = "login.html"; // Redirigir al login
          } else {
            alert(result.message || "Error al registrar. Intenta nuevamente.");
          }
        })
        .catch((error) => {
          console.error("Error al registrar:", error);
          alert("Hubo un error en el registro. Intenta nuevamente.");
        });
    });
  });
  