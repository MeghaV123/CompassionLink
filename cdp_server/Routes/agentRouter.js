const express = require("express");
const router = express.Router();
const agentController = require("../Controllers/agentController");

router.get("/getAgentProfile/:id", agentController.getAgentProfile);
// router.post("/getAgent", agentController.getAgent);




module.exports = router;


// routes/agentRoutes.js

