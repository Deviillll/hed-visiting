import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;
const generateToken = ({ _id, email, roleId }) => {
  return jwt.sign({ _id, email, roleId }, JWT_SECRET, {
    expiresIn: "3d",
  });
};
export { generateToken };

const encoder = new TextEncoder();
const secret = encoder.encode(JWT_SECRET);

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);

    return payload;
  } catch (err) {
    throw err;
  }
}
