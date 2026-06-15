const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { protect } = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');

// @desc    Get all coupons (admin)
// @route   GET /api/coupons
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a coupon (admin)
// @route   POST /api/coupons
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrder, expiresAt, usageLimit } = req.body;
    if (!code || !discountValue) {
      return res.status(400).json({ message: 'Code and discount value are required' });
    }
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }
    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType: discountType || 'percentage',
      discountValue,
      minOrder: minOrder || 0,
      expiresAt: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      usageLimit: usageLimit || 100,
    });
    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Private
router.post('/validate', protect, async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid coupon code' });
    }

    if (coupon.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    if (cartTotal && cartTotal < coupon.minOrder) {
      return res.status(400).json({ message: `Minimum order amount is AED ${coupon.minOrder}` });
    }

    const discount = coupon.discountType === 'percentage'
      ? (cartTotal || 0) * (coupon.discountValue / 100)
      : coupon.discountValue;

    res.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount: Math.round(discount * 100) / 100
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
