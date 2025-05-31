import { withErrorHandler } from "@/globalHandler/errorHandler";
import { HttpError } from "@/globalHandler/httpError";
import connectDb from "@/lib/db";
import Department from "@/lib/models/departmentModel";
import Resolver from "@/lib/models/resolverModel";
import { getVerifiedUser } from "@/utils/token/jwtToken";
import { NextResponse } from "next/server";

export const PUT = withErrorHandler(
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

            const haveDataEntryRights = havePermission?.allowDataEntry;

            if (!havePermission || !haveDataEntryRights ) {
                throw new HttpError("You don't have permission to view departments", 403);
            }
            const { name, code, hodName, head } = await req.json();

            const departments = await Department.findOne({ instituteId: havePermission.institute_id , _id: id });
            if (!departments) {
                throw new HttpError("Department not found", 404);
            }
            if (name) departments.name = name;
            if (code) departments.code = code;
            if (hodName) departments.hodName = hodName;
            if (head) departments.head = head;
            await departments.save();
            return NextResponse.json({ message: "Department updated successfully" }, { status: 200 });

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
                throw new HttpError("You don't have permission to delete departments", 403);
            }

            const department = await Department.findOneAndDelete({ _id: id, instituteId: havePermission.institute_id });
            if (!department) {
                throw new HttpError("Department not found", 404);
            }
            return NextResponse.json({ message: "Department deleted successfully" }, { status: 200 });

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

      const department = await Department.findOne({
        instituteId: havePermission.institute_id,
        _id: id,
      });

      if (!department) {
        throw new HttpError("Department not found", 404);
      }

      department.isActive = isActive;
      await department.save();

      return NextResponse.json(
        { message: "Department updated successfully" },
        { status: 200 }
      );

    } catch (error: any) {
      throw new HttpError(error.message, error.status || 500);
    }
  }
);
