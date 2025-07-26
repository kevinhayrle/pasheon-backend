const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// 🔄 Test route
router.get('/test', (req, res) => {
  res.json({ message: '✅ Product route is working!' });
});

// ➕ Add a new product (POST /api/products)
router.post('/', productController.addProduct);

// 📦 Get all products (GET /api/products)
router.get('/', productController.getAllProducts);

router.get('/filter/categories', productController.getCategories);

// 🔍 Get a single product by ID
router.get('/:id', productController.getProductById);

// ✏ Update a product
router.put('/:id', productController.updateProduct);

// ❌ Delete a product
router.delete('/:id', productController.deleteProduct);

module.exports = router;