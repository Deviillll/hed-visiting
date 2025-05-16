import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  instituteId: { type: mongoose.Types.ObjectId, ref: 'Institute' },
  createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const Class = mongoose.models.Class || mongoose.model("Class", classSchema);
export default Class;

