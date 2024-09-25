const authmodels = require('../Models/authModel');
const usermodels = require('../Models/userModel');
const recipientModels = require('../Models/recipientModel');
const agentModels = require('../Models/agentModel');
const notificationModels = require('../Models/notificationModel');
const userModel = usermodels.user;
const authModel = authmodels.auth;
const recipientModel = recipientModels.recipient;
const notificationModel = notificationModels.Notification;
const agentModel = agentModels.agent;
const bcrypt = require('bcrypt');

// -------------------------------Authentication ------------------------------//

exports.signup = async (req, res) => {
 

    try {
        // Check if email already exists
        const existingUser = await authModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json('Email already exists');
        }

        // Hashing the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const authparam = {
            email: req.body.email,
            password: hashedPassword,
            usertype: req.body.usertype,
        };
        const auth = await authModel.create(authparam);

        // Creating user with linked authentication details
        const userparam = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            contact: req.body.contact,
            address: req.body.address,
            authid: auth._id, // fetching authentication details into userparam
        };
        await userModel.create(userparam);
        res.json('success');
    } catch (error) {
        console.error("Error Occurred:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// ----------------------------Agent Sign Up----------------------------------//
exports.agentSignup = async (req, res) => {
  try {
    // Check if the email already exists
    const existingUser = await authModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' }); // 409 Conflict
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const authparam = {
      email: req.body.email,
      password: hashedPassword,
      usertype: req.body.usertype,
    };
    const auth = await authModel.create(authparam);

    const agentparam = {    
      agentname: req.body.agentname,
      contact: req.body.contact,
      location: req.body.location,
      address: req.body.address,
      authid: auth._id
    };
    await agentModel.create(agentparam);
    res.json('success');
  } catch (error) {
    console.error("Error Occurred:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.recipientSignup = async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
      // Create Auth entry
      const auth = await authModel.create({
        email: req.body.email,
        password: hashedPassword,
        usertype: req.body.usertype,
      });
  
      // Create Recipient entry
      const recipient = await recipientModel.create({
        recipientname: req.body.recipientname,
        contact: req.body.contact,
        address: req.body.address,
        authid: auth._id,
      });
  
      res.json('success');
    } catch (error) {
      console.error('Error Occurred:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the auth document based on email
        const authenticate = await authModel.findOne({ email });

        if (authenticate) {
            // Check if password matches
            const isPasswordValid = await bcrypt.compare(password, authenticate.password);
            if (isPasswordValid) {
                let user;
                if (authenticate.usertype === 1) { // Donor user
                    user = await recipientModel.findOne({ authid: authenticate._id }).populate('authid');
                } else if(authenticate.usertype === 2){
                    user = await agentModel.findOne({ authid: authenticate._id }).populate('authid');
                }
                else {
                     // Admin user
                    user = await userModel.findOne({ authid: authenticate._id }).populate('authid');
                }

                if (user) {
                    // Set session with user details
                    req.session.user = user; 
                    // Return user
                    res.json(user);
                } else {
                    // User not found
                    res.status(404).json("User not found");
                }
            } else {
                // Invalid password
                res.status(401).json("Invalid password");
            }
        } else {
            // Invalid email
            res.status(404).json("Invalid email");
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



exports.getNotifications = async (req, res) => {
    try {
      const notifications = await notificationModel.find().sort({ timestamp: -1 });
      res.json(notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  
  // Mark notifications as read
  exports.markNotificationsRead = async (req, res) => {
    const { ids } = req.body;
  
    try {
      // Mark notifications as read
      await notificationModel.updateMany(
        { _id: { $in: ids } },
        { $set: { read: true } }
      );
  
      // Remove notifications
      await notificationModel.deleteMany({ _id: { $in: ids } });
  
      res.json({ success: true, message: 'Notifications marked as read and removed' });
    } catch (error) {
      console.error('Error marking notifications as read and removing:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };

  exports.deleteNotification = async (req, res) => {
    const { notificationId } = req.params;
  
    try {
      const deletedNotification = await notificationModel.findByIdAndDelete(notificationId);
  
      if (!deletedNotification) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
      }
  
      res.json({ success: true, message: 'Notification deleted', notification: deletedNotification });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  