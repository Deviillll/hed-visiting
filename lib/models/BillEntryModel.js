import mongoose from "mongoose";
const { Schema } = mongoose;

const billEmployeeEntrySchema = new Schema({
  billId: { type: Schema.Types.ObjectId, ref: 'Bill', required: true, index: true },
  employeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  rate: { type: Number, required: true, min: 0 },
  workDays: { type: Number, required: true, min: 0 },
  amount: { type: Number, required: true, min: 0 }, 
  isVerified: { type: Boolean, default: false, index: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const BillEntry = mongoose.models.BillEntry || mongoose.model('BillEntry', billEmployeeEntrySchema);
export default BillEntry;
