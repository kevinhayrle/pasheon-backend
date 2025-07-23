// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// ➕ Add a new product
router.post('/add', productController.addProduct);

// 📦 Get all products
router.get('/all', productController.getAllProducts);

// 🔍 Get a single product by ID
router.get('/:id', productController.getProductById);

// ✏ Update a product by ID
router.put('/update/:id', productController.updateProduct);

// ❌ Delete a product by ID
router.delete('/delete/:id', productController.deleteProduct);

module.exports = router;