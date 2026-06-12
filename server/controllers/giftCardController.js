const crypto = require('crypto');
const GiftCard = require('../models/GiftCard');
const { sendGiftCardEmail } = require('../utils/emailService');

// @desc    Purchase a gift card
// @route   POST /api/giftcards
// @access  Private
exports.purchaseGiftCard = async (req, res, next) => {
  try {
    const { amount, recipientEmail, recipientName, message } = req.body;

    if (!amount || !recipientEmail || !recipientName) {
      return res.status(400).json({ message: 'Amount, recipient email and name are required' });
    }

    if (amount < 50 || amount > 5000) {
      return res.status(400).json({ message: 'Gift card amount must be between AED 50 and AED 5000' });
    }

    // Generate unique code
    const code = 'RI-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    const giftCard = await GiftCard.create({
      code,
      amount: Number(amount),
      purchasedBy: req.user._id,
      recipientEmail,
      recipientName,
      message: message || ''
    });

    // Send email to recipient
    sendGiftCardEmail(giftCard)
      .catch(err => console.error('Failed to send gift card email:', err));

    res.status(201).json({ success: true, giftCard });
  } catch (err) {
    next(err);
  }
};

// @desc    Validate/redeem a gift card code
// @route   POST /api/giftcards/redeem
// @access  Private
exports.redeemGiftCard = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Gift card code is required' });
    }

    const giftCard = await GiftCard.findOne({ code: code.toUpperCase() });

    if (!giftCard) {
      return res.status(404).json({ message: 'Invalid gift card code' });
    }

    if (giftCard.isUsed) {
      return res.status(400).json({ message: 'This gift card has already been used' });
    }

    // Mark as used
    giftCard.isUsed = true;
    giftCard.usedBy = req.user._id;
    await giftCard.save();

    res.json({
      success: true,
      amount: giftCard.amount,
      message: `Gift card redeemed! AED ${giftCard.amount} applied to your account.`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Check gift card balance (without redeeming)
// @route   POST /api/giftcards/check
// @access  Public
exports.checkGiftCard = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Gift card code is required' });
    }

    const giftCard = await GiftCard.findOne({ code: code.toUpperCase() });

    if (!giftCard) {
      return res.status(404).json({ message: 'Invalid gift card code' });
    }

    res.json({
      valid: true,
      amount: giftCard.amount,
      isUsed: giftCard.isUsed,
      recipientName: giftCard.recipientName
    });
  } catch (err) {
    next(err);
  }
};
