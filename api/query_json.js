import { NextResponse } from 'next/server.js';
import { POST as saveJson } from './api/save-json.js';

export async function POST(req) {
  try {
    const { responseSchema, selectedRoute, userName } = await req.json();

    if (!responseSchema || !selectedRoute || !userName) {
      return NextResponse.json(
        { error: 'Faltan parámetros en la solicitud' },
        { status: 400 }
      );
    }

    console.log(`Json: ${responseSchema}\nselected Route: ${selectedRoute}\nuser name: ${userName}`);

    // Crear el contenido del archivo JSON
    const jsonContent = JSON.stringify({
      responseSchema,
      selectedRoute,
      userName,
    });

    // Configurar el nombre del archivo
    const archiveName = `users_query/${userName}.json`;

    // Llamar al método para guardar el JSON como archivo
    const saveResponse = await saveJson({
      json_text: jsonContent,
      archive_name: archiveName,
    });

    // Manejar la respuesta de guardar el archivo
    if (!saveResponse.success) {
      return NextResponse.json(
        { error: 'Error al guardar el archivo JSON' },
        { status: 500 }
      );
    }

    // Continuar con el procesamiento si es necesario
    const processResult = await processFiles(responseSchema, userName, selectedRoute);

    return NextResponse.json({
      message: 'Archivo JSON guardado y procesado exitosamente',
      processResult,
      blob: saveResponse.blob,
    });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud', details: error.message },
      { status: 500 }
    );
  }
}
