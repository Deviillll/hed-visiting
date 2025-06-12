import { withErrorHandler } from "@/globalHandler/errorHandler";
import { HttpError } from "@/globalHandler/httpError";
import connectDb from "@/lib/db";
import Class from "@/lib/models/classModel";
import Rate from "@/lib/models/classRatesModel";
import Resolver from "@/lib/models/resolverModel";
import User from "@/lib/models/userModel";
import { getVerifiedUser } from "@/utils/token/jwtToken";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const PUT = withErrorHandler(
    async (req, { params }) => {
        try {
            const { id } = params;
            if (!id) {
                throw new HttpError("Class ID is required", 400);
            }
            const decoded = await getVerifiedUser();
            const userId = decoded._id;
            const role = decoded.role;
            if (role !== "principal" && role !== "admin") {
                throw new HttpError("Unauthorized", 401);
            }

            await connectDb()
            const havePermission = await Resolver.findOne({ user_id: userId });

            const haveDataEntryRights = havePermission?.allowDataEntry;

            if (!havePermission || !haveDataEntryRights ) {
                throw new HttpError("You don't have permission to view departments", 403);
            }
            const { name } = await req.json();

            const classes = await Class.findOne({ instituteId: havePermission.institute_id , _id: id });

            if (!classes) {
                throw new HttpError("Class not found", 404);
            }
            if (name) classes.name = name;
            classes.updatedBy = userId;
            classes.updatedAt = new Date();
            if (!classes.createdBy) {
                classes.createdBy = userId; // Ensure createdBy is set if not already
            }


            
            await classes.save();
            return NextResponse.json({ message: "Class updated successfully" }, { status: 200 });

        } catch (error: any) {
            throw new HttpError(error.message, error.status || 500);
        }
    }
)
// delete

export const DELETE = withErrorHandler(
    async (req, { params }) => {
        try {
            const { id } = params;
            if (!id) {
                throw new HttpError("Department ID is required", 400);
            }
            const decoded = await getVerifiedUser();
            const userId = decoded._id;
            const role = decoded.role;
            if (role !== "principal" && role !== "admin") {
                throw new HttpError("Unauthorized", 401);
            }

            await connectDb()
            const havePermission = await Resolver.findOne({ user_id: userId });

            const haveDeletionRights = havePermission?.allowDeletion;

            if (!havePermission || !haveDeletionRights ) {
                throw new HttpError("You don't have permission to delete classes", 403);
            }

            const classes = await Class.findOneAndDelete({ _id: id, instituteId: havePermission.institute_id });
            if (!classes) {
                throw new HttpError("Class not found", 404);
            }
            return NextResponse.json({ message: "Class deleted successfully" }, { status: 200 });

        } catch (error: any) {
            throw new HttpError(error.message, error.status || 500);
        }
    }
)


export const GET = withErrorHandler(
  async (req, { params }) => {
    try {
      const { id: employeeId } =await params;
      if (!employeeId) throw new HttpError("Employee ID is required", 400);

      // Verify logged in user and role
      const decoded = await getVerifiedUser();
      const requesterId = decoded._id;
      const role = decoded.role;

      if (role !== "principal" && role !== "admin") {
        throw new HttpError("Unauthorized", 401);
      }

      await connectDb();

      // Check permission
      const permission = await Resolver.findOne({ user_id: requesterId });
      const { allowDataEntry, allowBilling, institute_id } = permission || {};

      if (!permission || !allowDataEntry || !allowBilling) {
        throw new HttpError("You don't have permission to view employee classes", 403);
      }

      // Fetch employee details
      const employee = await User.findById(employeeId).select("_id name email");
      if (!employee) throw new HttpError("Employee not found", 404);

      // Aggregation pipeline to get latest rate per class
      const latestRates = await Rate.aggregate([
  {
    $match: { employeeId: new mongoose.Types.ObjectId(employeeId) }
  },
  {
    $lookup: {
      from: "classes",
      localField: "classId",
      foreignField: "_id",
      as: "class"
    }
  },
  { $unwind: "$class" },
  {
    $match: {
      "class.instituteId": new mongoose.Types.ObjectId(institute_id)
    }
  },
  {
    $lookup: {
      from: "users", // assuming the collection is called "users"
      localField: "employeeId",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  { $sort: { effectiveFrom: -1 } },
  {
    $group: {
      _id: "$classId",
      rate: { $first: "$rate" },
      effectiveFrom: { $first: "$effectiveFrom" },
      class: { $first: "$class" },
      user: { $first: "$user" }
    }
  },
  {
    $project: {
      _id: "$class._id",
      name: "$class.name",
      latestRate: {
        rate: "$rate",
        effectiveFrom: "$effectiveFrom"
      },
      user: {
        name: "$user.name",
        email: "$user.email",
        userId: "$user._id"
      }
    }
  }
]);


      return NextResponse.json(
        {
          employee,
          classes: latestRates,
        },
        { status: 200 }
      );
    } catch (error: any) {
      throw new HttpError(error.message, error.status || 500);
    }
  }
);