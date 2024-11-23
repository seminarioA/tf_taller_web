function mostrarHabitaciones(lista) {
  const container = document.getElementById("habitaciones-container");
  container.innerHTML = ""; // Limpiar el contenedor

  lista.forEach((habitacion, index) => {
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
                <button  class="btn btn-primary abrir-modal-reserva" 
                        type="button" 
                        data-index="${index}" 
                        data-bs-toggle="modal" 
                        data-bs-target="#reservaModal" ><i class="fa-solid fa-right-to-bracket"></i> Reservar</button>
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
  fetch(
    "https://n8n.ejesxyz.com/webhook/98bca1fb-c190-4f8a-8406-4cc375023567",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      sessionStorage.setItem("habitaciones", JSON.stringify(data.habitaciones));
      sessionStorage.setItem("reservas", JSON.stringify(data.reservas));
      // Mostrar todas las habitaciones disponibles inicialmente
      const habitacionesDisponibles = data.habitaciones.filter(
        (habitacion) => habitacion.Estado === "Disponible"
      );
      mostrarHabitaciones(habitacionesDisponibles);
    })
    .catch((error) => {
      console.error("Error al cargar habitaciones:", error);
      document.getElementById("habitaciones-container").innerHTML =
        "<p class='text-danger text-center'>Error al cargar las habitaciones disponibles.</p>";
    });
});


$(document).ready(function () {
  $("#exploraForm").on("submit", function (e) {
    e.preventDefault();

    // Obtener valores del formulario
    const numPersonas = parseInt($("#personas").val());
    const fechaIngreso = new Date($("#fechaIngreso").val());
    const fechaSalida = new Date($("#fechaSalida").val());

    if (fechaIngreso >= fechaSalida) {
      alert("La fecha de salida debe ser posterior a la fecha de ingreso.");
      return;
    }

    // Obtener datos de sessionStorage
    const habitaciones = JSON.parse(sessionStorage.getItem("habitaciones"));
    const reservas = JSON.parse(sessionStorage.getItem("reservas"));

    // Filtrar habitaciones según las reservas
    const habitacionesDisponibles = habitaciones.filter((habitacion) => {
      // Verificar si la habitación tiene capacidad suficiente
      if (habitacion.Capacidad < numPersonas) {
        return false;
      }

      // Verificar si la habitación está reservada en el rango de fechas
      const reservasHabitacion = reservas.filter(
        (reserva) => reserva["Tipo (from HabitacionID (FK)"][0] === habitacion.Tipo
      );

      const enUso = reservasHabitacion.some((reserva) => {
        const reservaInicio = new Date(reserva.FechaEntrada);
        const reservaFin = new Date(reserva.FechaSalida);
        return fechaIngreso < reservaFin && fechaSalida > reservaInicio;
      });

      return habitacion.Estado === "Disponible" && !enUso;
    });

    // Mostrar habitaciones filtradas
    mostrarHabitaciones(habitacionesDisponibles);
  });
});

function abrirModalReserva(habitacion) {
  document.getElementById("modalTipo").value = habitacion.Tipo;
  document.getElementById("modalCapacidad").value = habitacion.Capacidad;
  document.getElementById("modalPrecio").value = `S/ ${habitacion.PrecioPorNoche}`;
  document.getElementById("modalFechaIngreso").value = "";
  document.getElementById("modalFechaSalida").value = "";
  document.getElementById("modalPrecioTotal").value = "";

  const loggedIn = localStorage.getItem("loggedIn");

  document.getElementById("btnSiguiente1").addEventListener("click", function () {
    // Siempre empieza desde la primera pantalla
    document.getElementById("datosHabitacion").style.display = "none";

    if (loggedIn === "true") {
      // Si está logueado, salta directo a la tercera pantalla
      document.getElementById("datosFechas").style.display = "block";
      document.getElementById("datosUsuario").style.display = "none";
    } else {
      // Si no está logueado, muestra la segunda pantalla
      document.getElementById("datosUsuario").style.display = "block";
      document.getElementById("datosFechas").style.display = "none";
    }
  });

  document.getElementById("btnRegresar1").addEventListener("click", function () {
    // Regresar a la primera pantalla
    document.getElementById("datosHabitacion").style.display = "block";
    document.getElementById("datosUsuario").style.display = "none";
  });

  document.getElementById("btnSiguiente2").addEventListener("click", function () {
    // Ir a la tercera pantalla desde la segunda
    document.getElementById("datosUsuario").style.display = "none";
    document.getElementById("datosFechas").style.display = "block";
  });

  document.getElementById("btnRegresar2").addEventListener("click", function () {
    // Regresar a la segunda pantalla desde la tercera
    if (loggedIn !== "true") {
      document.getElementById("datosUsuario").style.display = "block";
    }
    document.getElementById("datosHabitacion").style.display = "none";
  });

}


