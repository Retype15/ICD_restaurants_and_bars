import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData(); // Parsear el FormData recibido
    const uploadedImages = [];

    for (const [key, file] of formData.entries()) {
      // Verificar que el archivo es una instancia de Blob
      if (file instanceof Blob) {
        if (!file.name || file.size === 0) {
          console.error(`Archivo inválido: ${file.name || 'Sin nombre'} (${file.size} bytes)`);
          continue; // Ignorar archivos vacíos o sin nombre
        }

        // Leer el contenido del archivo como ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Subir la imagen al Blob Storage de Vercel
        const blob = await put(file.name, Buffer.from(arrayBuffer), {
          access: 'public',
        });

        // Agregar la información subida a la lista
        uploadedImages.push({
          key,
          originalName: file.name,
          size: file.size,
          url: blob.url, // URL pública del archivo subido
        });
      } else {
        console.warn(`Se ignoró la entrada "${key}" porque no es un archivo válido.`);
      }
    }

    // Validar si se subieron archivos
    if (uploadedImages.length === 0) {
      return NextResponse.json(
        { error: 'No se subió ningún archivo válido' },
        { status: 400 }
      );
    }

    // Respuesta de éxito con la información de los archivos subidos
    return NextResponse.json({ success: true, uploadedImages });
  } catch (error) {
    // Manejo de errores con detalles claros
    console.error('Error al procesar las imágenes:', error);
    return NextResponse.json(
      {
        error: 'Error al procesar las imágenes',
        details: error.message || 'No se pudo obtener más detalles',
      },
      { status: 500 }
    );
  }
}
