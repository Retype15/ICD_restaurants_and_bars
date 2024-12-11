// Inicialización de Leaflet para el mapa
let map;
let marker;

// Función para mostrar la alerta
function showAlert(texto) {
    const alertaContainer = document.getElementById('alerta-container');
    const alertaTexto = document.getElementById('alerta-texto');
    const alertaBtn = document.getElementById('alerta-btn');

    // Asigna el texto con HTML para enlaces funcionales
    alertaTexto.innerHTML = texto;

    // Quita cualquier clase de salida previa y aplica la clase de entrada
    alertaTexto.classList.remove('fade-out');
    alertaTexto.classList.add('fade-in');
    alertaBtn.classList.remove('fade-out');
    alertaBtn.classList.add('fade-in');

    // Muestra el contenedor
    alertaContainer.style.display = 'flex';

    // Evento para cerrar la alerta al hacer clic en el botón
    alertaBtn.onclick = function () {
        // Añade la clase de salida (fadeOut)
        alertaTexto.classList.remove('fade-in');
        alertaTexto.classList.add('fade-out');
        alertaBtn.classList.remove('fade-in');
        alertaBtn.classList.add('fade-out');
		
		alertaContainer.style.display = 'flex';

        // Oculta el contenedor después de la animación de salida
        setTimeout(() => {
            alertaContainer.style.display = 'none';
        }, 500); // Duración del fadeOut (coincide con la animación CSS)
    };
}

// Ejemplo de uso: Mostrar una alerta al cargar la página
window.onload = function() {
    showAlert(`
	<h3>¡Bienvenido al formulario de restaurantes y bares!<h3>
	<p>Antes de hacer nada deben darle una estrella a <a href="https://github.com/Retype15/ICD_restaurants_and_bars" target="_blank">este repositorio en GitHub</a>, gracias :3</p>
	`);
};

// Crear el mapa
function initMap() {
    // Crear el mapa centrado en una ubicación inicial
    map = L.map('map').setView([23.1136, -82.3666], 12); // Coordenadas iniciales de Cuba, por ejemplo.

    // Añadir una capa de mapa base usando OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Configurar el marcador al hacer clic en el mapa
    map.on('click', function(event) {
        placeMarker(event.latlng);
    });
}

//Funcion para obtener la poss del usuario y centrar el mpapa
document.getElementById('obtener_ubicacion').addEventListener('click', getUserLocation);

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const latlng = L.latLng(lat, lng);

            // Mover el mapa a la ubicación del usuario
            map.setView(latlng, 12);

            // Colocar un marcador en la ubicación del usuario
            placeMarker(latlng);
        }, function(error) {
            alert('No se pudo obtener la ubicación del usuario.');
        });
    } else {
        alert('La geolocalización no está disponible en este navegador.');
    }
}


