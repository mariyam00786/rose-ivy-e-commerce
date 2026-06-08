const express = require('express');
const { getCart, addToCart, updateCart, removeFromCart, clearCart, syncCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getCart);
router.post('/', protect, addToCart);
router.put('/', protect, updateCart);
router.delete('/:productId', protect, removeFromCart);
router.delete('/', protect, clearCart);
router.post('/sync', protect, syncCart);

module.exports = router;
