import message from '@/globalHandler/customMessage';
import { withErrorHandler } from '@/globalHandler/errorHandler';
import { HttpError } from '@/globalHandler/httpError';
import connectDb from '@/lib/db'
import Role from '@/lib/models/roleModel'
import { NextResponse } from 'next/server'
import bcrypt from "bcryptjs";
import User from '@/lib/models/userModel'
import VerificationToken from '@/lib/models/verifyTokenModel'
import Resolver from '@/lib/models/resolverModel';
import Rate from '@/lib/models/classRatesModel';
import { generateRandomString, getVerifiedUser } from '@/utils/token/jwtToken';
import Department from '@/lib/models/departmentModel';


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
      const { canCreateAdmin } = resolver;
      if (!canCreateAdmin) {
        throw new HttpError("Unauthorized | You don't have permission to add admins", 403);
      }

      const { name, email, password, department, resolverPermissions, rateDetails } = await req.json()


      if (!name || !email || !password) {
        throw new HttpError("name , email , password is required", 400);
      }

      const definerole = await Role.findOne({ "role": "admin" });
      if (!definerole) {
        throw new HttpError("Role not found", 404);
      }

      const lowerCaseEmail = email.toLowerCase();

      const existingUser = await User.findOne({ email: lowerCaseEmail });

      const hashedPassword = await bcrypt.hash(password, 8);

      // generate random token
      const token = generateRandomString();

      const createResolverForAdmin = async (userId: string, instituteId: string, permissions: object) => {
        if (!permissions) return;
        await Resolver.create({
          user_id: userId,
          institute_id: instituteId,
          ...permissions,
        });
      };
      console.log(department, "department id");

      let departmentExist = null;
      if (department) {
        departmentExist = await Department.findOne({ _id: department, instituteId: resolver.institute_id });
      }


      // new user creation
      if (!existingUser) {
        const newUser = await User.create({
          email: lowerCaseEmail,
          roleId: definerole._id,
          password: hashedPassword,
          name,
          department,
          instituteId: resolver.institute_id,
        });
        if (departmentExist) {
          departmentExist.totalEmployees += 1;
          await departmentExist.save();

        }
        await VerificationToken.create({
          token,
          userId: newUser._id,
          expiry: Date.now() + 3600000,
        });

        await createResolverForAdmin(newUser._id, resolver.institute_id, resolverPermissions);


        //await sendEmail(name, email, token, "verification");

        return NextResponse.json(message("User created successfully", 201), { status: 201 })
      }
      const deletedUser = existingUser.isDeleted;
      //soft deleted user
      if (existingUser && deletedUser) {
        existingUser.isDeleted = false;
        existingUser.password = hashedPassword;
        existingUser.roleId = definerole._id;
        existingUser.name = name;
        existingUser.isVerified = false;
        existingUser.department = department;
        existingUser.instituteId = resolver.institute_id;
        await existingUser.save();
        await createResolverForAdmin(existingUser._id, resolver.institute_id, resolverPermissions);
        if (departmentExist) {
          departmentExist.totalEmployees += 1;
          await departmentExist.save();

        }
        const previousUserToken = await VerificationToken.findOne({
          userId: existingUser._id,
        });

        if (previousUserToken) {
          previousUserToken.token = token;
          previousUserToken.expiry = Date.now() + 3600000;
          await previousUserToken.save();
        } else {
          await VerificationToken.create({
            token,
            userId: existingUser._id,
            expiry: Date.now() + 3600000,
          });
        }

        return NextResponse.json(message("User created successfully", 201), { status: 201 })
        //await sendEmail(name, email, token, "verification");
      }


      throw new HttpError("User already exists", 409);

    } catch (error: any) {
      throw new HttpError(error.message, error.status || 500);
    }
  }
)


// get all user whose role is admin
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




      const admins = await User.aggregate([
        {
          $match: {
            instituteId: resolver.institute_id,
            isDeleted: false
          }
        },
        {
          $lookup: {
            from: 'roles',
            localField: 'roleId',
            foreignField: '_id',
            as: 'Role'
          }
        },
        {
          $unwind: '$Role'
        },
        {
          $match: {
            'Role.role': 'admin'
          }
        },
        // Join Resolver collection to get permissions
        {
          $lookup: {
            from: 'resolvers',
            localField: '_id',
            foreignField: 'user_id',
            as: 'permissions'
          }
        },
        {
          $unwind: { path: '$permissions', preserveNullAndEmptyArrays: true }
        },
        // Join departments collection
        {
          $lookup: {
            from: 'departments',
            localField: 'department',
            foreignField: '_id',
            as: 'department'
          }
        },
        {
          $unwind: { path: '$department', preserveNullAndEmptyArrays: true }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            email: 1,
            status: 1,
            canAddEmployee: '$permissions.canAddEmployee',
            allowVerification: '$permissions.allowVerification',
            allowDataEntry: '$permissions.allowDataEntry',
            allowBilling: '$permissions.allowBilling',
            allowDeletion: '$permissions.allowDeletion',
            canCreateAdmin: '$permissions.canCreateAdmin',
            department: {
              _id: '$department._id',
              name: '$department.name',
              code: '$department.code'
            }
          }
        }
      ]);





      return NextResponse.json(admins, { status: 200 });

    } catch (error: any) {
      throw new HttpError(error.message, error.status || 500);
    }
  }
)
