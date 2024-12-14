import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { put } from '@vercel/blob';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema: {},
};


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
      throw new Error(`Error al obtener el archivo: ${url}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Error al leer el archivo: ${error.message}`);
  }
}

// Función para procesar el JSON con el modelo de AI
async function processJsonWithAI(model, fileContent) {
  try {
    const result = await model.generateContent(fileContent);

    const response = await result.response;
    const processedData = await response.text();

    return JSON.parse(processedData);
  } catch (error) {
    throw new Error(`Error al procesar el JSON con AI: ${error.message}`);
  }
}

// Función para subir el archivo procesado al Blob Store
async function uploadToBlobStore(jsonData, archiveName) {
  try {
    const blob = await put(archiveName, JSON.stringify(jsonData), { access: 'public' });
    return blob;
  } catch (error) {
    throw new Error(`Error al subir el archivo al Blob Store: ${error.message}`);
  }
}

// Función para procesar los archivos de la ruta seleccionada
export async function processFiles( responseSchema, userName, selectedRoute) {
  const logFilePath = `Clientes/${userName}/process_log.txt`;
  const logStream = [];
  try {
	const objetoJSON = JSON.parse(responseSchema);
  } catch (error) {
	objetoJSON = responseSchema;
	console.error('Error de conversión:', error.message); return null;
	}
  
  generationConfig.responseSchema = objetoJSON;
  
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp", generationConfig });
  
  try {
    const files = await listFiles(selectedRoute);
  
    if (!files || files.length === 0) {
      throw new Error('No se encontraron archivos en la ruta seleccionada');
    }
    
    for (const file of files) {
      try {
        // Leer el archivo
        const fileContent = await readFile(file.url);
    
        // Procesar el JSON con el modelo de AI
        const result = await processJsonWithAI(model, JSON.stringify(fileContent));
      
    
        // Subir el archivo procesado a Blob Store
        const processedFileName = `${file.pathname}`;
        const processedFilePath = `Clientes/${userName}/${processedFileName}`;
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
        
        const processResult = await processFiles( responseSchema, userName, selectedRoute);
        
        return NextResponse.json(processResult);
        
    } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      return NextResponse.json({ error: 'Error al procesar la solicitud', details: error.message }, { status: 500 });
    }
}