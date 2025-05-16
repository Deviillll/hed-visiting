const employeeClassRateSchema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: 'User' },
  classId: { type: Schema.Types.ObjectId, ref: 'Class' },
  rate: { type: Number, required: true },
  effectiveFrom: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmployeeClassRate', employeeClassRateSchema);
