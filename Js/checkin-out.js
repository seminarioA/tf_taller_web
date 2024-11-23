
let habitaciones = [];

document.addEventListener("DOMContentLoaded", function () {

  fetch('https://n8n.ejesxyz.com/webhook/c2b44f0b-6def-4666-bbc6-aa25cc5898c6', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      habitaciones = data.habitaciones; 
      console.log(habitaciones);
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
        document.getElementById("disponibilidad").innerText = habitacion.Estado;
        document.getElementById("HabitacionPrecio").value = "S/"+habitacion.PrecioPorNoche;

        // Muestra el modal
        const modal = new bootstrap.Modal(document.getElementById("modalCheckInCheckOut"));
        modal.show();
      } else {
        alert("Habitación no encontrada.");
      }
    });
  });
});
