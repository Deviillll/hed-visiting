import Rate from '@/lib/models/classRatesModel';
// app/api/billEntry/[id]/route.ts
import { withErrorHandler } from "@/globalHandler/errorHandler";
import { HttpError } from "@/globalHandler/httpError";
import connectDb from "@/lib/db";
import BillEntry from "@/lib/models/BillEntryModel";
import Resolver from "@/lib/models/resolverModel";
import { getVerifiedUser } from "@/utils/token/jwtToken";
import { NextResponse } from "next/server";

// ✅ PUT - Update all fields except isVerified
export const PUT = withErrorHandler(async (req, { params }) => {
    await connectDb();

    const { id } = params;
    if (!id) throw new HttpError("Bill Entry ID is required", 400);

    const decoded = await getVerifiedUser();
    const userId = decoded._id;
    const role = decoded.role;

    if (role !== "principal" && role !== "admin") {
        throw new HttpError("Unauthorized", 401);
    }

    const permission = await Resolver.findOne({ user_id: userId });
    if (!permission?.allowDataEntry && !permission?.allowBilling) {
        throw new HttpError("No permission to update entries", 403);
    }

    const {
        rate,
        workDays,
        amount,
        employee,
        class: classData,
        name,
        email,
        className,
        updateRate
    } = await req.json();


    const billEntry = await BillEntry.findOne({ _id: id, "employeeId": employee._id });

    if (!billEntry) throw new HttpError("Bill Entry not found", 404);
    

    if (updateRate) {
        const latestRate = await Rate.findOne({
            classId: classData._id,
            employeeId: employee._id,
        }).sort({ createdAt: -1 }); // sort to get latest

        if (latestRate) {
            billEntry.rate = latestRate.rate;
            billEntry.amount = latestRate.rate * workDays;
        }

    } else {
        billEntry.rate = rate;
        billEntry.amount = rate * workDays;
    }
    // Only update the allowed fields

    billEntry.workDays = workDays;



    await billEntry.save();

    return NextResponse.json({ message: "Bill Entry updated successfully" }, { status: 200 });
});

// ✅ DELETE - Delete by entry ID
export const DELETE = withErrorHandler(async (req, { params }) => {
    await connectDb();

    const { id } = await params;
    if (!id) throw new HttpError("Bill Entry ID is required", 400);

    const decoded = await getVerifiedUser();
    const userId = decoded._id;
    const role = decoded.role;

    if (role !== "principal" && role !== "admin") {
        throw new HttpError("Unauthorized", 401);
    }

    const permission = await Resolver.findOne({ user_id: userId });
    console.log(permission);
    if (!permission?.allowDeletion) {
        throw new HttpError("No permission to delete entries", 403);
    }
    console.log(`Deleting Bill Entry with ID: ${id}`);
    const deleted = await BillEntry.findOneAndDelete({ _id: id });
    console.log(`Deleted Bill Entry: ${deleted}`);

    if (!deleted) throw new HttpError("Bill Entry not found", 404);

    return NextResponse.json({ message: "Bill Entry deleted successfully" }, { status: 200 });
});

// ✅ PATCH - Update only isVerified
export const PATCH = withErrorHandler(async (req, { params }) => {
    await connectDb();

    const { id } = params;
    if (!id) throw new HttpError("Bill Entry ID is required", 400);

    const decoded = await getVerifiedUser();
    const userId = decoded._id;
    const role = decoded.role;

    if (role !== "principal" && role !== "admin") {
        throw new HttpError("Unauthorized", 401);
    }

    const permission = await Resolver.findOne({ user_id: userId });
    if (!permission?.allowVerification) {
        throw new HttpError("No permission to update entries", 403);
    }

    const { isVerified } = await req.json();

    const billEntry = await BillEntry.findById(id);
    if (!billEntry) throw new HttpError("Bill Entry not found", 404);

    billEntry.isVerified = isVerified;
    await billEntry.save();

    return NextResponse.json({ message: "Verification status updated" }, { status: 200 });
});
