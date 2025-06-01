import { withErrorHandler } from "@/globalHandler/errorHandler";
import { HttpError } from "@/globalHandler/httpError";
import connectDb from "@/lib/db";
import Class from "@/lib/models/classModel";
import Resolver from "@/lib/models/resolverModel";
import { getVerifiedUser } from "@/utils/token/jwtToken";
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
export const PATCH = withErrorHandler(
  async (req, { params }) => {
    try {
      const { id } = params;
      if (!id) throw new HttpError("Department ID is required", 400);

      const decoded = await getVerifiedUser();
      const userId = decoded._id;
      const role = decoded.role;

      if (role !== "principal" && role !== "admin") {
        throw new HttpError("Unauthorized", 401);
      }

      await connectDb();

      const havePermission = await Resolver.findOne({ user_id: userId });
      const haveDataEntryRights = havePermission?.allowDataEntry;

      if (!havePermission || !haveDataEntryRights) {
        throw new HttpError("You don't have permission to view departments", 403);
      }

      const { isActive } = await req.json();

      const classes = await Class.findOne({
        instituteId: havePermission.institute_id,
        _id: id,
      });

      if (!classes) {
        throw new HttpError("Department not found", 404);
      }

      classes.isActive = isActive;
      await classes.save();

      return NextResponse.json(
        { message: "Department updated successfully" },
        { status: 200 }
      );

    } catch (error: any) {
      throw new HttpError(error.message, error.status || 500);
    }
  }
);
