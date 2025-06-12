
import message from '@/globalHandler/customMessage';
import { withErrorHandler } from '@/globalHandler/errorHandler';
import { HttpError } from '@/globalHandler/httpError';
import connectDb from '@/lib/db';
import { NextResponse } from 'next/server'
import Resolver from '@/lib/models/resolverModel';
import Bill from '@/lib/models/billModel';
import { getVerifiedUser } from '@/utils/token/jwtToken';
import BillEntry from '@/lib/models/BillEntryModel';
import User from '@/lib/models/userModel';
import mongoose from 'mongoose';




export const POST = withErrorHandler(
  async (req) => {
    try {
      const decoded = await getVerifiedUser();
      const userId = decoded._id;
      const role = decoded.role;

      if (role === "employee") {
        throw new HttpError("Unauthorized", 401);
      }

      await connectDb();

      const { searchParams } = new URL(req.url);
      const billId = searchParams.get("billId");

      if (!billId || !mongoose.Types.ObjectId.isValid(billId)) {
        throw new HttpError("Invalid or missing bill ID", 400);
      }

      const resolver = await Resolver.findOne({ user_id: userId });
      if (!resolver) {
        throw new HttpError("Unauthorized | Resolver not found", 404);
      }

      const { allowBilling, allowDataEntry } = resolver;
      if (!allowBilling || !allowDataEntry) {
        throw new HttpError(
          "Unauthorized | You don't have permission to create bill",
          403
        );
      }

      const bill = await Bill.findOne({ _id: billId });
      if (!bill) {
        throw new HttpError("Bill not found", 404);
      }

      if (bill.status !== "draft") {
        throw new HttpError("Bill is not in draft status", 400);
      }
      if (!bill.isEditable) {
        throw new HttpError("Bill is not editable", 400);
      }

      // Parse incoming data
      const {data} = await req.json();
    

      if (!data?.user?.userId) {
        throw new HttpError("Employee userId is required", 400);
      }
      if (!Array.isArray(data.classes) || data.classes.length === 0) {
        throw new HttpError("Classes array is required", 400);
      }

      const employeeId = data.user.userId;

      // Check employee exists and active
      const existEmployee = await User.findById(employeeId);
      if (!existEmployee || existEmployee.status === "inactive") {
        throw new HttpError("Employee is inactive or not found", 404);
      }

      // Loop over classes to create BillEntry for each
      const createdEntries = [];

      for (const cls of data.classes) {
        const classId = cls._id;
        const workDays = cls.daysWorked;
        const rate = parseFloat(cls.latestRate?.rate);

        if (!classId || workDays == null || isNaN(rate)) {
          throw new HttpError(
            `Missing classId, workDays or rate for one of the classes`,
            400
          );
        }

        // Check if bill entry already exists for this bill, employee, class
        const existingBillEntry = await BillEntry.findOne({
          billId,
          employeeId,
          classId,
        });
        if (existingBillEntry) {
          throw new HttpError(
            `Bill entry already exists for employee ${employeeId} with class ${classId}`,
            400
          );
        }

        // Create the bill entry
        const billEntry = await BillEntry.create({
          billId,
          employeeId,
          classId,
          rate,
          workDays,
          amount: rate * workDays,
          createdBy: userId,
        });

        createdEntries.push(billEntry);
      }

      return NextResponse.json(
        message("Bill entries created successfully", 201, createdEntries),
        {
          status: 201,
        }
      );
    } catch (error: any) {
      throw new HttpError(error.message, error.status || 500);
    }
  }
);




export const GET = withErrorHandler(async (req) => {
    try {
        const decoded = await getVerifiedUser();
        const userId = decoded._id;
        const role = decoded.role;

        if (role === 'employee') {
            throw new HttpError('Unauthorized', 401);
        }

        await connectDb();

        const { searchParams } = new URL(req.url);
        const billId = searchParams.get('billId');

        if (!billId || !mongoose.Types.ObjectId.isValid(billId)) {
            throw new HttpError('Invalid or missing bill ID', 400);
        }

        const billEntries = await BillEntry.aggregate([
            {
                $match: {
                    billId: new mongoose.Types.ObjectId(billId),
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'employeeId',
                    foreignField: '_id',
                    as: 'employee',
                },
            },
            { $unwind: '$employee' },
            {
                $lookup: {
                    from: 'classes',
                    localField: 'classId',
                    foreignField: '_id',
                    as: 'class',
                },
            },
            { $unwind: '$class' },
            {
                $project: {
                    _id: 1,
                    employee: {
                        _id: '$employee._id',
                        name: '$employee.name',
                        email: '$employee.email',
                    },
                    class: {
                        _id: '$class._id',
                        name: '$class.name',
                    },
                    rate: 1,
                    workDays: 1,
                    amount: 1,
                    isVerified: 1,
                    createdAt: 1,
                },
            },
            {
                $sort: { createdAt: -1 },
            },
        ]);
    

        return NextResponse.json(
            message('Bill entries fetched successfully', 200, billEntries),
            { status: 200 }
        );
    } catch (error: any) {
        throw new HttpError(error.message, error.status || 500);
    }
});
