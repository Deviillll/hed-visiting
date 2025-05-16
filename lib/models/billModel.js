const billSchema = new Schema({
  name: String,
  instituteId: { type: Schema.Types.ObjectId, ref: 'Institute' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'under_verification', 'approved'], default: 'pending' },
  isEditable: { type: Boolean, default: true },
  startDate: Date,
  endDate: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bill', billSchema);
