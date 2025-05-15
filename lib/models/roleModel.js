// create schema for role
import mongoose from "mongoose";
const roleSchema = new mongoose.Schema({
  role: {
    // enum is used to restrict the value of role to be either admin or user
    type: String,
    required: true,
    enum: ["admin", "employee", "superadmin", "principal"],
  },
}, { timestamps: true });
const Role = mongoose.models.tbl_role || mongoose.model("tbl_role", roleSchema);
export default Role;