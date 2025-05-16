const classSchema = new Schema({
  name: { type: String, required: true },
  instituteId: { type: Schema.Types.ObjectId, ref: 'Institute' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Class', classSchema);