document.getElementById("reservaForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const loggedIn = localStorage.getItem("loggedIn");
  const clienteID = localStorage.getItem("ClienteID");
  const habitacion = {
    tipo: document.getElementById("modalTipo").value,
    capacidad: document.getElementById("modalCapacidad").value,
    precio: document.getElementById("modalPrecio").value,
  };
  const fechas = {
    fechaIngreso: document.getElementById("modalFechaIngreso").value,
    fechaSalida: document.getElementById("modalFechaSalida").value,
  };

  // Validar fechas
  const fechaIngreso = new Date(fechas.fechaIngreso);
  const fechaSalida = new Date(fechas.fechaSalida);
  if (fechaIngreso >= fechaSalida) {
    alert("La fecha de salida debe ser posterior a la fecha de ingreso.");
    return;
  }

  if (loggedIn === "true" && clienteID) {
    // Usuario logueado: realizar directamente la reserva
    const reserva = {
      clienteID,
      ...habitacion,
      ...fechas,
    };

    fetch("https://n8n.ejesxyz.com/webhook/reserva", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reserva),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Reserva confirmada con éxito.");
          cerrarModal();
        } else {
          throw new Error("Error al confirmar reserva.");
        }
      })
      .catch((error) => {
        console.error("Error al confirmar reserva:", error);
        alert("No se pudo confirmar la reserva. Intenta nuevamente.");
      });
  } else {
    // Usuario no logueado: crear cliente y luego realizar reserva
    const cliente = {
      nombre: document.getElementById("modalNombre").value,
      dni: document.getElementById("modalDNI").value,
    };

    fetch("https://n8n.ejesxyz.com/webhook/create-cliente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cliente),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Realizar la reserva con el ID del cliente recién creado
          const reserva = {
            clienteID: data.clienteID,
            ...habitacion,
            ...fechas,
          };

          return fetch("https://n8n.ejesxyz.com/webhook/reserva", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(reserva),
          });
        } else {
          throw new Error("Error al crear cliente.");
        }
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Cliente registrado y reserva confirmada.");
          cerrarModal();
        } else {
          throw new Error("Error al confirmar reserva.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("No se pudo completar la operación. Intenta nuevamente.");
      });
  }
});

function cerrarModal() {
  const modal = bootstrap.Modal.getInstance(document.getElementById("reservaModal"));
  modal.hide();
}

function calcularPrecioTotal() {
  // Obtener los valores de los inputs
  const fechaIngresoValor = document.getElementById("modalFechaIngreso").value;
  console.log(fechaIngresoValor);
  const fechaSalidaValor = document.getElementById("modalFechaSalida").value;
  const precioPorNocheValor = document.getElementById("modalPrecio").value;

  // Validar que todos los campos tengan valores
  if (!fechaIngresoValor || !fechaSalidaValor || !precioPorNocheValor) {
    document.getElementById("modalPrecioTotal").value = "Completa todos los campos";
    return;
  }

  // Convertir las fechas a objetos Date
  const fechaIngreso = new Date(fechaIngresoValor);
  const fechaSalida = new Date(fechaSalidaValor);

  // Convertir el precio por noche a número
  const precioPorNoche = parseFloat(precioPorNocheValor.replace("S/ ", "").trim());

  // Validar que las fechas y el precio sean válidos
  if (isNaN(fechaIngreso.getTime()) || isNaN(fechaSalida.getTime()) || isNaN(precioPorNoche)) {
    document.getElementById("modalPrecioTotal").value = "Selecciona fechas válidas";
    return;
  }

  // Calcular la diferencia en días
  const diferenciaTiempo = fechaSalida - fechaIngreso; // Diferencia en milisegundos
  const dias = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24)); // Convertir a días

  // Validar que las fechas tengan un rango positivo
  if (dias > 0) {
    // Calcular el precio total
    const precioTotal = dias * precioPorNoche;
    document.getElementById("modalPrecioTotal").value = `S/ ${precioTotal.toFixed(2)}`;
  } else {
    document.getElementById("modalPrecioTotal").value = "Selecciona fechas válidas";
  }
}


// Mostrar el formulario de registro
document.getElementById("btnRegistro").addEventListener("click", function () {
  window.location.href = "/register.html";
});

// Redirigir al login
document.getElementById("btnLogin").addEventListener("click", function () {
  window.location.href = "/login.html"; // Cambia la URL al endpoint de tu login
});

