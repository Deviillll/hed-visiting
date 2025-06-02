import { withErrorHandler } from "@/globalHandler/errorHandler";
import { HttpError } from "@/globalHandler/httpError";
import connectDb from "@/lib/db";
import Department from "@/lib/models/departmentModel";
import Resolver from "@/lib/models/resolverModel";
import User from "@/lib/models/userModel";
import { getVerifiedUser } from "@/utils/token/jwtToken";
import { NextResponse } from "next/server";

export const PUT = withErrorHandler(
  async (req, { params }) => {
    try {
      const { id } = await params;
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

      if (!havePermission || !haveDataEntryRights) {
        throw new HttpError("You don't have permission to view departments", 403);
      }
      const { name, email, department, resolverPermissions } = await req.json();

      const user = await User.findOne({ instituteId: havePermission.institute_id, _id: id });
      if (!user) {
        throw new HttpError("user not found", 404);
      }
      if (name) user.name = name;
      if (email) user.email = email;
      if (department) user.department = department;

      await user.save();


      const updateResolverPermissions = async (userId: string, permissions: object) => {
        // Find the resolver by user_id and update permission fields
        await Resolver.findOneAndUpdate(
          { user_id: userId },        // find resolver for the user
          { $set: permissions },      // update only permissions
          { new: true, upsert: false } // return updated doc, don't create new if missing
        );
      };

      if (resolverPermissions) {
        await updateResolverPermissions(id, resolverPermissions);
      }




      return NextResponse.json({ message: "admin updated successfully" }, { status: 200 });

    } catch (error: any) {
      throw new HttpError(error.message, error.status || 500);
    }
  }
)
// delete

export const DELETE = withErrorHandler(
  async (req, { params }) => {
    try {
      const { id } = await params;
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

      if (!havePermission || !haveDeletionRights) {
        throw new HttpError("You don't have permission to delete departments", 403);
      }

      const user = await User.findOne({ _id: id, instituteId: havePermission.institute_id });
      if (!user) {
        throw new HttpError("user not found", 404);
      }
      user.isDeleted = true;
      await user.save();
      return NextResponse.json({ message: "user deleted successfully" }, { status: 200 });

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
