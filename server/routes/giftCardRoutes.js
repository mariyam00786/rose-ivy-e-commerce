const express = require('express');
const router = express.Router();
const { purchaseGiftCard, redeemGiftCard, checkGiftCard } = require('../controllers/giftCardController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, purchaseGiftCard);
router.post('/redeem', protect, redeemGiftCard);
router.post('/check', checkGiftCard);

module.exports = router;
