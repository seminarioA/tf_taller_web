function mostrarReservas(lista){
    const container = document.getElementById("reservas-container");
    container.innerHTML = ""; // Limpiar el contenedor
  
    lista.forEach((reserva,index) => {
        const card = `
        <div class="col-md-4 col-sm-6 mb-4">
          <div class="card shadow-lg border-0 rounded-3 h-100">
            
            <div class="position-relative">
              <img src="${reserva.img[0]}" class="card-img-top rounded-top" alt="${reserva.Tipo}" loading="lazy">
              <div class="position-absolute top-0 start-0 bg-light bg-opacity-75 text-primary px-3 py-2 rounded-end">
                <span class="fw-bold fs-5">${reserva.Tipo}</span>
              </div>
              <div class="position-absolute bottom-0 start-0 bg-light text-primary px-3 py-2 rounded-end">
                <h5 class="card-title text-primary">
                <i class="fa-solid fa-circle-check"></i> Estado: 
                <span class="badge bg-${reserva.Estado === 'Confirmada' ? 'success' : 'warning'}">${reserva.Estado}</span>
              </h5>
              </div>
            </div>
            
            <div class="card-body d-flex flex-column">
              
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><i class="fa-solid fa-calendar-day text-muted"></i> Entrada: 
                <span class="fw-semibold">${reserva.FechaEntrada}</span></li>
                <li class="list-group-item"><i class="fa-solid fa-calendar-day text-muted"></i> Salida: 
                <span class="fw-semibold">${reserva.FechaSalida}</span></li>
            </ul>
              <p class="card-text">
                <i class="fa-solid fa-money-bill-wave text-success"></i> Precio Total: 
                <span class="fw-bold fs-5">S/ ${reserva.Calculation}</span>
              </p>
              <!-- Botón de acción -->
              <div class="mt-auto">
                <button class="btn btn-primary w-100 abrir-modal-reserva" data-index="${index}">
                  <i class="fa-solid fa-eye"></i> Ver más
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      container.innerHTML += card;
    });
    // Agregar eventos para abrir el modal
    document.querySelectorAll(".abrir-modal-reserva").forEach((btn) => {
      btn.addEventListener("click", function () {
        const index = this.dataset.index;
        console.log(index)
        const habitacion = lista[index];
        console.log(habitacion)
        abrirModalReserva(habitacion);
      });
    });
    if (lista.length === 0) {
      container.innerHTML = "<p class='text-danger text-center'>No hay habitaciones disponibles para el rango de fechas seleccionado.</p>";
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const ID = localStorage.getItem("UsuarioID");

    // Referencias a los elementos del menú
    fetch(
        "https://n8n.ejesxyz.com/webhook-test/af1be105-4633-44d0-bf51-4ba4ff8fea2f",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            'Id':ID
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          sessionStorage.setItem("MisReservas", JSON.stringify(data.reservas));
          // Mostrar todas las habitaciones disponibles inicialmente
          mostrarReservas(data.reservas);
        })
        .catch((error) => {
          console.error("Error al cargar habitaciones:", error);
          document.getElementById("reservas-container").innerHTML =
            `<div class="alert alert-danger text-center" role="alert">
            <i class="fa-solid fa-exclamation-circle"></i> 
            Error al cargar las habitaciones disponibles.
          </div>`;
        });
  });
