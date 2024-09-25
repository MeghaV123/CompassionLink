const agentmodels = require('../Models/agentModel');
const agentModel = agentmodels.agent;
const mongoose = require('mongoose');


  
exports.getAgentProfile = async (req, res) => {
    try {
        console.log(req.body.id);
        const agentDetails = await agentModel.findById(req.body.id).populate('authid');
        if (!agentDetails) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        res.json({
            agentDetails,
            authDetails: agentDetails.authid
        });
    } catch (error) {
        console.error("Error in fetching agent details:", error);
        res.status(500).json({ error: "An error occurred while fetching the agent details" });
    }
};


// controllers/agentController.js

// const Donation = require('../models/Donation');
// const Agent = require('../models/Agent');


// exports.getAgent = async (req, res) => {
//     const agentId = req.body.agentId;
//     try {
//       const agent = await agentmodels.findById(agentId).populate('authid');
//       res.json(agent);
//     } catch (error) {
//       console.error("Error fetching donations:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   };