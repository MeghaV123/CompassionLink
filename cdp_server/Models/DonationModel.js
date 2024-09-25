const mongoose = require('mongoose');

const donationSchema = mongoose.Schema({
  donationName: { type: String, required: true },
  donationDescription: { type: String, required: true },
  donationType: { type: String, required: true },
  donationPrice: { type: Number, required: false },
  amountDonated: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  donationimage: { type: String, required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'recipient', required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'category', required: true },
  aadharNumber: { type: String, required: false },
  incomeCertificateUrl: { type: String, required: false },
  medicalCertificateUrl: { type: String, required: false },
  bankDetails: {
    accountOwnerName: { type: String, required: false },
    ifscCode: { type: String, required: false },
    accountNumber: { type: String, required: false }
  },
  status: { type: Number, default: 0 }
});

const Donation = mongoose.model('Donation', donationSchema);

module.exports = { Donation };







// const mongoose = require('mongoose');

// const donationSchema = mongoose.Schema({
//   donationName: { type: String, required: true },
//   donationDescription: { type: String, required: true },
//   donationType: { type: String, required: true },
//   donationPrice: { type: Number, required: false },
//   amountDonated: { type: Number, default: 0 },
//   balance: { type: Number, default: 0 },
//   imageUrl: { type: String, required: true },
//   recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'recipient', required: true },
//   categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'category', required: true },
//   status:{type:Number, default: 0}
// });

// const Donation = mongoose.model('Donation', donationSchema);

// module.exports = { Donation };
