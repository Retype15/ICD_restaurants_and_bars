import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image');
    const archiveName = formData.get('archive_name');

    if (!imageFile || !archiveName) {
      return NextResponse.json(
        { error: 'Missing image or archive_name in request body' },
        { status: 400 }
      );
    }

    // Leer el contenido del archivo de imagen
    const arrayBuffer = await imageFile.arrayBuffer();

    // Subir la imagen al Blob Store
    const blob = await put(archiveName, Buffer.from(arrayBuffer), {
      access: 'public',
    });

    return NextResponse.json({ success: true, blob });
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred while processing the image upload' },
      { status: 500 }
    );
  }
}
