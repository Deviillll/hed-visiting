import { withErrorHandler } from "@/globalHandler/errorHandler";
import { HttpError } from "@/globalHandler/httpError";
import connectDb from "@/lib/db";
import Rate from "@/lib/models/classRatesModel";
import Department from "@/lib/models/departmentModel";
import Resolver from "@/lib/models/resolverModel";
import User from "@/lib/models/userModel";
import { getVerifiedUser } from "@/utils/token/jwtToken";
import { NextResponse } from "next/server";

// export const PUT = withErrorHandler(
//   async (req, { params }) => {
//     try {
//       const { id } = await params;
//       if (!id) {
//         throw new HttpError("user ID is required", 400);
//       }
//       const decoded = await getVerifiedUser();
//       const userId = decoded._id;
//       const role = decoded.role;
//       if (role !== "principal" && role !== "admin") {
//         throw new HttpError("Unauthorized", 401);
//       }

//       await connectDb()
//       const havePermission = await Resolver.findOne({ user_id: userId });

//       const haveDataEntryRights = havePermission?.allowDataEntry;

//       if (!havePermission || !haveDataEntryRights) {
//         throw new HttpError("You don't have permission", 403);
//       }
//       const { name, email, departmentId, rates, position } = await req.json();
      

//       const user = await User.findOne({ instituteId: havePermission.institute_id, _id: id });
//       if (!user) {
//         throw new HttpError("user not found", 404);
//       }
//       if (name) user.name = name;
//       if (email) user.email = email;
//       if (departmentId) user.department = departmentId;
//       if (position) user.position = position;

//       await user.save();


//       const createRatesForEmployee = async (employeeId: string, rates: any[]) => {
//                 if (!Array.isArray(rates) || rates.length === 0) return;

//                 const rateDocs = rates.map(detail => ({
//                     employeeId,
//                     classId: detail.classId,
//                     rate: detail.rate,
//                     effectiveFrom: detail.effectiveFrom || new Date(),
//                 }));

//                 await Rate.insertMany(rateDocs);
//             };

//             if (rates && rates.length > 0) {
//                 await createRatesForEmployee(user._id, rates);
//             }






//       return NextResponse.json({ message: "admin updated successfully" }, { status: 200 });

//     } catch (error: any) {
//       throw new HttpError(error.message, error.status || 500);
//     }
//   }
// )
// delete


export const PUT = withErrorHandler(async (req, { params }) => {
  try {
    const { id } = await params;
    if (!id) {
      throw new HttpError("user ID is required", 400);
    }

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
      throw new HttpError("You don't have permission", 403);
    }

    const { name, email, departmentId, rates, position } = await req.json();

    const user = await User.findOne({
      instituteId: havePermission.institute_id,
      _id: id,
    });

    if (!user) {
      throw new HttpError("user not found", 404);
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (departmentId) user.department = departmentId;
    if (position) user.position = position;

    await user.save();

    const handleRates = async (employeeId: string, incomingRates: any[]) => {
      if (!Array.isArray(incomingRates)) return;

      for (const rate of incomingRates) {
        const { _id: rateId, classId, rate: newRate } = rate;

        if (rateId) {
          const existingRate = await Rate.findById(rateId);
          if (!existingRate) continue;

          // Only create a new rate if it changed
          if (
            existingRate.classId.toString() !== classId ||
            Number(existingRate.rate) !== Number(newRate)
          ) {
            await Rate.create({
              employeeId,
              classId,
              rate: newRate,
              effectiveFrom: new Date(),
            });
          }
        } else {
          // No _id, create new
          await Rate.create({
            employeeId,
            classId,
            rate: newRate,
            effectiveFrom: new Date(),
          });
        }
      }
    };

    if (rates && rates.length > 0) {
      await handleRates(user._id, rates);
    }

    return NextResponse.json(
      { message: "admin updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    throw new HttpError(error.message, error.status || 500);
  }
});

export const DELETE = withErrorHandler(
  async (req, { params }) => {
    try {
      const { id } = await params;
      if (!id) {
        throw new HttpError("user ID is required", 400);
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
      const { id } = await params;

      if (!id) throw new HttpError("user ID is required", 400);

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
      console.log("isActive", isActive);

      const user = await User.findOne({
        instituteId: havePermission.institute_id,
        _id: id,
      });

      if (!user) {
        throw new HttpError("user not found", 404);
      }

      user.status = isActive;
      await user.save();

      return NextResponse.json(
        { message: "user updated successfully" },
        { status: 200 }
      );

    } catch (error: any) {
      throw new HttpError(error.message, error.status || 500);
    }
  }
);
