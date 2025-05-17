

import { NextRequest, NextResponse } from 'next/server';
import { getVerifiedUser } from './utils/token/jwtToken';


export async function middleware(request: NextRequest) {


  try {
    await getVerifiedUser();
    
    return NextResponse.next();

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unauthorized: Unknown error';
    return NextResponse.json({ message }, { status: 401 });
  }
}


export const config = {
  matcher: ['/api/institute/:path*', '/api/department/:path*', '/api/class/:path*', '/api/employee/:path*'],
};

