const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { adminLogin } = require('../controllers/adminAuthController');
const {
  getAllProducts,
  deleteProduct,
  addProduct,
} = require('../controllers/adminProductController');

// Admin login
router.post('/login', adminLogin);

// Get all products (protected)
router.get('/products', verifyToken, getAllProducts);

// Delete product by ID (protected)
router.delete('/delete/:id', verifyToken, deleteProduct);

// Add new product (protected)
router.post('/add', verifyToken, addProduct);

router.put('/update/:id', verifyToken, updateProduct);

module.exports = router;