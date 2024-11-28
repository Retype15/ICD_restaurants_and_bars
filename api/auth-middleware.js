import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'mi_secreto_seguro';

export async function middleware(request) {
  const token = request.cookies.get('authToken');

  if (!token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/dashboard','index.html','index2.html'], // Aplica este middleware solo a rutas específicas
};
