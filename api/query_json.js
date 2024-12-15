import { NextResponse } from 'next/server.js';

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

    // Llamar al endpoint para guardar el archivo JSON
    const response = await fetch('/api/save-json.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        json_text: jsonContent,
        archive_name: archiveName,
      }),
    });

    // Validar la respuesta del fetch
    if (!response.ok) {
      const errorResponse = await response.json();
      console.error('Error al guardar el archivo JSON:', errorResponse);
      return NextResponse.json(
        { error: 'Error al guardar el archivo JSON', details: errorResponse },
        { status: 500 }
      );
    }

    const saveResponse = await response.json();

    // Continuar con el procesamiento si el archivo se guarda exitosamente
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
