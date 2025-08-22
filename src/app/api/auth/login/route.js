import { NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

export async function POST(request) {
  try {
    const { password } = await request.json();
    
    if (!password) {
      return NextResponse.json(
        { error: 'Contraseña requerida' },
        { status: 400 }
      );
    }
    
    if (password === ADMIN_PASSWORD) {
      // Crear respuesta con cookie segura
      const response = NextResponse.json({ success: true });
      
      // Establecer cookie segura
      response.cookies.set('admin_token', ADMIN_SECRET_KEY, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 horas
        path: '/'
      });
      
      return response;
    } else {
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}