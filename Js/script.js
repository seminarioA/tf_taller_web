document.addEventListener("DOMContentLoaded", function () {
  const loggedIn = localStorage.getItem("loggedIn");
  const nombreUsuario = localStorage.getItem("NombreUsuario");
  const Rol = localStorage.getItem("Rol");

  console.log(Rol);
  // Referencias a los elementos del menú
  const menuIniciarSesion = document.getElementById("menu-iniciar-sesion");
  const menuMisReservas = document.getElementById("menu-mis-reservas");
  const menuCerrarSesion = document.getElementById("menu-cerrar-sesion");
  const saludoUsuario = document.getElementById("saludo-usuario");
  const menuAdmin = document.getElementById("menu-admin");


  if (loggedIn === "true") {
    // Usuario logueado
    if (Rol == 'administrador') {
      if (menuIniciarSesion) menuIniciarSesion.style.display = "none"; // Ocultar "Iniciar Sesión"
      if (menuMisReservas) menuMisReservas.style.display = "block"; // Mostrar "Mis Reservas"
      if (menuCerrarSesion) menuCerrarSesion.style.display = "block"; // Mostrar "Cerrar Sesión"
      if (menuAdmin) menuAdmin.style.display = "block"; // Mostrar "Admin"
      if (saludoUsuario && nombreUsuario) saludoUsuario.textContent = `Hola, ${nombreUsuario}`; // Mostrar saludo
    } else {
      if (menuIniciarSesion) menuIniciarSesion.style.display = "none"; // Ocultar "Iniciar Sesión"
      if (menuMisReservas) menuMisReservas.style.display = "block"; // Mostrar "Mis Reservas"
      if (menuCerrarSesion) menuCerrarSesion.style.display = "block"; // Mostrar "Cerrar Sesión"
      if (menuAdmin) menuAdmin.style.display = "none"; // Ocultar "Admin"
      if (saludoUsuario && nombreUsuario) saludoUsuario.textContent = `Hola, ${nombreUsuario}`; // Mostrar saludo
    }

  } else {
    // Usuario no logueado
    if (menuIniciarSesion) menuIniciarSesion.style.display = "block"; // Mostrar "Iniciar Sesión"
    if (menuMisReservas) menuMisReservas.style.display = "none"; // Ocultar "Mis Reservas"
    if (menuCerrarSesion) menuCerrarSesion.style.display = "none"; // Ocultar "Cerrar Sesión"
    if (menuAdmin) menuAdmin.style.display = "none"; // Ocultar "Admin"
    if (saludoUsuario) saludoUsuario.textContent = ""; // Limpiar saludo
  }

  // Manejar el cierre de sesión
  if (menuCerrarSesion) {
    menuCerrarSesion.addEventListener("click", function () {
      localStorage.clear(); // Limpiar la sesión
      //alert("Has cerrado sesión.");
      window.location.href = "login.html"; // Redirigir al login
    });
  }
});
