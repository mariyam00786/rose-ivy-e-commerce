const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart) cart = await Cart.create({ userId: req.user._id, items: [] });
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    // Fetch product to verify and get current price
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const price = product.salePrice !== undefined && product.salePrice !== null ? product.salePrice : product.price;

    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity += Number(quantity);
      cart.items[itemIndex].price = price; // Sync price
    } else {
      cart.items.push({ productId, quantity: Number(quantity), price });
    }

    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.productId');
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart
// @access  Private
exports.updateCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = Number(quantity);
      }
      await cart.save();
    }
    
    const populated = await Cart.findById(cart._id).populate('items.productId');
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
    cart.items = cart.items.filter((item) => item.productId.toString() !== req.params.productId);
    await cart.save();
    
    const populated = await Cart.findById(cart._id).populate('items.productId');
    res.json(populated);
  } catch (err) {
    next(err);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user._id });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    next(err);
  }
};

// @desc    Sync guest cart on login
// @route   POST /api/cart/sync
// @access  Private
exports.syncCart = async (req, res, next) => {
  try {
    const { items = [] } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user._id, items: [] });
    }

    for (const guestItem of items) {
      const pId = guestItem.productId || guestItem.product;
      if (!pId) continue;
      
      const product = await Product.findById(pId);
      if (!product) continue;

      const price = product.salePrice !== undefined && product.salePrice !== null ? product.salePrice : product.price;

      const itemIndex = cart.items.findIndex(item => item.productId.toString() === pId.toString());
      if (itemIndex >= 0) {
        cart.items[itemIndex].quantity += Number(guestItem.quantity || 1);
        cart.items[itemIndex].price = price;
      } else {
        cart.items.push({
          productId: pId,
          quantity: Number(guestItem.quantity || 1),
          price
        });
      }
    }

    await cart.save();
    const populated = await Cart.findById(cart._id).populate('items.productId');
    res.json(populated);
  } catch (err) {
    next(err);
  }
};
