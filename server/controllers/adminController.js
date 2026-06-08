const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');
const { sendShippingNotificationEmail } = require('../utils/emailService');

// @desc    Get store dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
  try {
    const orders = await Order.find();
    const users = await User.countDocuments();
    const products = await Product.countDocuments();
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || order.totalPrice || 0), 0);
    res.json({ totalOrders: orders.length, totalRevenue, totalUsers: users, totalProducts: products });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;
    const update = {};
    if (status) update.status = status;
    if (paymentStatus) {
      update.paymentStatus = paymentStatus;
      update.isPaid = paymentStatus === 'paid';
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Trigger Shipping Email if status is updated to 'shipped'
    if (status === 'shipped') {
      const email = order.user ? order.user.email : '';
      if (email) {
        sendShippingNotificationEmail(order, email)
          .catch(err => console.error('Failed to send shipping email:', err));
      }
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
};

// @desc    Create new product
// @route   POST /api/admin/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, salePrice, stock, category, images, tags, variants } = req.body;

    if (!name || !description || !price || !category || !images || !images.length) {
      return res.status(400).json({ message: 'Missing required product fields' });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existing = await Product.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'Product with this title already exists' });
    }

    const product = await Product.create({
      name,
      slug,
      description,
      price,
      salePrice,
      stock,
      category,
      images,
      tags,
      variants
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// @desc    Create new category
// @route   POST /api/admin/categories
// @access  Private/Admin
exports.createCategory = async (req, res, next) => {
  try {
    const { name, image, parent } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      slug,
      image,
      parent: parent || null
    });

    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    next(err);
  }
};
