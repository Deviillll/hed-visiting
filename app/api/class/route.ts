
import message from '@/globalHandler/customMessage';
import { withErrorHandler } from '@/globalHandler/errorHandler';
import { HttpError } from '@/globalHandler/httpError';
import connectDb from '@/lib/db'

import Class from '@/lib/models/classModel'
import Resolver from '@/lib/models/resolverModel';
import { getVerifiedUser } from '@/utils/token/jwtToken';
import { NextResponse } from 'next/server'


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
            const { name } = await req.json()
            if (!name) {
                throw new HttpError("Class name is required", 400);
            }
            const havePermission = await Resolver.findOne({ user_id: userId });

            const haveDataEntryRights = havePermission?.allowDataEntry;

            if (!havePermission || !haveDataEntryRights) {
                throw new HttpError("You don't have permission to create a class", 403);
            }
            const existingClass = await Class.findOne({ name, instituteId: havePermission.institute_id });
            if (existingClass) {
                throw new HttpError("Class already exists", 409);
            }


            const newClass = await Class.create({ name, instituteId: havePermission.institute_id, createdBy: userId 
             
            });
            if (!newClass) {
                throw new HttpError("Class creation failed", 500);
            }

            return NextResponse.json(message("Class created successfully", 201), { status: 201 })
        } catch (error: any) {
            throw new HttpError(error.message, error.status || 500);
        }

    }
)

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


            const classes = await Class.find({ instituteId: havePermission.institute_id }).populate("createdBy","name").populate("updatedBy","name").sort({ createdAt: -1 });
            return NextResponse.json(classes, { status: 200 });
        } catch (error: any) {
            throw new HttpError(error.message, error.status || 500);
        }
    }
)


