const db = require('../db');

// GET: Fetch all products
const getAllProducts = (req, res) => {
  const sql = 'SELECT * FROM products';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Failed to fetch products:', err);
      return res.status(500).json({ message: 'Error retrieving products' });
    }
    res.json(results);
  });
};

// DELETE: Remove a product by ID
const deleteProduct = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM products WHERE product_id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('❌ Failed to delete product:', err);
      return res.status(500).json({ message: 'Error deleting product' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: '✅ Product deleted successfully' });
  });
};

// POST: Add a new product
const addProduct = (req, res) => {
  const { name, price, category, image } = req.body;

  if (!name || !price || !category || !image) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = 'INSERT INTO products (name, price, category, image) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, price, category, image], (err, result) => {
    if (err) {
      console.error('❌ Failed to add product:', err);
      return res.status(500).json({ message: 'Error adding product' });
    }

    res.status(201).json({ message: '✅ Product added successfully', productId: result.insertId });
  });
};

module.exports = {
  getAllProducts,
  deleteProduct,
  addProduct,
};