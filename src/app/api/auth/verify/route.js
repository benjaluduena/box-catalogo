import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY;

export async function GET() {
  try {
    const cookieStore = cookies();
    const adminToken = cookieStore.get('admin_token');
    
    if (!adminToken || adminToken.value !== ADMIN_SECRET_KEY) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error('Error en verificación:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}