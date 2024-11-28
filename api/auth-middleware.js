import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'mi_secreto_seguro'; // Debe coincidir con el definido en `validate-password.js`

export async function middleware(request) {
  // Leer la cookie del token
  const token = request.cookies.get('authToken');

  // Si no hay token, redirigir a la página de inicio de sesión
  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    // Verificar el token JWT
    jwt.verify(token, JWT_SECRET);

    // Si el token es válido, permitir el acceso
    return NextResponse.next();
  } catch (error) {
    // Si el token no es válido o ha expirado, redirigir a la página de inicio de sesión
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/dashboard'], // Aplica este middleware solo a rutas específicas
};
