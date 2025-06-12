import mongoose from "mongoose";
import User from "./userModel";
const { Schema } = mongoose;

const billSchema = new Schema({
  name: { type: String, required: true },

  instituteId: {
    type: Schema.Types.ObjectId,
    ref: "Institute",
    required: true,
  },
  createdBy: { type: Schema.Types.ObjectId, ref: User, required: true },

  status: {
    type: String,
    enum: ["draft", "verification", "fail", "pass", "approved", "pending"],
    default: "draft",
  },

  isEditable: { type: Boolean, default: true },

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  createdAt: { type: Date, default: Date.now },

  amount: { type: Number, default: 0, min: 0 },

  paymentDate: { type: Date },

  paymentMode: {
    type: String,
    enum: ["cash", "cheque", "online"],
    default: "cash",
  },

  paymentStatus: {
    type: String,
    enum: ["paid", "unpaid"],
    default: "unpaid",
  },
});

const Bill = mongoose.models.Bill || mongoose.model("Bill", billSchema);
export default Bill;
