import mongoose from "mongoose";


const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    instituteId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institute',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
  
   
});

const Department = mongoose.models.Department || mongoose.model("Department", departmentSchema);

export default Department;