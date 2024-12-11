import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const uploadedImages = [];

    for (const entry of formData.entries()) {
      const [key, file] = entry;

      if (file instanceof Blob) {
        const arrayBuffer = await file.arrayBuffer();
        const blob = await put(file.name, Buffer.from(arrayBuffer), {
          access: 'public',
        });
        uploadedImages.push({ key, blob });
      }
    }

    return NextResponse.json({ success: true, uploadedImages });
  } catch (error) {
    console.error('Error al procesar las imágenes:', error);
    return NextResponse.json(
      {
        error: 'Error al subir las imágenes',
        details: error.message || 'Sin detalles adicionales',
      },
      { status: 500 }
    );
  }
}
