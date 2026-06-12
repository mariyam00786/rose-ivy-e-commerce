const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { sendOrderConfirmationEmail } = require('../utils/emailService');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const {
      shippingAddress,
      paymentMethod,
      deliveryFee = 0,
      discountCode = '',
      discountAmount = 0,
      total
    } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart || !cart.items.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Map cart items to order items
    const orderItems = cart.items.map((item) => {
      const p = item.productId;
      const price = p.salePrice !== undefined && p.salePrice !== null ? p.salePrice : p.price;
      return {
        product: p._id,
        name: p.name,
        quantity: item.quantity,
        price: price,
        image: p.images && p.images.length > 0 ? p.images[0] : p.imageUrl
      };
    });

    // Calculate total from cart items if not provided
    const calculatedTotal = total || orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + deliveryFee - discountAmount;

    // Determine initial payment status
    let paymentStatus = 'pending';
    if (paymentMethod === 'stripe') {
      paymentStatus = 'pending';
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      total: calculatedTotal,
      deliveryFee,
      discountCode,
      discountAmount,
      status: 'pending'
    });

    // Clear user cart
    await Cart.findByIdAndDelete(cart._id);

    // Send confirmation email in background
    sendOrderConfirmationEmail(order, req.user.email)
      .catch(err => console.error('Failed to send order confirmation email:', err));

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check ownership or admin status
    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};
