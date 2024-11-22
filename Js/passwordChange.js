document.getElementById("sendCodeButton").addEventListener("click", async function () {
    const phone = document.getElementById("phone").value;
  
    if (!phone) {
      alert("Por favor, ingresa tu número de celular.");
      return;
    }
  
    // Deshabilitar botón mientras se procesa
    const button = document.getElementById("sendCodeButton");
    button.disabled = true;
    button.textContent = "Enviando...";
  
    // Enviar el número de teléfono a n8n para generar y enviar el código
    try {
      const response = await fetch("https://n8n.ejesxyz.com/webhook-test/912df1a0-6d03-4a40-89a5-7c1c68ffcf2c", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });
  
      const result = await response.json();
      console.log(result);
      if (result.success) {
        // Mostrar la sección para ingresar el código
        document.getElementById("sendCodeSection").style.display = "none";
        document.getElementById("verifyCodeSection").style.display = "block";
      } else {
        alert("Error al enviar el código. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al comunicarse con el servidor.");
    } finally {
      button.disabled = false;
      button.textContent = "Enviar Código";
    }
  });
  
  document.getElementById("verifyCodeButton").addEventListener("click", async function () {
    const phone = document.getElementById("phone").value;
    const verificationCode = document.getElementById("verificationCode").value;
  
    if (!verificationCode) {
      alert("Por favor, ingresa el código de verificación.");
      return;
    }
  
    // Deshabilitar botón mientras se procesa
    const button = document.getElementById("verifyCodeButton");
    button.disabled = true;
    button.textContent = "Verificando...";
  
    // Enviar el código y el número de teléfono a n8n para verificar
    try {
      const response = await fetch("https://n8n.ejesxyz.com/webhook-test/bca6116d-0d63-4c2b", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, code: verificationCode }),
      });
  
      const result = await response.json();
      console.log(result);
      if (result.success) {
        // Guardar los datos del usuario en localStorage (simulando datos recibidos de n8n)
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("UsuarioID", result.UsuarioID);
        localStorage.setItem("Email", result.Email);
        localStorage.setItem("NombreUsuario", result.NombreUsuario);
        localStorage.setItem("Rol", result.Rol);
        localStorage.setItem("ID", result.ID);
  
        // Redirigir al formulario de recuperación de contraseña
        window.location.href = "/reset-password.html";
      } else {
        // Mostrar mensaje de error
        document.getElementById("codeMessage").innerHTML =
          '<span class="text-danger">El código ingresado es incorrecto.</span>';
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al comunicarse con el servidor.");
    } finally {
      button.disabled = false;
      button.textContent = "Verificar Código";
    }
  });
  