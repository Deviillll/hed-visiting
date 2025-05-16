import mongoose from "mongoose";

const userMetaDataSchema = new Schema({
  pic: String,
  departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
  code: { type: String, required: true },
  accountNo: { type: String, required: true },
  rank: { type: String, required: true },
  cnic: { type: String, required: true },
  phone: { type: String, required: true }
});
const UserMetaData = mongoose.models.UserMetaData || mongoose.model("UserMetaData", userMetaDataSchema);
export default UserMetaData;
