import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parsear los datos del formulario
    const formData = await request.formData();

    // Obtener la ruta del formulario
    const savePath = formData.get('path');
    if (!savePath) {
      return NextResponse.json(
        { error: 'No se proporcionó la ruta donde guardar las imágenes.' },
        { status: 400 }
      );
    }

    const uploadedImages = [];
    let counter = 1; // Contador para los nombres de las imágenes

    for (const entry of formData.entries()) {
      const [key, file] = entry;

      // Ignorar el campo "path" y asegurarse de que la entrada sea una imagen válida
      if (key === 'path' || !(file instanceof Blob)) {
        continue;
      }

      // Crear un nombre de archivo único con el formato "nombre_#.ext"
      const extension = file.name.split('.').pop(); // Extraer la extensión del archivo
      const fileName = `${savePath}/nombre_${counter}.${extension}`;

      // Leer el contenido del archivo como ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Subir el archivo al Blob Storage de Vercel
      const blob = await put(fileName, Buffer.from(arrayBuffer), {
        access: 'public',
      });

      // Guardar la información de la imagen subida
      uploadedImages.push({
        key,
        originalName: file.name,
        savedName: fileName,
        size: file.size,
        url: blob.url, // URL pública del archivo subido
      });

      counter++; // Incrementar el contador para el siguiente archivo
    }

    // Validar si se subieron imágenes
    if (uploadedImages.length === 0) {
      return NextResponse.json(
        { error: 'No se subió ninguna imagen válida.' },
        { status: 400 }
      );
    }

    // Responder con éxito y lista de imágenes subidas
    return NextResponse.json({ success: true, uploadedImages });
  } catch (error) {
    // Manejo de errores con detalles claros
    console.error('Error al procesar las imágenes:', error);
    return NextResponse.json(
      {
        error: 'Error al subir las imágenes.',
        details: error.message || 'No se pudo obtener más detalles.',
      },
      { status: 500 }
    );
  }
}
