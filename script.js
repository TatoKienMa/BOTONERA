document.addEventListener("DOMContentLoaded", () => {
  /**PLANTILLAS PREDETERMINADAS**/
  const defaultTemplates = [
    { title: "Plantilla Predeterminada 1 BR", text: "Texto de la plantilla predeterminada Brasilero" },
    { title: "Plantilla Predeterminada 2 ESP", text: "Texto de la plantilla predeterminada Español" },
    { title: "Plantilla Predeterminada 3 Otros", text: "Texto de la plantilla predeterminada Otros" },
  ];
  /**SE EXTRAEN PLANTILLAS GUARDADAS EN LOCAL STORAGE**/
  let templates = JSON.parse(localStorage.getItem("templates"));
  /**SI TEMPLATES ES NULL O LENGTH 0 SE CARGAN LAS DEFAULT DE ARRIBA**/
  if (!templates || templates.length === 0) {
    templates = defaultTemplates;
    guardarEnLocalStorage(templates);
  }
  // Actualizar botones al cargar la página
  actualizarBotones();
  
  /**TODOS LOS ELEMENTOS DEL HTML A EDITAR**/
  const addModal = document.getElementById("add-template-modal");
  const editModal = document.getElementById("edit-template-modal");
  const saveTemplateBtn = document.getElementById("save-template");
  const updateTemplateBtn = document.getElementById("update-template");
  const deleteTemplateBtn = document.getElementById("delete-template");
  const templateSelector = document.getElementById("template-selector");
  const userSelector = document.getElementById("user-selector");
  const categoryFilter = document.getElementById("category-filter");

  /**MOSTRAR/OCULTAR MODALS**/
  //AGREGA EVENTO PARA CERRAR MODAL
  document.querySelectorAll(".close").forEach(closeBtn => {
    closeBtn.addEventListener("click", () => {
      addModal.style.display = "none";
      editModal.style.display = "none";
    });
  //AGREGA EVENTO PARA MOSTRAR MODAL
  });
  document.getElementById("add-template-button").addEventListener("click", () => {
    addModal.style.display = "flex";
  });
  document.getElementById("edit-template-button").addEventListener("click", () => {
    cargarPlantillasEnSelector();
    editModal.style.display = "flex";
  });

  document.getElementById("category-filter").addEventListener("change", (event) => {
    const selectedCategory = event.target.value;
    actualizarBotones(selectedCategory);
  });
  

  /**TEXTO DE BOTONES DE AGREGAR-MODIFICAR PLANTILLA**/  
  document.getElementById("add-template-button").textContent = "Agregar Plantilla";
  document.getElementById("edit-template-button").textContent = "Modificar Plantilla";

  /**SE CARGAN LOS VALORES DE LA PLANTILLA SELECCIONADA (MODAL MODIFICAR)**/
  templateSelector.addEventListener("change", () => {
    const selectedIndex = templateSelector.value;//
    if (selectedIndex !== "") {
      const selectedTemplate = templates[selectedIndex];//
      document.getElementById("edit-title").value = selectedTemplate.title;
      document.getElementById("edit-text").value = selectedTemplate.text;
    }
  });

    /**GUARDAR PLANTILLA - NUEVA**/
    saveTemplateBtn.addEventListener("click", () => { //EVENTO ONCLICK EN BOTON
    const title = document.getElementById("new-title").value.trim();
    const text = document.getElementById("new-text").value.trim();

    if (title && text) {
      templates.push({ title, text }); //SE GUARDAN TITULO Y TEXTO EN ARRAY templates (en el cual se guardan las plantillas perdeterminadas)
      guardarEnLocalStorage(templates); //SE GUARDA EN LOCAL STORAGE EL ARRAY DE OBJETOS
      actualizarBotones();
      addModal.style.display = "none";//SE OCULTA EL MODAL
      document.getElementById("new-title").value = "";
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

  /**ELIMINAR PLANTILLA**/
  //----------------------------------------------------------------- BACKUP DE PLANTILLA A ELIMINAR
  function verificarYCrearBackup() {
    const backup = localStorage.getItem("backupTemplates");
    if (!backup) {
      localStorage.setItem("backupTemplates", JSON.stringify([]));
    }
  }
  function guardarEnBackup(plantilla) {
    verificarYCrearBackup();
    const backup = JSON.parse(localStorage.getItem("backupTemplates"));
    backup.push(plantilla);
    localStorage.setItem("backupTemplates", JSON.stringify(backup));
    console.log("Backup actualizado:", JSON.parse(localStorage.getItem("backupTemplates")));
  }
  
  //----------------------------------------------------------------- ELIMINAR PLANTILLA
  deleteTemplateBtn.addEventListener("click", () => {
    const selectedIndex = templateSelector.value;

    if (selectedIndex !== "") {
      const plantillaEliminada = templates[selectedIndex];
      guardarEnBackup(plantillaEliminada);
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
      btn.className = "nocnoc-button tooltip";
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
    const personalizedText = `${text}. Atte: ${userName}`;
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
