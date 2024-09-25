const mongoose = require('mongoose');

const donationHistorySchema = mongoose.Schema({
  donationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentId: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  paymentDate: { type: Date, default: Date.now },
});

const DonationHistory = mongoose.model('DonationHistory', donationHistorySchema);

module.exports = { DonationHistory };
