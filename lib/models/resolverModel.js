import mongoose from "mongoose";
const resolverSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    institute_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompanyProfile",
        required: true
    },
    allowVerification: {
        type: Boolean,
        default: false
    },
    allowDataEntry: {
        type: Boolean,
        default: false
    },
    allowBilling: {
        type: Boolean,
        default: false
    },
    allowDeletion: {
        type: Boolean,
        default: false
    },

    }, {
    timestamps: true
    });
const Resolver = mongoose.models.Resolver || mongoose.model("Resolver", resolverSchema);
export default Resolver;