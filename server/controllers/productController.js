const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category,
      priceMin,
      priceMax,
      stockStatus,
      onSale,
      sort,
      search,
      page = 1,
      limit = 12
    } = req.query;

    let query = {};

    // 1. Category filter (handles slug or ID)
    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({ slug: category });
        if (foundCategory) {
          query.category = foundCategory._id;
        } else {
          return res.status(200).json({ products: [], page: 1, pages: 0, total: 0 });
        }
      }
    }

    // 2. Price range filter (checking either price or salePrice)
    if (priceMin || priceMax) {
      query.$or = [];
      const min = Number(priceMin || 0);
      const max = Number(priceMax || 999999);

      // Check standard price
      query.$or.push({
        salePrice: { $exists: false },
        price: { $gte: min, $lte: max }
      });

      // Check salePrice if it exists
      query.$or.push({
        salePrice: { $exists: true, $ne: null },
        $and: [
          { salePrice: { $gte: min } },
          { salePrice: { $lte: max } }
        ]
      });
    }

    // 3. Stock Status filter
    if (stockStatus) {
      if (stockStatus === 'in-stock') {
        query.stock = { $gt: 0 };
      } else if (stockStatus === 'out-of-stock') {
        query.stock = 0;
      }
    }

    // 4. On Sale filter
    if (onSale === 'true') {
      query.salePrice = { $exists: true, $ne: null };
    }

    // 5. Search filter (text search on name and description)
    if (search) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      });
    }

    // Determine Sort order
    let sortOptions = {};
    if (sort === 'latest' || !sort) {
      sortOptions.createdAt = -1;
    } else if (sort === 'price-low-high') {
      sortOptions.price = 1;
    } else if (sort === 'price-high-low') {
      sortOptions.price = -1;
    } else if (sort === 'popularity') {
      sortOptions.rating = -1;
      sortOptions.numReviews = -1;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    
    let products = await Product.find(query)
      .populate('category')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // If sorting by price and some have salePrice, we want custom sort in memory
    // because salePrice takes precedence over price when active.
    if (sort === 'price-low-high') {
      products.sort((a, b) => {
        const pA = a.salePrice !== undefined && a.salePrice !== null ? a.salePrice : a.price;
        const pB = b.salePrice !== undefined && b.salePrice !== null ? b.salePrice : b.price;
        return pA - pB;
      });
    } else if (sort === 'price-high-low') {
      products.sort((a, b) => {
        const pA = a.salePrice !== undefined && a.salePrice !== null ? a.salePrice : a.price;
        const pB = b.salePrice !== undefined && b.salePrice !== null ? b.salePrice : b.price;
        return pB - pA;
      });
    }

    res.status(200).json({
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product by slug or ID
// @route   GET /api/products/:slug
// @access  Public
exports.getProductBySlug = async (req, res, next) => {
  try {
    const param = req.params.slug;
    let product;

    // Check if ID or Slug
    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(param).populate('category');
    } else {
      product = await Product.findOne({ slug: param }).populate('category');
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Fetch related products (same category, excluding current)
    const related = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id }
    })
      .limit(4)
      .populate('category');

    res.status(200).json({
      product,
      related
    });
  } catch (err) {
    next(err);
  }
};
