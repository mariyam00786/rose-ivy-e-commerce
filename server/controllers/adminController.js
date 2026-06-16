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
    const orders = await Order.find().populate('user', 'name email').populate('userId', 'name email').sort({ createdAt: -1 });
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const products = await Product.find().populate('category', 'name').sort({ createdAt: -1 });

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || order.totalPrice || 0), 0);

    // Order status breakdown
    const ordersByStatus = orders.reduce((acc, o) => {
      const s = o.status || 'unknown';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    // Revenue by month (last 6 months)
    const monthlyRevenue = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const monthOrders = orders.filter(o => {
        const d = new Date(o.createdAt);
        return d >= start && d <= end;
      });
      monthlyRevenue.push({
        month: start.toLocaleString('default', { month: 'short', year: 'numeric' }),
        revenue: monthOrders.reduce((s, o) => s + (o.total || o.totalPrice || 0), 0),
        orders: monthOrders.length,
      });
    }

    // Top selling products (from order items)
    const productSales = {};
    orders.forEach(o => {
      const items = o.items || o.orderItems || [];
      items.forEach(item => {
        const id = (item.product || item.productId || '').toString();
        const name = item.name || 'Unknown';
        if (!productSales[id]) productSales[id] = { name, quantity: 0, revenue: 0 };
        productSales[id].quantity += item.quantity || item.qty || 1;
        productSales[id].revenue += (item.price || 0) * (item.quantity || item.qty || 1);
      });
    });
    const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    // Recent orders (last 5)
    const recentOrders = orders.slice(0, 5).map(o => ({
      _id: o._id,
      customer: o.user?.name || o.userId?.name || 'Guest',
      email: o.user?.email || o.userId?.email || '',
      total: o.total || o.totalPrice || 0,
      status: o.status,
      paymentStatus: o.paymentStatus,
      paymentMethod: o.paymentMethod,
      createdAt: o.createdAt,
      itemCount: (o.items || o.orderItems || []).length,
    }));

    // Recent customers (last 5)
    const recentCustomers = users.slice(0, 5).map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    }));

    // Low stock products
    const lowStock = products.filter(p => p.stock <= 5).slice(0, 5).map(p => ({
      _id: p._id,
      name: p.name,
      stock: p.stock,
      price: p.price,
      category: p.category?.name || '',
    }));

    res.json({
      totalOrders: orders.length,
      totalRevenue,
      totalUsers: users.length,
      totalProducts: products.length,
      ordersByStatus,
      monthlyRevenue,
      topProducts,
      recentOrders,
      recentCustomers,
      lowStock,
    });
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
