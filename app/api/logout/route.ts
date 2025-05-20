import message from '@/globalHandler/customMessage';
import { withErrorHandler } from '@/globalHandler/errorHandler';
import { HttpError } from '@/globalHandler/httpError';
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers';

export const POST = withErrorHandler(
    async (req) => {

        try {

            const cookieStore = cookies();
            (await cookieStore).set({
                name: "token",
                value: "",
                httpOnly: true,
                path: "/",
                maxAge: 0, // 3 days
                sameSite: "strict",
                secure: true,
            });

            return NextResponse.json(message("Logout successfully", 200), { status: 200 })

        } catch (error: any) {
            throw new HttpError(error.message, error.status || 500);
        }

    }
)

