const authmodels = require('../Models/authModel');
const recipientmodels = require('../Models/recipientModel');
const agentModels = require('../Models/agentModel');
const usermodels = require('../Models/userModel');
const categorymodels = require('../Models/categoryModel');
const DonationModels = require('../Models/DonationModel')
const FeedbackModels = require('../Models/feedbackModel')
const NotificationModels = require('../Models/notificationModel')
const nonMonetaryDonationModels = require('../Models/nonMonetaryDonationModel')
const DonationHistoryModels = require('../Models/DonationHistoryModel')
const bcrypt = require('bcrypt');


const authModel = authmodels.auth;
const recipientModel = recipientmodels.recipient;
const agentModel = agentModels.agent;
const usermodel = usermodels.user;
const categorymodel = categorymodels.category;
const feedbackmodel = FeedbackModels.feedback;
const Recipientfeedbackmodel = FeedbackModels.Recipientfeedback;
const Agentfeedbackmodel = FeedbackModels.Agentfeedback;
const NotificationModel = NotificationModels.Notification;
const nonMonetaryDonationmodel = nonMonetaryDonationModels.NonMonetaryDonation;

const { NonMonetaryDonation } = require('../Models/nonMonetaryDonationModel');
const DonationHistoryModel= DonationHistoryModels.DonationHistory;

const DonationModel = DonationModels.Donation;


const multer = require("multer");
const path = require("path");

const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});


// const upload = multer({storage:storage}).single('image');
const upload = multer({ storage:storage }).fields([
  { name: 'image', maxCount:1 },
  { name: 'donationimage', maxCount:1 },
  { name: 'incomeCertificate', maxCount: 1 },
  { name: 'medicalCertificate', maxCount: 1 }
]);


