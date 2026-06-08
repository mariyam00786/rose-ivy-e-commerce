const { sendBespokeAcknowledgement } = require('../utils/emailService');

// @desc    Submit bespoke floral enquiry
// @route   POST /api/bespoke-enquiry
// @access  Public
exports.submitBespokeEnquiry = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      occasion,
      colorPreferences,
      budgetRange,
      message
    } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email, and phone number are required' });
    }

    const file = req.file; // From multer middleware if provided
    const referenceFilePath = file ? file.path : null;

    const enquiry = {
      name,
      email,
      phone,
      occasion,
      colorPreferences,
      budgetRange,
      message,
      referenceFilePath
    };

    // Send acknowledgement to customer
    await sendBespokeAcknowledgement(enquiry);

    // For testing and simulation, we also print to the console
    console.log('--- Bespoke Floral Enquiry Received ---');
    console.log(enquiry);
    console.log('----------------------------------------');

    res.status(200).json({
      success: true,
      message: 'Enquiry submitted successfully. An acknowledgement email has been sent.'
    });
  } catch (err) {
    next(err);
  }
};
