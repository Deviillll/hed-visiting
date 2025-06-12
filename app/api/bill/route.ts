
import message from '@/globalHandler/customMessage';
import { withErrorHandler } from '@/globalHandler/errorHandler';
import { HttpError } from '@/globalHandler/httpError';
import connectDb from '@/lib/db';
import { NextResponse } from 'next/server'
import Resolver from '@/lib/models/resolverModel';
import Bill from '@/lib/models/billModel';
import { getVerifiedUser } from '@/utils/token/jwtToken';


export const POST = withErrorHandler(
    async (req) => {

        try {
            const decoded = await getVerifiedUser();
            const userId = decoded._id;
            const role = decoded.role;

            if (role === "employee") {
                throw new HttpError("Unauthorized", 401);
            }

            await connectDb()

            const resolver = await Resolver.findOne({ user_id: userId });
            if (!resolver) {
                throw new HttpError("Unauthorized | Resolver not found", 404);
            }
            const { allowBilling } = resolver;
            if (!allowBilling) {
                throw new HttpError("Unauthorized | You don't have permission to create bill", 403);
            }


            const { name, startDate, endDate, billType, paymentMode } = await req.json()

            if (!name || !startDate || !endDate) {
                throw new HttpError("name, start Date, and end Date are required", 400);
            }


            const existingBill = await Bill.findOne({ name, startDate, endDate });
            if (existingBill) {
                throw new HttpError("Bill already exists", 409);
            }
            const bill = await Bill.create({
                name,
                startDate,
                endDate,
                createdBy: userId,
                instituteId: resolver.institute_id,
                billType,
                paymentMode

            });
            if (!bill) {
                throw new HttpError("Bill creation failed", 500);
            }

            return NextResponse.json(message("Bill created successfully", 201, bill), {
                status: 201,
            });



        } catch (error: any) {
            throw new HttpError(error.message, error.status || 500);
        }
    }
)


// get all bills

export const GET = withErrorHandler(
    async (req) => {

        try {
            const decoded = await getVerifiedUser();
            const userId = decoded._id;
            const role = decoded.role;

            if (role === "employee") {
                throw new HttpError("Unauthorized", 401);
            }

            await connectDb()

            const resolver = await Resolver.findOne({ user_id: userId });
            if (!resolver) {
                throw new HttpError("Unauthorized | Resolver not found", 404);
            }
            const { allowBilling, allowVerification } = resolver;
            if (!allowBilling || !allowVerification) {
                throw new HttpError("Unauthorized | You don't have permission to view bills", 403);
            }


            const bills = await Bill.find().sort({ createdAt: -1 });

            if (!bills || bills.length === 0) {
                throw new HttpError("No bill found", 404);
            }
            
         
            return NextResponse.json(message("Bill created successfully", 201, bills), {
                status: 201,
            });



        } catch (error: any) {
            throw new HttpError(error.message, error.status || 500);
        }
    }
)

