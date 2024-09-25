const mongoose = require("mongoose");

const recipientSchema = mongoose.Schema({
    recipientname: {type:String, required:true},
    contact: {type:Number, required:true},
    // location: {type:String, required:true},
    address: {type:String, required:true},
    authid: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },

});
const recipient = mongoose.model("recipient", recipientSchema);

module.exports = {recipient}