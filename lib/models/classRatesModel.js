import mongoose from 'mongoose';

const employeeClassRateSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Types.ObjectId, ref: 'User' },
  classId: { type: mongoose.Types.ObjectId, ref: 'Class' },
  rate: { type: String, required: true },
  effectiveFrom: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const  Rate = mongoose.models.Rate || mongoose.model("Rate", employeeClassRateSchema);
export default Rate;

