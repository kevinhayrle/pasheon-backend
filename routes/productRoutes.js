const express = require('express');
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  getProductById,
  getCategories,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// 🔄 Test route
router.get('/test', (req, res) => {
  res.json({ message: '✅ Product route is working!' });
});

// ➕ Add a new product (POST /api/products)
router.post('/', addProduct);

// 📦 Get all products (GET /api/products)
router.get('/', getAllProducts);

// 📂 Get all unique product categories
router.get('/filter/categories', getCategories);

// 🔍 Get a single product by ID
router.get('/:id', getProductById);

// ✏ Update a product
router.put('/:id', updateProduct);

// ❌ Delete a product
router.delete('/:id', deleteProduct);

module.exports = router;