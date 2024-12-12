import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Obtener el parámetro de la ruta de la carpeta actual
    const currentPath = req.nextUrl.searchParams.get('path') || '';

    const response = await list({ prefix: currentPath }); // Fetch the list of blobs

    // Validar la estructura de la respuesta
    if (!response || !Array.isArray(response.blobs)) {
      throw new Error('Invalid response from Blob Store: Missing or invalid "blobs" property');
    }

    // Mapear los blobs para extraer nombre, URL y tipo (archivo o carpeta)
    const files = response.blobs.map(blob => {
      const isFolder = blob.pathname.endsWith('/');
      return {
        name: isFolder ? blob.pathname.replace(currentPath, '').replace('/', '') : blob.pathname.split('/').pop(),
        url: isFolder ? null : blob.downloadUrl,
        type: isFolder ? 'folder' : 'file',
      };
    });

    return NextResponse.json(files); // Return JSON response with the files
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files', details: error.message },
      { status: 500 }
    );
  }
}
