const mongoose = require('mongoose');

const giftCardSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  purchasedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipientEmail: { type: String, required: true },
  recipientName: { type: String, required: true },
  message: { type: String, default: '' },
  isUsed: { type: Boolean, default: false },
  usedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('GiftCard', giftCardSchema);
