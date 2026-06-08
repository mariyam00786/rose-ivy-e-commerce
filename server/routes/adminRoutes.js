const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const {
  getStats,
  getAllOrders,
  updateOrderStatus,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllUsers,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/adminController');
const { createBlog } = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const seedData = require('../seed');
const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads/admin');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpg|jpeg|png|webp)$/i.test(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Temporary cloud seeding route
router.get('/seed-trigger', async (req, res) => {
  try {
    await seedData();
    res.json({ message: 'Cloud database seeded successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Seeding failed: ' + error.message });
  }
});

// Enforce admin-only guard for all routes below
router.use(protect, admin);

router.get('/stats', getStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);

router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.get('/users', getAllUsers);
router.post('/upload', upload.array('images', 5), (req, res) => {
  const files = Array.isArray(req.files) ? req.files : [];
  if (!files.length) {
    return res.status(400).json({ message: 'No image files were uploaded.' });
  }

  const urls = files.map(file => `/uploads/admin/${file.filename}`);
  res.status(201).json({ urls, files: files.map(file => ({ name: file.originalname, size: file.size, url: `/uploads/admin/${file.filename}` })) });
});
router.post('/blog', createBlog);

module.exports = router;
