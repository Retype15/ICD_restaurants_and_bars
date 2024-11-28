import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'mi_secreto_seguro';

export async function GET(request) {
  try {
    const token = request.cookies.get('authToken');

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verificar el token
    jwt.verify(token, JWT_SECRET);

    // Si es válido, devolver autenticación exitosa
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
