const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({}).populate('parent');
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};

// @desc    Get products by category slug
// @route   GET /api/categories/:slug/products
// @access  Public
exports.getCategoryProducts = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const products = await Product.find({ category: category._id }).populate('category');
    res.status(200).json({
      category,
      products
    });
  } catch (err) {
    next(err);
  }
};
