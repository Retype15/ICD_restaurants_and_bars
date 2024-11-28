import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'tu_secreto_seguro';

export function authMiddleware(req) {
  const token = req.cookies.get('authToken');

  if (!token) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Agregar el usuario al request
    return NextResponse.next();
  } catch (err) {
    return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 403 });
  }
}
