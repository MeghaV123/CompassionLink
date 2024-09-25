const mongoose = require("mongoose");

const agentSchema = mongoose.Schema({
    agentname: {type:String, required:true},
    contact: {type:Number, required:true},
    // location: {type:String, required:true},
    address: {type:String, required:true},
    authid: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },
    
    
});
const agent = mongoose.model("agent", agentSchema);

// const resourcerequestSchema = mongoose.Schema({
//     userid: { type: mongoose.Schema.Types.ObjectId, required:true, ref: "agent" },
//     resourcerequest: {type:String, required:true},
//     resourcerequestdate: {type:Date, default: Date.now()},
//   });
//   const resrequest = mongoose.model("ResReq", resourcerequestSchema);
  

module.exports = {agent}