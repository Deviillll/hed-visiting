
import message from '@/globalHandler/customMessage';
import { withErrorHandler } from '@/globalHandler/errorHandler';
import { HttpError } from '@/globalHandler/httpError';
import connectDb from '@/lib/db'
import { NextResponse } from 'next/server'
import bcrypt from "bcryptjs";
import User from '@/lib/models/userModel'
import { generateToken } from '@/utils/token/jwtToken'
import { cookies } from "next/headers";



export const POST = withErrorHandler(
    async (req) => {

        try {
            await connectDb()
            const { email, password, } = await req.json()

            if (!email || !password) {
                throw new HttpError("Please fill all fields", 400);
            }
            const lowerCaseEmail = email.toLowerCase();
            const userExist = await User.findOne({ email: lowerCaseEmail });
            if (!userExist) {
                throw new HttpError("User not found", 404);
            }
            const isPasswordMatch = await bcrypt.compare(password, userExist.password);
            if (!isPasswordMatch) {
                throw new HttpError("Invalid password", 401);
            }
            const isverified = userExist.isverified;
            const isDeleted = userExist.isDeleted;
            const isactive = userExist.status;

            if (isDeleted) {
                throw new HttpError("User not found", 404);
            }
            // if (!isverified) {
            //     throw new HttpError("please verify your email", 403);
            // }

            if (!isactive) {
                throw new HttpError("Your account is not active", 403);

            }

            const token = generateToken(userExist)
            const cookieStore = cookies();
            (await cookieStore).set({
                name: "token",
                value: token,
                httpOnly: true,
                path: "/",
                maxAge: 60 * 60, // 1 hour
                sameSite: "strict",
                secure: true,
            });

            return NextResponse.json(
                { message: "Login successful", status: 200, userName: userExist.name, token: token },
                {
                    status: 200,
                    // headers: {
                    //     "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict; Secure`,
                    // },
                }
            );

        } catch (error: any) {
            throw new HttpError(error.message, error.status || 500);
        }
    }
)

