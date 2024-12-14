document.addEventListener('DOMContentLoaded', () => {
  // Cargar rutas desde la API
  fetchRoutes();

  // Manejar la carga de archivo JSON
  document.getElementById('jsonFileInput').addEventListener('change', handleFileUpload);
  document.getElementById('jsonInput').addEventListener('input', handleTextInput);

  // Manejar el envío del formulario (vacío por ahora)
  document.getElementById('submitButton').addEventListener('click', handleSubmit);
});

// Función para obtener las rutas desde el servidor
async function fetchRoutes() {
  try {
    const response = await fetch('/api/files');
    const files = await response.json();

    if (files.error) {
      console.error('Error:', files.error);
      return;
    }

    // Obtener los nombres de las carpetas principales
    const folders = files.map(file => file.name.split('/')[0]);
    const uniqueFolders = [...new Set(folders)];

    // Rellenar el selector con las rutas
    const routeSelect = document.getElementById('routeSelect');
    routeSelect.innerHTML = ''; // Limpiar opciones
    uniqueFolders.forEach(folder => {
      const option = document.createElement('option');
      option.value = folder;
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
function handleSubmit() {
  const jsonInput = document.getElementById('jsonInput').value;
  const selectedRoute = document.getElementById('routeSelect').value;

  if (!jsonInput || !selectedRoute) {
    alert('Por favor, completa ambos campos');
    return;
  }

  // Aquí podrías realizar la solicitud real al servidor
  console.log('Enviando JSON:', jsonInput);
  console.log('Ruta seleccionada:', selectedRoute);

  // Limpia el formulario
  document.getElementById('jsonInput').value = '';
  document.getElementById('routeSelect').value = '';
}
