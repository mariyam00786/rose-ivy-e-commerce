const Product = require('../models/Product');

// @desc    Live search products
// @route   GET /api/search
// @access  Public
exports.searchProducts = async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query || query.trim() === '') {
      return res.status(200).json([]);
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    })
      .limit(10)
      .populate('category');

    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};
