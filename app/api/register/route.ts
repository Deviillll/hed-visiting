import message from '@/globalHandler/customMessage';
import { withErrorHandler } from '@/globalHandler/errorHandler';
import { HttpError } from '@/globalHandler/httpError';
import connectDb from '@/lib/db'
import Role from '@/lib/models/roleModel'
import { NextResponse } from 'next/server'
import bcrypt from "bcryptjs";
import User from '@/lib/models/userModel'
import crypto from "crypto";
import VerificationToken from '@/lib/models/verifyTokenModel'


export const POST = withErrorHandler(
    async (req) => {

        try {
            await connectDb()
            const { name, email, password, } = await req.json()

            if (!name || !email || !password) {
                throw new HttpError("Please fill all fields", 400);
            }

            const definerole = await Role.findOne({ role: "principal" });
            if (!definerole) {
                throw new HttpError("Role not found", 404);
            }
            const lowerCaseEmail = email.toLowerCase();

            const existingUser = await User.findOne({ email: lowerCaseEmail });

            const hashedPassword = await bcrypt.hash(password, 8);

            // generate random token
            const generateRandomString = (length: number) => {
                return crypto
                    .randomBytes(length)
                    .toString("base64")
                    .replace(/\+/g, "0")
                    .replace(/\//g, "0")
                    .replace(/=+$/, "");
            };

            const token = generateRandomString(20);

            // new user creation
            if (!existingUser) {
                const newUser = await User.create({
                    email: lowerCaseEmail,
                    roleId: definerole._id,
                    password: hashedPassword,
                    name,
                });
                await VerificationToken.create({
                    token,
                    userId: newUser._id,
                    expiry: Date.now() + 3600000,
                });

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
                existingUser.isverified = false;
                await existingUser.save();
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