exports.getNonMonetaryDonations = async (req, res) => {
  try {
      // Aggregate non-monetary donations by week and count them
      const aggregatedData = await nonMonetaryDonation.aggregate([
          {
              $group: {
                  _id: { week: { $week: "$deliveryUpdates.timestamp" } }, // Group by week
                  count: { $sum: 1 }, // Count the donations
              },
          },
          {
              $sort: { "_id.week": 1 }, // Sort by week number
          },
          {
              $project: {
                  week: "$_id.week",
                  count: 1,
                  _id: 0,
              },
          },
      ]);

      res.status(200).json(aggregatedData);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
exports.getMonetaryDonations = async (req, res) => {
  try {
      // Aggregate monetary donations by week and get the total amount and count
      const aggregatedData = await DonationHistoryModel.aggregate([
          {
              $group: {
                  _id: { week: { $week: "$paymentDate" } }, // Group by week
                  totalAmount: { $sum: "$amount" }, // Sum the amounts
                  donationCount: { $sum: 1 }, // Count the donations
              },
          },
          {
              $sort: { "_id.week": 1 }, // Sort by week number
          },
          {
              $project: {
                  week: "$_id.week",
                  totalAmount: 1,
                  donationCount: 1,
                  _id: 0,
              },
          },
      ]);

      res.status(200).json(aggregatedData);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};



// ------------------------------------------------------Recipient Controller----------------------------------------------//

exports.AddRecipient = async (req, res) => {
  try {
      // Check if the email already exists
      const existingUser = await authModel.findOne({ email: req.body.email });
      if (existingUser) {
          return res.status(409).json({ message: 'Email already exists' }); // 409 Conflict
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Create auth entry
      const loginparam = {
          email: req.body.email,
          password: hashedPassword,
          usertype: req.body.usertype,
      };
      const auth = await authModel.create(loginparam);

      // Create recipient entry
      const recipientparam = {
          recipientname: req.body.recipientname,
          contact: req.body.contact,
          location: req.body.location,
          address: req.body.address,
          authid: auth._id,
      };
      await recipientModel.create(recipientparam);

      res.json('success');
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.viewrecipient = async (req, res) => {
    try {
        const recipient = await recipientModel.find().populate('authid');
        res.json(recipient);
    } catch (error) {
        console.error('Error fetching recipient:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.viewUsers = async (req, res) => {
  try {
      const users = await usermodel.find().populate('authid');
      res.json(users);
  } catch (error) {
      console.error('Error fetching Users:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};
exports.deleteUsers = async (req, res) => {
  try {
      const userId = req.body.id;
      const user = await usermodel.findById(userId);

      if (!user) {
          return res.status(404).json({ error: 'recipient not found' });
      }

      // Delete associated auth details
      await authModel.findByIdAndDelete(user.authid);

      // Delete the recipient
      await usermodel.findByIdAndDelete(userId);

      res.json({ message: 'user and associated auth details deleted successfully' });
  } catch (error) {
      console.error("Error in deleting user:", error);
      res.status(500).json({ error: "An error occurred while deleting the user" });
  }
};


exports.UpdateRecipient = async (req, res) => {
    try {
        const recipientDetails = await recipientModel.findById(req.body.id).populate('authid');
        if (!recipientDetails) {
            return res.status(404).json({ error: 'Recipient not found' });
        }

        res.json({
            recipientDetails,
            authDetails: recipientDetails.authid
        });
    } catch (error) {
        console.error("Error in fetching recipient details:", error);
        res.status(500).json({ error: "An error occurred while fetching the recipient details" });
    }
};

exports.editAndUpdaterecipient = async (req, res) => {
    try {
        const recipientDetails = {
            recipientname: req.body.recipientname,
            contact: req.body.contact,
            location: req.body.location,
            address: req.body.address,
        };
        await recipientModel.findByIdAndUpdate(req.body.id, recipientDetails);

        const loginDetails = {
            email: req.body.email,
            userstatus: req.body.userstatus,
        };
        await authModel.findByIdAndUpdate(req.body.authid, loginDetails);

        res.json("updated");
    } catch (error) {
        console.error("Error in updating Recipient:", error);
        res.status(500).json({ error: "An error occurred while updating the Recipient" });
    }
};

exports.deleteRecipient = async (req, res) => {
    try {
        const recipientId = req.body.id;
        const recipient = await recipientModel.findById(recipientId);

        if (!recipient) {
            return res.status(404).json({ error: 'recipient not found' });
        }

        // Delete associated auth details
        await authModel.findByIdAndDelete(recipient.authid);

        // Delete the recipient
        await recipientModel.findByIdAndDelete(recipientId);

        res.json({ message: 'Recipient and associated auth details deleted successfully' });
    } catch (error) {
        console.error("Error in deleting recipient:", error);
        res.status(500).json({ error: "An error occurred while deleting the recipient" });
    }
};

// ------------------------------------------------------Agent Controller----------------------------------------------//

exports.AddAgent = async (req, res) =>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const loginparam = {
            email: req.body.email,
            password: hashedPassword,
            usertype: req.body.usertype,
        };
        const auth = await authModel.create(loginparam);

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
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.viewAgent = async (req, res) => {
    try {
        const agents = await agentModel.find().populate('authid');
        res.json(agents);
    } catch (error) {
        console.error('Error fetching agents:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




exports.deleteAgents = async (req, res) => {
    try {
        const agentId = req.body.id;
        const agent = await agentModel.findById(agentId);

        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        // Delete associated auth details
        await authModel.findByIdAndDelete(agent.authid);

        // Delete the volunteer
        await agentModel.findByIdAndDelete(agentId);

        res.json({ message: 'Agent and associated auth details deleted successfully' });
    } catch (error) {
        console.error("Error in deleting Agent:", error);
        res.status(500).json({ error: "An error occurred while deleting the Agent" });
    }
};
exports.editAndUpdateAgent = async (req, res) => {
    try {
        const agentDetails = {
            agentname: req.body.agentname,
            contact: req.body.contact,
            location: req.body.location,
            address: req.body.address,
        };
        await agentModel.findByIdAndUpdate(req.body.id, agentDetails);

        const loginDetails = {
            email: req.body.email,
            userstatus: req.body.userstatus,
        };
        await authModel.findByIdAndUpdate(req.body.authid, loginDetails);

        res.json("updated");
    } catch (error) {
        console.error("Error in updating agent:", error);
        res.status(500).json({ error: "An error occurred while updating the volunteer" });
    }
};

exports.UpdateAgent = async (req, res) => {
    try {
        const agentDetails = await agentModel.findById(req.body.id).populate('authid');
        console.log(agentDetails);
        if (!agentDetails) {
            return res.status(404).json({ error: 'Agent not found' });
        }

        res.json({
            agentDetails,
            authDetails: agentDetails.authid
        });
    } catch (error) {
        console.error("Error in fetching agent details:", error);
        res.status(500).json({ error: "An error occurred while fetching the recipient details" });
    }
};
// -----------------------------------------------------------------------------//

exports.viewRecipient = async (req, res) => {
    try {
        const recipients = await recipientmodel.find().populate('authid');
        res.json(recipients);
    } catch (error) {
        console.error('Error fetching recipients:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// ADD CATEGORY


exports.AddCategory = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error uploading file', details: err });
    }

    try {
      const { categoryName } = req.body;

      if (!req.files) {
        return res.status(400).json({ error: 'Image is required' });
      }

      // Constructing the image URL
      const CatImage = `/uploads/${req.files.image[0].filename}`;

      const categoryParam = {
        categoryname: categoryName,
        image: CatImage,
      };

      await categorymodel.create(categoryParam);
      res.json({ message: 'Category added successfully' });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};


  exports.viewCategories = async (req, res) => {
    try {
        const categories = await categorymodel.find();
        res.json(categories);
    } catch (error) {
        console.error("Error fetching packages:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.deleteCategories = async (req, res) => {
    try {
        const categoryId = req.body.id;
        const category = await categorymodel.findById(categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Delete the volunteer
        await categorymodel.findByIdAndDelete(categoryId);

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error("Error in deleting Category:", error);
        res.status(500).json({ error: "An error occurred while deleting the Category" });
    }
};


// -----------------Add Donation------------------------- //
exports.AddDonation = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error uploading file', details: err });
    }

    try {
      const {
        donationName,
        donationDescription,
        donationPrice,
        recipientId,
        donationType,
        categoryId,
        aadharNumber,
        accountOwnerName,
        bankName,
        ifscCode,
        accountNumber,
      } = req.body;

      if (!req.files['donationimage']) {
        return res.status(400).json({ error: 'Image is required' });
      }

      const donationimage = `/uploads/${req.files['donationimage'][0].filename}`;
      const incomeCertificateUrl = req.files['incomeCertificate']
        ? `/uploads/${req.files['incomeCertificate'][0].filename}`
        : null;
      const medicalCertificateUrl = req.files['medicalCertificate']
        ? `/uploads/${req.files['medicalCertificate'][0].filename}`
        : null;

      const donationParam = {
        donationName,
        donationDescription,
        donationPrice,
        donationimage,
        recipientId,
        donationType,
        categoryId,
        aadharNumber,
        incomeCertificateUrl,
        medicalCertificateUrl,
        bankDetails: {
          accountOwnerName,
          bankName,
          ifscCode,
          accountNumber,
        },
      };

      await DonationModel.create(donationParam);
      res.json({ message: 'Donation added successfully' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
};

  // Function to view products for a specific seller
exports.ViewDonations = async (req, res) => {
    try {
      const donations = await DonationModel.find().populate("categoryId");
      res.json(donations);
    } catch (error) {
      console.error("Error fetching donations:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  // exports.ViewNonMonetaryDonations = async (req, res) => {
  //   try {
  //     const donations = await nonMonetaryDonationmodel.find().populate(donationId)
     
  //     res.json(donations);
  //   } catch (error) {
  //     console.error("Error fetching donations:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // };


  exports.ViewNonMonetaryDonations = async (req, res) => {
    try {
      const donations = await nonMonetaryDonationmodel.find().populate("donationId").populate("userId");
      res.json(donations);
    } catch (error) {
      console.error("Error fetching donations:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  exports.viewDonationById = async (req, res) => {
    const { id } = req.body;
    try {
      const donation = await DonationModel.findById(id).populate('recipientId').populate('categoryId');
      if (donation) {
        res.status(200).json(donation);
      } else {
        res.status(404).json({ success: false, message: "Donation not found" });
      }
    } catch (error) {
      console.error("Error fetching donation details:", error);
      res.status(500).json({ success: false, message: "Error fetching donation details" });
    }
  };
  // Controller for handling partial donations
  exports.makeDonation = async (req, res) => {
    try {
        const { donationId, amount } = req.body;
        const donation = await DonationModel.findById(donationId);

        if (!donation) {
            return res.status(404).json({ error: 'Donation not found' });
        }

        donation.amountDonated += amount;
        donation.balance = donation.donationPrice - donation.amountDonated;
        await donation.save();

        res.json({ message: 'Donation made successfully', donation });
    } catch (error) {
        console.error("Error in making donation:", error);
        res.status(500).json({ error: "An error occurred while making the donation" });
    }
};
  
  exports.deleteDonation = async (req, res) => {
    try {
        const donationId = req.body.id;
        const donation = await DonationModel.findById(donationId);

        if (!donation) {
            return res.status(404).json({ error: 'donation not found' });
        }

        // Delete the volunteer
        await DonationModel.findByIdAndDelete(donationId);

        res.json({ message: 'Donation deleted successfully' });
    } catch (error) {
        console.error("Error in deleting Donation:", error);
        res.status(500).json({ error: "An error occurred while deleting the Donation" });
    }
};



// _________ View Categories Products___________________//

exports.getDonationsByCategory = async (req, res) => {
    try {
        
      const  categoryId = req.body.categoryId;
      const donations = await DonationModel.find({ categoryId }).populate("recipientId").populate('categoryId');
      res.json(donations);
    } catch (error) {
      console.error("Error fetching donations by category:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


  exports.getCategorybyId = async (req, res) => {
    try {
        
      const  categoryId = req.body.categoryId;
    
      const category = await categorymodel.findById(categoryId);
      res.json(category);
    } catch (error) {
      console.error("Error fetching donations by category:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };



  
    exports.Approval = async (req, res) => {
    try {
      const { donationId } = req.params;
      const { AgentStatus, agentId, status } = req.body;
      const donation = await DonationModel.findByIdAndUpdate(donationId, { AgentStatus, agentId, status }, { new: true });
      if (!donation) {
        return res.status(404).json({ success: false, message: 'Donation not found' });
      }
      res.json({ success: true, message: 'Donation status updated successfully', donation });
    } catch (error) {
      console.error('Error updating donation status:', error);
      res.status(500).json({ success: false, message: 'An error occurred while updating the donation status' });
    }
  };




//   -----------------Feedbacks----------------------- //
exports.addFeedback = async (req, res) => {
    const { title, description, user_id, email } = req.body;
    
    const newFeedback = feedbackmodel({
        title,
        description,
        user_id,
        email
    });
    
    try {
        await newFeedback.save();
        res.json({ message: "Feedback submitted successfully" });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  };
  exports.addRecipientfeedback = async (req, res) => {
    const { title, description, user_id, email } = req.body;
    
    const newFeedback = Recipientfeedbackmodel({
        title,
        description,
        user_id,
        email
    });
    
    try {
        await newFeedback.save();
        res.json({ message: "Feedback submitted successfully" });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  };


  exports.addAgentfeedback = async (req, res) => {
    const { title, description, user_id, email } = req.body;
    
    const newFeedback = Agentfeedbackmodel({
        title,
        description,
        user_id,
        email
    });
    
    try {
        await newFeedback.save();
        res.json({ message: "Feedback submitted successfully" });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  };
  // Get all feedbacks
  exports.getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await feedbackmodel.find().populate('user_id');
        res.json(feedbacks);
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  };
// Get recipient Feedback
  exports.getRecipientFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Recipientfeedbackmodel.find().populate('user_id');
        res.json(feedbacks);
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  };

  exports.getAgentFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Agentfeedbackmodel.find().populate('user_id');
        res.json(feedbacks);
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  
  exports.deleteFeedback = async (req, res) => {
    try {
      const { id } = req.body;
      await feedbackmodel.findByIdAndDelete(id);
      res.json({ message: "Feedback deleted successfully" });
    } catch (error) {
      console.error("Error deleting feedback:", error);
      res.status(500).json({ error: "Failed to delete feedback" });
    }
  };


  exports.deleteRecipientFeedback = async (req, res) => {
    try {
      const { id } = req.body;
      await Recipientfeedbackmodel.findByIdAndDelete(id);
      res.json({ message: "Feedback deleted successfully" });
    } catch (error) {
      console.error("Error deleting feedback:", error);
      res.status(500).json({ error: "Failed to delete feedback" });
    }
  };

  exports.deleteAgentFeedback = async (req, res) => {
    try {
      const { id } = req.body;
      await Agentfeedbackmodel.findByIdAndDelete(id);
      res.json({ message: "Feedback deleted successfully" });
    } catch (error) {
      console.error("Error deleting feedback:", error);
      res.status(500).json({ error: "Failed to delete feedback" });
    }
  };

  exports.addDonationAmount = async (req, res) => {
    try {
      const { id } = req.params;
      const { amount, paymentId } = req.body;
  
      const donation = await DonationModel.findById(id);
      if (!donation) {
        return res.status(404).json({ success: false, message: 'Donation not found' });
      }
  
      donation.amountDonated += parseFloat(amount);
      donation.balance = donation.donationPrice - donation.amountDonated;
  
      await donation.save();
  
      res.json({ success: true, message: 'Donation amount added successfully' });
    } catch (error) {
      console.error('Error adding donation amount:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  exports.saveDonationHistory = async (req, res) => {
    const { donationId, userId, amount, paymentId, paymentStatus } = req.body;
  
    try {
      const newHistory = new DonationHistoryModel({
        donationId,
        userId,
        amount,
        paymentId,
        paymentStatus,
      });
  
      await newHistory.save();
      res.json({ success: true, message: 'Donation history saved successfully' });
    } catch (error) {
      console.error('Error saving donation history:', error);
      res.status(500).json({ success: false, message: 'Error saving donation history' });
    }
  };
  




 exports.getDonationHistory= async (req, res) => {
    const userId = req.body.userId;
  
    try {
      const donationHistory = await DonationHistoryModel.find({ userId }).populate('donationId');
      res.json(donationHistory);
    } catch (error) {
      console.error('Error fetching donation history:', error);
      res.status(500).json({ success: false, message: 'Error fetching donation history' });
    }
  };


  
 exports.getMyNonMonetaryDonations= async (req, res) => {
  const userId = req.body.userId;

  try {
    const donationHistory = await nonMonetaryDonationmodel.find({ userId }).populate('donationId');
    res.json(donationHistory);
  } catch (error) {
    console.error('Error fetching donation history:', error);
    res.status(500).json({ success: false, message: 'Error fetching donation history' });
  }
};


// Controller to save non-monetary donations
exports.saveNonMonetaryDonation = async (req, res) => {
  const { donationId, userId } = req.body;

  try {
    const nonMonetaryDonation = new nonMonetaryDonationmodel({
      donationId,
      userId,
    });

    await nonMonetaryDonation.save();

    // Create a notification
    const notification = new NotificationModel({
      
      message: `New Donation Added`,
       // Adjust the type as per your requirement
    });

    await notification.save();

    res.status(200).json({ success: true, message: 'Non-monetary donation saved successfully' });
  } catch (error) {
    console.error("Error saving non-monetary donation:", error);
    res.status(500).json({ success: false, message: 'An error occurred while saving non-monetary donation' });
  }
};


// Function to update the donation status and assign the agentId
exports.updateDonationStatus = async (req, res) => {
  try {
    const { donationId } = req.params; // Extracting donationId from the URL parameters
    const { agentId, AgentStatus } = req.body; // Extracting agentId and AgentStatus from the request body

    // Ensure that the model name matches exactly with your model definition
    const updatedDonation = await NonMonetaryDonation.findByIdAndUpdate(
      donationId, // Pass the correct donationId
      { AgentStatus, agentId },
      { new: true } // Return the updated document
    );

    if (!updatedDonation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    res.json({ success: true, message: 'Donation status updated', donation: updatedDonation });
  } catch (error) {
    console.error('Error updating donation status:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryStatus } = req.body; // Extracting deliveryStatus from the request body
    const { donationId } = req.params; // Extracting donationId from the request params

    // Log the donationId for debugging purposes
    console.log(donationId);

    // Find the donation by ID and update its deliveryStatus
    const updatedDonation = await nonMonetaryDonationmodel.findByIdAndUpdate(
      donationId,
      { deliveryStatus },
      { new: true } // This option returns the updated document
    );

    // If the donation is not found, return a 404 error
    if (!updatedDonation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    // Return a success response with the updated donation
    res.json({ success: true, message: 'Delivery status updated', donation: updatedDonation });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



exports.updateAdminDeliveryStatus = async (req, res) => {
  try {
    const { deliveryStatus } = req.body; // Extracting deliveryStatus from the request body
    const donationId = req.params.donationId; // Extracting donationId from the request params

    // Log the donationId for debugging purposes
    console.log(donationId,"nasdjfnaisdfai");

    // Find the donation by ID and update its deliveryStatus
    const updatedDonation = await nonMonetaryDonationmodel.findOneAndUpdate(
      {donationId},
      { deliveryStatus },
      { new: true } // This option returns the updated document
    );

    // If the donation is not found, return a 404 error
    if (!updatedDonation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    // Return a success response with the updated donation
    res.json({ success: true, message: 'Delivery status updated', donation: updatedDonation });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};




exports.viewAgentDonationsById = async (req, res) => {
  const  donationId = req.body.donationId;
  try {
    const donation = await nonMonetaryDonationmodel.findById(donationId).populate('donationId').populate('userId')
    .populate({
      path: "donationId", // populate blogs
      populate: {
         path: "recipientId" // in blogs, populate comments
      }
   })
    ;
    if (donation) {
      res.status(200).json(donation);
    } else {
      res.status(404).json({ success: false, message: "Donation not found" });
    }
  } catch (error) {
    console.error("Error fetching donation details:", error);
    res.status(500).json({ success: false, message: "Error fetching donation details" });
  }
};



exports.viewRecipientDonationsById = async (req, res) => {
  const  donationId = req.body.id;
  try {
    const donation = await NonMonetaryDonation.findOne({donationId}).populate("agentId").populate('donationId').populate('userId');
    
    if (donation) {
      res.status(200).json(donation);
    } else {
      res.status(404).json({ success: false, message: "Donation not found" });
    }
  } catch (error) {
    console.error("Error fetching donation details:", error);
    res.status(500).json({ success: false, message: "Error fetching donation details" });
  }
};