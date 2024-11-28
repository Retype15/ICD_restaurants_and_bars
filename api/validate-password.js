import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Contraseña predefinida (configurada en el servidor)
const PREDEFINED_PASSWORD = '1234';

// Clave secreta para firmar el token
const JWT_SECRET = 'mi_secreto_seguro';

// Tiempo de expiración del token (7 días en este caso)
const TOKEN_EXPIRATION = '7d';

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'La contraseña es requerida' },
        { status: 400 }
      );
    }

    if (password !== PREDEFINED_PASSWORD) {
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }

    const token = jwt.sign({ access: true }, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRATION,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60, // 7 días
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Ocurrió un error en el servidor' },
      { status: 500 }
    );
  }
}
