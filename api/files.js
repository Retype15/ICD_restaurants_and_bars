import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const blobs = await list(); // Intenta listar los blobs disponibles

    // Validación para evitar errores si la estructura de los datos es incorrecta
    if (!blobs || !Array.isArray(blobs.items)) {
      throw new Error('Invalid response from Blob Store: Missing or invalid "items" property');
    }

    // Construye la lista de archivos
    const files = blobs.items.map(blob => ({
      name: blob.key, // Nombre del archivo
      url: blob.url, // URL pública para descargar el archivo
    }));

    return NextResponse.json(files); // Respuesta JSON con los archivos
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files', details: error.message },
      { status: 500 }
    );
  }
}
