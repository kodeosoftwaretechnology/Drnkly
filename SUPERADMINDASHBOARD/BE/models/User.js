const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  mobile: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  kycDocument: { type: String }, // path or URL
  address: { type: String },
  status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' }, // New field for verification status
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
