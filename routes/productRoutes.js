const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/test', (req, res) => {
  res.json({ message: '✅ Product test route works!' });
});

// ➕ Add a new product
router.post('/', productController.addProduct); // POST /api/products

// 📦 Get all products
router.get('/', productController.getAllProducts); // GET /api/products

router.get('/test', (req, res) => {
  res.send('Products route is working ✅');
});

// 🔍 Get a single product by ID
router.get('/:id', productController.getProductById); // GET /api/products/:id

// ✏ Update a product
router.put('/:id', productController.updateProduct); // PUT /api/products/:id

// ❌ Delete a product
router.delete('/:id', productController.deleteProduct); // DELETE /api/products/:id

module.exports = router;