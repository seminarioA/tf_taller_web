let habitaciones = [];
let habitacionTipo1="";
document.addEventListener("DOMContentLoaded", function () {
  fetch(
    "https://n8n.ejesxyz.com/webhook/c2b44f0b-6def-4666-bbc6-aa25cc5898c6",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      habitaciones = data.habitaciones;
      console.log(habitaciones);
      actualizarDisponibilidad();
      CheckIn();
    })
    .catch((error) => console.error("Error al obtener los datos:", error));

  // Agrega los event listeners a las áreas del mapa
  document.querySelectorAll("area").forEach((area) => {
    area.addEventListener("click", (e) => {
      e.preventDefault();

      const habitacionId = area.href.split("/").pop();
      console.log(habitacionId);
      const habitacion = habitaciones.find((h) => h.id === habitacionId);

      if (habitacion) {
        // Rellena el modal con los datos de la habitación
        document.getElementById("HabitacionId").value = habitacion.id;
        document.getElementById("HabitacionTipo").value = habitacion.Tipo;
        let habitacionTipo1=habitacion.Tipo;
        document.getElementById("disponibilidad").innerText = habitacion.Estado;
        document.getElementById("HabitacionPrecio").value =
          "S/" + habitacion.PrecioPorNoche;

        // Muestra el modal
        const modal = new bootstrap.Modal(
          document.getElementById("modalCheckInCheckOut")
        );
        modal.show();
      } else {
        alert("Habitación no encontrada.");
      }
    });
  });
});
function CheckIn() {
  let btnCheckIn = document.getElementById("btnCheckIn");
  let datosCliente = document.getElementById("datosCliente");
  let btnSiguiente1 = document.getElementById("btnSiguiente1");
  let modalDNI = document.getElementById("modalDNI");
  let DatosUsuario = document.getElementById("DatosUsuario");
  let AsignarHabitacion = document.getElementById("AsignarHabitacion");

  // Paso 1: Mostrar formulario para ingresar el DNI
  btnCheckIn.addEventListener("click", (e) => {
    e.preventDefault();
    datosCliente.style.display = "block";
  });

  // Paso 2: Verificar si el cliente existe al hacer clic en "Siguiente"
  btnSiguiente1.addEventListener("click", async (e) => {
    e.preventDefault();
    const dni = modalDNI.value;

    if (!dni) {
      alert("Por favor, ingresa un DNI válido.");
      return;
    }

    try {
      // Enviar el DNI al webhook para verificar si el cliente existe
      const response = await fetch(
        "https://n8n.ejesxyz.com/webhook-test/amadeus-verificar-cliente",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dni,habitacionTipo1 }),
        }
      );

      const result = await response.json();
      console.log(result);
      if (result.exists) {
        // El cliente existe, mostrar su información
        alert("Cliente encontrado: " + result.nombre);
        DatosUsuario.style.display = "none"; // Ocultar formulario de creación
        AsignarHabitacion.style.display = "block"; // Mostrar botón para asignar habitación

        // Mostrar la habitación más cercana a hoy
        const habitacionInfo = `
            Tipo de habitación: ${result.tipoHabitacion}
            Nombre del cliente: ${result.nombre}
          `;
        alert(habitacionInfo);
      } else {
        // El cliente no existe, mostrar formulario para crear usuario
        alert("Cliente no encontrado. Ingresa sus datos.");
        DatosUsuario.style.display = "block";
      }
    } catch (error) {
      console.error("Error verificando cliente:", error);
    }
  });

  // Paso 3: Crear usuario y reserva si el cliente no existe
  let btnCrearUsuario = document.getElementById("btnCrearUsuario");
  btnCrearUsuario.addEventListener("click", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const dni = document.getElementById("dni").value;
    const celular = document.getElementById("celular").value;
    const email = document.getElementById("email").value;

    try {
      // Enviar datos al webhook para crear el usuario y la reserva
      const response = await fetch(
        "https://n8n.ejesxyz.com/webhook/amadeus-crear-usuario",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nombre, dni, celular, email }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Usuario y reserva creados exitosamente.");
        DatosUsuario.style.display = "none"; // Ocultar formulario de creación
        AsignarHabitacion.style.display = "block"; // Mostrar botón para asignar habitación
      } else {
        alert("Error al crear usuario y reserva.");
      }
    } catch (error) {
      console.error("Error creando usuario y reserva:", error);
    }
  });

  // Paso 4: Asignar la habitación y cambiar estado
  let btnAsignarHabitacion = document.getElementById("btnAsignarHabitacion");
  btnAsignarHabitacion.addEventListener("click", async (e) => {
    e.preventDefault();
    const habitacionId = document.getElementById("HabitacionId").value;

    try {
      // Enviar webhook para cambiar el estado de la habitación y reserva
      const response = await fetch(
        "https://n8n.ejesxyz.com/webhook/amadeus-asignar-habitacion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ habitacionId, estado: "Ocupada" }),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert("Habitación asignada exitosamente.");
      } else {
        alert("Error al asignar habitación.");
      }
    } catch (error) {
      console.error("Error asignando habitación:", error);
    }
  });
}

function actualizarDisponibilidad() {
  const mapa = document.querySelector(".mapa-container");

  document.querySelectorAll("area").forEach((area) => {
    const habitacionId = area.href.split("/").pop();
    const habitacion = habitaciones.find((h) => h.id === habitacionId);

    if (habitacion) {
      const estado = habitacion.Estado.toLowerCase();

      const estadoDiv = document.createElement("div");
      estadoDiv.classList.add("estado-habitacion");

      estadoDiv.textContent = estado === "disponible" ? "🟢" : "🔴";

      const coords = area.coords.split(",").map(Number);
      const x = coords[0];
      const y = coords[1];

      estadoDiv.style.left = `${x}px`;
      estadoDiv.style.top = `${y}px`;

      mapa.appendChild(estadoDiv);
    }
  });
}
