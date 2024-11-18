function mostrarHabitaciones(lista) {
    const container = document.getElementById("habitaciones-container");
    container.innerHTML = ""; // Limpiar el contenedor
  
    lista.forEach((habitacion) => {
      const card = `
        <div class="col-md-4 mb-4">
          <div class="card shadow position-relative">
            <!-- Disponibles en la esquina superior derecha -->
            <div class="position-absolute top-0 end-0 bg-primary text-white rounded-start px-3 py-1" style="z-index: 3;">
              ${habitacion.count_Tipo}
            </div>
            <!-- Imagen con tipo en la esquina inferior izquierda -->
            <div class="position-relative">
              <img src="${habitacion.img}" class="card-img-top" alt="${habitacion.Tipo}">
              <div class="position-absolute bottom-0 start-0 text-white px-3 py-1 shadow-sm fs-4">
                 <b>${habitacion.Tipo}</b>
              </div>
            </div>
            <!-- Contenido -->
            <div class="card-body text-start">
              <p class="card-text">
                <i class="fa-solid fa-user-group text-primary "></i>  ${habitacion.Capacidad} personas
              </p>
              <p class="card-text">
                <i class="fa-solid fa-money-bill text-primary"></i>  S/ ${habitacion.PrecioPorNoche} por noche
              </p>
            </div>
          </div>
        </div>
      `;
      container.innerHTML += card;
    });
  }
  
  
  document.addEventListener("DOMContentLoaded", function () {
    fetch("https://n8n.ejesxyz.com/webhook/98bca1fb-c190-4f8a-8406-4cc375023567", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
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
  