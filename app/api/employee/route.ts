
import message from '@/globalHandler/customMessage';
import { withErrorHandler } from '@/globalHandler/errorHandler';
import { HttpError } from '@/globalHandler/httpError';
import connectDb from '@/lib/db'
import Role from '@/lib/models/roleModel'
import { NextResponse } from 'next/server'
//@ts-expect-error
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
            const { canAddEmployee } = resolver;


            const { name, email, password, departmentId, rates, position } = await req.json()

            if (!name || !email || !password) {
                throw new HttpError("name , email , password and role is required", 400);
            }

            const definerole = await Role.findOne({ role: "employee" });
            if (!definerole) {
                throw new HttpError("Role not found", 404);
            }

            if (!canAddEmployee) {
                throw new HttpError("Unauthorized | You don't have permission to add employees", 403);
            }



          


            const lowerCaseEmail = email.toLowerCase();

            const existingUser = await User.findOne({ email: lowerCaseEmail });

            const hashedPassword = await bcrypt.hash(password, 8);

            // generate random token
            const token = generateRandomString();

         


            const createRatesForEmployee = async (employeeId: string, rates: any[]) => {
                if (!Array.isArray(rates) || rates.length === 0) return;

                const rateDocs = rates.map(detail => ({
                    employeeId,
                    classId: detail.classId,
                    rate: detail.rate,
                    effectiveFrom: detail.effectiveFrom || new Date(),
                }));

                await Rate.insertMany(rateDocs);
            };

            const departmentExist = await Department.findOne({ _id: departmentId, instituteId: resolver.institute_id });




            // new user creation
            if (!existingUser) {
                const newUser = await User.create({
                    email: lowerCaseEmail,
                    roleId: definerole._id,
                    password: hashedPassword,
                    name,
                    department: departmentId,
                    instituteId: resolver.institute_id,
                    position,
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

                await createRatesForEmployee(newUser._id, rates);


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
                existingUser.department = departmentId;
                existingUser.instituteId = resolver.institute_id;
                existingUser.position = position;
                await existingUser.save();
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



                await createRatesForEmployee(existingUser._id, rates);




                return NextResponse.json(message("User created successfully", 201), { status: 201 })
                //await sendEmail(name, email, token, "verification");
            }


            throw new HttpError("User already exists", 409);

        } catch (error: any) {
            throw new HttpError(error.message, error.status || 500);
        }
    }
)

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





           const employees = await User.aggregate([
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
      'Role.role': 'employee'
    }
  },
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

  // ✅ Lookup latest rates per class for each employee
  {
    $lookup: {
      from: 'rates',
      let: { userId: '$_id' },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ['$employeeId', '$$userId'] }
          }
        },
        {
          $sort: {
            classId: 1,
            effectiveFrom: -1 // latest rate first
          }
        },
        {
          $group: {
            _id: '$classId', // group by class
            rateDocId: { $first: '$_id' }, // keep Rate document _id
            classId: { $first: '$classId' },
            rate: { $first: '$rate' },
            effectiveFrom: { $first: '$effectiveFrom' },
            createdAt: { $first: '$createdAt' }
          }
        }
      ],
      as: 'rates'
    }
  },

  // ✅ Final projection
  {
    $project: {
      _id: 1,
      name: 1,
      email: 1,
      status: 1,
      position: 1,
      department: {
        _id: '$department._id',
        name: '$department.name',
        code: '$department.code'
      },
      rates: {
        $map: {
          input: '$rates',
          as: 'rate',
          in: {
            _id: '$$rate.rateDocId', // Real Rate document ID
            classId: '$$rate.classId',
            rate: '$$rate.rate',
            effectiveFrom: '$$rate.effectiveFrom',
            createdAt: '$$rate.createdAt'
          }
        }
      }
    }
  }
]);





            return NextResponse.json(employees, { status: 200 });

        } catch (error: any) {
            throw new HttpError(error.message, error.status || 500);
        }
    })
