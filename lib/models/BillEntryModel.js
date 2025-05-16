const billEmployeeEntrySchema = new Schema({
  billId: { type: Schema.Types.ObjectId, ref: 'Bill' },
  employeeId: { type: Schema.Types.ObjectId, ref: 'User' },
  classId: { type: Schema.Types.ObjectId, ref: 'Class' },
  rate: Number,
  classesTaught: Number,
  amount: Number, // Pre-calculated = rate * classesTaught
  isVerified: { type: Boolean, default: false }
});

module.exports = mongoose.model('BillEmployeeEntry', billEmployeeEntrySchema);
