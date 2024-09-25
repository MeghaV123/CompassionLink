const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
// const sosController = require('../Controllers/sosController');
// const notificationController = require('../Controllers/notificationController');

//--------------------SIGNUP ROUTE---------------------- //
router.post('/signup', authController.signup);
router.post('/agentSignup', authController.agentSignup);
router.post('/recipientSignup', authController.recipientSignup);

//--------------------SIGNIN ROUTE---------------------- //
router.post('/signin', authController.signin);
router.get('/notifications', authController.getNotifications);
router.post('/mark-read', authController.markNotificationsRead);


//--------------------SOS requests---------------------- //
// router.post('/sos', sosController.createSos);

//--------------------Fetch notifications---------------------- //
// router.get('/notifications', notificationController.getNotifications);
// router.post('/notifications/mark-read', notificationController.markNotificationsRead);

module.exports = router;
