const express = require('express');
const { createPaymentIntent, stripeWebhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create-intent', protect, createPaymentIntent);

// Note: Stripe Webhooks require raw request payloads for signature verification.
// We configure raw parser middleware specifically for this route.
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

module.exports = router;
