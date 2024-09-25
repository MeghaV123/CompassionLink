const express = require('express');
const router = express.Router();
const recipientController = require('../Controllers/recipientController');



router.get("/viewRecipientDonations", recipientController.ViewDonations);
router.post("/getRecipient", recipientController.getRecipient);
router.post("/updateRecipient", recipientController.updateRecipient);



// User Profile Update
router.post("/getUsers", recipientController.getUsers);
router.post("/updateUser", recipientController.updateUser);

module.exports = router;