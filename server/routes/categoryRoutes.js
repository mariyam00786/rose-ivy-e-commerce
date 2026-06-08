const express = require('express');
const { getCategories, getCategoryProducts } = require('../controllers/categoryController');
const router = express.Router();

router.get('/', getCategories);
router.get('/:slug/products', getCategoryProducts);

module.exports = router;
