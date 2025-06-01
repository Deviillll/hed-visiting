import mongoose from "mongoose";
import User from "./userModel";


const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  instituteId: {
    type: mongoose.Types.ObjectId,
    ref: "Institute",
    default: null,
  },
  createdBy: { type: mongoose.Types.ObjectId, ref: User, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Types.ObjectId, ref: User, default: null },
  isActive: { type: Boolean, default: true },
});

const Class = mongoose.models.Class || mongoose.model("Class", classSchema);
export default Class;
