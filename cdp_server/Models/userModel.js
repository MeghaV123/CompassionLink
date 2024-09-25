const mongoose = require("mongoose");
const { recipient } = require("./recipientModel");

//--------------------User Details Model---------------------------- // 
const userSchema = mongoose.Schema({
  firstname: {type:String, required:true},
  lastname: {type:String, required:true},
  contact: {type:Number, required:true},
  address:{type:String, required:true},
  authid: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" }, //Collection should be called
});
const user = mongoose.model("user", userSchema);


const userDonationsSchema = mongoose.Schema({
  donationId: {type: mongoose.Schema.Types.ObjectId, ref: "Donation" },
  donatedAmount: {type:Number, required:false},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: "user"}
})

const userDonations = mongoose.model("userDonations", userDonationsSchema);

module.exports = { user, userDonations};
