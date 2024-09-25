const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });
  
  const feedback = mongoose.model('feedback', feedbackSchema);
  
  const RecipientfeedbackSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });
  
  const Recipientfeedback = mongoose.model('Recipientfeedback', RecipientfeedbackSchema);


  
  const AgentfeedbackSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  });
  
  const Agentfeedback = mongoose.model('Agentfeedback', AgentfeedbackSchema);

  module.exports = {feedback, Recipientfeedback, Agentfeedback}