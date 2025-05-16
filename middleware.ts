
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './utils/token/jwtToken';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const token = (await cookies()).get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized: No token' }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);

    const response = NextResponse.next();
    

    // If you want to pass user ID from token to the next request
    if (decoded && decoded._id) {
      response.headers.set('x-user-id', decoded._id as string);
      response.headers.set('x-user-role', decoded.roleId as string);
    }

    return response;
  } catch (err) {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
}


export const config = {
  matcher: ['/api/institute/:path*', '/api/department/:path*', '/api/class/:path*'],
};

