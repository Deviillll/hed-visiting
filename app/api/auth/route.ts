
import { withErrorHandler } from '@/globalHandler/errorHandler';
import { HttpError } from '@/globalHandler/httpError';

import { getVerifiedUser } from '@/utils/token/jwtToken';
import { NextResponse } from 'next/server'


export const GET = withErrorHandler(
    async (req) => {

        try {

            const decoded = await getVerifiedUser();
            const userId = decoded._id;
            const role = decoded.role;
            const name = decoded.name

            const credentials = {
                userId,
                role,
                name
            }


            return NextResponse.json(credentials, { status: 200 })

        } catch (error: any) {
            throw new HttpError(error.message, error.status || 500);
        }

    }
)

