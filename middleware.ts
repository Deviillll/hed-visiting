import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {

  const response = NextResponse.next();
  response.headers.append('Access-Control-Allow-Credentials', "true")
  response.headers.append('Access-Control-Allow-Origin', '*') // replace this your actual origin
  response.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
  response.headers.append(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login' || path === '/register';

  const token = (await cookies()).get('token')?.value;


  try {
    if (!token && !isPublicPath) {
      // Not logged in and trying to access protected route
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token) {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, secret);
    

      // Logged-in users should not access login/register
      if (isPublicPath) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Optionally: pass user data to headers
      //response.headers.set('x-user-id', String(payload._id));
      response.headers.set('x-user-role', String(payload.role || ''));
      return response;
    }

    return NextResponse.next();
  } catch (err) {
    console.error("❌ Middleware error:", err);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
export const config = {
  matcher: [
    '/api/institute/:path*',
    '/api/department/:path*',
    '/api/class/:path*',
    '/api/employee/:path*',
    '/dashboard/:path*',
    '/login',
    '/register',
    '/api/bill/:path*',
    '/api/billEntry/:path*',
    '/api/auth/:path*',
  ],
};
