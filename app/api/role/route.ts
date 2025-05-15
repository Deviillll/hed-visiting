import message from '@/globalHandler/customMessage';
import { withErrorHandler } from '@/globalHandler/errorHandler';
import { HttpError } from '@/globalHandler/httpError';
import connectDb from '@/lib/db'
import Role from '@/lib/models/roleModel'
import {NextResponse } from 'next/server'


export const POST = withErrorHandler(
    async (req) => {

    try {
        await connectDb()
        const {role} = await req.json()
        const roleExists = await Role.findOne({ role });
        if(roleExists) {
            throw new HttpError("Role already exists", 409);
        }

     const newRole= await Role.create({ role });
        if (!newRole) {
            throw new HttpError("Role creation failed", 500);
        }

        return NextResponse.json(message("Role created successfully", 201), { status: 201 })
    } catch (error: any) {
        throw new HttpError(error.message, error.status || 500);
    }

}
)

