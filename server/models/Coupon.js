const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
  usageLimit: { type: Number, default: null },
  usageCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
