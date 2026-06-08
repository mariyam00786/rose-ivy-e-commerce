const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      populate: { path: 'category' }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.wishlist);
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle item in wishlist
// @route   POST /api/wishlist/toggle
// @access  Private
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const index = user.wishlist.indexOf(productId);
    let added = false;
    
    if (index >= 0) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(productId);
      added = true;
    }

    await user.save();

    // Populate for response
    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    
    res.status(200).json({
      success: true,
      added,
      wishlist: updatedUser.wishlist
    });
  } catch (err) {
    next(err);
  }
};
