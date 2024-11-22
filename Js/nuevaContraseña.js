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
});