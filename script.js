document.addEventListener("DOMContentLoaded", () => {
  const defaultTemplates = [
    { title: "Plantilla Predeterminada 1 BR", text: "Texto de la plantilla predeterminada 1" },
    { title: "Plantilla Predeterminada 2 ESP", text: "Texto de la plantilla predeterminada 2" },
    { title: "Plantilla Predeterminada 3", text: "Texto de la plantilla predeterminada 3" },
  ];

  let templates = JSON.parse(localStorage.getItem("templates"));

  // Inicializar plantillas en localStorage si no existen
  if (!templates || templates.length === 0) {
    templates = defaultTemplates;
    guardarEnLocalStorage(templates);
  }

  const addModal = document.getElementById("add-template-modal");
  const editModal = document.getElementById("edit-template-modal");
  const saveTemplateBtn = document.getElementById("save-template");
  const updateTemplateBtn = document.getElementById("update-template");
  const deleteTemplateBtn = document.getElementById("delete-template");
  const templateSelector = document.getElementById("template-selector");
  const userSelector = document.getElementById("user-selector");

  // Actualizar botones al cargar la página
  actualizarBotones();

  // Mostrar/Ocultar modales
  document.querySelectorAll(".close").forEach(closeBtn => {
    closeBtn.addEventListener("click", () => {
      addModal.style.display = "none";
      editModal.style.display = "none";
    });
  });

  document.getElementById("add-template-video").addEventListener("click", () => {
    addModal.style.display = "flex";
  });

  document.getElementById("edit-template-video").addEventListener("click", () => {
    cargarPlantillasEnSelector();
    editModal.style.display = "flex";
  });

  // Cambiar texto de los botones naranjas
  document.getElementById("add-template-video").textContent = "Agregar Plantilla";
  document.getElementById("edit-template-video").textContent = "Modificar Plantilla";

  // Cargar datos de la plantilla seleccionada en los campos de edición
  templateSelector.addEventListener("change", () => {
    const selectedIndex = templateSelector.value;
    if (selectedIndex !== "") {
      const selectedTemplate = templates[selectedIndex];
      document.getElementById("edit-title").value = selectedTemplate.title;
      document.getElementById("edit-text").value = selectedTemplate.text;
    }
  });

  // Agregar plantilla
  saveTemplateBtn.addEventListener("click", () => {
    const title = document.getElementById("new-title").value.trim();
    const text = document.getElementById("new-text").value.trim();

    if (title && text) {
      templates.push({ title, text });
      guardarEnLocalStorage(templates);
      actualizarBotones();
      addModal.style.display = "none";
      document.getElementById("new-title").value = ""; // Limpiar campos
      document.getElementById("new-text").value = "";
    } else {
      alert("Ambos campos son obligatorios");
    }
  });

  // Editar plantilla
  updateTemplateBtn.addEventListener("click", () => {
    const selectedIndex = templateSelector.value;
    const title = document.getElementById("edit-title").value.trim();
    const text = document.getElementById("edit-text").value.trim();

    if (selectedIndex !== "" && title && text) {
      templates[selectedIndex] = { title, text };
      guardarEnLocalStorage(templates);
      actualizarBotones();
      editModal.style.display = "none";
    } else {
      alert("Selecciona una plantilla y llena ambos campos");
    }
  });

  // Eliminar plantilla
  deleteTemplateBtn.addEventListener("click", () => {
    const selectedIndex = templateSelector.value;

    if (selectedIndex !== "") {
      templates.splice(selectedIndex, 1);
      guardarEnLocalStorage(templates);
      actualizarBotones();
      editModal.style.display = "none";
    } else {
      alert("Selecciona una plantilla para eliminar");
    }
  });

  // Actualizar botones dinámicos
  function actualizarBotones() {
    const brContainer = document.getElementById("botones-br");
    const espContainer = document.getElementById("botones-esp");
    const otrosContainer = document.getElementById("botones-otros");

    brContainer.innerHTML = "";
    espContainer.innerHTML = "";
    otrosContainer.innerHTML = "";

    const allTemplates = templates.length > 0 ? templates : defaultTemplates;

    allTemplates.forEach(template => {
      const btn = document.createElement("button");
      btn.className = "blue-button tooltip";
      btn.textContent = template.title;

      const tooltipText = document.createElement("span");
      tooltipText.className = "tooltiptext";
      tooltipText.textContent = template.text;
      btn.appendChild(tooltipText);

      btn.addEventListener("click", () => copiarTexto(template.text));

      if (template.title.endsWith("BR")) {
        brContainer.appendChild(btn);
      } else if (template.title.endsWith("ESP")) {
        espContainer.appendChild(btn);
      } else {
        otrosContainer.appendChild(btn);
      }
    });
  }

  // Guardar plantillas en localStorage
  function guardarEnLocalStorage(data) {
    localStorage.setItem("templates", JSON.stringify(data));
  }

  // Copiar texto al portapapeles
  function copiarTexto(text) {
    const userName = userSelector.value;
    const personalizedText = text.replace(/{name}/g, userName);
    navigator.clipboard.writeText(personalizedText).then(() => {
      // Eliminar el mensaje de confirmación
      // alert("Texto copiado: " + personalizedText);
    });
  }

  // Cargar plantillas en el selector de edición
  function cargarPlantillasEnSelector() {
    templateSelector.innerHTML = templates
      .map((template, index) => `<option value="${index}">${template.title}</option>`)
      .join("");
  }

  // Seleccionar elementos
  const modal = document.getElementById('modal');
  const openModalBtn = document.getElementById('openModal');
  const closeModalBtn = document.getElementById('closeModal');

  // Abrir modal
  openModalBtn.addEventListener('click', () => {
      modal.style.display = 'block';
  });

  // Cerrar modal
  closeModalBtn.addEventListener('click', () => {
      modal.style.display = 'none';
  });

  // Cerrar modal al hacer clic fuera del contenido
  window.addEventListener('click', (event) => {
      if (event.target === modal) {
          modal.style.display = 'none';
      }
  });
});
