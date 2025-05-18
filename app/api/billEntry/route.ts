
import message from '@/globalHandler/customMessage';
import { withErrorHandler } from '@/globalHandler/errorHandler';
import { HttpError } from '@/globalHandler/httpError';
import connectDb from '@/lib/db';
import { NextResponse } from 'next/server'
import Resolver from '@/lib/models/resolverModel';
import Bill from '@/lib/models/billModel';
import { getVerifiedUser } from '@/utils/token/jwtToken';
import Rate from '@/lib/models/classRatesModel';
import BillEntry from '@/lib/models/BillEntryModel';




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


            const { employeeId, billId, classId, rate, workDays } = await req.json()

            if (!employeeId || !billId || !classId || !workDays) {
                throw new HttpError("All fields are required", 400);
            }
            // check if billId is valid
            const bill = await Bill.findOne({ _id: billId });
            if (!bill) {
                throw new HttpError("Bill not found", 404);
            }

            // extract status and isEditable from bill
            const { status, isEditable } = bill;
            if (status !== "draft") {
                throw new HttpError("Bill is not in draft status", 400);
            }
            if (!isEditable) {
                throw new HttpError("Bill is not editable", 400);
            }


            const userRate = await Rate.findOne({
                employeeId,
                classId,
            })
                .sort({ effectiveFrom: -1 });


            if (!userRate && !rate) {
                throw new HttpError(`rate not found for employee ${employeeId}`, 404);
            }

            if (userRate && rate) {
                throw new HttpError("Rate already exists for this employee", 400);
            }

            if (!userRate && rate) {
                const newRate = new Rate({
                    employeeId,
                    classId,
                    rate: rate.rate
                });
                await newRate.save();
            }

            // check if bill entry already exists

            const existingBillEntry = await BillEntry.findOne({
                billId,
                employeeId,
                classId,
            });
            if (existingBillEntry) {
                throw new HttpError("Bill entry already exists for the employee with class", 400);
            }

            const billentry = await BillEntry.create({
                billId,
                employeeId,
                classId,
                rate: userRate ? userRate.rate : rate.rate,
                workDays,
                amount: userRate ? userRate.rate * workDays : rate.rate * workDays,
                createdBy: userId
            })

            if (!billentry) {
                throw new HttpError("Bill entry not created", 400);
            }


            return NextResponse.json(message("Bill entry created successfully", 201, billentry), {
                status: 201,
            });



        } catch (error: any) {
            throw new HttpError(error.message, error.status || 500);
        }
    }
)

