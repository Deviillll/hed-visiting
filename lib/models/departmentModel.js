import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    instituteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute',
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    head: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    totalEmployees: {
        type: Number,
        default: 0,
    },
    hodName: {
        type: String,
        default: '',
    },
    code: {
        type: String,
        required: true,
    },
});

// ✅ Compound unique index: ensures (name + code + instituteId) is unique
departmentSchema.index({ name: 1, code: 1, instituteId: 1 }, { unique: true });

const Department = mongoose.models.Department || mongoose.model("Department", departmentSchema);

export default Department;
