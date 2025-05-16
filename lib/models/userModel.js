import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roleId: { type: Schema.Types.ObjectId, ref: "role_tbl", required: true },
  instituteId: { type: Schema.Types.ObjectId, ref: "Institute" },
  department: { type: Schema.Types.ObjectId, ref: "Department" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
