import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json(); // Leer el JSON enviado
    const { json_text, archive_name } = body;

    if (!json_text || !archive_name) {
      return NextResponse.json(
        { error: 'Missing json_text or archive_name in request body' },
        { status: 400 }
      );
    }

    // Subir el contenido como un archivo al Blob Store
    const blob = await put(archive_name, json_text, {
      access: 'public',
    });

    return NextResponse.json({ success: true, blob });
  } catch (error) {
    console.error('Error al procesar el archivo de texto:', error); // Log detallado
    return NextResponse.json(
      {
        error: 'Error al subir el archivo de texto',
        details: error.message || 'Sin detalles adicionales',
      },
      { status: 500 }
    );
  }
}
