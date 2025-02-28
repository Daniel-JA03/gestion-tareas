const addBtn = document.getElementById("add");
const buscarTareaInput = document.getElementById("buscarTarea");
const botonBuscar = document.getElementById("botonBuscar")
const mostrarTodasBtn = document.getElementById("mostrarTodas");
const usuario = document.getElementById("usuario");
// Cargar tareas al iniciar la página
const tasks = JSON.parse(localStorage.getItem("tasks"));



if (tasks) {
  tasks.forEach((task) => addNewTask(task.text, task.estado, task.fecha));
}

// Evento para añadir una nueva tarea
addBtn.addEventListener("click", () => addNewTask());

function addNewTask(text = "", estado = "pendiente", fecha = new Date().toLocaleString( "es-ES", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
}
)) {
  const task = document.createElement("div");
  task.classList.add("task");

  task.innerHTML = `
        <div class="tools">
            <select class="estado">
                <option value="pendiente" ${estado === "pendiente" ? "selected" : ""}>🟢 Pendiente</option>
                <option value="progreso" ${estado === "progreso" ? "selected" : ""}>🟡 En progreso</option>
                <option value="completada" ${estado === "completada" ? "selected" : ""}>✅ Completada</option>
                <option value="cancelada" ${estado === "cancelada" ? "selected" : ""}>❌ Cancelada</option>
            </select>
            <button class="editar"><i class="fas fa-edit"></i></button>
        <button class="eliminar"><i class="fas fa-trash-alt"></i></button>
        </div>

        <p class="creado">Creado: ${fecha}</p>

        <div class="main ${text ? "" : "hidden"}"></div>
        <textarea class="${text ? "hidden" : ""}"></textarea>
        `;

  const editBtn = task.querySelector(".editar");
  const deleteBtn = task.querySelector(".eliminar");
  const main = task.querySelector(".main");
  const textArea = task.querySelector("textarea");
  const estadoSelect = task.querySelector(".estado");

  textArea.value = text;
  main.innerHTML = marked(text);

  // Evento para eliminar la tarea
  deleteBtn.addEventListener('click', () => {
    task.remove();

    updateLS();
  });

  // Evento para editar la tarea
  editBtn.addEventListener('click', () => {
    main.classList.toggle('hidden');
    textArea.classList.toggle('hidden');
  });

  // Evento para actualizar el texto de la tarea
  textArea.addEventListener("input", (e) => {
    const { value } = e.target;

    main.innerHTML = marked(value);
    updateLS();
  });

  // Evento para actualizar el estado de la tarea
  estadoSelect.addEventListener("change", () => {
    updateLS();
  })

  document.body.appendChild(task);
}

/*function updateLS() {
  const tasksText = document.querySelectorAll("textarea");

  const tasks = [];

  tasksText.forEach((task) => tasks.push(task.value));

  localStorage.setItem("tasks", JSON.stringify(tasks));
}*/

// Función para actualizar el localStorage
function updateLS() {
    const tasksElements = document.querySelectorAll(".task");
    const tasks = [];

    tasksElements.forEach(tasksElements => {
        tasks.push({
            text: tasksElements.querySelector("textarea").value,
            estado: tasksElements.querySelector(".estado").value,
            fecha: tasksElements.querySelector(".creado").textContent.replace("Creado: ", "")
        })
    })

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Función para filtrar tareas por estado
function filtrarTareasPorEstado(estado) {
    const task = document.querySelectorAll(".task");

    task.forEach((task) => {
        const estadoTask = task.querySelector(".estado").value;

        if (estado === "" || estadoTask.toLowerCase().includes(estado.toLowerCase())) {
            task.style.display = "block";
        } else {
            task.style.display = "none";
        }
    })
}

// Evento para el botón de búsqueda
botonBuscar.addEventListener("click", () => {
    const estadoABuscar = buscarTareaInput.value.trim();
    filtrarTareasPorEstado(estadoABuscar);
})

// Evento para el input (buscar al presionar Enter)
buscarTareaInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        const estadoABuscar = buscarTareaInput.value.trim();
        filtrarTareasPorEstado(estadoABuscar);
    }
})

// Función para mostrar todas las tareas
function mostrarTodasLasTareas() {
    // Seleccionamos todas las tareas
    const task = document.querySelectorAll(".task");

    task.forEach((task) => {
        // mostramos todas las tareas
        task.style.display = "block";
    })

    // limpiamos el input de búsqueda
    buscarTareaInput.value = "";
}

// Evento para el botón de "Mostrar Todas"
mostrarTodasBtn.addEventListener("click", mostrarTodasLasTareas);

// Evento para mostrar/ocultar el dropdown
usuario.addEventListener("click", (e) => {
    e.preventDefault();

    usuario.classList.toggle("active");
})

// Evento para cerrar sesion (ejemplo)
const cerrarSesion = document.getElementById("cerrarSesion");
cerrarSesion.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("nombreUsuario");
    alert("Sesión cerrada");
    window.location.href = "login.html";
}) 

// cerrar el dropdown al hacer click fuera de él
document.addEventListener("click", (e) => {
    if (!usuario.contains(e.target)) {
        usuario.classList.remove("active");
    }
})

// Obtener el nombre del usuario desde localStorage
const nombreUsuario = localStorage.getItem("nombreUsuario") || "Invitado";

// Mostrar el nombre del usuario
const nomUsuario = document.querySelector(".nomUsuario");
nomUsuario.textContent = nombreUsuario;