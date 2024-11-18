function mostrarHabitaciones(lista) {
  const container = document.getElementById("habitaciones-container");
  container.innerHTML = ""; // Limpiar el contenedor

  lista.forEach((habitacion) => {
    const card = `
        <div class="col-md-4 mb-4">
          <div class="card shadow position-relative">
            <div class="position-relative">
              <img src="${habitacion.img}" class="card-img-top" alt="${habitacion.Tipo}">
              <div class="position-absolute bottom-0 start-0 text-white px-3 py-1 shadow-sm fs-4">
                 <b>${habitacion.Tipo}</b>
              </div>
            </div>
            
            <div class="card-body text-start d-flex justify-content-between">
              <p class="card-text fs-4">
                <i class="fa-solid fa-user-group text-dark"></i>  ${habitacion.Capacidad}</p>
              <p class="card-text" style="line-height: 10px;">
                <i class="fa-solid fa-money-bill text-dark  fs-5"></i>  <b class='text-dark  fs-5'>S/ ${habitacion.PrecioPorNoche}</b> </br> <span class='text-secondary fs-6'>por noche</span>
              </p>
            </div>
            <div class="d-grid gap-2 d-md-flex justify-content-md-end  me-md-2 mb-2">
                <button class="btn btn-primary " type="button" id="menu-cerrar-sesion"><i class="fa-solid fa-right-to-bracket"></i> Reservar</button>
            </div>
          </div>
        </div>
      `;
    container.innerHTML += card;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  fetch(
    "https://n8n.ejesxyz.com/webhook-test/98bca1fb-c190-4f8a-8406-4cc375023567",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Respuesta del webhook:", data);
      mostrarHabitaciones(data.data);
    })
    .catch((error) => {
      console.error("Error al cargar habitaciones:", error);
      document.getElementById("habitaciones-container").innerHTML =
        "<p class='text-danger text-center'>Error al cargar las habitaciones disponibles.</p>";
    });
});
