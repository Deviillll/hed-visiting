import { withErrorHandler } from "@/globalHandler/errorHandler";
import { HttpError } from "@/globalHandler/httpError";
import connectDb from "@/lib/db";
import Bill from "@/lib/models/billModel";
import Department from "@/lib/models/departmentModel";
import Resolver from "@/lib/models/resolverModel";
import { getVerifiedUser } from "@/utils/token/jwtToken";
import { NextResponse } from "next/server";


// get single bill

export const GET = withErrorHandler(
    async (req, { params }) => {
        try {
            const { id } =await params;
            if (!id) {
                throw new HttpError("bill ID is required", 400);
            }
            const decoded = await getVerifiedUser();
            const userId = decoded._id;
            const role = decoded.role;
            if (role !== "principal" && role !== "admin") {
                throw new HttpError("Unauthorized", 401);
            }

            await connectDb()
            const havePermission = await Resolver.findOne({ user_id: userId });

            const { allowBilling } = havePermission;

            if (!havePermission || !allowBilling) {
                throw new HttpError("You don't have permission to view bills", 403);
            }

            const bill = await Bill.findOne({
  _id: id,
  instituteId: havePermission.institute_id,
}).populate("createdBy", "name");

            if (!bill) {
                throw new HttpError("Bill not found", 404);
            }
            return NextResponse.json(bill, { status: 200 });

        } catch (error: any) {
            throw new HttpError(error.message, error.status || 500);
        }
    }
)