// models/NonMonetaryDonation.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nonMonetaryDonationSchema = Schema({
  donationId: { type: Schema.Types.ObjectId, ref: 'Donation' },
  userId: { type: Schema.Types.ObjectId, ref: 'user' },
  AgentStatus: { type: Number, default: 0, required: false },
  agentId: { type: Schema.Types.ObjectId, ref: 'agent', required: false },
  deliveryStatus: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'On The Way', 'Delivered'], 
    default: 'Pending' 
  },  // New field
  deliveryUpdates: [{
    status: { 
      type: String, 
      enum: ['Pending', 'In Progress', 'On The Way', 'Delivered'] 
    },
    timestamp: { type: Date, default: Date.now }
  }], // To track the history of status updates
  donationDate: { type: Date, default: Date.now } // Added field to track the date of donation
});

const NonMonetaryDonation = mongoose.model('NonMonetaryDonation', nonMonetaryDonationSchema);

module.exports = { NonMonetaryDonation };
