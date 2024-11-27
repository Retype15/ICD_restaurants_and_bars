import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename || !request.body) {
      return NextResponse.json({ error: 'Filename and content are required' }, { status: 400 });
    }

    // Guardar el archivo en Vercel Blob
    const blob = await put(filename, request.body, {
      access: 'public',
    });

    return NextResponse.json({ message: 'File saved successfully', url: blob.url });
  } catch (error) {
    return NextResponse.json({ error: `Error saving file: ${error.message}` }, { status: 500 });
  }
}

// Configuración necesaria para las rutas de la API en Pages
export const config = {
  api: {
    bodyParser: false,
  },
};
