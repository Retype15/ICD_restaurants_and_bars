
document.addEventListener('DOMContentLoaded', () => {
  // Cargar rutas desde la API
  fetchRoutes();

  // Manejar la carga de archivo JSON
  document.getElementById('jsonFileInput').addEventListener('change', handleFileUpload);
  document.getElementById('jsonInput').addEventListener('input', handleTextInput);

  // Manejar el envío del formulario
  document.getElementById('submitButton').addEventListener('click', handleSubmit);
  
  // Evento para cerrar el modal
  document.querySelector('.close-btn').addEventListener('click', closeModal);
});

// Función para obtener las rutas desde la API
async function fetchRoutes() {
  try {
    const response = await fetch('/api/files');
    const files = await response.json();

    if (files.error) {
      console.error('Error:', files.error);
      return;
    }

    // Filtrar las rutas que están dentro de la carpeta 'Convertidos'
    const folders = files.filter(file => file.name.startsWith('Convertidos/'))
                          .map(file => file.name.split('/')[1]);  // Extraer solo la subcarpeta dentro de Convertidos

    const uniqueFolders = [...new Set(folders)]; // Eliminar duplicados

    // Rellenar el selector con las rutas
    const routeSelect = document.getElementById('routeSelect');
    routeSelect.innerHTML = ''; // Limpiar opciones
    routeSelect.innerHTML = '<option value="">Selecciona una ruta...</option>';  // Opción por defecto

    uniqueFolders.forEach(folder => {
      const option = document.createElement('option');
      option.value = 'Convertidos/' + folder;  // Agregar el prefijo "Convertidos/"
      option.textContent = folder;
      routeSelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error fetching routes:', error);
  }
}

// Función para manejar la carga del archivo JSON
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file && file.type === 'application/json') {
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById('jsonInput').value = reader.result;
    };
    reader.readAsText(file);
  }
}

// Función para manejar la entrada de texto del JSON
function handleTextInput(event) {
  const jsonText = event.target.value;
  // Aquí puedes hacer algo con el texto del JSON si lo necesitas
}

// Función para manejar el envío de la solicitud
async function handleSubmit() {
  const jsonInput = document.getElementById('jsonInput').value;
  const selectedRoute = document.getElementById('routeSelect').value;
  const userName = document.getElementById('userName').value;

  if (!jsonInput || !selectedRoute || !userName) {
    showModal('Por favor, completa todos los campos', 'error');
    return;
  }

  // Aquí puedes hacer la solicitud al servidor
  console.log('Enviando JSON:', jsonInput);
  console.log('Ruta seleccionada:', selectedRoute);
  console.log('Nombre de usuario:', userName);

  // Enviar los datos al servidor
  const requestBody = {
    responseSchema: JSON.parse(jsonInput),
    selectedRoute,
    userName
  };

  try {
	showModal('Su solicitud esta siendo procesada... puede irse a tomar un café mientras espera...', 'prossesing')
    /*const response = await fetch('/api/query_json.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });*/
	
	showModal('hasta aqui todo bien','blue')
	//send_query(requestBody);

    const data = await response.json();
    if (data.error) {
      showModal('Hubo un error: ' + data.error, 'error');
    } else {
      showModal('Solicitud enviada con éxito!', 'success');
    }
  } catch (error) {
    showModal('Error al enviar la solicitud: ' + error, 'error');
  }

  // Limpiar el formulario
  //document.getElementById('jsonInput').value = '';
  //document.getElementById('routeSelect').value = '';
  //document.getElementById('userName').value = '';
}

// Función para mostrar el modal con el mensaje
function showModal(message, type) {
  const modal = document.getElementById('messageModal');
  const modalMessage = document.getElementById('modalMessage');
  
  modalMessage.textContent = message;

  // Cambiar el color del mensaje según el tipo
  if (type === 'error') {
    modalMessage.style.color = 'red';
  } else if (type === 'success') {
    modalMessage.style.color = 'green';
  } else {
	  modalMessage.style.color = 'blue';
  }

  modal.style.display = 'block';
}

// Función para cerrar el modal
function closeModal() {
  const modal = document.getElementById('messageModal');
  modal.style.display = 'none';
}

showModal("TOdo bien hasta aqui(antes de las nuevas funciones)",'blue')

console.log("TOdo bien hasta aqui(antes de las nuevas funciones)")
///////////////////////////////////////////////////////////////////////
