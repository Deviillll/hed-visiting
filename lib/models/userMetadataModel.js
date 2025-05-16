const userMetaDataSchema = new Schema({
  pic: String,
  departmentId: { type: Schema.Types.ObjectId, ref: 'Department' },
  code: String,
  accountNo: String,
  rank: String,
  cnic: String,
  phone: String
});

module.exports = mongoose.model('UserMetaData', userMetaDataSchema);
