import { jwtVerify, SignJWT } from 'jose';
import { v4 as uuidv4 } from 'uuid';


import { cookies } from 'next/headers';


const JWT_SECRET = process.env.JWT_SECRET;
const encoder = new TextEncoder();
const secret = encoder.encode(JWT_SECRET);

export async function generateToken({ _id, name, role }: { _id: string; name: string; role: string }) {
  return await new SignJWT({ _id, name, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('3d')
    .sign(secret);
}



export async function getVerifiedUser() {
  const token = (await cookies()).get('token')?.value;
  
  if (!token) {
    throw new Error('Unauthorized: No token provided');
  }
  
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { _id: string; name: string; role: string; iat: number; exp: number };
  } catch (err) {
    throw new Error(err as any );
  }
}

 export const generateRandomString =()=>{
  return uuidv4();
 }












// import jwt from "jsonwebtoken";
// const generateToken = ({ _id, email, roleId },role) => {
//   return jwt.sign({ _id, email, roleId,role }, JWT_SECRET, {
//     expiresIn: "3d",
//   });
// };

// export async function verifyToken(token) {
  //   try {
    //     const { payload } = await jwtVerify(token, secret);
    
    //     return payload;
    //   } catch (err) {
      //     throw err;
      //   }
      // }
      
// lib/auth/verifyToken.ts