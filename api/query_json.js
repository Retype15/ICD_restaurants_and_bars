import { put } from '@vercel/blob';
import { NextResponse } from 'next/server.js';

export async function POST(req) {
  try {
    // Leer los parámetros enviados en el cuerpo de la solicitud
    const { responseSchema, selectedRoute, userName } = await req.json();

    // Validar los parámetros
    if (!responseSchema || !selectedRoute || !userName) {
      return NextResponse.json(
        { error: 'Faltan parámetros en la solicitud' },
        { status: 400 }
      );
    }

    // Crear el contenido del JSON
    const jsonContent = JSON.stringify({
      responseSchema,
      selectedRoute,
      userName,
    });

    // Configurar el nombre del archivo
    const archiveName = `_users_query/${userName}.json`;

    // Subir el archivo al Blob Store
    const blob = await put(archiveName, jsonContent, {
      access: 'public', // Opcional: si quieres que sea accesible públicamente
    });

    // Responder con éxito y datos del archivo guardado
    return NextResponse.json({
      success: true,
      message: 'Archivo JSON guardado exitosamente',
      blob,
    });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);

    // Responder con error si ocurre algún problema
    return NextResponse.json(
      { error: 'Error al procesar la solicitud', details: error.message },
      { status: 500 }
    );
  }
}