// Colocar marcador en el mapa y obtener la ubicación
function placeMarker(latlng) {
    if (marker) {
        marker.setLatLng(latlng);  // Si ya hay un marcador, lo mueve a la nueva ubicación
    } else {
        marker = L.marker(latlng).addTo(map);  // Si no hay marcador, lo crea en la ubicación indicada
    }

    // Actualizar el campo de ubicación con las coordenadas lat, lng
    const ubicacionField = document.getElementById('ubicacion');
    ubicacionField.value = latlng.lat + ',' + latlng.lng;  // Se muestra la latitud y longitud como texto

    // Obtener la dirección de la ubicación con Nominatim (geocodificación de OpenStreetMap)
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`)
        .then(response => response.json())
        .then(data => {
            if (data && data.address) {
                // Extraer los datos de la dirección
                //const nombre = data.address.house_number || '';  // Número de la casa (ej. 158)
                const calle = data.address.road || '';  // Nombre de la calle (ej. "Lugareño")
                const consejo = data.address.suburb || data.address.neighbourhood || '';  // Barrio o consejo (si está disponible)
                const municipio = data.address.city || data.address.town || data.address.village || data.address.county || '';  // Municipio o provincia
                const provincia = data.address.state || '';  // Ciudad o estado
                const codigoPostal = data.address.postcode || '';  // Código postal
                const pais = data.address.country || '';  // País (ej. Cuba)

                // Distribuir los datos en los campos correspondientes del formulario
                //document.getElementById('nombre').value = nombre || ''; // Número o nombre de la casa
                document.getElementById('calle').value = calle || ''; // Nombre de la calle
                document.getElementById('consejo').value = consejo || ''; // Barrio o consejo
                document.getElementById('municipio').value = municipio || ''; // Municipio
                document.getElementById('provincia').value = provincia || ''; // Ciudad
                document.getElementById('codigo_postal').value = codigoPostal || ''; // Código postal
                document.getElementById('pais').value = pais || ''; // País

                // Si no se encuentra alguno de estos valores, se puede mostrar un mensaje por defecto
                if (!municipio) {
                    document.getElementById('municipio').value = 'Municipio no disponible';
                }
				if (!calle) {
                    document.getElementById('calle').value = 'Calle no disponible';
                }
                if (!consejo) {
                    document.getElementById('consejo').value = 'Consejo no disponible';
                }
                if (!provincia) {
                    document.getElementById('provincia').value = 'Ciudad no disponible';
                }
                if (!codigoPostal) {
                    document.getElementById('codigo_postal').value = 'Código postal no disponible';
                }
                if (!pais) {
                    document.getElementById('pais').value = 'País no disponible';
                }
            } else {
                alert('No se encontró dirección para esta ubicación.');
            }
        })
        .catch(error => {
            console.error('Error al obtener la dirección:', error);
            alert('Hubo un error al obtener la dirección.');
        });
}

// Delegación de eventos para los botones de días y métodos de pago
document.querySelectorAll('.dia').forEach(dia => {
    dia.addEventListener('click', function() {
        this.classList.toggle('selected');
    });
});

document.querySelectorAll('.metodo').forEach(metodo => {
    metodo.addEventListener('click', function() {
        this.classList.toggle('selected');
    });
});

document.querySelectorAll('.entrega').forEach(entrega => {
    entrega.addEventListener('click', function() {
        this.classList.toggle('selected');
    });
});

document.querySelectorAll('.reserva').forEach(reserva => {
    reserva.addEventListener('click', function() {
        this.classList.toggle('selected');
    });
});

document.querySelectorAll('.amenidad').forEach(amenidad => {
    amenidad.addEventListener('click', function() {
        this.classList.toggle('selected');
    });
});

// Delegación de eventos para los botones de productos
document.getElementById('menu_container').addEventListener('click', function(event) {
    if (event.target.classList.contains('toggle-producto')) {
        const body = event.target.closest('.producto').querySelector('.producto-body');
        body.classList.toggle('active');
        event.target.textContent = body.classList.contains('active') ? '▲' : '▼';
    }
    if (event.target.classList.contains('remove-producto')) {
        event.target.closest('.producto').remove();
		actualizarOpcionesClientes();
    }
});

document.getElementById('client_container').addEventListener('click', function(event) {
    if (event.target.classList.contains('toggle-client')) {
        const body = event.target.closest('.client').querySelector('.client-body');
        body.classList.toggle('active');
        event.target.textContent = body.classList.contains('active') ? '▲' : '▼';
    }
    if (event.target.classList.contains('remove-client')) {
        event.target.closest('.client').remove();
		actualizarOpcionesClientes();
    }
});

// Actualización dinámica del nombre del producto en el encabezado
document.getElementById('client_container').addEventListener('input', function(event) {
    if (event.target.name === 'client_nombre') {
        const header = event.target.closest('.client').querySelector('.client-nombre');
        header.textContent = event.target.value || 'Nuevo Cliente';
    }
});

let productoIDCounter = 1; // Contador global para generar IDs únicos

// Función para actualizar las opciones de los productos más consumidos en todos los clientes
function actualizarOpcionesClientes() {
    const menuContainer = document.getElementById('menu_container');
    const clientes = document.querySelectorAll('.client');

    // Obtener todos los nombres de productos y sus IDs
    const productos = menuContainer.querySelectorAll('.producto');
    const opcionesPlatos = Array.from(productos).map((producto) => {
        const productoID = producto.getAttribute('data-id'); // ID único del producto
        const nombrePlato = producto.querySelector('[name="producto_nombre"]').value || `Plato ${productoID}`;
        return { id: productoID, text: nombrePlato };
    });

    // Actualizar el campo client_preferences en cada cliente
    clientes.forEach((cliente) => {
        const selectPreferences = cliente.querySelector('[name="client_preferences"]');

        // Guardar la opción seleccionada previamente
        const opcionSeleccionada = selectPreferences.value;

        // Limpiar las opciones existentes
        selectPreferences.innerHTML = '<option value="0">Sin preferencias</option>';

        // Agregar las nuevas opciones basadas en los productos
        opcionesPlatos.forEach(opcion => {
            const option = document.createElement('option');
            option.value = opcion.id;
            option.textContent = opcion.text;
            selectPreferences.appendChild(option);
        });

        // Restaurar la opción seleccionada si aún existe
        if (opcionesPlatos.some(opcion => opcion.id === opcionSeleccionada)) {
            selectPreferences.value = opcionSeleccionada;
        } else {
            // Si la opción ya no existe, establecer en "Sin preferencias"
            selectPreferences.value = "0";
        }
    });
}

// Actualización dinámica del nombre del producto en el encabezado
document.getElementById('menu_container').addEventListener('input', function(event) {
    if (event.target.name === 'producto_nombre') {
        const header = event.target.closest('.producto').querySelector('.producto-nombre');
        header.textContent = event.target.value || 'Nuevo Plato';
		actualizarOpcionesClientes();
    }
});

// Añadir nuevo producto
document.getElementById('add_producto').addEventListener('click', function() {
    const productoContainer = document.createElement('div');
    productoContainer.classList.add('producto');
	
	// Asignar un ID único al producto
    const productoID = parseInt(productoIDCounter++);
    productoContainer.setAttribute('data-id', productoID);
	
    productoContainer.innerHTML = `
        <div class="producto-header">
            <span class="producto-nombre">Nuevo Producto</span>
            <button type="button" class="toggle-producto">▼</button>
            <button type="button" class="remove-producto">Eliminar</button>
        </div>
        <div class="producto-body">
            <label for="producto_nombre">Nombre del Producto:</label>
            <input type="text" name="producto_nombre" placeholder="Nombre comun del producto aquí..." required>

            <label for="producto_precio">Precio:</label>
            <input type="number" name="producto_precio" placeholder="Precio aquí..." required>
			
            <label for="tipo_plato">Tipo de plato:</label>
                <select id="tipo_plato" name="tipo_plato" required>
					<option value="" disabled selected>Seleccione una opción</option>
                    <option value="entrante">Entrante</option>
                    <option value="principal">Plato principal</option>
                    <option value="acompanante">Acompañante</option>
                    <option value="postre">Postre</option>
                    <option value="bebida">Bebida</option>
                    <option value="otro">Otro</option>
                </select><br>			
        </div>
    `;
    document.getElementById('menu_container').appendChild(productoContainer);
	
	actualizarOpcionesClientes();
});

//Anadir nuevos clientes
document.getElementById('add_client').addEventListener('click', function() {
    const clientContainer = document.createElement('div');
    clientContainer.classList.add('client');
    clientContainer.innerHTML = `
        <div class="client-header">
            <span class="client-nombre">Nuevo Cliente</span>
            <button type="button" class="toggle-client">▼</button>
            <button type="button" class="remove-client">Eliminar</button>
        </div>
        <div class="client-body">
            <label for="producto_nombre">Nombre del Cliente:</label>
            <input type="text" name="client_nombre" placeholder="Ej. Julio Cruz Bermudez" required>
			
			<label for="client_edad">Edad:</label>
			<input type="number" name="client_edad" placeholder="Edad aquí" required>
			
			<label for="client_genero">Genero del cliente:</label>
			<select id="client_genero" name="client_genero" required>
                <option value="" disabled selected hidden>Seleccione una opción</option>
				<option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
                <option value="No decir">Prefiero no decir</option>
            </select>

			<label for="client_frec_visitas">Frecuencia de visitas:</label>
			<select id="client_frec_visitas" name="client_frec_visitas" required>
                <option value="" disabled selected hidden>Seleccione una opción</option>
				<option value="Primera vez">Primera vez</option>
                <option value="Ocasionalmente">Ocasionalmente (1-2 veces al mes)</option>
                <option value="Regularmente">Regularmente (1-2 veces a la semana)</option>
                <option value="Frecuentemente">Frecuentemente (más de 2 veces a la semana)</option>
            </select>
			
			<label for="client_pref_alim">Preferencias alimentarias:</label>
			<select id="client_pref_alim" name="client_pref_alim" required>
				<option value="Sin preferencias">Sin preferencias especiales</option>
                <option value="Vegetariano">Vegetariano</option>
                <option value="Vegano">Vegano</option>
                <option value="Sin gluten">Sin gluten</option>
                <option value="Sin lactosa">Sin lactosa</option>
                <option value="Otros">Otros</option> 
            </select>
			
			<label for="client_gasto">Gasto promedio por visita:</label>
			<input type="number" name="client_gasto" placeholder="El gasto promedio de dinero por visita aproximado." required>
			
			<label for="client_preferences">Seleccione el producto que mas consume:</label>
			<select id="client_preferences" name="client_preferences" required>
				<option value="0">Sin preferencias</option>
			</select>
			
			<label for="client_general_calif">Calificacion general:</label>
			<select id="client_general_calif" name="client_general_calif" required>
				<option value="" disabled selected hidden>Seleccione una opción</option>
				<option value="1">1 estrella (Muy malo)</option>
                <option value="2">2 estrellas (Malo)</option>
                <option value="3">3 estrellas (Regular)</option>
                <option value="4">4 estrellas (Bueno)</option>
                <option value="5">5 estrellas (Excelente)</option>
            </select>			
			<label for="client_recomendado">Recomendarias este lugar a otros?:</label>
			<select id="client_recomendado" name="client_recomendado" required>
				<option value="" disabled selected hidden>Seleccione una opción</option>
				<option value="0">No</option>
                <option value="1">Si</option>
            </select>
			
        </div>
    `;
    document.getElementById('client_container').appendChild(clientContainer);
	

    // Actualizar las opciones del cliente recién agregado
    actualizarOpcionesClientes();
});

// Captura del formulario para crear el archivo JSON
document.getElementById('localForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Recoger datos seleccionados
    const diasOperacion = Array.from(document.querySelectorAll('.dia.selected')).map(el => el.getAttribute('data-dia'));
    const metodosPago = Array.from(document.querySelectorAll('.metodo.selected')).map(el => el.getAttribute('data-metodo'));
    const opcionesEntrega = Array.from(document.querySelectorAll('.entrega.selected')).map(el => el.getAttribute('data-entrega'));
    const opcionesReserva = Array.from(document.querySelectorAll('.reserva.selected')).map(el => el.getAttribute('data-reserva'));
    const opcionesAmenidad = Array.from(document.querySelectorAll('.amenidad.selected')).map(el => el.getAttribute('data-amenidad'));
    
    // Guardar los datos de los productos
    const productos = Array.from(document.querySelectorAll('.producto')).map(producto => ({
        id: producto.getAttribute('data-id'),
        nombre: producto.querySelector('[name="producto_nombre"]').value,
        precio: parseFloat(producto.querySelector('[name="producto_precio"]').value),
        tipo: producto.querySelector('[name="tipo_plato"]').value
    }));

    // Guardar Datos de los clientes
    const clients = Array.from(document.querySelectorAll('.client')).map(client => ({
        nombre: client.querySelector('[name="client_nombre"]').value,
        edad: parseInt(client.querySelector('[name="client_edad"]').value),
        genero: client.querySelector('[name="client_genero"]').value,
        frec_visitas: client.querySelector('[name="client_frec_visitas"]').value,
        pref_alimentaria: client.querySelector('[name="client_pref_alim"]').value,
        gasto: parseInt(client.querySelector('[name="client_gasto"]').value),
        client_preferences: parseInt(client.querySelector('[name="client_preferences"]').value),
        general_calif: parseInt(client.querySelector('[name="client_general_calif"]').value),
        recomendado: parseInt(client.querySelector('[name="client_recomendado"]').value)
    }));

    const localData = {
        nombre: document.getElementById('nombre').value,
        telefono: document.getElementById('telefono').value,
        correo_electronico: document.getElementById('correo').value,
        pagina_web: document.getElementById('pagina_web').value,
        tipo_establecimiento: document.getElementById('tipo_establecimiento').value,
        tipo_negocio: document.getElementById('tipo_negocio').value,
        tipo_cocina: document.getElementById('tipo_cocina').value,
        horario: {
            apertura: document.getElementById('horario_apertura').value,
            cierre: document.getElementById('horario_cierre').value,
            dias_operacion: diasOperacion
        },
        capacidad: parseInt(document.getElementById('capacidad').value),
        opciones_reserva: opcionesReserva,
        opciones_entrega: opcionesEntrega,
        acc_level: document.getElementById('acc_level').value,
        metodos_pago: metodosPago,
        promociones_descuentos: document.getElementById('promociones_descuentos').value,
        calif_promedio: parseFloat(document.getElementById('calif_promedio').value),
        numero_resenas: parseInt(document.getElementById('numero_resenas').value),
        opciones_amenidad: opcionesAmenidad,
        facebook: document.getElementById('facebook').value,
        instagram: document.getElementById('instagram').value,
        x: document.getElementById('x').value,
        menu: productos,
        clientes: clients,
        ubicacion: {
            calle: document.getElementById('calle').value,
            consejo: document.getElementById('consejo').value,
            municipio: document.getElementById('municipio').value,
            provincia: document.getElementById('provincia').value,
            codigo_postal: document.getElementById('codigo_postal').value,
            pais: document.getElementById('pais').value,
            coordenadas: document.getElementById('ubicacion').value
        }
    };
    
    // Preparar los datos JSON
    municipio = document.getElementById('municipio').value;
    localName = localData.nombre.replace(/\s+/g, '_').toLowerCase();
    fileName = `${localName}.json`;

    const data = {
        'archive_name': `${municipio}/${fileName}`,
        'json_text': JSON.stringify(localData),
    };

    const imageFiles = document.querySelectorAll('.previewContainer img'); // Asegúrate de que las imágenes estén en elementos <img>

    const formData = new FormData();
    formData.append('json', new Blob([JSON.stringify(data)], { type: 'application/json' }), fileName);

    // Añadir las imágenes al FormData
    imageFiles.forEach((img, index) => {
        const imageFile = img.file; // Verifica si img tiene el archivo original
        const imageName = `${localName}_${index + 1}.jpg`; // El nombre del archivo será el mismo que el del JSON + el contador
        formData.append('images', imageFile, imageName); // Añadir imagen con el nombre adecuado
    });

    try {
        // Usamos window.location.origin para obtener la URL base
        const apiUrl = `${window.location.origin}/api/save-json`;

        // Enviar los datos y las imágenes al servidor usando la URL base detectada
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
        });

        // Intentar leer la respuesta como texto
        const textResponse = await response.text();

        try {
            const result = JSON.parse(textResponse); // Intentar analizar la respuesta como JSON
            if (response.ok) {
                showAlert(`
                    <h3>Éxito</h3>
                    <p>El archivo se ha subido correctamente.</p>
                    <p>URL del Blob: <a href="${result.blob.url}" target="_blank">${result.blob.url}</a></p>
                `);
            } else {
                showAlert(`
                    <h3>Error</h3>
                    <p>${result.error}</p>
                `);
            }
        } catch (error) {
            showAlert(`
                <h3>Error al procesar la respuesta</h3>
                <p>No se pudo analizar la respuesta como JSON.</p>
                <p>Respuesta del servidor: ${textResponse}</p>
            `);
        }
    } catch (error) {
        showAlert(`
            <h3>Error</h3>
            <p>No se pudo conectar al servidor. Intenta de nuevo más tarde.</p>
        `);
    }
});


	// Cargar Leaflet.js al finalizar la carga de la página
window.addEventListener('load', function() {
    initMap();
});

// LOGICA DE LAS IMAGENES!
document.addEventListener('DOMContentLoaded', () => {
  const selectImagesInput = document.getElementById('selectImagesInput');
  const selectImagesButton = document.getElementById('selectImagesButton');
  const capturePhotoInput = document.getElementById('capturePhotoInput');
  const capturePhotoButton = document.getElementById('capturePhotoButton');
  const previewContainer = document.getElementById('previewContainer');
  const imageModal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const closeModalButton = document.getElementById('closeModalButton');

  // Almacena las imágenes seleccionadas
  const selectedImages = [];

  // Botón para seleccionar imágenes desde el dispositivo
  selectImagesButton.addEventListener('click', () => {
    selectImagesInput.click();
  });

  // Botón para capturar una foto
  capturePhotoButton.addEventListener('click', () => {
    capturePhotoInput.click();
  });

  // Manejar selección de imágenes desde el dispositivo
  selectImagesInput.addEventListener('change', (event) => {
    Array.from(event.target.files).forEach((file) => {
      addImage(file);
    });
  });

  // Manejar captura de fotos
  capturePhotoInput.addEventListener('change', (event) => {
    Array.from(event.target.files).forEach((file) => {
      addImage(file);
    });
  });

  // Agregar una imagen al contenedor de previsualización
  function addImage(file) {
    if (!file || selectedImages.find((img) => img.name === file.name)) return;

    selectedImages.push(file);
    const imageUrl = URL.createObjectURL(file);

    const previewDiv = document.createElement('div');
    previewDiv.classList.add('image-preview');
    previewDiv.style.position = 'relative';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = file.name;
    img.style.cursor = 'pointer';
    img.style.width = '120px';
    img.style.height = 'auto';
    img.style.border = '1px solid #ddd';
    img.style.borderRadius = '10px';

    const fileInfo = document.createElement('p');
    fileInfo.textContent = `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
    fileInfo.style.fontSize = '12px';
    fileInfo.style.marginTop = '5px';
    fileInfo.style.textAlign = 'center';

    const removeButton = document.createElement('button');
    removeButton.textContent = 'X';
    removeButton.style = `
      position: absolute;
      top: 5px;
      right: 5px;
      background: red;
      color: white;
      border: none;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      cursor: pointer;
    `;

    removeButton.addEventListener('click', () => {
      selectedImages.splice(selectedImages.indexOf(file), 1);
      previewDiv.remove();
    });

    img.addEventListener('click', () => {
      modalImage.src = imageUrl;
      imageModal.style.display = 'flex';
    });

    previewDiv.appendChild(img);
    previewDiv.appendChild(fileInfo);
    previewDiv.appendChild(removeButton);
    previewContainer.appendChild(previewDiv);
  }

  // Cerrar el modal de previsualización
  closeModalButton.addEventListener('click', () => {
    imageModal.style.display = 'none';
  });
});

// TERMINA AQUI LA LOGICA DE LAS IMAGENES

// Aleatorización de emojis después de cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.background-emojis');
    const emojis = container.innerHTML;

    // Duplicar emojis para llenar el fondo
    for (let i = 0; i < 4; i++) {
        container.innerHTML += emojis;
    }

    document.querySelectorAll('.emoji').forEach(emoji => {
        const randomTop = Math.floor(Math.random() * 100);
        const randomLeft = Math.floor(Math.random() * 100);
        const randomDuration = Math.random() * 10 + 5;

        emoji.style.top = randomTop + '%';
        emoji.style.left = randomLeft + '%';
        emoji.style.animationDuration = randomDuration + 's';
    });
});