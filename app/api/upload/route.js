import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json(
      { error: 'Falta el parámetro "filename".' },
      { status: 400 }
    );
  }

  try {
    // Subir el archivo al Blob Store
    const blob = await put(filename, request.body, {
      access: 'public', // Hacer que el archivo sea público
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    return NextResponse.json(
      { error: 'Error al subir el archivo.' },
      { status: 500 }
    );
  }
}
