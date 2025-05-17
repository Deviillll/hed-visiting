import message from '@/globalHandler/customMessage';
import { withErrorHandler } from '@/globalHandler/errorHandler';
import { HttpError } from '@/globalHandler/httpError';
import connectDb from '@/lib/db'
import Institute from '@/lib/models/instituteModel';
import Resolver from '@/lib/models/resolverModel';
import User from '@/lib/models/userModel';
import { getVerifiedUser } from '@/utils/token/jwtToken';
import { NextResponse } from 'next/server'


export const POST = withErrorHandler(
    async (req) => {

        try {

            const decoded = await getVerifiedUser();
            const userId = decoded._id;
            const role = decoded.role;
            if (role !== "principal" && role !== "superadmin") {
                throw new HttpError("Unauthorized", 401);
            }
            await connectDb()
            const { name, email, contact, address, logo, description, website } = await req.json()
            const instituteExists = await Institute.findOne({
                userId
            });
            if (instituteExists) {
                throw new HttpError("Institute already exists", 409);
            }



            const newInstitute = await Institute.create({
                userId,
                name,
                email,
                contact,
                address,
                logo,
                description,
                website
            });
            if (!newInstitute) {
                throw new HttpError("Institute creation failed", 500);
            }
            const resolver = await Resolver.create({
                user_id: userId,
                institute_id: newInstitute._id,
                allowVerification: true,
                allowDataEntry: true,
                allowBilling: true,
                allowDeletion: true,
                canAddEmployee: true,
                canCreateAdmin: true,
            });
            if (!resolver) {
                throw new HttpError("Resolver creation failed", 500);
            }
            // now ad the instiute id to the user table
            const user = await User.findByIdAndUpdate(userId, {
                instituteId: newInstitute._id
            }, { new: true });
            if (!user) {
                throw new HttpError("User update failed", 500);
            }


            return NextResponse.json(message("Institute created successfully", 201), { status: 201 });

        } catch (error: any) {
            throw new HttpError(error.message, error.status || 500);
        }

    }
)

