import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Archivo donde se almacenarán los usuarios
const USERS_ARCHIVE = 'users.json';

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'La contraseña es requerida' },
        { status: 400 }
      );
    }

    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generar un ID único para el usuario
    const userId = `user_${Date.now()}`;

    // Crear el usuario
    const newUser = { id: userId, password: hashedPassword };

    // Obtener datos actuales del archivo JSON (si existe)
    let users = [];
    try {
      const response = await fetch(`https://3kd8fds38lvbrrcg.public.blob.vercel-storage.com/${USERS_ARCHIVE}`);
      if (response.ok) {
        users = await response.json();
      }
    } catch (error) {
      // Si el archivo no existe, continuar con la creación
    }

    // Agregar el nuevo usuario
    users.push(newUser);

    // Guardar el archivo actualizado en el Blob Store
    const blob = await put(USERS_ARCHIVE, JSON.stringify(users, null, 2), {
      access: 'private',
    });

    return NextResponse.json({ success: true, userId, blob });
  } catch (error) {
    return NextResponse.json(
      { error: 'Ocurrió un error al procesar la solicitud' },
      { status: 500 }
    );
  }
}
