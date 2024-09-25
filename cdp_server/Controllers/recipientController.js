const DonationModels = require('../Models/DonationModel').Donation;
const RecipientModels = require('../Models/recipientModel').recipient;
const UserModels = require('../Models/userModel').user;
const AuthModels = require('../Models/authModel').auth;







exports.ViewDonations = async (req, res) => {
    try {
      const donations = await DonationModels.find().populate("categoryId");
      res.json(donations);
    } catch (error) {
      console.error("Error fetching donations:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


  exports.getRecipient = async (req, res) => {
    const recipientId = req.body.recipientId;
    try {
      const recipient = await RecipientModels.findById(recipientId).populate('authid');
      res.json(recipient);
    } catch (error) {
      console.error("Error fetching donations:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };



exports.updateRecipient = async (req, res) => {
  const recipientId = req.body._id;
  const { recipientname, contact, address, email, password } = req.body;

  try {
    // Fetch the recipient and auth details
    const recipient = await RecipientModels.findById(recipientId).populate('authid');

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Update recipient details
    recipient.recipientname = recipientname;
    recipient.contact = contact;
    recipient.address = address;

    // Update auth details if email or password is provided
    if (email || password) {
      const auth = await AuthModels.findById(recipient.authid._id);

      if (email) auth.email = email;
      if (password) auth.password = await bcrypt.hash(password, 10);

      await auth.save();
    }

    await recipient.save();
    res.json('Recipient updated successfully');
  } catch (error) {
    console.error('Error updating recipient:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};







// ------------Users--------------------

exports.getUsers = async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await UserModels.findById(userId).populate('authid');
    res.json(user);
  } catch (error) {
    console.error("Error fetching donations:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.updateUser = async (req, res) => {
  const recipientId = req.body._id;
  const { firstname, lastname, contact, address, email, password } = req.body;

  try {
    // Fetch the recipient and auth details
    const recipient = await UserModels.findById(recipientId).populate('authid');

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Update recipient details
    recipient.firstname = firstname;
    recipient.lastname = lastname;
    recipient.contact = contact;
    recipient.address = address;

    // Update auth details if email or password is provided
    if (email || password) {
      const auth = await authModel.findById(recipient.authid._id);

      if (email) auth.email = email;
      if (password) auth.password = await bcrypt.hash(password, 10);

      await auth.save();
    }

    await recipient.save();
    res.json({ message: 'Recipient updated successfully' });
  } catch (error) {
    console.error('Error updating recipient:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};