
import message from '@/globalHandler/customMessage';
import { withErrorHandler } from '@/globalHandler/errorHandler';
import { HttpError } from '@/globalHandler/httpError';
import connectDb from '@/lib/db'
import Department from '@/lib/models/departmentModel'
import Resolver from '@/lib/models/resolverModel';
import { getVerifiedUser } from '@/utils/token/jwtToken';
import {NextResponse } from 'next/server'


export const POST = withErrorHandler(
    async (req) => {

    try {
        const decoded = await getVerifiedUser();
        const userId = decoded._id;
        const role = decoded.role;
        if (role !== "principal" && role !== "admin") {
            throw new HttpError("Unauthorized", 401);
        }

        await connectDb()
        const {name, hodName,head,code} = await req.json()
        const havePermission = await Resolver.findOne({ user_id: userId });

        const haveDataEntryRights = havePermission?.allowDataEntry;

        if (!havePermission || !haveDataEntryRights ) {
            throw new HttpError("You don't have permission to create a department", 403);
        }
        if (!name || !code) {
            throw new HttpError("Department name and code are required", 400);
        }
        const existingDepartment = await Department.findOne({ name, instituteId: havePermission.institute_id ,code});
        if (existingDepartment) {
            throw new HttpError("Department already exists", 409);
        }


        const newDepartment = await Department.create({
            name ,
            instituteId: havePermission.institute_id,
            hodName,
            head,
            code
         });
        if (!newDepartment) {
            throw new HttpError("Department creation failed", 500);
        }

        return NextResponse.json(message("Department created successfully", 201), { status: 201 })
    } catch (error: any) {
        throw new HttpError(error.message, error.status || 500);
    }

}
)



// get all departments for a specific institute
export const GET = withErrorHandler(
    async (req) => {
        try {
            const decoded = await getVerifiedUser();
            const userId = decoded._id;
            const role = decoded.role;
            if (role !== "principal" && role !== "admin") {
                throw new HttpError("Unauthorized", 401);
            }

            await connectDb()
            const havePermission = await Resolver.findOne({ user_id: userId });


            const departments = await Department.find({ instituteId: havePermission.institute_id });
            return NextResponse.json(departments, { status: 200 });
        } catch (error: any) {
            throw new HttpError(error.message, error.status || 500);
        }
    }
)
