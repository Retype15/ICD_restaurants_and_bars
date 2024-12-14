import { put } from '@vercel/blob';
import { NextResponse } from 'next/server.js';

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
    return NextResponse.json(
      { error: 'An error occurred while processing the request' },
      { status: 500 }
    );
  }
}
