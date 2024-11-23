
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
                document.getElementById("disponibilidad").innerText = habitacion.Estado;
                document.getElementById("HabitacionPrecio").value = "S/" + habitacion.PrecioPorNoche;

                // Muestra el modal
                const modal = new bootstrap.Modal(document.getElementById("modalCheckInCheckOut"));
                modal.show();
            } else {
                alert("Habitación no encontrada.");
            }
        });
        
    });
});
function CheckIn(){
    let btnCheckIn=document.getElementById("btnCheckIn");
    let datosCliente=document.getElementById("datosCliente");
    btnCheckIn.addEventListener("click",(e)=> {
    e.preventDefault();
    datosCliente.style.display = "block";
}

)
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

            
            estadoDiv.textContent = estado === "disponible" ? "✅" : "❌";

            
            const coords = area.coords.split(",").map(Number);
            const x = coords[0];
            const y = coords[1];

            estadoDiv.style.left = `${x}px`;
            estadoDiv.style.top = `${y}px`;

            
            mapa.appendChild(estadoDiv);
        }
    });
}
