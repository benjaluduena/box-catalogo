import { NextResponse } from 'next/server';
import { rateLimit, getRealIP } from './lib/rateLimit';

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = getRealIP(request);
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000;
    
    const result = rateLimit(ip, maxRequests, windowMs);
    
    if (!result.success) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          resetTime: result.resetTime
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
            'Retry-After': Math.round((result.resetTime - Date.now()) / 1000).toString()
          }
        }
      );
    }
    
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
    
    return response;
  }
  
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get('admin_token');
    const adminSecret = process.env.ADMIN_SECRET_KEY;
    
    if (!adminToken || adminToken.value !== adminSecret) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/admin/dashboard/:path*', '/admin/neumaticos/:path*', '/admin/marcas/:path*', '/admin/tipos-vehiculo/:path*']
};