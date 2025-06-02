import mongoose from "mongoose";
import Institute from "./instituteModel";
import User from "./userModel";
const resolverSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    institute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Institute,
      required: true,
    },
    canAddEmployee: {
      type: Boolean,
      default: false,
    },
    allowVerification: {
      type: Boolean,
      default: false,
    },
    allowDataEntry: {
      type: Boolean,
      default: false,
    },
    allowBilling: {
      type: Boolean,
      default: false,
    },
    allowDeletion: {
      type: Boolean,
      default: false,
    },
    canCreateAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const Resolver =
  mongoose.models.Resolver || mongoose.model("Resolver", resolverSchema);
export default Resolver;
