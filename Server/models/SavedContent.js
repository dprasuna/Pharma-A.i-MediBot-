const mongoose = require('mongoose');

const savedContentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicineName: { type: String, required: true },
  content: { type: String, required: true },
});

module.exports = mongoose.model('SavedContent', savedContentSchema);
