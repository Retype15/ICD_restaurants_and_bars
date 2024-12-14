import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';
const path = require('path');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Función para obtener la lista de archivos de la ruta seleccionada
async function listFiles(selectedRoute) {
  try {
    const response = await list();
    if (!response || !Array.isArray(response.blobs)) {
      throw new Error('Error al obtener la lista de archivos');
    }

    return response.blobs.filter(blob => blob.pathname.startsWith(selectedRoute));
  } catch (error) {
    throw new Error(`Error al listar los archivos: ${error.message}`);
  }
}

// Función para leer el contenido de un archivo (suponiendo que es un JSON)
async function readFile(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error al obtener el archivo: ${url} - Status: ${response.status}`);
      throw new Error(`Error al obtener el archivo: ${url} - Status: ${response.status}`);
    }
    
    const text = await response.text();
    return text;
  } catch (error) {
    console.error(`Error al leer el archivo: ${error.message}`);
    throw new Error(`Error al leer el archivo: ${error.message}`);
  }
}

// Función para procesar el JSON con el modelo de AI
async function processJsonWithAI(model, fileContent) {
  try {
    // Convertir fileContent a cadena si no lo es ya
    let fileString = fileContent;
    while (typeof fileString !== "string") { 
      fileString = JSON.stringify(fileString); // Formatear con sangrías para legibilidad
    }

    // Verificar que fileString no esté vacío
    if (!fileString || fileString.trim() === "") {
      console.log("El contenido del archivo está vacío después de la conversión a cadena.");		
      throw new Error("El contenido del archivo está vacío después de la conversión a cadena.");
    }

    console.log('File string:', fileString);

    // Llamar al modelo AI
    const result = await model.generateContent(...fileString);

    // Procesar la respuesta del modelo
    const response = await result.response;
    console.log(response);

    // Leer la respuesta como texto
    const responseText = await response.text();
    console.log('Response text:', responseText);

    // Intentar analizar la respuesta como JSON
    let processedData = responseText;
    try {
      processedData = JSON.parse(responseText);
    } catch (jsonError) {
      console.error(`Error al analizar JSON: ${jsonError.message}`);
      throw new Error(`La respuesta del modelo no es un JSON válido: ${responseText}`);
    }

    console.log('Processed data:', processedData);
    return processedData;
  } catch (error) {
    console.log(`Error al procesar el JSON con AI: ${error.message}`);
    throw new Error(`Error al procesar el JSON con AI: ${error.message}`);
  }
}


// Función para subir el archivo procesado al Blob Store
async function uploadToBlobStore(jsonData, archiveName) {
  try {
	const jsonString = JSON.stringify(jsonData);
	console.log(archiveName)
    const blob = await put(archiveName, jsonData, { access: 'public', contentType: 'application/json'});
    return blob;
  } catch (error) {
    throw new Error(`Error al subir el archivo al Blob Store: ${error.message}`);
  }
}

// Función para procesar los archivos de la ruta seleccionada
export async function processFiles( response_schema, userName, selectedRoute) {
  const logFilePath = `Clientes/${userName}/process_log.txt`;
  const logStream = [];
	
	const generationConfig = {
		temperature: 1,
		topP: 0.95,
		topK: 40,
		maxOutputTokens: 8192,
		responseSchema: response_schema,
		responseMimeType: "application/json",
	};
	let model;
	try{
		model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp", generationConfig});
	}catch{
	  console.error('Error en el json escrito, por favor rectificalo.');
      throw new Error('Error en el json escrito, por favor rectificalo.');
	}
	
	try {
		const files = await listFiles(selectedRoute);
  
    if (!files || files.length === 0) {
      throw new Error('No se encontraron archivos en la ruta seleccionada');
    }
    
    for (const file of files) {
      try {
        // Leer el archivo
        const fileContent = await readFile(file.url);
		//console.log(fileContent);
        // Procesar el JSON con el modelo de AI
		console.log("Hasta antes del envio todo bien...");
        const result = await processJsonWithAI(model, fileContent);
		console.log("Hasta DESPUES del envio todo bien...");
      
    
        // Subir el archivo procesado a Blob Store
		const filePath = file.pathname;
		const fileName = path.basename(filePath);
		const directoryName = path.dirname(filePath).split(path.sep).pop();
        const processedFilePath = `Clientes/${userName}/${directoryName}/${fileName}`;
        await uploadToBlobStore(result, processedFilePath);
    
        logStream.push(`Archivo procesado exitosamente: ${file.pathname}`);
      } catch (error) {
        logStream.push(`Error procesando el archivo: ${file.pathname}`);
        logStream.push(`Error: ${error.message}`);
      }
    }
    logStream.push('Proceso completado.');
  } catch (error) {
    logStream.push(`Error en el proceso general: ${error.message}`);
  }
  
    // Guardar el log en el mismo lugar
    await uploadToBlobStore(logStream.join('\n'), logFilePath);
    
    return { message: 'Proceso completado exitosamente', log: logStream.join('\n') };
}




export async function POST(req) {
    try {
        const { responseSchema, selectedRoute, userName} = await req.json();
        
        if (!responseSchema || !selectedRoute || !userName) {
            return NextResponse.json({ error: 'Faltan parámetros en la solicitud' }, { status: 400 });
        }
		console.log(`Json: ${responseSchema}\n selected Route: ${selectedRoute} \n user name: ${userName}`)
        
        const processResult = await processFiles( responseSchema, userName, selectedRoute);
        
        return NextResponse.json(processResult);
        
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      return NextResponse.json({ error: 'Error al procesar la solicitud', details: error.message }, { status: 500 });
    }
}