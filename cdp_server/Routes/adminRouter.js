const express = require('express');
const router = express.Router();

// const multer = require('multer');
// const path = require('path');


const adminController = require('../Controllers/adminController');
// // Set up multer for file storage
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + path.extname(file.originalname));
//     }
//   });
  
//   const upload = multer({ storage: storage }).single('image'); // 'image' should match the name attribute in your form
  

// Define your routes here
router.post('/AddRecipient', adminController.AddRecipient);
router.get('/viewRecipient', adminController.viewrecipient);
router.get('/viewUsers', adminController.viewUsers);
router.post('/updateRecipientById', adminController.UpdateRecipient);
router.post('/editAndUpdateRecipient', adminController.editAndUpdaterecipient);
router.post('/deleteRecipient', adminController.deleteRecipient);

router.post('/deleteUsers', adminController.deleteUsers);



router.post('/updateAgentById', adminController.UpdateAgent);;
router.post('/editAndUpdateAgent', adminController.editAndUpdateAgent);
router.get('/viewAgent', adminController.viewAgent);
router.get('/viewRecipient', adminController.viewRecipient);
router.post('/AddAgent', adminController.AddAgent);
router.post('/deleteAgents', adminController.deleteAgents);


router.post('/AddCategory', adminController.AddCategory);
router.get('/viewCategories', adminController.viewCategories);
router.post('/deleteCategories', adminController.deleteCategories);
router.post('/deleteDonation', adminController.deleteDonation);


router.post('/AddDonation',adminController.AddDonation);
router.get('/ViewDonations', adminController.ViewDonations);
router.post('/viewDonationById', adminController.viewDonationById);
router.post('/getDonationsbyCategory', adminController.getDonationsByCategory);
router.post('/getCategorybyId', adminController.getCategorybyId)
router.put('/updateDonationStatus/:donationId',adminController.Approval) ;

router.post('/viewAgentDonationById', adminController.viewAgentDonationsById);
router.post('/viewRecipientDonationsById', adminController.viewRecipientDonationsById);

router.post('/addfeedback', adminController.addFeedback);
router.post('/addRecipientfeedback', adminController.addRecipientfeedback);
router.post('/addAgentfeedback', adminController.addAgentfeedback);
router.get('/feedbacks', adminController.getAllFeedbacks);
router.get('/Recipientfeedbacks', adminController.getRecipientFeedbacks);
router.get('/Agentfeedbacks', adminController.getAgentFeedbacks);
router.post('/deleteFeedback', adminController.deleteFeedback);
router.post('/deleteRecipientFeedback', adminController.deleteRecipientFeedback);



router.put('/addDonationAmount/:id', adminController.addDonationAmount);



router.get('/ViewNonMonetaryDonations', adminController.ViewNonMonetaryDonations);
router.post('/saveDonationHistory',adminController.saveDonationHistory)
router.post('/saveNonMonetaryDonation',adminController.saveNonMonetaryDonation)
router.post('/getDonationHistory', adminController.getDonationHistory)
router.post('/getMyNonMonetaryDonations', adminController.getMyNonMonetaryDonations)
router.put('/updateAgentDonationStatus/:donationId', adminController.updateDonationStatus)
router.put('/updateDeliveryStatus/:donationId', adminController.updateDeliveryStatus)
router.put('/updateAdminDeliveryStatus/:donationId', adminController.updateAdminDeliveryStatus)

router.get('/monetary-donations', adminController.getMonetaryDonations )
router.get('/non-monetary-donations', adminController.getNonMonetaryDonations )
module.exports = router;
