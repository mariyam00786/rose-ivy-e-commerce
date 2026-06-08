const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');
const Order = require('../models/Order');

// @desc    Create a payment intent
// @route   POST /api/payments/create-intent
// @access  Private
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency = 'aed', orderId } = req.body;

    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    // Convert to minor units (e.g. fils for AED, cents for USD)
    const amountInMinorUnits = Math.round(Number(amount) * 100);

    // If Stripe secret key is mock/unset, simulate payment intent
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_replace_me') {
      console.log('Simulating Stripe Payment Intent for AED', amount);
      return res.status(200).json({
        clientSecret: `mock_secret_intent_${Date.now()}`,
        isMock: true,
        amount
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInMinorUnits,
      currency: currency.toLowerCase(),
      metadata: {
        userId: req.user._id.toString(),
        orderId: orderId || ''
      },
      automatic_payment_methods: {
        enabled: true
      }
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      isMock: false
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Stripe webhook receiver
// @route   POST /api/payments/webhook
// @access  Public
exports.stripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    // Webhook simulation for manual debugging
    const { type, data } = req.body;
    if (type === 'payment_intent.succeeded') {
      const intent = data.object;
      const orderId = intent.metadata?.orderId;
      
      if (orderId) {
        try {
          const order = await Order.findById(orderId);
          if (order) {
            order.paymentStatus = 'paid';
            order.status = 'processing';
            await order.save();
            console.log(`Simulated webhook: Order ${orderId} marked as PAID`);
          }
        } catch (err) {
          console.error('Simulated webhook database update error:', err);
        }
      }
    }
    return res.status(200).json({ received: true, simulated: true });
  }

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle succeeded payment intent
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    if (orderId) {
      try {
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = 'paid';
          order.status = 'processing';
          await order.save();
          console.log(`Order ${orderId} successfully paid via Stripe`);
        }
      } catch (err) {
        console.error('Webhook order status update error:', err);
      }
    }
  }

  res.status(200).json({ received: true });
};
